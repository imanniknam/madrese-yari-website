import { Suspense } from "react";
import type { Metadata } from "next";
import { PackagePlus, ShoppingBag } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/domain/page-header";
import { SectionHeading } from "@/components/domain/section-heading";
import { CategoryCard } from "@/components/domain/category-card";
import { ProductCard } from "@/components/domain/product-card";
import { ButtonLink } from "@/components/ui/button-link";
import { ListFilterBar } from "@/components/domain/list-filter-bar";
import { getCategories, getFeaturedProducts } from "@/lib/data";

export const metadata: Metadata = { title: "فروشگاه مدرسه" };

const buyingSteps = [
  { n: "۱", title: "کالا را پیدا کنید", desc: "کالای موردنیاز مدرسه را از میان دسته‌بندی‌ها یا با جست‌وجو پیدا کنید." },
  { n: "۲", title: "مشخصات و شرایط تأمین را بررسی کنید", desc: "تعداد، قیمت، موجودی و شرایط تأمین را ببینید." },
  { n: "۳", title: "سفارش را ثبت کنید", desc: "کالاها را به سبد اضافه و اطلاعات سفارش را تکمیل کنید." },
  { n: "۴", title: "سفارش را پیگیری کنید", desc: "از حساب مدرسه، وضعیت تأمین و ارسال سفارش را دنبال کنید." },
];

const faq = [
  {
    q: "آیا مدرسه می‌تواند چند نوع کالا را هم‌زمان سفارش دهد؟",
    a: "بله، در صورت موجود بودن کالاها، امکان اضافه کردن چند محصول به یک سبد و ثبت سفارش وجود دارد.",
  },
  {
    q: "آیا امکان سفارش تعداد بالا وجود دارد؟",
    a: "برای کالاهایی که امکان سفارش عمده دارند، مدرسه می‌تواند درخواست سفارش عمده ثبت کند.",
  },
  {
    q: "اگر کالای موردنیاز ما در فروشگاه نباشد چه کنیم؟",
    a: "می‌توانید درخواست تأمین آن را ثبت کنید تا امکان تأمین آن بررسی شود.",
  },
  {
    q: "وضعیت سفارش را از کجا ببینیم؟",
    a: "تمام سفارش‌های مدرسه از طریق حساب کاربری و بخش «نیازهای مدرسه» یا «سفارش‌ها» قابل مشاهده و پیگیری هستند.",
  },
];

export default async function SchoolShopPage(props: PageProps<"/shop/school">) {
  const searchParams = await props.searchParams;
  const category = typeof searchParams.category === "string" ? searchParams.category : "all";
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "relevant";
  const bulkOnly = searchParams.bulk === "1";
  const q = typeof searchParams.q === "string" ? searchParams.q.trim() : "";

  const [categories, allProducts] = await Promise.all([getCategories(), getFeaturedProducts()]);

  let products = allProducts;
  if (category !== "all") products = products.filter((p) => p.categorySlug === category);
  if (bulkOnly) products = products.filter((p) => p.bulkAvailable);
  if (q) products = products.filter((p) => p.name.includes(q));
  if (sort === "cheapest") products = [...products].sort((a, b) => a.priceToman - b.priceToman);
  if (sort === "expensive") products = [...products].sort((a, b) => b.priceToman - a.priceToman);

  return (
    <>
      <PageHeader
        eyebrow="فروشگاه برای مدرسه"
        title="تجهیزات و ملزومات موردنیاز مدرسه را پیدا کنید."
        description="از تجهیزات کلاس و وسایل کمک‌آموزشی تا کتاب، تجهیزات ورزشی و دیگر اقلام موردنیاز مدرسه؛ کالاهای موردنظر خود را پیدا کنید و سفارش دهید."
        breadcrumb={[{ label: "خانه", href: "/" }, { label: "فروشگاه", href: "/shop" }, { label: "مدرسه" }]}
      >
        <div className="mt-4 flex flex-wrap gap-3">
          <ButtonLink href="/cart" variant="secondary" size="sm" className="border-white/30 bg-transparent text-white hover:bg-white/10">
            <ShoppingBag size={15} />
            سبد خرید مدرسه
          </ButtonLink>
          <ButtonLink href="/account" variant="secondary" size="sm" className="border-white/30 bg-transparent text-white hover:bg-white/10">
            حساب کاربری مدرسه
          </ButtonLink>
        </div>
      </PageHeader>

      <Container className="py-10">
        <h2 className="text-lg font-extrabold text-ink-900">چه چیزی برای مدرسه نیاز دارید؟</h2>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      </Container>

      <Container id="products" className="scroll-mt-24 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-ink-900">کالاهای موجود</h2>
          <ButtonLink href="/cart" variant="secondary">
            شروع ثبت سفارش
          </ButtonLink>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="space-y-6">
            <div className="rounded-card border border-brand-100 bg-brand-50/60 p-4">
              <p className="flex items-center gap-1.5 text-xs font-bold text-brand-800">
                <PackagePlus size={15} />
                برای تعداد بالا سفارش دارید؟
              </p>
              <p className="mt-1.5 text-[11.5px] leading-6 text-ink-600">
                برای کالاهایی که امکان سفارش عمده دارند، درخواست خود را ثبت کنید تا شرایط تأمین بررسی شود.
              </p>
              <ButtonLink href="/shop/school/bulk-order" variant="link" className="mt-2">
                درخواست سفارش عمده
              </ButtonLink>
            </div>
            <div className="rounded-card border border-brand-100 bg-white p-4">
              <p className="mb-2 text-xs font-semibold text-ink-700">کالای موردنظرتان نیست؟</p>
              <ButtonLink href="/shop/school/request-item" variant="link" className="text-xs">
                درخواست تأمین کالا
              </ButtonLink>
            </div>
          </aside>

          <div>
            <Suspense>
              <ListFilterBar
                searchPlaceholder="جست‌وجوی کالا..."
                categories={[
                  { value: "all", label: "همه" },
                  ...categories.map((c) => ({ value: c.slug, label: c.name })),
                ]}
                selects={[
                  {
                    param: "sort",
                    options: [
                      { value: "relevant", label: "مرتبط‌ترین" },
                      { value: "cheapest", label: "کمترین قیمت" },
                      { value: "expensive", label: "بیشترین قیمت" },
                    ],
                    className: "w-44",
                  },
                  {
                    param: "bulk",
                    options: [
                      { value: "0", label: "همهٔ کالاها" },
                      { value: "1", label: "فقط قابل سفارش عمده" },
                    ],
                    className: "w-52",
                  },
                ]}
              />
            </Suspense>

            {products.length === 0 && (
              <p className="mt-8 rounded-card border border-brand-100 bg-white p-8 text-center text-sm text-ink-500">
                کالایی با این فیلترها پیدا نشد.
              </p>
            )}

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} showBulkBadge />
              ))}
            </div>
          </div>
        </div>
      </Container>

      <section className="bg-brand-50/60 py-14 sm:py-16">
        <Container>
          <SectionHeading eyebrow="راهنمای خرید برای مدارس" title="چطور از فروشگاه مدرسه‌یاری خرید کنیم؟" align="center" />
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {buyingSteps.map((step) => (
              <div key={step.n}>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-700 text-lg font-extrabold text-white">
                  {step.n}
                </div>
                <h3 className="mt-4 text-[15px] font-bold text-ink-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-ink-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="سوالات متداول" title="سوالی دارید؟" />
          <div className="mt-6 space-y-3">
            {faq.map((item) => (
              <details key={item.q} className="group rounded-2xl border border-brand-100 bg-white p-4 open:shadow-sm">
                <summary className="cursor-pointer list-none text-sm font-bold text-ink-900">{item.q}</summary>
                <p className="mt-2 text-sm leading-7 text-ink-500">{item.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <div className="relative overflow-hidden rounded-card bg-gradient-to-l from-brand-700 to-brand-900 px-8 py-12 sm:px-14 sm:py-16">
            <div className="pointer-events-none absolute -left-10 -top-10 h-52 w-52 rounded-full bg-gold-400/20 blur-3xl" />
            <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-balance text-2xl font-extrabold text-white sm:text-3xl">
                  مدرسه‌تان را برای یک سال بهتر آماده کنید.
                </h2>
                <p className="mt-3 max-w-md text-sm leading-7 text-brand-100">
                  تجهیزات و اقلام موردنیاز مدرسه را پیدا کنید، سفارش دهید و مراحل تأمین را تا زمان تحویل پیگیری کنید.
                </p>
              </div>
              <ButtonLink href="#products" variant="gold" size="lg" className="w-full justify-center sm:w-auto">
                ورود به فروشگاه
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
