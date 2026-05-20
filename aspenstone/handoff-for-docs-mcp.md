# Handoff prompt — paste into a Claude session with Google Docs MCP

This is a verbatim instruction set for surgically editing the live Google Doc
**AspenStone_SEO_GEO_Playbook_v4** (id `1BDLajIh2tjFjzB_adS_RpmGUCcvl-Mo87wTKnMRHYiM`)
without disturbing the user's in-progress formatting changes.

**Edit only via `documents.batchUpdate`.** Use `replaceAllText`, `insertText`,
`deleteContentRange`, and `insertTableRow`/`updateTableCellStyle` as needed.
**Do NOT regenerate the document.** Do NOT do whole-section replacements that
delete and re-insert paragraphs unless explicitly told to below. Preserve every
text run's formatting that isn't named for replacement.

The user's current formatting state (orange/black Hudle branding, header logo,
callout-box tables, cover-page logo, custom heading styles) must remain intact.

Source doc URL:
https://docs.google.com/document/d/1BDLajIh2tjFjzB_adS_RpmGUCcvl-Mo87wTKnMRHYiM/edit

If you need to see a finished reference of what the result should look like
in content, there is a python-docx output at
`aspenstone/AspenStone_SEO_GEO_Playbook_v5.docx` in the
`katcahill-eng/pearl-marketing-strategy` repo, branch
`claude/update-aspenstone-seo-playbook-XmPge`. Use it as a content cross-check
only, not as a source — the live Doc is authoritative for formatting.

---

## Edit 1 — Cover page phase descriptors

`replaceAllText`:

- Find: `PHASE 1   ·  DIY Foundation   ·   Free`
  Replace: `PHASE 1   ·   DIY Foundation   ·   60 Days`
  (matchCase: true)

- Find: `PHASE 2   ·   Hudle Consulting Retainer   ·   $1,000/month`
  Replace: `PHASE 2   ·   Hudle Setup + Ads   ·   $1,000/month total (ads + consult)`
  (matchCase: true)

If the user has changed punctuation (·, em-dashes, spacing) since v4 export,
search by the shorter unique fragment `Hudle Consulting Retainer` and
`DIY Foundation   ·   Free`, then read the surrounding text via `documents.get`
and adjust the replacement to match the user's actual punctuation.

## Edit 2 — "How to use this document" Phase 2 paragraph

The full paragraph currently reads:

> Phase 2 (Run concurrently or consecutively) brings in Hudle Consulting at
> $1,000/month for unique city landing pages, GEO-optimized blog content,
> schema markup, Reddit/Quora authority building, link building, and ongoing
> optimization.

Replace with:

> Phase 2 (run concurrently or consecutively) brings Hudle Consulting in for
> a focused month-1 setup — Google Business Profile optimization, Google
> Local Services Ads and Search Ads campaign build, three Squarespace city
> landing pages, ad creative design, and a written handoff playbook plus
> curated training videos — followed by months 2–6 of bi-weekly check-in
> consults, ad creative refreshes, and progressively more city pages. Total
> $1,000/month covering BOTH ad spend (~$600–$700) AND the Hudle consult
> (~$300–$400). You manage the ads day-to-day with the playbook; Hudle is
> the strategist on call, not the ongoing ad manager.

Use `replaceAllText` with the full old string. If it fails (user edited the
string), use `documents.get`, locate the paragraph by anchor text
`brings in Hudle Consulting at $1,000/month`, compute its range, and do
`deleteContentRange` + `insertText` at the same start index.

## Edit 3 — Phase 1 cost/time/outcome paragraph

Find: `Total cost: $23 one-time (Squarespace plan upgrade). Total time: ~12 hours focused work spread across 60 days. Expected outcome: First Google calls within 30–45 days; first AI citations within 60–90 days; meaningful Map Pack visibility in Saratoga Springs by day 60.`

Replace: `Total cost: $0 (uses your existing Squarespace site as-is). Total time: ~12 hours focused work spread across 60 days. Expected outcome: First Google calls within 30–45 days; first AI citations within 60–90 days; meaningful Map Pack visibility in Saratoga Springs by day 60.`

## Edit 4 — Budget table

The "Budget at a glance" table currently has 5 rows (header + 4 data rows).
Rewrite the 4 data rows. Use per-cell `replaceAllText` if possible by matching
cell contents; otherwise compute cell ranges from `documents.get`.

Row 2 (was "Phase 1 (DIY) — total | $23 | Squarespace Business plan upgrade only"):
- Col 1: `Ad spend`
- Col 2: `$600–$700`
- Col 3: `Google Local Services Ads + Google Search Ads (uses $1,000 new-advertiser credit in month 1 if eligible)`

Row 3 (was "Phase 2 — Hudle services | $950 | Strategy, content, schema, GEO content, monthly reporting"):
- Col 1: `Hudle strategy consult`
- Col 2: `$300–$400`
- Col 3: `Month 1 setup + bi-weekly 30-min check-ins thereafter, ad creative refreshes, progressive landing pages`

Row 4 (was "Phase 2 — tools | $50 | Squarespace + small reserve"):
- Col 1: `Squarespace`
- Col 2: `$0 (existing)`
- Col 3: `Client's existing subscription — not a project cost`

Row 5 (was "Phase 2 total | $1,000 | Within budget"):
- Col 1: `Total`
- Col 2: `$1,000`
- Col 3: `Within budget; covers ads AND consult`

## Edit 5 — GBP secondary categories list

Current list (Task 2, "Add these secondary categories:"):
- Paving contractor
- Landscaper
- Masonry contractor
- Fireplace manufacturer (closest match for outdoor fireplaces)

Target list:
- Paving contractor
- Landscaper
- Landscape lighting designer
- Masonry contractor
- Fireplace manufacturer (closest match for outdoor fireplaces)
- Lawn irrigation equipment supplier

Operations:
1. After the `Landscaper` bullet, insert a new bullet `Landscape lighting designer` with the same list style.
2. After the `Fireplace manufacturer...` bullet, insert a new bullet `Lawn irrigation equipment supplier` with the same list style.
3. After the new `Lawn irrigation equipment supplier` bullet, insert a normal-style (non-bullet) paragraph:

> Conditional secondary — Landscape architect: only add this category if Aspen Stone holds a Utah DOPL Landscape Architect license (separate from the contractor license). If unsure, leave it off; misrepresenting a regulated license is a GBP suspension risk.

Use `insertText` followed by `updateParagraphStyle` to set bulleted vs. normal
formatting. Reuse the surrounding paragraph's `namedStyleType` for the bullets,
and the body normal style for the conditional note.

## Edit 6 — PHASE 2 section rewrite

Locate the H1 paragraph reading `PHASE 2` and the subtitle paragraph reading
`Scale-Up with Hudle Consulting ($1,000/month)`.

1. Replace subtitle text:
   - Find: `Scale-Up with Hudle Consulting ($1,000/month)`
   - Replace: `Setup + Ads Engagement ($1,000/month total: ads + consult)`

2. Replace the Phase 2 intro paragraph:
   - Find: `Phase 2 starts when Phase 1's foundation is in place. The work here either requires expertise you shouldn't have to learn (schema, GEO content engineering, technical SEO) or significant ongoing time you'd rather spend running the business.`
   - Replace: `Phase 2 starts when Phase 1's foundation is in place. The model is different from a traditional retainer: month 1 is concentrated setup work — Google Business Profile optimization, Google Local Services Ads and Google Search Ads campaign build, three Squarespace city landing pages, ad creative, and a complete handoff package — and months 2–6 shift to bi-weekly 30-minute check-ins, ad creative refreshes, monthly performance reviews, and additional landing pages built progressively. You run the ads day-to-day with the written playbook and curated training videos Hudle provides. Hudle is your on-call strategist, not your ad manager — that keeps the engagement at $1,000/month total (ads AND consult) instead of a typical $2k–$3k/month agency retainer.`

3. Replace the "What I do at $1,000/month" H2 heading text:
   - Find: `What I do at $1,000/month`
   - Replace: `What Hudle does in Phase 2`

4. Replace the three H3 subheads of the work breakdown:
   - Find: `SEO work` → Replace: `Month 1 — One-time setup (intensive)`
   - Find: `GEO work (the differentiator)` → Replace: `Month 1 — One-time setup (continued)`
   - Find: `Reporting and strategy` → Replace: `Months 2–6 — Ongoing engagement`

5. Replace the bullet items under "Month 1 — One-time setup (intensive)" (formerly SEO work). There are 4 bullets. Use `replaceAllText` on each old bullet text:

   - Find: `Build 9 unique city landing pages (Saratoga Springs first, then Eagle Mountain and Lehi, then P2 and P3 cities)`
     Replace: `Google Business Profile optimization — categories audit (primary + secondaries per Phase 1 guidance), photo geotagging review, services and description finalization`

   - Find: `Implement LocalBusiness and Service schema markup`
     Replace: `Google Local Services Ads (LSAs) setup — DOPL license and insurance verification, profile build, lead-targeting cities and services configured`

   - Find: `Citation building across 10+ additional directories`
     Replace: `Google Search Ads campaign build — keyword targeting (paver patio + city, etc.), ad copy, location targeting, conversion tracking, $1,000 new-advertiser credit activation if eligible`

   - Find: `Light link-building outreach (Utah Landscape Contractors Association, local home builders, HARO/Connectively)`
     Replace: `Three Squarespace city landing pages (P1 cities: Saratoga Springs, Eagle Mountain, Lehi) — designed for Google Ads quality score AND organic ranking`

6. Replace the 8 bullets under "Month 1 — One-time setup (continued)" (formerly GEO work):

   - Find: `Build 2 GEO-optimized blog posts per month — answer-engine-friendly format with direct 40-60 word summaries, FAQ schema, comparison tables, and explicit data citations`
     Replace: `Ad creative design — image and copy variants for LSAs and Search Ads, Utah County/hardscape-specific positioning`

   - Find: `Add FAQ schema (JSON-LD) to homepage FAQ section we built in Phase 1 — boosts AI citation rate by ~40%`
     Replace: `Client training materials — written ads-monitoring playbook (daily, weekly, monthly checklists) plus a curated YouTube tutorial playlist (Surfside PPC, Define Digital Academy, Ben Heath)`

   - Find: `Engineer city pages with both city-keyword H1 (SEO) AND "How to choose a [service] contractor in [city]" sections (GEO)`
     Replace: `Handoff documentation — login inventory, escalation rules, what-to-watch-for guide, when-to-pause guide, monthly reporting template`

   - Find: `Implement HowTo and Article schema on relevant blog posts`
     Replace: `FAQ schema (JSON-LD) on the Phase 1 homepage FAQ — light-touch GEO add that boosts AI citation rates`

   - Find: `Set up proper llms.txt at site root if Squarespace allows; otherwise document workaround`
     Replace: `GEO baseline audit — run the prompt set across ChatGPT, Perplexity, and Google AI Overviews, document where Aspen Stone shows up vs. competitors`

   - Find: `Strategic Quora answers to high-intent questions`
     Replace: `First strategic Quora answer + Reddit ghost-write to seed authority`

   - Find: `Ghost-write 2-3 deeper Reddit/Quora responses per month for you to post in your voice`
     Replace: `Bing Webmaster Tools and Google Search Console health check`

   - Find: `Monitor and respond to AI visibility audit findings — refresh content monthly based on what's being cited`
     Replace: `30-day kickoff call + dedicated Slack/text channel for questions during setup`

7. Replace the 3 bullets under "Months 2–6 — Ongoing engagement" (formerly Reporting and strategy):

   - Find: `Monthly performance report covering SEO KPIs AND GEO citation tracking`
     Replace: `Bi-weekly 30-minute check-in calls — ad performance review, creative tweaks, troubleshooting, strategic questions`

   - Find: `Monthly 60-minute strategy call`
     Replace: `Monthly performance report — leads, cost-per-lead, Map Pack rank, GBP calls, GEO citations, recommendations`

   - Find: `On-call advisor for anything that comes up`
     Replace: `Ad creative refresh every 4–6 weeks — new image/copy variants to fight ad fatigue and improve quality score`

8. After the third bullet ("Ad creative refresh every 4–6 weeks..."), insert 5 additional bulleted paragraphs with the same list style:

   - `Progressive city landing pages — Draper, Herriman, Highland (months 2–3); Cedar Hills, Spanish Fork, Mapleton (months 4–5)`
   - `One GEO-optimized blog post per month — direct-answer format, FAQ schema, supports both organic and AI citations`
   - `Continued Reddit/Quora ghost-writes — 2–3 deeper responses per month for you to post in your voice`
   - `Monthly GEO visibility audit and citation tracking`
   - `On-call advisor by text/email — you stay in the driver's seat on day-to-day ad management`

## Edit 7 — Phase 2 priorities by month — replace the four month callout boxes

Each of the four 1-cell callout-box tables (under "Phase 2 priorities by
month") gets its text body replaced. The first line of each is a bold "Month X"
heading inside the cell — preserve the bold styling on the first line and
update only the text.

Use `replaceAllText` on each unique distinguishing phrase, OR replace the
text inside each cell range.

Month 3 callout — replace entire cell text with:

```
Month 1 — Setup sprint
Audit and lock GBP categories (primary: Landscape designer; six secondaries; conditional Landscape architect if licensed). Build and submit Google Local Services Ads profile (requires DOPL + insurance — Aspen Stone qualifies). Build Google Search Ads campaign and activate $1,000 new-advertiser credit if eligible. Design ad creative (image + copy variants). Build three P1 city landing pages on Squarespace: Saratoga Springs, Eagle Mountain, Lehi. Deliver written ads-monitoring playbook + curated YouTube training playlist. Kickoff call + ongoing text/email channel opens.
```

Month 4 callout:

```
Month 2
Bi-weekly 30-min check-ins begin. First monthly performance report (leads, cost-per-lead, Map Pack rank, GEO citations). Begin P2 city landing pages: Draper and Herriman. First ad creative refresh based on what's converting. One GEO-optimized blog post: "What a Paver Patio Costs in Utah County: 2026 Pricing Guide."
```

Month 5 callout:

```
Months 3–4
Continue bi-weekly check-ins. Finish P2 city pages: Highland. Begin P3 city pages: Cedar Hills and Spanish Fork. Second ad creative refresh; expand search-keyword set if budget allows. GEO blog posts: "Pavers vs. Concrete in Utah's Freeze-Thaw Climate" and "How to Choose a Hardscape Contractor in Utah County." Strategic Quora answers + Reddit ghost-writes.
```

Month 6 callout:

```
Months 5–6
Finish P3 city pages: Mapleton. Third ad creative refresh. Mid-engagement performance review — what's working in ads, in landing pages, in GEO. Decide whether to expand ad budget, add Performance Max, or layer in retargeting based on results. Year-2 roadmap: which channels to keep, scale, or sunset.
```

## Edit 8 — Insert two new H1 sections before "The Nine-City Strategy"

Anchor: the existing H1 paragraph `The Nine-City Strategy`. Insert the
following content immediately BEFORE that H1. Apply the named styles indicated.

H1 — `Squarespace City Landing Page Strategy`

normal —
> City landing pages do double duty: they're the destinations for Google Ads
> (where ad quality score depends on landing-page relevance) AND they're the
> structure Google rewards for organic city-specific rankings. We build them
> on the existing Squarespace site — no platform migration.

H3 — `Build schedule`

normal —
> Month 1 — P1 cities (ad destinations): Saratoga Springs, Eagle Mountain, Lehi.

normal —
> Months 2–3 — P2 cities: Draper, Herriman, Highland.

normal —
> Months 4–5 — P3 cities: Cedar Hills, Spanish Fork, Mapleton.

H3 — `Page structure (applied to every city)`

bullets —
- Headline with city + service (e.g., "Paver Patio Installation in Lehi, UT").
- Two to four project photos from that city when available; nearest-city photos when not.
- One clear primary CTA — phone call or estimate form (not both competing for attention).
- Location-specific copy covering local context (soil, HOA quirks, climate, lot styles).
- Three to five FAQs in the GEO-friendly direct-answer format from Phase 1.
- Contact form, NAP block, and DOPL license # at the bottom.
- Each page is genuinely unique — Google penalizes near-duplicate templated city pages, and ad quality score does too.

H1 — `Ad Strategy`

normal —
> We run two ad products in parallel because they serve different intent.
> Hudle designs the campaigns and creative; you operate them day-to-day
> with the written playbook and curated YouTube training.

H3 — `Google Local Services Ads (LSAs)`

normal —
> Pay-per-lead (not per-click), shows above the Map Pack, and carries the
> Google Guaranteed badge. Requires DOPL license and insurance — Aspen Stone
> qualifies. This is the highest-trust placement on the result page for
> local service searches and should be the first product live.

H3 — `Google Search Ads`

normal —
> Targets high-intent keywords like "paver patio Lehi" and "hardscape
> contractor Saratoga Springs." If eligible, activate the $1,000
> new-advertiser credit visible in the GBP dashboard during month 1 to
> extend reach without spending the budget on it. Search Ads route traffic
> to the city landing pages we just built.

H3 — `Ad creative`

normal —
> Hudle designs image and copy variants tuned to the Utah County hardscape
> market — emphasizing the things that actually matter to local buyers
> (freeze-thaw durability, DOPL-licensed, real project photos, free
> estimates). Refreshed every 4–6 weeks to fight ad fatigue.

H3 — `Client handoff and operating model`

normal —
> You manage the ads operationally after month-1 setup. You get: a written
> monitoring playbook (daily, weekly, monthly checks), a curated YouTube
> tutorial playlist (recommend: Surfside PPC, Define Digital Academy, Ben
> Heath), and bi-weekly 30-minute check-in calls with Hudle for questions,
> troubleshooting, and strategic decisions. Hudle is NOT the ongoing ad
> manager — that keeps the engagement at $1,000/month total.

H3 — `Bi-weekly cadence (months 2–6)`

normal —
> Every other week: 30 minutes by phone or video. Topics: ad performance,
> what creative is winning, what budget shifts to make, lead quality,
> landing-page conversion, anything that came up. Between calls, async
> text/email for blockers.

For each insertion: do `insertText` to add the paragraph, then `updateParagraphStyle`
with the named style (`HEADING_1`, `HEADING_3`, `NORMAL_TEXT`). For bullet
groups, use `createParagraphBullets` with `BULLET_DISC_CIRCLE_SQUARE` or
whatever bullet preset the existing list paragraphs use (read it back via
`documents.get` first to match).

## Edit 9 — "What This Plan Intentionally Skips" — update the ads bullet

In the section heading H1 = `What This Plan Intentionally Skips (and Why)`:

1. H3 subhead replacement:
   - Find: `No Google Ads or paid lead spend`
   - Replace: `Why we ARE running ads (this used to be skipped)`

2. Body paragraph replacement (the paragraph immediately following that H3):
   - Find: `$1,000/month doesn't go far on paid ads in landscape. Organic + Map Pack + GEO gives durable, compounding leads. Revisit Google Local Services Ads in month 7+ if cash flow allows.`
   - Replace: `Earlier versions of this plan skipped paid ads. Two things changed: (1) Aspen Stone carries the DOPL license and insurance that qualify for Google Local Services Ads — the most efficient lead product Google offers, paid per lead, not per click; and (2) the $1,000 new-advertiser Google Ads credit visible in the GBP dashboard extends month-1 reach essentially for free. We've shifted ~$600–$700/month of the budget to ads and kept the rest for the Hudle consult instead of a full agency retainer.`

3. "No agency retainers" body paragraph:
   - Find: `Most local SEO agencies charge $1,500–$3,000/month and don't do GEO at all yet. You're getting integrated SEO + GEO + execution at $1,000/month because Hudle Consulting works lean and treats GEO as core, not an upsell.`
   - Replace: `Most local SEO agencies charge $1,500–$3,000/month and don't do GEO at all yet. This setup-plus-consult model gives you ad infrastructure + landing pages + GEO + bi-weekly strategy access at $1,000/month total — because Hudle hands you the keys to operate the ads, instead of running them on a retainer.`

## Edit 10 — Risks section — update two risks

In the section H1 = `Risks & Mitigations`:

1. Replace the "Risk: Competitor outspends with Google Ads" subhead AND body:
   - Find subhead: `Risk: Competitor outspends with Google Ads`
   - Replace subhead: `Risk: Ad spend gets wasted on low-quality leads`
   - Find body: `Ads compete with Map Pack but don't replace it, and have zero effect on GEO. Strong organic + Map Pack + AI presence is defensible regardless of competitor ad spend.`
   - Replace body: `LSAs and Search Ads both produce some unqualified contacts (price shoppers, out-of-area, DIYers). Mitigation: tight geo-targeting to the nine cities, lead-quality review every bi-weekly check-in, dispute unqualified LSA leads inside Google's window (they refund). Pause underperforming keywords monthly. The playbook tells you exactly when to escalate to Hudle vs. handle yourself.`

2. Soften the Squarespace risk body:
   - Find: `Squarespace is workable but not ideal for advanced schema and llms.txt. Document limitations during Phase 2; revisit WordPress migration only if organic plateaus after month 9-12.`
   - Replace: `Squarespace is workable for the city landing pages, FAQ section, and ads destinations we need — that's the bulk of the work. Advanced schema (beyond LocalBusiness and FAQ) and root-level llms.txt are harder; we treat those as nice-to-have, not core. Revisit a WordPress migration only if organic plateaus after month 9–12.`

---

## Sanity checks after all edits

1. Open the live Doc. Confirm Hudle header logo still appears on every page.
2. Cover page logo + orange/black accents still intact.
3. Callout boxes still rendered with their color fill.
4. Heading 1 / Heading 2 / Heading 3 styles match elsewhere in the doc.
5. Bullet lists in the new sections use the same bullet style as existing lists.
6. No duplicate sections — search for "Month 1 — Setup sprint" should return exactly one hit.
7. Search for "$23" — should return zero hits (Squarespace upgrade cost is gone).
8. Search for "Hudle Consulting Retainer" — should return zero hits (replaced by "Hudle Setup + Ads").

If any `replaceAllText` returns 0 occurrences, the user likely edited that
exact phrase since the v4 export. Read the surrounding region with
`documents.get` and fall back to range-based `deleteContentRange` +
`insertText` at the same start index. Do not skip the edit silently.

When done, post a single summary message listing each Edit 1–10 as applied
or skipped (with reason), so the user can spot-check.
