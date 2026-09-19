import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { ProgressBar } from "@/components/ui/progress-bar";
import { IconTile } from "@/components/illustrations/icon-tile";
import { NeedCard } from "@/components/domain/need-card";
import { SectionHeading } from "@/components/domain/section-heading";
import { Timeline } from "@/components/domain/timeline";
import { NeedContributionForm } from "@/components/domain/need-contribution-form";
import {
  BackpackIcon,
  BookStackIcon,
  GlobeIcon,
  WhiteboardIcon,
  FlaskIcon,
  SportsIcon,
  StationeryIcon,
  ClassroomIcon,
} from "@/components/illustrations/category-icons";
import { formatNumber } from "@/lib/utils";
import { getAllNeeds, getNeedById } from "@/lib/data";

const categoryIcon: Record<string, React.ReactNode> = {
  backpack: <BackpackIcon width={30} height={30} />,
  book: <BookStackIcon width={30} height={30} />,
  globe: <GlobeIcon width={30} height={30} />,
  board: <WhiteboardIcon width={30} height={30} />,
  lab: <FlaskIcon width={30} height={30} />,
  sports: <SportsIcon width={30} height={30} />,
  stationery: <StationeryIcon width={30} height={30} />,
  classroom: <ClassroomIcon width={30} height={30} />,
};

const faq = [
  {
    q: "نیازهای این صفحه چگونه ثبت می‌شوند؟",
    a: "نیازهای دانش‌آموزان و مدارس پس از شناسایی و بررسی، در مدرسه‌یاری ثبت می‌شوند. هر نیاز شامل اطلاعاتی دربارهٔ نوع کالا، تعداد موردنیاز و میزان تأمین‌شده است.",
  },
  {
    q: "آیا می‌توانم فقط بخشی از یک نیاز را تأمین کنم؟",
    a: "بله. لازم نیست یک نیاز را به‌طور کامل تأمین کنید. می‌توانید به‌اندازه‌ای که برایتان امکان‌پذیر است در تأمین آن مشارکت کنید.",
  },
  {
    q: "بعد از مشارکت، چطور می‌توانم وضعیت تأمین را ببینم؟",
    a: "پس از ثبت مشارکت، اطلاعات آن در حساب کاربری شما قرار می‌گیرد و از بخش «مشارکت‌های من» می‌توانید وضعیت را دنبال کنید.",
  },
  {
    q: "تفاوت «تأمین یک نیاز» با خرید از فروشگاه چیست؟",
    a: "در «نیازها» مشارکت شما مستقیماً برای تأمین همان نیاز در نظر گرفته می‌شود؛ در «فروشگاه» خرید عادی انجام می‌دهید و بخشی از سود صرف تأمین نیازها می‌شود.",
  },
];

export async function generateMetadata(props: PageProps<"/needs/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const need = await getNeedById(id);
  return { title: need?.title ?? "جزئیات نیاز" };
}

export default async function NeedDetailPage(props: PageProps<"/needs/[id]">) {
  const { id } = await props.params;
  const need = await getNeedById(id);
  if (!need) notFound();

  const pct = Math.round((need.fulfilled / need.needed) * 100);
  const remaining = need.needed - need.fulfilled;
  const allNeeds = await getAllNeeds();
  const similar = allNeeds.filter((n) => n.id !== need.id && n.category === need.category).slice(0, 3);
  const listHref = need.audience === "school" ? "/needs/schools" : "/needs";

  return (
    <>
      <Container className="py-8 sm:py-10">
        <Breadcrumb
          items={[
            { label: "خانه", href: "/" },
            { label: "نیازها", href: "/needs" },
            { label: need.audience === "school" ? "مدارس" : "دانش‌آموزان", href: listHref },
            { label: need.title },
          ]}
        />

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge variant="neutral">{need.audience === "school" ? "نیاز مدرسه" : "نیاز دانش‌آموز"}</Badge>
                <h1 className="mt-3 text-2xl font-extrabold text-ink-900 sm:text-[28px]">{need.title}</h1>
                <p className="mt-2 text-sm text-ink-500">
                  {need.beneficiary} — {need.location}
                </p>
              </div>
              <IconTile tone="brand" className="h-16 w-16 shrink-0">
                {categoryIcon[need.category]}
              </IconTile>
            </div>

            <p className="mt-5 text-sm leading-8 text-ink-600">{need.description}</p>

            <div className="mt-7 rounded-card border border-brand-100 bg-white p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-ink-900">وضعیت تأمین</span>
                <span className="font-bold text-brand-700">{pct}٪ تأمین شده</span>
              </div>
              <div className="mt-3">
                <ProgressBar value={pct} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-brand-50 py-3">
                  <p className="text-lg font-extrabold text-ink-900">{formatNumber(need.needed)}</p>
                  <p className="text-[11px] text-ink-500">موردنیاز ({need.unit})</p>
                </div>
                <div className="rounded-xl bg-brand-50 py-3">
                  <p className="text-lg font-extrabold text-ink-900">{formatNumber(need.fulfilled)}</p>
                  <p className="text-[11px] text-ink-500">تأمین‌شده</p>
                </div>
                <div className="rounded-xl bg-gold-100 py-3">
                  <p className="text-lg font-extrabold text-ink-900">{formatNumber(remaining)}</p>
                  <p className="text-[11px] text-ink-500">باقی‌مانده</p>
                </div>
              </div>
            </div>

            <div className="mt-7">
              <h2 className="text-base font-bold text-ink-900">چرا این نیاز مهم است؟</h2>
              <p className="mt-2 text-sm leading-7 text-ink-500">{need.whyItMatters}</p>
            </div>

            {need.beneficiaryMeta && (
              <div className="mt-7">
                <h2 className="text-base font-bold text-ink-900">
                  دربارهٔ {need.audience === "school" ? "مدرسه" : "دانش‌آموزان"}
                </h2>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {need.beneficiaryMeta.map((m) => (
                    <div key={m.label} className="rounded-xl border border-brand-100 bg-white p-3 text-center">
                      <p className="text-xs font-bold text-ink-900">{m.value}</p>
                      <p className="mt-1 text-[11px] text-ink-500">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10">
              <h2 className="mb-4 text-base font-bold text-ink-900">وضعیت مشارکت</h2>
              <Timeline
                steps={[
                  { label: "مشارکت ثبت شد", state: "done" },
                  { label: "در حال تأمین", state: pct >= 100 ? "done" : "active" },
                  { label: "تأمین شد", state: pct >= 100 ? "done" : "upcoming" },
                ]}
              />
            </div>
          </div>

          {/* ستون مشارکت */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-card border border-brand-100 bg-white p-6 shadow-[0_20px_40px_-24px_rgba(16,44,31,0.35)]">
              <h3 className="text-base font-bold text-ink-900">در تأمین این نیاز سهیم شوید</h3>
              <p className="mt-1.5 text-xs leading-6 text-ink-500">
                می‌توانید بخشی از نیاز را تأمین کنید، کل نیاز باقی‌مانده را تأمین کنید یا از اعتبار خود استفاده کنید.
              </p>

              <NeedContributionForm
                needId={need.id}
                lineItemId={need.lineItemId}
                remaining={remaining}
                unit={need.unit}
              />
            </div>
          </div>
        </div>
      </Container>

      {similar.length > 0 && (
        <section className="bg-brand-50/60 py-14">
          <Container>
            <SectionHeading eyebrow="نیازهای مشابه" title="مدارس دیگری هم به کمک نیاز دارند." />
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {similar.map((n) => (
                <NeedCard key={n.id} need={n} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="py-14">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="پرسش‌های متداول" title="سوالی دارید؟" />
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
          <div className="relative overflow-hidden rounded-card bg-gradient-to-l from-brand-700 to-brand-900 px-8 py-12 text-center sm:px-14 sm:py-16">
            <div className="pointer-events-none absolute -left-10 -top-10 h-52 w-52 rounded-full bg-gold-400/20 blur-3xl" />
            <div className="relative">
              <h2 className="text-balance text-2xl font-extrabold text-white sm:text-3xl">
                هنوز نیازهایی برای تأمین وجود دارد.
              </h2>
              <div className="mt-6 flex justify-center">
                <ButtonLink href="/needs/schools" variant="gold" size="lg">
                  مشاهده نیازهای مدارس
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
