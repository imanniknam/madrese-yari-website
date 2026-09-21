import { Container } from "@/components/ui/container";
import { CategoryCard } from "@/components/domain/category-card";
import type { Category } from "@/lib/mock-data";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="py-10">
      <Container>
        <h2 className="mb-5 border-r-4 border-gold-500 pr-3 text-xl font-extrabold text-ink-900">دسته‌بندی کالاها</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      </Container>
    </section>
  );
}
