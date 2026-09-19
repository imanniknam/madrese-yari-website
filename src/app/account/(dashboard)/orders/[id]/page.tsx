import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Package, RefreshCw } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconTile } from "@/components/illustrations/icon-tile";
import { productIconMap } from "@/components/domain/product-thumb";
import { Timeline, type TimelineStep } from "@/components/domain/timeline";
import { formatDate, formatToman } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { getOrderById } from "@/lib/data";
import { schoolOrders, orderStatusStages, orderStatusBadge, schoolOrderShippingCost } from "@/lib/mock-data";
import type { Order, OrderItem, OrderStatus as DbOrderStatus, Prisma } from "@prisma/client";

const ORDER_STATUS_LABEL: Record<DbOrderStatus, string> = {
  PENDING_PAYMENT: "در انتظار پرداخت",
  CONFIRMED: "تأییدشده",
  PROCESSING: "در حال آماده‌سازی",
  READY_TO_SHIP: "آماده ارسال",
  SHIPPED: "ارسال‌شده",
  DELIVERED: "تحویل‌شده",
  CANCELLED: "لغوشده",
  PAYMENT_FAILED: "پرداخت ناموفق",
};

const ORDER_STATUS_VARIANT: Record<DbOrderStatus, "brand" | "gold" | "neutral"> = {
  PENDING_PAYMENT: "neutral",
  CONFIRMED: "gold",
  PROCESSING: "gold",
  READY_TO_SHIP: "gold",
  SHIPPED: "brand",
  DELIVERED: "brand",
  CANCELLED: "neutral",
  PAYMENT_FAILED: "neutral",
};

// ترتیب مراحل «مسیر شادِ» سفارش واقعی؛ لغوشده/پرداخت‌ناموفق حالت‌های پایانی جدا هستند
// و در این خط زمانی نمایش داده نمی‌شوند.
const REAL_ORDER_STAGES: DbOrderStatus[] = [
  "PENDING_PAYMENT",
  "CONFIRMED",
  "PROCESSING",
  "READY_TO_SHIP",
  "SHIPPED",
  "DELIVERED",
];

function formatShippingAddress(address: Prisma.JsonValue): string {
  if (address && typeof address === "object" && !Array.isArray(address)) {
    return Object.values(address as Record<string, unknown>)
      .filter((v) => typeof v === "string" || typeof v === "number")
      .join("، ");
  }
  return String(address ?? "");
}

// این صفحه دو حالت دارد: سفارش واقعی دیتابیس (شناسهٔ cuid) یا — به‌عنوان بازگشتی —
// سفارش‌های آزمایشی مدرسه (schoolOrders) با شناسه‌های قدیمی مثل «so-12548»، تا لینک‌های
// قبلی (مثل صفحهٔ موفقیت خرید مدرسه) خراب نشوند.
export async function generateMetadata(props: PageProps<"/account/orders/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const order = await getOrderById(id);
  if (order) return { title: `جزئیات سفارش #${order.orderNumber}` };

  const mockOrder = schoolOrders.find((o) => o.id === id);
  return { title: mockOrder ? `جزئیات سفارش #${mockOrder.code}` : "جزئیات سفارش" };
}

export default async function OrderDetailPage(props: PageProps<"/account/orders/[id]">) {
  const { id } = await props.params;
  const session = await auth();
  if (!session?.user?.id) redirect(`/account/login?callbackUrl=/account/orders/${id}`);

  const order = await getOrderById(id);
  if (order) {
    if (order.userId !== session.user.id) notFound();
    return <RealOrderDetail order={order} />;
  }

  const mockOrder = schoolOrders.find((o) => o.id === id);
  if (!mockOrder) notFound();
  return <MockSchoolOrderDetail order={mockOrder} />;
}

function RealOrderDetail({ order }: { order: Order & { items: OrderItem[] } }) {
  const isTerminalError = order.status === "CANCELLED" || order.status === "PAYMENT_FAILED";
  const currentIndex = REAL_ORDER_STAGES.indexOf(order.status);

  const timelineSteps: TimelineStep[] = REAL_ORDER_STAGES.map((status, i) => ({
    label: ORDER_STATUS_LABEL[status],
    state: isTerminalError
      ? i === 0
        ? "done"
        : "upcoming"
      : i < currentIndex
        ? "done"
        : i === currentIndex
          ? "active"
          : "upcoming",
  }));

  return (
    <Container className="py-8 sm:py-10">
      <Breadcrumb
        items={[
          { label: "خانه", href: "/" },
          { label: "حساب من", href: "/account" },
          { label: "سفارش‌های من", href: "/account/orders" },
          { label: `جزئیات سفارش #${order.orderNumber}` },
        ]}
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900">جزئیات سفارش #{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-ink-500">تاریخ ثبت: {formatDate(order.createdAt)}</p>
        </div>
        <Badge variant={ORDER_STATUS_VARIANT[order.status]}>{ORDER_STATUS_LABEL[order.status]}</Badge>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-card border border-brand-100 bg-white p-6">
            <h2 className="text-sm font-bold text-ink-900">اقلام سفارش</h2>
            <div className="mt-4 space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-xl border border-brand-100 p-3 sm:flex-row sm:items-center"
                >
                  <IconTile tone="gold" className="h-12 w-12 shrink-0 rounded-xl">
                    <Package width={20} height={20} />
                  </IconTile>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-ink-900">{item.nameSnapshot}</p>
                    <p className="mt-0.5 text-xs text-ink-500">
                      {formatToman(item.unitPriceSnapshot)} × {item.qty}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-ink-900">{formatToman(item.totalPriceSnapshot)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 border-t border-brand-100 pt-4 text-sm">
              <div className="flex justify-between text-ink-600">
                <span>مبلغ کالاها</span>
                <span>{formatToman(order.subtotalToman)}</span>
              </div>
              <div className="flex justify-between text-ink-600">
                <span>هزینهٔ ارسال</span>
                <span>{formatToman(order.shippingToman)}</span>
              </div>
              {order.discountToman > 0 && (
                <div className="flex justify-between text-ink-600">
                  <span>تخفیف</span>
                  <span>-{formatToman(order.discountToman)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-brand-100 pt-3 text-base font-extrabold text-ink-900">
                <span>مبلغ نهایی</span>
                <span>{formatToman(order.totalToman)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-card border border-brand-100 bg-white p-6">
            <h2 className="text-sm font-bold text-ink-900">نشانی تحویل</h2>
            <p className="mt-2 text-sm leading-7 text-ink-600">{formatShippingAddress(order.shippingAddress)}</p>
          </div>
        </div>

        <div className="space-y-6">
          {isTerminalError ? (
            <div className="rounded-card border border-red-200 bg-red-50 p-6">
              <h2 className="mb-2 text-sm font-bold text-red-700">
                {order.status === "CANCELLED" ? "سفارش لغو شده است" : "پرداخت این سفارش ناموفق بود"}
              </h2>
              <p className="text-xs leading-6 text-red-600">
                {order.status === "CANCELLED"
                  ? "این سفارش لغو شده و پیگیری بیشتری برای آن ثبت نمی‌شود."
                  : "پرداخت انجام نشد. می‌توانید دوباره تلاش کنید یا سفارش جدیدی ثبت کنید."}
              </p>
            </div>
          ) : (
            <div className="rounded-card border border-brand-100 bg-white p-6">
              <h2 className="mb-5 text-sm font-bold text-ink-900">وضعیت سفارش</h2>
              <Timeline steps={timelineSteps} />
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

function MockSchoolOrderDetail({ order }: { order: (typeof schoolOrders)[number] }) {
  const subtotal = order.items.reduce((s, i) => s + i.product.priceToman * i.qty, 0);
  const total = subtotal + schoolOrderShippingCost;
  const currentIndex = orderStatusStages.indexOf(order.status);
  const canReorder = order.status === "تحویل‌شده";

  const timelineSteps: TimelineStep[] = orderStatusStages.map((label, i) => ({
    label,
    description: i === currentIndex ? order.statusNote : undefined,
    state: i < currentIndex ? "done" : i === currentIndex ? "active" : "upcoming",
  }));

  return (
    <Container className="py-8 sm:py-10">
      <Breadcrumb
        items={[
          { label: "خانه", href: "/" },
          { label: "حساب من", href: "/account" },
          { label: "سفارش‌های من", href: "/account/orders" },
          { label: `جزئیات سفارش #${order.code}` },
        ]}
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900">جزئیات سفارش #{order.code}</h1>
          <p className="mt-1 text-sm text-ink-500">تاریخ ثبت: {order.date}</p>
        </div>
        <Badge variant={orderStatusBadge[order.status]}>{order.status}</Badge>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-card border border-brand-100 bg-white p-6">
            <h2 className="text-sm font-bold text-ink-900">اقلام سفارش</h2>
            <div className="mt-4 space-y-3">
              {order.items.map(({ product, qty }) => {
                const Icon = productIconMap[product.image];
                return (
                  <div
                    key={product.id}
                    className="flex flex-col gap-3 rounded-xl border border-brand-100 p-3 sm:flex-row sm:items-center"
                  >
                    <IconTile tone="gold" className="h-12 w-12 shrink-0 rounded-xl">
                      <Icon width={20} height={20} />
                    </IconTile>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-ink-900">{product.name}</p>
                      <p className="mt-0.5 text-xs text-ink-500">
                        {formatToman(product.priceToman)} × {qty} {product.unit ?? "عدد"}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-ink-900">{formatToman(product.priceToman * qty)}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 space-y-2 border-t border-brand-100 pt-4 text-sm">
              <div className="flex justify-between text-ink-600">
                <span>مبلغ کالاها</span>
                <span>{formatToman(subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink-600">
                <span>هزینهٔ ارسال</span>
                <span>{formatToman(schoolOrderShippingCost)}</span>
              </div>
              <div className="flex justify-between border-t border-brand-100 pt-3 text-base font-extrabold text-ink-900">
                <span>مبلغ نهایی</span>
                <span>{formatToman(total)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-card border border-brand-100 bg-white p-6">
            <h2 className="text-sm font-bold text-ink-900">نشانی تحویل</h2>
            <p className="mt-2 text-sm leading-7 text-ink-600">{order.shippingAddress}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-card border border-brand-100 bg-white p-6">
            <h2 className="mb-5 text-sm font-bold text-ink-900">وضعیت سفارش</h2>
            <Timeline steps={timelineSteps} />
          </div>

          {canReorder && (
            <div className="rounded-card border border-brand-100 bg-brand-50/60 p-6">
              <h2 className="text-sm font-bold text-ink-900">خرید مجدد این سفارش</h2>
              <p className="mt-2 text-xs leading-6 text-ink-600">
                با انتخاب این گزینه، کالاهای قابل تأمین دوباره وارد سبد خرید مدرسه می‌شوند. این قابلیت برای اقلام
                مصرفی مثل لوازم‌التحریر، کاغذ، کتاب و اقلام آموزشی کاربرد ویژه دارد.
              </p>
              <Button size="lg" className="mt-4 w-full">
                <RefreshCw size={16} />
                خرید مجدد این سفارش
              </Button>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
