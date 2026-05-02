import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy — Atelier",
  description: "How Atelier collects, uses, and protects your personal data.",
};

const LAST_UPDATED = "1 May 2025";

export default function PrivacyPage() {
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <Link href="/" className={styles.back}>
          ← Back
        </Link>

        <header className={styles.header}>
          <p className={styles.label}>Legal</p>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.meta}>Last updated: {LAST_UPDATED}</p>
        </header>

        <div className={styles.body}>
          <section>
            <h2>1. Introduction</h2>
            <p>
              Atelier (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to protecting your personal data and
              respecting your privacy. This Privacy Policy explains what information we collect,
              how we use it, and your rights in relation to it when you visit our website or engage
              our services.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <p>
              <strong>Contact form data.</strong> When you submit our contact form, we collect your
              name, email address, and any message content you provide. This information is used
              solely to respond to your enquiry.
            </p>
            <p>
              <strong>Usage data.</strong> We collect anonymised data about how visitors interact
              with our website (pages visited, time on page, device type, approximate location by
              country) to help us understand and improve the experience.
            </p>
            <p>
              <strong>Communications.</strong> If you correspond with us by email, we may retain
              those communications to handle your enquiry and keep records of our interaction.
            </p>
          </section>

          <section>
            <h2>3. Analytics — PostHog</h2>
            <p>
              Our website uses PostHog for product analytics. PostHog collects anonymised event
              data (page views, interactions) using a first-party cookie. We have configured
              PostHog to respect privacy-by-default settings, including IP anonymisation. PostHog
              does not sell your data to third parties. For more information, see the{" "}
              <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer">
                PostHog Privacy Policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2>4. Email — Resend</h2>
            <p>
              Contact form submissions are processed and delivered via Resend, a transactional
              email service. Your name, email address, and message content are transmitted to
              Resend solely for the purpose of delivering your message to us. For more information,
              see the{" "}
              <a href="https://resend.com/privacy-policy" target="_blank" rel="noopener noreferrer">
                Resend Privacy Policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2>5. Cookies</h2>
            <p>
              We use a small number of functional and analytics cookies. Functional cookies are
              strictly necessary for the operation of the website. Analytics cookies (set by
              PostHog) help us understand how visitors use the site and may be disabled by
              adjusting your browser settings or using a browser extension that blocks tracking
              scripts.
            </p>
            <p>
              We do not use advertising cookies or share data with ad networks.
            </p>
          </section>

          <section>
            <h2>6. Legal Basis for Processing</h2>
            <p>
              We process your personal data on the basis of legitimate interests (improving our
              services, responding to enquiries) and, where applicable, your consent. You may
              withdraw consent at any time by contacting us.
            </p>
          </section>

          <section>
            <h2>7. Data Retention</h2>
            <p>
              Contact form submissions and correspondence are retained for up to 2 years, after
              which they are deleted unless required for ongoing business purposes. Anonymised
              analytics data may be retained indefinitely as it cannot be used to identify you.
            </p>
          </section>

          <section>
            <h2>8. Data Sharing</h2>
            <p>
              We do not sell, rent, or share your personal data with third parties for marketing
              purposes. Data is shared only with the service providers listed in this policy
              (PostHog, Resend) and only to the extent necessary to provide our services.
            </p>
          </section>

          <section>
            <h2>9. Your Rights</h2>
            <p>
              Depending on your jurisdiction, you may have the right to access, correct, delete,
              or restrict the processing of your personal data, and to object to its processing
              or request portability. To exercise any of these rights, contact us at{" "}
              <a href="mailto:hello@atelier.studio">hello@atelier.studio</a>.
            </p>
          </section>

          <section>
            <h2>10. Security</h2>
            <p>
              We take reasonable technical and organisational measures to protect your personal
              data against unauthorised access, loss, or misuse. However, no method of
              transmission over the internet is completely secure and we cannot guarantee
              absolute security.
            </p>
          </section>

          <section>
            <h2>11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo; date at the
              top of this page indicates when the policy was last revised. Continued use of our
              website after any changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2>12. Contact</h2>
            <p>
              For privacy-related enquiries, please contact us at{" "}
              <a href="mailto:hello@atelier.studio">hello@atelier.studio</a>.
            </p>
          </section>
        </div>

        <div className={styles.footer}>
          <Link href="/terms" className={styles.legalLink}>
            ← Terms &amp; Conditions
          </Link>
        </div>
      </div>
    </div>
  );
}
