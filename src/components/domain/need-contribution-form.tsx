"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { formatNumber, formatToman } from "@/lib/utils";

type ContributionType = "DIRECT_GOODS" | "FULL_FULFILLMENT" | "CASH_TO_CREDIT";

export function NeedContributionForm({
  needId,
  lineItemId,
  remaining,
  unit,
}: {
  needId: string;
  lineItemId: string;
  remaining: number;
  unit: string;
}) {
  const router = useRouter();
  const [type, setType] = useState<ContributionType>("DIRECT_GOODS");
  const [qty, setQty] = useState(Math.min(10, remaining) || 1);
  const [amountToman, setAmountToman] = useState(500_000);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (remaining <= 0) {
    return (
      <div className="mt-5 rounded-xl bg-brand-50 p-4 text-sm font-bold text-brand-800">
        این نیاز به‌طور کامل تأمین شده است. سپاس از همراهی شما و دیگر خیرین 🌱
      </div>
    );
  }

  if (done) {
    return (
      <div className="mt-5 rounded-xl bg-brand-50 p-4 text-sm font-bold text-brand-800">
        مشارکت شما با موفقیت ثبت شد. سپاسگزاریم!
      </div>
    );
  }

  async function handleSubmit() {
    setError(null);

    if (type === "DIRECT_GOODS" && (!qty || qty <= 0)) {
      setError("تعداد را به‌درستی وارد کنید.");
      return;
    }
    if (type === "CASH_TO_CREDIT" && (!amountToman || amountToman <= 0)) {
      setError("مبلغ را به‌درستی وارد کنید.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          needLineItemId: lineItemId,
          type,
          qty: type === "DIRECT_GOODS" ? qty : undefined,
          amountToman: type === "CASH_TO_CREDIT" ? amountToman : undefined,
        }),
      });

      if (res.status === 401) {
        router.push(`/account/login?callbackUrl=/needs/${needId}`);
        return;
      }

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "ثبت مشارکت با خطا مواجه شد.");
        return;
      }

      setDone(true);
      router.refresh();
    } catch {
      setError("ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="mt-5 space-y-3">
        <label
          className={
            type === "DIRECT_GOODS"
              ? "flex cursor-pointer items-center justify-between rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-ink-900"
              : "flex cursor-pointer items-center justify-between rounded-xl border border-brand-100 px-4 py-3 text-sm font-medium text-ink-700"
          }
        >
          <span className="flex items-center gap-2">
            <input
              type="radio"
              name="contribution"
              checked={type === "DIRECT_GOODS"}
              onChange={() => setType("DIRECT_GOODS")}
              className="accent-brand-600"
            />
            تأمین بخشی از نیاز
          </span>
        </label>
        <label
          className={
            type === "FULL_FULFILLMENT"
              ? "flex cursor-pointer items-center justify-between rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-ink-900"
              : "flex cursor-pointer items-center justify-between rounded-xl border border-brand-100 px-4 py-3 text-sm font-medium text-ink-700"
          }
        >
          <span className="flex items-center gap-2">
            <input
              type="radio"
              name="contribution"
              checked={type === "FULL_FULFILLMENT"}
              onChange={() => setType("FULL_FULFILLMENT")}
              className="accent-brand-600"
            />
            تأمین کامل باقی‌مانده ({formatNumber(remaining)} {unit})
          </span>
        </label>
        <label
          className={
            type === "CASH_TO_CREDIT"
              ? "flex cursor-pointer items-center justify-between rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-ink-900"
              : "flex cursor-pointer items-center justify-between rounded-xl border border-brand-100 px-4 py-3 text-sm font-medium text-ink-700"
          }
        >
          <span className="flex items-center gap-2">
            <input
              type="radio"
              name="contribution"
              checked={type === "CASH_TO_CREDIT"}
              onChange={() => setType("CASH_TO_CREDIT")}
              className="accent-brand-600"
            />
            کمک نقدی و تبدیل به اعتبار دانش‌آموزی
          </span>
        </label>
      </div>

      {type === "DIRECT_GOODS" && (
        <div className="mt-5 flex items-center gap-3">
          <span className="text-xs font-medium text-ink-700">تعداد:</span>
          <div className="flex h-10 flex-1 items-center rounded-full border border-brand-200">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex h-10 w-10 items-center justify-center text-brand-700"
            >
              −
            </button>
            <span className="flex-1 text-center text-sm font-bold text-ink-900">{formatNumber(qty)}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(remaining, q + 1))}
              className="flex h-10 w-10 items-center justify-center text-brand-700"
            >
              +
            </button>
          </div>
        </div>
      )}

      {type === "CASH_TO_CREDIT" && (
        <div className="mt-5">
          <span className="text-xs font-medium text-ink-700">مبلغ کمک نقدی:</span>
          <Input
            inputMode="numeric"
            value={amountToman}
            onChange={(e) => setAmountToman(Number(e.target.value.replace(/\D/g, "")) || 0)}
            className="mt-1.5"
          />
          <p className="mt-1 text-[11px] text-ink-500">{formatToman(amountToman)}</p>
        </div>
      )}

      {error && <p className="mt-3 text-xs font-medium text-red-600">{error}</p>}

      <Button size="lg" className="mt-5 w-full" onClick={handleSubmit} disabled={submitting}>
        {submitting ? "در حال ثبت..." : "مشارکت در تأمین این نیاز"}
      </Button>
    </>
  );
}
