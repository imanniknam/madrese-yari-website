import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/field";
import { formatDate, formatNumber } from "@/lib/utils";
import { getAllNeedsForAdmin } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import type { NeedStatus } from "@prisma/client";

export const metadata: Metadata = { title: "مدیریت نیازها" };

const STATUS_LABEL: Record<NeedStatus, string> = {
  NEW: "تازه ثبت‌شده",
  IN_PROGRESS: "در حال تأمین",
  NEAR_COMPLETE: "نزدیک به تکمیل",
  FULFILLED: "تأمین‌شده",
  CLOSED: "بسته‌شده",
};

const STATUS_OPTIONS: NeedStatus[] = ["NEW", "IN_PROGRESS", "NEAR_COMPLETE", "FULFILLED", "CLOSED"];

async function updateNeedStatusAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  const status = formData.get("status") as NeedStatus;
  await prisma.need.update({ where: { id }, data: { status } });
  revalidatePath("/admin/needs");
  revalidatePath("/admin");
}

export default async function AdminNeedsPage() {
  const needs = await getAllNeedsForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-extrabold text-ink-900">مدیریت نیازها</h1>
        <p className="mt-1 text-sm text-ink-500">{formatNumber(needs.length)} نیاز (۲۰۰ مورد اخیر)</p>
      </div>

      <div className="overflow-x-auto rounded-card border border-brand-100 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-100 text-right text-xs text-ink-500">
              <th className="p-4 font-medium">عنوان نیاز</th>
              <th className="p-4 font-medium">مدرسه</th>
              <th className="p-4 font-medium">تأمین</th>
              <th className="p-4 font-medium">تاریخ</th>
              <th className="p-4 font-medium">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {needs.map((n) => {
              const line = n.lineItems[0];
              return (
                <tr key={n.id} className="border-b border-brand-50 last:border-0">
                  <td className="p-4 font-bold text-ink-900">{n.title}</td>
                  <td className="p-4 text-ink-500">{n.school?.name ?? "—"}</td>
                  <td className="p-4 text-ink-500">
                    {line ? `${formatNumber(line.qtyFulfilled)} از ${formatNumber(line.qtyNeeded)} ${line.unit}` : "—"}
                  </td>
                  <td className="p-4 text-ink-500">{formatDate(n.createdAt)}</td>
                  <td className="p-4">
                    <form action={updateNeedStatusAction} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={n.id} />
                      <Select name="status" defaultValue={n.status} className="h-9 text-xs">
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
