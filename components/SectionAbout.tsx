"use client";

import { useReveal } from "@/lib/use-reveal";
import styles from "./SectionAbout.module.css";

const PARTNERS = [
  {
    name: "Elena Voss",
    role: "Systems & trust",
    bio: "Turns fragile ideas into agreements you can stand behind — security, governance, and the human cost of both.",
  },
  {
    name: "Marcus Iyer",
    role: "Product & craft",
    bio: "Builds interfaces that feel inevitable: quiet typography, honest motion, and room for the relationship to grow.",
  },
] as const;

export function SectionAbout() {
  const { ref, revealed } = useReveal();

  return (
    <section ref={ref} className={styles.root} aria-labelledby="about-heading">
      <div className={`${styles.rail} ${styles.railTop}`}>
        <div>
          <span className={styles.dot} />
          Section 04 / About
        </div>
        <div>01001000 · 01101001</div>
      </div>

      <div className={styles.inner}>
        <div className={`${styles.statement} ${revealed ? styles.statementVisible : ""}`}>
          <h2 id="about-heading" className={styles.statementText}>
            We are a small atelier of two — invested not in projects alone, but in{" "}
            <strong>relationships</strong> that outlast the roadmap.
          </h2>
        </div>

        <div className={styles.bios}>
          {PARTNERS.map((p, i) => (
            <article
              key={p.name}
              className={`${styles.bio} ${revealed ? styles.bioVisible : ""}`}
              style={{ transitionDelay: revealed ? `${120 + i * 100}ms` : undefined }}
            >
              <div className={styles.portrait} aria-hidden="true" />
              <div className={styles.bioBody}>
                <h3>{p.name}</h3>
                <p className={styles.role}>{p.role}</p>
                <p>{p.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className={`${styles.rail} ${styles.railBot}`}>
        <div>stage · about</div>
        <div>Warm / 0.1</div>
      </div>
    </section>
  );
}
