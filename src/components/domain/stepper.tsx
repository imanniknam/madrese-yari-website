import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center">
      {steps.map((step, i) => {
        const state = i < current ? "done" : i === current ? "active" : "upcoming";
        return (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors",
                  state === "done" && "bg-brand-600 text-white",
                  state === "active" && "bg-ink-900 text-white",
                  state === "upcoming" && "bg-white text-ink-300 border border-brand-100"
                )}
              >
                {state === "done" ? <Check size={16} /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-[11px] font-medium",
                  state === "upcoming" ? "text-ink-300" : "text-ink-700"
                )}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("mx-2 h-px flex-1", state === "done" ? "bg-brand-400" : "bg-brand-100")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
