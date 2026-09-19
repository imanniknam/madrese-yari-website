import { cn } from "@/lib/utils";

/**
 * پوستهٔ مشترک آیکون‌های اختصاصی مدرسه‌یاری: یک بلاب گرد رنگی زیر هر آیکون
 * که حس «۳بعدی بازیگوش» می‌دهد بدون وابستگی به بستهٔ آیکون شخص ثالث.
 */
export function IconTile({
  children,
  tone = "brand",
  className,
}: {
  children: React.ReactNode;
  tone?: "brand" | "gold" | "sand";
  className?: string;
}) {
  const tones: Record<string, string> = {
    brand: "bg-gradient-to-br from-brand-100 to-brand-200",
    gold: "bg-gradient-to-br from-gold-100 to-gold-300/70",
    sand: "bg-gradient-to-br from-sand-100 to-sand-300",
  };
  return (
    <div
      className={cn(
        "relative flex h-16 w-16 items-center justify-center rounded-[22px] shadow-[0_8px_20px_-8px_rgba(16,44,31,0.35)]",
        tones[tone],
        className
      )}
    >
      <div className="drop-shadow-[0_2px_2px_rgba(16,44,31,0.15)]">{children}</div>
    </div>
  );
}
