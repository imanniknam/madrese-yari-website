import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FieldGroup, Input } from "@/components/ui/field";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserById } from "@/lib/data";

export const metadata: Metadata = { title: "پروفایل" };

async function updateProfile(formData: FormData) {
  "use server";
  const session = await auth();
  const userId = session?.user?.id as string | undefined;
  if (!userId) return;

  await prisma.user.update({
    where: { id: userId },
    data: {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      email: String(formData.get("email") ?? "") || null,
    },
  });

  revalidatePath("/account/profile");
}

export default async function AccountProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/account/login?callbackUrl=/account/profile");
  const userId = session.user.id as string;
  const user = await getUserById(userId);

  return (
    <form action={updateProfile} className="rounded-card border border-brand-100 bg-white p-6 sm:p-8">
      <h1 className="text-base font-bold text-ink-900">اطلاعات پروفایل</h1>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <FieldGroup label="نام">
          <Input name="firstName" defaultValue={user?.firstName ?? ""} />
        </FieldGroup>
        <FieldGroup label="نام خانوادگی">
          <Input name="lastName" defaultValue={user?.lastName ?? ""} />
        </FieldGroup>
        <FieldGroup label="شمارهٔ موبایل">
          <Input defaultValue={user?.phone ?? ""} disabled />
        </FieldGroup>
        <FieldGroup label="ایمیل">
          <Input name="email" type="email" defaultValue={user?.email ?? ""} />
        </FieldGroup>
        {user?.studentProfile && (
          <>
            <FieldGroup label="مدرسه">
              <Input defaultValue={user.studentProfile.school.name} disabled />
            </FieldGroup>
            <FieldGroup label="پایهٔ تحصیلی">
              <Input defaultValue={user.studentProfile.grade} disabled />
            </FieldGroup>
          </>
        )}
      </div>
      <Button type="submit" className="mt-6">
        ذخیرهٔ تغییرات
      </Button>
    </form>
  );
}
