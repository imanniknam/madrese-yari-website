import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/domain/section-heading";
import { ProductCard } from "@/components/domain/product-card";
import { ButtonLink } from "@/components/ui/button-link";
import { getFeaturedProducts } from "@/lib/data";

export async function ShopTeaser() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="فروشگاه مدرسه‌یاری"
              title="خریدی که به مدرسه و دانش‌آموز هم می‌رسد."
              description="فروشگاه مدرسه‌یاری فقط برای خیرین نیست. کیف، کوله‌پشتی، لوازم‌التحریر، کتاب، تجهیزات آموزشی، نقشه، وسایل کمک‌آموزشی و تجهیزات کلاس را اینجا پیدا کنید. شما با هر خرید به تحصیل دانش‌آموزان کمک می‌کنید — بخشی از سود فروشگاه صرف تأمین نیازهای مدارس و دانش‌آموزان می‌شود."
            />
            <ButtonLink href="/shop" className="mt-6 inline-flex">
              مشاهده فروشگاه
            </ButtonLink>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {featuredProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
