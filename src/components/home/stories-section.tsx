import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/domain/section-heading";
import { ButtonLink } from "@/components/ui/button-link";
import { getStories } from "@/lib/data";

const palettes = [
  "from-brand-200 to-brand-400",
  "from-gold-100 to-gold-300",
  "from-sand-200 to-sand-300",
];

export async function StoriesSection() {
  const stories = await getStories();

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="داستان‌های مدرسه‌یاری"
            title="پشت هر نیاز، یک داستان واقعی است."
            description="از دانش‌آموزی که توانسته وسیلهٔ موردنیازش را خودش انتخاب کند تا مدرسه‌ای که فضای بهتری برای یادگیری فراهم کرده است."
          />
          <ButtonLink href="/stories" variant="secondary" className="hidden sm:inline-flex">
            داستان‌های مدرسه‌یاری
          </ButtonLink>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {stories.map((story, i) => (
            <Link
              key={story.id}
              href={`/stories/${story.id}`}
              className="group overflow-hidden rounded-card border border-brand-100 bg-white transition-all hover:-translate-y-1 hover:shadow-[0_16px_32px_-20px_rgba(12,34,66,0.35)]"
            >
              <div className={`h-36 bg-gradient-to-br ${palettes[i % palettes.length]}`} />
              <div className="p-5">
                <h3 className="text-sm font-bold text-ink-900">{story.title}</h3>
                <p className="mt-2 text-xs leading-6 text-ink-500">{story.excerpt}</p>
                <p className="mt-3 text-[11px] font-medium text-brand-700">{story.person}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
