import type { Metadata } from "next";
import { Phone, Mail, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/domain/page-header";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = { title: "تماس با ما" };

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="تماس با ما"
        title="سوالی دارید؟ با ما در ارتباط باشید."
        breadcrumb={[{ label: "خانه", href: "/" }, { label: "تماس با ما" }]}
      />
      <Container className="py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            {[
              { icon: <Phone size={17} />, label: "۰۲۱-۸۸۸۸۸۸۸۸" },
              { icon: <Mail size={17} />, label: "info@madreseyari.ir" },
              { icon: <MapPin size={17} />, label: "تهران، خیابان ولیعصر، جامعهٔ خیرین مدرسه‌ساز" },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-3 rounded-2xl border border-brand-100 bg-white p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                  {c.icon}
                </span>
                <span className="text-sm text-ink-700">{c.label}</span>
              </div>
            ))}
            <div className="h-52 rounded-card bg-gradient-to-br from-brand-200 to-brand-400" />
          </div>

          <div className="rounded-card border border-brand-100 bg-white p-6 sm:p-8">
            <h2 className="text-base font-bold text-ink-900">فرم تماس</h2>
            <div className="mt-4">
              <ContactForm />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
