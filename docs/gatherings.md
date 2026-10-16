# Gatherings visibility

Gatherings are temporarily hidden from the AIPEX website at the founder's request, as of 16 October 2026.

`src/lib/site.ts` sets `gatheringsEnabled` to false. This hides the homepage event feature and both navigation links, excludes the event route from the sitemap, and temporarily redirects `/gatherings` to `/courses`. The event page, poster and styles remain available.

Community recruitment is also paused through `communityEnabled = false` in the same file. This hides community invitations in the homepage and mobile navigation, excludes `/community` from the sitemap and redirects the page to `/courses`. The original community page and email draft remain in the source. About, contact and site metadata now describe the courses; `/fellowship` redirects directly to `/courses`.

To restore community recruitment, set `communityEnabled` to true and review the public copy. To restore gatherings, set `gatheringsEnabled` to true and publish a new build; also restore the community route if it is being used for event interest. Confirm real event details and review the surrounding copy before promoting them again. These website changes do not alter Luma or the internal Notion pilot plan.
