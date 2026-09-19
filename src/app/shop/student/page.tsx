import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/domain/page-header";
import { StudentProductCard } from "@/components/domain/student-product-card";
import { CoinIcon } from "@/components/illustrations/category-icons";
import { ListFilterBar } from "@/components/domain/list-filter-bar";
import { formatTokens } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { getFeaturedProducts, getStudentProfileByUserId } from "@/lib/data";

export const metadata: Metadata = { title: "فروشگاه دانش‌آموز" };

const studentCategories = [
  { value: "all", label: "همهٔ کالاها" },
  { value: "bags", label: "کیف و کوله‌پشتی" },
  { value: "stationery", label: "لوازم‌التحریر" },
  { value: "books", label: "کتاب" },
  { value: "learning-aids", label: "وسایل آموزشی" },
];

export default async function StudentShopPage(props: PageProps<"/shop/student">) {
  const searchParams = await props.searchParams;
  const category = typeof searchParams.category === "string" ? searchParams.category : "all";
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "relevant";
  const q = typeof searchParams.q === "string" ? searchParams.q.trim() : "";

  const session = await auth();
  const studentProfile = session?.user?.id ? await getStudentProfileByUserId(session.user.id as string) : null;
  const creditBalance = studentProfile?.creditBalance ?? 0;

  const featuredProducts = await getFeaturedProducts();
  let creditProducts = featuredProducts.filter((p) => p.tokenPrice);

  if (category !== "all") creditProducts = creditProducts.filter((p) => p.categorySlug === category);
  if (q) creditProducts = creditProducts.filter((p) => p.name.includes(q));
  if (sort === "cheapest-tokens") creditProducts = [...creditProducts].sort((a, b) => (a.tokenPrice ?? 0) - (b.tokenPrice ?? 0));
  if (sort === "expensive-tokens") creditProducts = [...creditProducts].sort((a, b) => (b.tokenPrice ?? 0) - (a.tokenPrice ?? 0));

  return (
    <>
      <PageHeader
        eyebrow="فروشگاه دانش‌آموز"
        title="کالاهای موردنیازت را انتخاب کن."
        description="در فروشگاه مدرسه‌یاری می‌توانی کالاهای موردنیازت را از میان محصولات واجد شرایط انتخاب و با اعتبار خود تهیه کنی."
        breadcrumb={[{ label: "خانه", href: "/" }, { label: "فروشگاه", href: "/shop" }, { label: "دانش‌آموز" }]}
      >
        <div className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-white/95 px-5 py-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-100 text-gold-600">
            <CoinIcon width={20} height={20} />
          </span>
          <div>
            <p className="text-[11px] text-ink-500">اعتبار شما</p>
            <p className="text-base font-extrabold text-ink-900">
              {studentProfile ? formatTokens(creditBalance) : "برای مشاهده وارد شوید"}
            </p>
          </div>
        </div>
      </PageHeader>

      <Container className="py-10">
        <Suspense>
          <ListFilterBar
            searchPlaceholder="جست‌وجوی کالا..."
            categories={studentCategories}
            selects={[
              {
                param: "sort",
                options: [
                  { value: "relevant", label: "مرتبط‌ترین" },
                  { value: "cheapest-tokens", label: "کمترین اعتبار موردنیاز" },
                  { value: "expensive-tokens", label: "بیشترین اعتبار موردنیاز" },
                ],
                className: "w-56",
              },
            ]}
          />
        </Suspense>

        {creditProducts.length === 0 && (
          <p className="mt-8 rounded-card border border-brand-100 bg-white p-8 text-center text-sm text-ink-500">
            کالایی با این فیلترها پیدا نشد.
          </p>
        )}

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {creditProducts.map((p) => (
            <StudentProductCard key={p.id} product={p} credit={creditBalance} />
          ))}
        </div>

        <div className="mt-10 rounded-card border border-brand-100 bg-brand-50/60 p-6 text-sm leading-7 text-ink-600">
          <p className="font-bold text-ink-900">چطور از اعتبارم استفاده کنم؟</p>
          <ol className="mt-2 list-inside list-decimal space-y-1">
            <li>کالای موردنیاز خود را پیدا کنید.</li>
            <li>بررسی کنید اعتبار کافی برای تهیهٔ آن دارید.</li>
            <li>کالا را انتخاب و درخواست خود را ثبت کنید.</li>
            <li>وضعیت تأمین و تحویل را از حساب خود پیگیری کنید.</li>
          </ol>
        </div>
      </Container>
    </>
  );
}
