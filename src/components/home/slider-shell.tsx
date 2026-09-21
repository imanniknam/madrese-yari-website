"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function SliderShell({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  // در صفحهٔ راست‌به‌چپ، حرکت به «بعدی» یعنی اسکرول به سمت چپ (مقدار منفی)
  const scrollByPage = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: -dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const arrow =
    "absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-100 bg-white text-brand-800 shadow-md transition-colors hover:bg-brand-700 hover:text-white sm:flex";

  return (
    <div className="relative">
      <button type="button" aria-label="قبلی" onClick={() => scrollByPage(-1)} className={`${arrow} -right-4`}>
        <ChevronRight size={20} />
      </button>
      <button type="button" aria-label="بعدی" onClick={() => scrollByPage(1)} className={`${arrow} -left-4`}>
        <ChevronLeft size={20} />
      </button>
      <div
        ref={ref}
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </div>
  );
}
