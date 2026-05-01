import styles from "./SectionOne.module.css";

export function SectionOne() {
  return (
    <section className={styles.stage} aria-labelledby="section-one-heading">
      <div className={`${styles.rail} ${styles.railTop}`}>
        <div>
          <span className={styles.dot} />
          Section 01
        </div>
        <div>01001000 · 01101001</div>
      </div>

      <h1 id="section-one-heading" className={styles.heading}>
        We build AI, Cybersecurity, Trust, Relationships.
      </h1>

      <div className={`${styles.rail} ${styles.railBot}`}>
        <div>stage · text</div>
        <div>Warm / 0.1</div>
      </div>
    </section>
  );
}
