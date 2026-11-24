"use client";

import { type FormEvent, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { ANALYTICS_CHOICE_COOKIE, GA_ID, analyticsLocation, clearAnalyticsCookies, isAnalyticsHost, isAnalyticsPage, setAnalyticsEnabled, trackPage } from "@/lib/analytics";

type Choice = "accepted" | "rejected";
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
  const allowed = choice === "accepted" && isAnalyticsPage(pathname);

  useEffect(() => {
    const enabled = allowed && isAnalyticsHost(window.location.hostname);
    setAnalyticsEnabled(enabled);
    if (!enabled) { previousPage.current = null; return; }
    if (ready && previousPage.current !== pathname) {
      trackPage(pathname, previousPage.current ? analyticsLocation(previousPage.current) : document.referrer);
      previousPage.current = pathname;
    }
    return () => setAnalyticsEnabled(false);
  }, [allowed, pathname, ready]);

  return (
    <>
      {allowed && typeof window !== "undefined" && isAnalyticsHost(window.location.hostname) && (
        <Script id="aipex-google-analytics" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" onReady={() => setReady(true)} />
      )}
      {choice !== undefined && pathname !== "/cookies" && (
        <CookieBanner key={pathname} choice={choice} />
      )}
    </>
  );
}

function CookieBanner({ choice }: { choice: Choice | null }) {
  const [confirmed, setConfirmed] = useState(false);
  const [failed, setFailed] = useState(false);
  const message = useRef<HTMLParagraphElement>(null);

  function choose(next: Choice) {
    const saved = saveChoice(next);
    setConfirmed(saved);
    setFailed(!saved);
  }

  useEffect(() => {
    if (confirmed) message.current?.focus();
  }, [confirmed]);

  if (choice && !confirmed) return null;
  return (
    <section className="analytics-choice" aria-label="Cookies on AIPEX" data-nosnippet="">
      <div className="container analytics-choice-inner">
        {choice ? (
          <>
            <p ref={message} tabIndex={-1} role="alert">
              You’ve {choice} analytics cookies. You can <Link href="/cookies">change your cookie settings</Link> at any time.
            </p>
            <button type="button" className="button button-small" onClick={() => setConfirmed(false)}>Hide cookie message</button>
          </>
        ) : (
          <>
            <div>
              <h2>Cookies on AIPEX</h2>
              <p>We use essential cookies for sign-in and to remember your cookie choice. Can we also use Google Analytics cookies to see which public pages people visit?</p>
            </div>
            <div className="analytics-actions">
              <button type="button" className="button button-small" onClick={() => choose("accepted")}>Accept analytics cookies</button>
              <button type="button" className="button button-small" onClick={() => choose("rejected")}>Reject analytics cookies</button>
              <Link href="/cookies">View cookies</Link>
            </div>
            {failed && <p role="alert">{saveError}</p>}
          </>
        )}
      </div>
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
