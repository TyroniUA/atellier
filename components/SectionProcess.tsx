"use client";

import { useReveal } from "@/lib/use-reveal";
import styles from "./SectionProcess.module.css";

const STEPS = [
  {
    num: "01",
    title: "Listen",
    body: "We sit with the problem until the noise thins — constraints, people, and what success really means.",
  },
  {
    num: "02",
    title: "Frame",
    body: "A narrow brief and a shared vocabulary so the work stays honest when things get hard.",
  },
  {
    num: "03",
    title: "Build",
    body: "Small, careful iterations. We ship early enough to learn and late enough to be proud.",
  },
  {
    num: "04",
    title: "Tend",
    body: "Relationships outlive launches. We stay close enough to notice when the ground shifts.",
  },
] as const;

export function SectionProcess() {
  const { ref, revealed } = useReveal();

  return (
    <section ref={ref} className={styles.root} aria-label="Our process">
      <div className={`${styles.rail} ${styles.railTop}`}>
        <div>
          <span className={styles.dot} />
          Section 03 / Process
        </div>
        <div>01001000 · 01101001</div>
      </div>

      <div className={styles.inner}>
        <ol className={styles.steps}>
          {STEPS.map((step, i) => (
            <li
              key={step.num}
              className={`${styles.step} ${revealed ? styles.stepVisible : ""}`}
              style={{ transitionDelay: revealed ? `${60 + i * 90}ms` : undefined }}
            >
              <p className={styles.num}>{step.num}</p>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.body}>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className={`${styles.rail} ${styles.railBot}`}>
        <div>stage · process</div>
        <div>Warm / 0.1</div>
      </div>
    </section>
  );
}
