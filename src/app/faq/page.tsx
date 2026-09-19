import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/domain/page-header";

export const metadata: Metadata = { title: "سوالات متداول" };

const groups = [
  {
    title: "دربارهٔ مدرسه‌یاری",
    items: [
      { q: "مدرسه‌یاری چیست؟", a: "پلتفرمی که نیازهای واقعی دانش‌آموزان و مدارس را به کمک‌های هدفمند و قابل‌پیگیری متصل می‌کند." },
      { q: "چه کسانی می‌توانند از مدرسه‌یاری استفاده کنند؟", a: "خیرین، دانش‌آموزان و مدارس؛ هرکدام با نقش و امکانات مخصوص به خودشان." },
    ],
  },
  {
    title: "نیازها و مشارکت",
    items: [
      { q: "آیا می‌توانم فقط بخشی از یک نیاز را تأمین کنم؟", a: "بله، می‌توانید به‌اندازه‌ای که برایتان امکان‌پذیر است در تأمین آن مشارکت کنید." },
      { q: "اگر یک نیاز قبل از مشارکت من کامل شود، چه اتفاقی می‌افتد؟", a: "امکان مشارکت در آن نیاز وجود نخواهد داشت و می‌توانید یکی دیگر از نیازهای فعال را انتخاب کنید." },
    ],
  },
  {
    title: "پرداخت و اعتبار",
    items: [
      { q: "توکن یا اعتبار دانش‌آموزی چیست؟", a: "معادل ریالی کمک مالی خیرین است که در حساب دانش‌آموز قرار می‌گیرد تا خودش کالای موردنیازش را انتخاب کند." },
      { q: "پرداخت‌های آنلاین چگونه انجام می‌شود؟", a: "از طریق درگاه آنلاین زرین‌پال و با بالاترین استانداردهای امنیتی." },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="سوالات متداول"
        title="پاسخ سوالات رایج شما"
        breadcrumb={[{ label: "خانه", href: "/" }, { label: "سوالات متداول" }]}
      />
      <Container className="max-w-3xl py-12">
        {groups.map((g) => (
          <div key={g.title} className="mb-10">
            <h2 className="mb-4 text-base font-extrabold text-ink-900">{g.title}</h2>
            <div className="space-y-3">
              {g.items.map((item) => (
                <details key={item.q} className="group rounded-2xl border border-brand-100 bg-white p-4 open:shadow-sm">
                  <summary className="cursor-pointer list-none text-sm font-bold text-ink-900">{item.q}</summary>
                  <p className="mt-2 text-sm leading-7 text-ink-500">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        ))}
      </Container>
    </>
  );
}
