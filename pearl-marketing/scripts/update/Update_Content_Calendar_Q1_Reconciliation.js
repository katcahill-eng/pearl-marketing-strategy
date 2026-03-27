/**
 * Update_Content_Calendar_Q1_Reconciliation.js
 *
 * Reconciles the Q1 2026 Content Calendar with actual published content.
 * Run from: Google Sheet "Pearl_MKTG_Content Calendar_Q12026 2"
 *           (Script Editor → paste → Run)
 *
 * Updates:
 *   1. FPS Blog #1-8 → actual published titles + URLs
 *   2. Adds Pearl "What Every Buyer" B2C pillar series
 *   3. Updates B2B blog titles to match published
 *   4. Sets status for published items
 */

function reconcileQ1Content() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Sheet1") || ss.getSheets()[0];
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  // Column indices (0-based)
  const COL_WEEK     = 0; // A
  const COL_DATE     = 1; // B
  const COL_AUDIENCE = 2; // C
  const COL_TYPE     = 3; // D
  const COL_TITLE    = 4; // E
  const COL_CHANNEL  = 5; // F
  const COL_OWNER    = 6; // G
  const COL_STATUS   = 7; // H
  const COL_NOTES    = 8; // I

  // --- 1. Map FPS generic titles to actual published titles ---
  const fpsUpdates = {
    "FPS Blog #1 - Review by Jan 17":  { title: "Home Energy Audit Cost: 2026 Statistics", status: "Published", notes: "FPS | Published Jan 5 | pearlscore.com/news/home-energy-audit-cost-2026-statistics" },
    "FPS Blog #2 - Review by Jan 24":  { title: "Average Home Energy Use Per Day: 2026 Report", status: "Published", notes: "FPS | Published Jan 6 | pearlscore.com/news/average-home-energy-use-per-day-2026-report" },
    "FPS Blog #3 - Review by Jan 31":  { title: "Home Maintenance Cost: Annual Report 2026", status: "Published", notes: "FPS | Published Jan 3 | pearlscore.com/news/home-maintenance-cost-annual-report-2026" },
    "FPS Blog #4 - Review by Feb 7":   { title: "The Best Home Energy Assessments of 2026", status: "In Review", notes: "FPS | Comparison blog | Implementation pending" },
    "FPS Blog #5 - Review by Feb 14":  { title: "Real Estate Buying Guide: How to Evaluate a Home Beyond the Surface", status: "Published", notes: "FPS | Published Feb 11 | pearlscore.com/news/real-estate-buying-guide-how-to-evaluate-a-home-beyond-the-surface" },
    "FPS Blog #6 - Review by Feb 21":  { title: "Why Is My Electric Bill So High: 2026 Analysis", status: "In Review", notes: "FPS | Draft sent to client" },
    "FPS Blog #7 - Review by Feb 28":  { title: "Average Utility Bill Per Month: 2026 Statistics by State", status: "Published", notes: "FPS | Published Feb 25 | pearlscore.com/news/average-utility-bill-per-month-2026-statistics-by-state" },
    "FPS Blog #8 - Review by Mar 7":   { title: "First Time Home Buyer Statistics 2026 Report", status: "In Review", notes: "FPS | Written, pending review" },
    "FPS Blog #9 - Review by Mar 14":  { title: "Percentage of Homeowners by Age 2026 Statistics", status: "In Review", notes: "FPS | Written, pending review" },
    "FPS Blog #10 - Review by Mar 21": { title: "The Top Energy Efficiency Consultants of 2026", status: "In Review", notes: "FPS | Draft sent to client" },
    "FPS Blog #11 - Review by Mar 28": { title: "How Common Is Mold in Homes: 2026 Prevalence Study", status: "Pending Approval", notes: "FPS | Topic pending approval" },
    "FPS Blog #12 - Review by Apr 4":  { title: "Radon Levels by State: 2026 Risk Map and Rankings", status: "Pending Approval", notes: "FPS | Topic pending approval" },
  };

  // --- 2. B2B blog title updates ---
  const b2bUpdates = {
    "Pearl SCORE: What Agents Need to Know": { title: "The Five Things Your Clients Can't See in Listing Photos", status: "Published", notes: "Published Jan 1 | pearlscore.com/news/industries/blogs" },
    "How Pearl Puts Home Performance Conversations on Rails": { title: "America's 40-Year-Old Problem", status: "Published", notes: "Published Feb 6 | pearlscore.com/news/industries/blogs" },
  };

  let updatedCount = 0;

  // Process existing rows
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const title = (row[COL_TITLE] || "").toString().trim();
    const rowNum = i + 1; // 1-based for sheet

    // Update FPS entries
    if (fpsUpdates[title]) {
      const update = fpsUpdates[title];
      sheet.getRange(rowNum, COL_TITLE + 1).setValue(update.title);
      sheet.getRange(rowNum, COL_STATUS + 1).setValue(update.status);
      sheet.getRange(rowNum, COL_NOTES + 1).setValue(update.notes);
      updatedCount++;
    }

    // Update B2B entries
    if (b2bUpdates[title]) {
      const update = b2bUpdates[title];
      sheet.getRange(rowNum, COL_TITLE + 1).setValue(update.title);
      sheet.getRange(rowNum, COL_STATUS + 1).setValue(update.status);
      sheet.getRange(rowNum, COL_NOTES + 1).setValue(update.notes);
      updatedCount++;
    }
  }

  // --- 3. Add Pearl B2C pillar series (new rows) ---
  const pearlPillarSeries = [
    { week: "",  date: "Jan 7",    audience: "B2C", type: "Blog (Pillar)", title: "What Every Buyer Needs to Know About Home Safety",             channel: "Website", owner: "Marketing", status: "Published", notes: "Pearl pillar series #1 — Safety | pearlscore.com/news" },
    { week: "",  date: "Jan 21",   audience: "B2C", type: "Blog (Pillar)", title: "What Every Buyer Should Know About Home Comfort",              channel: "Website", owner: "Marketing", status: "Published", notes: "Pearl pillar series #2 — Comfort | pearlscore.com/news" },
    { week: "",  date: "Feb 4",    audience: "B2C", type: "Blog (Pillar)", title: "What Every Buyer Needs to Know About Operating Costs",         channel: "Website", owner: "Marketing", status: "Published", notes: "Pearl pillar series #3 — Operations | pearlscore.com/news" },
    { week: "",  date: "Feb 18",   audience: "B2C", type: "Blog (Pillar)", title: "Built to Last: How Resilience Scores Protect Your Home Investment", channel: "Website", owner: "Marketing", status: "Published", notes: "Pearl pillar series #4 — Resilience | pearlscore.com/news" },
    { week: "",  date: "Mar 4",    audience: "B2C", type: "Blog (Pillar)", title: "What Every Buyer Should Know About Home Energy",               channel: "Website", owner: "Marketing", status: "Published", notes: "Pearl pillar series #5 — Energy | pearlscore.com/news" },
  ];

  // Find last row
  const lastRow = sheet.getLastRow();

  // Add a blank row separator
  sheet.getRange(lastRow + 1, 1).setValue("");

  // Add header for pillar series
  sheet.getRange(lastRow + 2, COL_TITLE + 1).setValue("── Pearl B2C Pillar Series (added during reconciliation) ──");
  sheet.getRange(lastRow + 2, COL_STATUS + 1).setValue("");

  // Add each pillar post
  pearlPillarSeries.forEach((post, idx) => {
    const row = lastRow + 3 + idx;
    sheet.getRange(row, COL_WEEK + 1).setValue(post.week);
    sheet.getRange(row, COL_DATE + 1).setValue(post.date);
    sheet.getRange(row, COL_AUDIENCE + 1).setValue(post.audience);
    sheet.getRange(row, COL_TYPE + 1).setValue(post.type);
    sheet.getRange(row, COL_TITLE + 1).setValue(post.title);
    sheet.getRange(row, COL_CHANNEL + 1).setValue(post.channel);
    sheet.getRange(row, COL_OWNER + 1).setValue(post.owner);
    sheet.getRange(row, COL_STATUS + 1).setValue(post.status);
    sheet.getRange(row, COL_NOTES + 1).setValue(post.notes);
  });

  updatedCount += pearlPillarSeries.length;

  Logger.log(`Reconciliation complete: ${updatedCount} items updated/added.`);
  SpreadsheetApp.getUi().alert(`Content Calendar reconciled.\n\n${updatedCount} items updated or added.\n\nFPS blog titles filled in, B2B titles updated, Pearl pillar series added.`);
}
