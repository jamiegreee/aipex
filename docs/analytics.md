# AIPEX website analytics

The October community redesign removed the original Google tag from the root layout. This repair restores the existing GA4 property; it does not create a new property.

- Property: AI Policy Exchange (`530285307`), account James Green (`42309986`).
- Web stream: theaipex.org (`14269438474`), measurement ID `G-J1YPT21EYK`.
- Production domains only: theaipex.org and www.theaipex.org. Previews and localhost send nothing.
- Basic consent: do not load Google code until the visitor selects Allow analytics. The preference cookie expires after six months. Rejecting or withdrawing stops measurement and clears GA cookies. Advertising consent remains denied.
- Explicit public-route allowlist: public site and course reading pages. No account/auth/API routes, learning records, exercise responses or user IDs. Only manual page views; no automatic forms, outbound links, downloads or history events.
- Page addresses exclude query strings and fragments; external referrers retain only their origin, internal referrers must be an allowed public page. This prevents reset tokens and private paths from entering analytics. Global page fields are also sanitised for standard session/engagement events.
- **Keep enhanced measurement OFF in the web stream.** The application disables automatic page views (`send_page_view: false`) and sends one view on first consent/load and on subsequent Next.js pathname changes. Turning on automatic history detection risks duplicates and unsanitised URLs.
- The active `Exclude Jamie current network` data filter matches `traffic_type = jamie_internal`. Its exact-IP rule lives under the Google tag's Define internal traffic settings. Update it if Jamie's public IP changes. No IP is stored in this repository.

## Verification

Run `node --import tsx --test tests/analytics.test.ts`, lint and the production build. In a clean production browser session check that no Google script loads before consent or after Reject; Allow should load gtag.js, and public navigation should produce one manual page_view per pathname. Account navigation should stop collection. Reopening Cookie preferences and rejecting should clear analytics cookies and stop measurement; refresh should preserve the choice.

Use Google Tag Assistant or DebugView to inspect page locations and consent. Jamie's IP exclusion can prevent test traffic appearing in reports, so do not disable it just to make Realtime show a visitor. Reports and stream health can take time to update.

References: [Google basic consent](https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic), [manual page views](https://developers.google.com/analytics/devguides/collection/ga4/views), [internal traffic](https://support.google.com/analytics/answer/10104470).
