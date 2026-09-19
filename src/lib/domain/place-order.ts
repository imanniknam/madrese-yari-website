import { prisma } from "@/lib/prisma";
import { BuyerType, OrderStatus, PaymentMethod, TokenLedgerReason, Prisma } from "@prisma/client";
import { ContributionError } from "./contribute-to-need";

export type PlaceOrderInput = {
  userId: string;
  buyerType: BuyerType;
  paymentMethod: PaymentMethod;
  items: { productId: string; qty: number }[];
  shippingAddress: Prisma.InputJsonValue;
  shippingToman?: number;
  idempotencyKey: string;
};

// Server-side order creation. Price and stock are always re-read from the DB here —
// never trusted from the client payload (docs/02-data-model.md business rule #1).
export async function placeOrder(input: PlaceOrderInput) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.order.findUnique({ where: { idempotencyKey: input.idempotencyKey } });
    if (existing) return existing;

    const products = await tx.product.findMany({ where: { id: { in: input.items.map((i) => i.productId) } } });
    const productById = new Map(products.map((p) => [p.id, p]));

    let subtotalToman = 0;
    let totalTokens = 0;
    const orderItemsData = input.items.map(({ productId, qty }) => {
      const product = productById.get(productId);
      if (!product) throw new ContributionError("PRODUCT_NOT_FOUND", "یکی از کالاهای سبد خرید یافت نشد.");
      if (product.stockStatus === "OUT_OF_STOCK") {
        throw new ContributionError("OUT_OF_STOCK", `کالای «${product.name}» در حال حاضر ناموجود است.`);
      }
      if (product.stockQty < qty) {
        throw new ContributionError("INSUFFICIENT_STOCK", `موجودی کالای «${product.name}» کافی نیست.`);
      }

      const unitPriceSnapshot = product.priceToman;
      const unitTokenPriceSnapshot = product.creditPriceTokens ?? undefined;
      subtotalToman += unitPriceSnapshot * qty;
      if (unitTokenPriceSnapshot) totalTokens += unitTokenPriceSnapshot * qty;

      return {
        productId,
        nameSnapshot: product.name,
        qty,
        unitPriceSnapshot,
        unitTokenPriceSnapshot,
        totalPriceSnapshot: unitPriceSnapshot * qty,
      };
    });

    const shippingToman = input.shippingToman ?? 0;
    const totalToman = subtotalToman + shippingToman;

    // Student-token payment: verify and deduct atomically inside the same transaction as
    // order creation, so a failed order never leaves tokens deducted (business rule #4).
    if (input.paymentMethod === PaymentMethod.STUDENT_TOKEN) {
      // Always resolve the student profile from the authenticated user server-side —
      // never trust a client-supplied studentId, which would let one user drain another
      // student's credit balance.
      const student = await tx.studentProfile.findUnique({ where: { userId: input.userId } });
      if (!student) throw new ContributionError("STUDENT_NOT_FOUND", "پروفایل دانش‌آموزی یافت نشد.");
      if (student.creditBalance < totalTokens) {
        throw new ContributionError("INSUFFICIENT_CREDIT", "اعتبار شما برای این سفارش کافی نیست.");
      }

      const updatedStudent = await tx.studentProfile.update({
        where: { id: student.id },
        data: { creditBalance: { decrement: totalTokens } },
      });

      const order = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: input.userId,
          buyerType: input.buyerType,
          status: OrderStatus.CONFIRMED,
          paymentMethod: input.paymentMethod,
          subtotalToman,
          shippingToman,
          totalToman,
          totalTokens,
          shippingAddress: input.shippingAddress,
          idempotencyKey: input.idempotencyKey,
          items: { create: orderItemsData },
        },
      });

      await tx.tokenLedger.create({
        data: {
          studentId: student.id,
          delta: -totalTokens,
          reason: TokenLedgerReason.SPEND,
          relatedOrderId: order.id,
          balanceAfter: updatedStudent.creditBalance,
          idempotencyKey: `${input.idempotencyKey}:spend`,
        },
      });

      for (const item of input.items) {
        await tx.product.update({ where: { id: item.productId }, data: { stockQty: { decrement: item.qty } } });
      }

      return order;
    }

    // Online-gateway orders start PENDING_PAYMENT — confirmation only ever happens
    // server-side after verifying the transaction with the gateway (docs/02-data-model.md,
    // PaymentTransaction note): the browser returning from ZarinPal is never sufficient alone.
    const order = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: input.userId,
        buyerType: input.buyerType,
        status: OrderStatus.PENDING_PAYMENT,
        paymentMethod: input.paymentMethod,
        subtotalToman,
        shippingToman,
        totalToman,
        shippingAddress: input.shippingAddress,
        idempotencyKey: input.idempotencyKey,
        items: { create: orderItemsData },
      },
    });

    // Short-lived reservation so stock isn't sold twice while the buyer is on the gateway.
    await tx.inventoryReservation.createMany({
      data: input.items.map((item) => ({
        productId: item.productId,
        qty: item.qty,
        orderId: order.id,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      })),
    });

    return order;
  });
}

function generateOrderNumber() {
  const random = Math.floor(10000 + Math.random() * 89999);
  return String(random);
}
