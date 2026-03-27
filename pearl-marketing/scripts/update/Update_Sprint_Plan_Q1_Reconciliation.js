/**
 * Update_Sprint_Plan_Q1_Reconciliation.js
 *
 * Updates the 90-Day Sprint Plan with actual Q1 content progress.
 * Run from: Google Doc "Pearl_MKTG_90-Day Sprint Plan_Q12026_DRAFT"
 *           (Extensions → Apps Script → paste → Run)
 *
 * Appends a "Q1 Content Reconciliation" section at the end of the doc
 * showing planned vs. actual content deliverables.
 */

function reconcileSprintPlan() {
  const docId = "1hwIfV-5Rb0EHjVnq3bztcZRTDHq7y_8Uh1b-iRfOtHE";
  const doc = DocumentApp.openById(docId);
  const body = doc.getBody();

  // --- Styles ---
  const HEADING = {};
  HEADING[DocumentApp.Attribute.FONT_SIZE] = 14;
  HEADING[DocumentApp.Attribute.BOLD] = true;
  HEADING[DocumentApp.Attribute.FONT_FAMILY] = "Arial";

  const SUBHEADING = {};
  SUBHEADING[DocumentApp.Attribute.FONT_SIZE] = 11;
  SUBHEADING[DocumentApp.Attribute.BOLD] = true;
  SUBHEADING[DocumentApp.Attribute.FONT_FAMILY] = "Arial";

  const NORMAL = {};
  NORMAL[DocumentApp.Attribute.FONT_SIZE] = 10;
  NORMAL[DocumentApp.Attribute.BOLD] = false;
  NORMAL[DocumentApp.Attribute.FONT_FAMILY] = "Arial";

  const GREEN = {};
  GREEN[DocumentApp.Attribute.FOREGROUND_COLOR] = "#04b290";
  GREEN[DocumentApp.Attribute.BOLD] = true;

  const AMBER = {};
  AMBER[DocumentApp.Attribute.FOREGROUND_COLOR] = "#fcaf1f";
  AMBER[DocumentApp.Attribute.BOLD] = true;

  // --- Add reconciliation section ---
  body.appendParagraph("").setAttributes(NORMAL);
  body.appendHorizontalRule();

  const title = body.appendParagraph("Q1 Content Reconciliation — As of March 4, 2026");
  title.setAttributes(HEADING);

  const intro = body.appendParagraph(
    "This section tracks actual content deliverables against Q1 targets. " +
    "Added during mid-quarter reconciliation."
  );
  intro.setAttributes(NORMAL);
  intro.editAsText().setItalic(true);

  // --- B2C Blog (FPS) ---
  body.appendParagraph("").setAttributes(NORMAL);
  const b2cHeader = body.appendParagraph("B2C Blog Posts — Front Page Sage (Target: 12)");
  b2cHeader.setAttributes(SUBHEADING);

  const fpsPublished = [
    "✅ Home Maintenance Cost: Annual Report 2026 — Jan 3",
    "✅ Home Energy Audit Cost: 2026 Statistics — Jan 5",
    "✅ Average Home Energy Use Per Day: 2026 Report — Jan 6",
    "✅ Real Estate Buying Guide: How to Evaluate a Home — Feb 11",
    "✅ Average Utility Bill Per Month: 2026 Statistics by State — Feb 25",
  ];

  const fpsInProgress = [
    "🔄 The Best Home Energy Assessments of 2026 — In Review",
    "🔄 Why Is My Electric Bill So High: 2026 Analysis — Draft Sent",
    "🔄 First Time Home Buyer Statistics 2026 Report — Written",
    "🔄 Percentage of Homeowners by Age 2026 Statistics — Written",
    "🔄 The Top Energy Efficiency Consultants of 2026 — Draft Sent",
  ];

  const fpsPending = [
    "⬜ How Common Is Mold in Homes: 2026 Prevalence Study — Topic Pending",
    "⬜ Radon Levels by State: 2026 Risk Map and Rankings — Topic Pending",
  ];

  fpsPublished.forEach(item => body.appendListItem(item).setAttributes(NORMAL));
  fpsInProgress.forEach(item => body.appendListItem(item).setAttributes(NORMAL));
  fpsPending.forEach(item => body.appendListItem(item).setAttributes(NORMAL));

  const fpsSummary = body.appendParagraph("Status: 5 published, 5 in review, 2 pending approval (42% published)");
  fpsSummary.setAttributes(NORMAL);
  fpsSummary.editAsText().setAttributes(0, fpsSummary.getText().length - 1, AMBER);

  // --- B2C Blog (Pearl Pillar Series) ---
  body.appendParagraph("").setAttributes(NORMAL);
  const pillarHeader = body.appendParagraph("B2C Pillar Series — \"What Every Buyer Needs to Know\" (Pearl-authored)");
  pillarHeader.setAttributes(SUBHEADING);

  const pillarNote = body.appendParagraph(
    "Not in original Sprint Plan. Pearl created a 5-part educational series covering all five SCORE pillars. All published."
  );
  pillarNote.setAttributes(NORMAL);
  pillarNote.editAsText().setItalic(true);

  const pillarPosts = [
    "✅ What Every Buyer Needs to Know About Home Safety — Jan 7",
    "✅ What Every Buyer Should Know About Home Comfort — Jan 21",
    "✅ What Every Buyer Needs to Know About Operating Costs — Feb 4",
    "✅ Built to Last: How Resilience Scores Protect Your Home Investment — Feb 18",
    "✅ What Every Buyer Should Know About Home Energy — Mar 4",
  ];

  pillarPosts.forEach(item => body.appendListItem(item).setAttributes(NORMAL));

  const pillarSummary = body.appendParagraph("Status: 5/5 published (100% complete)");
  pillarSummary.setAttributes(NORMAL);
  pillarSummary.editAsText().setAttributes(0, pillarSummary.getText().length - 1, GREEN);

  // --- B2B Blog ---
  body.appendParagraph("").setAttributes(NORMAL);
  const b2bHeader = body.appendParagraph("B2B Blog Posts — Marketing + AI (Target: 3)");
  b2bHeader.setAttributes(SUBHEADING);

  const b2bPosts = [
    "✅ The Five Things Your Clients Can't See in Listing Photos — Jan 1",
    "✅ America's 40-Year-Old Problem — Feb 6",
    "⬜ Q1 Article #3 — Planned for March (\"Spring Market Prep\" or similar)",
  ];

  b2bPosts.forEach(item => body.appendListItem(item).setAttributes(NORMAL));

  const b2bSummary = body.appendParagraph("Status: 2 of 3 published (67% — on track for Q1 target)");
  b2bSummary.setAttributes(NORMAL);
  b2bSummary.editAsText().setAttributes(0, b2bSummary.getText().length - 1, GREEN);

  // --- Pillar Content ---
  body.appendParagraph("").setAttributes(NORMAL);
  const pillarContentHeader = body.appendParagraph("Pillar Content — Flagship Pieces (Target: 3)");
  pillarContentHeader.setAttributes(SUBHEADING);

  const pillarContent = [
    "⬜ State of Home Performance 2026 — Pushed to April (aligned with April 2 data launch)",
    "⬜ 2026 Home Performance Consumer Survey — Research completed, entering analysis phase",
    "⬜ What Buyers Want (That Listings Don't Show) — Planned for Weeks 9-10 (Mar 10-14)",
  ];

  pillarContent.forEach(item => body.appendListItem(item).setAttributes(NORMAL));

  const pillarContentSummary = body.appendParagraph("Status: 0 of 3 published — State of Home Perf pushed to April; Consumer Survey in analysis");
  pillarContentSummary.setAttributes(NORMAL);
  pillarContentSummary.editAsText().setAttributes(0, pillarContentSummary.getText().length - 1, AMBER);

  // --- Summary table ---
  body.appendParagraph("").setAttributes(NORMAL);
  const summaryHeader = body.appendParagraph("Content Scorecard — Q1 2026 (as of March 4)");
  summaryHeader.setAttributes(SUBHEADING);

  const table = body.appendTable([
    ["Deliverable", "Target", "Actual", "Status"],
    ["B2C blog — FPS", "12", "5 published / 5 in review / 2 pending", "🟡 42%"],
    ["B2C blog — Pearl pillar series", "— (unplanned)", "5 published", "🟢 Bonus"],
    ["B2B blog", "3", "2 published / 1 remaining", "🟢 67%"],
    ["Pillar content", "3", "0 published / 1 in analysis / 2 pending", "🟡 Behind"],
    ["Total published posts", "15+", "12", "🟢 80%"],
  ]);

  // Style table header row
  const headerRow = table.getRow(0);
  for (let c = 0; c < headerRow.getNumCells(); c++) {
    headerRow.getCell(c).editAsText().setBold(true);
    headerRow.getCell(c).setBackgroundColor("#e5eaf4");
  }

  Logger.log("Sprint Plan reconciliation complete.");
  DocumentApp.getUi().alert("Sprint Plan updated with Q1 content reconciliation section.");
}
