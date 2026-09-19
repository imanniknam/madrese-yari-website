"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { FieldGroup, Input } from "@/components/ui/field";

const PHONE_RE = /^09\d{9}$/;

export default function AdminLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!PHONE_RE.test(phone)) {
      setError("شمارهٔ موبایل را به‌درستی وارد کنید.");
      return;
    }
    if (!password) {
      setError("رمز عبور را وارد کنید.");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn("admin", { phone, password, redirect: false });
      if (result?.error) {
        setError("شمارهٔ موبایل یا رمز عبور اشتباه است، یا این حساب دسترسی مدیریتی ندارد.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-950 py-12">
      <Container className="flex justify-center">
        <div className="w-full max-w-sm rounded-card border border-white/10 bg-brand-900 p-6 sm:p-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500 text-ink-900">
              <ShieldCheck size={18} />
            </span>
            <div>
              <h1 className="text-base font-extrabold text-white">ورود پنل مدیریت</h1>
              <p className="text-xs text-white/50">مدرسه‌یاری</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <FieldGroup label="شمارهٔ موبایل مدیر">
              <Input
                inputMode="numeric"
                placeholder="۰۹۱۲xxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoFocus
                className="bg-brand-950 text-white placeholder:text-white/30 border-white/10"
              />
            </FieldGroup>
            <FieldGroup label="رمز عبور">
              <Input
                type="password"
                placeholder="رمز عبور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-brand-950 text-white placeholder:text-white/30 border-white/10"
              />
            </FieldGroup>
            {error && <p className="text-xs font-medium text-red-400">{error}</p>}
            <Button type="submit" size="lg" variant="gold" className="w-full" disabled={loading}>
              {loading ? "در حال ورود..." : "ورود به پنل مدیریت"}
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-white/40">این صفحه فقط برای مدیران سایت است.</p>
        </div>
      </Container>
    </div>
  );
}
