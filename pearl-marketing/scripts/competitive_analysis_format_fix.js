/**
 * Updates Competitive Analysis content with Pearl template format
 * Run: updateCompetitiveAnalysisContent()
 */
function updateCompetitiveAnalysisContent() {
  var doc = DocumentApp.openById('135XmaoOKqgkhS1viMItEThITQp3Ozod1pqeKI2jx6pQ');
  var body = doc.getBody();
  body.clear();

  // Colors matching Annual Plan template
  var navyBlue = '#1a4480';
  var black = '#000000';

  // 1. METADATA TABLE FIRST (no title above)
  var metaTable = body.appendTable([
    ['Document', 'Status', 'Updated'],
    ['Competitive Landscape Analysis', 'Draft', 'January 2026']
  ]);
  styleTableHeader(metaTable, navyBlue);

  // 2. DOCUMENT TITLE (after metadata table)
  var title = body.appendParagraph('Pearl Competitive Landscape Analysis');
  title.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  title.editAsText().setFontSize(26).setForegroundColor(navyBlue);

  // EXECUTIVE SUMMARY - navy heading
  var h1 = body.appendParagraph('Executive Summary');
  h1.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  h1.editAsText().setFontSize(14).setForegroundColor(navyBlue);

  // Body text - BLACK
  addParagraph(body, 'Pearl is the only solution covering all 5 pillars (Safety, Comfort, Operations, Resilience, Energy) for existing homes. Most competitors focus on 1-2 pillars.');
  addParagraph(body, 'Strategic Opportunity: Embed Pearl\'s SCORE across the home assessment ecosystem through partnerships—not just head-to-head competition.');
  var keyInsight = addParagraph(body, 'Key Insight: Zillow removed First Street climate data (Dec 2025) due to industry pressure. Redfin is keeping it. Immediate partnership opportunity.');
  keyInsight.setBold(true);

  // PEARL'S 5 PILLARS - navy heading
  var h2 = body.appendParagraph('Pearl\'s 5 Pillars vs. Competition');
  h2.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  h2.editAsText().setFontSize(14).setForegroundColor(navyBlue);

  var pillarTable = body.appendTable([
    ['Pillar', 'Who Covers It', 'Gap for Pearl'],
    ['Safety', 'Smart home platforms (limited)', 'Most ignore--Pearl opportunity'],
    ['Comfort', 'Nest, Ecobee (HVAC only)', 'Narrow focus'],
    ['Operations', 'HomeZada, Kukun', 'Tracking/scoring, not comprehensive'],
    ['Resilience', 'First Street, Redfin', 'Climate risk only'],
    ['Energy', 'HERS, ENERGY STAR, Nest', 'Crowded; new construction bias']
  ]);
  styleTableHeader(pillarTable, navyBlue);

  var diff = addParagraph(body, 'Pearl\'s Differentiator: Only standardized score covering all 5 pillars for existing homes.');
  diff.setBold(true);

  // COMPETITIVE LANDSCAPE BY CATEGORY - navy heading
  var h3 = body.appendParagraph('Competitive Landscape by Category');
  h3.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  h3.editAsText().setFontSize(14).setForegroundColor(navyBlue);

  // Real Estate Platforms - navy sub-heading
  var sub1 = body.appendParagraph('Real Estate Platforms');
  sub1.editAsText().setFontSize(12).setForegroundColor(navyBlue);

  var reTable = body.appendTable([
    ['Company', 'Users', 'Pillars', 'Notes'],
    ['Zillow', '45M+', '0/5', 'Removed climate data Dec 2025'],
    ['Redfin', '30M+', 'Resilience', 'Keeping climate data—partnership candidate'],
    ['Realtor.com', '25M+', '0/5', 'NAR platform, no performance data']
  ]);
  styleTableHeader(reTable, navyBlue);

  // Climate/Risk Assessment - navy sub-heading
  var sub2 = body.appendParagraph('Climate/Risk Assessment');
  sub2.editAsText().setFontSize(12).setForegroundColor(navyBlue);

  var climateTable = body.appendTable([
    ['Company', 'Focus', 'Users', 'Notes'],
    ['First Street', 'Flood, fire, wind, heat', '~49 enterprise', 'B2B only; $46M Series A (July 2024)'],
    ['ClimateCheck', 'Property climate risk', '160M properties', 'B2B (lenders, insurers); RPR partnership']
  ]);
  styleTableHeader(climateTable, navyBlue);

  // Energy Efficiency - navy sub-heading
  var sub3 = body.appendParagraph('Energy Efficiency');
  sub3.editAsText().setFontSize(12).setForegroundColor(navyBlue);

  var energyTable = body.appendTable([
    ['Company', 'Focus', 'Users', 'Notes'],
    ['RESNET/HERS', 'HERS Index ratings', 'Industry std', 'Primarily new construction'],
    ['ENERGY STAR', 'New home certification', 'Govt program', 'Government program'],
    ['Sense', 'Real-time monitoring', '3.7M meters', 'PIVOTING: Exiting consumer Dec 2025; utility B2B'],
    ['Ecobee/Nest', 'Smart thermostats', '36M+ US', 'Google Nest dominates smart home']
  ]);
  styleTableHeader(energyTable, navyBlue);

  // Home Management - navy sub-heading
  var sub4 = body.appendParagraph('Home Management');
  sub4.editAsText().setFontSize(12).setForegroundColor(navyBlue);

  var homeTable = body.appendTable([
    ['Company', 'Focus', 'Pillars', 'Notes'],
    ['HomeZada', 'Inventory, maintenance, finances', 'Operations', 'Free-$99/yr; user count unknown'],
    ['Centriq', 'Appliance manuals, reminders', 'N/A', 'SHUT DOWN Jan 31, 2025']
  ]);
  styleTableHeader(homeTable, navyBlue);

  // Smart Home Platforms - navy sub-heading
  var sub5 = body.appendParagraph('Smart Home Platforms');
  sub5.editAsText().setFontSize(12).setForegroundColor(navyBlue);

  var smartTable = body.appendTable([
    ['Company', 'Users', 'Pillars', 'Notes'],
    ['Google Home/Nest', '140M devices, 36M US', 'Safety + Ops + Energy', 'Could add performance scoring anytime'],
    ['Apple Home', '50M+', 'Safety + Ops', 'Device ecosystem; less data focus'],
    ['Samsung SmartThings', '70M+', 'Safety + Ops + Energy', 'Broad compatibility']
  ]);
  styleTableHeader(smartTable, navyBlue);

  // Property Condition & Valuation - navy sub-heading (NEW SECTION)
  var sub6 = body.appendParagraph('Property Condition & Valuation');
  sub6.editAsText().setFontSize(12).setForegroundColor(navyBlue);

  var valuationTable = body.appendTable([
    ['Company', 'Focus', 'Target', 'Notes'],
    ['Kukun (PICO Score)', 'Property condition scoring', 'Homeowners (free), Lenders (API)', 'HIGHEST THREAT--user count unknown but aggressive'],
    ['Homebot', 'Home finance insights', 'Loan officers, RE agents', 'B2B; 75% open rate; distribution partner']
  ]);
  styleTableHeader(valuationTable, navyBlue);

  // Kukun Alert callout
  var kukunAlert = body.appendParagraph('Kukun Alert: PICO Score (500-850 scale) claims traditional estimates are off by $20K-$50K because they don\'t know condition. They ask homeowners about updates (roof, HVAC, kitchen) and calculate actual vs. neighborhood value. Free forever. This is the closest thing to Pearl\'s value proposition we\'ve seen.');
  kukunAlert.editAsText().setFontSize(11).setForegroundColor('#000000').setBold(true);

  // PARTNERSHIP OPPORTUNITIES - navy heading
  var h4 = body.appendParagraph('Partnership Opportunities');
  h4.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  h4.editAsText().setFontSize(14).setForegroundColor(navyBlue);

  // Tier 1
  var tier1 = body.appendParagraph('Tier 1: High Priority');
  tier1.editAsText().setFontSize(12).setForegroundColor(navyBlue);

  var t1Table = body.appendTable([
    ['Partner', 'Opportunity', 'Rationale'],
    ['Redfin', 'Embed Pearl SCORE', 'Aligned on transparency, differentiation from Zillow'],
    ['Zillow', 'Replace First Street data', 'They need credible performance data'],
    ['Realtor.com', 'NAR relationship', 'Existing Pearl-NAR partnership']
  ]);
  styleTableHeader(t1Table, navyBlue);

  // Tier 2
  var tier2 = body.appendParagraph('Tier 2: Complementary Data');
  tier2.editAsText().setFontSize(12).setForegroundColor(navyBlue);

  var t2Table = body.appendTable([
    ['Partner', 'Opportunity', 'Rationale'],
    ['First Street', 'Data partnership', 'B2B only (~49 customers); Resilience data'],
    ['Sense', 'Utility partnership', 'Pivoting to B2B; 3.7M smart meters'],
    ['Homebot', 'Distribution channel', '75% open rates; Pearl data enriches insights']
  ]);
  styleTableHeader(t2Table, navyBlue);

  // Tier 3
  var tier3 = body.appendParagraph('Tier 3: Home Management');
  tier3.editAsText().setFontSize(12).setForegroundColor(navyBlue);

  var t3Table = body.appendTable([
    ['Partner', 'Opportunity', 'Rationale'],
    ['HomeZada', 'Embed SCORE', 'Their users track value; Pearl adds performance'],
    ['Centriq', 'N/A', 'SHUT DOWN Jan 2025']
  ]);
  styleTableHeader(t3Table, navyBlue);

  // Tier 4
  var tier4 = body.appendParagraph('Tier 4: Contractor Ecosystem');
  tier4.editAsText().setFontSize(12).setForegroundColor(navyBlue);

  var t4Table = body.appendTable([
    ['Partner', 'Opportunity', 'Rationale'],
    ['Angi/Thumbtack', 'Post-improvement updates', 'Work triggers re-certification'],
    ['Houzz', 'Design + performance', 'Users see Pearl impact']
  ]);
  styleTableHeader(t4Table, navyBlue);

  // KEY INSIGHTS - navy heading
  var h5 = body.appendParagraph('Key Insights');
  h5.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  h5.editAsText().setFontSize(14).setForegroundColor(navyBlue);

  // Black bullet points
  addBullet(body, 'No direct competitor covers all 5 pillars for existing homes');
  addBullet(body, 'Zillow/First Street breakup creates immediate opening');
  addBullet(body, 'Energy is crowded; Resilience is hot--lead with 5-pillar story');
  addBullet(body, 'Consumer demand is real: 86% of buyers want climate-resilient features');
  addBullet(body, 'B2B opportunity: Lenders/insurers need property-level data; Pearl\'s 87M home registry is unique');
  addBullet(body, 'Kukun is closest competitor--PICO Score directly ties condition to value, but covers only Operations pillar');
  addBullet(body, 'Centriq shut down (Jan 2025)--one less Operations competitor');
  addBullet(body, 'Sense pivoting to B2B--exiting consumer hardware Dec 2025; reduced direct threat');

  // THREAT PRIORITIZATION - navy heading
  var hPriority = body.appendParagraph('Threat Prioritization by Scale');
  hPriority.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  hPriority.editAsText().setFontSize(14).setForegroundColor(navyBlue);

  var priorityTable = body.appendTable([
    ['Priority', 'Company', 'Users/Scale', 'Why'],
    ['HIGHEST', 'Kukun', 'Unknown (aggressive)', 'Direct competitor with free product + lender API'],
    ['HIGH', 'Google/Nest', '36M+ US users', 'Could add performance scoring anytime'],
    ['MEDIUM', 'First Street', '~49 enterprise', 'B2B only but could partner with portal'],
    ['LOWER', 'Homebot', 'B2B platform', 'Distribution partner, not competitor'],
    ['REMOVED', 'Centriq', 'N/A', 'Shut down Jan 2025'],
    ['REDUCED', 'Sense', '3.7M meters', 'Pivoting to utility B2B']
  ]);
  styleTableHeader(priorityTable, navyBlue);

  // CONSOLIDATION THREAT ANALYSIS - navy heading
  var hConsolidation = body.appendParagraph('Consolidation Threat Analysis');
  hConsolidation.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  hConsolidation.editAsText().setFontSize(14).setForegroundColor(navyBlue);

  var threatIntro = addParagraph(body, 'The Risk: While no single competitor covers all 5 pillars today, 2-3 companies merging could rapidly close Pearl\'s competitive gap. Speed to market with partnerships is critical.');
  threatIntro.setBold(true);

  // Tier 1 Threats
  var tier1Threat = body.appendParagraph('Tier 1: Existential Threats');
  tier1Threat.editAsText().setFontSize(12).setForegroundColor('#cc0000');

  var threat1Table = body.appendTable([
    ['Potential Merger', 'Combined Pillars', 'Why It\'s Dangerous'],
    ['Kukun + First Street', 'Operations + Resilience (2/5)', 'Scoring methodology + climate risk. Both target lenders.'],
    ['Zillow + Kukun', 'Operations (1/5) + 45M users', 'Massive distribution + property scoring. Zillow needs data.'],
    ['Redfin + Kukun', 'Operations + Resilience (2/5)', 'Transparency-aligned + scoring. Natural fit.']
  ]);
  styleTableHeader(threat1Table, '#cc0000');

  // Tier 2 Threats
  var tier2Threat = body.appendParagraph('Tier 2: Significant Threats');
  tier2Threat.editAsText().setFontSize(12).setForegroundColor('#e67300');

  var threat2Table = body.appendTable([
    ['Potential Merger', 'Combined Pillars', 'Why It\'s Dangerous'],
    ['Google/Nest + First Street', 'Safety + Comfort + Energy + Resilience (4/5)', 'Smart home giant + climate risk. Only missing Operations.'],
    ['Kukun + Sense', 'Operations + Energy (2/5)', 'Condition scoring + real-time energy. Strong B2B play.'],
    ['Zillow + First Street (reconcile)', 'Resilience (1/5) + 45M users', 'If they patch things up, Pearl loses the opening.']
  ]);
  styleTableHeader(threat2Table, '#e67300');

  // Tier 3 Threats
  var tier3Threat = body.appendParagraph('Tier 3: Category Consolidation');
  tier3Threat.editAsText().setFontSize(12).setForegroundColor('#999900');

  var threat3Table = body.appendTable([
    ['Potential Merger', 'Combined Pillars', 'Impact'],
    ['First Street + ClimateCheck', 'Resilience monopoly', 'Single source for climate risk data'],
    ['HomeZada + Centriq', 'N/A', 'Centriq shut down Jan 2025'],
    ['Sense + Emporia', 'N/A', 'Sense pivoting to utility B2B; reduced threat']
  ]);
  styleTableHeader(threat3Table, '#999900');

  // Defensive Strategy
  var defenseTitle = body.appendParagraph('Defensive Strategy');
  defenseTitle.editAsText().setFontSize(12).setForegroundColor(navyBlue);
  addBullet(body, 'Move fast on Tier 1 partnerships -- Lock in Redfin, Zillow, or First Street before competitors do');
  addBullet(body, 'Monitor M&A activity -- Track funding rounds and acquisition rumors');
  addBullet(body, 'Build switching costs -- Deep integrations make Pearl harder to replace');
  addBullet(body, 'Emphasize 5-pillar story -- Even merged competitors need time to integrate; Pearl is ready now');

  // MARKET CONTEXT - navy heading
  var h6 = body.appendParagraph('Market Context');
  h6.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  h6.editAsText().setFontSize(14).setForegroundColor(navyBlue);

  addParagraph(body, 'Consumer Trends:');
  addBullet(body, '86% of buyers want at least one climate-resilient feature (Zillow)');
  addBullet(body, '80%+ consider climate risk in purchase decisions');
  addBullet(body, '67% say low disaster risk is non-negotiable (Redfin)');

  addParagraph(body, 'Industry Shifts:');
  addBullet(body, 'Zillow removed climate data under industry pressure (Dec 2025)');
  addBullet(body, 'Redfin committed to keeping climate data');
  addBullet(body, 'Real estate industry pushing back on transparency');

  // NOTE ON DATA SOURCES - navy heading
  var h7 = body.appendParagraph('Note on Data Sources');
  h7.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  h7.editAsText().setFontSize(14).setForegroundColor(navyBlue);

  addParagraph(body, 'Analysis built from Pearl Product Vision documents (Spring 2025, July 2025) and current market research.');

  doc.saveAndClose();
  Logger.log('Document updated: ' + doc.getUrl());
}

// Helper: Add paragraph with black text, 11pt
function addParagraph(body, text) {
  var p = body.appendParagraph(text);
  p.editAsText().setFontSize(11).setForegroundColor('#000000');
  return p;
}

// Helper: Add bullet with black text, 11pt
function addBullet(body, text) {
  var item = body.appendListItem(text);
  item.editAsText().setFontSize(11).setForegroundColor('#000000');
  return item;
}

// Helper: Style table with navy header row, black body text
function styleTableHeader(table, headerColor) {
  var numRows = table.getNumRows();
  for (var r = 0; r < numRows; r++) {
    var row = table.getRow(r);
    var numCells = row.getNumCells();
    for (var c = 0; c < numCells; c++) {
      var cell = row.getCell(c);
      if (r == 0) {
        cell.setBackgroundColor(headerColor);
        cell.editAsText().setFontSize(10).setBold(true).setForegroundColor('#ffffff');
      } else {
        cell.editAsText().setFontSize(10).setBold(false).setForegroundColor('#000000');
        cell.setBackgroundColor(null);
      }
    }
  }
}
