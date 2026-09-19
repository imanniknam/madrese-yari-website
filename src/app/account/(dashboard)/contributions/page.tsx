import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNumber, formatToman } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { getContributionsByUserId, getCreditGrantsByDonorId } from "@/lib/data";

export const metadata: Metadata = { title: "مشارکت‌های من" };

const TYPE_LABEL: Record<string, string> = {
  DIRECT_GOODS: "تأمین بخشی از کالا",
  FULL_FULFILLMENT: "تأمین کامل نیاز",
  CASH_TO_CREDIT: "کمک نقدی به اعتبار دانش‌آموزی",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "در انتظار",
  CONFIRMED: "تأییدشده",
  FULFILLING: "در حال تأمین",
  COMPLETED: "تکمیل‌شده",
  CANCELLED: "لغوشده",
};

export default async function AccountContributionsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/account/login?callbackUrl=/account/contributions");
  const userId = session.user.id as string;

  const [contributions, creditGrants] = await Promise.all([
    getContributionsByUserId(userId),
    getCreditGrantsByDonorId(userId),
  ]);

  type Row =
    | { kind: "contribution"; id: string; createdAt: Date; title: string; type: string; qty: number | null; amountToman: number | null; status: string }
    | { kind: "credit"; id: string; createdAt: Date; title: string; amountToman: number; tokensGranted: number };

  const rows: Row[] = [
    ...contributions.map((c) => ({
      kind: "contribution" as const,
      id: c.id,
      createdAt: c.createdAt,
      title: c.need.title,
      type: c.type,
      qty: c.qty,
      amountToman: c.amountToman,
      status: c.status,
    })),
    ...creditGrants.map((g) => ({
      kind: "credit" as const,
      id: g.id,
      createdAt: g.createdAt,
      title: g.targetStudent
        ? `اعطای اعتبار به دانش‌آموز ${g.targetStudent.grade} در ${g.targetStudent.city}`
        : "اعطای اعتبار به صندوق مشترک دانش‌آموزی",
      amountToman: g.amountToman,
      tokensGranted: g.tokensGranted,
    })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="space-y-6">
      <div className="rounded-card border border-brand-100 bg-white p-6">
        <h1 className="text-base font-bold text-ink-900">مشارکت‌های من</h1>
        <p className="mt-1 text-sm text-ink-500">{formatNumber(rows.length)} مشارکت ثبت‌شده</p>
      </div>

      {rows.length === 0 && (
        <div className="rounded-card border border-brand-100 bg-white p-8 text-center text-sm text-ink-500">
          هنوز مشارکتی ثبت نکرده‌اید.
        </div>
      )}

      <div className="space-y-3">
        {rows.map((r) => (
          <div key={`${r.kind}-${r.id}`} className="flex items-center justify-between rounded-card border border-brand-100 bg-white p-4">
            <div>
              <p className="text-sm font-bold text-ink-900">{r.title}</p>
              <p className="mt-1 text-xs text-ink-500">
                {r.kind === "credit" ? TYPE_LABEL.CASH_TO_CREDIT : TYPE_LABEL[r.type] ?? r.type} · {formatDate(r.createdAt)}
              </p>
            </div>
            <div className="text-left">
              {r.kind === "contribution" && r.qty != null && <p className="text-sm font-bold text-ink-900">{formatNumber(r.qty)} عدد</p>}
              {r.amountToman != null && <p className="text-sm font-bold text-ink-900">{formatToman(r.amountToman)}</p>}
              {r.kind === "credit" && <p className="mt-0.5 text-xs text-ink-500">{formatNumber(r.tokensGranted)} توکن اعتبار</p>}
              <Badge variant={r.kind === "credit" || r.status === "CONFIRMED" || r.status === "COMPLETED" ? "brand" : "neutral"} className="mt-1">
                {r.kind === "credit" ? "تأییدشده" : STATUS_LABEL[r.status] ?? r.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
