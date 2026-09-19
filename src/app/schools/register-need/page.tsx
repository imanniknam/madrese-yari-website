import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/domain/page-header";
import { RegisterNeedForm } from "@/components/domain/register-need-form";

export const metadata: Metadata = { title: "ثبت نیاز مدرسه" };

export default function RegisterNeedPage() {
  return (
    <>
      <PageHeader
        eyebrow="ثبت نیاز مدرسه"
        title="نیاز مدرسهٔ خود را ثبت کنید."
        description="اطلاعات زیر را تکمیل کنید تا نیاز مدرسهٔ شما پس از بررسی کارشناسان مدرسه‌یاری، در سایت منتشر و برای تأمین آن اقدام شود."
        breadcrumb={[{ label: "خانه", href: "/" }, { label: "مدارس", href: "/schools" }, { label: "ثبت نیاز" }]}
      />

      <Container className="py-12">
        <RegisterNeedForm />
      </Container>
    </>
  );
}
