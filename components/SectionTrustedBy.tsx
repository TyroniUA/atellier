"use client";

import { useRef, useState } from "react";
import { useReveal } from "@/lib/use-reveal";
import { motion } from "motion/react";
import styles from "./SectionTrustedBy.module.css";

const TESTIMONIALS = [
  {
    company: "Anvil",
    name: "Mara",
    lastInitial: "K",
    quote: "They made the hard parts feel considered, calm, and finally shippable.",
  },
  {
    company: "Northwind",
    name: "Theo",
    lastInitial: "R",
    quote: "The work stayed precise even when the product questions got messy.",
  },
  {
    company: "Ostara",
    name: "Lina",
    lastInitial: "V",
    quote: "It felt less like a handoff and more like having a careful partner inside the room.",
  },
  {
    company: "Mast",
    name: "Jonas",
    lastInitial: "P",
    quote: "They brought our security, product, and design concerns into one clear path.",
  },
  {
    company: "Quill",
    name: "Ari",
    lastInitial: "S",
    quote: "Every decision had a reason. Every launch felt quieter than expected.",
  },
  {
    company: "Halcyon",
    name: "Nora",
    lastInitial: "M",
    quote: "The relationship outlasted the roadmap, which is exactly what we needed.",
  },
] as const;

const VISIBLE_CARD_COUNT = 3;
const SWIPE_THRESHOLD = 90;

export function SectionTrustedBy() {
  const { ref, revealed } = useReveal();
  const pointerStartXRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const moveCard = (direction: number) => {
    setActiveIndex((current) => (current + direction + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const onPointerUp = (clientX: number) => {
    if (pointerStartXRef.current === null) return;

    const offsetX = clientX - pointerStartXRef.current;
    pointerStartXRef.current = null;

    if (Math.abs(offsetX) > SWIPE_THRESHOLD) {
      const direction = offsetX >= 0 ? 1 : -1;
      moveCard(direction);
    }
  };

  const cards = Array.from({ length: VISIBLE_CARD_COUNT }, (_, offset) => ({
    testimonial: TESTIMONIALS[(activeIndex + offset) % TESTIMONIALS.length],
    offset,
  }));

  return (
    <section
      ref={ref}
      className={styles.root}
      aria-labelledby="trusted-heading"
    >
      <div className={`${styles.rail} ${styles.railTop}`}>
        <div>
          <span className={styles.dot} />
          Section 02 / Trusted
        </div>
        <div>01001000 · 01101001</div>
      </div>

      <div className={styles.inner}>
        <p
          id="trusted-heading"
          className={`${styles.lede} ${revealed ? styles.ledeVisible : ""}`}
        >
          Trusted by founders who care about the long quiet work.
        </p>

        <div className={`${styles.deckWrap} ${revealed ? styles.deckVisible : ""}`}>
          <div className={styles.deck} aria-live="polite">
            {[...cards].reverse().map(({ testimonial, offset }) => {
              const isTopCard = offset === 0;

              return (
                <motion.article
                  key={testimonial.company}
                  className={styles.card}
                  initial={{ opacity: 0, y: 34, scale: 0.94 }}
                  animate={{
                    opacity: 1 - offset * 0.16,
                    y: offset * 14,
                    scale: 1 - offset * 0.045,
                    rotate: offset * -1.8,
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 28 }}
                  drag={isTopCard ? "x" : false}
                  dragConstraints={{ left: -260, right: 260 }}
                  dragElastic={0.18}
                  dragMomentum={false}
                  onPointerDown={
                    isTopCard ? (event) => (pointerStartXRef.current = event.clientX) : undefined
                  }
                  onPointerUp={isTopCard ? (event) => onPointerUp(event.clientX) : undefined}
                  onPointerCancel={isTopCard ? () => (pointerStartXRef.current = null) : undefined}
                  style={{
                    zIndex: VISIBLE_CARD_COUNT - offset,
                    pointerEvents: isTopCard ? "auto" : "none",
                  }}
                  aria-hidden={!isTopCard}
                  role={isTopCard ? "group" : undefined}
                  aria-label={
                    isTopCard
                      ? `${testimonial.company}: ${testimonial.name} ${testimonial.lastInitial}. ${testimonial.quote}`
                      : undefined
                  }
                >
                  {isTopCard && (
                    <>
                      <div className={styles.cardTopline}>
                        <span>{testimonial.company}</span>
                        <span>Swipe</span>
                      </div>
                      <blockquote className={styles.quote}>“{testimonial.quote}”</blockquote>
                      <p className={styles.person}>
                        {testimonial.name} {testimonial.lastInitial}.
                      </p>
                    </>
                  )}
                </motion.article>
              );
            })}
          </div>

          <div className={styles.controls} aria-label="Trusted card controls">
            <button
              className={styles.control}
              type="button"
              onClick={() => moveCard(-1)}
              aria-label="Previous trusted card"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14 7l-5 5 5 5" />
              </svg>
            </button>
            <button
              className={styles.control}
              type="button"
              onClick={() => moveCard(1)}
              aria-label="Next trusted card"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M10 7l5 5-5 5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`${styles.rail} ${styles.railBot}`}>
        <div>stage · trust</div>
        <div>Warm / 0.1</div>
      </div>
    </section>
  );
}
