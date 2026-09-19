import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProductCard } from "@/components/domain/product-card";
import { Select, Input, Label } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { getCategories, getCategoryBySlug, getProductsByCategory, getFeaturedProducts } from "@/lib/data";

export async function generateMetadata(props: PageProps<"/shop/category/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const category = await getCategoryBySlug(slug);
  return { title: category?.name ?? "دسته‌بندی" };
}

export default async function CategoryPage(props: PageProps<"/shop/category/[slug]">) {
  const { slug } = await props.params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const categories = await getCategories();
  const products = await getProductsByCategory(slug);
  const list = products.length > 0 ? products : await getFeaturedProducts();

  return (
    <Container className="py-8 sm:py-10">
      <Breadcrumb
        items={[
          { label: "خانه", href: "/" },
          { label: "فروشگاه", href: "/shop" },
          { label: category.name },
        ]}
      />
      <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900 sm:text-[28px]">{category.name}</h1>
          <p className="mt-2 max-w-xl text-sm leading-7 text-ink-500">{category.description}</p>
        </div>
        <Badge variant="neutral" className="w-fit">
          {list.length} کالا
        </Badge>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-6">
          <div>
            <h3 className="mb-3 flex items-center gap-1.5 text-sm font-bold text-ink-900">
              <SlidersHorizontal size={15} />
              فیلترها
            </h3>
            <div className="space-y-4 rounded-card border border-brand-100 bg-white p-4">
              <div>
                <p className="mb-2 text-xs font-semibold text-ink-700">دسته‌بندی</p>
                <ul className="space-y-1.5 text-[13px] text-ink-500">
                  {categories.map((c) => (
                    <li key={c.slug}>
                      <a
                        href={`/shop/category/${c.slug}`}
                        className={c.slug === slug ? "font-bold text-brand-700" : "hover:text-brand-700"}
                      >
                        {c.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-brand-100 pt-4">
                <p className="mb-2 text-xs font-semibold text-ink-700">وضعیت موجودی</p>
                <div className="space-y-1.5 text-[13px] text-ink-500">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="accent-brand-600" /> موجود
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="accent-brand-600" /> قابل سفارش
                  </label>
                </div>
              </div>
              <div className="border-t border-brand-100 pt-4">
                <p className="mb-2 text-xs font-semibold text-ink-700">بازهٔ قیمت (تومان)</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label className="sr-only">از</Label>
                    <Input type="number" placeholder="از" className="h-9 px-2 text-xs" />
                  </div>
                  <span className="text-ink-300">—</span>
                  <div className="flex-1">
                    <Label className="sr-only">تا</Label>
                    <Input type="number" placeholder="تا" className="h-9 px-2 text-xs" />
                  </div>
                </div>
              </div>
              <div className="border-t border-brand-100 pt-4">
                <p className="mb-2 text-xs font-semibold text-ink-700">برند</p>
                <div className="space-y-1.5 text-[13px] text-ink-500">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="accent-brand-600" /> مدرسه‌یاری
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="accent-brand-600" /> پارسا تحریر
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="accent-brand-600" /> سایر برندها
                  </label>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex justify-end">
            <Select defaultValue="relevant" className="w-48">
              <option value="relevant">مرتبط‌ترین</option>
              <option value="newest">جدیدترین</option>
              <option value="cheapest">کمترین قیمت</option>
              <option value="expensive">بیشترین قیمت</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
