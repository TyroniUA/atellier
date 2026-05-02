"use client";

import { type FormEvent, useCallback, useState } from "react";
import posthog from "posthog-js";
import { useReveal } from "@/lib/use-reveal";
import styles from "./SectionContact.module.css";

const CONTACT_EMAIL = "hello@atelier.studio";

type Status = "idle" | "sending" | "sent" | "error";

export function SectionContact() {
  const { ref, revealed } = useReveal();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = String(fd.get("email") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();
    const company = String(fd.get("company") ?? "");

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message, company }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Could not send. Try again.");
        return;
      }
      setStatus("sent");
      form.reset();
      if (typeof posthog !== "undefined" && posthog.__loaded) {
        posthog.capture("contact_form_submitted");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Try again.");
    }
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
              required
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
              required
            />
          </div>
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-10000px",
              width: 1,
              height: 1,
              opacity: 0,
            }}
          />
          <button
            type="submit"
            className={styles.submit}
            disabled={status === "sending" || status === "sent"}
          >
            {status === "sending" ? "Sending…" : status === "sent" ? "Sent" : "Send"}
          </button>
          <p className={styles.hint} role="status" aria-live="polite">
            {status === "sent" ? (
              <>Thanks — we&rsquo;ll be in touch.</>
            ) : status === "error" ? (
              <>{errorMsg}</>
            ) : (
              <>
                Goes straight to{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "inherit" }}>
                  {CONTACT_EMAIL}
                </a>
              </>
            )}
          </p>
        </form>
      </div>

      <div className={`${styles.rail} ${styles.railBot}`}>
        <div>stage · contact</div>
      </div>
    </section>
  );
}
