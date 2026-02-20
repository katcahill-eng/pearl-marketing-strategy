function create90DaySprint() {
  var doc = DocumentApp.create('Pearl 90-Day Sprint Plan');
  var body = doc.getBody();
  var BLUE = '#003366';
  var BLACK = '#000000';
  var GRAY = '#e6e6e6';
  
  // Header
  var headerData = [
    ['Project:', '90-Day Sprint Plan', 'Date:', 'January 15, 2026'],
    ['Status:', 'For Discussion', 'Version:', 'Draft 1.0']
  ];
  styleHeaderTable(body.appendTable(headerData), GRAY);
  
  body.appendParagraph('Pearl Marketing 90-Day Sprint Plan').setHeading(DocumentApp.ParagraphHeading.HEADING1).setForegroundColor(BLUE);
  body.appendParagraph('January 15 - April 15, 2026').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);
  
  body.appendParagraph('What This Plan Achieves').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);
  body.appendParagraph('Establish Pearl as a visible authority in real estate ahead of Series B.').setForegroundColor(BLACK);
  body.appendListItem('Launch "State of Home Performance 2026" report with media coverage').setGlyphType(DocumentApp.GlyphType.BULLET).setForegroundColor(BLACK);
  body.appendListItem('Speak at 2+ major industry events').setGlyphType(DocumentApp.GlyphType.BULLET).setForegroundColor(BLACK);
  body.appendListItem('Secure 12-18 podcast appearances').setGlyphType(DocumentApp.GlyphType.BULLET).setForegroundColor(BLACK);
  body.appendListItem('Build content engine producing 8-10 pieces per pillar').setGlyphType(DocumentApp.GlyphType.BULLET).setForegroundColor(BLACK);
  body.appendListItem('Execute geo-fencing at 2 major conferences').setGlyphType(DocumentApp.GlyphType.BULLET).setForegroundColor(BLACK);
  
  body.appendParagraph('Target Audiences').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);
  body.appendListItem('Primary (B2B): Real estate agents, brokers, MLS executives').setGlyphType(DocumentApp.GlyphType.BULLET).setForegroundColor(BLACK);
  body.appendListItem('Primary (B2C): Home buyers seeking performance information').setGlyphType(DocumentApp.GlyphType.BULLET).setForegroundColor(BLACK);
  body.appendListItem('Secondary: Appraisers, energy professionals').setGlyphType(DocumentApp.GlyphType.BULLET).setForegroundColor(BLACK);
  
  body.appendParagraph('Q1 Budget (~$118,640)').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);
  styleDataTable(body.appendTable([
    ['Category', 'Audience', 'Details', 'Budget'],
    ['LinkedIn Always-On', 'B2B', '12 wks × $3K', '$36,000'],
    ['Campaign Sprint', 'B2B', '2 wks × $7.5K', '$15,000'],
    ['Geo-fence: Inman', 'B2B', 'Feb 3-5', '$16,320'],
        ['Atkinson (PR)', 'B2B', '3 months', '$13,500'],
    ['Front Page Sage (SEO)', 'B2C', '3 months', '$9,000'],
    ['Content Prod', 'B2B+B2C', 'Report, video', '$12,500']
  ]), BLUE, BLACK);
  
  body.appendParagraph('Q1 Events').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);
  styleDataTable(body.appendTable([
    ['Event', 'Date', 'LOE', 'Marketing Support'],
    ['Inman Connect NYC', 'Feb 3-5', 'High', 'Geo-fence + content + report'],
    ['ICE Experience', 'Mar 16-19', 'Med', 'Social, collateral'],
    ['Natl Home Perf Conf', 'Apr 13-16', 'High', 'Speaking + collateral']
  ]), BLUE, BLACK);
  
  body.appendParagraph('90-Day Goals').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);
  styleDataTable(body.appendTable([
    ['Goal', 'Metric', 'Target', 'Audience'],
    ['Media', 'Tier-1 placements', '2+', 'B2B+B2C'],
    ['Media', 'Total mentions', '15+', 'B2B+B2C'],
    ['Podcasts', 'Booked', '12-18', 'B2B+B2C'],
    ['Speaking', 'Events', '2+', 'B2B'],
    ['Content', 'Pillar pieces', '2', 'B2B+B2C'],
    ['Content', 'Derivatives', '20+', 'B2B+B2C'],
    ['Paid', 'Geo-fence campaigns', '2', 'B2B'],
    ['Foundation', 'Report downloads', '500+', 'B2C']
  ]), BLUE, BLACK);
  
  body.appendParagraph('Week-by-Week Execution').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);
  
  body.appendParagraph('WEEKS 1-2: Foundation (Jan 15-28)').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  styleDataTable(body.appendTable([
    ['Task', 'Owner', 'Deliverable'],
    ['Finalize report', 'Marketing + AI', 'Draft complete'],
    ['Brief Atkinson', 'Marketing', 'Kick-off call'],
    ['Speaker kit', 'Marketing + AI', 'Messaging doc'],
    ['Logo audit', 'Marketing', 'Guidelines confirmed'],
    ['Geo-fence setup', 'Marketing', 'Campaign ready'],
    ['Confirm Inman', 'Marketing + BD', 'Status confirmed']
  ]), BLUE, BLACK);
  body.appendParagraph('Milestone: Foundation ready, Inman campaign live').setBold(true).setForegroundColor(BLACK);
  
  body.appendParagraph('WEEKS 3-4: Inman NYC (Jan 29 - Feb 11)').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  styleDataTable(body.appendTable([
    ['Task', 'Owner', 'Deliverable'],
    ['Launch report', 'Marketing', 'Report live, gated'],
    ['Geo-fence at Inman', 'Marketing', 'Ads running'],
    ['LinkedIn surge', 'Marketing', 'Daily posts'],
    ['Media push', 'Atkinson', 'Pitches sent'],
    ['Email blast', 'Marketing', 'Announcement'],
    ['Social blitz', 'Marketing + AI', '2-3 posts/day'],
    ['Event content', 'Founders', 'Photos, quotes']
  ]), BLUE, BLACK);
  body.appendParagraph('Milestone: Inman executed, report launched, media hits').setBold(true).setForegroundColor(BLACK);
  
  body.appendParagraph('WEEKS 5-6: Momentum (Feb 12-25)').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  styleDataTable(body.appendTable([
    ['Task', 'Owner', 'Deliverable'],
        ['Podcast push', 'Atkinson', 'Pitches sent'],
    ['Derivative content', 'Marketing + AI', '8-10 pieces'],
    ['B2B blog', 'Marketing + AI', '2 posts'],
    ['B2C blog', 'Front Page Sage', '2 posts'],
    ['Media follow-up', 'Atkinson', 'Tracking'],
    ['Retargeting', 'Marketing', 'Always-on']
  ]), BLUE, BLACK);
  body.appendParagraph('Milestone: Podcast pipeline started, content flowing').setBold(true).setForegroundColor(BLACK);
  
  body.appendParagraph('WEEKS 7-8: Content Engine (Feb 26 - Mar 11)').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  styleDataTable(body.appendTable([
    ['Task', 'Owner', 'Deliverable'],
    ['Second pillar draft', 'Marketing + AI', 'Complete'],
    ['Podcast bookings', 'Atkinson', '4-6 confirmed'],
    ['Q2 calendar', 'Marketing + AI', 'Drafted'],
    ['Case study', 'Marketing + AI', '1 complete'],
    ['Media report', 'Atkinson', 'Summary'],
    ['ICE prep', 'Marketing', 'Collateral ready']
  ]), BLUE, BLACK);
  body.appendParagraph('Milestone: Content engine running, events prepped').setBold(true).setForegroundColor(BLACK);
  
  body.appendParagraph('WEEKS 9-10: Spring Prep (Mar 12-25)').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  styleDataTable(body.appendTable([
    ['Task', 'Owner', 'Deliverable'],
    ['Launch pillar 2', 'Marketing', 'Blog, social, email'],
    ['ICE Experience', 'BD + Marketing', 'Social coverage'],
    ['Confirm RESO', 'Product + Mktg', 'Status confirmed'],
    ['Confirm NAR Summit', 'BD + Marketing', 'Status confirmed'],
    ['Podcasts ongoing', 'Founders', '6+ completed'],
    ['Q1 metrics', 'Marketing', 'Dashboard']
  ]), BLUE, BLACK);
  body.appendParagraph('Milestone: Q2 events confirmed, Q1 documented').setBold(true).setForegroundColor(BLACK);
  
  body.appendParagraph('WEEKS 11-12: Assessment (Mar 26 - Apr 15)').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  styleDataTable(body.appendTable([
    ['Task', 'Owner', 'Deliverable'],
    ['90-day assessment', 'Marketing', 'Leadership report'],
    ['Home Perf Conf', 'BD + Marketing', 'Speaking + booth'],
    ['Q2 calendar final', 'Marketing', 'Confirmed'],
    ['Budget reconcile', 'Marketing', 'Spend vs plan'],
    ['Q2 content plan', 'Marketing + AI', 'Full quarter'],
    ['Investor summary', 'Marketing', 'Key stats']
  ]), BLUE, BLACK);
  body.appendParagraph('Milestone: Sprint complete, Q2 ready').setBold(true).setForegroundColor(BLACK);
  
  body.appendParagraph('Success Criteria (Day 90)').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);
  
  body.appendParagraph('Must Achieve:').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  body.appendListItem('Report launched with 500+ downloads').setGlyphType(DocumentApp.GlyphType.BULLET).setForegroundColor(BLACK);
  body.appendListItem('2+ Tier-1 media mentions').setGlyphType(DocumentApp.GlyphType.BULLET).setForegroundColor(BLACK);
  body.appendListItem('10+ total media mentions').setGlyphType(DocumentApp.GlyphType.BULLET).setForegroundColor(BLACK);
  body.appendListItem('12+ podcast appearances').setGlyphType(DocumentApp.GlyphType.BULLET).setForegroundColor(BLACK);
  body.appendListItem('Geo-fencing at 2 events').setGlyphType(DocumentApp.GlyphType.BULLET).setForegroundColor(BLACK);
  body.appendListItem('Speaker kit distributed').setGlyphType(DocumentApp.GlyphType.BULLET).setForegroundColor(BLACK);
  body.appendListItem('Q2 calendar confirmed').setGlyphType(DocumentApp.GlyphType.BULLET).setForegroundColor(BLACK);
  
  body.appendParagraph('Stretch Goals:').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  body.appendListItem('Speaking slot secured').setGlyphType(DocumentApp.GlyphType.BULLET).setForegroundColor(BLACK);
  body.appendListItem('Partnership activated').setGlyphType(DocumentApp.GlyphType.BULLET).setForegroundColor(BLACK);
  body.appendListItem('Case study published').setGlyphType(DocumentApp.GlyphType.BULLET).setForegroundColor(BLACK);
  body.appendListItem('25% traffic increase').setGlyphType(DocumentApp.GlyphType.BULLET).setForegroundColor(BLACK);
  
  doc.saveAndClose();
  Logger.log('Document created: ' + doc.getUrl());
}

function styleHeaderTable(table, grayColor) {
  for (var i = 0; i < table.getNumRows(); i++) {
    var row = table.getRow(i);
    for (var j = 0; j < row.getNumCells(); j++) {
      var cell = row.getCell(j);
      cell.setFontSize(11).setForegroundColor('#000000').setPaddingTop(4).setPaddingBottom(4).setPaddingLeft(6).setPaddingRight(6);
      if (j % 2 === 0) cell.setBackgroundColor(grayColor);
    }
  }
  table.setBorderWidth(1);
}

function styleDataTable(table, headerColor, bodyColor) {
  var headerRow = table.getRow(0);
  for (var j = 0; j < headerRow.getNumCells(); j++) {
    headerRow.getCell(j).setBackgroundColor(headerColor).setForegroundColor('#ffffff').setBold(true).setFontSize(11).setPaddingTop(6).setPaddingBottom(6).setPaddingLeft(6).setPaddingRight(6);
  }
  for (var i = 1; i < table.getNumRows(); i++) {
    var row = table.getRow(i);
    for (var j = 0; j < row.getNumCells(); j++) {
      row.getCell(j).setFontSize(11).setForegroundColor(bodyColor).setPaddingTop(4).setPaddingBottom(4).setPaddingLeft(6).setPaddingRight(6);
    }
  }
  table.setBorderWidth(1);
}
