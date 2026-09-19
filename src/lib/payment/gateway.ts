export type PaymentRequest = {
  amountToman: number;
  orderId: string;
  description: string;
  callbackUrl: string;
  payerMobile?: string;
};

export type PaymentRequestResult =
  | { ok: true; authority: string; redirectUrl: string }
  | { ok: false; errorCode: string; message: string };

export type PaymentVerifyRequest = {
  amountToman: number;
  authority: string;
};

export type PaymentVerifyResult =
  | { ok: true; refId: string; cardPan?: string }
  | { ok: false; errorCode: string; message: string };

// Every payment provider (ZarinPal today, others later) implements this shape.
// Domain/order code must depend only on this interface, never on a specific gateway's SDK/response format.
export interface PaymentGateway {
  requestPayment(input: PaymentRequest): Promise<PaymentRequestResult>;
  verifyPayment(input: PaymentVerifyRequest): Promise<PaymentVerifyResult>;
}
