import { Container } from "@/components/ui/container";
import { StatBlock } from "@/components/domain/stat-block";
import { ButtonLink } from "@/components/ui/button-link";
import { getImpactStats } from "@/lib/data";

export async function ImpactBand() {
  const impactStats = await getImpactStats();

  return (
    <section className="bg-brand-900 py-16 sm:py-20">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <h2 className="text-balance text-2xl font-extrabold text-white sm:text-3xl">
            کمک شما، قابل پیگیری است.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-brand-100">
            در مدرسه‌یاری، تلاش می‌کنیم مسیر کمک‌ها روشن باشد؛ از نیاز ثبت‌شده تا کالایی که تأمین شده است.
          </p>
          <ButtonLink href="/impact" variant="gold" className="mt-6 inline-flex">
            مشاهده گزارش عملکرد
          </ButtonLink>
        </div>
        <div className="grid grid-cols-3 gap-4 rounded-card bg-white/5 p-6 sm:p-8">
          {impactStats.map((s) => (
            <StatBlock key={s.key} value={s.value} label={s.label} />
          ))}
        </div>
      </Container>
    </section>
  );
}
