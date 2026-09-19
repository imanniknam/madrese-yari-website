import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ButtonLink } from "@/components/ui/button-link";
import { getStories, getStoryById } from "@/lib/data";

export async function generateStaticParams() {
  const stories = await getStories();
  return stories.map((s) => ({ id: s.id }));
}

export async function generateMetadata(props: PageProps<"/stories/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const story = await getStoryById(id);
  return { title: story?.title ?? "داستان" };
}

export default async function StoryDetailPage(props: PageProps<"/stories/[id]">) {
  const { id } = await props.params;
  const story = await getStoryById(id);
  if (!story) notFound();

  return (
    <>
      <div className="h-56 bg-gradient-to-br from-brand-300 via-brand-500 to-brand-700 sm:h-72" />
      <Container className="max-w-2xl py-10">
        <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "داستان‌ها", href: "/stories" }, { label: story.title }]} />
        <h1 className="mt-4 text-2xl font-extrabold text-ink-900 sm:text-[28px]">{story.title}</h1>
        <p className="mt-2 text-sm font-medium text-brand-700">{story.person}</p>
        <p className="mt-6 text-[15px] leading-8 text-ink-600">{story.body}</p>

        <div className="mt-10 rounded-card bg-brand-50/60 p-6 text-center">
          <p className="text-sm font-bold text-ink-900">شما هم می‌توانید بخشی از یک داستان باشید.</p>
          <ButtonLink href="/help" className="mt-4 inline-flex">
            کمک کن
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}
