import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/domain/page-header";
import { SchoolCard } from "@/components/domain/school-card";
import { ButtonLink } from "@/components/ui/button-link";
import { getSchools } from "@/lib/data";

export const metadata: Metadata = { title: "معرفی مدارس" };

export default async function SchoolsPage() {
  const schools = await getSchools();

  return (
    <>
      <PageHeader
        eyebrow="مدارس مدرسه‌یاری"
        title="مدارسی که همراه ما هستند."
        description="مدارس عضو مدرسه‌یاری می‌توانند نیازهای خود را ثبت کنند تا برای تأمین آن‌ها اقدام شود؛ از تجهیزات کلاس تا وسایل آموزشی و کمک‌آموزشی."
        breadcrumb={[{ label: "خانه", href: "/" }, { label: "مدارس" }]}
      >
        <ButtonLink href="/schools/register-need" variant="gold" className="mt-6 inline-flex">
          ثبت نیاز مدرسه
        </ButtonLink>
      </PageHeader>

      <Container className="py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {schools.map((s) => (
            <SchoolCard key={s.id} school={s} />
          ))}
        </div>
      </Container>
    </>
  );
}
