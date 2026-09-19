import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function randomRequestCode() {
  return String(Math.floor(10_000_000 + Math.random() * 89_999_999));
}

// Wide enough (~90M possibilities) that guessing a code isn't practical, with a
// collision-retry loop since it's not derived from anything else unique.
async function generateUniqueRequestCode() {
  for (let i = 0; i < 5; i++) {
    const code = randomRequestCode();
    const exists = await prisma.schoolNeedRequest.findUnique({ where: { code } });
    if (!exists) return code;
  }
  throw new Error("Could not generate a unique school need request code");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const {
    schoolName,
    schoolCode,
    province,
    city,
    contactName,
    contactPhone,
    needType,
    itemTitle,
    itemQty,
    description,
  } = body ?? {};

  if (!schoolName || !province || !city || !contactName || !contactPhone || !needType || !itemTitle || !itemQty || !description) {
    return NextResponse.json({ error: "همهٔ فیلدهای الزامی را تکمیل کنید." }, { status: 400 });
  }

  const qty = Number(itemQty);
  if (!Number.isFinite(qty) || qty <= 0) {
    return NextResponse.json({ error: "تعداد موردنیاز نامعتبر است." }, { status: 400 });
  }

  const request_ = await prisma.schoolNeedRequest.create({
    data: {
      code: await generateUniqueRequestCode(),
      schoolName,
      schoolCode: schoolCode || undefined,
      province,
      city,
      contactName,
      contactPhone,
      needType,
      itemTitle,
      itemQty: qty,
      description,
    },
  });

  return NextResponse.json({ code: request_.code });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "کد درخواست را وارد کنید." }, { status: 400 });
  }

  // Only the fields the public tracking page needs are ever returned — contact info,
  // address, and internal description must never leak to anyone who guesses a code.
  const found = await prisma.schoolNeedRequest.findUnique({
    where: { code },
    select: { code: true, status: true, schoolName: true, itemTitle: true, itemQty: true, reviewerNote: true },
  });
  if (!found) {
    return NextResponse.json({ error: "درخواستی با این کد پیدا نشد." }, { status: 404 });
  }

  return NextResponse.json({ request: found });
}
