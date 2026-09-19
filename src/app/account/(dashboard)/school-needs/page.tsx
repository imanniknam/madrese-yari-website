import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { NeedCard } from "@/components/domain/need-card";
import { formatNumber } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { getUserById, getNeedsBySchool } from "@/lib/data";

export const metadata: Metadata = { title: "نیازهای مدرسه" };

export default async function AccountSchoolNeedsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/account/login?callbackUrl=/account/school-needs");

  const user = await getUserById(session.user.id as string);
  if (!user?.schoolProfile) {
    return (
      <div className="rounded-card border border-brand-100 bg-white p-8 text-center">
        <h1 className="text-base font-bold text-ink-900">این بخش مخصوص حساب‌های مدرسه است</h1>
        <p className="mt-2 text-sm text-ink-500">حساب کاربری شما به یک پروفایل مدرسه متصل نیست.</p>
      </div>
    );
  }

  const needs = await getNeedsBySchool(user.schoolProfile.id);

  return (
    <div className="space-y-6">
      <div className="rounded-card border border-brand-100 bg-white p-6">
        <h1 className="text-base font-bold text-ink-900">نیازهای منتشرشدهٔ {user.schoolProfile.name}</h1>
        <p className="mt-1 text-sm text-ink-500">{formatNumber(needs.length)} نیاز ثبت‌شده</p>
      </div>

      {!user.schoolProfile.verified && (
        <div className="flex items-start gap-2 rounded-card border border-gold-300 bg-gold-100/40 p-4 text-sm text-ink-700">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-gold-600" />
          <span>
            پروفایل مدرسهٔ شما هنوز توسط تیم مدرسه‌یاری تأیید نشده است. برای ثبت نیاز جدید، از فرم{" "}
            <Link href="/schools/register-need" className="font-bold underline">
              ثبت نیاز مدرسه
            </Link>{" "}
            استفاده کنید.
          </span>
        </div>
      )}

      {needs.length === 0 && (
        <div className="rounded-card border border-brand-100 bg-white p-8 text-center text-sm text-ink-500">
          هنوز نیازی برای این مدرسه منتشر نشده است.
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        {needs.map((need) => (
          <NeedCard key={need.id} need={need} />
        ))}
      </div>
    </div>
  );
}
