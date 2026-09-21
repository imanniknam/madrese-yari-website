import Image from "next/image";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { ProgressBar } from "@/components/ui/progress-bar";
import { IconTile } from "@/components/illustrations/icon-tile";
import {
  BackpackIcon,
  WhiteboardIcon,
  ChairIcon,
  GlobeIcon,
  CoinIcon,
  SchoolMarkIcon,
} from "@/components/illustrations/category-icons";
import { formatNumber } from "@/lib/utils";

const classroomItems = [
  { icon: <WhiteboardIcon width={16} height={16} />, label: "تخته", count: 3 },
  { icon: <ChairIcon width={16} height={16} />, label: "صندلی", count: 12 },
  { icon: <GlobeIcon width={16} height={16} />, label: "نقشه جغرافیا", count: 1 },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-14 lg:pb-24">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -left-24 h-72 w-72 rounded-full bg-gold-300/30 blur-3xl" />

      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-6">
          {/* متن */}
          <div className="relative z-10">
            <p className="text-[15px] font-bold text-ink-900">مدرسه‌یاری</p>
            <h1 className="mt-3 text-balance text-3xl font-extrabold leading-[1.35] text-ink-900 sm:text-4xl lg:text-[42px]">
              یک نیاز واقعی را ببینید،
              <br />
              یک کمک مشخص انجام دهید.
            </h1>
            <p className="mt-5 max-w-md text-[14.5px] leading-8 text-ink-500">
              از یک کوله‌پشتی تا تجهیزات یک کلاس؛ مدرسه‌یاری نیازهای واقعی دانش‌آموزان و مدارس را به کمک‌های
              مشخص و قابل‌پیگیری تبدیل می‌کند.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="/needs" size="lg" variant="dark">
                کمک به تأمین یک نیاز
              </ButtonLink>
              <ButtonLink href="/shop" size="lg" variant="secondary">
                ورود به فروشگاه
              </ButtonLink>
            </div>
          </div>

          {/* تصویر + کارت‌های شناور */}
          <div className="relative mt-6 h-[380px] sm:h-[460px] lg:mt-0 lg:h-[500px]">
            <div className="absolute inset-0 overflow-hidden rounded-[32px]">
              <Image
                src="/images/hero-student.png"
                alt="دانش‌آموزی با کوله‌پشتی که از کمک مدرسه‌یاری برخوردار شده"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 560px"
                className="object-cover [mask-image:linear-gradient(to_bottom,black_82%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_82%,transparent_100%)]"
              />
            </div>

            {/* ویجت «یک کلاس» */}
            <div className="absolute left-5 top-6 hidden w-40 rounded-2xl bg-white/90 p-3.5 shadow-[0_16px_30px_-16px_rgba(16,44,31,0.4)] backdrop-blur lg:block">
              <div className="flex items-center gap-1.5 border-b border-brand-100 pb-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-700 text-white">
                  <SchoolMarkIcon />
                </span>
                <span className="text-xs font-bold text-ink-900">یک کلاس</span>
              </div>
              <ul className="mt-2 space-y-1.5">
                {classroomItems.map((item) => (
                  <li key={item.label} className="flex items-center gap-1.5 text-[11px] text-ink-700">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                      {item.icon}
                    </span>
                    {formatNumber(item.count)} {item.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* کارت شناور «نیاز در حال تأمین» */}
            <div className="absolute inset-x-4 -bottom-10 sm:inset-x-10 lg:inset-x-auto lg:bottom-auto lg:-left-10 lg:top-[74%] lg:w-[270px] lg:-translate-y-1/2">
              {/* نشان اعتبار */}
              <div className="absolute -top-6 right-4 z-10 flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 shadow-[0_10px_25px_-12px_rgba(16,44,31,0.45)]">
                <span className="text-gold-600">
                  <CoinIcon width={16} height={16} />
                </span>
                <span className="text-xs font-bold text-ink-900">{formatNumber(250)} اعتبار</span>
              </div>

              <div className="rounded-3xl border border-brand-100 bg-white p-4 shadow-[0_25px_50px_-20px_rgba(16,44,31,0.45)]">
                <div className="flex items-start gap-3">
                  <IconTile tone="brand" className="h-14 w-14 shrink-0 rounded-2xl">
                    <BackpackIcon width={26} height={26} />
                  </IconTile>
                  <div>
                    <p className="text-[11px] text-ink-500">نیاز در حال تأمین</p>
                    <p className="text-sm font-bold text-ink-900">کوله‌پشتی دانش‌آموزان</p>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5">
                  <ProgressBar value={75} />
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-brand-700">۷۵٪ تأمین شد</span>
                    <span className="text-ink-500">{formatNumber(40)} عدد باقی‌مانده</span>
                  </div>
                </div>

                <ButtonLink href="/needs/backpack-1" size="sm" className="mt-4 justify-center">
                  تأمین این نیاز
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
