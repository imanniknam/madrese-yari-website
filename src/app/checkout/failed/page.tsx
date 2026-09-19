import type { Metadata } from "next";
import { XCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = { title: "پرداخت ناموفق" };

export default async function CheckoutFailedPage(props: PageProps<"/checkout/failed">) {
  const searchParams = await props.searchParams;
  const orderNumberParam = searchParams.order;
  const orderNumber = Array.isArray(orderNumberParam) ? orderNumberParam[0] : orderNumberParam;

  return (
    <Container className="flex flex-col items-center py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
        <XCircle size={32} />
      </span>
      <h1 className="mt-6 text-xl font-extrabold text-ink-900 sm:text-2xl">پرداخت انجام نشد.</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-500">
        پرداخت سفارش شما با موفقیت انجام نشد. لطفاً دوباره امتحان کنید.
      </p>
      {orderNumber && <p className="mt-2 text-xs text-ink-400">شمارهٔ سفارش: #{orderNumber}</p>}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/checkout">تلاش دوباره برای پرداخت</ButtonLink>
        <ButtonLink href="/cart" variant="secondary">
          بازگشت به سبد خرید
        </ButtonLink>
      </div>
    </Container>
  );
}
