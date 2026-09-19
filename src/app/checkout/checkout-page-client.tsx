"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Coins, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Stepper } from "@/components/domain/stepper";
import { FieldGroup, Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { formatToman, formatTokens, tomanToTokens } from "@/lib/utils";
import { useCartStore, useCartHydrated, type CartState } from "@/store/cart-store";

const BUYER_TYPES: { label: string; value: CartState["buyerType"] }[] = [
  { label: "خریدار عادی", value: "donor" },
  { label: "دانش‌آموز", value: "student" },
  { label: "مدرسه", value: "school" },
];

const BUYER_TYPE_TO_API: Record<CartState["buyerType"], "DONOR" | "STUDENT" | "SCHOOL"> = {
  donor: "DONOR",
  student: "STUDENT",
  school: "SCHOOL",
};

type PaymentMethodUi = "ONLINE_GATEWAY" | "STUDENT_TOKEN";

type StudentProfileState =
  | { status: "idle" | "loading" }
  | { status: "loaded"; id: string; creditBalance: number }
  | { status: "error"; message: string };

type ShippingForm = {
  recipientName: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
};

export function CheckoutPageClient() {
  const router = useRouter();
  const hydrated = useCartHydrated();
  const lines = useCartStore((s) => s.lines);
  const buyerType = useCartStore((s) => s.buyerType);
  const setBuyerType = useCartStore((s) => s.setBuyerType);
  const clearCart = useCartStore((s) => s.clear);

  const [shipping, setShipping] = useState<ShippingForm>({
    recipientName: "",
    phone: "",
    province: "",
    city: "",
    address: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodUi>("ONLINE_GATEWAY");
  const [studentProfile, setStudentProfile] = useState<StudentProfileState>({ status: "idle" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Placing an order clears the cart, which would otherwise immediately trigger the
  // empty-cart redirect below before the navigation to the success page lands.
  const orderPlacedRef = useRef(false);

  useEffect(() => {
    if (hydrated && lines.length === 0 && !orderPlacedRef.current) {
      router.replace("/cart");
    }
  }, [hydrated, lines.length, router]);

  useEffect(() => {
    if (studentProfile.status !== "loading") return;
    let cancelled = false;
    fetch("/api/account/student-profile")
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (cancelled) return;
        if (!res.ok) {
          setStudentProfile({ status: "error", message: data?.error ?? "بررسی اعتبار با خطا مواجه شد." });
          return;
        }
        setStudentProfile({ status: "loaded", id: data.id, creditBalance: data.creditBalance });
      })
      .catch(() => {
        if (!cancelled) setStudentProfile({ status: "error", message: "بررسی اعتبار با خطا مواجه شد." });
      });
    return () => {
      cancelled = true;
    };
  }, [studentProfile.status]);

  if (!hydrated || lines.length === 0) {
    return <Container className="py-16 sm:py-24">{null}</Container>;
  }

  const subtotal = lines.reduce((s, l) => s + l.unitPriceToman * l.qty, 0);
  const total = subtotal;
  const requiredTokens = lines.reduce((s, l) => s + (l.unitTokenPrice ?? 0) * l.qty, 0);

  const hasEnoughCredit = studentProfile.status === "loaded" && studentProfile.creditBalance >= requiredTokens;
  const remainingTokens = studentProfile.status === "loaded" ? studentProfile.creditBalance - requiredTokens : 0;

  const tokenPaymentBlocked =
    paymentMethod === "STUDENT_TOKEN" &&
    (studentProfile.status !== "loaded" || !hasEnoughCredit);

  async function handleSubmit() {
    setSubmitError(null);

    if (!shipping.recipientName || !shipping.phone || !shipping.province || !shipping.city || !shipping.address) {
      setSubmitError("لطفاً اطلاعات تحویل را کامل کنید.");
      return;
    }
    if (paymentMethod === "STUDENT_TOKEN" && studentProfile.status !== "loaded") {
      setSubmitError("اعتبار شما هنوز بررسی نشده است.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerType: BUYER_TYPE_TO_API[buyerType],
          paymentMethod,
          items: lines.map((l) => ({ productId: l.productId, qty: l.qty })),
          shippingAddress: shipping,
        }),
      });

      if (res.status === 401) {
        router.push("/account/login?callbackUrl=/checkout");
        return;
      }

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setSubmitError(data?.error ?? "ثبت سفارش با خطا مواجه شد.");
        return;
      }

      orderPlacedRef.current = true;
      clearCart();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }
      router.push(`/checkout/success?order=${data.order.orderNumber}`);
    } catch {
      setSubmitError("ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container className="py-8 sm:py-10">
      <h1 className="text-2xl font-extrabold text-ink-900">تسویه‌حساب</h1>
      <p className="mt-1 text-sm text-ink-500">اقلام انتخاب‌شده را بررسی کنید و به ثبت سفارش ادامه دهید.</p>

      <div className="mt-8 max-w-2xl">
        <Stepper steps={["سبد خرید", "اطلاعات سفارش", "پرداخت", "تأیید"]} current={1} />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <div className="rounded-card border border-brand-100 bg-white p-6">
            <h2 className="text-sm font-bold text-ink-900">شما به‌عنوان چه کسی سفارش می‌دهید؟</h2>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {BUYER_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setBuyerType(t.value)}
                  className={
                    buyerType === t.value
                      ? "rounded-xl bg-brand-700 py-2.5 text-xs font-bold text-white"
                      : "rounded-xl border border-brand-100 py-2.5 text-xs font-medium text-ink-700 hover:border-brand-300"
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>

            <h2 className="mt-6 text-sm font-bold text-ink-900">اطلاعات تحویل</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <FieldGroup label="نام گیرنده">
                <Input
                  placeholder="نام و نام خانوادگی"
                  value={shipping.recipientName}
                  onChange={(e) => setShipping((s) => ({ ...s, recipientName: e.target.value }))}
                />
              </FieldGroup>
              <FieldGroup label="شمارهٔ تماس">
                <Input
                  inputMode="numeric"
                  placeholder="۰۹۱۲xxxxxxx"
                  value={shipping.phone}
                  onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))}
                />
              </FieldGroup>
              <FieldGroup label="استان">
                <Select
                  value={shipping.province}
                  onChange={(e) => setShipping((s) => ({ ...s, province: e.target.value }))}
                >
                  <option value="" disabled>
                    انتخاب استان
                  </option>
                  <option>تهران</option>
                  <option>اصفهان</option>
                </Select>
              </FieldGroup>
              <FieldGroup label="شهر">
                <Input
                  placeholder="نام شهر"
                  value={shipping.city}
                  onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))}
                />
              </FieldGroup>
              <FieldGroup label="آدرس تحویل" className="sm:col-span-2">
                <Textarea
                  rows={3}
                  placeholder="آدرس کامل پستی..."
                  value={shipping.address}
                  onChange={(e) => setShipping((s) => ({ ...s, address: e.target.value }))}
                />
              </FieldGroup>
              <FieldGroup label="کد پستی">
                <Input
                  inputMode="numeric"
                  placeholder="۱۰ رقم"
                  value={shipping.postalCode}
                  onChange={(e) => setShipping((s) => ({ ...s, postalCode: e.target.value }))}
                />
              </FieldGroup>
            </div>
          </div>

          <div className="rounded-card border border-brand-100 bg-white p-6">
            <h2 className="text-sm font-bold text-ink-900">روش پرداخت را انتخاب کنید</h2>
            <p className="mt-1 text-xs text-ink-500">روش‌ها متناسب با نوع کاربر شما نمایش داده می‌شوند.</p>

            <div className="mt-4 space-y-3">
              <label
                className={
                  paymentMethod === "ONLINE_GATEWAY"
                    ? "flex cursor-pointer items-center justify-between rounded-xl border border-brand-200 bg-brand-50 p-4"
                    : "flex cursor-pointer items-center justify-between rounded-xl border border-brand-100 p-4"
                }
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-700">
                    <CreditCard size={18} />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-ink-900">پرداخت آنلاین</span>
                    <span className="block text-xs text-ink-500">پرداخت مبلغ سفارش از طریق درگاه آنلاین زرین‌پال</span>
                  </span>
                </span>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "ONLINE_GATEWAY"}
                  onChange={() => setPaymentMethod("ONLINE_GATEWAY")}
                  className="accent-brand-600"
                />
              </label>

              <div className="rounded-xl border border-brand-100">
                <label className="flex cursor-pointer items-center justify-between p-4">
                  <span className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-100 text-gold-600">
                      <Coins size={18} />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-ink-900">پرداخت با اعتبار مدرسه‌یاری</span>
                      <span className="block text-xs text-ink-500">فقط برای حساب‌های دانش‌آموزی و مدارس فعال است</span>
                    </span>
                  </span>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "STUDENT_TOKEN"}
                    onChange={() => {
                      setPaymentMethod("STUDENT_TOKEN");
                      setStudentProfile((prev) => (prev.status === "idle" ? { status: "loading" } : prev));
                    }}
                    className="accent-brand-600"
                  />
                </label>

                {paymentMethod === "STUDENT_TOKEN" && (
                  <div className="space-y-4 border-t border-brand-100 px-4 pb-4 pt-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-brand-50 p-3 text-center">
                        <p className="text-[11px] text-ink-500">اعتبار شما</p>
                        <p className="mt-1 text-sm font-extrabold text-brand-700">
                          {studentProfile.status === "loaded"
                            ? formatTokens(studentProfile.creditBalance)
                            : studentProfile.status === "loading"
                              ? "در حال بررسی..."
                              : "—"}
                        </p>
                      </div>
                      <div className="rounded-xl bg-sand-100 p-3 text-center">
                        <p className="text-[11px] text-ink-500">اعتبار موردنیاز</p>
                        <p className="mt-1 text-sm font-extrabold text-ink-900">{formatTokens(requiredTokens)}</p>
                      </div>
                    </div>

                    {studentProfile.status === "loading" && (
                      <p className="text-xs text-ink-500">در حال بررسی اعتبار شما...</p>
                    )}

                    {studentProfile.status === "error" && (
                      <div className="space-y-3">
                        <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs leading-6 text-red-700">
                          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                          <span>{studentProfile.message}</span>
                        </div>
                        <Button type="button" size="sm" disabled className="w-full justify-center">
                          تأیید سفارش
                        </Button>
                        <ButtonLink href="/shop" size="sm" variant="secondary" className="w-full justify-center">
                          بازگشت به فروشگاه
                        </ButtonLink>
                      </div>
                    )}

                    {studentProfile.status === "loaded" && !hasEnoughCredit && (
                      <div className="space-y-3">
                        <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs leading-6 text-red-700">
                          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                          <span>اعتبار شما برای تهیه این کالا کافی نیست.</span>
                        </div>
                        <Button type="button" size="sm" disabled className="w-full justify-center">
                          تأیید سفارش
                        </Button>
                        <ButtonLink href="/shop" size="sm" variant="secondary" className="w-full justify-center">
                          بازگشت به فروشگاه
                        </ButtonLink>
                      </div>
                    )}

                    {studentProfile.status === "loaded" && hasEnoughCredit && (
                      <div className="flex items-start gap-2 rounded-xl bg-brand-50 p-3 text-xs leading-6 text-brand-800">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                        <span>
                          با این انتخاب، {formatTokens(requiredTokens)} از اعتبار شما کسر می‌شود و{" "}
                          {formatTokens(remainingTokens)} باقی می‌ماند.
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="h-fit rounded-card border border-brand-100 bg-white p-6 lg:sticky lg:top-24">
          <h2 className="text-sm font-bold text-ink-900">خلاصهٔ سفارش</h2>
          <div className="mt-4 space-y-2 text-xs text-ink-500">
            {lines.map((l) => (
              <div key={l.productId} className="flex justify-between">
                <span>
                  {l.name} × {l.qty}
                </span>
                <span>{formatToman(l.unitPriceToman * l.qty)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-brand-100 pt-4 text-sm">
            <div className="flex justify-between text-ink-600">
              <span>جمع کالاها</span>
              <span>{formatToman(subtotal)}</span>
            </div>
            <div className="flex justify-between border-t border-brand-100 pt-3 text-base font-extrabold text-ink-900">
              <span>مبلغ قابل پرداخت</span>
              <span>{formatToman(total)}</span>
            </div>
            <p className="text-[11px] text-ink-400">معادل توکنی: {formatTokens(tomanToTokens(total))}</p>
          </div>

          {submitError && <p className="mt-4 text-xs font-medium text-red-600">{submitError}</p>}

          <Button
            type="button"
            size="lg"
            onClick={handleSubmit}
            disabled={submitting || tokenPaymentBlocked}
            className="mt-5 flex w-full justify-center"
          >
            {submitting ? "در حال ثبت سفارش..." : "پرداخت و ثبت سفارش"}
          </Button>
        </div>
      </div>
    </Container>
  );
}
