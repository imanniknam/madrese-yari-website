import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStudentProfileByUserId } from "@/lib/data";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "ابتدا وارد حساب کاربری خود شوید." }, { status: 401 });
  }

  const student = await getStudentProfileByUserId(session.user.id as string);
  if (!student) {
    return NextResponse.json({ error: "این حساب پروفایل دانش‌آموزی ندارد." }, { status: 404 });
  }

  return NextResponse.json({ id: student.id, creditBalance: student.creditBalance });
}
