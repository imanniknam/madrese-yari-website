// Thin SMS-sending boundary so a real provider (Kavenegar, Ghasedak, ...) can be dropped in later
// via SMS_PROVIDER_API_KEY without touching call sites. Logs to the server console in dev.
export async function sendOtpSms(phone: string, code: string) {
  if (!process.env.SMS_PROVIDER_API_KEY) {
    console.log(`[OTP][dev] پیامک به ${phone}: کد ورود شما ${code} است.`);
    return;
  }

  // TODO: wire the real provider once SMS_PROVIDER_API_KEY is configured.
  console.log(`[OTP] پیامک به ${phone}: کد ورود شما ${code} است.`);
}
