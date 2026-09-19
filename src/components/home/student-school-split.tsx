import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { formatTokens } from "@/lib/utils";

const creditRows = [
  { label: "کوله‌پشتی", tokens: 200 },
  { label: "کتاب", tokens: 150 },
  { label: "لوازم‌التحریر", tokens: 80 },
];

export function StudentSchoolSplit() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-card bg-brand-800 p-8 text-sand-50 sm:p-10">
          <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
            برای دانش‌آموزان
          </span>
          <h3 className="mt-4 text-xl font-extrabold sm:text-2xl">انتخاب، با خود دانش‌آموز است.</h3>
          <p className="mt-3 text-sm leading-7 text-brand-100">
            در مدل اعتباری مدرسه‌یاری، دانش‌آموز فقط دریافت‌کننده کمک نیست؛ خودش تصمیم می‌گیرد به چه چیزی بیشتر نیاز
            دارد. اعتبار اختصاص‌یافته در حساب او قرار می‌گیرد تا از میان کالاهای واجد شرایط انتخاب کند.
          </p>

          <div className="mt-6 rounded-2xl bg-white/10 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-brand-100">اعتبار قابل استفاده</span>
              <span className="font-bold text-white">{formatTokens(450)}</span>
            </div>
            <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
              {creditRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between text-xs text-brand-100">
                  <span>{row.label}</span>
                  <span>{formatTokens(row.tokens)}</span>
                </div>
              ))}
            </div>
          </div>

          <ButtonLink href="/account/credit" variant="gold" className="mt-6 inline-flex">
            ورود به حساب دانش‌آموز
          </ButtonLink>
        </div>

        <div className="rounded-card border border-brand-100 bg-white p-8 sm:p-10">
          <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
            برای مدارس
          </span>
          <h3 className="mt-4 text-xl font-extrabold text-ink-900 sm:text-2xl">
            نیازهای مدرسه‌تان را ثبت کنید.
          </h3>
          <p className="mt-3 text-sm leading-7 text-ink-500">
            مدارس نیز می‌توانند نیازهای خود را در مدرسه‌یاری ثبت کنند تا برای تأمین آن‌ها اقدام شود؛ از تجهیزات
            کلاس و وسایل آموزشی و کمک‌آموزشی تا سایر تجهیزات موردنیاز برای بهبود فضای یادگیری.
          </p>

          <ul className="mt-6 space-y-3 text-sm text-ink-700">
            {["ثبت نیاز و پیگیری وضعیت تأمین", "سفارش عمده از فروشگاه مدرسه", "گزارش شفاف از تجهیزات دریافتی"].map(
              (item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                  {item}
                </li>
              )
            )}
          </ul>

          <ButtonLink href="/schools/register-need" variant="secondary" className="mt-6 inline-flex">
            ثبت نیاز مدرسه
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
