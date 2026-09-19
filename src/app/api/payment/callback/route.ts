import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPaymentGateway } from "@/lib/payment";
import type { Prisma } from "@prisma/client";

// Golden rule from docs/02-data-model.md: the browser returning here is never, by itself,
// proof of payment. The order is only marked CONFIRMED after verifyPayment succeeds server-side.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const orderId = searchParams.get("orderId");
  const authority = searchParams.get("Authority");
  const status = searchParams.get("Status");

  if (!orderId || !authority) {
    return NextResponse.redirect(`${origin}/checkout/failed`);
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return NextResponse.redirect(`${origin}/checkout/failed`);
  }

  if (status !== "OK") {
    await prisma.order.update({ where: { id: orderId }, data: { status: "PAYMENT_FAILED" } });
    return NextResponse.redirect(`${origin}/checkout/failed?order=${order.orderNumber}`);
  }

  const gateway = getPaymentGateway();
  const verifyResult = await gateway.verifyPayment({ amountToman: order.totalToman, authority });

  await prisma.paymentTransaction.create({
    data: {
      orderId: order.id,
      amountToman: order.totalToman,
      refId: verifyResult.ok ? verifyResult.refId : undefined,
      status: verifyResult.ok ? "SUCCESS" : "FAILED",
      rawResponse: verifyResult as unknown as Prisma.InputJsonValue,
    },
  });

  if (!verifyResult.ok) {
    await prisma.order.update({ where: { id: orderId }, data: { status: "PAYMENT_FAILED" } });
    return NextResponse.redirect(`${origin}/checkout/failed?order=${order.orderNumber}`);
  }

  await prisma.order.update({ where: { id: orderId }, data: { status: "CONFIRMED" } });
  return NextResponse.redirect(`${origin}/checkout/success?order=${order.orderNumber}`);
}
