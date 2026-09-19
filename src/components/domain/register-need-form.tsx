"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FieldGroup, Input, Select, Textarea } from "@/components/ui/field";

const provinces = ["تهران", "اصفهان", "سیستان و بلوچستان", "خراسان جنوبی", "کردستان", "خوزستان", "لرستان", "گلستان"];
const needTypes = [
  "تجهیزات کلاس",
  "وسایل کمک‌آموزشی",
  "تجهیزات آموزشی",
  "تجهیزات آزمایشگاهی",
  "تجهیزات ورزشی",
  "کتاب و منابع آموزشی",
  "سایر تجهیزات",
];

export function RegisterNeedForm({
  defaultItemTitle = "",
  defaultNeedType = "",
  submitLabel = "ثبت نیاز جدید",
}: {
  defaultItemTitle?: string;
  defaultNeedType?: string;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      schoolName: form.get("schoolName"),
      schoolCode: form.get("schoolCode"),
      province: form.get("province"),
      city: form.get("city"),
      contactName: form.get("contactName"),
      contactPhone: form.get("contactPhone"),
      needType: form.get("needType"),
      itemTitle: form.get("itemTitle"),
      itemQty: form.get("itemQty"),
      description: form.get("description"),
    };

    if (!payload.province) {
      setError("لطفاً استان را انتخاب کنید.");
      return;
    }
    if (!payload.needType) {
      setError("لطفاً نوع نیاز را انتخاب کنید.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/school-need-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "ثبت درخواست با خطا مواجه شد.");
        return;
      }
      router.push(`/schools/track-request?code=${data.code}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl rounded-card border border-brand-100 bg-white p-6 sm:p-8">
      <h2 className="text-base font-bold text-ink-900">اطلاعات مدرسه</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <FieldGroup label="نام مدرسه">
          <Input name="schoolName" placeholder="مثلاً دبستان امید فردا" required />
        </FieldGroup>
        <FieldGroup label="کد مدرسه">
          <Input name="schoolCode" placeholder="کد رسمی مدرسه" />
        </FieldGroup>
        <FieldGroup label="استان">
          <Select name="province" defaultValue="">
            <option value="" disabled>
              انتخاب استان
            </option>
            {provinces.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </Select>
        </FieldGroup>
        <FieldGroup label="شهر">
          <Input name="city" placeholder="نام شهر" required />
        </FieldGroup>
        <FieldGroup label="نام مسئول ثبت درخواست">
          <Input name="contactName" placeholder="نام و نام خانوادگی" required />
        </FieldGroup>
        <FieldGroup label="شمارهٔ تماس">
          <Input name="contactPhone" inputMode="numeric" placeholder="۰۹۱۲xxxxxxx" required />
        </FieldGroup>
      </div>

      <h2 className="mt-8 text-base font-bold text-ink-900">جزئیات نیاز</h2>
      <div className="mt-4 grid gap-4">
        <FieldGroup label="نوع نیاز">
          <Select name="needType" defaultValue={defaultNeedType}>
            <option value="" disabled>
              انتخاب کنید
            </option>
            {needTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldGroup label="عنوان کالای موردنیاز">
            <Input name="itemTitle" defaultValue={defaultItemTitle} placeholder="مثلاً تخته وایت‌برد کلاس" required />
          </FieldGroup>
          <FieldGroup label="تعداد موردنیاز">
            <Input name="itemQty" type="number" min={1} placeholder="مثلاً ۱۰" required />
          </FieldGroup>
        </div>
        <FieldGroup label="توضیح نیاز">
          <Textarea name="description" rows={4} placeholder="نیاز دقیق مدرسه، دلیل نیاز و کاربرد آن را توضیح دهید..." required />
        </FieldGroup>
      </div>

      {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}

      <Button type="submit" size="lg" className="mt-8 w-full" disabled={loading}>
        {loading ? "در حال ثبت..." : submitLabel}
      </Button>
    </form>
  );
}
