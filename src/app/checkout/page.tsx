import type { Metadata } from "next";
import { CheckoutPageClient } from "./checkout-page-client";

export const metadata: Metadata = { title: "تسویه‌حساب" };

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
