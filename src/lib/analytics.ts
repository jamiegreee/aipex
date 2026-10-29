import { coursesEnabled } from "./site";

export const GA_ID = "G-J1YPT21EYK";
export const ANALYTICS_CHOICE_COOKIE = "aipex_analytics_v1";

// An allowlist keeps future account routes out of analytics by default.
export function isAnalyticsPage(path: string): boolean {
  return ["/", "/about", "/community", "/gatherings", "/charter", "/contact", "/privacy"].includes(path)
    || (coursesEnabled && (path === "/courses" || /^\/courses\/(ai-policy-in-practice|governing-ai-in-public-services)(\/[a-z0-9-]+)?$/.test(path)));
}

export function analyticsLocation(path: string): string {
  return `https://theaipex.org${path.split(/[?#]/)[0]}`;
}

export function analyticsReferrer(referrer: string): string {
  try {
    const url = new URL(referrer);
    if (!["http:", "https:"].includes(url.protocol)) return "";
    if (["theaipex.org", "www.theaipex.org"].includes(url.hostname)) {
      return isAnalyticsPage(url.pathname) ? analyticsLocation(url.pathname) : "";
    }
    return url.origin;
  } catch {
    return "";
  }
}

export function isAnalyticsHost(host: string): boolean {
  return host === "theaipex.org" || host === "www.theaipex.org";
}

export type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  "ga-disable-G-J1YPT21EYK"?: boolean;
};

let initialized = false;
export function setAnalyticsEnabled(enabled: boolean) {
  const target = window as AnalyticsWindow;
  target[`ga-disable-${GA_ID}`] = !enabled;
  if (!enabled && !initialized) return;
  target.dataLayer ??= [];
  // Google processes the standard gtag Arguments queue format.
  // eslint-disable-next-line prefer-rest-params
  target.gtag ??= function () { target.dataLayer!.push(arguments); };
  if (!initialized) {
    target.gtag("consent", "default", {
      analytics_storage: "denied", ad_storage: "denied",
      ad_user_data: "denied", ad_personalization: "denied",
    });
    target.gtag("js", new Date());
    target.gtag("config", GA_ID, {
      send_page_view: false, allow_google_signals: false,
      allow_ad_personalization_signals: false, cookie_expires: 15552000,
      page_location: analyticsLocation(window.location.pathname),
      page_referrer: analyticsReferrer(document.referrer),
    });
    initialized = true;
  }
  target.gtag("consent", "update", { analytics_storage: enabled ? "granted" : "denied" });
}

export function trackPage(path: string, referrer: string) {
  const target = window as AnalyticsWindow;
  if (target[`ga-disable-${GA_ID}`] || !isAnalyticsPage(path)) return;
  const fields = {
    page_location: analyticsLocation(path), page_referrer: analyticsReferrer(referrer),
    page_title: document.title,
  };
  // Applies the sanitised URL to automatic session/engagement events too.
  target.gtag?.("set", fields);
  target.gtag?.("event", "page_view", { ...fields, send_to: GA_ID });
}

export function clearAnalyticsCookies() {
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.trim().split("=")[0];
    if (name !== "_ga" && !name.startsWith("_ga_")) continue;
    for (const domain of ["", "; Domain=theaipex.org", "; Domain=.theaipex.org", `; Domain=${window.location.hostname}`]) {
      document.cookie = `${name}=; Max-Age=0; Path=/${domain}; SameSite=Lax`;
    }
  }
}
