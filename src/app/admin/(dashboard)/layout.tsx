import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, FileClock, Package, Mail, Users, Boxes, HeartHandshake, LogOut } from "lucide-react";
import { Container } from "@/components/ui/container";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/domain/sign-out-button";

const links = [
  { href: "/admin", label: "داشبورد", icon: <LayoutDashboard size={16} /> },
  { href: "/admin/school-need-requests", label: "درخواست‌های ثبت نیاز", icon: <FileClock size={16} /> },
  { href: "/admin/needs", label: "مدیریت نیازها", icon: <HeartHandshake size={16} /> },
  { href: "/admin/products", label: "مدیریت کالاها", icon: <Boxes size={16} /> },
  { href: "/admin/orders", label: "سفارش‌ها", icon: <Package size={16} /> },
  { href: "/admin/users", label: "کاربران", icon: <Users size={16} /> },
  { href: "/admin/messages", label: "پیام‌های تماس با ما", icon: <Mail size={16} /> },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const isAdmin = (session?.user as { isAdmin?: boolean } | undefined)?.isAdmin;

  if (!session?.user) {
    redirect("/admin/login");
  }
  if (!isAdmin) {
    redirect("/");
  }

  return (
    <Container className="py-8 sm:py-10">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-card border border-brand-100 bg-white p-3">
            <p className="px-3.5 pb-2 pt-1 text-[11px] font-bold text-ink-500">پنل مدیریت</p>
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
