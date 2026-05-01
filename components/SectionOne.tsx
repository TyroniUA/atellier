"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import styles from "./SectionOne.module.css";

const ROTATING_WORDS = ["AI", "Web", "Security", "High scale optimisation"] as const;
const FINALE = "Relationships";
const SLOT_COUNT = ROTATING_WORDS.length + 1;
const WORD_SIZE_STEP_PX = 2;
const FINALE_START_PROGRESS = 0.68;
const EASE: [number, number, number, number] = [0.43, 0.13, 0.23, 0.96];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function SectionOne() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onMotionChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onMotionChange);
    return () => mq.removeEventListener("change", onMotionChange);
  }, []);

  useEffect(() => {
    let rafId = 0;

    const update = () => {
      const node = sectionRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const viewportH = Math.max(window.innerHeight, 1);
      const scrollable = Math.max(rect.height - viewportH, 1);
      const startY = node.offsetTop;
      const sectionProgress = clamp((window.scrollY - startY) / scrollable, 0, 1);
      setProgress(sectionProgress);
    };

    const requestUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  const reelProgress = clamp(progress / FINALE_START_PROGRESS, 0, 1);
  const wordSlot = clamp(Math.floor(reelProgress * ROTATING_WORDS.length), 0, ROTATING_WORDS.length - 1);
  const isFinale = progress >= FINALE_START_PROGRESS;
  const slot = isFinale ? SLOT_COUNT - 1 : wordSlot;
  const activeWord = isFinale ? FINALE : ROTATING_WORDS[slot];

  const transition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.6, ease: EASE };
  const finaleTransition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.8, ease: EASE };

  return (
    <section ref={sectionRef} className={styles.pinWrap} aria-labelledby="section-one-heading">
      <div className={styles.stage}>
        <div className={`${styles.rail} ${styles.railTop}`}>
          <div>
            <span className={styles.dot} />
            Section 01
          </div>
          <div>01001000 · 01101001</div>
        </div>

        <h1 id="section-one-heading" className={styles.heading}>
          <span aria-hidden="true" className={styles.prefix}>
            We build
          </span>
          <span aria-hidden="true" className={styles.reelViewport}>
            <AnimatePresence initial={false}>
              {isFinale ? (
                <motion.span
                  key="finale"
                  className={`${styles.word} ${styles.wordFinal}`}
                  initial={{ y: 100, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -100, opacity: 0, scale: 0.95 }}
                  transition={finaleTransition}
                >
                  {FINALE}
                </motion.span>
              ) : (
                <motion.span
                  key={slot}
                  className={styles.word}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -100, opacity: 0 }}
                  transition={transition}
                  style={{ fontSize: `calc(1em + ${slot * WORD_SIZE_STEP_PX}px)` }}
                >
                  {ROTATING_WORDS[slot]}
                </motion.span>
              )}
            </AnimatePresence>
          </span>
          <span className={styles.srOnly} aria-live="polite">
            {`We build ${activeWord}`}
          </span>
        </h1>

        <div className={`${styles.rail} ${styles.railBot}`}>
          <div>stage · text</div>
          <div>Warm / 0.1</div>
        </div>
      </div>
    </section>
  );
}
