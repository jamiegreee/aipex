"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { ANALYTICS_CHOICE_COOKIE, GA_ID, analyticsLocation, clearAnalyticsCookies, isAnalyticsHost, isAnalyticsPage, setAnalyticsEnabled, trackPage } from "@/lib/analytics";

type Choice = "accepted" | "rejected" | null;
const eventName = "aipex-analytics-choice";
const openEventName = "aipex-open-cookie-preferences";
function readChoice(): Choice {
  const value = document.cookie.split("; ").find(row => row.startsWith(`${ANALYTICS_CHOICE_COOKIE}=`))?.split("=")[1];
  return value === "accepted" || value === "rejected" ? value : null;
}
function subscribe(notify: () => void) {
  window.addEventListener(eventName, notify);
  window.addEventListener("focus", notify);
  return () => {
    window.removeEventListener(eventName, notify);
    window.removeEventListener("focus", notify);
  };
}
const serverChoice = () => null;
const subscribeNever = () => () => {};
const clientTrue = () => true;
const serverFalse = () => false;

export default function Analytics() {
  const pathname = usePathname();
  const choice = useSyncExternalStore(subscribe, readChoice, serverChoice);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const previousPage = useRef<string | null>(null);
  // Server render and hydration see hydrated=false, so nothing loads until the
  // real cookie choice is known.
  const hydrated = useSyncExternalStore(subscribeNever, clientTrue, serverFalse);
  // "off": nothing loads (rejected, private page or other host).
  // "denied": cookieless pings only, until the visitor chooses.
  // "granted": full measurement with analytics cookies.
  const mode: "off" | "denied" | "granted" =
    !hydrated || choice === "rejected" || !isAnalyticsPage(pathname) || !isAnalyticsHost(window.location.hostname)
      ? "off" : choice === "accepted" ? "granted" : "denied";

  useEffect(() => {
    const open = () => setPreferencesOpen(true);
    window.addEventListener(openEventName, open);
    return () => window.removeEventListener(openEventName, open);
  }, []);

  useEffect(() => {
    const enabled = mode !== "off";
    setAnalyticsEnabled(enabled, mode === "granted");
    if (!enabled) { previousPage.current = null; return; }
    if (ready && previousPage.current !== pathname) {
      trackPage(pathname, previousPage.current ? analyticsLocation(previousPage.current) : document.referrer);
      previousPage.current = pathname;
    }
    return () => setAnalyticsEnabled(false);
  }, [mode, pathname, ready]);

  function choose(next: Exclude<Choice, null>) {
    document.cookie = `${ANALYTICS_CHOICE_COOKIE}=${next}; Max-Age=15552000; Path=/; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;
    if (next === "rejected") {
      setAnalyticsEnabled(false);
      clearAnalyticsCookies();
      setReady(false);
    }
    window.dispatchEvent(new Event(eventName));
    setPreferencesOpen(false);
  }

  const show = choice === null || preferencesOpen;
  return (
    <>
      {mode !== "off" && (
        <Script id="aipex-google-analytics" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" onReady={() => setReady(true)} />
      )}
      {show && (
        <section className="analytics-choice" aria-label="Analytics preferences">
          <div className="container analytics-choice-inner">
            <div>
              <h2>Cookie preferences</h2>
              <p>We use Google Analytics to understand visits to public pages. Until you allow analytics, it sets no cookies and sends only limited, cookieless visit signals. Account details and saved work stay private. <Link href="/privacy">Privacy details</Link></p>
            </div>
            <div className="analytics-actions">
              <button className="button button-small button-outline" onClick={() => choose("rejected")}>Reject analytics</button>
              <button className="button button-small" onClick={() => choose("accepted")}>Allow analytics</button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

// Lets the footer reopen the consent banner after a choice has been made.
export function CookiePreferencesButton() {
  return (
    <button className="footer-cookie-button" type="button" onClick={() => window.dispatchEvent(new Event(openEventName))}>
      Cookie preferences
    </button>
  );
}
