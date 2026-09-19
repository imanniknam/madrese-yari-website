import type { PaymentGateway } from "./gateway";
import { ZarinPalGateway } from "./zarinpal";
import { MockPaymentGateway } from "./mock-gateway";

export type { PaymentGateway } from "./gateway";
export * from "./gateway";

let cached: PaymentGateway | null = null;

export function getPaymentGateway(): PaymentGateway {
  if (cached) return cached;
  cached = process.env.ZARINPAL_MERCHANT_ID ? new ZarinPalGateway() : new MockPaymentGateway();
  return cached;
}
