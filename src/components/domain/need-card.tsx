import Link from "next/link";
import { ProgressBar } from "@/components/ui/progress-bar";
import { buttonVariants } from "@/components/ui/button";
import { IconTile } from "@/components/illustrations/icon-tile";
import {
  BackpackIcon,
  BookStackIcon,
  GlobeIcon,
  WhiteboardIcon,
  FlaskIcon,
  SportsIcon,
  StationeryIcon,
  ClassroomIcon,
} from "@/components/illustrations/category-icons";
import { formatNumber } from "@/lib/utils";
import type { Need } from "@/lib/mock-data";

const categoryIcon: Record<Need["category"], React.ReactNode> = {
  backpack: <BackpackIcon />,
  book: <BookStackIcon />,
  globe: <GlobeIcon />,
  board: <WhiteboardIcon />,
  lab: <FlaskIcon />,
  sports: <SportsIcon />,
  stationery: <StationeryIcon />,
  classroom: <ClassroomIcon />,
};

export function NeedCard({ need }: { need: Need }) {
  const pct = Math.round((need.fulfilled / need.needed) * 100);
  const remaining = need.needed - need.fulfilled;

  return (
    <Link
      href={`/needs/${need.id}`}
      className="group flex flex-col gap-4 rounded-card border border-brand-100 bg-white p-5 shadow-[0_10px_30px_-18px_rgba(12,34,66,0.35)] transition-transform hover:-translate-y-1"
    >
      <div className="flex items-start justify-between gap-3">
        <IconTile tone="brand">{categoryIcon[need.category]}</IconTile>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
          {pct}٪ تأمین شده
        </span>
      </div>

      <div>
        <h3 className="text-[15px] font-bold text-ink-900">{need.title}</h3>
        <p className="mt-1 text-sm leading-6 text-ink-500">{need.beneficiary}</p>
      </div>

      <div className="space-y-2">
        <ProgressBar value={pct} />
        <div className="flex items-center justify-between text-xs text-ink-500">
          <span>
            {formatNumber(need.fulfilled)} از {formatNumber(need.needed)} {need.unit}
          </span>
          <span>{formatNumber(remaining)} {need.unit} باقی‌مانده</span>
        </div>
      </div>

      <span className={buttonVariants({ variant: "primary", size: "sm", className: "mt-1 w-full" })}>
        تأمین این نیاز
      </span>
    </Link>
  );
}
