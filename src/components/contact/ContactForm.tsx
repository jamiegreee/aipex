"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { submitContact, type ContactActionState } from "@/app/contact/actions";
import type { ContactInput } from "@/lib/contact";
import { Arrow } from "@/components/Brand";

export default function ContactForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<ContactActionState, FormData>(submitContact, {});
  const [values, setValues] = useState<ContactInput>(state.values ?? { name: "", email: "", message: "" });
  const feedbackRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success || state.error) {
      feedbackRef.current?.focus({ preventScroll: true });
      feedbackRef.current?.scrollIntoView({ block: "center", behavior: "instant" });
    }
    else if (state.errors) formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);

  if (state.success) {
    return (
      <div className="contact-confirmation" role="status" tabIndex={-1} ref={feedbackRef}>
        <p className="label">Message sent</p>
        <h2>Thank you for getting in touch.</h2>
        <p>We’ll reply to the email address you provided.</p>
      </div>
    );
  }

  function fieldError(field: keyof ContactInput) {
    return state.errors?.[field] ? (
      <span className="contact-field-error" id={`contact-${field}-error`}>{state.errors[field]}</span>
    ) : null;
  }

  return (
    <form action={action} className="contact-form" ref={formRef}>
      <h2>Send us a message.</h2>
      <p className="contact-form-intro">All fields are required.</p>
      {state.error && (
        <div className="form-alert" role="alert" tabIndex={-1} ref={feedbackRef}>{state.error}</div>
      )}
      {!token && <p className="form-alert" role="status">The form is temporarily unavailable. You can email us below.</p>}
      <input type="hidden" name="token" value={state.token ?? token} />
      <fieldset disabled={pending} className="contact-fields">
        <label className="contact-field" htmlFor="contact-name">
          Name
          <input id="contact-name" name="name" autoComplete="name" required maxLength={100}
            value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })}
            aria-invalid={Boolean(state.errors?.name)} aria-describedby={state.errors?.name ? "contact-name-error" : undefined} />
          {fieldError("name")}
        </label>
        <label className="contact-field" htmlFor="contact-email">
          Email address
          <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254}
            value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })}
            aria-invalid={Boolean(state.errors?.email)} aria-describedby={state.errors?.email ? "contact-email-error" : undefined} />
          {fieldError("email")}
        </label>
        <label className="contact-field" htmlFor="contact-message">
          Message
          <textarea id="contact-message" name="message" rows={7} required minLength={10} maxLength={5000}
            value={values.message} onChange={(event) => setValues({ ...values, message: event.target.value })}
            aria-invalid={Boolean(state.errors?.message)} aria-describedby={state.errors?.message ? "contact-message-error" : undefined} />
          {fieldError("message")}
        </label>
        <div className="contact-honeypot" aria-hidden="true">
          <label htmlFor="contact-website">Leave this field empty</label>
          <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" maxLength={200} />
        </div>
        <p className="contact-privacy">We’ll use your details to respond to your enquiry. <Link href="/privacy">Privacy policy</Link>.</p>
        <button className="button" type="submit" disabled={pending || !token}>
          {pending ? "Sending…" : "Send message"}
          {!pending && <Arrow />}
        </button>
      </fieldset>
      <p className="contact-form-status" role="status">{pending ? "Please keep this page open while we send your message." : ""}</p>
      <p className="contact-fallback">Prefer email? <a href="mailto:hello@theaipex.org">hello@theaipex.org</a></p>
    </form>
  );
}
