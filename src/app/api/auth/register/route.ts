import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import type { UserRole } from "@prisma/client";

const PHONE_RE = /^09\d{9}$/;
const ROLES: UserRole[] = ["CUSTOMER", "DONOR", "STUDENT", "SCHOOL"];

function randomCode(prefix: string) {
  return `${prefix}-${Math.floor(100000 + Math.random() * 899999)}`;
}

async function generateUniqueStudentCode() {
  for (let i = 0; i < 5; i++) {
    const code = randomCode("STU");
    const exists = await prisma.studentProfile.findUnique({ where: { code } });
    if (!exists) return code;
  }
  throw new Error("Could not generate a unique student code");
}

async function generateUniqueSchoolCode() {
  for (let i = 0; i < 5; i++) {
    const code = randomCode("SCH");
    const exists = await prisma.schoolProfile.findUnique({ where: { code } });
    if (!exists) return code;
  }
  throw new Error("Could not generate a unique school code");
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const firstName = typeof body?.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body?.lastName === "string" ? body.lastName.trim() : "";
  const role = ROLES.includes(body?.role) ? (body.role as UserRole) : "CUSTOMER";

  if (!PHONE_RE.test(phone)) {
    return NextResponse.json({ error: "شمارهٔ موبایل معتبر نیست." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "رمز عبور باید حداقل ۶ کاراکتر باشد." }, { status: 400 });
  }
  if (!firstName || !lastName) {
    return NextResponse.json({ error: "نام و نام خانوادگی الزامی است." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) {
    return NextResponse.json({ error: "کاربری با این شمارهٔ موبایل قبلاً ثبت‌نام کرده است." }, { status: 409 });
  }

  if (role === "STUDENT") {
    const schoolId = typeof body?.schoolId === "string" ? body.schoolId : "";
    const grade = typeof body?.grade === "string" ? body.grade.trim() : "";
    if (!schoolId || !grade) {
      return NextResponse.json({ error: "انتخاب مدرسه و پایهٔ تحصیلی الزامی است." }, { status: 400 });
    }
    const school = await prisma.schoolProfile.findUnique({ where: { id: schoolId } });
    if (!school) {
      return NextResponse.json({ error: "مدرسهٔ انتخاب‌شده پیدا نشد." }, { status: 400 });
    }

    const code = await generateUniqueStudentCode();
    await prisma.user.create({
      data: {
        phone,
        firstName,
        lastName,
        role,
        passwordHash: hashPassword(password),
        studentProfile: {
          create: { schoolId, grade, city: school.city, province: school.province, code },
        },
      },
    });
    return NextResponse.json({ ok: true });
  }

  if (role === "SCHOOL") {
    const schoolName = typeof body?.schoolName === "string" ? body.schoolName.trim() : "";
    const province = typeof body?.province === "string" ? body.province.trim() : "";
    const city = typeof body?.city === "string" ? body.city.trim() : "";
    const address = typeof body?.address === "string" ? body.address.trim() : "";
    const level = typeof body?.level === "string" ? body.level.trim() : "";
    if (!schoolName || !province || !city || !address || !level) {
      return NextResponse.json({ error: "همهٔ اطلاعات مدرسه را تکمیل کنید." }, { status: 400 });
    }

    const code = await generateUniqueSchoolCode();
    await prisma.user.create({
      data: {
        phone,
        firstName,
        lastName,
        role,
        passwordHash: hashPassword(password),
        schoolProfile: {
          create: {
            name: schoolName,
            code,
            province,
            city,
            address,
            level,
            contactName: `${firstName} ${lastName}`.trim(),
            contactPhone: phone,
            verified: false,
          },
        },
      },
    });
    return NextResponse.json({ ok: true });
  }

  await prisma.user.create({
    data: { phone, firstName, lastName, role, passwordHash: hashPassword(password) },
  });

  return NextResponse.json({ ok: true });
}
