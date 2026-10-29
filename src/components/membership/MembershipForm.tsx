"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { submitMembership } from "@/app/membership/actions";
import {
  membershipInterestOptions,
  type MembershipInput,
} from "@/lib/membership";

type Props = {
  user: { name?: string | null; email: string } | null;
  initialValues?: Partial<MembershipInput>;
};

const fieldNames: Record<keyof MembershipInput, string> = {
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

export default function MembershipForm({ user, initialValues }: Props) {
  const [state, action, pending] = useActionState(submitMembership, {});
  const [values, setValues] = useState<MembershipInput>({
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

  if (!user) {
    return (
      <div className="membership-account-step">
        <p className="label">Before you apply</p>
        <h2>Begin with a verified email.</h2>
        <p>
          Create an account and confirm your email, then return here to submit
          your application. This lets you keep track of the decision privately.
        </p>
        <p>
          Creating an account does not make you a member. We review your
          application before granting membership.
        </p>
        <div className="membership-actions">
          <Link className="button" href="/signup?next=%2Fmembership">
            Create an account to apply <span aria-hidden="true">→</span>
          </Link>
          <Link className="text-link" href="/login?next=%2Fmembership">
            Already have an account? Sign in →
          </Link>
        </div>
        <p className="membership-hint">
          We’ll ask about your role, organisation, policy interests and reasons
          for joining. No CV is required.
        </p>
      </div>
    );
  }

  if (state.success) {
    return (
      <div
        className="membership-status"
        ref={successRef}
        tabIndex={-1}
        role="status"
      >
        <p className="label">Application received</p>
        <h2>Your application is saved.</h2>
        <p>
          We review your application and show the decision in My account.
        </p>
        <p>
          Membership is confirmed only after approval. Your application details
          stay private.
        </p>
        <Link className="button" href="/account">
          View my application <span aria-hidden="true">→</span>
        </Link>
      </div>
    );
  }

  function change(field: keyof MembershipInput, value: string | boolean) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function error(field: keyof MembershipInput) {
    return state.errors?.[field];
  }

  function describe(field: keyof MembershipInput, hint?: string) {
    return [hint, error(field) ? `membership-${field}-error` : ""]
      .filter(Boolean)
      .join(" ") || undefined;
  }

  function fieldError(field: keyof MembershipInput) {
    return error(field) ? (
      <span className="membership-field-error" id={`membership-${field}-error`}>
        {error(field)}
      </span>
    ) : null;
  }

  return (
    <form action={action} className="membership-form" ref={formRef}>
      <div className="membership-form-heading">
        <p className="label">Your membership application</p>
        <h2>Tell us about your work.</h2>
        <p>All fields are required unless marked optional.</p>
      </div>
      <div className="membership-verified-email">
        <span className="label">Verified email</span>
        <strong>{user.email}</strong>
        <span>This is the address associated with your application.</span>
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
                      {fieldNames[field as keyof MembershipInput]}: {message}
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
              aria-describedby={describe("organisation", "membership-organisation-hint")}
            />
            <span className="membership-hint" id="membership-organisation-hint">
              Independent practitioners can enter “Independent”.
            </span>
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
            aria-describedby={describe("profileUrl", "membership-profileUrl-hint")}
          />
          <span className="membership-hint" id="membership-profileUrl-hint">
            A public profile can help us understand your background.
          </span>
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
            Tell us about the policy questions you work on and what you hope to
            gain from the community. A short paragraph is enough; please leave
            out confidential information.
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
        <label className="membership-field" htmlFor="membership-contribution">
          <span>What could you contribute? <span className="membership-optional">(optional)</span></span>
          <span className="membership-hint" id="membership-contribution-hint">
            For example, an area of experience, a practical question to work
            through or a perspective others could learn from.
          </span>
          <textarea
            id="membership-contribution"
            name="contribution"
            rows={4}
            maxLength={1000}
            value={values.contribution}
            onChange={(event) => change("contribution", event.target.value)}
            aria-invalid={Boolean(error("contribution"))}
            aria-describedby={describe("contribution", "membership-contribution-hint membership-contribution-count")}
          />
          <span className="membership-count" id="membership-contribution-count">
            {Array.from(values.contribution.normalize("NFC")).length.toLocaleString()} / 1,000 characters
          </span>
          {fieldError("contribution")}
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
            participate in a personal capacity. My application does not imply
            an endorsement by my employer.
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
          {pending ? "Submitting your application…" : "Submit membership application"}
          {!pending && <span aria-hidden="true">→</span>}
        </button>
        <p className="membership-hint" aria-live="polite">
          {pending ? "Please keep this page open while we save your application." : "Membership is by individual approval."}
        </p>
      </div>
    </form>
  );
}
