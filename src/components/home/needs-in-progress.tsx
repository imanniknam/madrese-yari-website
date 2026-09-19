import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/domain/section-heading";
import { NeedCard } from "@/components/domain/need-card";
import { ButtonLink } from "@/components/ui/button-link";
import { getHomeNeeds } from "@/lib/data";

export async function NeedsInProgress() {
  const homeNeeds = await getHomeNeeds();

  return (
    <section className="bg-brand-50/60 py-16 sm:py-20">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="نیازهای در حال تأمین"
            title="امروز، چه چیزهایی مورد نیاز است؟"
            description="نیازهای ثبت‌شدهٔ دانش‌آموزان و مدارس را ببینید و در تأمین هرکدام که برایتان اهمیت دارد، مشارکت کنید."
          />
          <ButtonLink href="/needs" variant="secondary" className="hidden sm:inline-flex">
            مشاهده همه نیازها
          </ButtonLink>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {homeNeeds.map((need) => (
            <NeedCard key={need.id} need={need} />
          ))}
        </div>

        <ButtonLink href="/needs" variant="secondary" className="mt-8 flex w-full sm:hidden">
          مشاهده همه نیازها
        </ButtonLink>
      </Container>
    </section>
  );
}
