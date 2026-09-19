import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/field";
import { formatDate, formatToman, formatNumber } from "@/lib/utils";
import { getAllOrdersForAdmin } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@prisma/client";

export const metadata: Metadata = { title: "سفارش‌ها (مدیریت)" };

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "در انتظار پرداخت",
  CONFIRMED: "تأییدشده",
  PROCESSING: "در حال آماده‌سازی",
  READY_TO_SHIP: "آماده ارسال",
  SHIPPED: "ارسال‌شده",
  DELIVERED: "تحویل‌شده",
  CANCELLED: "لغوشده",
  PAYMENT_FAILED: "پرداخت ناموفق",
};

const STATUS_OPTIONS: OrderStatus[] = [
  "PENDING_PAYMENT",
  "CONFIRMED",
  "PROCESSING",
  "READY_TO_SHIP",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "PAYMENT_FAILED",
];

async function updateStatusAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  const status = formData.get("status") as OrderStatus;
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
}

export default async function AdminOrdersPage() {
  const orders = await getAllOrdersForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-extrabold text-ink-900">سفارش‌ها</h1>
        <p className="mt-1 text-sm text-ink-500">{formatNumber(orders.length)} سفارش (۱۰۰ مورد اخیر)</p>
      </div>

      {orders.length === 0 && (
        <div className="rounded-card border border-brand-100 bg-white p-8 text-center text-sm text-ink-500">
          هنوز سفارشی ثبت نشده است.
        </div>
      )}

      <div className="overflow-x-auto rounded-card border border-brand-100 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-100 text-right text-xs text-ink-500">
              <th className="p-4 font-medium">کد سفارش</th>
              <th className="p-4 font-medium">مشتری</th>
              <th className="p-4 font-medium">نوع خریدار</th>
              <th className="p-4 font-medium">تاریخ</th>
              <th className="p-4 font-medium">اقلام</th>
              <th className="p-4 font-medium">مبلغ</th>
              <th className="p-4 font-medium">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-brand-50 last:border-0">
                <td className="p-4 font-bold text-ink-900">#{o.orderNumber}</td>
                <td className="p-4 text-ink-700">
                  {o.user.firstName} {o.user.lastName}
                </td>
                <td className="p-4 text-ink-500">{o.buyerType}</td>
                <td className="p-4 text-ink-500">{formatDate(o.createdAt)}</td>
                <td className="p-4 text-ink-500">{formatNumber(o.items.length)} قلم</td>
                <td className="p-4 font-bold text-ink-900">{formatToman(o.totalToman)}</td>
                <td className="p-4">
                  <form action={updateStatusAction} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={o.id} />
                    <Select name="status" defaultValue={o.status} className="h-9 text-xs">
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </option>
                      ))}
                    </Select>
                    <Button type="submit" size="sm" variant="secondary">
                      ثبت
                    </Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
