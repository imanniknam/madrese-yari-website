import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/domain/page-header";
import { SectionHeading } from "@/components/domain/section-heading";

export const metadata: Metadata = { title: "درباره ما" };

const values = [
  { title: "نیاز مشخص", desc: "هر کمک، به یک نیاز واقعی و مشخص متصل است؛ نه یک عدد کلی." },
  { title: "انتخاب آگاهانه", desc: "خیر و دانش‌آموز، هر دو آگاهانه انتخاب می‌کنند که کجا و چطور مشارکت کنند." },
  { title: "اثر قابل پیگیری", desc: "مسیر هر کمک از ثبت نیاز تا تأمین نهایی، شفاف و قابل پیگیری است." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="درباره ما"
        title="مدرسه‌یاری، زیرمجموعهٔ جامعهٔ خیرین مدرسه‌ساز."
        description="مدرسه‌یاری یک پلتفرم تخصصی برای اتصال نیازهای واقعی دانش‌آموزان و مدارس به کمک‌های هدفمند و قابل‌پیگیری است."
        breadcrumb={[{ label: "خانه", href: "/" }, { label: "درباره ما" }]}
      />
      <Container className="py-14 sm:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeading
            align="center"
            eyebrow="داستان ما"
            title="از یک نیاز واقعی تا یک کمک مؤثر، فاصله زیادی نیست."
            description="در مدرسه‌یاری، هرکس می‌تواند به شیوه‌ای متفاوت در تأمین نیازهای دانش‌آموزان و مدارس مشارکت کند؛ با کمک مالی که به اعتبار تبدیل می‌شود، با تأمین مستقیم کالا یا با خرید از فروشگاهی که بخشی از سودش صرف تأمین نیازها می‌شود."
          />
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="rounded-card border border-brand-100 bg-white p-6 text-center">
              <h3 className="text-base font-bold text-brand-700">{v.title}</h3>
              <p className="mt-2 text-sm leading-7 text-ink-500">{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          <div className="h-40 rounded-card bg-gradient-to-br from-brand-200 to-brand-400" />
          <div className="h-40 rounded-card bg-gradient-to-br from-gold-100 to-gold-300 sm:mt-8" />
          <div className="h-40 rounded-card bg-gradient-to-br from-sand-200 to-sand-300" />
        </div>
      </Container>
    </>
  );
}
