import { redirect } from "next/navigation";

// The school order flow is unified with the regular cart/checkout — add items to
// the cart from /shop/school, then continue here.
export default function SchoolOrderRedirectPage() {
  redirect("/cart");
}
