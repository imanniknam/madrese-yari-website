import { redirect } from "next/navigation";

export default function SchoolOrderSuccessRedirectPage() {
  redirect("/account/orders");
}
