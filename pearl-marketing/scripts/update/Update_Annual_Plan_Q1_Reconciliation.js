/**
 * Update_Annual_Plan_Q1_Reconciliation.js
 *
 * Updates the Annual Marketing Plan with Q1 content actuals.
 * Run from: Google Doc "Pearl_MKTG_Annual Marketing Plan_Q12026_DRAFT"
 *           (Extensions → Apps Script → paste → Run)
 *
 * Appends a "Q1 Content Actuals" section after the Content Strategy section
 * and updates the FPS deliverable description with actual cadence data.
 */

function reconcileAnnualPlan() {
  const docId = "1v2kMWxcv_ogy6UT4lRUnp9M9EVCAPmdp0Y8dG1YtyG8";
  const doc = DocumentApp.openById(docId);
  const body = doc.getBody();

  // --- Styles ---
  const HEADING = {};
  HEADING[DocumentApp.Attribute.FONT_SIZE] = 14;
  HEADING[DocumentApp.Attribute.BOLD] = true;

  const SUBHEADING = {};
  SUBHEADING[DocumentApp.Attribute.FONT_SIZE] = 11;
  SUBHEADING[DocumentApp.Attribute.BOLD] = true;

  const NORMAL = {};
  NORMAL[DocumentApp.Attribute.FONT_SIZE] = 10;
  NORMAL[DocumentApp.Attribute.BOLD] = false;

  // --- 1. Update FPS description: "4/month" → actual cadence ---
  const bodyText = body.editAsText();
  const fpsOld = "4/month";
  const fpsNew = "4/month (actual Q1: ~2/month published, with review backlog)";
  const searchResult = body.findText(fpsOld);
  // Only update the first occurrence in the FPS row
  if (searchResult) {
    const element = searchResult.getElement();
    const start = searchResult.getStartOffset();
    const end = searchResult.getEndOffsetInclusive();
    element.deleteText(start, end);
    element.insertText(start, fpsNew);
  }

  // --- 2. Update B2B blog description ---
  const b2bOld = "1/month (ramp with AI)";
  const b2bNew = "1/month (actual Q1: 2 published in Jan-Feb, on track)";
  const b2bSearch = body.findText(b2bOld);
  if (b2bSearch) {
    const element = b2bSearch.getElement();
    const start = b2bSearch.getStartOffset();
    const end = b2bSearch.getEndOffsetInclusive();
    element.deleteText(start, end);
    element.insertText(start, b2bNew);
  }

  // --- 3. Append Q1 Content Actuals section ---
  body.appendParagraph("").setAttributes(NORMAL);
  body.appendHorizontalRule();

  const title = body.appendParagraph("Q1 Content Actuals — Mid-Quarter Update (March 4, 2026)");
  title.setAttributes(HEADING);

  // Overview
  body.appendParagraph(
    "This section documents what was actually published in Q1, including unplanned content " +
    "that emerged from the Pearl pillar series. Strategy doc references should be updated " +
    "to reflect these titles and the adjusted FPS publication cadence."
  ).setAttributes(NORMAL);

  // Published B2C — FPS
  body.appendParagraph("").setAttributes(NORMAL);
  body.appendParagraph("Published B2C Content — Front Page Sage").setAttributes(SUBHEADING);

  body.appendParagraph(
    "FPS delivery cadence in Q1 was slower than the planned 4/month (1/week). " +
    "Five pieces published through early March; five more in review pipeline. " +
    "Review bottleneck identified — FPS delivers weekly but internal review takes 1-2 weeks."
  ).setAttributes(NORMAL);

  const fpsList = [
    "Home Maintenance Cost: Annual Report 2026 (Jan 3) — Metrics",
    "Home Energy Audit Cost: 2026 Statistics (Jan 5) — Metrics",
    "Average Home Energy Use Per Day: 2026 Report (Jan 6) — Metrics",
    "Real Estate Buying Guide: How to Evaluate a Home (Feb 11) — How-to Guide",
    "Average Utility Bill Per Month: 2026 Statistics by State (Feb 25) — Metrics",
  ];
  fpsList.forEach(item => body.appendListItem(item).setAttributes(NORMAL));

  // Published B2C — Pearl Pillar Series
  body.appendParagraph("").setAttributes(NORMAL);
  body.appendParagraph("Published B2C Content — Pearl Pillar Series (Unplanned)").setAttributes(SUBHEADING);

  body.appendParagraph(
    "Marketing created a 5-part \"What Every Buyer Needs to Know\" series covering all five " +
    "Pearl SCORE pillars. This was not in the original Annual Plan but represents a significant " +
    "content investment. Consider formalizing this as a recurring series in the content model."
  ).setAttributes(NORMAL);

  const pillarList = [
    "What Every Buyer Needs to Know About Home Safety (Jan 7)",
    "What Every Buyer Should Know About Home Comfort (Jan 21)",
    "What Every Buyer Needs to Know About Operating Costs (Feb 4)",
    "Built to Last: How Resilience Scores Protect Your Home Investment (Feb 18)",
    "What Every Buyer Should Know About Home Energy (Mar 4)",
  ];
  pillarList.forEach(item => body.appendListItem(item).setAttributes(NORMAL));

  // Published B2B
  body.appendParagraph("").setAttributes(NORMAL);
  body.appendParagraph("Published B2B Content — Marketing + AI").setAttributes(SUBHEADING);

  body.appendParagraph(
    "Two of three planned Q1 B2B posts published. Titles differed from Content Calendar " +
    "plan — adapted to current messaging priorities rather than following planned topics."
  ).setAttributes(NORMAL);

  const b2bList = [
    "The Five Things Your Clients Can't See in Listing Photos (Jan 1) — Agent-focused",
    "America's 40-Year-Old Problem (Feb 6) — Aging housing stock angle",
  ];
  b2bList.forEach(item => body.appendListItem(item).setAttributes(NORMAL));

  body.appendParagraph(
    "Planned but not yet published: \"Pearl SCORE: What Agents Need to Know\" (reprioritized), " +
    "\"Spring Market Prep\" (scheduled Week 11)"
  ).setAttributes(NORMAL).editAsText().setItalic(true);

  // Key observations
  body.appendParagraph("").setAttributes(NORMAL);
  body.appendParagraph("Key Observations for Q2 Planning").setAttributes(SUBHEADING);

  const observations = [
    "FPS review bottleneck: 12 pieces delivered, only 5 published. Need faster internal review cycle or dedicated review time.",
    "Pearl pillar series was highly productive — 5 posts in 8 weeks with no external cost. Should be formalized in Annual Plan.",
    "B2B titles evolved from plan — actual topics were stronger. Allow flexibility in future calendars.",
    "FPS content types are primarily Metrics (data-driven) — good for SEO authority but not generating derivative social content as planned.",
    "Content Calendar needs restructuring: currently doesn't track Pearl-authored B2C content at all.",
  ];
  observations.forEach(item => body.appendListItem(item).setAttributes(NORMAL));

  Logger.log("Annual Plan reconciliation complete.");
  DocumentApp.getUi().alert("Annual Marketing Plan updated with Q1 content actuals.");
}
