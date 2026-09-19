import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumb,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumb?: { label: string; href?: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-900 pb-14 pt-8 sm:pb-16 sm:pt-10">
      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-brand-700/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-gold-500/10 blur-3xl" />
      <Container className="relative">
        {breadcrumb && (
          <div className="mb-5 [&_a]:text-brand-200 [&_a:hover]:text-white [&_span]:text-white">
            <Breadcrumb items={breadcrumb} />
          </div>
        )}
        {eyebrow && (
          <span className="mb-3 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-100">
            {eyebrow}
          </span>
        )}
        <h1 className="text-balance text-2xl font-extrabold text-white sm:text-3xl lg:text-[34px]">{title}</h1>
        {description && (
          <p className="mt-3 max-w-2xl text-[14.5px] leading-7 text-brand-100">{description}</p>
        )}
        {children}
      </Container>
    </section>
  );
}
