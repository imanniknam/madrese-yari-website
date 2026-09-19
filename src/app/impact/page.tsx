import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/domain/page-header";
import { StatBlock } from "@/components/domain/stat-block";
import { SectionHeading } from "@/components/domain/section-heading";
import { getImpactStats } from "@/lib/data";

export const metadata: Metadata = { title: "اثر کمک من" };

const breakdown = [
  { label: "کوله‌پشتی و کیف", value: 24500 },
  { label: "لوازم‌التحریر", value: 31200 },
  { label: "کتاب و منابع آموزشی", value: 18800 },
  { label: "تجهیزات کلاس و آزمایشگاه", value: 9600 },
  { label: "سایر", value: 2900 },
];

export default async function ImpactPage() {
  const impactStats = await getImpactStats();

  return (
    <>
      <PageHeader
        eyebrow="اثرگذاری"
        title="کمک شما، قابل پیگیری است."
        description="در مدرسه‌یاری، تلاش می‌کنیم مسیر کمک‌ها روشن باشد؛ از نیاز ثبت‌شده تا کالایی که تأمین شده است."
        breadcrumb={[{ label: "خانه", href: "/" }, { label: "اثر کمک من" }]}
      >
        <div className="mt-6 flex flex-wrap gap-8 rounded-2xl bg-white/10 p-5">
          {impactStats.map((s) => (
            <StatBlock key={s.key} value={s.value} label={s.label} />
          ))}
        </div>
      </PageHeader>

      <section className="py-14 sm:py-16">
        <Container>
          <SectionHeading eyebrow="گزارش عملکرد" title="کالاهای تأمین‌شده به تفکیک نوع" />
          <div className="mt-8 space-y-4">
            {breakdown.map((b) => {
              const pct = Math.round((b.value / 87000) * 100);
              return (
                <div key={b.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-ink-700">{b.label}</span>
                    <span className="text-ink-500">{new Intl.NumberFormat("fa-IR").format(b.value)} قلم</span>
                  </div>
                  <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-brand-100">
                    <div className="h-full rounded-full bg-brand-600" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
