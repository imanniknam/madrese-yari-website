import { NextResponse } from "next/server";
import { issueOtp } from "@/lib/auth/otp-store";
import { sendOtpSms } from "@/lib/auth/sms";

const PHONE_RE = /^09\d{9}$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const phone = body?.phone as string | undefined;

  if (!phone || !PHONE_RE.test(phone)) {
    return NextResponse.json({ error: "شمارهٔ موبایل نامعتبر است." }, { status: 400 });
  }

  const code = issueOtp(phone);
  await sendOtpSms(phone, code);

  return NextResponse.json({ ok: true });
}
