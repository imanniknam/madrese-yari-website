import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/domain/page-header";
import { SectionHeading } from "@/components/domain/section-heading";
import { ButtonLink } from "@/components/ui/button-link";
import { IconTile } from "@/components/illustrations/icon-tile";
import { BackpackIcon, BoxIcon, CoinIcon } from "@/components/illustrations/category-icons";
import { waysToHelp } from "@/lib/mock-data";

export const metadata: Metadata = { title: "چطور کار می‌کند؟" };

const steps = [
  { n: "۱", title: "نیاز را پیدا کنید", desc: "نیازهای ثبت‌شدهٔ دانش‌آموزان و مدارس را ببینید و موردی را که می‌خواهید در تأمین آن مشارکت کنید، انتخاب کنید." },
  { n: "۲", title: "شیوهٔ مشارکت را انتخاب کنید", desc: "می‌توانید مبلغ موردنظر خود را برای تأمین یک کالای مشخص اختصاص دهید یا مستقیماً کالا تهیه کنید." },
  { n: "۳", title: "انتخاب به دانش‌آموز می‌رسد", desc: "در مدل اعتباری، اعتبار در اختیار دانش‌آموز قرار می‌گیرد تا کالاهای موردنیاز خود را از میان گزینه‌های موجود انتخاب کند." },
  { n: "۴", title: "نیاز تأمین می‌شود", desc: "کالا تهیه و در اختیار دانش‌آموز یا مدرسه قرار می‌گیرد." },
];

const icons = { shop: <BackpackIcon />, direct: <BoxIcon />, credit: <CoinIcon /> };
const tones = { shop: "brand" as const, direct: "sand" as const, credit: "gold" as const };

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="مدرسه‌یاری چگونه کار می‌کند؟"
        title="از یک نیاز مشخص تا یک کمک مؤثر."
        description="در تمام مسیرهای مدرسه‌یاری، یک اصل ثابت تکرار می‌شود: نیاز مشخص → انتخاب آگاهانه → اثر قابل پیگیری."
        breadcrumb={[{ label: "خانه", href: "/" }, { label: "چطور کار می‌کند؟" }]}
      />

      <section className="py-14 sm:py-16">
        <Container>
          <SectionHeading eyebrow="فرآیند" title="چهار گام تا کمک مؤثر" align="center" />
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
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

      <section className="bg-brand-50/60 py-14 sm:py-16">
        <Container>
          <SectionHeading eyebrow="سه راه مشارکت" title="هرکس به شیوهٔ خودش" align="center" />
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {waysToHelp.map((way) => (
              <div key={way.id} className="rounded-card border border-brand-100 bg-white p-6">
                <IconTile tone={tones[way.id as keyof typeof tones]}>{icons[way.id as keyof typeof icons]}</IconTile>
                <h3 className="mt-4 text-base font-bold text-ink-900">{way.title}</h3>
                <p className="mt-2 text-sm leading-7 text-ink-500">{way.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <ButtonLink href="/help">شروع کنید</ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
