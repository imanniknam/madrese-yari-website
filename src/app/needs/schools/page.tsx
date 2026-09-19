import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/domain/page-header";
import { StatBlock } from "@/components/domain/stat-block";
import { NeedCard } from "@/components/domain/need-card";
import { CategoryCard } from "@/components/domain/category-card";
import { ButtonLink } from "@/components/ui/button-link";
import { ListFilterBar } from "@/components/domain/list-filter-bar";
import { NEED_CATEGORY_LABEL, NEED_STATUS_LABEL, type Need } from "@/lib/mock-data";
import { getAllNeeds, getCategories } from "@/lib/data";

export const metadata: Metadata = { title: "نیازهای مدارس" };

const schoolCategorySlugs = ["classroom-equipment", "learning-aids", "lab-equipment", "sports", "books", "other"];

export default async function SchoolNeedsPage(props: PageProps<"/needs/schools">) {
  const searchParams = await props.searchParams;
  const category = typeof searchParams.category === "string" ? searchParams.category : "all";
  const status = typeof searchParams.status === "string" ? searchParams.status : "all";
  const location = typeof searchParams.location === "string" ? searchParams.location : "all";
  const q = typeof searchParams.q === "string" ? searchParams.q.trim() : "";

  const [allNeeds, categories] = await Promise.all([getAllNeeds(), getCategories()]);
  const schoolNeeds = allNeeds.filter((n) => n.audience === "school");
  const displayCategories = categories.filter((c) => schoolCategorySlugs.includes(c.slug));

  const filteredNeeds = schoolNeeds.filter((n) => {
    if (category !== "all" && n.category !== category) return false;
    if (status !== "all" && n.status !== status) return false;
    if (location !== "all" && n.location !== location) return false;
    if (q && !n.title.includes(q) && !n.beneficiary.includes(q)) return false;
    return true;
  });

  return (
    <>
      <PageHeader
        eyebrow="نیازهای مدارس"
        title="مدارس، امروز به چه چیزهایی نیاز دارند؟"
        description="نیازهای ثبت‌شدهٔ مدارس را ببینید و در تأمین تجهیزات و امکانات موردنیاز آن‌ها سهیم شوید."
        breadcrumb={[{ label: "خانه", href: "/" }, { label: "نیازها", href: "/needs" }, { label: "مدارس" }]}
      >
        <div className="mt-6 flex flex-wrap gap-8 rounded-2xl bg-white/10 p-5">
          <StatBlock value={320} label="مدرسهٔ دارای نیاز" />
          <StatBlock value={schoolNeeds.length} label="نیاز در حال تأمین" />
          <StatBlock value={540} label="نیاز تأمین‌شده" />
          <StatBlock value={87000} label="میزان کل تأمین" />
        </div>
      </PageHeader>

      <Container className="py-10">
        <h2 className="text-lg font-extrabold text-ink-900">مدارس بیشتر به چه چیزهایی نیاز دارند؟</h2>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {displayCategories.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>

        <h2 className="mt-12 text-lg font-extrabold text-ink-900">نیازهای در انتظار تأمین</h2>

        <div className="mt-5">
          <Suspense>
            <ListFilterBar
              searchPlaceholder="جست‌وجوی نیاز..."
              categories={[
                { value: "all", label: "همه" },
                ...(Object.keys(NEED_CATEGORY_LABEL) as Need["category"][]).map((c) => ({
                  value: c,
                  label: NEED_CATEGORY_LABEL[c],
                })),
              ]}
              selects={[
                {
                  param: "location",
                  options: [
                    { value: "all", label: "استان / شهر" },
                    ...Array.from(new Set(schoolNeeds.map((n) => n.location))).map((loc) => ({
                      value: loc,
                      label: loc,
                    })),
                  ],
                },
                {
                  param: "status",
                  options: [
                    { value: "all", label: "همهٔ وضعیت‌ها" },
                    ...(Object.keys(NEED_STATUS_LABEL) as Need["status"][]).map((s) => ({
                      value: s,
                      label: NEED_STATUS_LABEL[s],
                    })),
                  ],
                },
              ]}
            />
          </Suspense>
        </div>

        {filteredNeeds.length === 0 && (
          <p className="mt-10 rounded-card border border-brand-100 bg-white p-8 text-center text-sm text-ink-500">
            نیازی با این فیلترها پیدا نشد.
          </p>
        )}

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNeeds.map((need) => (
            <NeedCard key={need.id} need={need} />
          ))}
        </div>
      </Container>

      <section className="bg-brand-900 py-14">
        <Container className="flex flex-col items-center gap-5 text-center">
          <h2 className="text-balance text-xl font-extrabold text-white sm:text-2xl">
            یک نیاز مشخص را برای یک مدرسه تأمین کنید.
          </h2>
          <ButtonLink href="/needs" variant="gold">
            مشاهده نیازهای دانش‌آموزان
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}
