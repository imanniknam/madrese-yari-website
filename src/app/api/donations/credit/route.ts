import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { donateCredit } from "@/lib/domain/credit-donation";
import { ContributionError } from "@/lib/domain/contribute-to-need";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "ابتدا وارد حساب کاربری خود شوید." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const amountToman = Number(body?.amountToman);
  const target = body?.target === "code" ? "code" : "pool";
  const studentCode = typeof body?.studentCode === "string" ? body.studentCode : undefined;

  try {
    const ledgerEntry = await donateCredit({
      donorUserId: session.user.id as string,
      amountToman,
      target,
      studentCode,
      idempotencyKey: randomUUID(),
    });

    const student = await prisma.studentProfile.findUnique({
      where: { id: ledgerEntry.studentId },
      include: { school: true },
    });

    return NextResponse.json({
      ledgerEntry,
      student: student ? { grade: student.grade, city: student.city, schoolName: student.school.name } : null,
    });
  } catch (error) {
    if (error instanceof ContributionError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: 409 });
    }
    throw error;
  }
}
