import type { Metadata } from "next";
import { CartPageClient } from "./cart-page-client";

export const metadata: Metadata = { title: "سبد خرید" };

export default function CartPage() {
  return <CartPageClient />;
}
