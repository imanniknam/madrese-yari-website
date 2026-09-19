import { cn } from "@/lib/utils";

export type TimelineStep = {
  label: string;
  description?: string;
  state: "done" | "active" | "upcoming";
};

export function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="space-y-0">
      {steps.map((step, i) => (
        <li key={step.label} className="relative flex gap-4 pb-8 last:pb-0">
          {i < steps.length - 1 && (
            <span
              className={cn(
                "absolute right-[15px] top-8 h-full w-0.5",
                step.state === "done" ? "bg-brand-400" : "bg-brand-100"
              )}
            />
          )}
          <span
            className={cn(
              "z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
              step.state === "done" && "bg-brand-600 text-white",
              step.state === "active" && "bg-gold-500 text-ink-900",
              step.state === "upcoming" && "border border-brand-100 bg-white text-ink-300"
            )}
          >
            {step.state === "done" ? "✓" : i + 1}
          </span>
          <div className="pt-0.5">
            <p
              className={cn(
                "text-sm font-bold",
                step.state === "upcoming" ? "text-ink-300" : "text-ink-900"
              )}
            >
              {step.label}
            </p>
            {step.description && <p className="mt-1 text-xs leading-6 text-ink-500">{step.description}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
