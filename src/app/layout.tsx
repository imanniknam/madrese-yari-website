import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "مدرسه‌یاری | همراه مدارس، همراه آینده",
    template: "%s | مدرسه‌یاری",
  },
  description:
    "مدرسه‌یاری نیازهای واقعی دانش‌آموزان و مدارس را به کمک‌های هدفمند و قابل‌پیگیری متصل می‌کند؛ از طریق کمک با اعتبار، تأمین مستقیم کالا یا خرید از فروشگاه.",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      data-scroll-behavior="smooth"
      className={`${vazirmatn.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-sand-50 text-ink-900">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
