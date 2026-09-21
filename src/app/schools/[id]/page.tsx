import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { NeedCard } from "@/components/domain/need-card";
import { ButtonLink } from "@/components/ui/button-link";
import { formatNumber } from "@/lib/utils";
import { getSchoolById, getNeedsBySchool } from "@/lib/data";
import { MapPin } from "lucide-react";

export async function generateMetadata(props: PageProps<"/schools/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const school = await getSchoolById(id);
  return { title: school?.name ?? "مدرسه" };
}

export default async function SchoolDetailPage(props: PageProps<"/schools/[id]">) {
  const { id } = await props.params;
  const school = await getSchoolById(id);
  if (!school) notFound();

  const needs = (await getNeedsBySchool(id)).slice(0, 2);

  return (
    <>
      <div className="h-52 bg-gradient-to-br from-brand-300 via-brand-500 to-brand-700 sm:h-64" />
      <Container className="relative -mt-16 pb-14">
        <div className="rounded-card border border-brand-100 bg-white p-6 shadow-[0_20px_40px_-24px_rgba(16,44,31,0.35)] sm:p-8">
          <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "مدارس", href: "/schools" }, { label: school.name }]} />
          <h1 className="mt-4 text-2xl font-extrabold text-ink-900 sm:text-[28px]">{school.name}</h1>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-500">
            <MapPin size={14} />
            {school.city}، {school.province}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-md">
            <div className="rounded-xl bg-brand-50 py-3 text-center">
              <p className="text-lg font-extrabold text-ink-900">{school.needsCount}</p>
              <p className="text-[11px] text-ink-500">نیاز ثبت‌شده</p>
            </div>
            <div className="rounded-xl bg-brand-50 py-3 text-center">
              <p className="text-lg font-extrabold text-ink-900">{school.level}</p>
              <p className="text-[11px] text-ink-500">مقطع</p>
            </div>
            <div className="rounded-xl bg-brand-50 py-3 text-center">
              <p className="text-lg font-extrabold text-ink-900">{formatNumber(school.studentCount)}</p>
              <p className="text-[11px] text-ink-500">دانش‌آموز</p>
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-ink-600">{school.description}</p>
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-extrabold text-ink-900">نیازهای این مدرسه</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {needs.map((n) => (
              <NeedCard key={n.id} need={n} />
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-card bg-brand-900 p-6 text-center sm:p-8">
          <h2 className="text-base font-extrabold text-white sm:text-lg">می‌خواهید به این مدرسه کمک کنید؟</h2>
          <ButtonLink href="/help/choose-a-need" variant="gold" className="mt-4 inline-flex">
            مشاهده همهٔ نیازها
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}
