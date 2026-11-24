"use client";

import { type FormEvent, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { type AnalyticsChoice as Choice, ANALYTICS_CHOICE_COOKIE, GA_ID, analyticsLocation, canMeasureVisit, clearAnalyticsCookies, setAnalyticsEnabled, trackPage } from "@/lib/analytics";

const eventName = "aipex-analytics-choice";
function readChoice(): Choice | null {
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
// Until hydration, the browser's preference is unknown and analytics stays off.
const serverChoice = () => undefined;

function useChoice() {
  return useSyncExternalStore<Choice | null | undefined>(subscribe, readChoice, serverChoice);
}

function saveChoice(next: Choice) {
  document.cookie = `${ANALYTICS_CHOICE_COOKIE}=${next}; Max-Age=15552000; Path=/; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;
  if (next === "rejected") {
    setAnalyticsEnabled(false);
    clearAnalyticsCookies();
  }
  window.dispatchEvent(new Event(eventName));
  return readChoice() === next;
}

const saveError = "Your browser could not save your cookie choice. Check your browser’s cookie settings.";

export default function Analytics() {
  const pathname = usePathname();
  const choice = useChoice();
  const [ready, setReady] = useState(false);
  const previousPage = useRef<string | null>(null);
  const allowed = typeof window !== "undefined" && canMeasureVisit(choice, window.location.hostname, pathname);

  useEffect(() => {
    setAnalyticsEnabled(allowed);
    if (!allowed) { previousPage.current = null; return; }
    if (ready && previousPage.current !== pathname) {
      trackPage(pathname, previousPage.current ? analyticsLocation(previousPage.current) : document.referrer);
      previousPage.current = pathname;
    }
    return () => setAnalyticsEnabled(false);
  }, [allowed, pathname, ready]);

  return (
    <>
      {allowed && (
        <Script id="aipex-google-analytics" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" onReady={() => setReady(true)} />
      )}
      {choice === null && pathname !== "/cookies" && <CookieNotice />}
    </>
  );
}

function CookieNotice() {
  const [failed, setFailed] = useState(false);

  function choose(next: Choice) {
    setFailed(!saveChoice(next));
  }

  return (
    <section className="analytics-choice" aria-label="Analytics cookies" data-nosnippet="">
      <p>We use cookies. <Link href="/privacy#cookies">Read more</Link></p>
      <button type="button" aria-label="Reject analytics cookies" onClick={() => choose("rejected")}>Reject</button>
      <button type="button" aria-label="Accept analytics cookies" onClick={() => choose("accepted")}>Accept</button>
      {failed && <p className="cookie-error" role="alert">{saveError}</p>}
    </section>
  );
}

export function CookieSettings() {
  const choice = useChoice();
  const [feedback, setFeedback] = useState("");

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = new FormData(event.currentTarget).get("analytics");
    if (next === "accepted" || next === "rejected") {
      setFeedback(saveChoice(next) ? "Your cookie settings have been saved." : saveError);
    }
  }

  if (choice === undefined) {
    return <noscript><p>Analytics is off while JavaScript is disabled.</p></noscript>;
  }

  return (
    <form className="cookie-settings" onSubmit={save} onChange={() => setFeedback("")}>
      <fieldset key={choice ?? "undecided"}>
        <legend>Allow analytics cookies?</legend>
        <label><input type="radio" name="analytics" value="accepted" defaultChecked={choice === "accepted"} /> Yes</label>
        <label><input type="radio" name="analytics" value="rejected" defaultChecked={choice !== "accepted"} /> No</label>
      </fieldset>
      <button type="submit" className="button button-small">Save cookie settings</button>
      <p role="status">{feedback}</p>
    </form>
  );
}
