import { Hero } from "@/components/home/hero";
import { WaysToHelp } from "@/components/home/ways-to-help";
import { NeedsInProgress } from "@/components/home/needs-in-progress";
import { ShopTeaser } from "@/components/home/shop-teaser";
import { StudentSchoolSplit } from "@/components/home/student-school-split";
import { ProcessSteps } from "@/components/home/process-steps";
import { ImpactBand } from "@/components/home/impact-band";
import { StoriesSection } from "@/components/home/stories-section";
import { FinalCta } from "@/components/home/final-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <WaysToHelp />
      <NeedsInProgress />
      <ShopTeaser />
      <StudentSchoolSplit />
      <ProcessSteps />
      <ImpactBand />
      <StoriesSection />
      <FinalCta />
    </>
  );
}
