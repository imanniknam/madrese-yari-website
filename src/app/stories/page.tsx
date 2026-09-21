import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/domain/page-header";
import { getStories } from "@/lib/data";

export const metadata: Metadata = { title: "داستان‌ها" };

const palettes = ["from-brand-200 to-brand-400", "from-gold-100 to-gold-300", "from-sand-200 to-sand-300"];

export default async function StoriesPage() {
  const stories = await getStories();

  return (
    <>
      <PageHeader
        eyebrow="داستان‌های مدرسه‌یاری"
        title="پشت هر نیاز، یک داستان واقعی است."
        description="از دانش‌آموزی که توانسته وسیلهٔ موردنیازش را خودش انتخاب کند تا مدرسه‌ای که فضای بهتری برای یادگیری فراهم کرده است."
        breadcrumb={[{ label: "خانه", href: "/" }, { label: "داستان‌ها" }]}
      />
      <Container className="py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story, i) => (
            <Link
              key={story.id}
              href={`/stories/${story.id}`}
              className="group overflow-hidden rounded-card border border-brand-100 bg-white transition-all hover:-translate-y-1 hover:shadow-[0_16px_32px_-20px_rgba(16,44,31,0.35)]"
            >
              <div className={`h-40 bg-gradient-to-br ${palettes[i % palettes.length]}`} />
              <div className="p-5">
                <h3 className="text-sm font-bold text-ink-900">{story.title}</h3>
                <p className="mt-2 text-xs leading-6 text-ink-500">{story.excerpt}</p>
                <p className="mt-3 text-[11px] font-medium text-brand-700">{story.person}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
