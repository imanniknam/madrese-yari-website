import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";

export function FinalCta() {
  return (
    <section className="pb-20">
      <Container>
        <div className="relative overflow-hidden rounded-card bg-gradient-to-l from-brand-700 to-brand-900 px-8 py-12 sm:px-14 sm:py-16">
          <div className="pointer-events-none absolute -left-10 -top-10 h-52 w-52 rounded-full bg-gold-400/20 blur-3xl" />
          <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-balance text-2xl font-extrabold text-white sm:text-3xl">
                شما از کجا شروع می‌کنید؟
              </h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-brand-100">
                می‌توانید یک نیاز مشخص را تأمین کنید، کالای موردنیاز را تهیه کنید یا با خرید از فروشگاه، بخشی از
                سود خرید خود را به تأمین این نیازها اختصاص دهید.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <ButtonLink href="/help" variant="gold" size="lg" className="justify-center">
                می‌خواهم کمک کنم
              </ButtonLink>
              <ButtonLink
                href="/shop"
                size="lg"
                variant="secondary"
                className="justify-center border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                خرید از فروشگاه
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
