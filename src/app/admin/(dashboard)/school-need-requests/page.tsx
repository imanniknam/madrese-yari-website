import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatNumber } from "@/lib/utils";
import { getSchoolNeedRequests } from "@/lib/data";
import { approveSchoolNeedRequest, rejectSchoolNeedRequest } from "@/lib/domain/school-need-requests";

export const metadata: Metadata = { title: "درخواست‌های ثبت نیاز مدرسه" };

const STATUS_LABEL = {
  SUBMITTED: "ثبت شده",
  UNDER_REVIEW: "در حال بررسی",
  APPROVED: "تأیید شده",
  REJECTED: "رد شده",
} as const;

const STATUS_VARIANT = {
  SUBMITTED: "gold",
  UNDER_REVIEW: "gold",
  APPROVED: "brand",
  REJECTED: "neutral",
} as const;

async function approveAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  await approveSchoolNeedRequest(id, "تأیید شد و نیاز در سایت منتشر شد.");
  revalidatePath("/admin/school-need-requests");
  revalidatePath("/admin");
}

async function rejectAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  await rejectSchoolNeedRequest(id, "درخواست پس از بررسی رد شد.");
  revalidatePath("/admin/school-need-requests");
  revalidatePath("/admin");
}

export default async function AdminSchoolNeedRequestsPage() {
  const requests = await getSchoolNeedRequests();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-extrabold text-ink-900">درخواست‌های ثبت نیاز مدرسه</h1>
        <p className="mt-1 text-sm text-ink-500">{formatNumber(requests.length)} درخواست ثبت‌شده</p>
      </div>

      {requests.length === 0 && (
        <div className="rounded-card border border-brand-100 bg-white p-8 text-center text-sm text-ink-500">
          هنوز درخواستی ثبت نشده است.
        </div>
      )}

      <div className="space-y-4">
        {requests.map((r) => (
          <div key={r.id} className="rounded-card border border-brand-100 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs text-ink-500">کد #{r.code}</p>
                <h2 className="mt-1 text-sm font-bold text-ink-900">
                  {r.schoolName} — {r.itemTitle} ({formatNumber(r.itemQty)} عدد)
                </h2>
                <p className="mt-1 text-xs text-ink-500">
                  {r.province}، {r.city} · {r.contactName} · {r.contactPhone} · {formatDate(r.createdAt)}
                </p>
              </div>
              <Badge variant={STATUS_VARIANT[r.status]}>{STATUS_LABEL[r.status]}</Badge>
            </div>

            <p className="mt-3 text-sm leading-7 text-ink-700">{r.description}</p>
            {r.reviewerNote && <p className="mt-2 rounded-xl bg-sand-50 p-3 text-xs text-ink-600">{r.reviewerNote}</p>}

            {(r.status === "SUBMITTED" || r.status === "UNDER_REVIEW") && (
              <div className="mt-4 flex gap-2">
                <form action={approveAction}>
                  <input type="hidden" name="id" value={r.id} />
                  <Button type="submit" size="sm" variant="primary">
                    تأیید و انتشار نیاز
                  </Button>
                </form>
                <form action={rejectAction}>
                  <input type="hidden" name="id" value={r.id} />
                  <Button type="submit" size="sm" variant="ghost">
                    رد درخواست
                  </Button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
