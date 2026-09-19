import { formatNumber } from "@/lib/utils";

export function StatBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-start">
      <span className="text-3xl font-extrabold text-white sm:text-4xl">{formatNumber(value)}</span>
      <span className="text-sm text-brand-100">{label}</span>
    </div>
  );
}
