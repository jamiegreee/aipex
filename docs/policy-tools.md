# Policy tools and case library

Published routes: `/tools`, three `/tools/[tool]` workspaces, `/cases` and six `/cases/[slug]` pages. The homepage and navigation connect all three tools, cases and the existing courses. Gatherings and community recruitment remain hidden.

## Editorial method

Tool definitions and examples live in `src/content/policy-tools.ts`. Each prompt identifies its supporting sources. The source registry records publisher, URL, relevant sections, scope and a review date (18 October 2026). The tools are original AIPEX working aids, not official appraisal, legal-compliance or deployment-approval systems.

The case library contains three documented cases: the ICO's 2023–2024 recruitment audits, the 2024 and March 2026 GDS accounts of GOV.UK Chat, and England's 2020 statistical grade standardisation. Each distinguishes reported facts, limits and AIPEX analysis. Historical findings are not presented as current service performance or law. Do not replace or embellish reported facts without checking the linked primary source.

Preserve documented case/tool slugs. The three fictional case routes were removed at the founder’s request on 18 October 2026; they return 404 and are absent from the sitemap. Older learner drafts remain readable and exportable with a retired-fictional-material notice; do not delete saved work. Review source support when guidance changes. Check evidence citations within each case, field source references, course links and exported case provenance. The test suite checks those references resolve.

## Workspaces

No account is required. Drafts autosave in the current browser's local storage, separately for each tool, with up to 30 browser drafts per tool through the UI. A blocked or full store displays a download prompt. Unreadable storage is not overwritten. A storage change in another tab pauses local writing and asks the user to download their open work before reloading, avoiding silent overwrites. Local drafts persist after account sign-out; the interface explains shared-device implications and allows removal. Returning to a case resumes its browser draft. Source-based worked analyses and imports open separately, retaining existing work. Each analysis uses a documented case; proposed controls and requests are identified as AIPEX analysis, not reported arrangements. Unknown costs, approvals, owners and dates stay unknown. No invented classifier counts are loaded.

Exports: Markdown working brief, JSON editable project, and browser print/save as PDF. Case-derived briefs include case provenance and primary references. Incomplete sections and unresolved option conditions remain visible. Written reasoning is not automatically assessed. Tool-specific review questions appear before export and travel with the downloaded brief. Option cards open individually, with a side-by-side table for comparison; this table does not rank policies. The classification calculator checks non-negative integer counts and returns undefined metrics for zero denominators. Its metrics do not assess uncertainty, fairness, causality or deployment readiness.

## Account saving

`/api/workspaces` uses the existing verified Neon Auth session and learner JWT. GET returns only the account's rows, with private/no-store caching. POST validates origin, size and schema and derives the owner from the session. Inserts use an independent UUID; updates also match the previously returned timestamp to reject stale overwrites. No owner connection string or new privileged key is deployed.

Apply `neon/migrations/20261018180000_policy_workspaces.sql` once to the dedicated AIPEX database, then refresh the Data API schema. This additive migration was applied on 18 October 2026 to AIPEX Learning / production (`empty-block-17582000`, `br-dawn-union-zamwo3z4`, `neondb`). It does not modify course tables. RLS is enabled before grants; anonymous and PUBLIC privileges are revoked. All authenticated operations require `auth.uid() = user_id` for both existing and new rows. Account deletion cascades to drafts. Ownership, RLS and anonymous denial were verified in the database console.

Save to account is explicit; subsequent edits continue saving locally until the user saves the account copy again. Account drafts open as new local copies, preserving both originals. Removing a browser draft does not delete the account copy. The privacy page describes storage and account-draft deletion requests.

Writing workspaces remain excluded from the analytics allowlist. No draft content, project names, case choices or calculations are sent to Google Analytics or an AI service.

## Verification

Run `npm test`, ESLint (excluding the unrelated `.claude/` worktree), and `npm run build`. Tests cover metric denominators, zero/invalid counts, malformed imports, option integrity, export completeness, case provenance and source/course links. Browser checks should cover actual editing and reload recovery, switching drafts, case-to-tool launch, worked examples, filter empty/reset states, project download/import, account save/reopen, and desktop/mobile layout. Account checks require an existing verified QA session; do not disable email verification.

## Editorial review

See [the source-support and usability review](policy-tools-quality-review.md) for the claim-to-source map, changes, evidence limits and verification. Production account insert/update/reload/reopen was verified with a separate fictional QA draft on 18 October 2026 before this content revision; this revision does not change account APIs or the database schema.
