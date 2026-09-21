import Link from "next/link";
import { IconTile } from "@/components/illustrations/icon-tile";
import {
  ClassroomIcon,
  GlobeIcon,
  BookStackIcon,
  SportsIcon,
  FlaskIcon,
  BackpackIcon,
  StationeryIcon,
  BoxIcon,
  WhiteboardIcon,
} from "@/components/illustrations/category-icons";
import { formatNumber } from "@/lib/utils";
import type { Category } from "@/lib/mock-data";

const iconMap: Record<Category["icon"], React.ReactNode> = {
  classroom: <ClassroomIcon />,
  globe: <GlobeIcon />,
  book: <BookStackIcon />,
  sports: <SportsIcon />,
  lab: <FlaskIcon />,
  backpack: <BackpackIcon />,
  stationery: <StationeryIcon />,
  box: <BoxIcon />,
  board: <WhiteboardIcon />,
};

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/shop/category/${category.slug}`}
      className="group flex flex-col items-center gap-3 rounded-card border border-brand-100 bg-white p-5 text-center transition-all hover:-translate-y-1 hover:shadow-[0_16px_32px_-20px_rgba(16,44,31,0.35)]"
    >
      <IconTile tone="brand">{iconMap[category.icon]}</IconTile>
      <div>
        <h3 className="text-[13.5px] font-bold text-ink-900">{category.name}</h3>
        <p className="mt-1 text-[11px] text-ink-500">{formatNumber(category.productCount)} کالا</p>
      </div>
    </Link>
  );
}
