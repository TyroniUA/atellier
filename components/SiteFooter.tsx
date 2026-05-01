import styles from "./SiteFooter.module.css";

const YEAR = new Date().getFullYear();

const SITEMAP = [
  { href: "#hero", label: "Hero" },
  { href: "#relationships", label: "Relationships" },
  { href: "#trusted", label: "Trusted by" },
  { href: "#process", label: "Process" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
] as const;

export function SiteFooter() {
  return (
    <footer className={`${styles.root} noSnap`} role="contentinfo">
      <div className={styles.grid}>
        <div>
          <p className={styles.brand}>Atelier</p>
          <p className={styles.tagline}>
            From zeros and ones to a human gaze. We invest not in projects alone but in relationships.
          </p>
        </div>

        <nav aria-label="Site map">
          <p className={styles.colTitle}>Site map</p>
          <div className={styles.nav}>
            {SITEMAP.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <div>
          <p className={styles.colTitle}>Reach</p>
          <p className={styles.contactLine}>
            <a href="mailto:hello@atelier.studio">hello@atelier.studio</a>
          </p>
          <div className={styles.social}>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
            <a href="https://are.na" target="_blank" rel="noopener noreferrer">
              Are.na
            </a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {YEAR} Atelier</span>
        <span className={styles.binary} aria-hidden="true">
          01001000 · 01101001
        </span>
      </div>
    </footer>
  );
}
