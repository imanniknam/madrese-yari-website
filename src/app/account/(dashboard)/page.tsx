import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Badge } from "@/components/ui/badge";
import { formatToman, formatTokens, formatNumber } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { getUserById, getOrdersByUserId, getContributionsByUserId, getCreditGrantsByDonorId, getNeedsBySchool } from "@/lib/data";

export const metadata: Metadata = { title: "حساب من" };

const ORDER_STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT: "در انتظار پرداخت",
  CONFIRMED: "تأییدشده",
  PROCESSING: "در حال آماده‌سازی",
  READY_TO_SHIP: "آماده ارسال",
  SHIPPED: "ارسال‌شده",
  DELIVERED: "تحویل‌شده",
  CANCELLED: "لغوشده",
  PAYMENT_FAILED: "پرداخت ناموفق",
};

export default async function AccountDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/account/login?callbackUrl=/account");
  const userId = session.user.id as string;
  const role = (session.user as { role?: string }).role;

  const [user, orders, contributions, creditGrants] = await Promise.all([
    getUserById(userId),
    getOrdersByUserId(userId),
    getContributionsByUserId(userId),
    getCreditGrantsByDonorId(userId),
  ]);

  const schoolNeeds = user?.schoolProfile ? await getNeedsBySchool(user.schoolProfile.id) : [];

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "کاربر مدرسه‌یاری";
  const activeOrders = orders.filter((o) => !["DELIVERED", "CANCELLED", "PAYMENT_FAILED"].includes(o.status)).length;
  const creditBalance = user?.studentProfile?.creditBalance ?? 0;
  const cashDonatedViaContributions = contributions
    .filter((c) => c.type === "CASH_TO_CREDIT" && c.amountToman)
    .reduce((s, c) => s + (c.amountToman ?? 0), 0);
  const cashDonatedViaCreditGrants = creditGrants.reduce((s, g) => s + g.amountToman, 0);
  const cashDonated = cashDonatedViaContributions + cashDonatedViaCreditGrants;
  const totalContributions = contributions.length + creditGrants.length;

  const firstStat =
    role === "STUDENT"
      ? { label: "اعتبار فعلی", value: formatTokens(creditBalance) }
      : role === "SCHOOL"
        ? { label: "نیازهای منتشرشده", value: formatNumber(schoolNeeds.length) }
        : { label: "کمک نقدی ثبت‌شده", value: formatToman(cashDonated) };

  return (
    <div className="space-y-8">
      <div className="rounded-card bg-brand-800 p-6 text-sand-50 sm:p-8">
        <p className="text-sm text-brand-100">سلام {displayName} 👋</p>
        <h1 className="mt-1 text-xl font-extrabold sm:text-2xl">خوش آمدید به حساب کاربری‌تان</h1>
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white/10 p-4 text-center">
            <p className="text-lg font-extrabold">{firstStat.value}</p>
            <p className="mt-1 text-[11px] text-brand-100">{firstStat.label}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 text-center">
            <p className="text-lg font-extrabold">{formatNumber(activeOrders)}</p>
            <p className="mt-1 text-[11px] text-brand-100">سفارش فعال</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 text-center">
            <p className="text-lg font-extrabold">{formatNumber(totalContributions)}</p>
            <p className="mt-1 text-[11px] text-brand-100">مشارکت در نیازها</p>
          </div>
        </div>
      </div>

      {role === "SCHOOL" && user?.schoolProfile && !user.schoolProfile.verified && (
        <div className="flex items-start gap-2 rounded-card border border-gold-300 bg-gold-100/40 p-4 text-sm text-ink-700">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-gold-600" />
          <span>پروفایل مدرسهٔ شما هنوز توسط تیم مدرسه‌یاری تأیید نشده است.</span>
        </div>
      )}

      <div className="rounded-card border border-brand-100 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-ink-900">سفارش‌های اخیر</h2>
          <ButtonLink href="/account/orders" variant="link">
            مشاهده همه
          </ButtonLink>
        </div>
        <div className="mt-4 space-y-3">
          {orders.length === 0 && <p className="text-sm text-ink-500">هنوز سفارشی ثبت نکرده‌اید.</p>}
          {orders.slice(0, 3).map((o) => (
            <div key={o.id} className="flex items-center justify-between rounded-xl border border-brand-100 p-4">
              <div>
                <p className="text-sm font-bold text-ink-900">سفارش #{o.orderNumber}</p>
                <p className="mt-1 text-xs text-ink-500">{o.items.length} قلم کالا</p>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-ink-900">{formatToman(o.totalToman)}</p>
                <Badge variant={o.status === "DELIVERED" ? "brand" : "gold"} className="mt-1">
                  {ORDER_STATUS_LABEL[o.status] ?? o.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
