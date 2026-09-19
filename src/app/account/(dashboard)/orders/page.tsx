import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { formatDate, formatToman } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { getOrdersByUserId, getUserById } from "@/lib/data";
import { schoolOrders, orderStatusBadge, schoolOrderShippingCost } from "@/lib/mock-data";
import type { OrderStatus as DbOrderStatus } from "@prisma/client";

export const metadata: Metadata = { title: "سفارش‌های من" };

const ORDER_STATUS_LABEL: Record<DbOrderStatus, string> = {
  PENDING_PAYMENT: "در انتظار پرداخت",
  CONFIRMED: "تأییدشده",
  PROCESSING: "در حال آماده‌سازی",
  READY_TO_SHIP: "آماده ارسال",
  SHIPPED: "ارسال‌شده",
  DELIVERED: "تحویل‌شده",
  CANCELLED: "لغوشده",
  PAYMENT_FAILED: "پرداخت ناموفق",
};

const ORDER_STATUS_VARIANT: Record<DbOrderStatus, "brand" | "gold" | "neutral"> = {
  PENDING_PAYMENT: "neutral",
  CONFIRMED: "gold",
  PROCESSING: "gold",
  READY_TO_SHIP: "gold",
  SHIPPED: "brand",
  DELIVERED: "brand",
  CANCELLED: "neutral",
  PAYMENT_FAILED: "neutral",
};

export default async function AccountOrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/account/login?callbackUrl=/account/orders");
  const userId = session.user.id as string;

  const [orders, user] = await Promise.all([getOrdersByUserId(userId), getUserById(userId)]);

  return (
    <div className="space-y-8">
      <div className="rounded-card border border-brand-100 bg-white p-6">
        <h1 className="text-base font-bold text-ink-900">سفارش‌های دانش‌آموزی من</h1>
        {orders.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-brand-100 p-6 text-center">
            <p className="text-sm text-ink-500">هنوز سفارشی ثبت نکرده‌اید.</p>
            <ButtonLink href="/shop/student" variant="secondary" size="sm" className="mt-4">
              رفتن به فروشگاه دانش‌آموزی
            </ButtonLink>
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[620px] text-sm">
              <thead>
                <tr className="border-b border-brand-100 text-right text-xs text-ink-500">
                  <th className="pb-3 font-medium">کد سفارش</th>
                  <th className="pb-3 font-medium">تاریخ</th>
                  <th className="pb-3 font-medium">تعداد اقلام</th>
                  <th className="pb-3 font-medium">مبلغ</th>
                  <th className="pb-3 font-medium">وضعیت</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-brand-50 last:border-0">
                    <td className="py-3.5 font-bold text-ink-900">#{o.orderNumber}</td>
                    <td className="py-3.5 text-ink-500">{formatDate(o.createdAt)}</td>
                    <td className="py-3.5 text-ink-500">{o.items.length}</td>
                    <td className="py-3.5 text-ink-900">{formatToman(o.totalToman)}</td>
                    <td className="py-3.5">
                      <Badge variant={ORDER_STATUS_VARIANT[o.status]}>{ORDER_STATUS_LABEL[o.status]}</Badge>
                    </td>
                    <td className="py-3.5 text-left">
                      <ButtonLink href={`/account/orders/${o.id}`} variant="secondary" size="sm">
                        مشاهده جزئیات
                      </ButtonLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* بخش خریدهای مدرسه هنوز از داده‌های آزمایشی (mock-data) استفاده می‌کند؛ تا زمانی که
         بک‌اند سفارش‌های B2B مدرسه پیاده‌سازی شود این بخش به‌صورت نمایشی باقی می‌ماند. */}
      {user?.role === "SCHOOL" && (
        <div className="rounded-card border border-brand-100 bg-white p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-ink-900">خریدهای اخیر مدرسه</h2>
              <p className="mt-1 text-xs leading-6 text-ink-500">
                این بخش باعث می‌شود مدرسه برای سفارش‌های تکراری مجبور نباشد هر بار کالاها را ابتدا پیدا کند.
              </p>
            </div>
            <ButtonLink href="/shop/school" variant="secondary" size="sm" className="shrink-0">
              فروشگاه مدرسه
            </ButtonLink>
          </div>

          <div className="mt-5 space-y-3">
            {schoolOrders.map((o) => {
              const amount = o.items.reduce((s, i) => s + i.product.priceToman * i.qty, 0) + schoolOrderShippingCost;
              const canReorder = o.status === "تحویل‌شده";
              return (
                <div
                  key={o.id}
                  className="flex flex-col gap-3 rounded-xl border border-brand-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-bold text-ink-900">سفارش #{o.code}</p>
                    <p className="mt-1 text-xs text-ink-500">
                      {o.date} · {o.items.length} قلم کالا
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-left">
                      <p className="text-sm font-bold text-ink-900">{formatToman(amount)}</p>
                      <Badge variant={orderStatusBadge[o.status]} className="mt-1">
                        {o.status}
                      </Badge>
                    </div>
                    <ButtonLink href={`/account/orders/${o.id}`} variant="secondary" size="sm">
                      مشاهده جزئیات
                    </ButtonLink>
                    {canReorder && (
                      <Button size="sm" variant="ghost" title="کالاهای این سفارش دوباره به سبد خرید اضافه می‌شوند.">
                        <RefreshCw size={14} />
                        خرید مجدد
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
