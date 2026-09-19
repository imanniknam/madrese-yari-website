import { prisma } from "@/lib/prisma";
import { Prisma, ContributionType, NeedStatus, TokenLedgerReason } from "@prisma/client";

// Shared domain action behind all three contribution entry points in the UI:
//   1. /needs/[id]            — contributing to a specific need's line item
//   2. /help/choose-a-need    — browsing and picking any open need
//   3. /help/direct-purchase  — buying a catalog product tied to a need's line item
// All three reduce to: a user contributes cash (converted to student credit), goods, or a full
// fulfillment against one NeedLineItem. Keeping this in one place is what docs/01-site-structure.md
// calls out explicitly, so price/stock/need-completion rules are enforced exactly once.

export class ContributionError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "ContributionError";
  }
}

export type ContributeToNeedInput = {
  userId: string;
  needLineItemId: string;
  type: ContributionType;
  qty?: number;
  amountToman?: number;
};

export async function contributeToNeed(input: ContributeToNeedInput) {
  return prisma.$transaction(async (tx) => {
    // Re-read the line item + parent need inside the transaction — never trust client-sent
    // remaining quantity or price (docs/02-data-model.md, business rule #1).
    const lineItem = await tx.needLineItem.findUnique({
      where: { id: input.needLineItemId },
      include: { need: true, product: true },
    });

    if (!lineItem) {
      throw new ContributionError("NEED_LINE_ITEM_NOT_FOUND", "این قلم نیاز پیدا نشد.");
    }

    if (lineItem.need.status === "FULFILLED" || lineItem.need.status === "CLOSED") {
      throw new ContributionError("NEED_ALREADY_FULFILLED", "این نیاز قبلاً تأمین شده و دیگر قابل مشارکت نیست.");
    }

    const remaining = lineItem.qtyNeeded - lineItem.qtyFulfilled;
    if (remaining <= 0) {
      throw new ContributionError("NEED_LINE_ITEM_COMPLETE", "این قلم از نیاز قبلاً به‌طور کامل تأمین شده است.");
    }

    let qtyContributed = 0;

    if (input.type === "FULL_FULFILLMENT") {
      qtyContributed = remaining;
    } else if (input.type === "DIRECT_GOODS") {
      if (!input.qty || input.qty <= 0) {
        throw new ContributionError("INVALID_QTY", "تعداد مشارکت نامعتبر است.");
      }
      // Prevent overselling when two donors race on a near-complete need
      // (docs/02-data-model.md business rule #2 and #6).
      if (input.qty > remaining) {
        throw new ContributionError(
          "QTY_EXCEEDS_REMAINING",
          `فقط ${remaining} عدد از این قلم باقی مانده است.`
        );
      }
      qtyContributed = input.qty;
    } else if (input.type === "CASH_TO_CREDIT") {
      if (!input.amountToman || input.amountToman <= 0) {
        throw new ContributionError("INVALID_AMOUNT", "مبلغ مشارکت نامعتبر است.");
      }
      // Cash contributions don't consume a physical qty against the line item directly;
      // they're tracked by amount and reconciled separately when converted to a CreditGrant.
      qtyContributed = 0;
    }

    const contribution = await tx.contribution.create({
      data: {
        needId: lineItem.needId,
        needLineItemId: lineItem.id,
        userId: input.userId,
        type: input.type,
        qty: input.type === "DIRECT_GOODS" || input.type === "FULL_FULFILLMENT" ? qtyContributed : undefined,
        amountToman: input.type === "CASH_TO_CREDIT" ? input.amountToman : undefined,
        status: "CONFIRMED",
      },
    });

    if (qtyContributed > 0) {
      const updatedLineItem = await tx.needLineItem.update({
        where: { id: lineItem.id },
        data: { qtyFulfilled: { increment: qtyContributed } },
      });

      // Business rule #6: as soon as every line item on a need is fully covered, flip its
      // status immediately inside the same transaction so a concurrent contributor can't
      // land on an already-complete need.
      const allLineItems = await tx.needLineItem.findMany({ where: { needId: lineItem.needId } });
      const isNowComplete = allLineItems.every((li) =>
        li.id === updatedLineItem.id
          ? updatedLineItem.qtyFulfilled >= updatedLineItem.qtyNeeded
          : li.qtyFulfilled >= li.qtyNeeded
      );

      if (isNowComplete) {
        await tx.need.update({ where: { id: lineItem.needId }, data: { status: NeedStatus.FULFILLED } });
      } else {
        const ratio = allLineItems.reduce((sum, li) => sum + li.qtyFulfilled / li.qtyNeeded, 0) / allLineItems.length;
        await tx.need.update({
          where: { id: lineItem.needId },
          data: { status: ratio >= 0.85 ? NeedStatus.NEAR_COMPLETE : NeedStatus.IN_PROGRESS },
        });
      }
    }

    return contribution;
  });
}

// Converts a cash contribution into student credit, atomically and idempotently
// (docs/02-data-model.md business rules #3, #4, #7).
export async function grantCreditFromDonation(input: {
  donorUserId: string;
  amountToman: number;
  tokensGranted: number;
  targetStudentId: string;
  idempotencyKey: string;
}) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.tokenLedger.findUnique({ where: { idempotencyKey: input.idempotencyKey } });
    if (existing) return existing;

    const grant = await tx.creditGrant.create({
      data: {
        donorUserId: input.donorUserId,
        amountToman: input.amountToman,
        tokensGranted: input.tokensGranted,
        targetStudentId: input.targetStudentId,
      },
    });

    const student = await tx.studentProfile.update({
      where: { id: input.targetStudentId },
      data: { creditBalance: { increment: input.tokensGranted } },
    });

    const ledgerEntry = await tx.tokenLedger.create({
      data: {
        studentId: input.targetStudentId,
        delta: input.tokensGranted,
        reason: TokenLedgerReason.GRANT,
        relatedCreditGrantId: grant.id,
        balanceAfter: student.creditBalance,
        idempotencyKey: input.idempotencyKey,
      },
    });

    return ledgerEntry;
  });
}

export type { Prisma };
