import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";
import type { School } from "@/lib/mock-data";

export function SchoolCard({ school }: { school: School }) {
  return (
    <Link
      href={`/schools/${school.id}`}
      className="group flex flex-col gap-4 rounded-card border border-brand-100 bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-[0_16px_32px_-20px_rgba(16,44,31,0.35)]"
    >
      <div className="h-28 rounded-2xl bg-gradient-to-br from-brand-200 via-brand-300 to-brand-400" />
      <div>
        <h3 className="text-sm font-bold text-ink-900">{school.name}</h3>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-500">
          <MapPin size={13} />
          {school.city}، {school.province}
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-ink-500">
          <Users size={13} />
          {formatNumber(school.studentCount)} دانش‌آموز
        </div>
      </div>
      <p className="text-xs leading-6 text-ink-500">{school.description}</p>
      <div className="mt-auto space-y-2">
        <div className="flex items-center justify-between text-[11px] text-ink-500">
          <span>میزان تأمین نیازها</span>
          <span className="font-bold text-brand-700">{school.fulfilledPct}٪</span>
        </div>
        <ProgressBar value={school.fulfilledPct} />
        <Badge variant="neutral">{school.needsCount} نیاز ثبت‌شده</Badge>
      </div>
    </Link>
  );
}
