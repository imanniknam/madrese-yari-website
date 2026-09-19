import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { formatToman, formatDate } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { getOrderByOrderNumber } from "@/lib/data";

export const metadata: Metadata = { title: "پرداخت موفق" };

const paymentMethodLabel: Record<string, string> = {
  ONLINE_GATEWAY: "پرداخت آنلاین",
  STUDENT_TOKEN: "پرداخت با اعتبار مدرسه‌یاری",
};

export default async function CheckoutSuccessPage(props: PageProps<"/checkout/success">) {
  const searchParams = await props.searchParams;
  const orderNumberParam = searchParams.order;
  const orderNumber = Array.isArray(orderNumberParam) ? orderNumberParam[0] : orderNumberParam;

  const session = await auth();
  const order = orderNumber ? await getOrderByOrderNumber(orderNumber) : null;
  // Only show order details to the account that placed it — a guessed/shared order number
  // in the URL shouldn't leak someone else's order info.
  const visibleOrder = order && session?.user?.id === order.userId ? order : null;

  return (
    <Container className="flex flex-col items-center py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600">
        <CheckCircle2 size={32} />
      </span>
      <h1 className="mt-6 text-xl font-extrabold text-ink-900 sm:text-2xl">سفارش شما با موفقیت ثبت شد.</h1>
      <p className="mt-2 text-sm text-ink-500">پرداخت شما با موفقیت انجام شد.</p>

      <div className="mt-8 w-full max-w-sm space-y-3 rounded-card border border-brand-100 bg-white p-6 text-right">
        <div className="flex justify-between text-sm">
          <span className="text-ink-500">شمارهٔ سفارش</span>
          <span className="font-bold text-ink-900">#{visibleOrder?.orderNumber ?? orderNumber ?? "—"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-ink-500">تاریخ</span>
          <span className="font-bold text-ink-900">{visibleOrder ? formatDate(visibleOrder.createdAt) : "—"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-ink-500">مبلغ</span>
          <span className="font-bold text-ink-900">{visibleOrder ? formatToman(visibleOrder.totalToman) : "—"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-ink-500">روش پرداخت</span>
          <span className="font-bold text-ink-900">
            {visibleOrder ? (paymentMethodLabel[visibleOrder.paymentMethod] ?? visibleOrder.paymentMethod) : "—"}
          </span>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/account/orders">پیگیری سفارش</ButtonLink>
        <ButtonLink href="/shop" variant="secondary">
          بازگشت به فروشگاه
        </ButtonLink>
      </div>
    </Container>
  );
}
