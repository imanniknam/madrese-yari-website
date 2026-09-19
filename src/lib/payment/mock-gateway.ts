import type {
  PaymentGateway,
  PaymentRequest,
  PaymentRequestResult,
  PaymentVerifyRequest,
  PaymentVerifyResult,
} from "./gateway";

// Local-dev stand-in for ZarinPal, used until ZARINPAL_MERCHANT_ID is configured.
// Always succeeds so the checkout flow can be built/tested end-to-end without real credentials.
export class MockPaymentGateway implements PaymentGateway {
  async requestPayment(input: PaymentRequest): Promise<PaymentRequestResult> {
    const authority = `MOCK-${input.orderId}-${Date.now()}`;
    // callbackUrl already carries its own query string (?orderId=...), so a bare "?" here
    // would get swallowed into that value instead of starting a new param.
    const separator = input.callbackUrl.includes("?") ? "&" : "?";
    return {
      ok: true,
      authority,
      redirectUrl: `${input.callbackUrl}${separator}Authority=${authority}&Status=OK`,
    };
  }

  async verifyPayment(input: PaymentVerifyRequest): Promise<PaymentVerifyResult> {
    return { ok: true, refId: `MOCK-REF-${input.authority.slice(-6)}` };
  }
}
