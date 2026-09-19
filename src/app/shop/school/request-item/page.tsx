import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/domain/page-header";
import { RegisterNeedForm } from "@/components/domain/register-need-form";

export const metadata: Metadata = { title: "درخواست تأمین کالا" };

export default async function RequestItemPage(props: PageProps<"/shop/school/request-item">) {
  const searchParams = await props.searchParams;
  const itemParam = searchParams.item;
  const itemName = Array.isArray(itemParam) ? itemParam[0] : itemParam;

  return (
    <>
      <PageHeader
        eyebrow="کالای ناموجود"
        title="این کالا فعلاً موجود نیست."
        description="اگر این کالا برای مدرسه شما موردنیاز است، درخواست تأمین آن را ثبت کنید تا امکان تأمین آن بررسی شود."
        breadcrumb={[
          { label: "خانه", href: "/" },
          { label: "فروشگاه", href: "/shop" },
          { label: "مدرسه", href: "/shop/school" },
          { label: "درخواست تأمین کالا" },
        ]}
      />

      <Container className="py-12">
        <RegisterNeedForm defaultItemTitle={itemName ?? ""} submitLabel="ثبت درخواست" />
      </Container>
    </>
  );
}
