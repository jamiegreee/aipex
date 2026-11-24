# AIPEX website analytics

The October community redesign removed the original Google tag from the root layout. This repair restores the existing GA4 property; it does not create a new property.

- Property: AI Policy Exchange (`530285307`), account James Green (`42309986`).
- Web stream: theaipex.org (`14269438474`), measurement ID `G-J1YPT21EYK`.
- Production domains only: theaipex.org and www.theaipex.org. Previews and localhost send nothing.
- Google Analytics loads only after the visitor accepts analytics cookies. The existing `aipex_analytics_v1` cookie remembers either choice for 180 days. Rejecting or withdrawing stops measurement and clears the Google Analytics cookies from that browser. Advertising consent stays disabled.
- Visitors without a saved choice see a small notice in the bottom-right corner. **Read more** opens the cookies section of the privacy page. **Reject** and **Accept** each save the choice and dismiss the notice.
- The **Cookies** link in the footer opens `/cookies`. Visitors can review their choice there, select Yes or No and save it.
- Explicit public-route allowlist: public site and course reading pages. No account/auth/API routes, learning records, exercise responses or user IDs. Only manual page views; no automatic forms, outbound links, downloads or history events.
- Page addresses exclude query strings and fragments; external referrers retain only their origin, internal referrers must be an allowed public page. This prevents reset tokens and private paths from entering analytics. Global page fields are also sanitised for standard session/engagement events.
- **Keep enhanced measurement OFF in the web stream.** The application disables automatic page views (`send_page_view: false`) and sends one view on first consent/load and on subsequent Next.js pathname changes. Turning on automatic history detection risks duplicates and unsanitised URLs.
- The active `Exclude Jamie current network` data filter matches `traffic_type = jamie_internal`. Its exact-IP rule lives under the Google tag's Define internal traffic settings. Update it if Jamie's public IP changes. No IP is stored in this repository.

## Verification

Run `node --import tsx --test tests/analytics.test.ts`, lint and the production build. In a clean browser session on the production domain, check the following.

1. Open the home page and reject analytics cookies. Check that the Google tag never loads, the notice disappears immediately and refreshing keeps it hidden.
2. Follow **Cookies** in the footer, select Yes and save. On a public page covered by analytics, check that `gtag.js` loads and each new pathname generates one manual `page_view`. Opening an account page should stop measurement.
3. Return to **Cookies**, select No and save. Check that the browser's Google Analytics cookies have been removed and that a subsequent public page load sends no analytics. Refresh the settings page to confirm No is still selected.

Use Google Tag Assistant or DebugView to inspect page locations and consent. Jamie's IP exclusion can prevent test traffic appearing in reports, so do not disable it just to make Realtime show a visitor. Reports and stream health can take time to update.

References: [Google basic consent](https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic), [manual page views](https://developers.google.com/analytics/devguides/collection/ga4/views), [internal traffic](https://support.google.com/analytics/answer/10104470).
