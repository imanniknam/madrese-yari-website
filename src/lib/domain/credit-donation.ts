import { prisma } from "@/lib/prisma";
import { ContributionError, grantCreditFromDonation } from "./contribute-to-need";
import { tomanToTokens } from "@/lib/utils";

export type DonateCreditInput = {
  donorUserId: string;
  amountToman: number;
  target: "pool" | "code";
  studentCode?: string;
  idempotencyKey: string;
};

// Resolves the target student for a cash-to-credit donation: either a specific student
// looked up by their referral code, or — for the public pool — whichever student
// currently has the lowest credit balance (oldest profile breaks ties).
async function resolveTargetStudent(input: DonateCreditInput) {
  if (input.target === "code") {
    const code = input.studentCode?.trim().toUpperCase();
    if (!code) throw new ContributionError("MISSING_STUDENT_CODE", "کد دانش‌آموز را وارد کنید.");
    const student = await prisma.studentProfile.findUnique({ where: { code } });
    if (!student) throw new ContributionError("STUDENT_NOT_FOUND", "دانش‌آموزی با این کد پیدا نشد.");
    return student;
  }

  const student = await prisma.studentProfile.findFirst({ orderBy: [{ creditBalance: "asc" }, { id: "asc" }] });
  if (!student) throw new ContributionError("NO_STUDENTS", "در حال حاضر دانش‌آموزی برای دریافت اعتبار ثبت نشده است.");
  return student;
}

export async function donateCredit(input: DonateCreditInput) {
  if (!input.amountToman || input.amountToman <= 0) {
    throw new ContributionError("INVALID_AMOUNT", "مبلغ کمک نامعتبر است.");
  }

  const student = await resolveTargetStudent(input);
  const tokensGranted = tomanToTokens(input.amountToman);

  return grantCreditFromDonation({
    donorUserId: input.donorUserId,
    amountToman: input.amountToman,
    tokensGranted,
    targetStudentId: student.id,
    idempotencyKey: input.idempotencyKey,
  });
}
