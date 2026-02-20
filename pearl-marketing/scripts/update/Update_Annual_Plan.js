// ============================================================
// RESOURCE LINKS - Update these after creating docs in Drive
// ============================================================
// HOW TO GET THESE LINKS:
// 1. Run each Create_*.gs script's createNewDoc() function
// 2. Copy the Doc ID from the logs
// 3. The link format is: https://docs.google.com/document/d/DOC_ID/edit
// 4. For xlsx files: Upload to Drive, right-click > Get link
// ============================================================
var RESOURCE_LINKS = {
  // Marketing Trackers (annual)
  contentCalendar: 'https://docs.google.com/spreadsheets/d/1BAUNAuyRNbdDXr6by_1MPOWUOo_4sRY3kJTNkPI4ZyY/edit',
  prTracker: 'https://docs.google.com/spreadsheets/d/1hstp9REbLnlSzrgpeYXgpxZePuaPEnqneWhqUBIXlu8/edit',
  surgeTracker: 'https://docs.google.com/spreadsheets/d/1Nnubv4ryBnn8jeLJ1hVAWV-jh_cfx4Pyur-YGRG18Xw/edit',

  // Quarterly sprint plans (compact row)
  sprintPlanQ1: 'https://docs.google.com/document/d/1hwIfV-5Rb0EHjVnq3bztcZRTDHq7y_8Uh1b-iRfOtHE/edit',
  sprintPlanQ2: 'YOUR_LINK_HERE',
  sprintPlanQ3: 'YOUR_LINK_HERE',
  sprintPlanQ4: 'YOUR_LINK_HERE',

  // Audit worksheets
  partnershipWorksheet: 'https://docs.google.com/spreadsheets/d/1A3jGfKxYOhc4nMhoWTLcUURvWVRjpSoz4E01lGPm6PM/edit',
  conferenceWorksheet: 'https://docs.google.com/spreadsheets/d/1auiKdZPCEDM5TFsXrBpMBNpfrahQoKBFq49KFgPVzjo/edit'
};
// ============================================================

function updateAnnualPlan() {
  var doc = DocumentApp.openById('1v2kMWxcv_ogy6UT4lRUnp9M9EVCAPmdp0Y8dG1YtyG8');
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
  var ORANGE = '#cc6600';      // Under consideration / not committed

  // Standard table width (500px total for consistency)
  var TABLE_WIDTH = 500;

  styleHeaderTable(body.appendTable([
    ['Document', 'Status', 'Updated'],
    ['2026 Annual Plan', 'Draft', 'January 2026']
  ]), BLUE, BLACK);

  body.appendParagraph('Pearl 2026 Marketing Plan').setHeading(DocumentApp.ParagraphHeading.HEADING1).setForegroundColor(BLUE);

  body.appendParagraph('Strategic Objectives').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);
  addBullet(body, 'Establish Pearl as THE authority on home performance ratings', BLACK);
  addBullet(body, 'Build investor credibility ahead of Series B', BLACK);
  addBullet(body, 'Create visible market momentum within first 90 days', BLACK);
  addBullet(body, "Articulate Pearl's moat — 92M homes scored, proprietary methodology, first-mover data advantage, key partnerships (verify usage rights)", BLACK);

  // Supporting Documents Section (near top for visibility)
  body.appendParagraph('Supporting Documents').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);
  var resourcesTable = body.appendTable([
    ['Document', 'Purpose'],
    ['Organic Content Calendar', 'Q1-Q4 organic content, pillar reference'],
    ['PR Tracker', 'Atkinson deliverables, media coverage, podcasts'],
    ['Surge Tracker', 'Paid campaigns, geo-fence, budget tracking'],
    ['Sprint Plans: Q1 | Q2 | Q3 | Q4', 'Quarterly execution plans'],
    ['Partnership Audit', 'Costs, benefits, marketing rights'],
    ['Conference Audit', 'Speaking/booth costs, event priorities']
  ]);
  resourcesTable.setColumnWidth(0, 220);
  resourcesTable.setColumnWidth(1, 280);
  styleResourcesTable(resourcesTable, BLUE, BLACK, RESOURCE_LINKS);

  body.appendParagraph('Q1 Foundation Tasks').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  body.appendParagraph('Complete by end of Weeks 1-2 to confirm Q1 priorities:').setForegroundColor(BLACK);
  addBullet(body, 'Complete Partnership Audit — confirm costs, benefits, and marketing usage rights for each partnership', BLACK);
  addBullet(body, 'Complete Conference Audit — confirm which events to attend/sponsor in Q1 and beyond', BLACK);

  body.appendParagraph('Target Audiences').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);
  body.appendParagraph('Color key: Light blue = B2B | Light green = B2C').setForegroundColor(BLACK);
  var audienceTable = body.appendTable([
    ['Segment', 'Priority', 'Description'],
    ['B2B', 'Primary', 'Real estate agents, brokers'],
    ['B2C', 'Primary', 'Home buyers']
  ]);
  audienceTable.setColumnWidth(0, 70);
  audienceTable.setColumnWidth(1, 70);
  audienceTable.setColumnWidth(2, 360);
  styleAudienceTable(audienceTable, BLUE, BLACK, LIGHT_BLUE, LIGHT_GREEN, 0);

  body.appendParagraph('The Approach: Drumbeat + Surge').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);
  body.appendParagraph('Maintain consistent baseline presence while amplifying around key moments.').setForegroundColor(BLACK);
  var approachTable = body.appendTable([
    ['Type', 'Campaigns', 'Cadence'],
    ['Always-On', 'LinkedIn ads, Social media, SEO/Content, PR outreach', 'Year-round'],
    ['Surge', 'Campaign Sprints (pillar launches), Geo-fence (events), Regional B2C', 'Around key moments']
  ]);
  approachTable.setColumnWidth(0, 80);
  approachTable.setColumnWidth(1, 310);
  approachTable.setColumnWidth(2, 110);
  styleDataTable(approachTable, BLUE, BLACK);

  body.appendParagraph('2026 Budget Overview').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);
  body.appendParagraph('Color key: Light blue = B2B | Light green = B2C | White = Both').setForegroundColor(BLACK);
  body.appendParagraph('Media Buy: $623,200').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);

  var budgetTable = body.appendTable([
    ['Audience', 'Campaign', 'Details', 'Budget'],
    ['B2B', 'LinkedIn Always-On', '48 wks × $3K', '$144,000'],
    ['B2B', 'Campaign Sprints', '8 × 2 wks × $7.5K', '$120,000'],
    ['B2B', 'Geo-fenced Events', '10 × $16,320', '$163,200'],
    ['B2C', 'Regional Awareness', '20 wks × $3K', '$60,000'],
    ['B2C', 'Regional ILS Launch', '16 wks × $8.5K', '$136,000'],
    ['Both', 'Total', '', '$623,200']
  ]);
  budgetTable.setColumnWidth(0, 70);
  budgetTable.setColumnWidth(1, 160);
  budgetTable.setColumnWidth(2, 170);
  budgetTable.setColumnWidth(3, 100);
  styleAudienceTable(budgetTable, BLUE, BLACK, LIGHT_BLUE, LIGHT_GREEN, 0);

  body.appendParagraph('Campaign Sprint Details (8 campaigns):').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  addBullet(body, '4 Whitepapers', BLACK);
  addBullet(body, '2 Research Reports', BLACK);
  addBullet(body, '2 Product Milestones', BLACK);

  body.appendParagraph('Services: $150,000').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  body.appendParagraph('In-house + AI, fixed vendors, plus contractors.').setForegroundColor(BLACK);

  body.appendParagraph('Vendor Deliverables').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);
  body.appendParagraph('Color key: Light blue = B2B | Light green = B2C | White = Both').setForegroundColor(BLACK);

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
  body.appendParagraph('Goal: Establish Pearl as THE authority on home performance and elevate Cynthia/Robin as industry experts.').setForegroundColor(BLACK);

  body.appendParagraph('Expansion Partners').setHeading(DocumentApp.ParagraphHeading.HEADING4).setForegroundColor(ORANGE);
  body.appendParagraph('Atkinson has established partnerships to scale capacity if needed:').setForegroundColor(BLACK);
  var partnersTable = body.appendTable([
    ['Partner', 'Specialty', 'Notes'],
    ['Weber Shandwick Collective', 'Full-service PR', '2nd largest PR firm globally; Atkinson worked there 10 years'],
    ['1631 Digital', 'Geo-fencing', 'Digital advertising and location-based targeting'],
    ['Kenzee Communications', 'Social media', 'Minority-owned; focus on multi-family space']
  ]);
  partnersTable.setColumnWidth(0, 160);
  partnersTable.setColumnWidth(1, 100);
  partnersTable.setColumnWidth(2, 240);
  styleDataTable(partnersTable, ORANGE, BLACK);

  body.appendParagraph('Front Page Sage (~$4,000/month)').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  var fpsTable = body.appendTable([
    ['Audience', 'Deliverable', 'Frequency', 'Notes'],
    ['B2C', 'SEO/GEO blog posts', '4/month', '1 credit each; LLM + search optimized'],
    ['B2C', 'LinkedIn posting', 'Weekly', 'Included, no credits'],
    ['—', 'Consulting calls', 'Weekly', 'Included, no credits'],
    ['—', 'Monthly report', 'Monthly', 'Performance analysis'],
    ['B2C', 'Hub/pillar pages', 'As needed', '2 credits each'],
    ['B2C', 'Case studies', 'As needed', '2 credits each']
  ]);
  fpsTable.setColumnWidth(0, 70);
  fpsTable.setColumnWidth(1, 150);
  fpsTable.setColumnWidth(2, 90);
  fpsTable.setColumnWidth(3, 190);
  styleDataTable(fpsTable, BLUE, BLACK);
  body.appendParagraph('7 credits/month total. Focus: SEO + GEO (Generative Engine Optimization) to position Pearl as authoritative source in LLMs and search.').setForegroundColor(BLACK);
  body.appendParagraph('Note: FPS content targets consumers (homeowners/buyers) searching for home performance info. B2B agent/broker content is produced by Marketing + AI.').setForegroundColor(BLACK);
  body.appendParagraph('⚠️ FLAG: FPS contract includes LinkedIn posting, but LinkedIn is our B2B channel. Need to discuss: Should FPS post B2C content to LinkedIn, or reallocate those credits?').setForegroundColor('#cc6600');

  body.appendParagraph('Marketing + AI Content Production').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  var mktgTable = body.appendTable([
    ['Audience', 'Deliverable', 'Frequency', 'Notes'],
    ['B2B', 'Blog posts', '1/month (ramp with AI)', 'Agent/broker focused, user-friendly'],
    ['Varies', 'Pillar content pieces', '1/month', 'See Content Strategy for audience by pillar'],
    ['Varies', 'Content derivatives', '20+/pillar', 'Social, email, ads from each pillar'],
    ['Both', 'Email sequences', 'As needed', 'Nurture campaigns'],
    ['Both', 'Ad copy', 'Per campaign', 'Geo-fence, LinkedIn, Meta']
  ]);
  mktgTable.setColumnWidth(0, 70);
  mktgTable.setColumnWidth(1, 140);
  mktgTable.setColumnWidth(2, 115);
  mktgTable.setColumnWidth(3, 175);
  styleAudienceTable(mktgTable, BLUE, BLACK, LIGHT_BLUE, LIGHT_GREEN, 0);

  body.appendParagraph('BD Event Calendar 2026').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);
  body.appendParagraph('Budget: 10 geo-fence campaigns at $16,320 each ($163,200 total)').setForegroundColor(BLACK);

  body.appendParagraph('BD/Real Estate Events by Date').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  var bdEventsTable = body.appendTable([
    ['Event', 'Date', 'Attendance', 'Geo-fence?'],
    ['Inman Connect NYC', 'Feb 3', '2,000-4,000', 'No (cancelled)'],
    ['ICE Experience', 'Mar 16', '3,000+', 'No (mortgage focus)'],
    ['Natl Home Perf Conf', 'Apr 13', '2,800', 'Yes'],
    ['RESO Spring', 'Apr 21', '400', 'No (too small)'],
    ['The Gathering', 'Apr 27', '~710', 'No (too small)'],
    ['NAR Trade Expo', 'Jun 15', '8,000+', 'Yes'],
    ['Inman Connect SD', 'Jul 28', '2,000-4,000', 'Yes'],
    ['Blueprint', 'Sep 22', '3,000+', 'Yes'],
    ['CMLS Open House', 'Sep 29', '~1,000', 'Yes'],
    ['Compass Retreat', 'Oct 1', '2,200+', 'Yes'],
    ['REimagine!', 'Oct 6', '3,000+', 'Yes'],
    ['Zillow Unlock', 'Oct 13', '2,500', 'Yes'],
    ['NAR NXT', 'Nov 6', '12,000+', 'Yes']
  ]);
  bdEventsTable.setColumnWidth(0, 180);
  bdEventsTable.setColumnWidth(1, 80);
  bdEventsTable.setColumnWidth(2, 110);
  bdEventsTable.setColumnWidth(3, 130);
  var bdEventUrls = [
    'https://events.inman.com/inman-connect-new-york',
    'https://mortgagetech.ice.com/experience/index',
    'https://building-performance.org/events/national/',
    'https://www.reso.org/conference-events/',
    'https://events.housingwire.com/the-gathering-2026',
    'https://legislative.realtor/',
    'https://events.inman.com/inman-connect-san-diego',
    'https://blueprintvegas.com/',
    'https://openhouse.councilofmls.org/',
    'https://www.compassretreat.com/',
    'https://www.car.org/meetings/reimagine',
    'https://www.unlockconference.com/',
    'https://narnxt.realtor/'
  ];
  styleEventsTable(bdEventsTable, BLUE, BLACK, GRAY, bdEventUrls);
  body.appendParagraph('9 geo-fence events confirmed; Inman Connect NYC cancelled (budget to be reallocated).').setForegroundColor(BLACK);
  body.appendParagraph('4 events (Inman Connect NYC, ICE Experience, RESO Spring, The Gathering) receive social/collateral support only.').setForegroundColor(BLACK);

  body.appendParagraph('Additional Conferences to Consider').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  body.appendParagraph('Events from company conference tracker not on BD priority list:').setForegroundColor(BLACK);
  var addlConfTable = body.appendTable([
    ['Event', 'Date', 'Location', 'Est. Attendance', 'Audience'],
    ['Home SPARK 2026', 'Jan 6-9', 'Amelia Island', '500+', 'Contractors'],
    ['Midwest Energy Solutions', 'Jan 28-31', 'Chicago', '800+', 'Policy/P3'],
    ['AHR Expo', 'Feb 2-4', 'Las Vegas', '40,000+', 'HVAC/Contractors'],
    ['NASEO Policy Outlook', 'Feb 3-6', 'Washington DC', '300+', 'Policy/P3'],
    ['EGIA EPIC 2026', 'Feb 12-13', 'Las Vegas', '1,500+', 'Contractors'],
        ['Momentum Building Conf', 'Feb 19-20', 'Des Moines', '300+', 'Policy/P3'],
    ['ACCA National', 'Mar 15-18', 'Las Vegas', '2,000+', 'HVAC/Contractors'],
    ['RESNET', 'Mar 17-19', 'San Antonio', '1,000+', 'HERS/New Build'],
    ['BPA Clean Energy Homes', 'May 28-29', 'Saratoga Springs', '500+', 'Policy/P3'],
    ['NEEP Summit 2026', 'Jun 23-26', 'Baltimore', '400+', 'Policy/P3'],
    ['ACEEE Summer Study', 'Aug 2-7', 'Pacific Grove', '500+', 'Policy/P3'],
        ['Service World Expo', 'Nov 9-12', 'Las Vegas', '2,000+', 'Contractors'],
    ['RE+ 2026', 'Nov 16-19', 'Las Vegas', '25,000+', 'Solar/Renewables']
  ]);
  addlConfTable.setColumnWidth(0, 160);
  addlConfTable.setColumnWidth(1, 75);
  addlConfTable.setColumnWidth(2, 100);
  addlConfTable.setColumnWidth(3, 55);
  addlConfTable.setColumnWidth(4, 110);
  styleDataTable(addlConfTable, BLUE, BLACK);
  body.appendParagraph('Note: RE+ (25K+) offers significant reach if solar/renewables audience is priority.').setForegroundColor(BLACK);

  body.appendParagraph('2026 Moment Calendar').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);
  body.appendParagraph('Color key: Light blue = B2B | Light green = B2C | White = Both').setForegroundColor(BLACK);
  body.appendParagraph('Includes 8 campaign sprints (pillar launches) and 9 geo-fenced events.').setForegroundColor(BLACK);
  var momentTable = body.appendTable([
    ['Audience', 'Quarter', 'Moment', 'Type'],
    ['Both', 'Q1', 'State of Home Performance Report', 'Campaign Sprint (Whitepaper)'],
    ['Both', 'Q1', 'Inman Connect NYC', 'Conference + Dinner'],
    ['B2B', 'Q1', 'Natl Home Perf Conf', 'Conference + Geo'],
    ['B2C', 'Q2', '2026 Consumer Survey', 'Campaign Sprint (Research)'],
    ['B2C', 'Q2', 'What Buyers Want', 'Campaign Sprint (Whitepaper)'],
    ['B2B', 'Q2', 'NAR Trade Expo', 'Conference + Geo'],
    ['B2B', 'Q2', 'RESO Spring', 'Conference'],
    ['B2B', 'Q2', 'Agent Guide to Pearl', 'Campaign Sprint (Whitepaper)'],
    ['B2B', 'Q3', 'Inman Connect San Diego', 'Conference + Geo'],
    ['B2C', 'Q3', 'Home Resilience', 'Campaign Sprint (Whitepaper)'],
    ['B2C', 'Q3', 'Regional B2C push', 'Paid Media'],
    ['B2B', 'Q3', 'Blueprint', 'Conference + Geo'],
    ['B2B', 'Q3', 'CMLS Open House', 'Conference + Geo'],
    ['B2C', 'Q4', 'True Cost of Homeownership', 'Campaign Sprint (Research)'],
    ['B2B', 'Q4', 'Compass Retreat', 'Conference + Geo'],
    ['B2B', 'Q4', 'REimagine!', 'Conference + Geo'],
    ['B2B', 'Q4', 'Zillow Unlock', 'Conference + Geo'],
    ['B2B', 'Q4', 'NAR NXT', 'Conference + Geo'],
    ['Both', 'Q4', 'Year in Review', 'Campaign Sprint (Report)']
  ]);
  momentTable.setColumnWidth(0, 70);
  momentTable.setColumnWidth(1, 55);
  momentTable.setColumnWidth(2, 220);
  momentTable.setColumnWidth(3, 155);
  styleAudienceTable(momentTable, BLUE, BLACK, LIGHT_BLUE, LIGHT_GREEN, 0);

  body.appendParagraph('Channel Strategy').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);
  body.appendParagraph('Color key: Light blue = B2B | Light green = B2C | White = Both').setForegroundColor(BLACK);
  var channelTable = body.appendTable([
    ['Audience', 'Channel', 'Owner', 'Approach'],
    ['Both', 'PR/Media', 'Atkinson', '20 pitches/mo'],
    ['B2C', 'SEO/GEO Content', 'Front Page Sage', '4 posts/mo (LLM + search optimized)'],
    ['B2B', 'Blog', 'Marketing + AI', '1 post/mo (ramp with AI)'],
    ['Both', 'Paid Media', 'Marketing', 'Surge + geo'],
    ['Both', 'Social Media', 'Marketing + AI', 'By platform (see below)'],
    ['B2B', 'Speaking', 'Cross-functional', 'Marketing supports']
  ]);
  channelTable.setColumnWidth(0, 70);
  channelTable.setColumnWidth(1, 100);
  channelTable.setColumnWidth(2, 130);
  channelTable.setColumnWidth(3, 200);
  styleAudienceTable(channelTable, BLUE, BLACK, LIGHT_BLUE, LIGHT_GREEN, 0);

  body.appendParagraph('Social Media Strategy').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);

  body.appendParagraph('B2B Channels (Real Estate Agents)').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  var b2bSocialTable = body.appendTable([
    ['Platform', 'Owner', 'Frequency', 'Content Focus'],
    ['LinkedIn', 'Marketing', 'Daily (surges), 3x/wk (baseline)', 'Industry news, thought leadership'],
    ['X (Twitter)', 'Marketing', '3-5x/week', 'Real estate conversations, news']
  ]);
  b2bSocialTable.setColumnWidth(0, 80);
  b2bSocialTable.setColumnWidth(1, 80);
  b2bSocialTable.setColumnWidth(2, 150);
  b2bSocialTable.setColumnWidth(3, 190);
  styleDataTable(b2bSocialTable, BLUE, BLACK);

  body.appendParagraph('B2C Channels (Homeowners)').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  var b2cSocialTable = body.appendTable([
    ['Platform', 'Owner', 'Frequency', 'Content Focus'],
    ['Meta (Facebook)', 'Marketing', '2-3x/week', 'Home tips, Pearl SCORE education'],
    ['Blue Sky', 'Marketing', '2-3x/week', 'Community engagement, early adopters']
  ]);
  b2cSocialTable.setColumnWidth(0, 100);
  b2cSocialTable.setColumnWidth(1, 80);
  b2cSocialTable.setColumnWidth(2, 100);
  b2cSocialTable.setColumnWidth(3, 220);
  styleDataTable(b2cSocialTable, BLUE, BLACK);

  body.appendParagraph('Recruitment Only (Pearl Culture)').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  var recruitTable = body.appendTable([
    ['Platform', 'Owner', 'Frequency', 'Content Focus'],
    ['Instagram', 'Marketing/HR', '2-3x/week', 'Team highlights, culture, careers']
  ]);
  recruitTable.setColumnWidth(0, 80);
  recruitTable.setColumnWidth(1, 100);
  recruitTable.setColumnWidth(2, 100);
  recruitTable.setColumnWidth(3, 220);
  styleDataTable(recruitTable, BLUE, BLACK);
  body.appendParagraph('Note: Instagram is NOT used for B2B or B2C marketing—recruitment and employer branding only.').setForegroundColor(BLACK);

  body.appendParagraph('Content Strategy').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);
  body.appendParagraph('Monthly pillar model: One flagship piece → 20+ derivatives').setForegroundColor(BLACK);
  body.appendParagraph('Color key: Light blue = B2B | Light green = B2C | White = Both').setForegroundColor(BLACK);
  var contentTable = body.appendTable([
    ['Audience', 'Month', 'Pillar', 'Owner'],
    ['Both', 'Jan/Feb', 'State of Home Performance', 'Marketing'],
    ['B2C', 'Mar', '2026 Home Performance Consumer Survey', 'Marketing'],
    ['B2C', 'Mar', 'What Buyers Want', 'Marketing'],
    ['B2B', 'May', 'Agent Guide to Pearl', 'Marketing'],
    ['B2C', 'Jul', 'Home Resilience', 'Marketing'],
    ['B2C', 'Sep', 'True Cost of Homeownership', 'Marketing'],
    ['Both', 'Nov', 'Year in Review', 'Marketing']
  ]);
  contentTable.setColumnWidth(0, 70);
  contentTable.setColumnWidth(1, 60);
  contentTable.setColumnWidth(2, 270);
  contentTable.setColumnWidth(3, 100);
  styleAudienceTable(contentTable, BLUE, BLACK, LIGHT_BLUE, LIGHT_GREEN, 0);

  body.appendParagraph('Success Metrics').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);
  var metricsTable = body.appendTable([
    ['Audience', 'Metric', 'Target'],
    ['Both', 'Tier-1 media', '6+ annually'],
    ['Both', 'Podcasts', '4-6/month'],
    ['B2B', 'Speaking', '6-8 annually'],
    ['B2C', 'Traffic growth', '25% QoQ'],
    ['B2C', 'Home claims', 'Increasing']
  ]);
  metricsTable.setColumnWidth(0, 100);
  metricsTable.setColumnWidth(1, 200);
  metricsTable.setColumnWidth(2, 200);
  styleAudienceTable(metricsTable, BLUE, BLACK, LIGHT_BLUE, LIGHT_GREEN, 0);

  body.appendParagraph('Strategic Decision: PR Strategy for Series B').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(ORANGE);
  body.appendParagraph('Goal: Establish Pearl as the go-to leader in home performance rating, build investor credibility, and ward off competition.').setForegroundColor(BLACK);

  var prOptionsTable = body.appendTable([
    ['Factor', 'Atkinson (Expanded)', 'Larger PR Firm'],
    ['Cost', 'TBD (currently $4,500/mo)', 'TBD'],
    ['Pearl knowledge', 'Deep - 2+ years working together', 'Ramp-up required'],
    ['Tier-1 targeting', 'Specific journalists identified; some existing Pearl relationships', 'Unknown'],
    ['Startup/VC expertise', 'Can scale via Weber Shandwick partnership', 'Potentially core specialty'],
    ['Speed to market', 'Immediate - Q1 pitching calendar ready', 'Onboarding time needed'],
    ['Scalability', 'Weber Shandwick available if capacity needed', 'Built-in team depth']
  ]);
  prOptionsTable.setColumnWidth(0, 120);
  prOptionsTable.setColumnWidth(1, 190);
  prOptionsTable.setColumnWidth(2, 190);
  styleDataTable(prOptionsTable, ORANGE, BLACK);

  body.appendParagraph('Key Question: Does a larger firm get us into Tier-1 faster, or does Atkinson\'s existing Pearl knowledge and ready-to-execute plan provide a head start?').setBold(true).setForegroundColor(BLACK);
  body.appendParagraph('Note: Atkinson\'s proposal includes a pitching calendar targeting NYT, WSJ, WaPo, NPR, Consumer Reports, Axios, and others. Some journalists have existing Pearl relationships (e.g., WSJ reporter who previously covered Pearl). Weber Shandwick (2nd largest PR firm globally) is available as expansion partner if capacity is needed.').setForegroundColor(BLACK);

  body.appendParagraph('Other Discussion Questions').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);
  addBullet(body, 'Which moments to prioritize if budget constrained?', BLACK);
  addBullet(body, 'Realistic speaking engagement budget?', BLACK);
  addBullet(body, 'Who owns conference decisions (Marketing vs BD)?', BLACK);
  addBullet(body, 'Which partnerships to actively support?', BLACK);
  addBullet(body, 'How to balance B2B vs B2C messaging?', BLACK);

  doc.saveAndClose();
  Logger.log('Document updated');
}

function addBullet(body, text, color) {
  body.appendListItem(text).setGlyphType(DocumentApp.GlyphType.BULLET).setForegroundColor(color);
}

function addLinkedBullet(body, text, url, color) {
  var item = body.appendListItem(text).setGlyphType(DocumentApp.GlyphType.BULLET);
  if (url && url !== 'YOUR_LINK_HERE') {
    item.setLinkUrl(url).setForegroundColor('#0066cc');
  } else {
    item.setForegroundColor(color);
  }
}

function styleResourcesTable(table, headerColor, bodyColor, links) {
  // Map row indices to link keys (row 0 is header, so data starts at row 1)
  // New structure: Trackers, compact Sprint row, Audits
  var linkMap = [
    links.contentCalendar,        // Row 1: Organic Content Calendar
    links.prTracker,              // Row 2: PR Tracker
    links.surgeTracker,           // Row 3: Surge Tracker
    null,                         // Row 4: Sprint Plans (special handling)
    links.partnershipWorksheet,   // Row 5: Partnership Audit
    links.conferenceWorksheet     // Row 6: Conference Audit
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

      // First column gets the link (except for Sprint row which has multiple links)
      if (j === 0) {
        if (i === 4) {
          // Sprint Plans row - link each quarter separately
          // Text is "Sprint Plans: Q1 | Q2 | Q3 | Q4"
          var text = cell.getChild(0).asText();
          text.setForegroundColor('#0066cc');
          // Find positions of Q1, Q2, Q3, Q4 and set individual links
          var cellText = cell.getText();
          var q1Start = cellText.indexOf('Q1');
          var q2Start = cellText.indexOf('Q2');
          var q3Start = cellText.indexOf('Q3');
          var q4Start = cellText.indexOf('Q4');
          if (q1Start >= 0 && links.sprintPlanQ1 && links.sprintPlanQ1 !== 'YOUR_LINK_HERE') {
            text.setLinkUrl(q1Start, q1Start + 2, links.sprintPlanQ1);
          }
          if (q2Start >= 0 && links.sprintPlanQ2 && links.sprintPlanQ2 !== 'YOUR_LINK_HERE') {
            text.setLinkUrl(q2Start, q2Start + 2, links.sprintPlanQ2);
          }
          if (q3Start >= 0 && links.sprintPlanQ3 && links.sprintPlanQ3 !== 'YOUR_LINK_HERE') {
            text.setLinkUrl(q3Start, q3Start + 2, links.sprintPlanQ3);
          }
          if (q4Start >= 0 && links.sprintPlanQ4 && links.sprintPlanQ4 !== 'YOUR_LINK_HERE') {
            text.setLinkUrl(q4Start, q4Start + 2, links.sprintPlanQ4);
          }
        } else if (url && url !== 'YOUR_LINK_HERE' && url.indexOf('YOUR_') === -1) {
          cell.getChild(0).asText().setLinkUrl(url).setForegroundColor('#0066cc');
        } else {
          cell.getChild(0).asText().setForegroundColor(bodyColor);
        }
      } else {
        cell.getChild(0).asText().setForegroundColor(bodyColor);
      }
    }
  }
  table.setBorderWidth(1);
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

function styleAudienceTable(table, headerColor, bodyColor, lightBlue, lightGreen, audienceColIndex) {
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
  var colIndex = audienceColIndex || 0;
  for (var i = 1; i < table.getNumRows(); i++) {
    var audienceCell = table.getRow(i).getCell(colIndex).getText();
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

function styleEventsTable(table, headerColor, bodyColor, grayColor, eventUrls) {
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
  // Style data rows - gray out rows where last column starts with "No"
  // Explicitly NOT italic, NOT bold
  var lastColIndex = table.getRow(0).getNumCells() - 1;
  for (var i = 1; i < table.getNumRows(); i++) {
    var lastCellText = table.getRow(i).getCell(lastColIndex).getText();
    var isNoRow = lastCellText.indexOf('No') === 0;
    var bgColor = isNoRow ? grayColor : null;
    var textColor = isNoRow ? '#666666' : bodyColor;

    for (var j = 0; j < table.getRow(i).getNumCells(); j++) {
      var cell = table.getRow(i).getCell(j);
      cell.getChild(0).asText()
        .setFontSize(11)
        .setForegroundColor(textColor)
        .setBold(false)
        .setItalic(false);
      cell.setPaddingTop(4).setPaddingBottom(4).setPaddingLeft(6).setPaddingRight(6);
      if (bgColor) {
        cell.setBackgroundColor(bgColor);
      }
    }

    // Add link to event name (first column) if URL provided
    if (eventUrls && eventUrls[i - 1]) {
      var eventCell = table.getRow(i).getCell(0);
      eventCell.getChild(0).asText().setLinkUrl(eventUrls[i - 1]);
      if (!isNoRow) {
        eventCell.getChild(0).asText().setForegroundColor('#0066cc');
      }
    }
  }
  table.setBorderWidth(1);
}
