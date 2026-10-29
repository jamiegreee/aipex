export const foundingMemberLimit = 50;

export const membershipInterestOptions = [
  { value: "public-institutions", label: "Public institutions and services" },
  { value: "economy", label: "The economy, work and public finances" },
  { value: "safety-security", label: "AI safety and security" },
  { value: "international", label: "International cooperation and governance" },
  { value: "democracy", label: "Democracy and public accountability" },
  { value: "other", label: "Other policy questions" },
] as const;

export type MembershipInterest = (typeof membershipInterestOptions)[number]["value"];
export type MembershipStatus = "pending" | "approved" | "declined";

export type MembershipInput = {
  fullName: string;
  role: string;
  organisation: string;
  country: string;
  profileUrl: string;
  interests: MembershipInterest[];
  motivation: string;
  contribution: string;
  agreement: boolean;
};

export type MembershipFormErrors = Partial<Record<keyof MembershipInput | "form", string>>;

export type MembershipApplication = {
  user_id: string;
  email: string;
  full_name: string;
  role: string;
  organisation: string;
  country: string;
  profile_url: string;
  interests: MembershipInterest[];
  motivation: string;
  contribution: string;
  status: MembershipStatus;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
};

const singleLineControls = /[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/u;
const multilineControls = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/u;
const interestValues = new Set<string>(membershipInterestOptions.map(({ value }) => value));

/** Validate untrusted form values; identity and email come from verified Auth. */
export function parseMembershipForm(form: FormData): {
  data?: MembershipInput;
  errors: MembershipFormErrors;
} {
  const errors: MembershipFormErrors = {};

  const text = (
    key: Exclude<keyof MembershipInput, "interests" | "agreement">,
    label: string,
    minimum: number,
    maximum: number,
    multiline = false,
  ): string => {
    const entries = form.getAll(key);
    if (entries.length > 1 || entries.some((entry) => typeof entry !== "string")) {
      errors[key] = `Enter one ${label.toLowerCase()}.`;
      return "";
    }
    const raw = (entries[0] as string | undefined) ?? "";
    if ((multiline ? multilineControls : singleLineControls).test(raw)) {
      errors[key] = `Remove unsupported control characters from ${label.toLowerCase()}.`;
      return "";
    }
    const value = raw.replace(/\r\n?/g, "\n").normalize("NFC").trim();
    const length = Array.from(value).length;
    if (length < minimum) {
      errors[key] = minimum > 2
        ? `Write at least ${minimum} characters for ${label.toLowerCase()}.`
        : `Enter your ${label.toLowerCase()}.`;
    } else if (length > maximum) {
      errors[key] = `Keep ${label.toLowerCase()} to ${maximum} characters or fewer.`;
    }
    return value;
  };

  const fullName = text("fullName", "Full name", 2, 100);
  const role = text("role", "Role", 2, 120);
  const organisation = text("organisation", "Organisation", 2, 160);
  const country = text("country", "Country or location", 2, 100);
  let profileUrl = text("profileUrl", "LinkedIn profile URL", 0, 300);
  const motivation = text("motivation", "Your reason for joining", 40, 1500, true);
  const contribution = text("contribution", "Your contribution", 0, 1000, true);

  if (profileUrl && !errors.profileUrl) {
    try {
      const url = new URL(profileUrl);
      const match = /^\/in\/([A-Za-z0-9%._~-]+)\/?$/.exec(url.pathname);
      const slug = match ? decodeURIComponent(match[1]) : "";
      if (
        url.protocol !== "https:" ||
        !["linkedin.com", "www.linkedin.com"].includes(url.hostname) ||
        url.username || url.password || url.port ||
        /[\\\s]/u.test(profileUrl) ||
        !slug || /[/?#\\\s]/u.test(slug) || singleLineControls.test(slug)
      ) throw new Error("Not a public LinkedIn profile");
      // Save a public profile, without potentially identifying tracking values.
      const canonical = `https://www.linkedin.com${url.pathname.replace(/\/$/, "")}`;
      if (canonical.length > 300) throw new Error("Profile URL is too long");
      profileUrl = canonical;
    } catch {
      errors.profileUrl = "Enter a public LinkedIn profile, such as https://www.linkedin.com/in/your-name, or leave this blank.";
    }
  }

  const interests = form.getAll("interests");
  if (
    interests.length < 1 || interests.length > 4 ||
    interests.some((value) => typeof value !== "string" || !interestValues.has(value)) ||
    new Set(interests).size !== interests.length
  ) errors.interests = "Choose between one and four different policy interests.";

  const agreements = form.getAll("agreement");
  const agreement = agreements.length === 1 &&
    typeof agreements[0] === "string" && ["on", "true", "yes"].includes(agreements[0]);
  if (!agreement) errors.agreement = "Confirm that you agree before submitting your application.";

  const honeypot = form.getAll("website");
  if (honeypot.length > 1 || honeypot.some((value) => typeof value !== "string" || value.trim() !== "")) {
    errors.form = "Your application could not be submitted. Refresh the page and try again.";
  }

  if (Object.keys(errors).length) return { errors };
  return {
    data: {
      fullName, role, organisation, country, profileUrl,
      interests: interests as MembershipInterest[],
      motivation, contribution, agreement,
    },
    errors,
  };
}
