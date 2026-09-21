import Link from "next/link";
import { IconTile } from "@/components/illustrations/icon-tile";
import { productIconMap } from "@/components/domain/product-thumb";
import { buttonVariants } from "@/components/ui/button";
import { formatTokens } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/mock-data";

export function StudentProductCard({ product, credit }: { product: Product; credit: number }) {
  const Icon = productIconMap[product.image];
  const tokenPrice = product.tokenPrice ?? 0;
  const affordable = product.stock !== "out_of_stock" && tokenPrice <= credit;
  const outOfStock = product.stock === "out_of_stock";

  const status = outOfStock
    ? { label: "ناموجود", tone: "text-ink-400 bg-sand-200" }
    : !affordable
      ? { label: "اعتبار کافی نیست", tone: "text-gold-700 bg-gold-100" }
      : { label: "قابل تهیه", tone: "text-brand-700 bg-brand-100" };

  return (
    <Link
      href={`/shop/product/${product.slug}`}
      className={cn(
        "group flex flex-col gap-3 rounded-card border border-brand-100 bg-white p-5 shadow-[0_10px_30px_-18px_rgba(12,34,66,0.3)] transition-transform",
        affordable ? "hover:-translate-y-1" : "opacity-90"
      )}
    >
      <div className="flex items-center justify-between">
        <IconTile tone="gold">
          <Icon width={26} height={26} />
        </IconTile>
        <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold", status.tone)}>{status.label}</span>
      </div>
      <div>
        <p className="text-xs text-ink-500">{product.category}</p>
        <h3 className="mt-0.5 text-sm font-bold text-ink-900">{product.name}</h3>
      </div>
      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="text-sm font-bold text-brand-700">{formatTokens(tokenPrice)}</span>
        <span
          className={buttonVariants({
            size: "sm",
            variant: affordable ? "primary" : "secondary",
            className: !affordable && !outOfStock ? "pointer-events-none opacity-70" : "",
          })}
        >
          {affordable ? "انتخاب کالا" : "مشاهده"}
        </span>
      </div>
    </Link>
  );
}
