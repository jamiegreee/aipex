# AI Policy Exchange

AIPEX builds capacity to understand, develop and deliver effective AI policy through practical education and community.

## Local development

```sh
npm ci
npm run dev -- --port 3100
```

Open http://127.0.0.1:3100. Run `npm test`, `npm run lint` and `npm run build` to check changes. See [learning operations](docs/learning-operations.md) for the dedicated Supabase stack, integration tests, email delivery and production setup.

## Public pages

- `/`: mission, courses, community and invitation to join.
- `/courses`: free self-paced course catalogue.
- `/courses/[course]`: full curriculum, enrolment and workbook download.
- `/courses/[course]/[lesson]`: lesson, exercise, worked answer and knowledge checks.
- `/learn`: authenticated dashboard, progress and saved work.
- `/learn/portfolio`: private Markdown portfolio export.
- `/signup`, `/login`, `/forgot-password`, `/reset-password`: account flows.
- `/gatherings`: first London social, clearly labelled as being planned.
- `/community`: registration of interest by email and common questions.
- `/about`: purpose, approach and founder.
- `/contact`: contact address and hosting enquiries.
- `/privacy`: account, course-work and community information handling.

Community registration of interest opens a prefilled email to `hello@theaipex.org`; it is separate from learning accounts. Course accounts use Supabase Auth and row-level-security-protected database tables. Production accounts require a dedicated configured project and custom SMTP; the application does not substitute local storage for persistence.

The event date, venue, attendance fee and RSVP destination are not yet confirmed. Update the Gatherings page when they are ready. A future RSVP service can replace the email link.

Legacy research and fellowship URLs temporarily redirect to About and Community respectively. Research source files are retained for review, but the original claims are not promoted on the community site. The old charter URL redirects to About.

## Design

Newsreader display typography, DM Sans body text, IBM Plex Mono labels, a warm paper background and cobalt, pink and soft green accents. Fonts are served locally by Next.js. The conversation and London illustrations are original SVG/CSS components, with no stock attendee photography.

The site includes responsive navigation, visible keyboard focus, a skip link and reduced-motion support. Google Analytics from the previous design has been removed to match the current privacy information.
