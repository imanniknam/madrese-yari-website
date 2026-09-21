import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { Truck, ShieldCheck, HeartHandshake, Coins } from "lucide-react";
import type { Category } from "@/lib/mock-data";

const perks = [
  { icon: Truck, label: "ارسال به سراسر کشور" },
  { icon: ShieldCheck, label: "پرداخت امن" },
  { icon: HeartHandshake, label: "بخشی از سود، صرف نیاز مدارس" },
  { icon: Coins, label: "خرید با اعتبار دانش‌آموز" },
];

export function StoreHero({ categories }: { categories: Category[] }) {
  return (
    <section>
      {/* نوار دسته‌بندی‌ها */}
      <div className="border-b border-brand-100 bg-white">
        <Container className="flex items-center gap-1 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link href="/shop" className="shrink-0 rounded-full bg-brand-700 px-4 py-1.5 text-[13px] font-bold text-white">
            همهٔ کالاها
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/shop/category/${c.slug}`}
              className="shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-800"
            >
              {c.name}
            </Link>
          ))}
        </Container>
      </div>

      <Container className="pt-6">
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-brand-900 via-brand-800 to-brand-600 p-8 text-white sm:p-12">
            <div className="pointer-events-none absolute -left-16 -bottom-20 h-64 w-64 rounded-full bg-gold-500/25 blur-3xl" />
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">فروشگاه مدرسه‌یاری</span>
            <h1 className="mt-4 text-balance text-3xl font-extrabold leading-[1.4] sm:text-4xl">
              هر خرید، یک کمک
              <br />
              به تحصیل دانش‌آموزان
            </h1>
            <p className="mt-4 max-w-md text-[14.5px] leading-8 text-brand-100">
              کیف، لوازم‌التحریر، کتاب و تجهیزات کلاس را بخرید؛ بخشی از سود فروشگاه صرف تأمین نیازهای واقعی مدارس می‌شود.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/shop" size="lg" variant="gold">
                ورود به فروشگاه
              </ButtonLink>
              <ButtonLink href="/needs" size="lg" variant="secondary">
                تأمین یک نیاز
              </ButtonLink>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <Link
              href="/shop/student"
              className="flex flex-col justify-end rounded-3xl bg-gold-100 p-6 transition-transform hover:-translate-y-0.5"
            >
              <span className="text-xs font-semibold text-gold-700">برای دانش‌آموز</span>
              <span className="mt-1 text-lg font-extrabold text-ink-900">خرید با اعتبار</span>
              <span className="mt-1 text-[13px] text-ink-500">نیازهای تحصیلی‌ات را با اعتبار خودت تأمین کن.</span>
            </Link>
            <Link
              href="/shop/school"
              className="flex flex-col justify-end rounded-3xl bg-brand-100 p-6 transition-transform hover:-translate-y-0.5"
            >
              <span className="text-xs font-semibold text-brand-700">برای مدرسه</span>
              <span className="mt-1 text-lg font-extrabold text-ink-900">سفارش عمده</span>
              <span className="mt-1 text-[13px] text-ink-500">تجهیزات کلاس و مدرسه را یک‌جا سفارش دهید.</span>
            </Link>
          </div>
        </div>

        <ul className="mt-5 grid grid-cols-2 gap-3 rounded-2xl border border-brand-100 bg-white p-4 lg:grid-cols-4">
          {perks.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2.5 text-[13px] font-medium text-ink-700">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                <Icon size={18} />
              </span>
              {label}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
