import { StoreHero } from "@/components/home/store-hero";
import { ProductSlider } from "@/components/home/product-slider";
import { CategoryGrid } from "@/components/home/category-grid";
import { WaysToHelp } from "@/components/home/ways-to-help";
import { NeedsInProgress } from "@/components/home/needs-in-progress";
import { ImpactBand } from "@/components/home/impact-band";
import { StoriesSection } from "@/components/home/stories-section";
import { FinalCta } from "@/components/home/final-cta";
import { getCategories, getFeaturedProducts } from "@/lib/data";

export default async function Home() {
  const [categories, products] = await Promise.all([getCategories(), getFeaturedProducts()]);
  const inStock = products.filter((p) => p.stock !== "out_of_stock");

  return (
    <>
      <StoreHero categories={categories} />
      <ProductSlider title="محصولات ویژه" href="/shop" products={inStock} />
      <CategoryGrid categories={categories} />
      <ProductSlider title="مناسب سفارش مدارس" href="/shop/school" products={inStock.filter((p) => p.bulkAvailable).reverse()} tone="tint" />
      <NeedsInProgress />
      <WaysToHelp />
      <ImpactBand />
      <StoriesSection />
      <FinalCta />
    </>
  );
}
