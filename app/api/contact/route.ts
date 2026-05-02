import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE = 5000;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { email, message, company } = (body ?? {}) as {
    email?: unknown;
    message?: unknown;
    company?: unknown;
  };

  // Honeypot — bots fill hidden fields. Pretend success, send nothing.
  if (typeof company === "string" && company.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const emailStr = typeof email === "string" ? email.trim() : "";
  const messageStr = typeof message === "string" ? message.trim() : "";

  if (!EMAIL_RE.test(emailStr)) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }
  if (!messageStr) {
    return NextResponse.json({ ok: false, error: "Message required" }, { status: 400 });
  }
  if (messageStr.length > MAX_MESSAGE) {
    return NextResponse.json({ ok: false, error: "Message too long" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "Atelier <onboarding@resend.dev>";

  if (!apiKey || !to) {
    return NextResponse.json({ ok: false, error: "Server not configured" }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: emailStr,
    subject: `Note from the landing — ${emailStr}`,
    text: `From: ${emailStr}\n\n${messageStr}`,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: "Send failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
