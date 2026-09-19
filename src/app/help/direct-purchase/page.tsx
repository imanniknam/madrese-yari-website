import { Suspense } from "react";
import type { Metadata } from "next";
import { Search } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/domain/page-header";
import { SectionHeading } from "@/components/domain/section-heading";
import { ProgressBar } from "@/components/ui/progress-bar";
import { buttonVariants } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { ListFilterBar } from "@/components/domain/list-filter-bar";
import { IconTile } from "@/components/illustrations/icon-tile";
import {
  BackpackIcon,
  BookStackIcon,
  GlobeIcon,
  WhiteboardIcon,
  FlaskIcon,
  SportsIcon,
  StationeryIcon,
  ClassroomIcon,
} from "@/components/illustrations/category-icons";
import { formatNumber } from "@/lib/utils";
import { NEED_STATUS_LABEL, type Need } from "@/lib/mock-data";
import { getAllNeeds } from "@/lib/data";
import Link from "next/link";

export const metadata: Metadata = { title: "خرید مستقیم کالا" };

const categoryIcon: Record<string, React.ReactNode> = {
  backpack: <BackpackIcon />,
  book: <BookStackIcon />,
  globe: <GlobeIcon />,
  board: <WhiteboardIcon />,
  lab: <FlaskIcon />,
  sports: <SportsIcon />,
  stationery: <StationeryIcon />,
  classroom: <ClassroomIcon />,
};

export default async function DirectPurchasePage(props: PageProps<"/help/direct-purchase">) {
  const searchParams = await props.searchParams;
  const audience = typeof searchParams.audience === "string" ? searchParams.audience : "all";
  const status = typeof searchParams.status === "string" ? searchParams.status : "all";
  const location = typeof searchParams.location === "string" ? searchParams.location : "all";
  const q = typeof searchParams.q === "string" ? searchParams.q.trim() : "";

  const allNeeds = await getAllNeeds();

  const filteredNeeds = allNeeds.filter((n) => {
    if (audience !== "all" && n.audience !== audience) return false;
    if (status !== "all" && n.status !== status) return false;
    if (location !== "all" && n.location !== location) return false;
    if (q && !n.title.includes(q) && !n.beneficiary.includes(q)) return false;
    return true;
  });

  return (
    <>
      <PageHeader
        eyebrow="خرید مستقیم کالا"
        title="کالای موردنیاز دانش‌آموز یا مدرسه را تأمین کنید."
        description="اگر می‌خواهید به‌جای پرداخت مبلغی برای یک نیاز، خودِ کالای موردنیاز را تهیه کنید، اینجا کالاهای موردنیاز دانش‌آموزان و مدارس را ببینید، تعداد موردنظرتان را انتخاب کنید و خریدتان را مستقیماً به تأمین همان کالا اختصاص دهید."
        breadcrumb={[{ label: "خانه", href: "/" }, { label: "کمک کن", href: "/help" }, { label: "خرید مستقیم کالا" }]}
      >
        <form action="/help/direct-purchase" method="GET" className="mt-6 flex max-w-lg items-center gap-2 rounded-full bg-white/95 p-1.5 pr-4">
          <Search size={17} className="shrink-0 text-ink-400" />
          {audience !== "all" && <input type="hidden" name="audience" value={audience} />}
          {status !== "all" && <input type="hidden" name="status" value={status} />}
          {location !== "all" && <input type="hidden" name="location" value={location} />}
          <input
            name="q"
            defaultValue={q}
            placeholder="نام کالا را جست‌وجو کنید..."
            className="h-9 w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-300"
          />
        </form>
      </PageHeader>

      <Container className="py-12">
        <SectionHeading eyebrow="اینجا دقیقاً چه کاری می‌کنید؟" title="شما کالا را می‌خرید، مدرسه یا دانش‌آموز آن را دریافت می‌کند." />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "یک کالای موردنیاز را انتخاب کنید", desc: "مثلاً کوله‌پشتی، کتاب یا تجهیزات آموزشی." },
            { title: "ببینید این کالا برای چه نیازی است", desc: "مشخص می‌شود کالا برای کدام مدرسه یا گروهی از دانش‌آموزان موردنیاز است." },
            { title: "تعداد موردنظرتان را انتخاب کنید", desc: "می‌توانید بخشی از تعداد موردنیاز یا، در صورت امکان، کل آن را تأمین کنید." },
            { title: "خرید را انجام دهید", desc: "پس از ثبت خرید، می‌توانید وضعیت تأمین آن را پیگیری کنید." },
          ].map((step, i) => (
            <div key={step.title} className="flex flex-col gap-3 rounded-card border border-brand-100 bg-white p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-sm font-extrabold text-white">
                {i + 1}
              </span>
              <h3 className="text-sm font-bold text-ink-900">{step.title}</h3>
              <p className="text-xs leading-6 text-ink-500">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <SectionHeading eyebrow="کالاهای موردنیاز" title="چه کالاهایی در انتظار تأمین هستند؟" />
          <p className="mt-2 max-w-2xl text-sm text-ink-500">
            در این بخش فقط کالاهایی نمایش داده می‌شوند که در یک نیاز واقعی ثبت شده‌اند.
          </p>
        </div>

        <div className="mt-5">
          <Suspense>
            <ListFilterBar
              chipGroups={[
                {
                  param: "audience",
                  options: [
                    { value: "all", label: "همه" },
                    { value: "student", label: "نیازهای دانش‌آموزان" },
                    { value: "school", label: "نیازهای مدارس" },
                  ],
                },
                {
                  param: "status",
                  options: [
                    { value: "all", label: "همهٔ وضعیت‌ها" },
                    ...(Object.keys(NEED_STATUS_LABEL) as Need["status"][]).map((s) => ({
                      value: s,
                      label: NEED_STATUS_LABEL[s],
                    })),
                  ],
                },
              ]}
              selects={[
                {
                  param: "location",
                  options: [
                    { value: "all", label: "استان / شهر" },
                    ...Array.from(new Set(allNeeds.map((n) => n.location))).map((loc) => ({
                      value: loc,
                      label: loc,
                    })),
                  ],
                  className: "w-40",
                },
              ]}
            />
          </Suspense>
        </div>

        {filteredNeeds.length === 0 && (
          <p className="mt-8 rounded-card border border-brand-100 bg-white p-8 text-center text-sm text-ink-500">
            کالایی با این فیلترها پیدا نشد.
          </p>
        )}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNeeds.map((need) => {
            const remaining = need.needed - need.fulfilled;
            const pct = Math.round((need.fulfilled / need.needed) * 100);
            return (
              <div key={need.id} className="flex flex-col gap-4 rounded-card border border-brand-100 bg-white p-5">
                <div className="flex items-start justify-between">
                  <IconTile tone="brand">{categoryIcon[need.category]}</IconTile>
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                    {formatNumber(remaining)} {need.unit} باقی‌مانده
                  </span>
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-ink-900">{need.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-ink-500">برای {need.beneficiary}</p>
                </div>
                <ProgressBar value={pct} />
                <Link href={`/needs/${need.id}`} className={buttonVariants({ size: "sm", className: "w-full" })}>
                  تأمین این کالا
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-14 rounded-card border border-brand-100 bg-brand-50/60 p-6 sm:p-8">
          <h2 className="text-base font-bold text-ink-900">
            خرید مستقیم کالا چه تفاوتی با خرید از فروشگاه دارد؟
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-white p-4">
              <p className="text-sm font-bold text-brand-700">خرید مستقیم کالا</p>
              <p className="mt-1.5 text-xs leading-6 text-ink-500">
                شما یک کالای مشخص را از میان نیازهای ثبت‌شده انتخاب می‌کنید و خریدتان برای تأمین همان نیاز در نظر گرفته می‌شود.
              </p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <p className="text-sm font-bold text-brand-700">خرید از فروشگاه</p>
              <p className="mt-1.5 text-xs leading-6 text-ink-500">
                کالاهای فروشگاه را برای خرید معمولی انتخاب می‌کنید؛ بخشی از سود حاصل از خرید نیز صرف تأمین نیازها می‌شود.
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/help/direct-purchase" size="sm">
              می‌خواهید بدانید دقیقاً چه چیزی را تأمین می‌کنید؟ → همین صفحه
            </ButtonLink>
            <ButtonLink href="/shop" size="sm" variant="secondary">
              ورود به فروشگاه
            </ButtonLink>
          </div>
        </div>

        <div className="mt-14 max-w-3xl">
          <SectionHeading eyebrow="پرسش‌های متداول" title="سوالات رایج دربارهٔ خرید مستقیم کالا" />
          <div className="mt-6 space-y-3">
            {[
              {
                q: "آیا می‌توانم فقط بخشی از یک نیاز را تأمین کنم؟",
                a: "بله. اگر برای یک نیاز ۱۰۰ عدد کالا باقی مانده باشد، می‌توانید هر تعداد از آن را که برایتان امکان‌پذیر است تأمین کنید.",
              },
              {
                q: "آیا می‌توانم کل یک نیاز را تأمین کنم؟",
                a: "بله، اگر امکان تأمین کامل برای آن نیاز وجود داشته باشد، می‌توانید تمام مقدار باقی‌مانده را تهیه کنید.",
              },
              {
                q: "کالایی که می‌خرم به کدام مدرسه یا دانش‌آموز می‌رسد؟",
                a: "در صفحهٔ هر کالا مشخص می‌شود که کالا برای کدام نیاز و در صورت امکان برای کدام مدرسه یا گروه دانش‌آموزان ثبت شده است.",
              },
              {
                q: "آیا می‌توانم وضعیت خرید خود را پیگیری کنم؟",
                a: "بله. پس از ثبت خرید، وضعیت آن از طریق حساب کاربری قابل پیگیری است.",
              },
              {
                q: "اگر قبل از پرداخت، نیاز کامل تأمین شود چه می‌شود؟",
                a: "اگر کالای موردنظر پیش از نهایی‌شدن خرید به‌طور کامل تأمین شده باشد، امکان ثبت خرید برای آن نیاز وجود نخواهد داشت و می‌توانید کالای دیگری را انتخاب کنید.",
              },
            ].map((item) => (
              <details key={item.q} className="group rounded-2xl border border-brand-100 bg-white p-4 open:shadow-sm">
                <summary className="cursor-pointer list-none text-sm font-bold text-ink-900">{item.q}</summary>
                <p className="mt-2 text-sm leading-7 text-ink-500">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
