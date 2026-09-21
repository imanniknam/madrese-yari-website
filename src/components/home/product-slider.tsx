import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ProductSlideCard } from "@/components/home/product-slide-card";
import { SliderShell } from "@/components/home/slider-shell";
import type { Product } from "@/lib/mock-data";

export function ProductSlider({
  title,
  href,
  products,
  tone = "light",
}: {
  title: string;
  href: string;
  products: Product[];
  tone?: "light" | "tint";
}) {
  return (
    <section className={tone === "tint" ? "bg-brand-50/70 py-10" : "py-10"}>
      <Container>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="border-r-4 border-gold-500 pr-3 text-xl font-extrabold text-ink-900">{title}</h2>
          <Link href={href} className="text-sm font-semibold text-brand-700 hover:underline">
            مشاهده همه
          </Link>
        </div>
        <SliderShell>
          {products.map((p) => (
            <div key={p.id} className="w-[240px] shrink-0 snap-start sm:w-[260px]">
              <ProductSlideCard product={p} />
            </div>
          ))}
        </SliderShell>
      </Container>
    </section>
  );
}
