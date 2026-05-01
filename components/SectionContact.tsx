"use client";

import { type FormEvent, useCallback } from "react";
import { useReveal } from "@/lib/use-reveal";
import styles from "./SectionContact.module.css";

const CONTACT_EMAIL = "hello@atelier.studio";

export function SectionContact() {
  const { ref, revealed } = useReveal();

  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const from = String(fd.get("email") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();
    const subject = encodeURIComponent("Note from the landing");
    const body = encodeURIComponent(
      [from ? `From: ${from}` : "From: (not provided)", "", message || "(no message)"].join("\n"),
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }, []);

  return (
    <section ref={ref} className={styles.root} aria-labelledby="contact-heading">
      <div className={`${styles.rail} ${styles.railTop}`}>
        <div>
          <span className={styles.dot} />
          Section 05 / Contact
        </div>
        <div>01001000 · 01101001</div>
      </div>

      <div className={styles.inner}>
        <h2
          id="contact-heading"
          className={`${styles.headline} ${revealed ? styles.headlineVisible : ""}`}
        >
          <span className={styles.line1}>Have an idea?</span>
          <span className={styles.line2}>Drop a message.</span>
        </h2>

        <form
          className={`${styles.form} ${revealed ? styles.formVisible : ""}`}
          onSubmit={onSubmit}
          noValidate
        >
          <div>
            <label className={styles.label} htmlFor="contact-email">
              Your email
            </label>
            <input
              id="contact-email"
              className={styles.input}
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className={styles.label} htmlFor="contact-message">
              Message
            </label>
            <textarea
              id="contact-message"
              className={styles.textarea}
              name="message"
              placeholder="A line or two is enough to start."
              rows={5}
            />
          </div>
          <button type="submit" className={styles.submit}>
            Send
          </button>
          <p className={styles.hint}>
            Opens your mail app —{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "inherit" }}>
              {CONTACT_EMAIL}
            </a>
          </p>
        </form>
      </div>

      <div className={`${styles.rail} ${styles.railBot}`}>
        <div>stage · contact</div>
        <div>Warm / 0.1</div>
      </div>
    </section>
  );
}
