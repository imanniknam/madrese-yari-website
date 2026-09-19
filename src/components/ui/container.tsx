import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
  id,
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <div id={id} className={cn("mx-auto w-full max-w-[1180px] px-5 sm:px-6", className)}>
      {children}
    </div>
  );
}
