import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/domain/page-header";
import { RegisterNeedForm } from "@/components/domain/register-need-form";

export const metadata: Metadata = { title: "درخواست سفارش عمده" };

export default function BulkOrderRequestPage() {
  return (
    <>
      <PageHeader
        eyebrow="سفارش عمده"
        title="برای تعداد بالا سفارش دارید؟"
        description="اگر برای تجهیز مدرسه به تعداد زیادی از یک کالا نیاز دارید، می‌توانید درخواست سفارش عمده خود را ثبت کنید تا شرایط تأمین و زمان تحویل بررسی شود."
        breadcrumb={[
          { label: "خانه", href: "/" },
          { label: "فروشگاه", href: "/shop" },
          { label: "مدرسه", href: "/shop/school" },
          { label: "درخواست سفارش عمده" },
        ]}
      />

      <Container className="py-12">
        <RegisterNeedForm submitLabel="ثبت درخواست" />
      </Container>
    </>
  );
}
