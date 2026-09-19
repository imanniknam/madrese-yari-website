import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNumber } from "@/lib/utils";
import { getAllUsersForAdmin } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@prisma/client";

export const metadata: Metadata = { title: "مدیریت کاربران" };

const ROLE_LABEL: Record<UserRole, string> = {
  CUSTOMER: "کاربر عادی",
  DONOR: "خیر",
  STUDENT: "دانش‌آموز",
  SCHOOL: "مدرسه",
};

const ROLE_OPTIONS: UserRole[] = ["CUSTOMER", "DONOR", "STUDENT", "SCHOOL"];

async function updateUserAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  const role = formData.get("role") as UserRole;
  const isAdmin = formData.get("isAdmin") === "on";
  const verifySchool = formData.get("verifySchool") === "on";

  await prisma.user.update({ where: { id }, data: { role, isAdmin } });

  if (verifySchool) {
    await prisma.schoolProfile.updateMany({ where: { userId: id }, data: { verified: true } });
  }

  revalidatePath("/admin/users");
}

export default async function AdminUsersPage() {
  const users = await getAllUsersForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-extrabold text-ink-900">مدیریت کاربران</h1>
        <p className="mt-1 text-sm text-ink-500">{formatNumber(users.length)} کاربر</p>
      </div>

      <div className="overflow-x-auto rounded-card border border-brand-100 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-100 text-right text-xs text-ink-500">
              <th className="p-4 font-medium">نام</th>
              <th className="p-4 font-medium">شماره موبایل</th>
              <th className="p-4 font-medium">تاریخ عضویت</th>
              <th className="p-4 font-medium">وضعیت مدرسه</th>
              <th className="p-4 font-medium">مدیریت</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-brand-50 last:border-0">
                <td className="p-4 font-bold text-ink-900">
                  {u.firstName} {u.lastName}
                </td>
                <td className="p-4 text-ink-500">{u.phone}</td>
                <td className="p-4 text-ink-500">{formatDate(u.createdAt)}</td>
                <td className="p-4">
                  {u.schoolProfile ? (
                    <Badge variant={u.schoolProfile.verified ? "brand" : "gold"}>
                      {u.schoolProfile.verified ? "تأییدشده" : "در انتظار تأیید"}
                    </Badge>
                  ) : (
                    <span className="text-ink-300">—</span>
                  )}
                </td>
                <td className="p-4">
                  <form action={updateUserAction} className="flex flex-wrap items-center gap-2">
                    <input type="hidden" name="id" value={u.id} />
                    <Select name="role" defaultValue={u.role} className="h-9 w-32 text-xs">
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r} value={r}>
                          {ROLE_LABEL[r]}
                        </option>
                      ))}
                    </Select>
                    <label className="flex items-center gap-1.5 text-xs text-ink-700">
                      <input type="checkbox" name="isAdmin" defaultChecked={u.isAdmin} className="accent-brand-600" />
                      مدیر
                    </label>
                    {u.schoolProfile && !u.schoolProfile.verified && (
                      <label className="flex items-center gap-1.5 text-xs text-ink-700">
                        <input type="checkbox" name="verifySchool" className="accent-brand-600" />
                        تأیید مدرسه
                      </label>
                    )}
                    <Button type="submit" size="sm" variant="secondary">
                      ذخیره
                    </Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
