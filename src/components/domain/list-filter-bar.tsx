"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Select } from "@/components/ui/field";

export type FilterOption = { value: string; label: string };
export type SelectConfig = { param: string; options: FilterOption[]; className?: string };
export type ChipGroupConfig = { param: string; options: FilterOption[]; label?: string };

export function ListFilterBar({
  categories,
  categoryParam = "category",
  chipGroups,
  selects = [],
  searchPlaceholder,
  searchParam = "q",
}: {
  categories?: FilterOption[];
  categoryParam?: string;
  chipGroups?: ChipGroupConfig[];
  selects?: SelectConfig[];
  searchPlaceholder?: string;
  searchParam?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const groups: ChipGroupConfig[] = chipGroups ?? (categories ? [{ param: categoryParam, options: categories }] : []);

  function pushParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") params.delete(key);
    else params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const value = (new FormData(form).get(searchParam) as string) ?? "";
    pushParam(searchParam, value.trim());
  }

  return (
    <div className="space-y-4">
      {searchPlaceholder && (
        <form onSubmit={handleSearchSubmit} className="flex max-w-md items-center gap-2 rounded-full border border-brand-100 bg-white px-4">
          <Search size={16} className="text-ink-400" />
          <input
            name={searchParam}
            defaultValue={searchParams.get(searchParam) ?? ""}
            placeholder={searchPlaceholder}
            className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-ink-300"
          />
        </form>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          {groups.map((group) => {
            const active = searchParams.get(group.param) ?? "all";
            return (
              <div key={group.param}>
                {group.label && <p className="mb-2 text-xs font-semibold text-ink-700">{group.label}</p>}
                <div className="flex flex-wrap gap-2">
                  {group.options.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => pushParam(group.param, o.value)}
                      className={
                        active === o.value
                          ? "rounded-full bg-brand-700 px-4 py-1.5 text-xs font-bold text-white"
                          : "rounded-full border border-brand-100 bg-white px-4 py-1.5 text-xs font-medium text-ink-700 hover:border-brand-300"
                      }
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {selects.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {selects.map((s) => (
              <Select
                key={s.param}
                className={s.className ?? "w-52"}
                value={searchParams.get(s.param) ?? s.options[0]?.value}
                onChange={(e) => pushParam(s.param, e.target.value)}
              >
                {s.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
