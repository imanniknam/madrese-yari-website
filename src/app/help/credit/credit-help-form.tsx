"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CoinIcon } from "@/components/illustrations/category-icons";
import { Button } from "@/components/ui/button";
import { FieldGroup, Input, Select } from "@/components/ui/field";
import { formatTokens, tomanToTokens } from "@/lib/utils";

const presetAmounts = [500_000, 1_000_000, 2_000_000, 5_000_000];

export function CreditHelpForm() {
  const router = useRouter();
  const [amount, setAmount] = useState(1_000_000);
  const [target, setTarget] = useState<"pool" | "code">("pool");
  const [studentCode, setStudentCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ schoolName: string; city: string; grade: string } | null>(null);

  async function handleSubmit() {
    setError(null);

    if (!amount || amount <= 0) {
      setError("مبلغ کمک را به‌درستی وارد کنید.");
      return;
    }
    if (target === "code" && !studentCode.trim()) {
      setError("کد دانش‌آموز را وارد کنید.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/donations/credit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountToman: amount, target, studentCode }),
      });

      if (res.status === 401) {
        router.push("/account/login?callbackUrl=/help/credit");
        return;
      }

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "ثبت کمک با خطا مواجه شد.");
        return;
      }

      setResult(data.student);
    } catch {
      setError("ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className="rounded-xl bg-brand-50 p-5 text-sm leading-7 text-brand-800">
        <p className="font-bold">اعتبار شما با موفقیت ثبت شد. سپاسگزاریم!</p>
        <p className="mt-1">
          این اعتبار به یک دانش‌آموز پایهٔ {result.grade} در {result.city} ({result.schoolName}) اختصاص یافت.
        </p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-base font-bold text-ink-900">مبلغ کمک خود را مشخص کنید</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {presetAmounts.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAmount(a)}
            className={
              amount === a
                ? "rounded-xl bg-brand-700 py-3 text-sm font-bold text-white"
                : "rounded-xl border border-brand-100 bg-white py-3 text-sm font-bold text-ink-700 hover:border-brand-300"
            }
          >
            {new Intl.NumberFormat("fa-IR").format(a)}
          </button>
        ))}
      </div>

      <FieldGroup label="یا مبلغ دلخواه (تومان)" className="mt-5">
        <Input
          type="text"
          inputMode="numeric"
          placeholder="مثلاً ۱٬۵۰۰٬۰۰۰"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value.replace(/\D/g, "")) || 0)}
        />
      </FieldGroup>

      <FieldGroup label="این اعتبار را برای چه کسی می‌خواهید؟" className="mt-5">
        <Select value={target} onChange={(e) => setTarget(e.target.value as "pool" | "code")}>
          <option value="pool">استخر عمومی اعتبار (تخصیص به نیازمندترین دانش‌آموز)</option>
          <option value="code">یک دانش‌آموز مشخص (با کد معرفی)</option>
        </Select>
      </FieldGroup>

      {target === "code" && (
        <FieldGroup label="کد دانش‌آموز" className="mt-4">
          <Input
            placeholder="مثلاً STU-100002"
            value={studentCode}
            onChange={(e) => setStudentCode(e.target.value)}
          />
        </FieldGroup>
      )}

      <div className="mt-6 rounded-2xl bg-brand-50 p-4">
        <div className="flex items-center gap-2">
          <span className="text-gold-600">
            <CoinIcon width={18} height={18} />
          </span>
          <p className="text-sm font-bold text-ink-900">این مبلغ معادل حدود {formatTokens(tomanToTokens(amount))} خواهد بود.</p>
        </div>
        <p className="mt-1 text-xs leading-6 text-ink-500">
          نرخ تبدیل بر اساس قیمت میانگین کالاهای واجد شرایط محاسبه می‌شود.
        </p>
      </div>

      {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}

      <Button size="lg" className="mt-6 w-full" onClick={handleSubmit} disabled={loading}>
        {loading ? "در حال ثبت..." : "ادامه و پرداخت"}
      </Button>
    </>
  );
}
