import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/domain/page-header";
import { StatBlock } from "@/components/domain/stat-block";
import { NeedCard } from "@/components/domain/need-card";
import { ButtonLink } from "@/components/ui/button-link";
import { ListFilterBar } from "@/components/domain/list-filter-bar";
import { NEED_CATEGORY_LABEL, NEED_STATUS_LABEL, type Need } from "@/lib/mock-data";
import { getAllNeeds } from "@/lib/data";

export const metadata: Metadata = { title: "نیازهای دانش‌آموزان" };

export default async function StudentNeedsPage(props: PageProps<"/needs">) {
  const searchParams = await props.searchParams;
  const category = typeof searchParams.category === "string" ? searchParams.category : "all";
  const status = typeof searchParams.status === "string" ? searchParams.status : "all";
  const q = typeof searchParams.q === "string" ? searchParams.q.trim() : "";

  const allNeeds = await getAllNeeds();
  const studentNeeds = allNeeds.filter((n) => n.audience === "student");
  const fulfilled = studentNeeds.reduce((s, n) => s + n.fulfilled, 0);
  const inProgress = studentNeeds.filter((n) => n.status !== "near_complete").length;

  const filteredNeeds = studentNeeds.filter((n) => {
    if (category !== "all" && n.category !== category) return false;
    if (status !== "all" && n.status !== status) return false;
    if (q && !n.title.includes(q) && !n.beneficiary.includes(q)) return false;
    return true;
  });

  return (
    <>
      <PageHeader
        eyebrow="نیازهای دانش‌آموزان"
        title="دانش‌آموزان، امروز به چه چیزهایی نیاز دارند؟"
        description="نیازهای دانش‌آموزان همیشه یکسان نیست. گاهی یک کوله‌پشتی، یک مجموعه لوازم‌التحریر یا چند جلد کتاب می‌تواند مسیر مدرسه را برای یک دانش‌آموز آسان‌تر کند."
        breadcrumb={[{ label: "خانه", href: "/" }, { label: "نیازها" }, { label: "دانش‌آموزان" }]}
      >
        <div className="mt-6 flex flex-wrap gap-8 rounded-2xl bg-white/10 p-5">
          <StatBlock value={12450} label="دانش‌آموز دارای نیاز ثبت‌شده" />
          <StatBlock value={fulfilled} label="نیاز تأمین‌شده" />
          <StatBlock value={inProgress} label="نیاز در حال تأمین" />
        </div>
      </PageHeader>

      <Container className="py-10">
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

        {filteredNeeds.length === 0 && (
          <p className="mt-10 rounded-card border border-brand-100 bg-white p-8 text-center text-sm text-ink-500">
            نیازی با این فیلترها پیدا نشد.
          </p>
        )}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNeeds.map((need) => (
            <NeedCard key={need.id} need={need} />
          ))}
        </div>
      </Container>

      <section className="bg-brand-900 py-14">
        <Container className="flex flex-col items-center gap-5 text-center">
          <h2 className="text-balance text-xl font-extrabold text-white sm:text-2xl">
            هنوز نیازهایی برای تأمین وجود دارد.
          </h2>
          <ButtonLink href="/needs/schools" variant="gold">
            مشاهده نیازهای مدارس
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}
