import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/domain/section-heading";

const steps = [
  { n: "۱", title: "نیاز را پیدا کنید", desc: "نیازهای ثبت‌شدهٔ دانش‌آموزان و مدارس را ببینید و موردی را انتخاب کنید." },
  { n: "۲", title: "شیوهٔ مشارکت را انتخاب کنید", desc: "مبلغ موردنظر را برای تأمین یک کالای مشخص اختصاص دهید یا مستقیماً کالا تهیه کنید." },
  { n: "۳", title: "انتخاب به دانش‌آموز می‌رسد", desc: "در مدل اعتباری، اعتبار در اختیار دانش‌آموز قرار می‌گیرد تا خودش انتخاب کند." },
  { n: "۴", title: "نیاز تأمین می‌شود", desc: "کالا تهیه و در اختیار دانش‌آموز یا مدرسه قرار می‌گیرد." },
];

export function ProcessSteps() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="فرآیند مدرسه‌یاری"
          title="از یک نیاز مشخص تا یک کمک مؤثر"
          align="center"
        />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.n} className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-700 text-lg font-extrabold text-white">
                {step.n}
              </div>
              <h3 className="mt-4 text-[15px] font-bold text-ink-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-7 text-ink-500">{step.desc}</p>
              {i < steps.length - 1 && (
                <div className="absolute top-6 left-[-28px] hidden h-px w-14 bg-brand-200 lg:block" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <ButtonLink href="/how-it-works" variant="secondary" size="lg">
            مدرسه‌یاری چگونه کار می‌کند؟
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
