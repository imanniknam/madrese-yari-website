import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-xs text-ink-500">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1.5">
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-brand-700">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-ink-700">{item.label}</span>
          )}
          {i < items.length - 1 && <ChevronLeft size={13} className="text-ink-300" />}
        </span>
      ))}
    </nav>
  );
}
