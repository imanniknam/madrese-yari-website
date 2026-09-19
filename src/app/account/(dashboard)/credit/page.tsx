import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { ProductCard } from "@/components/domain/product-card";
import { formatTokens, formatDate } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { getStudentProfileByUserId, getTokenLedgerByStudentId, getFeaturedProducts } from "@/lib/data";

export const metadata: Metadata = { title: "اعتبار من" };

export default async function AccountCreditPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/account/login?callbackUrl=/account/credit");
  const userId = session.user.id as string;

  const student = await getStudentProfileByUserId(userId);

  if (!student) {
    return (
      <div className="rounded-card border border-brand-100 bg-white p-8 text-center">
        <h1 className="text-base font-bold text-ink-900">این بخش مخصوص حساب‌های دانش‌آموزی است</h1>
        <p className="mt-2 text-sm text-ink-500">
          اعتبار مدرسه‌یاری فقط برای دانش‌آموزانی که از طرف خیرین اعتبار دریافت کرده‌اند فعال می‌شود.
        </p>
      </div>
    );
  }

  const [ledger, products] = await Promise.all([getTokenLedgerByStudentId(student.id), getFeaturedProducts()]);
  const affordable = products.filter((p) => p.tokenPrice && p.tokenPrice <= student.creditBalance);

  return (
    <div className="space-y-8">
      <div className="rounded-card bg-gradient-to-l from-brand-700 to-brand-900 p-6 text-white sm:p-8">
        <p className="text-sm text-brand-100">اعتبار قابل استفادهٔ شما</p>
        <p className="mt-2 text-4xl font-extrabold">{formatTokens(student.creditBalance)}</p>
        <ButtonLink href="/shop/student" variant="gold" className="mt-5 inline-flex">
          خرید بعدی؟
        </ButtonLink>
      </div>

      {affordable.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-ink-900">با این اعتبار چه می‌توانید بگیرید؟</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {affordable.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      <div className="rounded-card border border-brand-100 bg-white p-6">
        <h2 className="text-sm font-bold text-ink-900">تاریخچهٔ تراکنش‌ها</h2>
        <div className="mt-4 space-y-2">
          {ledger.length === 0 && <p className="text-sm text-ink-500">هنوز تراکنشی ثبت نشده است.</p>}
          {ledger.map((l) => (
            <div key={l.id} className="flex items-center justify-between rounded-xl border border-brand-100 p-3.5">
              <div className="flex items-center gap-3">
                <span
                  className={
                    l.delta > 0
                      ? "flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-700"
                      : "flex h-9 w-9 items-center justify-center rounded-full bg-gold-100 text-gold-700"
                  }
                >
                  {l.delta > 0 ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                </span>
                <div>
                  <p className="text-[13px] font-bold text-ink-900">
                    {l.reason === "GRANT" ? "اعتبار دریافتی از مدرسه‌یاری" : l.reason === "SPEND" ? "خرید از فروشگاه دانش‌آموزی" : "بازگشت اعتبار"}
                  </p>
                  <p className="text-[11px] text-ink-500">{formatDate(l.createdAt)}</p>
                </div>
              </div>
              <span className={l.delta > 0 ? "text-sm font-bold text-brand-700" : "text-sm font-bold text-ink-700"}>
                {l.delta > 0 ? "+" : ""}
                {formatTokens(l.delta)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
