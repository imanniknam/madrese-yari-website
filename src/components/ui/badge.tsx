import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        brand: "bg-brand-100 text-brand-800",
        gold: "bg-gold-100 text-gold-700",
        neutral: "bg-sand-200 text-ink-700",
        outline: "border border-brand-200 text-brand-700",
        dark: "bg-ink-900 text-sand-50",
      },
    },
    defaultVariants: { variant: "brand" },
  }
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
