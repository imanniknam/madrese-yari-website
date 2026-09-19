import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/domain/page-header";
import { NeedCard } from "@/components/domain/need-card";
import { ButtonLink } from "@/components/ui/button-link";
import { ListFilterBar } from "@/components/domain/list-filter-bar";
import { NEED_CATEGORY_LABEL, NEED_STATUS_LABEL, type Need } from "@/lib/mock-data";
import { getAllNeeds } from "@/lib/data";

export const metadata: Metadata = { title: "انتخاب یک نیاز" };

export default async function ChooseNeedPage(props: PageProps<"/help/choose-a-need">) {
  const searchParams = await props.searchParams;
  const audience = typeof searchParams.audience === "string" ? searchParams.audience : "all";
  const category = typeof searchParams.category === "string" ? searchParams.category : "all";
  const status = typeof searchParams.status === "string" ? searchParams.status : "all";

  const allNeeds = await getAllNeeds();
  const urgent = [...allNeeds].sort((a, b) => b.fulfilled / b.needed - a.fulfilled / a.needed).slice(0, 3);

  const filteredNeeds = allNeeds.filter((n) => {
    if (audience !== "all" && n.audience !== audience) return false;
    if (category !== "all" && n.category !== category) return false;
    if (status !== "all" && n.status !== status) return false;
    return true;
  });

  return (
    <>
      <PageHeader
        eyebrow="کمک کن"
        title="با تأمین هر نیاز، لبخند هدیه دهید."
        description="از بین نیازهای واقعی ثبت‌شده، چیزی را انتخاب کنید که دوست دارید در تأمین آن سهیم باشید؛ از یک دفتر و کوله تا تجهیزات یک کلاس و وسایل آموزشی."
        breadcrumb={[{ label: "خانه", href: "/" }, { label: "کمک کن", href: "/help" }, { label: "انتخاب یک نیاز" }]}
      />

      <Container className="py-12">
        <Suspense>
          <ListFilterBar
            chipGroups={[
              {
                param: "audience",
                options: [
                  { value: "all", label: "همه" },
                  { value: "student", label: "دانش‌آموز" },
                  { value: "school", label: "مدرسه" },
                ],
              },
              {
                param: "category",
                options: [
                  { value: "all", label: "همهٔ دسته‌ها" },
                  ...(Object.keys(NEED_CATEGORY_LABEL) as Need["category"][]).map((c) => ({
                    value: c,
                    label: NEED_CATEGORY_LABEL[c],
                  })),
                ],
              },
              {
                param: "status",
                label: "میزان تأمین",
                options: [
                  { value: "all", label: "همه" },
                  ...(Object.keys(NEED_STATUS_LABEL) as Need["status"][]).map((s) => ({
                    value: s,
                    label: NEED_STATUS_LABEL[s],
                  })),
                ],
              },
            ]}
          />
        </Suspense>

        <p className="mt-6 text-sm leading-7 text-ink-500">
          می‌توانید یک نیاز را به‌طور کامل تأمین کنید یا فقط بخشی از آن را بر عهده بگیرید، انتخاب با شماست.
        </p>

        {filteredNeeds.length === 0 && (
          <p className="mt-6 rounded-card border border-brand-100 bg-white p-8 text-center text-sm text-ink-500">
            نیازی با این فیلترها پیدا نشد.
          </p>
        )}

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNeeds.map((need) => (
            <NeedCard key={need.id} need={need} />
          ))}
        </div>

        <div className="mt-14 rounded-card bg-brand-900 p-8 text-center sm:p-10">
          <h2 className="text-balance text-lg font-extrabold text-white sm:text-xl">
            اگر نمی‌دانید کدام نیاز را انتخاب کنید...
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-brand-100">
            اشکالی ندارد. نیازهای ثبت‌شده را بر اساس میزان فوریت و مقدار باقی‌مانده نشان می‌دهیم تا راحت‌تر انتخاب کنید.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {urgent.map((n) => (
              <ButtonLink key={n.id} href={`/needs/${n.id}`} variant="gold" size="sm" className="justify-center">
                {n.title}
              </ButtonLink>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
