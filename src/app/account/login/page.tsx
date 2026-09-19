"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { FieldGroup, Input } from "@/components/ui/field";

const PHONE_RE = /^09\d{9}$/;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/account";

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!PHONE_RE.test(phone)) {
      setError("شمارهٔ موبایل را به‌درستی وارد کنید (مثل ۰۹۱۲xxxxxxx).");
      return;
    }
    if (!password) {
      setError("رمز عبور را وارد کنید.");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn("password", { phone, password, redirect: false });
      if (result?.error) {
        setError("شمارهٔ موبایل یا رمز عبور اشتباه است.");
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-sm rounded-card border border-brand-100 bg-white p-6 sm:p-8">
        <h1 className="text-lg font-extrabold text-ink-900">ورود به مدرسه‌یاری</h1>
        <p className="mt-1 text-sm text-ink-500">با شمارهٔ موبایل و رمز عبور خود وارد شوید.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <FieldGroup label="شمارهٔ موبایل">
            <Input
              inputMode="numeric"
              placeholder="۰۹۱۲xxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoFocus
            />
          </FieldGroup>
          <FieldGroup label="رمز عبور">
            <Input
              type="password"
              placeholder="رمز عبور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FieldGroup>
          {error && <p className="text-xs font-medium text-red-600">{error}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "در حال ورود..." : "ورود"}
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-ink-500">
          حساب کاربری ندارید؟{" "}
          <Link href="/account/register" className="font-bold text-brand-700 hover:underline">
            ثبت‌نام کنید
          </Link>
        </p>
      </div>
    </Container>
  );
}
