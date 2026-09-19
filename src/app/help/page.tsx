import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/domain/page-header";
import { SectionHeading } from "@/components/domain/section-heading";
import { ButtonLink } from "@/components/ui/button-link";
import { IconTile } from "@/components/illustrations/icon-tile";
import { BackpackIcon, BoxIcon, CoinIcon } from "@/components/illustrations/category-icons";
import { waysToHelp } from "@/lib/mock-data";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "کمک کن" };

const icons = { shop: <BackpackIcon />, direct: <BoxIcon />, credit: <CoinIcon /> };
const tones = { shop: "brand" as const, direct: "sand" as const, credit: "gold" as const };
const hrefs: Record<string, string> = {
  shop: "/shop",
  direct: "/help/direct-purchase",
  credit: "/help/credit",
};

const steps = [
  { n: "۱", title: "نیاز را پیدا کنید", desc: "نیازهای ثبت‌شدهٔ دانش‌آموزان و مدارس را ببینید." },
  { n: "۲", title: "شیوهٔ مشارکت را انتخاب کنید", desc: "اعتبار، خرید مستقیم کالا یا انتخاب یک نیاز مشخص." },
  { n: "۳", title: "کمک شما ثبت می‌شود", desc: "در حساب کاربری خود وضعیت را پیگیری می‌کنید." },
  { n: "۴", title: "نیاز تأمین می‌شود", desc: "کالا تهیه و در اختیار دانش‌آموز یا مدرسه قرار می‌گیرد." },
];

export default function HelpHubPage() {
  return (
    <>
      <PageHeader
        eyebrow="کمک کن"
        title="با تأمین هر نیاز، لبخند هدیه دهید."
        description="هر مدرسه و هر دانش‌آموز، نیازهای خودش را دارد. اینجا می‌توانید شیوهٔ مشارکت خودتان را انتخاب کنید: از یک دفتر و کوله تا تجهیزات یک کلاس؛ هر انتخاب می‌تواند بخشی از یک نیاز واقعی را تأمین کند."
        breadcrumb={[{ label: "خانه", href: "/" }, { label: "کمک کن" }]}
      />

      <section className="py-14 sm:py-16">
        <Container>
          <SectionHeading eyebrow="سه راه برای کمک" title="شما چطور می‌خواهید کمک کنید؟" align="center" />
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {waysToHelp.map((way) => (
              <div
                key={way.id}
                className="flex flex-col gap-4 rounded-card border border-brand-100 bg-white p-6"
              >
                <IconTile tone={tones[way.id as keyof typeof tones]}>
                  {icons[way.id as keyof typeof icons]}
                </IconTile>
                <div>
                  <h3 className="text-base font-bold text-ink-900">{way.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-ink-500">{way.description}</p>
                </div>
                <ButtonLink href={hrefs[way.id]} variant="secondary" className="mt-auto justify-center">
                  {way.cta}
                  <ArrowLeft size={15} />
                </ButtonLink>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-brand-50/60 py-14 sm:py-16">
        <Container>
          <SectionHeading eyebrow="فرآیند مدرسه‌یاری" title="از یک نیاز مشخص تا یک کمک مؤثر" align="center" />
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

      <section className="py-16">
        <Container className="flex flex-col items-center gap-5 rounded-card bg-brand-900 p-10 text-center sm:p-14">
          <h2 className="text-balance text-xl font-extrabold text-white sm:text-2xl">
            آمادهٔ همراهی ما برای هدیه دادن لبخند هستید؟
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/help/choose-a-need" variant="gold" size="lg">
              انتخاب یک نیاز
            </ButtonLink>
            <ButtonLink
              href="/help/credit"
              size="lg"
              variant="secondary"
              className="border-white/30 bg-transparent text-white hover:bg-white/10"
            >
              کمک با اعتبار
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
