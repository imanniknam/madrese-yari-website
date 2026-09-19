"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import type { Product } from "@/lib/mock-data";

export function AddToCartButton({
  productId,
  slug,
  name,
  image,
  priceToman,
  tokenPrice,
}: {
  productId: string;
  slug: string;
  name: string;
  image: Product["image"];
  priceToman: number;
  tokenPrice?: number;
}) {
  const addLine = useCartStore((s) => s.addLine);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addLine({
      productId,
      slug,
      name,
      image,
      qty,
      unitPriceToman: priceToman,
      unitTokenPrice: tokenPrice,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 items-center rounded-full border border-brand-200">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="flex h-11 w-11 items-center justify-center text-lg text-brand-700"
          aria-label="کم کردن"
        >
          −
        </button>
        <span className="w-8 text-center text-sm font-bold text-ink-900">{formatNumber(qty)}</span>
        <button
          type="button"
          onClick={() => setQty((q) => q + 1)}
          className="flex h-11 w-11 items-center justify-center text-lg text-brand-700"
          aria-label="زیاد کردن"
        >
          +
        </button>
      </div>
      <Button type="button" size="lg" onClick={handleAdd} className="flex-1 justify-center">
        {added ? "به سبد اضافه شد" : "افزودن به سبد خرید"}
      </Button>
    </div>
  );
}
