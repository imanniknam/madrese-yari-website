import type {
  PaymentGateway,
  PaymentRequest,
  PaymentRequestResult,
  PaymentVerifyRequest,
  PaymentVerifyResult,
} from "./gateway";

const SANDBOX_BASE = "https://sandbox.zarinpal.com/pg/v4/payment";
const LIVE_BASE = "https://payment.zarinpal.com/pg/v4/payment";
const SANDBOX_STARTPAY = "https://sandbox.zarinpal.com/pg/StartPay";
const LIVE_STARTPAY = "https://payment.zarinpal.com/pg/StartPay";

// Real ZarinPal integration, gated behind the PaymentGateway interface (see gateway.ts) so
// domain/order code never talks to ZarinPal's request/response shape directly.
export class ZarinPalGateway implements PaymentGateway {
  private merchantId: string;
  private sandbox: boolean;

  constructor(options?: { merchantId?: string; sandbox?: boolean }) {
    this.merchantId = options?.merchantId ?? process.env.ZARINPAL_MERCHANT_ID ?? "";
    this.sandbox = options?.sandbox ?? process.env.ZARINPAL_SANDBOX !== "false";
  }

  private get base() {
    return this.sandbox ? SANDBOX_BASE : LIVE_BASE;
  }

  private get startPayBase() {
    return this.sandbox ? SANDBOX_STARTPAY : LIVE_STARTPAY;
  }

  async requestPayment(input: PaymentRequest): Promise<PaymentRequestResult> {
    if (!this.merchantId) {
      return { ok: false, errorCode: "NO_MERCHANT_ID", message: "ZARINPAL_MERCHANT_ID تنظیم نشده است." };
    }

    const res = await fetch(`${this.base}/request.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: this.merchantId,
        amount: input.amountToman * 10, // ZarinPal expects Rial
        description: input.description,
        callback_url: input.callbackUrl,
        metadata: { order_id: input.orderId, mobile: input.payerMobile },
      }),
    });

    const data = await res.json();

    if (data?.data?.code === 100) {
      const authority = data.data.authority as string;
      return { ok: true, authority, redirectUrl: `${this.startPayBase}/${authority}` };
    }

    return {
      ok: false,
      errorCode: String(data?.errors?.code ?? "UNKNOWN"),
      message: data?.errors?.message ?? "خطا در اتصال به درگاه پرداخت.",
    };
  }

  async verifyPayment(input: PaymentVerifyRequest): Promise<PaymentVerifyResult> {
    if (!this.merchantId) {
      return { ok: false, errorCode: "NO_MERCHANT_ID", message: "ZARINPAL_MERCHANT_ID تنظیم نشده است." };
    }

    const res = await fetch(`${this.base}/verify.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: this.merchantId,
        amount: input.amountToman * 10,
        authority: input.authority,
      }),
    });

    const data = await res.json();

    if (data?.data?.code === 100 || data?.data?.code === 101) {
      return { ok: true, refId: String(data.data.ref_id), cardPan: data.data.card_pan };
    }

    return {
      ok: false,
      errorCode: String(data?.errors?.code ?? "UNKNOWN"),
      message: data?.errors?.message ?? "تراکنش تأیید نشد.",
    };
  }
}
