// Dev-only in-memory OTP store. Swap for Redis (or a DB table with a TTL index) in production —
// an in-memory Map does not survive server restarts or work across multiple instances.
const otps = new Map<string, { code: string; expiresAt: number }>();

const OTP_TTL_MS = 2 * 60 * 1000;

export function issueOtp(phone: string): string {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  otps.set(phone, { code, expiresAt: Date.now() + OTP_TTL_MS });
  return code;
}

export function verifyOtp(phone: string, code: string): boolean {
  const entry = otps.get(phone);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    otps.delete(phone);
    return false;
  }
  const valid = entry.code === code;
  if (valid) otps.delete(phone); // one-time use
  return valid;
}
