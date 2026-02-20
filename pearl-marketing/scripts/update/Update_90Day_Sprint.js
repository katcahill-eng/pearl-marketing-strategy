// ============================================================
// RESOURCE LINKS - Supporting documents for Q1 Sprint
// ============================================================
var RESOURCE_LINKS = {
  annualPlan: 'https://docs.google.com/document/d/1v2kMWxcv_ogy6UT4lRUnp9M9EVCAPmdp0Y8dG1YtyG8/edit',
  contentCalendar: 'https://docs.google.com/spreadsheets/d/1BAUNAuyRNbdDXr6by_1MPOWUOo_4sRY3kJTNkPI4ZyY/edit',
  prTracker: 'https://docs.google.com/spreadsheets/d/1hstp9REbLnlSzrgpeYXgpxZePuaPEnqneWhqUBIXlu8/edit',
  surgeTracker: 'https://docs.google.com/spreadsheets/d/1Nnubv4ryBnn8jeLJ1hVAWV-jh_cfx4Pyur-YGRG18Xw/edit',
  partnershipWorksheet: 'https://docs.google.com/spreadsheets/d/1A3jGfKxYOhc4nMhoWTLcUURvWVRjpSoz4E01lGPm6PM/edit',
  conferenceWorksheet: 'https://docs.google.com/spreadsheets/d/1auiKdZPCEDM5TFsXrBpMBNpfrahQoKBFq49KFgPVzjo/edit',
  prMessagingGuide: 'https://docs.google.com/document/d/11YEVBkfKDvG71JGKyKg67KaqM9oiaj2GdVCM96rsbss/edit?usp=sharing'
};
// ============================================================

function update90DaySprint() {
  var doc = DocumentApp.openById('1hwIfV-5Rb0EHjVnq3bztcZRTDHq7y_8Uh1b-iRfOtHE');
  var body = doc.getBody();

  // Clear all content except the last paragraph (Google Docs requirement)
  while (body.getNumChildren() > 1) {
    body.getChild(0).removeFromParent();
  }
  // Clear remaining paragraph and reset its formatting
  var lastPara = body.getChild(0);
  if (lastPara.getType() === DocumentApp.ElementType.LIST_ITEM) {
    // If it's a list item, add a clean paragraph first, then remove the list item
    body.appendParagraph('');
    body.removeChild(lastPara);
  } else {
    lastPara.asText().setText('');
  }

  var BLUE = '#003366';
  var BLACK = '#000000';
  var GRAY = '#e6e6e6';
  var LIGHT_BLUE = '#e6f3ff';  // B2B row background
  var LIGHT_GREEN = '#e6ffe6'; // B2C row background
  var ORANGE = '#cc6600';      // Available but not contracted

  // Standard table width (500px total for consistency)
  var TABLE_WIDTH = 500;

  styleHeaderTable(body.appendTable([
    ['Document', 'Status', 'Updated'],
    ['90-Day Sprint Plan', 'Draft', 'January 2026']
  ]), BLUE, BLACK);

  body.appendParagraph('Pearl Marketing 90-Day Sprint Plan').setHeading(DocumentApp.ParagraphHeading.HEADING1).setForegroundColor(BLUE);
  body.appendParagraph('January 15 - April 15, 2026').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);

  body.appendParagraph('What This Plan Achieves').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);
  body.appendParagraph('Establish Pearl as a visible authority in real estate ahead of Series B.').setForegroundColor(BLACK);

  // Supporting Documents Section
  body.appendParagraph('Supporting Documents').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);
  var resourcesTable = body.appendTable([
    ['Document', 'Purpose'],
    ['2026 Annual Marketing Plan', 'Full year strategy and budget'],
    ['Organic Content Calendar', 'Q1-Q4 organic content, pillar reference'],
    ['PR Tracker', 'Atkinson deliverables, media coverage, podcasts'],
    ['Surge Tracker', 'Paid campaigns, geo-fence, budget tracking'],
    ['Partnership Audit', 'Costs, benefits, marketing rights'],
    ['Conference Audit', 'Speaking/booth costs, event priorities'],
    ['PR Messaging Guide', 'Headlines, talking points for Atkinson PR']
  ]);
  resourcesTable.setColumnWidth(0, 240);
  resourcesTable.setColumnWidth(1, 260);
  styleResourcesTable(resourcesTable, BLUE, BLACK, RESOURCE_LINKS);

  body.appendParagraph('Campaign Types').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  var campaignTable = body.appendTable([
    ['Type', 'Q1 Campaigns', 'Cadence'],
    ['Always-On', 'LinkedIn ads, Social media, SEO/Content (Front Page Sage), PR outreach (Atkinson)', 'Continuous'],
    ['Surge', 'Campaign Sprint (report launch), Geo-fence (Natl Home Perf Conf)', 'Around key moments']
  ]);
  campaignTable.setColumnWidth(0, 80);
  campaignTable.setColumnWidth(1, 310);
  campaignTable.setColumnWidth(2, 110);
  styleDataTable(campaignTable, BLUE, BLACK);

  body.appendParagraph('Q1 Objectives').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  var objectivesTable = body.appendTable([
    ['Objective', 'Target'],
    ['Pillar content pieces with media coverage', '3'],
    ['Major industry speaking events', '2+'],
    ['Podcast appearances secured', '12-18'],
    ['Derivatives per pillar (emails, infographics, ads)', '8-10'],
    ['Geo-fence campaigns (of 10 annual)', '1']
  ]);
  objectivesTable.setColumnWidth(0, 400);
  objectivesTable.setColumnWidth(1, 100);
  styleDataTable(objectivesTable, BLUE, BLACK);

  body.appendParagraph('Pillar Content (Flagship Pieces)').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);
  body.appendParagraph('Each pillar generates 20+ derivative pieces: email sequences, infographics, ad creatives, video clips. Blog posts and social media are tracked separately below.').setForegroundColor(BLACK);
  var pillarTable = body.appendTable([
    ['Pillar', 'Launch', 'Owner', 'Audience'],
    ['State of Home Performance 2026', 'Weeks 3-4 (Feb)', 'Marketing', 'B2B + B2C'],
    ['2026 Home Performance Consumer Survey', 'Mar', 'Marketing', 'B2C'],
    ['What Buyers Want (Listings Don\'t Show)', 'Weeks 9-10 (Mar)', 'Marketing', 'B2C']
  ]);
  pillarTable.setColumnWidth(0, 230);
  pillarTable.setColumnWidth(1, 100);
  pillarTable.setColumnWidth(2, 90);
  pillarTable.setColumnWidth(3, 80);
  styleDataTable(pillarTable, BLUE, BLACK);

  body.appendParagraph('Target Audiences').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);
  var audienceTable = body.appendTable([
    ['Audience', 'Segment', 'Description'],
    ['Primary', 'B2B', 'Real estate agents, brokers'],
    ['Primary', 'B2C', 'Home buyers']
  ]);
  audienceTable.setColumnWidth(0, 70);
  audienceTable.setColumnWidth(1, 70);
  audienceTable.setColumnWidth(2, 360);
  styleDataTable(audienceTable, BLUE, BLACK);

  body.appendParagraph('Q1 Budget (~$102,320)').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);
  var q1BudgetTable = body.appendTable([
    ['Category', 'Audience', 'Details', 'Budget'],
    ['LinkedIn Always-On', 'B2B', '12 wks × $3K', '$36,000'],
    ['Campaign Sprint', 'B2B', '2 wks × $7.5K', '$15,000'],
    ['Geo-fence: Inman Connect NYC', 'B2B', 'CANCELLED', '—'],
    ['Geo-fence: Natl Home Perf Conf', 'B2B', 'Apr 13 (2.8K attend)', '$16,320'],
    ['Atkinson (PR)', 'B2B', '3 months', '$13,500'],
    ['Front Page Sage (SEO)', 'B2C', '3 months', '$9,000'],
    ['Content Production', 'B2B+B2C', 'Report, video', '$12,500']
  ]);
  q1BudgetTable.setColumnWidth(0, 190);
  q1BudgetTable.setColumnWidth(1, 80);
  q1BudgetTable.setColumnWidth(2, 140);
  q1BudgetTable.setColumnWidth(3, 90);
  styleDataTable(q1BudgetTable, BLUE, BLACK);

  body.appendParagraph('Atkinson PR Services').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  body.appendParagraph('Compare base retainer vs. expanded proposal:').setForegroundColor(BLACK);
  var atkinsonCompareTable = body.appendTable([
    ['Deliverable', 'Base ($4,500/mo)', 'Expanded (+TBD)'],
    ['Media pitches', '20/month', '20/month'],
    ['Story concepts + pitch memos', '5/month', '5/month'],
    ['Media monitoring report', 'Monthly', 'Monthly'],
    ['Status meeting', 'Monthly', 'Monthly'],
    ['Press releases', 'Drafting only*', '2-3/mo on wire'],
    ['Podcast pitches', '—', '12/month'],
    ['Op-eds/commentaries', '—', '1/month'],
    ['Local TV/radio pitches', '—', 'Ongoing'],
    ['Exec strategy calls', '—', 'Monthly']
  ]);
  atkinsonCompareTable.setColumnWidth(0, 200);
  atkinsonCompareTable.setColumnWidth(1, 150);
  atkinsonCompareTable.setColumnWidth(2, 150);
  styleAtkinsonCompareTable(atkinsonCompareTable, BLUE, ORANGE, BLACK);
  body.appendParagraph('*Wire distribution costs billed separately').setForegroundColor(BLACK).setItalic(true);
  body.appendParagraph('Decision needed: proceed with expanded scope or stay with base retainer?').setForegroundColor(ORANGE).setItalic(true);

  body.appendParagraph('Q1 Events (by date)').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);
  body.appendParagraph('1 of 10 annual geo-fence campaigns occurs in Q1').setForegroundColor(BLACK);
  var q1EventsTable = body.appendTable([
    ['Event', 'Date', 'Attendance', 'Marketing Support'],
    ['Inman Connect NYC', 'Feb 3', '2,000-4,000', 'Insider dinner support (BD)'],
    ['ICE Experience', 'Mar 16', '3,000+', 'Social only'],
    ['Natl Home Perf Conf', 'Apr 13', '2,800', 'Geo-fence + speaking']
  ]);
  q1EventsTable.setColumnWidth(0, 160);
  q1EventsTable.setColumnWidth(1, 70);
  q1EventsTable.setColumnWidth(2, 90);
  q1EventsTable.setColumnWidth(3, 180);
  styleDataTable(q1EventsTable, BLUE, BLACK);

  body.appendParagraph('90-Day Goals').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);
  var goalsTable = body.appendTable([
    ['Goal', 'Metric', 'Target', 'Audience'],
    ['Media', 'Tier-1 placements', '2+', 'B2B+B2C'],
    ['Media', 'Total mentions', '15+', 'B2B+B2C'],
    ['Podcasts', 'Booked', '12-18', 'B2B+B2C'],
    ['Speaking', 'Events', '2+', 'B2B'],
    ['Content', 'Pillar pieces', '3', 'B2B+B2C'],
    ['Content', 'B2B blog posts', '3 (ramp with AI)', 'B2B'],
    ['Content', 'B2C blog posts (Front Page Sage)', '12', 'B2C'],
    ['Content', 'Derivatives (emails, infographics, ads)', '20+', 'B2B+B2C'],
    ['Paid', 'Geo-fence campaigns', '1', 'B2B'],
    ['Foundation', 'Report downloads', '500+', 'B2C']
  ]);
  goalsTable.setColumnWidth(0, 80);
  goalsTable.setColumnWidth(1, 200);
  goalsTable.setColumnWidth(2, 120);
  goalsTable.setColumnWidth(3, 100);
  styleDataTable(goalsTable, BLUE, BLACK);

  body.appendParagraph('Social Media Strategy').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);

  body.appendParagraph('B2B Channels (Real Estate Agents)').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  var b2bTable = body.appendTable([
    ['Platform', 'Baseline', 'During Surges', 'Owner'],
    ['LinkedIn', '3x/week', 'Daily', 'Marketing'],
    ['X (Twitter)', '3-5x/week', '5-7x/week', 'Marketing']
  ]);
  b2bTable.setColumnWidth(0, 80);
  b2bTable.setColumnWidth(1, 90);
  b2bTable.setColumnWidth(2, 120);
  b2bTable.setColumnWidth(3, 210);
  styleDataTable(b2bTable, BLUE, BLACK);

  body.appendParagraph('B2C Channels (Homeowners)').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  var b2cTable = body.appendTable([
    ['Platform', 'Baseline', 'During Surges', 'Owner'],
    ['Meta (Facebook)', '2-3x/week', '4-5x/week', 'Marketing'],
    ['Blue Sky', '2-3x/week', '4-5x/week', 'Marketing']
  ]);
  b2cTable.setColumnWidth(0, 100);
  b2cTable.setColumnWidth(1, 90);
  b2cTable.setColumnWidth(2, 120);
  b2cTable.setColumnWidth(3, 190);
  styleDataTable(b2cTable, BLUE, BLACK);

  body.appendParagraph('Recruitment Only (Pearl Culture)').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  var recruitTable = body.appendTable([
    ['Platform', 'Frequency', 'Content Focus', 'Owner'],
    ['Instagram', '2-3x/week', 'Team, culture, careers', 'Marketing/HR']
  ]);
  recruitTable.setColumnWidth(0, 80);
  recruitTable.setColumnWidth(1, 100);
  recruitTable.setColumnWidth(2, 180);
  recruitTable.setColumnWidth(3, 140);
  styleDataTable(recruitTable, BLUE, BLACK);
  body.appendParagraph('Note: Instagram is NOT used for B2B or B2C marketing—recruitment and employer branding only.').setForegroundColor(BLACK);
  
  body.appendParagraph('Week-by-Week Execution').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);
  body.appendParagraph('Color key: Light blue = B2B | Light green = B2C | White = Both/Culture').setForegroundColor(BLACK);

  body.appendParagraph('WEEKS 1-2: Foundation (Jan 15-28)').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  var week12Table = body.appendTable([
    ['Audience', 'Task', 'Owner', 'Deliverable'],
    ['Both', 'Complete partnership audit', 'Marketing + Owners', 'Confirmed Q1 partnership usage'],
    ['Both', 'Complete conference audit', 'Marketing + BD', 'Confirmed Q1 event priorities'],
    ['B2B', 'Finalize report', 'Marketing + AI', 'Draft complete'],
    ['B2B', 'Brief Atkinson on Q1 priorities', 'Marketing', 'Kick-off call'],
    ['B2B', 'Speaker kit', 'Marketing + AI', 'Messaging doc'],
    ['Both', 'Logo audit', 'Marketing', 'Guidelines confirmed'],
    ['B2B', 'Confirm Inman Connect NYC attendance', 'Marketing + BD', 'Status confirmed'],
    ['Both', 'Media pitches (10)', 'Atkinson', 'Targeted outreach'],
    ['Both', 'Story concepts (2-3)', 'Atkinson', 'Pitch memos'],
    ['B2C', 'Blog posts (2)', 'Front Page Sage', 'SEO/AI-optimized'],
    ['B2B', 'LinkedIn posts', 'Marketing', '6 posts'],
    ['B2B', 'X posts', 'Marketing', '6-10 posts'],
    ['B2C', 'Meta posts', 'Marketing', '4-6 posts'],
    ['B2C', 'Blue Sky posts', 'Marketing', '4-6 posts'],
    ['Culture', 'Instagram posts', 'Marketing/HR', '4-6 posts']
  ]);
  week12Table.setColumnWidth(0, 70);
  week12Table.setColumnWidth(1, 170);
  week12Table.setColumnWidth(2, 140);
  week12Table.setColumnWidth(3, 120);
  styleAudienceTable(week12Table, BLUE, BLACK, LIGHT_BLUE, LIGHT_GREEN);
  body.appendParagraph('Milestone: Foundation ready, Inman Connect NYC prep complete').setBold(true).setForegroundColor(BLACK);
  
  body.appendParagraph('WEEKS 3-4: Inman Connect NYC (Jan 29 - Feb 11)').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  body.appendParagraph('SURGE PERIOD: Daily posting on B2B channels during Inman Connect NYC').setForegroundColor(BLACK);
  var week34Table = body.appendTable([
    ['Audience', 'Task', 'Owner', 'Deliverable'],
    ['Both', 'Launch report', 'Marketing', 'Report live, gated'],
    ['B2B', 'Insider dinner support', 'Marketing', 'Collateral, social for BD event'],
    ['Both', 'Email blast', 'Marketing', 'Announcement'],
    ['Both', 'Event content', 'Founders', 'Photos, quotes'],
    ['Both', 'Media pitches (10)', 'Atkinson', 'Report launch push'],
    ['Both', 'Story concepts (2-3)', 'Atkinson', 'Pitch memos'],
    ['Both', 'Podcast pitches (6)', 'Atkinson', 'Initial outreach'],
    ['B2C', 'Blog posts (2)', 'Front Page Sage', 'SEO/AI-optimized'],
    ['B2B', 'Blog post (1)', 'Marketing + AI', 'Report companion piece'],
    ['B2B', 'LinkedIn posts - SURGE', 'Marketing', 'Daily (14+ posts)'],
    ['B2B', 'X posts - SURGE', 'Marketing', 'Daily (14+ posts)'],
    ['B2C', 'Meta posts', 'Marketing', '4-6 posts'],
    ['B2C', 'Blue Sky posts', 'Marketing', '4-6 posts'],
    ['Culture', 'Instagram posts', 'Marketing/HR', '4-6 posts']
  ]);
  week34Table.setColumnWidth(0, 70);
  week34Table.setColumnWidth(1, 170);
  week34Table.setColumnWidth(2, 140);
  week34Table.setColumnWidth(3, 120);
  styleAudienceTable(week34Table, BLUE, BLACK, LIGHT_BLUE, LIGHT_GREEN);
  body.appendParagraph('Milestone: Inman Connect NYC executed, report launched, media hits').setBold(true).setForegroundColor(BLACK);
  
  body.appendParagraph('WEEKS 5-6: Momentum (Feb 12-25)').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  var week56Table = body.appendTable([
    ['Audience', 'Task', 'Owner', 'Deliverable'],
    ['Both', 'Report derivatives: emails, infographics, ads', 'Marketing + AI', '8-10 pieces'],
    ['B2B', 'Retargeting', 'Marketing', 'Always-on'],
    ['B2B', 'Inman Connect NYC follow-up', 'Marketing', 'Lead nurture'],
    ['Both', 'Media pitches (10)', 'Atkinson', 'Continued outreach'],
    ['Both', 'Story concepts (2-3)', 'Atkinson', 'Pitch memos'],
    ['Both', 'Podcast pitches (6)', 'Atkinson', 'Ongoing outreach'],
    ['Both', 'Media monitoring report', 'Atkinson', 'Monthly summary'],
    ['B2C', 'Blog posts (2)', 'Front Page Sage', 'SEO/AI-optimized'],
    ['B2B', 'Blog post (1)', 'Marketing + AI', 'User-friendly agent content'],
    ['Both', 'Monthly performance report', 'Front Page Sage', 'Analytics review'],
    ['B2B', 'LinkedIn posts', 'Marketing', '6 posts'],
    ['B2B', 'X posts', 'Marketing', '6-10 posts'],
    ['B2C', 'Meta posts', 'Marketing', '4-6 posts'],
    ['B2C', 'Blue Sky posts', 'Marketing', '4-6 posts'],
    ['Culture', 'Instagram posts', 'Marketing/HR', '4-6 posts']
  ]);
  week56Table.setColumnWidth(0, 70);
  week56Table.setColumnWidth(1, 170);
  week56Table.setColumnWidth(2, 140);
  week56Table.setColumnWidth(3, 120);
  styleAudienceTable(week56Table, BLUE, BLACK, LIGHT_BLUE, LIGHT_GREEN);
  body.appendParagraph('Milestone: Podcast pipeline started, content flowing').setBold(true).setForegroundColor(BLACK);
  
  body.appendParagraph('WEEKS 7-8: Content Engine (Feb 26 - Mar 11)').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  var week78Table = body.appendTable([
    ['Audience', 'Task', 'Owner', 'Deliverable'],
    ['B2C', 'Second pillar draft', 'Marketing + AI', 'Complete'],
    ['Both', 'Q2 calendar', 'Marketing + AI', 'Drafted'],
    ['B2B', 'Case study', 'Marketing + AI', '1 complete'],
    ['B2B', 'ICE Experience prep', 'Marketing', 'Collateral ready'],
    ['Both', 'Media pitches (10)', 'Atkinson', 'Continued outreach'],
    ['Both', 'Story concepts (2-3)', 'Atkinson', 'Pitch memos'],
    ['Both', 'Podcast pitches (6)', 'Atkinson', 'Ongoing outreach'],
    ['Both', 'Podcast bookings update', 'Atkinson', '4-6 confirmed'],
    ['B2C', 'Blog posts (2)', 'Front Page Sage', 'SEO/AI-optimized'],
    ['B2B', 'LinkedIn posts', 'Marketing', '6 posts'],
    ['B2B', 'X posts', 'Marketing', '6-10 posts'],
    ['B2C', 'Meta posts', 'Marketing', '4-6 posts'],
    ['B2C', 'Blue Sky posts', 'Marketing', '4-6 posts'],
    ['Culture', 'Instagram posts', 'Marketing/HR', '4-6 posts']
  ]);
  week78Table.setColumnWidth(0, 70);
  week78Table.setColumnWidth(1, 170);
  week78Table.setColumnWidth(2, 140);
  week78Table.setColumnWidth(3, 120);
  styleAudienceTable(week78Table, BLUE, BLACK, LIGHT_BLUE, LIGHT_GREEN);
  body.appendParagraph('Milestone: Content engine running, events prepped').setBold(true).setForegroundColor(BLACK);
  
  body.appendParagraph('WEEKS 9-10: Spring Prep (Mar 12-25)').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  body.appendParagraph('ICE Experience (Mar 16): Social coverage on B2B channels').setForegroundColor(BLACK);
  var week910Table = body.appendTable([
    ['Audience', 'Task', 'Owner', 'Deliverable'],
    ['B2C', 'Launch pillar 2', 'Marketing', 'Blog, social, email'],
    ['B2B', 'ICE Experience', 'BD + Marketing', 'Social coverage'],
    ['B2B', 'Confirm RESO Spring', 'Product + Marketing', 'Status confirmed'],
    ['B2B', 'Confirm The Gathering', 'BD + Marketing', 'Status confirmed'],
    ['Both', 'Podcasts ongoing', 'Founders', '6+ completed'],
    ['Both', 'Q1 metrics', 'Marketing', 'Dashboard'],
    ['Both', 'Media pitches (10)', 'Atkinson', 'Continued outreach'],
    ['Both', 'Story concepts (2-3)', 'Atkinson', 'Pitch memos'],
    ['Both', 'Podcast pitches (6)', 'Atkinson', 'Ongoing outreach'],
    ['Both', 'Media monitoring report', 'Atkinson', 'Monthly summary'],
    ['B2C', 'Blog posts (2)', 'Front Page Sage', 'SEO/AI-optimized'],
    ['Both', 'Monthly performance report', 'Front Page Sage', 'Analytics review'],
    ['B2B', 'LinkedIn posts', 'Marketing', '6 posts + ICE coverage'],
    ['B2B', 'X posts', 'Marketing', '6-10 posts + ICE coverage'],
    ['B2C', 'Meta posts', 'Marketing', '4-6 posts'],
    ['B2C', 'Blue Sky posts', 'Marketing', '4-6 posts'],
    ['Culture', 'Instagram posts', 'Marketing/HR', '4-6 posts']
  ]);
  week910Table.setColumnWidth(0, 70);
  week910Table.setColumnWidth(1, 170);
  week910Table.setColumnWidth(2, 140);
  week910Table.setColumnWidth(3, 120);
  styleAudienceTable(week910Table, BLUE, BLACK, LIGHT_BLUE, LIGHT_GREEN);
  body.appendParagraph('Milestone: Q2 events confirmed, Q1 documented').setBold(true).setForegroundColor(BLACK);
  
  body.appendParagraph('WEEKS 11-12: Assessment (Mar 26 - Apr 15)').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  body.appendParagraph('SURGE PERIOD: Daily posting on B2B channels during Natl Home Perf Conf (Apr 13)').setForegroundColor(BLACK);
  var week1112Table = body.appendTable([
    ['Audience', 'Task', 'Owner', 'Deliverable'],
    ['Both', '90-day assessment', 'Marketing', 'Leadership report'],
    ['B2B', 'Natl Home Perf Conf', 'BD + Marketing', 'Speaking + geo-fence'],
    ['Both', 'Q2 calendar final', 'Marketing', 'Confirmed'],
    ['Both', 'Budget reconcile', 'Marketing', 'Spend vs plan'],
    ['Both', 'Q2 content plan', 'Marketing + AI', 'Full quarter'],
    ['B2B', 'Investor summary', 'Marketing', 'Key stats'],
    ['Both', 'Media pitches (10)', 'Atkinson', 'Continued outreach'],
    ['Both', 'Story concepts (2-3)', 'Atkinson', 'Pitch memos'],
    ['Both', 'Podcast pitches (6)', 'Atkinson', 'Ongoing outreach'],
    ['Both', 'Q1 media summary', 'Atkinson', 'Coverage report'],
    ['B2C', 'Blog posts (2)', 'Front Page Sage', 'SEO/AI-optimized'],
    ['B2B', 'Blog post (1)', 'Marketing + AI', 'Home performance tie-in'],
    ['Both', 'Q1 performance report', 'Front Page Sage', 'Full quarter review'],
    ['B2B', 'LinkedIn posts - SURGE', 'Marketing', 'Daily during conf (14+ posts)'],
    ['B2B', 'X posts - SURGE', 'Marketing', 'Daily during conf (14+ posts)'],
    ['B2C', 'Meta posts', 'Marketing', '4-6 posts'],
    ['B2C', 'Blue Sky posts', 'Marketing', '4-6 posts'],
    ['Culture', 'Instagram posts', 'Marketing/HR', '4-6 posts']
  ]);
  week1112Table.setColumnWidth(0, 70);
  week1112Table.setColumnWidth(1, 170);
  week1112Table.setColumnWidth(2, 140);
  week1112Table.setColumnWidth(3, 120);
  styleAudienceTable(week1112Table, BLUE, BLACK, LIGHT_BLUE, LIGHT_GREEN);
  body.appendParagraph('Milestone: Sprint complete, Q2 ready').setBold(true).setForegroundColor(BLACK);

  body.appendParagraph('Q2 Event Prep (During Sprint)').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);
  body.appendParagraph('Events occurring shortly after sprint ends require prep during Q1:').setForegroundColor(BLACK);

  body.appendParagraph('Immediate Post-Sprint Events').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  var postSprintTable = body.appendTable([
    ['Event', 'Date', 'Days After Sprint', 'Marketing Support'],
    ['RESO Spring', 'Apr 21', '6 days', 'Social/collateral'],
    ['The Gathering', 'Apr 27', '12 days', 'Social/collateral'],
    ['BPA Clean Energy Homes', 'May 28-29', '6 weeks', 'Speaking opp?'],
    ['NAR Trade Expo', 'Jun 15', '9 weeks', 'Geo-fence'],
    ['NEEP Summit', 'Jun 23-26', '10 weeks', 'Policy/P3']
  ]);
  postSprintTable.setColumnWidth(0, 160);
  postSprintTable.setColumnWidth(1, 90);
  postSprintTable.setColumnWidth(2, 110);
  postSprintTable.setColumnWidth(3, 140);
  styleDataTable(postSprintTable, BLUE, BLACK);

  body.appendParagraph('Q2 Prep Tasks (Complete by Apr 15)').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  var q2PrepTable = body.appendTable([
    ['Task', 'For Event', 'Owner', 'Due'],
    ['Confirm attendance', 'RESO Spring', 'Product + Marketing', 'Mar 15'],
    ['Confirm attendance', 'The Gathering', 'BD + Marketing', 'Mar 15'],
    ['Submit speaking proposal', 'BPA Clean Energy Homes', 'Marketing', 'Mar 1'],
    ['Geo-fence campaign setup', 'NAR Trade Expo', 'Marketing', 'Apr 15'],
    ['Collateral refresh', 'All Q2 events', 'Marketing', 'Apr 1'],
    ['Q2 content calendar', 'All', 'Marketing + AI', 'Apr 15'],
    ['Travel/logistics', 'All Q2 events', 'BD + Marketing', 'Apr 1']
  ]);
  q2PrepTable.setColumnWidth(0, 170);
  q2PrepTable.setColumnWidth(1, 140);
  q2PrepTable.setColumnWidth(2, 130);
  q2PrepTable.setColumnWidth(3, 60);
  styleDataTable(q2PrepTable, BLUE, BLACK);

  body.appendParagraph('Additional Q2 Conferences to Monitor').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  body.appendParagraph('From company conference tracker - evaluate for Q2 participation:').setForegroundColor(BLACK);
  var q2ConfTable = body.appendTable([
    ['Event', 'Date', 'Location', 'Audience', 'Decision By'],
    ['ACCA National', 'Mar 15-18', 'Las Vegas', 'Contractors', 'Feb 1'],
    ['RESNET', 'Mar 17-19', 'San Antonio', 'HERS/New Build', 'Feb 1'],
    ['Inman Connect SD', 'Jul 28', 'San Diego', 'Real Estate', 'May 1'],
    ['ACEEE Summer Study', 'Aug 2-7', 'Pacific Grove', 'Policy/P3', 'May 1']
  ]);
  q2ConfTable.setColumnWidth(0, 150);
  q2ConfTable.setColumnWidth(1, 80);
  q2ConfTable.setColumnWidth(2, 90);
  q2ConfTable.setColumnWidth(3, 100);
  q2ConfTable.setColumnWidth(4, 80);
  styleDataTable(q2ConfTable, BLUE, BLACK);

  body.appendParagraph('Success Criteria (Day 90)').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);

  body.appendParagraph('B2B Goals (Real Estate Agents/Brokers)').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  var b2bGoalsTable = body.appendTable([
    ['Goal', 'Target'],
    ['Tier-1 media mentions', '2+'],
    ['Total media mentions', '10+'],
    ['Podcast appearances booked', '12+'],
    ['Geo-fence campaigns', '1 (of 10 annual)'],
    ['B2B blog posts', '3 (ramp with AI)'],
    ['LinkedIn/X cadence', 'Maintained'],
    ['Speaker kit', 'Distributed']
  ]);
  b2bGoalsTable.setColumnWidth(0, 350);
  b2bGoalsTable.setColumnWidth(1, 150);
  styleDataTable(b2bGoalsTable, BLUE, BLACK);

  body.appendParagraph('B2C Goals (Homeowners/Buyers)').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  var b2cGoalsTable = body.appendTable([
    ['Goal', 'Target'],
    ['Report downloads', '500+'],
    ['B2C blog posts (Front Page Sage)', '12'],
    ['Meta/Blue Sky cadence', 'Maintained'],
    ['pearlscore.com consumer page views', 'Baseline established'],
    ['Consumer email list growth', 'Tracked']
  ]);
  b2cGoalsTable.setColumnWidth(0, 350);
  b2cGoalsTable.setColumnWidth(1, 150);
  styleDataTable(b2cGoalsTable, BLUE, BLACK);

  body.appendParagraph('Both Audiences').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  var bothGoalsTable = body.appendTable([
    ['Goal', 'Target'],
    ['Q2 calendar', 'Confirmed'],
    ['Derivatives from pillars (emails, infographics, ads)', '20+']
  ]);
  bothGoalsTable.setColumnWidth(0, 350);
  bothGoalsTable.setColumnWidth(1, 150);
  styleDataTable(bothGoalsTable, BLUE, BLACK);

  body.appendParagraph('Stretch Goals').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  var stretchTable = body.appendTable([
    ['Audience', 'Goal'],
    ['B2B', 'Speaking slot secured'],
    ['B2B', 'Partnership activated'],
    ['B2B', 'Case study published'],
    ['B2C', 'Consumer survey launched'],
    ['Both', '25% website traffic increase']
  ]);
  stretchTable.setColumnWidth(0, 100);
  stretchTable.setColumnWidth(1, 400);
  styleAudienceTable(stretchTable, BLUE, BLACK, LIGHT_BLUE, LIGHT_GREEN);
  
  doc.saveAndClose();
  Logger.log('Document updated');
}

function addBullet(body, text, color) {
  body.appendListItem(text).setGlyphType(DocumentApp.GlyphType.BULLET).setForegroundColor(color);
}

function styleHeaderTable(table, headerColor, bodyColor) {
  // Style header row (labels)
  for (var j = 0; j < table.getRow(0).getNumCells(); j++) {
    table.getRow(0).getCell(j).setBackgroundColor(headerColor);
    table.getRow(0).getCell(j).getChild(0).asText()
      .setForegroundColor('#ffffff')
      .setBold(true)
      .setItalic(false)
      .setFontSize(11);
    table.getRow(0).getCell(j)
      .setPaddingTop(6)
      .setPaddingBottom(6)
      .setPaddingLeft(8)
      .setPaddingRight(8);
  }
  // Style data row (values) - explicitly NOT italic, NOT bold
  if (table.getNumRows() > 1) {
    for (var j = 0; j < table.getRow(1).getNumCells(); j++) {
      table.getRow(1).getCell(j).getChild(0).asText()
        .setFontSize(11)
        .setForegroundColor(bodyColor)
        .setBold(false)
        .setItalic(false);
      table.getRow(1).getCell(j)
        .setPaddingTop(6)
        .setPaddingBottom(6)
        .setPaddingLeft(8)
        .setPaddingRight(8);
    }
  }
  table.setBorderWidth(1);
}

function styleDataTable(table, headerColor, bodyColor) {
  // Style header row
  for (var j = 0; j < table.getRow(0).getNumCells(); j++) {
    table.getRow(0).getCell(j).setBackgroundColor(headerColor);
    table.getRow(0).getCell(j).getChild(0).asText()
      .setForegroundColor('#ffffff')
      .setBold(true)
      .setItalic(false)
      .setFontSize(11);
    table.getRow(0).getCell(j)
      .setPaddingTop(6)
      .setPaddingBottom(6)
      .setPaddingLeft(6)
      .setPaddingRight(6);
  }
  // Style data rows - explicitly NOT italic, NOT bold
  for (var i = 1; i < table.getNumRows(); i++) {
    for (var j = 0; j < table.getRow(i).getNumCells(); j++) {
      table.getRow(i).getCell(j).getChild(0).asText()
        .setFontSize(11)
        .setForegroundColor(bodyColor)
        .setBold(false)
        .setItalic(false);
      table.getRow(i).getCell(j)
        .setPaddingTop(4)
        .setPaddingBottom(4)
        .setPaddingLeft(6)
        .setPaddingRight(6);
    }
  }
  table.setBorderWidth(1);
}

function styleAudienceTable(table, headerColor, bodyColor, lightBlue, lightGreen) {
  // Style header row
  for (var j = 0; j < table.getRow(0).getNumCells(); j++) {
    table.getRow(0).getCell(j).setBackgroundColor(headerColor);
    table.getRow(0).getCell(j).getChild(0).asText()
      .setForegroundColor('#ffffff')
      .setBold(true)
      .setItalic(false)
      .setFontSize(11);
    table.getRow(0).getCell(j)
      .setPaddingTop(6)
      .setPaddingBottom(6)
      .setPaddingLeft(6)
      .setPaddingRight(6);
  }
  // Style data rows with audience-based coloring - explicitly NOT italic, NOT bold
  for (var i = 1; i < table.getNumRows(); i++) {
    var audienceCell = table.getRow(i).getCell(0).getText();
    var bgColor = null;
    if (audienceCell === 'B2B') {
      bgColor = lightBlue;
    } else if (audienceCell === 'B2C') {
      bgColor = lightGreen;
    }
    for (var j = 0; j < table.getRow(i).getNumCells(); j++) {
      var cell = table.getRow(i).getCell(j);
      cell.getChild(0).asText()
        .setFontSize(11)
        .setForegroundColor(bodyColor)
        .setBold(false)
        .setItalic(false);
      cell.setPaddingTop(4).setPaddingBottom(4).setPaddingLeft(6).setPaddingRight(6);
      if (bgColor) {
        cell.setBackgroundColor(bgColor);
      }
    }
  }
  table.setBorderWidth(1);
}

function styleResourcesTable(table, headerColor, bodyColor, links) {
  // Map row indices to link keys (row 0 is header, so data starts at row 1)
  var linkMap = [
    links.annualPlan,            // Row 1: 2026 Annual Marketing Plan
    links.contentCalendar,       // Row 2: Organic Content Calendar
    links.prTracker,             // Row 3: PR Tracker
    links.surgeTracker,          // Row 4: Surge Tracker
    links.partnershipWorksheet,  // Row 5: Partnership Audit
    links.conferenceWorksheet,   // Row 6: Conference Audit
    links.prMessagingGuide       // Row 7: PR Messaging Guide
  ];

  // Style header row
  for (var j = 0; j < table.getRow(0).getNumCells(); j++) {
    table.getRow(0).getCell(j).setBackgroundColor(headerColor);
    table.getRow(0).getCell(j).getChild(0).asText()
      .setForegroundColor('#ffffff')
      .setBold(true)
      .setItalic(false)
      .setFontSize(11);
    table.getRow(0).getCell(j)
      .setPaddingTop(6)
      .setPaddingBottom(6)
      .setPaddingLeft(6)
      .setPaddingRight(6);
  }

  // Style data rows and add links - explicitly NOT italic, NOT bold
  for (var i = 1; i < table.getNumRows(); i++) {
    var url = linkMap[i - 1];
    for (var j = 0; j < table.getRow(i).getNumCells(); j++) {
      var cell = table.getRow(i).getCell(j);
      cell.getChild(0).asText()
        .setFontSize(11)
        .setBold(false)
        .setItalic(false);
      cell.setPaddingTop(4).setPaddingBottom(4).setPaddingLeft(6).setPaddingRight(6);

      // First column gets the link (skip placeholder URLs)
      if (j === 0 && url && url.indexOf('YOUR_') === -1) {
        cell.getChild(0).asText().setLinkUrl(url).setForegroundColor('#0066cc');
      } else {
        cell.getChild(0).asText().setForegroundColor(bodyColor);
      }
    }
  }
  table.setBorderWidth(1);
}

function styleOptionalTable(table, headerColor, bodyColor) {
  // Style header row with orange
  for (var j = 0; j < table.getRow(0).getNumCells(); j++) {
    table.getRow(0).getCell(j).setBackgroundColor(headerColor);
    table.getRow(0).getCell(j).getChild(0).asText()
      .setForegroundColor('#ffffff')
      .setBold(true)
      .setItalic(false)
      .setFontSize(11);
    table.getRow(0).getCell(j)
      .setPaddingTop(6)
      .setPaddingBottom(6)
      .setPaddingLeft(6)
      .setPaddingRight(6);
  }
  // Style data rows with light orange background - explicitly NOT italic, NOT bold
  for (var i = 1; i < table.getNumRows(); i++) {
    for (var j = 0; j < table.getRow(i).getNumCells(); j++) {
      var cell = table.getRow(i).getCell(j);
      cell.setBackgroundColor('#fff5e6');
      cell.getChild(0).asText()
        .setFontSize(11)
        .setForegroundColor(bodyColor)
        .setBold(false)
        .setItalic(false);
      cell.setPaddingTop(4).setPaddingBottom(4).setPaddingLeft(6).setPaddingRight(6);
    }
  }
  table.setBorderWidth(1);
}

function styleAtkinsonCompareTable(table, baseColor, expandedColor, bodyColor) {
  // Header row: Col 0 = deliverable (blue), Col 1 = Base (blue), Col 2 = Expanded (orange)
  for (var j = 0; j < 3; j++) {
    var headerCell = table.getRow(0).getCell(j);
    headerCell.setBackgroundColor(j < 2 ? baseColor : expandedColor);
    headerCell.getChild(0).asText()
      .setForegroundColor('#ffffff')
      .setBold(true)
      .setItalic(false)
      .setFontSize(11);
    headerCell.setPaddingTop(6).setPaddingBottom(6).setPaddingLeft(6).setPaddingRight(6);
  }

  // Data rows: Col 0 = white, Col 1 = light blue (contracted), Col 2 = light orange (proposed)
  // Explicitly NOT italic, NOT bold
  for (var i = 1; i < table.getNumRows(); i++) {
    // Col 0 - deliverable name
    var cell0 = table.getRow(i).getCell(0);
    cell0.getChild(0).asText()
      .setFontSize(11)
      .setForegroundColor(bodyColor)
      .setBold(false)
      .setItalic(false);
    cell0.setPaddingTop(4).setPaddingBottom(4).setPaddingLeft(6).setPaddingRight(6);

    // Col 1 - base (light blue)
    var cell1 = table.getRow(i).getCell(1);
    cell1.setBackgroundColor('#e6f3ff');
    cell1.getChild(0).asText()
      .setFontSize(11)
      .setForegroundColor(bodyColor)
      .setBold(false)
      .setItalic(false);
    cell1.setPaddingTop(4).setPaddingBottom(4).setPaddingLeft(6).setPaddingRight(6);

    // Col 2 - expanded (light orange)
    var cell2 = table.getRow(i).getCell(2);
    cell2.setBackgroundColor('#fff5e6');
    cell2.getChild(0).asText()
      .setFontSize(11)
      .setForegroundColor(bodyColor)
      .setBold(false)
      .setItalic(false);
    cell2.setPaddingTop(4).setPaddingBottom(4).setPaddingLeft(6).setPaddingRight(6);
  }
  table.setBorderWidth(1);
}
