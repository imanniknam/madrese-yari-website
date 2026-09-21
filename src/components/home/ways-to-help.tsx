import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/domain/section-heading";
import { IconTile } from "@/components/illustrations/icon-tile";
import { BackpackIcon, BoxIcon, CoinIcon } from "@/components/illustrations/category-icons";
import { waysToHelp } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const icons = {
  shop: <BackpackIcon />,
  direct: <BoxIcon />,
  credit: <CoinIcon />,
};

const tones = {
  shop: "brand" as const,
  direct: "sand" as const,
  credit: "gold" as const,
};

const cardBg = {
  shop: "bg-brand-50/70 border-brand-100",
  direct: "bg-sky-100/70 border-sky-200",
  credit: "bg-gold-100/60 border-gold-300/50",
};

export function WaysToHelp() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="سه راه برای کمک"
          title="شما چطور می‌خواهید کمک کنید؟"
          description="هر روش، یک اثر مشترک؛ همهٔ مسیرها به یک هدف می‌رسند."
          align="center"
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {waysToHelp.map((way) => (
            <Link
              key={way.id}
              href={way.href}
              className={cn(
                "group flex flex-col gap-4 rounded-card border p-6 transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(12,34,66,0.4)]",
                cardBg[way.id as keyof typeof cardBg]
              )}
            >
              <IconTile tone={tones[way.id as keyof typeof tones]}>
                {icons[way.id as keyof typeof icons]}
              </IconTile>
              <div>
                <h3 className="text-base font-bold text-ink-900">{way.title}</h3>
                <p className="mt-2 text-sm leading-7 text-ink-500">{way.description}</p>
              </div>
              <span className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                {way.cta}
                <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
