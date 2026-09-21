import Link from "next/link";
import { Coins } from "lucide-react";
import { productIconMap } from "@/components/domain/product-thumb";
import { formatNumber, formatToman } from "@/lib/utils";
import type { Product } from "@/lib/mock-data";

const stockNote: Record<Product["stock"], { label: string; className: string } | null> = {
  in_stock: null,
  limited: { label: "موجودی محدود", className: "bg-gold-100 text-gold-700" },
  backorder: { label: "قابل سفارش", className: "bg-sand-200 text-ink-700" },
  out_of_stock: { label: "ناموجود", className: "bg-sand-200 text-ink-500" },
};

export function ProductSlideCard({ product }: { product: Product }) {
  const Icon = productIconMap[product.image];
  const note = stockNote[product.stock];
  const discount =
    product.compareAtToman && product.compareAtToman > product.priceToman
      ? Math.round((1 - product.priceToman / product.compareAtToman) * 100)
      : 0;

  return (
    <Link
      href={`/shop/product/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-100 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_18px_36px_-20px_rgba(12,34,66,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      <div className="relative flex h-40 items-center justify-center bg-gradient-to-b from-brand-50 to-brand-100/60">
        {note && (
          <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${note.className}`}>
            {note.label}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-700 px-2.5 py-1 text-[11px] font-bold text-white">
            {formatNumber(discount)}٪ تخفیف
          </span>
        )}
        <div className="transition-transform duration-300 group-hover:scale-110 [&_svg]:h-20 [&_svg]:w-20">
          <Icon />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs text-ink-500">{product.category}</p>
        <h3 className="mt-1 line-clamp-2 min-h-[2.75rem] text-[15px] font-bold leading-[1.4] text-ink-900">
          {product.name}
        </h3>

        <div className="mt-3 min-h-[3rem]">
          {discount > 0 && (
            <p className="text-xs text-ink-300 line-through">{formatToman(product.compareAtToman!)}</p>
          )}
          <p className="text-base font-extrabold text-brand-800">{formatToman(product.priceToman)}</p>
          {product.tokenPrice && (
            <p className="mt-1 flex items-center gap-1 text-xs text-gold-700">
              <Coins size={13} />
              یا {formatNumber(product.tokenPrice)} توکن
            </p>
          )}
        </div>

        <span
          className={`mt-4 flex h-11 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
            product.stock === "out_of_stock"
              ? "bg-sand-200 text-ink-500"
              : "bg-brand-700 text-white group-hover:bg-brand-800"
          }`}
        >
          مشاهده و خرید
        </span>
      </div>
    </Link>
  );
}
