import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Truck, PackageCheck, ShieldCheck, Clock, PackageSearch } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { IconTile } from "@/components/illustrations/icon-tile";
import { ProductCard } from "@/components/domain/product-card";
import { SectionHeading } from "@/components/domain/section-heading";
import { productIconMap } from "@/components/domain/product-thumb";
import { AddToCartButton } from "@/components/domain/add-to-cart-button";
import { formatToman, formatTokens, formatNumber } from "@/lib/utils";
import { getFeaturedProducts, getCategories, getProductBySlug, getProductsByCategory } from "@/lib/data";

export async function generateStaticParams() {
  const featuredProducts = await getFeaturedProducts();
  return featuredProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/shop/product/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  return { title: product?.name ?? "محصول" };
}

const stockCopy: Record<string, { label: string; variant: "brand" | "gold" | "neutral" }> = {
  in_stock: { label: "موجود", variant: "brand" },
  limited: { label: "موجودی محدود", variant: "gold" },
  backorder: { label: "قابل سفارش", variant: "neutral" },
  out_of_stock: { label: "ناموجود", variant: "neutral" },
};

export default async function ProductPage(props: PageProps<"/shop/product/[slug]">) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const categories = await getCategories();
  const category = categories.find((c) => c.slug === product.categorySlug);
  const Icon = productIconMap[product.image];
  const categoryProducts = await getProductsByCategory(product.categorySlug);
  const related = categoryProducts.filter((p) => p.id !== product.id).slice(0, 4);
  const stock = stockCopy[product.stock];

  return (
    <Container className="py-8 sm:py-10">
      <Breadcrumb
        items={[
          { label: "خانه", href: "/" },
          { label: "فروشگاه", href: "/shop" },
          ...(category ? [{ label: category.name, href: `/shop/category/${category.slug}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-card border border-brand-100 bg-gradient-to-br from-brand-50 to-gold-100/60">
          <IconTile tone="gold" className="h-32 w-32 rounded-[36px]">
            <Icon width={64} height={64} />
          </IconTile>
        </div>

        <div>
          <p className="text-xs text-ink-500">{product.category}</p>
          <h1 className="mt-1 text-2xl font-extrabold text-ink-900 sm:text-[28px]">{product.name}</h1>

          <div className="mt-3 flex items-center gap-2">
            <Badge variant={stock.variant}>{stock.label}</Badge>
            {product.bulkAvailable && <Badge variant="neutral">قابل سفارش عمده</Badge>}
          </div>

          <p className="mt-5 text-sm leading-8 text-ink-600">{product.description}</p>

          <div className="mt-6 flex items-end gap-3">
            <span className="text-2xl font-extrabold text-brand-700">{formatToman(product.priceToman)}</span>
            {product.tokenPrice && (
              <Badge variant="gold" className="mb-1">
                یا {formatTokens(product.tokenPrice)}
              </Badge>
            )}
          </div>

          {product.stock === "out_of_stock" ? (
            <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
              <p className="text-sm font-bold text-ink-900">این کالا در حال حاضر موجود نیست.</p>
              <p className="mt-1 text-xs leading-6 text-ink-500">
                اگر این محصول برای مدرسهٔ موردنیاز شماست، می‌توانید درخواست تأمین آن را ثبت کنید.
              </p>
              <ButtonLink href="/shop/school/request-item" size="lg" className="mt-4 flex w-full justify-center sm:w-auto">
                درخواست تأمین
              </ButtonLink>
            </div>
          ) : (
            <div className="mt-6">
              <AddToCartButton
                productId={product.id}
                slug={product.slug}
                name={product.name}
                image={product.image}
                priceToman={product.priceToman}
                tokenPrice={product.tokenPrice}
              />
            </div>
          )}

          <div className="mt-7 grid gap-3 border-t border-brand-100 pt-6 sm:grid-cols-3">
            {[
              { icon: <Truck size={16} />, label: "ارسال به سراسر کشور" },
              { icon: <PackageCheck size={16} />, label: "امکان سفارش عمده مدارس" },
              { icon: <ShieldCheck size={16} />, label: "ضمانت اصالت کالا" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2 text-xs text-ink-600">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                  {f.icon}
                </span>
                {f.label}
              </div>
            ))}
          </div>

          {(product.minOrderQty || product.maxOrderQty || product.supplyDays) && (
            <div className="mt-6 rounded-2xl border border-brand-100 bg-white p-4">
              <h2 className="text-xs font-bold text-ink-900">شرایط تأمین و سفارش</h2>
              <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                {product.minOrderQty && (
                  <div className="rounded-xl bg-brand-50 py-3">
                    <p className="text-sm font-extrabold text-ink-900">
                      {formatNumber(product.minOrderQty)} {product.unit ?? "عدد"}
                    </p>
                    <p className="mt-1 text-[11px] text-ink-500">حداقل تعداد سفارش</p>
                  </div>
                )}
                {product.maxOrderQty && (
                  <div className="rounded-xl bg-brand-50 py-3">
                    <p className="text-sm font-extrabold text-ink-900">
                      {formatNumber(product.maxOrderQty)} {product.unit ?? "عدد"}
                    </p>
                    <p className="mt-1 text-[11px] text-ink-500">حداکثر تعداد سفارش</p>
                  </div>
                )}
                {product.supplyDays && (
                  <div className="rounded-xl bg-gold-100 py-3">
                    <p className="flex items-center justify-center gap-1 text-sm font-extrabold text-ink-900">
                      <Clock size={13} />
                      {product.supplyDays}
                    </p>
                    <p className="mt-1 text-[11px] text-ink-500">زمان تقریبی تأمین</p>
                  </div>
                )}
              </div>
              {product.shippingTerms && <p className="mt-3 text-xs leading-6 text-ink-500">{product.shippingTerms}</p>}
              {product.bulkAvailable && (
                <ButtonLink href="/shop/school/bulk-order" variant="ghost" size="sm" className="mt-3 inline-flex">
                  <PackageSearch size={14} />
                  درخواست سفارش عمده
                </ButtonLink>
              )}
            </div>
          )}
        </div>
      </div>

      {product.specs && product.specs.length > 0 && (
        <div className="mt-12">
          <SectionHeading eyebrow="جزئیات بیشتر" title="مشخصات فنی" />
          <div className="mt-6 overflow-hidden rounded-card border border-brand-100 bg-white">
            <dl className="divide-y divide-brand-100">
              {product.specs.map((spec, i) => (
                <div
                  key={spec.label}
                  className={i % 2 === 0 ? "grid grid-cols-2 bg-brand-50/40 px-5 py-3" : "grid grid-cols-2 px-5 py-3"}
                >
                  <dt className="text-xs font-bold text-ink-700">{spec.label}</dt>
                  <dd className="text-xs text-ink-500">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-16">
          <SectionHeading eyebrow="پیشنهاد می‌کنیم" title="کالاهای مرتبط" />
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
