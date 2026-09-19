import type { Metadata } from "next";
import { Search } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/domain/page-header";
import { SectionHeading } from "@/components/domain/section-heading";
import { CategoryCard } from "@/components/domain/category-card";
import { ProductCard } from "@/components/domain/product-card";
import { ButtonLink } from "@/components/ui/button-link";
import { getCategories, getFeaturedProducts } from "@/lib/data";

export const metadata: Metadata = { title: "فروشگاه" };

export default async function ShopPage() {
  const categories = await getCategories();
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <PageHeader
        eyebrow="فروشگاه مدرسه‌یاری"
        title="هر آنچه برای مدرسه و یادگیری لازم است."
        description="از تجهیزات کلاس و وسایل کمک‌آموزشی تا کتاب، لوازم‌التحریر و ملزومات مدرسه؛ کالای موردنیاز خود را پیدا کنید و سفارش دهید. با هر خرید، بخشی از سود صرف تأمین نیازهای مدارس و دانش‌آموزان می‌شود."
        breadcrumb={[{ label: "خانه", href: "/" }, { label: "فروشگاه" }]}
      >
        <div className="mt-6 flex max-w-lg items-center gap-2 rounded-full bg-white/95 p-1.5 pr-4">
          <Search size={17} className="shrink-0 text-ink-400" />
          <input
            placeholder="جست‌وجوی کالا، تجهیزات یا وسایل آموزشی..."
            className="h-9 w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-300"
          />
          <ButtonLink href="/shop" size="sm">
            جست‌وجو
          </ButtonLink>
        </div>
      </PageHeader>

      <section className="py-14 sm:py-16">
        <Container>
          <SectionHeading eyebrow="دسته‌بندی‌ها" title="از کجا شروع کنیم؟" />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.map((c) => (
              <CategoryCard key={c.slug} category={c} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-brand-50/60 py-14 sm:py-16">
        <Container>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="کالاهای منتخب" title="پیشنهادهای این هفته" />
            <ButtonLink href="/shop/category/stationery" variant="secondary" className="hidden sm:inline-flex">
              مشاهده همه کالاها
            </ButtonLink>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-16">
        <Container>
          <div className="grid items-center gap-8 rounded-card bg-brand-900 p-8 sm:p-10 lg:grid-cols-[1.2fr_auto]">
            <div>
              <h2 className="text-balance text-xl font-extrabold text-white sm:text-2xl">
                برای مدرسه‌تان سفارش عمده دارید؟
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-7 text-brand-100">
                مدارس می‌توانند از فروشگاه اختصاصی مدرسه‌یاری، تجهیزات موردنیاز خود را با شرایط سفارش عمده تهیه کنند.
              </p>
            </div>
            <ButtonLink href="/shop/school" variant="gold" size="lg" className="justify-center">
              ورود به فروشگاه مدرسه
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
