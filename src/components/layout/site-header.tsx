"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag, User, ChevronDown } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

const navItems: NavItem[] = [
  { label: "خانه", href: "/" },
  {
    label: "فروشگاه",
    href: "/shop",
    children: [
      { label: "برای دانش‌آموز", href: "/shop/student" },
      { label: "برای مدرسه", href: "/shop/school" },
      { label: "دسته‌بندی‌ها", href: "/shop" },
      { label: "سبد خرید", href: "/cart" },
    ],
  },
  {
    label: "نیازها",
    href: "/needs",
    children: [
      { label: "نیازهای دانش‌آموزان", href: "/needs" },
      { label: "نیازهای مدارس", href: "/needs/schools" },
    ],
  },
  {
    label: "کمک کن",
    href: "/help",
    children: [
      { label: "کمک با اعتبار", href: "/help/credit" },
      { label: "خرید مستقیم کالا", href: "/help/direct-purchase" },
      { label: "انتخاب یک نیاز", href: "/help/choose-a-need" },
    ],
  },
  {
    label: "مدارس",
    href: "/schools",
    children: [
      { label: "معرفی مدارس", href: "/schools" },
      { label: "ثبت نیاز مدرسه", href: "/schools/register-need" },
      { label: "پیگیری درخواست", href: "/schools/track-request" },
    ],
  },
  {
    label: "حساب من",
    href: "/account",
    children: [
      { label: "اعتبار من", href: "/account/credit" },
      { label: "سفارش‌ها", href: "/account/orders" },
      { label: "پروفایل", href: "/account/profile" },
    ],
  },
  {
    label: "بیشتر",
    href: "/how-it-works",
    children: [
      { label: "چطور کار می‌کند؟", href: "/how-it-works" },
      { label: "اثر کمک من", href: "/impact" },
      { label: "داستان‌ها", href: "/stories" },
      { label: "درباره ما", href: "/about" },
      { label: "سوالات متداول", href: "/faq" },
      { label: "تماس با ما", href: "/contact" },
    ],
  },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100/70 bg-sand-50/90 backdrop-blur">
      <Container className="flex h-[72px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-700 text-sand-50">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3 21 7.5 12 12 3 7.5 12 3Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M6 10.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[15px] font-extrabold text-brand-800">مدرسه‌یاری</span>
            <span className="text-[11px] text-ink-500">همراه مدارس، همراه آینده</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) =>
            item.children ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 rounded-full px-3 py-2 text-[13.5px] font-medium text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-800"
                >
                  {item.label}
                  <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                </Link>
                <div className="invisible absolute right-0 top-full z-20 min-w-[210px] rounded-2xl border border-brand-100 bg-white p-2 opacity-0 shadow-lg shadow-brand-900/5 transition-all group-hover:visible group-hover:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-xl px-3 py-2 text-[13px] font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-800"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 text-[13.5px] font-medium text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-800"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/cart"
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-800"
            aria-label="سبد خرید"
          >
            <ShoppingBag size={19} />
          </Link>
          <Link
            href="/account"
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-800"
            aria-label="حساب من"
          >
            <User size={19} />
          </Link>
          <ButtonLink href="/help" size="sm" variant="primary">
            می‌خواهم کمک کنم
          </ButtonLink>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink-700 lg:hidden"
          aria-label="منو"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      <div
        className={cn(
          "overflow-hidden border-t border-brand-100 bg-sand-50 lg:hidden",
          open ? "max-h-[80vh] overflow-y-auto" : "max-h-0 border-t-0"
        )}
      >
        <Container className="flex flex-col gap-1 py-3">
          {navItems.map((item) =>
            item.children ? (
              <div key={item.href}>
                <button
                  type="button"
                  onClick={() => setMobileExpanded((v) => (v === item.href ? null : item.href))}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-brand-50"
                >
                  {item.label}
                  <ChevronDown
                    size={16}
                    className={cn("transition-transform", mobileExpanded === item.href && "rotate-180")}
                  />
                </button>
                <div
                  className={cn(
                    "overflow-hidden pr-4",
                    mobileExpanded === item.href ? "max-h-64" : "max-h-0"
                  )}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-3 py-2 text-[13px] text-ink-500 hover:bg-brand-50 hover:text-brand-800"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-brand-50"
              >
                {item.label}
              </Link>
            )
          )}
          <ButtonLink href="/help" size="sm" variant="primary" className="mt-2 justify-center" onClick={() => setOpen(false)}>
            می‌خواهم کمک کنم
          </ButtonLink>
        </Container>
      </div>
    </header>
  );
}
