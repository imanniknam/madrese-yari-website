"use client";

import { Trash2, ShoppingCart } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { IconTile } from "@/components/illustrations/icon-tile";
import { productIconMap } from "@/components/domain/product-thumb";
import { formatToman, formatNumber } from "@/lib/utils";
import { useCartStore, useCartHydrated } from "@/store/cart-store";
import type { Product } from "@/lib/mock-data";

export function CartPageClient() {
  const hydrated = useCartHydrated();
  const lines = useCartStore((s) => s.lines);
  const setQty = useCartStore((s) => s.setQty);
  const removeLine = useCartStore((s) => s.removeLine);

  // Until the persisted cart rehydrates from localStorage, we don't yet know the real
  // contents — render nothing rather than flashing an incorrect empty state.
  if (!hydrated) {
    return <Container className="py-16 sm:py-24">{null}</Container>;
  }

  if (lines.length === 0) {
    return (
      <Container className="py-16 sm:py-24">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <IconTile tone="brand" className="h-20 w-20 rounded-3xl">
            <ShoppingCart size={32} />
          </IconTile>
          <h1 className="mt-6 text-xl font-extrabold text-ink-900">سبد خرید شما خالی است.</h1>
          <p className="mt-2 text-sm leading-7 text-ink-500">هنوز کالایی به سبد خرید اضافه نکرده‌اید.</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/shop" size="lg">
              رفتن به فروشگاه
            </ButtonLink>
            <ButtonLink href="/needs" size="lg" variant="secondary">
              مشاهده تجهیزات مدارس
            </ButtonLink>
          </div>
        </div>
      </Container>
    );
  }

  const subtotal = lines.reduce((s, l) => s + l.unitPriceToman * l.qty, 0);

  return (
    <Container className="py-8 sm:py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900">سبد خرید</h1>
          <p className="mt-1 text-sm text-ink-500">اقلام انتخاب‌شده را بررسی کنید و به ثبت سفارش ادامه دهید.</p>
        </div>
        <span className="hidden rounded-full bg-brand-50 px-4 py-1.5 text-xs font-bold text-brand-700 sm:block">
          {lines.length} قلم کالا
        </span>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-3">
          {lines.map((line) => {
            const Icon = productIconMap[line.image as Product["image"]] ?? productIconMap.book;
            return (
              <div
                key={line.productId}
                className="flex flex-col gap-4 rounded-card border border-brand-100 bg-white p-4 sm:flex-row sm:items-center"
              >
                <IconTile tone="gold" className="h-16 w-16 shrink-0 rounded-2xl">
                  <Icon width={28} height={28} />
                </IconTile>
                <div className="flex-1">
                  <p className="text-sm font-bold text-ink-900">{line.name}</p>
                  <p className="mt-1 text-xs text-ink-500">قیمت واحد: {formatToman(line.unitPriceToman)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-9 items-center rounded-full border border-brand-200">
                    <button
                      onClick={() => setQty(line.productId, line.qty - 1)}
                      className="flex h-9 w-9 items-center justify-center text-brand-700"
                      aria-label="کم کردن"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-ink-900">{formatNumber(line.qty)}</span>
                    <button
                      onClick={() => setQty(line.productId, line.qty + 1)}
                      className="flex h-9 w-9 items-center justify-center text-brand-700"
                      aria-label="زیاد کردن"
                    >
                      +
                    </button>
                  </div>
                  <span className="w-28 text-sm font-bold text-ink-900">
                    {formatToman(line.unitPriceToman * line.qty)}
                  </span>
                  <button
                    onClick={() => removeLine(line.productId)}
                    className="text-ink-300 transition-colors hover:text-red-500"
                    aria-label="حذف از سبد خرید"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            );
          })}

          <ButtonLink href="/shop" variant="ghost" className="mt-2 inline-flex">
            ادامهٔ خرید
          </ButtonLink>
        </div>

        <div className="h-fit rounded-card border border-brand-100 bg-white p-6 lg:sticky lg:top-24">
          <h2 className="text-sm font-bold text-ink-900">خلاصهٔ سفارش</h2>
          <div className="mt-4 space-y-2.5 text-sm">
            <div className="flex justify-between text-ink-600">
              <span>جمع کالاها</span>
              <span>{formatToman(subtotal)}</span>
            </div>
            <div className="flex justify-between border-t border-brand-100 pt-3 text-base font-extrabold text-ink-900">
              <span>مبلغ قابل پرداخت</span>
              <span>{formatToman(subtotal)}</span>
            </div>
          </div>
          <ButtonLink href="/checkout" size="lg" className="mt-5 flex w-full justify-center">
            ادامه و ثبت سفارش
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
