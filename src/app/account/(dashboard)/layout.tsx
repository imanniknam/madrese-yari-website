import Link from "next/link";
import { redirect } from "next/navigation";
import { Wallet, ShoppingBag, Package, User, LogOut, HeartHandshake, Building2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/domain/sign-out-button";

type NavLink = { href: string; label: string; icon: React.ReactNode };

const baseLinks: NavLink[] = [{ href: "/account", label: "داشبورد", icon: <User size={16} /> }];
const tailLinks: NavLink[] = [
  { href: "/account/orders", label: "سفارش‌ها", icon: <Package size={16} /> },
  { href: "/account/profile", label: "پروفایل", icon: <User size={16} /> },
];

function linksForRole(role: string | undefined): NavLink[] {
  if (role === "STUDENT") {
    return [
      ...baseLinks,
      { href: "/account/credit", label: "اعتبار من", icon: <Wallet size={16} /> },
      { href: "/shop/student", label: "فروشگاه دانش‌آموزی", icon: <ShoppingBag size={16} /> },
      ...tailLinks,
    ];
  }
  if (role === "SCHOOL") {
    return [
      ...baseLinks,
      { href: "/account/school-needs", label: "نیازهای مدرسه", icon: <Building2 size={16} /> },
      { href: "/shop/school", label: "فروشگاه مدرسه", icon: <ShoppingBag size={16} /> },
      ...tailLinks,
    ];
  }
  if (role === "DONOR") {
    return [
      ...baseLinks,
      { href: "/account/contributions", label: "مشارکت‌های من", icon: <HeartHandshake size={16} /> },
      { href: "/shop", label: "فروشگاه", icon: <ShoppingBag size={16} /> },
      ...tailLinks,
    ];
  }
  // CUSTOMER
  return [...baseLinks, { href: "/shop", label: "فروشگاه", icon: <ShoppingBag size={16} /> }, ...tailLinks];
}

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/account/login?callbackUrl=/account");
  }

  const role = (session.user as { role?: string }).role;
  const links = linksForRole(role);

  return (
    <Container className="py-8 sm:py-10">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-card border border-brand-100 bg-white p-3">
            <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-800"
                >
                  {l.icon}
                  {l.label}
                </Link>
              ))}
              <SignOutButton>
                <LogOut size={16} />
                خروج
              </SignOutButton>
            </nav>
          </div>
        </aside>
        <div>{children}</div>
      </div>
    </Container>
  );
}
