import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";
import { formatNumber } from "@/lib/utils";
import { getAdminStats } from "@/lib/data";

export const metadata: Metadata = { title: "پنل مدیریت" };

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  const cards = [
    { label: "درخواست ثبت نیاز در انتظار بررسی", value: stats.pendingRequests, highlight: stats.pendingRequests > 0 },
    { label: "کل نیازهای ثبت‌شده", value: stats.totalNeeds },
    { label: "نیازهای فعال", value: stats.activeNeeds },
    { label: "کالای فروشگاه", value: stats.totalProducts },
    { label: "کل سفارش‌ها", value: stats.totalOrders },
    { label: "کاربران", value: stats.totalUsers },
    { label: "پیام‌های تماس با ما", value: stats.contactMessages },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-lg font-extrabold text-ink-900">داشبورد مدیریت</h1>
        <p className="mt-1 text-sm text-ink-500">وضعیت کلی مدرسه‌یاری در یک نگاه.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`rounded-card border p-5 ${c.highlight ? "border-gold-300 bg-gold-100/40" : "border-brand-100 bg-white"}`}
          >
            <p className="text-2xl font-extrabold text-ink-900">{formatNumber(c.value)}</p>
            <p className="mt-1 text-xs text-ink-500">{c.label}</p>
          </div>
        ))}
      </div>

      {stats.pendingRequests > 0 && (
        <div className="rounded-card border border-gold-300 bg-gold-100/40 p-5">
          <p className="text-sm font-bold text-ink-900">
            {formatNumber(stats.pendingRequests)} درخواست ثبت نیاز مدرسه منتظر بررسی شماست.
          </p>
          <ButtonLink href="/admin/school-need-requests" variant="gold" className="mt-3 inline-flex">
            بررسی درخواست‌ها
          </ButtonLink>
        </div>
      )}
    </div>
  );
}
