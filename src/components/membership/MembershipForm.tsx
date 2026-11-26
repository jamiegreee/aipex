"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { submitMembership } from "@/app/membership/actions";
import {
  membershipInterestOptions,
} from "@/lib/membership";
import type { PublicMembershipInput } from "@/lib/public-membership";

type Props = {
  user: { name?: string | null; email: string } | null;
  initialValues?: Partial<PublicMembershipInput>;
  token: string;
};

const fieldNames: Record<keyof PublicMembershipInput, string> = {
  email: "Email address",
  fullName: "Full name",
  role: "Role or position",
  organisation: "Organisation or affiliation",
  country: "Country or region",
  profileUrl: "LinkedIn profile",
  interests: "Policy interests",
  motivation: "Reasons for joining",
  contribution: "What you could contribute",
  agreement: "Participation agreement",
};

export default function MembershipForm({ user, initialValues, token }: Props) {
  const [state, action, pending] = useActionState(submitMembership, {});
  const [values, setValues] = useState<PublicMembershipInput>({
    email: initialValues?.email ?? user?.email ?? "",
    fullName: initialValues?.fullName ?? user?.name ?? "",
    role: initialValues?.role ?? "",
    organisation: initialValues?.organisation ?? "",
    country: initialValues?.country ?? "",
    profileUrl: initialValues?.profileUrl ?? "",
    interests: initialValues?.interests ?? [],
    motivation: initialValues?.motivation ?? "",
    contribution: initialValues?.contribution ?? "",
    agreement: initialValues?.agreement ?? false,
  });
  const formRef = useRef<HTMLFormElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.success) {
      successRef.current?.focus();
    } else if (state.errors && Object.keys(state.errors).length) {
      const invalid = formRef.current?.querySelector<HTMLElement>(
        '[aria-invalid="true"]',
      );
      (invalid ?? feedbackRef.current)?.focus();
    } else if (state.error) {
      feedbackRef.current?.focus();
    }
  }, [state]);

  if (state.success) {
    return (
      <div
        className="membership-status"
        ref={successRef}
        tabIndex={-1}
        role="status"
      >
        <h2>Application received.</h2>
        <p>
          We will review your application and get back to you soon.
        </p>
      </div>
    );
  }

  function change(field: keyof PublicMembershipInput, value: string | boolean) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function error(field: keyof PublicMembershipInput) {
    return state.errors?.[field];
  }

  function describe(field: keyof PublicMembershipInput, hint?: string) {
    return [hint, error(field) ? `membership-${field}-error` : ""]
      .filter(Boolean)
      .join(" ") || undefined;
  }

  function fieldError(field: keyof PublicMembershipInput) {
    return error(field) ? (
      <span className="membership-field-error" id={`membership-${field}-error`}>
        {error(field)}
      </span>
    ) : null;
  }

  return (
    <form action={action} className="membership-form" ref={formRef}>
      <input type="hidden" name="token" value={state.token ?? token} />
      <div className="membership-form-heading">
        <p className="label">Your membership application</p>
        <h2>Join AI Policy Exchange</h2>
      </div>
      {(state.error || (state.errors && Object.keys(state.errors).length > 0)) && (
        <div
          className="form-alert membership-feedback"
          role="alert"
          tabIndex={-1}
          ref={feedbackRef}
        >
          <p>{state.error ?? "Please check the highlighted answers."}</p>
          {state.errors && (
            <ul>
              {Object.entries(state.errors).map(([field, message]) => (
                <li key={field}>
                  {field in fieldNames ? (
                    <a href={`#membership-${field}`}>
                      {fieldNames[field as keyof PublicMembershipInput]}: {message}
                    </a>
                  ) : (
                    message
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <fieldset className="membership-fields" disabled={pending}>
        <legend className="membership-section-legend">
          <span className="label">01 / Your background</span>
        </legend>
        <label className="membership-field" htmlFor="membership-email">
          Email address
          <input id="membership-email" name="email" type="email" autoComplete="email"
            required maxLength={254} value={values.email}
            onChange={event => change("email", event.target.value)}
            aria-invalid={Boolean(error("email"))}
            aria-describedby={describe("email")} />
          {fieldError("email")}
        </label>
        <label className="membership-field" htmlFor="membership-fullName">
          Full name
          <input
            id="membership-fullName"
            name="fullName"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            value={values.fullName}
            onChange={(event) => change("fullName", event.target.value)}
            aria-invalid={Boolean(error("fullName"))}
            aria-describedby={describe("fullName")}
          />
          {fieldError("fullName")}
        </label>
        <div className="membership-field-grid">
          <label className="membership-field" htmlFor="membership-role">
            Role or position
            <input
              id="membership-role"
              name="role"
              autoComplete="organization-title"
              required
              minLength={2}
              maxLength={120}
              value={values.role}
              onChange={(event) => change("role", event.target.value)}
              aria-invalid={Boolean(error("role"))}
              aria-describedby={describe("role")}
            />
            {fieldError("role")}
          </label>
          <label className="membership-field" htmlFor="membership-organisation">
            Organisation or affiliation
            <input
              id="membership-organisation"
              name="organisation"
              autoComplete="organization"
              required
              minLength={2}
              maxLength={160}
              value={values.organisation}
              onChange={(event) => change("organisation", event.target.value)}
              aria-invalid={Boolean(error("organisation"))}
              aria-describedby={describe("organisation")}
            />
            {fieldError("organisation")}
          </label>
        </div>
        <label className="membership-field" htmlFor="membership-country">
          Country or region
          <input
            id="membership-country"
            name="country"
            autoComplete="country-name"
            required
            minLength={2}
            maxLength={100}
            value={values.country}
            onChange={(event) => change("country", event.target.value)}
            aria-invalid={Boolean(error("country"))}
            aria-describedby={describe("country")}
          />
          {fieldError("country")}
        </label>
        <label className="membership-field" htmlFor="membership-profileUrl">
          <span>LinkedIn profile <span className="membership-optional">(optional)</span></span>
          <input
            id="membership-profileUrl"
            name="profileUrl"
            type="url"
            autoComplete="url"
            maxLength={300}
            placeholder="https://www.linkedin.com/in/your-name"
            value={values.profileUrl}
            onChange={(event) => change("profileUrl", event.target.value)}
            aria-invalid={Boolean(error("profileUrl"))}
            aria-describedby={describe("profileUrl")}
          />
          {fieldError("profileUrl")}
        </label>
      </fieldset>
      <fieldset className="membership-fields" disabled={pending}>
        <legend className="membership-section-legend">
          <span className="label">02 / Your policy interests</span>
        </legend>
        <fieldset
          className="membership-interests"
          id="membership-interests"
          aria-describedby={describe("interests", "membership-interests-hint")}
        >
          <legend>Which areas are most relevant to your work?</legend>
          <p className="membership-hint" id="membership-interests-hint">
            Choose between one and four.
          </p>
          <div className="membership-interest-options">
            {membershipInterestOptions.map(({ value, label }) => (
              <label key={value} className="membership-check">
                <input
                  type="checkbox"
                  name="interests"
                  value={value}
                  checked={values.interests.includes(value)}
                  disabled={values.interests.length >= 4 && !values.interests.includes(value)}
                  aria-invalid={Boolean(error("interests"))}
                  aria-describedby={describe("interests", "membership-interests-hint")}
                  onChange={(event) => setValues((current) => ({
                    ...current,
                    interests: event.target.checked
                      ? [...current.interests, value]
                      : current.interests.filter((interest) => interest !== value),
                  }))}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
          {fieldError("interests")}
        </fieldset>
        <label className="membership-field" htmlFor="membership-motivation">
          Why would you like to join AIPEX?
          <span className="membership-hint" id="membership-motivation-hint">
            Tell us what you work on and what you hope to gain from the
            community. A short paragraph is enough.
          </span>
          <textarea
            id="membership-motivation"
            name="motivation"
            rows={5}
            required
            minLength={40}
            maxLength={1500}
            value={values.motivation}
            onChange={(event) => change("motivation", event.target.value)}
            aria-invalid={Boolean(error("motivation"))}
            aria-describedby={describe("motivation", "membership-motivation-hint membership-motivation-count")}
          />
          <span className="membership-count" id="membership-motivation-count">
            {Array.from(values.motivation.normalize("NFC")).length.toLocaleString()} / 1,500 characters · minimum 40
          </span>
          {fieldError("motivation")}
        </label>
      </fieldset>
      <div className="membership-honeypot" aria-hidden="true">
        <label htmlFor="membership-website">Leave this field empty</label>
        <input id="membership-website" name="website" tabIndex={-1} autoComplete="off" maxLength={200} />
      </div>
      <div className="membership-participation">
        <label className="membership-check" htmlFor="membership-agreement">
          <input
            id="membership-agreement"
            name="agreement"
            type="checkbox"
            required
            disabled={pending}
            checked={values.agreement}
            onChange={(event) => change("agreement", event.target.checked)}
            aria-invalid={Boolean(error("agreement"))}
            aria-describedby={describe("agreement", "membership-agreement-hint")}
          />
          <span>
            I will engage respectfully, protect confidential information and
            participate in a personal capacity.
          </span>
        </label>
        {fieldError("agreement")}
        <p className="membership-hint" id="membership-agreement-hint">
          Your application will be used to review your membership and contact
          you about it. Read our <Link href="/privacy">privacy notice</Link>.
          Your details will not appear in a public member directory.
        </p>
      </div>
      <div className="membership-submit">
        <button className="button" type="submit" disabled={pending}>
          {pending ? "Submitting your application…" : "Submit"}
          {!pending && <span aria-hidden="true">→</span>}
        </button>
        <p className="membership-hint" aria-live="polite">
          {pending ? "Please keep this page open while we save your application." : null}
        </p>
      </div>
    </form>
  );
}
