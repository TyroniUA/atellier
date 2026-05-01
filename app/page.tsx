import { HeroSection } from "@/components/HeroSection";
import { SectionOne } from "@/components/SectionOne";

export default function Home() {
  return (
    <main id="main">
      <section className="snapSection" aria-label="Hero">
        <HeroSection />
      </section>
      <section className="snapSection">
        <SectionOne />
      </section>
    </main>
  );
}
