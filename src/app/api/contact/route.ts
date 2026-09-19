import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!name || !phone || !subject || !message) {
    return NextResponse.json({ error: "لطفاً همهٔ فیلدها را تکمیل کنید." }, { status: 400 });
  }

  await prisma.contactMessage.create({ data: { name, phone, subject, message } });

  return NextResponse.json({ ok: true });
}
