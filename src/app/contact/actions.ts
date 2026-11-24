"use server";

import { headers } from "next/headers";
import {
  contactIdempotencyKey,
  contactRequestAllowed,
  parseContactForm,
  sendContactEmail,
  verifyContactToken,
  type ContactInput,
} from "@/lib/contact";
import {
  contactEmailConfigured,
  contactFormSecret,
  contactFormToken,
  contactRateIdentity,
  contactRateLimiter,
} from "@/lib/contact-server";

export type ContactActionState = {
  success?: boolean;
  error?: string;
  errors?: Partial<Record<keyof ContactInput, string>>;
  values?: ContactInput;
  token?: string;
};

export async function submitContact(
  _: ContactActionState,
  form: FormData,
): Promise<ContactActionState> {
  const parsed = parseContactForm(form);
  const values = parsed.values;
  if (!parsed.data) return { values, errors: parsed.errors, error: parsed.error };
  try {
    const requestHeaders = new Headers(await headers());
    if (!contactRequestAllowed(requestHeaders)) {
      return { values, error: "Please refresh the page before sending your message.", token: contactFormToken() };
    }
    if (!contactEmailConfigured()) {
      return { values, error: "The form is temporarily unavailable. Please email hello@theaipex.org instead." };
    }
    const secret = contactFormSecret();
    const rawToken = form.get("token");
    const token = verifyContactToken(typeof rawToken === "string" ? rawToken : "", secret);
    if ("error" in token) {
      return token.error === "early"
        ? { values, error: "Please wait a moment, then send your message again." }
        : { values, token: contactFormToken(), error: "This form has expired. Your message is still here; please try again." };
    }
    if (!contactRateLimiter.consume(contactRateIdentity(requestHeaders, secret))) {
      return { values, error: "You’ve sent several messages recently. Please wait a little before trying again, or email hello@theaipex.org." };
    }
    const accepted = await sendContactEmail(
      process.env.RESEND_API_KEY!,
      contactIdempotencyKey(token.nonce, parsed.data),
      parsed.data,
    );
    return accepted
      ? { success: true }
      : { values, error: "We couldn’t confirm your message was sent. Your text is still here. Please try again, or email hello@theaipex.org." };
  } catch {
    return { values, error: "We couldn’t confirm your message was sent. Your text is still here. Please try again, or email hello@theaipex.org." };
  }
}
