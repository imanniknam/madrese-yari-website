import Link from "next/link";
import { Send, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";

function InstagramGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

const columns = [
  {
    title: "دسترسی سریع",
    links: [
      { label: "خانه", href: "/" },
      { label: "نیازها", href: "/needs" },
      { label: "فروشگاه", href: "/shop" },
      { label: "مدارس", href: "/schools" },
    ],
  },
  {
    title: "راهنما",
    links: [
      { label: "چطور کار می‌کند؟", href: "/how-it-works" },
      { label: "اثر کمک من", href: "/impact" },
      { label: "سوالات متداول", href: "/faq" },
      { label: "تماس با ما", href: "/contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink-900 text-sand-100">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 3 21 7.5 12 12 3 7.5 12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M6 10.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-[15px] font-extrabold text-white">مدرسه‌یاری</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-7 text-sand-300">
            نیازهای واقعی دانش‌آموزان و مدارس را به کمک‌های هدفمند و قابل‌پیگیری متصل می‌کنیم؛ از کوله‌پشتی و کتاب گرفته تا تجهیزات کلاس و وسایل کمک‌آموزشی.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a href="#" aria-label="اینستاگرام" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
              <InstagramGlyph />
            </a>
            <a href="#" aria-label="تلگرام" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
              <Send size={16} />
            </a>
            <a href="#" aria-label="تماس" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
              <Phone size={16} />
            </a>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-bold text-white">{col.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-sand-300 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <div className="border-t border-white/10 py-5">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-sand-300 sm:flex-row">
          <span>© {new Date().getFullYear()} مدرسه‌یاری — زیرمجموعهٔ جامعهٔ خیرین مدرسه‌ساز</span>
          <span>با هم، آیندهٔ بهتری بسازیم.</span>
        </Container>
      </div>
    </footer>
  );
}
