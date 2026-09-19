import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <span className="mb-3 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
          {eyebrow}
        </span>
      )}
      <h2 className="text-balance text-2xl font-extrabold text-ink-900 sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 text-[15px] leading-7 text-ink-500">{description}</p>}
    </div>
  );
}
