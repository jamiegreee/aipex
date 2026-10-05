# AI Policy Exchange

AIPEX brings the policy community together to understand the changing AI landscape and shape how we respond. The site introduces a new community, starting with informal gatherings in London.

## Local development

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Run `npm run lint` and `npm run build` to check changes.

## Public pages

- `/`: mission, community introduction, planned first gathering and invitation to join.
- `/gatherings`: first London social, clearly labelled as being planned.
- `/community`: registration of interest by email and common questions.
- `/about`: purpose, approach and founder.
- `/contact`: contact address and hosting enquiries.
- `/privacy`: information handling for the current email-based community.

The primary join action opens a prefilled email to `hello@theaipex.org`; it does not save a signup in the browser or claim someone has registered. The visitor must send the email. No mailing-list provider or database is connected. Confirm that the existing contact mailbox is monitored before publishing.

The event date, venue, attendance fee and RSVP destination are not yet confirmed. Update the Gatherings page when they are ready. A future RSVP service can replace the email link.

Legacy research and fellowship URLs temporarily redirect to About and Community respectively. Research source files are retained for review, but the original claims are not promoted on the community site. The old charter URL redirects to About.

## Design

Newsreader display typography, DM Sans body text, IBM Plex Mono labels, a warm paper background and cobalt, pink and soft green accents. Fonts are served locally by Next.js. The conversation and London illustrations are original SVG/CSS components, with no stock attendee photography.

The site includes responsive navigation, visible keyboard focus, a skip link and reduced-motion support. Google Analytics from the previous design has been removed to match the current privacy information.
