"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { FieldGroup, Input, Textarea } from "@/components/ui/field";

export function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name || !phone || !subject || !message) {
      setError("لطفاً همهٔ فیلدها را تکمیل کنید.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, subject, message }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "ارسال پیام با خطا مواجه شد.");
        return;
      }
      setDone(true);
    } catch {
      setError("ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-xl bg-brand-50 p-4 text-sm font-bold text-brand-800">
        پیام شما با موفقیت ارسال شد. تیم مدرسه‌یاری به‌زودی با شما تماس می‌گیرد.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldGroup label="نام">
          <Input placeholder="نام و نام خانوادگی" value={name} onChange={(e) => setName(e.target.value)} />
        </FieldGroup>
        <FieldGroup label="شمارهٔ تماس">
          <Input inputMode="numeric" placeholder="۰۹۱۲xxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </FieldGroup>
        <FieldGroup label="موضوع" className="sm:col-span-2">
          <Input placeholder="موضوع پیام" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </FieldGroup>
        <FieldGroup label="پیام شما" className="sm:col-span-2">
          <Textarea rows={5} placeholder="پیام خود را بنویسید..." value={message} onChange={(e) => setMessage(e.target.value)} />
        </FieldGroup>
      </div>
      {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}
      <Button size="lg" className="mt-6 w-full" disabled={loading}>
        {loading ? "در حال ارسال..." : "ارسال پیام"}
      </Button>
    </form>
  );
}
