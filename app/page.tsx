import { HeroSection } from "@/components/HeroSection";
import { SectionAbout } from "@/components/SectionAbout";
import { SectionContact } from "@/components/SectionContact";
import { SectionOne } from "@/components/SectionOne";
import { SectionProcess } from "@/components/SectionProcess";
import { SectionTrustedBy } from "@/components/SectionTrustedBy";
import { SiteFooter } from "@/components/SiteFooter";

export default function Home() {
  return (
    <>
      <main id="main">
        <section id="hero" className="snapSection" aria-label="Hero">
          <HeroSection />
        </section>
        <section id="relationships" className="snapSection noSnap">
          <SectionOne />
        </section>

        <section id="trusted" className="snapSection" aria-label="Trusted by">
          <SectionTrustedBy />
        </section>
        <section id="process" className="snapSection" aria-label="Process">
          <SectionProcess />
        </section>
        <section id="about" className="snapSection" aria-label="About us">
          <SectionAbout />
        </section>
        <section id="contact" className="snapSection" aria-label="Contact">
          <SectionContact />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
