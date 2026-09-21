import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconTile } from "@/components/illustrations/icon-tile";
import { productIconMap } from "@/components/domain/product-thumb";
import { formatToman, formatTokens } from "@/lib/utils";
import type { Product } from "@/lib/mock-data";

const stockLabel: Record<Product["stock"], { label: string; variant: "brand" | "gold" | "neutral" } | null> = {
  in_stock: null,
  limited: { label: "موجودی محدود", variant: "gold" },
  backorder: { label: "قابل سفارش", variant: "neutral" },
  out_of_stock: { label: "ناموجود", variant: "neutral" },
};

export function ProductCard({ product, showBulkBadge }: { product: Product; showBulkBadge?: boolean }) {
  const Icon = productIconMap[product.image];
  const stock = stockLabel[product.stock];

  return (
    <Link
      href={`/shop/product/${product.slug}`}
      className="group flex flex-col gap-3 rounded-card border border-brand-100 bg-white p-5 shadow-[0_10px_30px_-18px_rgba(12,34,66,0.3)] transition-transform hover:-translate-y-1"
    >
      <div className="flex items-center justify-between">
        <IconTile tone="gold">
          <Icon width={26} height={26} />
        </IconTile>
        <div className="flex flex-col items-end gap-1.5">
          {product.tokenPrice && <Badge variant="gold">{formatTokens(product.tokenPrice)}</Badge>}
          {stock && <Badge variant={stock.variant}>{stock.label}</Badge>}
        </div>
      </div>
      <div>
        <p className="text-xs text-ink-500">{product.category}</p>
        <h3 className="mt-0.5 text-sm font-bold text-ink-900">{product.name}</h3>
      </div>
      {showBulkBadge && product.bulkAvailable && (
        <Badge variant="brand" className="w-fit text-[10px]">
          مناسب برای سفارش مدارس
        </Badge>
      )}
      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="text-sm font-bold text-brand-700">{formatToman(product.priceToman)}</span>
        <span
          className={buttonVariants({
            size: "sm",
            variant: "secondary",
            className: product.stock === "out_of_stock" ? "pointer-events-none opacity-50" : "",
          })}
        >
          مشاهده
        </span>
      </div>
    </Link>
  );
}
