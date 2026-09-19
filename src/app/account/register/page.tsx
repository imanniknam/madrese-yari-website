"use client";

import { useEffect, useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { FieldGroup, Input, Select } from "@/components/ui/field";

const PHONE_RE = /^09\d{9}$/;

type Role = "CUSTOMER" | "DONOR" | "STUDENT" | "SCHOOL";

const ROLE_OPTIONS: { value: Role; label: string; desc: string }[] = [
  { value: "CUSTOMER", label: "کاربر عادی", desc: "فقط می‌خواهم از فروشگاه خرید کنم" },
  { value: "DONOR", label: "خیر", desc: "می‌خواهم در تأمین نیازها مشارکت کنم" },
  { value: "STUDENT", label: "دانش‌آموز", desc: "دانش‌آموز یکی از مدارس عضو هستم" },
  { value: "SCHOOL", label: "مدرسه", desc: "نمایندهٔ یک مدرسه هستم" },
];

const provinces = ["تهران", "اصفهان", "سیستان و بلوچستان", "خراسان جنوبی", "کردستان", "خوزستان", "لرستان", "گلستان"];
const schoolLevels = ["ابتدایی", "متوسطه اول", "متوسطه دوم"];

type School = { id: string; name: string; city: string; province: string };

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/account";

  const [role, setRole] = useState<Role>("CUSTOMER");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Student-only
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolId, setSchoolId] = useState("");
  const [grade, setGrade] = useState("");

  // School-only
  const [schoolName, setSchoolName] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [level, setLevel] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (role !== "STUDENT" || schools.length > 0) return;
    fetch("/api/schools/list")
      .then((res) => res.json())
      .then((data) => setSchools(data.schools ?? []))
      .catch(() => setSchools([]));
  }, [role, schools.length]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setError("نام و نام خانوادگی را وارد کنید.");
      return;
    }
    if (!PHONE_RE.test(phone)) {
      setError("شمارهٔ موبایل را به‌درستی وارد کنید (مثل ۰۹۱۲xxxxxxx).");
      return;
    }
    if (password.length < 6) {
      setError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
      return;
    }
    if (password !== confirmPassword) {
      setError("تکرار رمز عبور با رمز عبور یکسان نیست.");
      return;
    }
    if (role === "STUDENT" && (!schoolId || !grade.trim())) {
      setError("مدرسه و پایهٔ تحصیلی خود را مشخص کنید.");
      return;
    }
    if (role === "SCHOOL" && (!schoolName.trim() || !province || !city.trim() || !address.trim() || !level)) {
      setError("همهٔ اطلاعات مدرسه را تکمیل کنید.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          password,
          role,
          schoolId,
          grade,
          schoolName,
          province,
          city,
          address,
          level,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "ثبت‌نام با خطا مواجه شد.");
        return;
      }

      const result = await signIn("password", { phone, password, redirect: false });
      if (result?.error) {
        setError("ثبت‌نام انجام شد اما ورود خودکار ناموفق بود؛ لطفاً وارد شوید.");
        router.push("/account/login");
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
      <div className="w-full max-w-lg rounded-card border border-brand-100 bg-white p-6 sm:p-8">
        <h1 className="text-lg font-extrabold text-ink-900">ثبت‌نام در مدرسه‌یاری</h1>
        <p className="mt-1 text-sm text-ink-500">نقش خود را انتخاب کنید تا حساب مناسب برایتان ساخته شود.</p>

        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {ROLE_OPTIONS.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRole(r.value)}
              className={
                role === r.value
                  ? "rounded-xl border-2 border-brand-600 bg-brand-50 p-3 text-center"
                  : "rounded-xl border border-brand-100 bg-white p-3 text-center hover:border-brand-300"
              }
            >
              <span className="block text-[13px] font-bold text-ink-900">{r.label}</span>
              <span className="mt-1 block text-[10.5px] leading-4 text-ink-500">{r.desc}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="نام">
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} autoFocus />
            </FieldGroup>
            <FieldGroup label="نام خانوادگی">
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </FieldGroup>
          </div>
          <FieldGroup label="شمارهٔ موبایل">
            <Input
              inputMode="numeric"
              placeholder="۰۹۱۲xxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </FieldGroup>
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="رمز عبور">
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FieldGroup>
            <FieldGroup label="تکرار رمز عبور">
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </FieldGroup>
          </div>

          {role === "STUDENT" && (
            <div className="grid gap-4 rounded-xl border border-brand-100 bg-brand-50/40 p-4 sm:grid-cols-2">
              <FieldGroup label="مدرسه" className="sm:col-span-2">
                <Select value={schoolId} onChange={(e) => setSchoolId(e.target.value)}>
                  <option value="" disabled>
                    انتخاب مدرسه
                  </option>
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.city}
                    </option>
                  ))}
                </Select>
              </FieldGroup>
              <FieldGroup label="پایهٔ تحصیلی">
                <Input placeholder="مثلاً پنجم ابتدایی" value={grade} onChange={(e) => setGrade(e.target.value)} />
              </FieldGroup>
            </div>
          )}

          {role === "SCHOOL" && (
            <div className="grid gap-4 rounded-xl border border-brand-100 bg-brand-50/40 p-4 sm:grid-cols-2">
              <FieldGroup label="نام مدرسه" className="sm:col-span-2">
                <Input placeholder="مثلاً دبستان امید فردا" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
              </FieldGroup>
              <FieldGroup label="استان">
                <Select value={province} onChange={(e) => setProvince(e.target.value)}>
                  <option value="" disabled>
                    انتخاب استان
                  </option>
                  {provinces.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </Select>
              </FieldGroup>
              <FieldGroup label="شهر">
                <Input placeholder="نام شهر" value={city} onChange={(e) => setCity(e.target.value)} />
              </FieldGroup>
              <FieldGroup label="مقطع تحصیلی">
                <Select value={level} onChange={(e) => setLevel(e.target.value)}>
                  <option value="" disabled>
                    انتخاب کنید
                  </option>
                  {schoolLevels.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </Select>
              </FieldGroup>
              <FieldGroup label="آدرس">
                <Input placeholder="آدرس مدرسه" value={address} onChange={(e) => setAddress(e.target.value)} />
              </FieldGroup>
              <p className="text-[11px] leading-5 text-ink-500 sm:col-span-2">
                پس از ثبت‌نام، پروفایل مدرسهٔ شما تا تأیید تیم مدرسه‌یاری در حالت «در انتظار تأیید» باقی می‌ماند.
              </p>
            </div>
          )}

          {error && <p className="text-xs font-medium text-red-600">{error}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "در حال ثبت‌نام..." : "ثبت‌نام و ورود"}
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-ink-500">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link href="/account/login" className="font-bold text-brand-700 hover:underline">
            وارد شوید
          </Link>
        </p>
      </div>
    </Container>
  );
}
