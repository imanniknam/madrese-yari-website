import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { auth } from "@/lib/auth";
import { placeOrder } from "@/lib/domain/place-order";
import { ContributionError } from "@/lib/domain/contribute-to-need";
import { getPaymentGateway } from "@/lib/payment";
import type { BuyerType, PaymentMethod, Prisma } from "@prisma/client";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "ابتدا وارد حساب کاربری خود شوید." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const {
    buyerType,
    paymentMethod,
    items,
    shippingAddress,
  }: {
    buyerType: BuyerType;
    paymentMethod: PaymentMethod;
    items: { productId: string; qty: number }[];
    shippingAddress: Record<string, unknown>;
  } = body ?? {};

  if (!buyerType || !paymentMethod || !items?.length || !shippingAddress) {
    return NextResponse.json({ error: "اطلاعات سفارش ناقص است." }, { status: 400 });
  }

  try {
    const order = await placeOrder({
      userId: session.user.id as string,
      buyerType,
      paymentMethod,
      items,
      shippingAddress: shippingAddress as Prisma.InputJsonValue,
      idempotencyKey: randomUUID(),
    });

    if (paymentMethod === "ONLINE_GATEWAY") {
      const gateway = getPaymentGateway();
      const result = await gateway.requestPayment({
        amountToman: order.totalToman,
        orderId: order.id,
        description: `پرداخت سفارش #${order.orderNumber} — مدرسه‌یاری`,
        callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/payment/callback?orderId=${order.id}`,
      });

      if (!result.ok) {
        return NextResponse.json({ error: result.message }, { status: 502 });
      }

      return NextResponse.json({ order, redirectUrl: result.redirectUrl });
    }

    return NextResponse.json({ order });
  } catch (error) {
    if (error instanceof ContributionError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: 409 });
    }
    throw error;
  }
}
