# Gatherings visibility

Gatherings are temporarily hidden from the AIPEX website at the founder's request, as of 16 October 2026.

`src/lib/site.ts` sets `gatheringsEnabled` to false. This hides the homepage event feature and both navigation links, excludes the event route from the sitemap, and temporarily redirects `/gatherings` to `/courses`. The event page, poster and styles remain available.

Community, about, contact, footer and homepage copy now describe online learning and general participation without advertising an upcoming London event. The community email draft requests learning interests and feedback, with updates only when requested.

To restore gatherings, set the flag to true and publish a new build. Confirm real event details and review the surrounding copy before promoting them again. This website change does not alter Luma or the internal Notion pilot plan.
