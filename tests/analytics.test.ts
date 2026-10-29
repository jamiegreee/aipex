import { test } from "node:test";
import assert from "node:assert/strict";
import { analyticsLocation, analyticsReferrer, isAnalyticsHost, isAnalyticsPage, setAnalyticsEnabled, trackPage } from "../src/lib/analytics";

test("public pages are tracked, private and unknown routes are excluded", () => {
  for (const path of ["/", "/about", "/charter", "/contact", "/privacy"]) assert.ok(isAnalyticsPage(path));
  for (const path of ["/courses", "/courses/ai-policy-in-practice/a-policy-problem-not-a-technology", "/courses/governing-ai-in-public-services", "/learn", "/learn/portfolio", "/login", "/signup", "/reset-password", "/api/auth/callback", "/courses/user@example.com", "/future-account"]) assert.equal(isAnalyticsPage(path), false);
  assert.ok(isAnalyticsHost("theaipex.org"));
  assert.ok(isAnalyticsHost("www.theaipex.org"));
  for (const host of ["localhost", "aipex-test.vercel.app", "theaipex.org.evil.test"]) assert.equal(isAnalyticsHost(host), false);
});

test("consent gates collection and page-view payloads contain no private URL data", () => {
  const target = { location: { pathname: "/about", hostname: "theaipex.org" } } as unknown as import("../src/lib/analytics").AnalyticsWindow;
  Object.defineProperty(globalThis, "window", { value: target, configurable: true });
  Object.defineProperty(globalThis, "document", { value: { title: "About — AIPEX", referrer: "https://theaipex.org/reset-password?token=secret" }, configurable: true });
  try {
    setAnalyticsEnabled(false);
    assert.equal(target.dataLayer, undefined, "no Google queue before consent");
    setAnalyticsEnabled(true);
    trackPage("/about", "https://example.com/private?email=person@example.com");
    const commands = target.dataLayer!.map(entry => Array.from(entry as ArrayLike<unknown>));
    assert.equal(commands.filter(c => c[0] === "config").length, 1);
    assert.equal((commands.find(c => c[0] === "config")![2] as Record<string, unknown>).send_page_view, false);
    assert.deepEqual(commands.find(c => c[0] === "event")![2], { page_location: "https://theaipex.org/about", page_referrer: "https://example.com", page_title: "About — AIPEX", send_to: "G-J1YPT21EYK" });
    assert.equal(JSON.stringify(commands).includes("secret"), false);
    assert.equal(JSON.stringify(commands).includes("person@example.com"), false);
    const size = target.dataLayer!.length;
    trackPage("/learn", "");
    assert.equal(target.dataLayer!.length, size, "private route produces no page view");
    setAnalyticsEnabled(false);
    const afterReject = target.dataLayer!.length;
    trackPage("/about", "");
    assert.equal(target.dataLayer!.length, afterReject, "withdrawal stops events immediately");
    assert.equal(target["ga-disable-G-J1YPT21EYK"], true);
  } finally {
    Reflect.deleteProperty(globalThis, "window");
    Reflect.deleteProperty(globalThis, "document");
  }
});

test("page URLs and referrers do not carry tokens or private paths", () => {
  assert.equal(analyticsLocation("/courses?email=person@example.com#token=secret"), "https://theaipex.org/courses");
  assert.equal(analyticsReferrer("https://theaipex.org/reset-password?token=secret"), "");
  assert.equal(analyticsReferrer("https://www.theaipex.org/courses?token=secret"), "");
  assert.equal(analyticsReferrer("https://www.theaipex.org/about?token=secret"), "https://theaipex.org/about");
  assert.equal(analyticsReferrer("https://example.com/private/person@example.com?token=secret"), "https://example.com");
  assert.equal(analyticsReferrer("javascript:secret"), "");
});
