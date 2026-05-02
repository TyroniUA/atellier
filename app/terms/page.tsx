import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Terms & Conditions — Atelier",
  description: "Terms and conditions governing the use of Atelier services.",
};

const LAST_UPDATED = "1 May 2025";

export default function TermsPage() {
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <Link href="/" className={styles.back}>
          ← Back
        </Link>

        <header className={styles.header}>
          <p className={styles.label}>Legal</p>
          <h1 className={styles.title}>Terms &amp; Conditions</h1>
          <p className={styles.meta}>Last updated: {LAST_UPDATED}</p>
        </header>

        <div className={styles.body}>
          <section>
            <h2>1. Agreement to Terms</h2>
            <p>
              By engaging Atelier ("we", "us", or "our") for design, strategy, or related creative
              services, you ("Client") agree to be bound by these Terms &amp; Conditions. Please
              read them carefully before proceeding. If you do not agree, do not engage our
              services.
            </p>
          </section>

          <section>
            <h2>2. Scope of Services</h2>
            <p>
              The specific deliverables, timelines, and fees for each engagement are defined in a
              separate Statement of Work (SOW) or project proposal agreed upon by both parties.
              Atelier reserves the right to refuse any project at its sole discretion.
            </p>
            <p>
              Any work outside the agreed SOW will be treated as a change request and may incur
              additional fees and revised timelines.
            </p>
          </section>

          <section>
            <h2>3. Fees &amp; Payment</h2>
            <p>
              Fees are invoiced as outlined in the SOW. Unless otherwise agreed, a deposit of 50%
              of the total project fee is due before work commences, with the remaining balance due
              upon delivery of final files.
            </p>
            <p>
              Invoices are payable within 14 days of issue. Late payments accrue interest at 1.5%
              per month on the outstanding balance. Atelier reserves the right to suspend work on
              active projects until overdue invoices are settled.
            </p>
          </section>

          <section>
            <h2>4. Intellectual Property</h2>
            <p>
              All creative work produced by Atelier remains our property until full payment is
              received. Upon receipt of full payment, and unless otherwise specified in the SOW,
              the Client is granted a non-exclusive, worldwide licence to use the final delivered
              work for the purposes described in the SOW.
            </p>
            <p>
              Atelier retains the right to display all work in our portfolio and for promotional
              purposes unless the Client requests otherwise in writing prior to project
              commencement.
            </p>
            <p>
              Preliminary concepts, drafts, and rejected designs remain the sole property of
              Atelier and may not be used by the Client without additional agreement and payment.
            </p>
          </section>

          <section>
            <h2>5. Client Responsibilities</h2>
            <p>
              The Client is responsible for providing accurate and timely feedback, content, and
              any materials necessary for the completion of the project. Delays caused by the
              Client may affect delivery timelines and pricing.
            </p>
            <p>
              The Client warrants that any materials supplied to Atelier (text, images, logos,
              data) do not infringe any third-party intellectual property rights. The Client
              indemnifies Atelier against any claim arising from such materials.
            </p>
          </section>

          <section>
            <h2>6. Confidentiality</h2>
            <p>
              Both parties agree to keep confidential any proprietary information shared during
              the engagement and not to disclose it to any third party without prior written
              consent, except as required by law.
            </p>
          </section>

          <section>
            <h2>7. Revisions &amp; Approvals</h2>
            <p>
              Each project phase includes a set number of revision rounds as defined in the SOW.
              Additional revision rounds beyond this allowance will be billed at our standard
              hourly rate. Written approval at each milestone constitutes acceptance of that phase
              and signals readiness to proceed to the next.
            </p>
          </section>

          <section>
            <h2>8. Termination</h2>
            <p>
              Either party may terminate the engagement with 14 days' written notice. In the event
              of termination, the Client is liable for all work completed up to the date of
              termination. Any deposit paid is non-refundable unless Atelier is unable to deliver
              the agreed work.
            </p>
          </section>

          <section>
            <h2>9. Limitation of Liability</h2>
            <p>
              Atelier's total liability under any engagement shall not exceed the total fees paid
              by the Client for that specific project. We are not liable for any indirect,
              incidental, or consequential damages arising from the use or inability to use the
              deliverables.
            </p>
          </section>

          <section>
            <h2>10. Governing Law</h2>
            <p>
              These Terms &amp; Conditions are governed by and construed in accordance with the
              laws of the jurisdiction in which Atelier is registered. Any disputes shall first be
              attempted to be resolved through good-faith negotiation before resorting to formal
              legal proceedings.
            </p>
          </section>

          <section>
            <h2>11. Amendments</h2>
            <p>
              Atelier reserves the right to update these Terms &amp; Conditions at any time.
              Continued engagement with our services following any update constitutes acceptance
              of the revised terms.
            </p>
          </section>

          <section>
            <h2>12. Contact</h2>
            <p>
              Questions regarding these terms may be directed to{" "}
              <a href="mailto:hello@atelier.studio">hello@atelier.studio</a>.
            </p>
          </section>
        </div>

        <div className={styles.footer}>
          <Link href="/privacy" className={styles.legalLink}>
            Privacy Policy →
          </Link>
        </div>
      </div>
    </div>
  );
}
