import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/domain/page-header";
import { SectionHeading } from "@/components/domain/section-heading";
import { IconTile } from "@/components/illustrations/icon-tile";
import { BackpackIcon, BookStackIcon, StationeryIcon } from "@/components/illustrations/category-icons";
import { formatTokens } from "@/lib/utils";
import { CreditHelpForm } from "./credit-help-form";

export const metadata: Metadata = { title: "کمک با اعتبار" };

const sampleGoods = [
  { icon: <BackpackIcon width={22} height={22} />, label: "کوله‌پشتی", tokens: 200 },
  { icon: <BookStackIcon width={22} height={22} />, label: "کتاب", tokens: 150 },
  { icon: <StationeryIcon width={22} height={22} />, label: "لوازم‌التحریر", tokens: 80 },
];

export default function CreditHelpPage() {
  return (
    <>
      <PageHeader
        eyebrow="کمک با اعتبار"
        title="مبلغ موردنظر خود را به اعتبار یک دانش‌آموز تبدیل کنید."
        description="مبلغی که اختصاص می‌دهید برای تأمین کالاهای مشخص محاسبه و به اعتبار تبدیل می‌شود. این اعتبار در اختیار دانش‌آموز قرار می‌گیرد تا از میان کالاهای واجد شرایط، نیاز خود را انتخاب کند."
        breadcrumb={[{ label: "خانه", href: "/" }, { label: "کمک کن", href: "/help" }, { label: "کمک با اعتبار" }]}
      />

      <Container className="py-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-card border border-brand-100 bg-white p-6 sm:p-8">
            <CreditHelpForm />
          </div>

          <div>
            <SectionHeading
              eyebrow="نمونهٔ نمایش اعتبار"
              title="این اعتبار چه چیزهایی را پوشش می‌دهد؟"
              description="دانش‌آموز از میان کالاهای واجد شرایط، نیاز خودش را انتخاب می‌کند."
            />
            <div className="mt-6 space-y-3">
              {sampleGoods.map((g) => (
                <div
                  key={g.label}
                  className="flex items-center justify-between rounded-2xl border border-brand-100 bg-white p-4"
                >
                  <div className="flex items-center gap-3">
                    <IconTile tone="brand" className="h-11 w-11 rounded-xl">
                      {g.icon}
                    </IconTile>
                    <span className="text-sm font-bold text-ink-900">{g.label}</span>
                  </div>
                  <span className="text-sm font-bold text-brand-700">{formatTokens(g.tokens)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
