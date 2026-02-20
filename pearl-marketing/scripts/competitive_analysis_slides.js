/**
 * Updates Competitive Landscape Analysis slide deck
 * Run: updateCompetitiveAnalysisDeck()
 *
 * Updates existing presentation in place
 */

function updateCompetitiveAnalysisDeck() {
  // Open existing presentation by ID
  var presentation = SlidesApp.openById('19kYXdOwhh1NCK3JSg3Vy3hAwWjAKXuo8GU7ueIpA1fU');

  // Pearl brand colors
  var navyBlue = '#1a4480';
  var pearlGreen = '#2eb67d';
  var white = '#ffffff';
  var lightGrey = '#f4f4f4';
  var black = '#000000';

  // Clear all existing slides
  var slides = presentation.getSlides();
  for (var i = slides.length - 1; i >= 0; i--) {
    slides[i].remove();
  }

  // SLIDE 1: Title Slide
  var slide1 = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  slide1.getBackground().setSolidFill(navyBlue);

  var title1 = slide1.insertTextBox('Competitive Landscape Analysis', 50, 250, 600, 80);
  title1.getText().getTextStyle().setFontSize(44).setForegroundColor(white).setBold(true);

  var subtitle1 = slide1.insertTextBox("Pearl's Position in the Home Performance Ecosystem", 50, 340, 600, 40);
  subtitle1.getText().getTextStyle().setFontSize(18).setForegroundColor(white);

  var presenter = slide1.insertTextBox('Marketing Team\nJanuary 22, 2026', 50, 450, 300, 60);
  presenter.getText().getTextStyle().setFontSize(14).setForegroundColor(white);

  // SLIDE 2: Agenda
  var slide2 = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);

  var agendaTitle = slide2.insertTextBox('Agenda', 50, 30, 400, 50);
  agendaTitle.getText().getTextStyle().setFontSize(36).setForegroundColor(navyBlue).setBold(true);

  var agendaItems = [
    ['01', 'Executive Summary', "Pearl's unique position"],
    ['02', 'The 5 Pillars', 'Coverage comparison'],
    ['03', 'Competitive Landscape', 'Category breakdown'],
    ['04', 'New Competitor Alert', 'Kukun PICO Score'],
    ['05', 'Partnership Strategy', 'Tiered opportunities'],
    ['06', 'Key Insights', 'Action items']
  ];

  var yPos = 100;
  for (var i = 0; i < agendaItems.length; i++) {
    var numBox = slide2.insertTextBox(agendaItems[i][0], 60, yPos, 50, 40);
    numBox.getText().getTextStyle().setFontSize(24).setForegroundColor(pearlGreen).setBold(true);

    var itemTitle = slide2.insertTextBox(agendaItems[i][1], 120, yPos, 250, 30);
    itemTitle.getText().getTextStyle().setFontSize(18).setForegroundColor(navyBlue).setBold(true);

    var itemDesc = slide2.insertTextBox(agendaItems[i][2], 120, yPos + 25, 400, 25);
    itemDesc.getText().getTextStyle().setFontSize(14).setForegroundColor(black);

    yPos += 65;
  }

  // SLIDE 3: Section Divider - Executive Summary
  createSectionDivider(presentation, '01', 'Executive Summary', navyBlue, pearlGreen, white);

  // SLIDE 4: Pearl's Unique Position
  var slide4 = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);

  var title4 = slide4.insertTextBox('Pearl Stands Alone', 50, 30, 600, 50);
  title4.getText().getTextStyle().setFontSize(32).setForegroundColor(navyBlue).setBold(true);

  // Left box
  var leftBox = slide4.insertShape(SlidesApp.ShapeType.RECTANGLE, 50, 100, 310, 280);
  leftBox.getFill().setSolidFill(lightGrey);
  leftBox.getBorder().setTransparent();

  var leftNum = slide4.insertTextBox('01', 70, 120, 50, 40);
  leftNum.getText().getTextStyle().setFontSize(24).setForegroundColor(pearlGreen).setBold(true);

  var leftTitle = slide4.insertTextBox('The Opportunity', 70, 160, 270, 30);
  leftTitle.getText().getTextStyle().setFontSize(18).setForegroundColor(navyBlue).setBold(true);

  var leftText = slide4.insertTextBox('Pearl is the ONLY solution covering all 5 pillars (Safety, Comfort, Operations, Resilience, Energy) for existing homes.\n\nMost competitors focus on 1-2 pillars.', 70, 195, 270, 150);
  leftText.getText().getTextStyle().setFontSize(14).setForegroundColor(black);

  // Right box
  var rightBox = slide4.insertShape(SlidesApp.ShapeType.RECTANGLE, 380, 100, 310, 280);
  rightBox.getFill().setSolidFill(lightGrey);
  rightBox.getBorder().setTransparent();

  var rightNum = slide4.insertTextBox('02', 400, 120, 50, 40);
  rightNum.getText().getTextStyle().setFontSize(24).setForegroundColor(pearlGreen).setBold(true);

  var rightTitle = slide4.insertTextBox('The Strategy', 400, 160, 270, 30);
  rightTitle.getText().getTextStyle().setFontSize(18).setForegroundColor(navyBlue).setBold(true);

  var rightText = slide4.insertTextBox('Embed Pearl\'s SCORE across the home assessment ecosystem through partnerships--not head-to-head competition.\n\nPosition as transaction infrastructure, not just another app.', 400, 195, 270, 150);
  rightText.getText().getTextStyle().setFontSize(14).setForegroundColor(black);

  // SLIDE 5: Market Opening
  var slide5 = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);

  var title5 = slide5.insertTextBox('Zillow Creates an Opening', 50, 30, 600, 50);
  title5.getText().getTextStyle().setFontSize(32).setForegroundColor(navyBlue).setBold(true);

  var keyInsight = slide5.insertTextBox('Key Insight:', 50, 120, 150, 30);
  keyInsight.getText().getTextStyle().setFontSize(18).setForegroundColor(navyBlue).setBold(true);

  var insightText = slide5.insertTextBox('Zillow removed First Street climate data (Dec 2025) due to industry pressure.\n\nRedfin is keeping it.', 50, 160, 400, 100);
  insightText.getText().getTextStyle().setFontSize(18).setForegroundColor(black);

  var opportunity = slide5.insertTextBox('Immediate partnership opportunity.', 50, 280, 400, 40);
  opportunity.getText().getTextStyle().setFontSize(24).setForegroundColor(pearlGreen).setBold(true);

  // SLIDE 6: Section Divider - 5 Pillars
  createSectionDivider(presentation, '02', "Pearl's 5 Pillars vs. Competition", navyBlue, pearlGreen, white);

  // SLIDE 7: 5 Pillars Coverage
  var slide7 = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);

  var title7 = slide7.insertTextBox('Pearl SCORE Covers What Others Don\'t', 50, 20, 620, 40);
  title7.getText().getTextStyle().setFontSize(28).setForegroundColor(navyBlue).setBold(true);

  var pillars = ['S', 'C', 'O', 'R', 'E'];
  var pillarNames = ['Safety', 'Comfort', 'Operations', 'Resilience', 'Energy'];
  var pillarCovers = ['Smart home platforms (limited)', 'Nest, Ecobee (HVAC only)', 'HomeZada, Kukun', 'First Street, Redfin', 'HERS, ENERGY STAR, Nest'];
  var pillarGaps = ['Most ignore', 'Narrow focus', 'Tracking, not scoring', 'Climate risk only', 'Crowded; new construction bias'];

  var xPos = 30;
  for (var i = 0; i < 5; i++) {
    var pillarBox = slide7.insertShape(SlidesApp.ShapeType.RECTANGLE, xPos, 70, 130, 260);
    pillarBox.getFill().setSolidFill(lightGrey);
    pillarBox.getBorder().setTransparent();

    var letter = slide7.insertTextBox(pillars[i], xPos + 50, 85, 40, 50);
    letter.getText().getTextStyle().setFontSize(36).setForegroundColor(navyBlue).setBold(true);

    var name = slide7.insertTextBox(pillarNames[i], xPos + 10, 140, 110, 25);
    name.getText().getTextStyle().setFontSize(14).setForegroundColor(navyBlue).setBold(true);

    var covers = slide7.insertTextBox(pillarCovers[i], xPos + 10, 170, 110, 60);
    covers.getText().getTextStyle().setFontSize(10).setForegroundColor(black);

    var gap = slide7.insertTextBox(pillarGaps[i], xPos + 10, 240, 110, 40);
    gap.getText().getTextStyle().setFontSize(10).setForegroundColor('#666666').setItalic(true);

    xPos += 140;
  }

  var diff = slide7.insertTextBox("Pearl's Differentiator: Only standardized score covering all 5 pillars for existing homes.", 50, 350, 620, 30);
  diff.getText().getTextStyle().setFontSize(14).setForegroundColor(navyBlue).setBold(true);

  // SLIDE 8: Pillar Coverage Matrix
  var slide8 = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);

  var title8 = slide8.insertTextBox('Competitor Pillar Coverage at a Glance', 50, 20, 620, 40);
  title8.getText().getTextStyle().setFontSize(28).setForegroundColor(navyBlue).setBold(true);

  var matrixData = [
    ['Company', 'S', 'C', 'O', 'R', 'E', 'Total'],
    ['Pearl', 'Y', 'Y', 'Y', 'Y', 'Y', '5/5'],
    ['Kukun (PICO)', '-', '-', 'Y', '-', '-', '1/5'],
    ['First Street', '-', '-', '-', 'Y', '-', '1/5'],
    ['Ecobee/Nest', '-', 'Y', '-', '-', 'Y', '2/5'],
    ['HomeZada', '-', '-', 'Y', '-', '-', '1/5'],
    ['Zillow', '-', '-', '-', '-', '-', '0/5']
  ];

  var table8 = slide8.insertTable(matrixData.length, matrixData[0].length);
  table8.setLeft(50);
  table8.setTop(80);

  for (var r = 0; r < matrixData.length; r++) {
    for (var c = 0; c < matrixData[r].length; c++) {
      var cell = table8.getCell(r, c);
      cell.getText().setText(matrixData[r][c]);
      cell.getText().getTextStyle().setFontSize(12);

      if (r === 0) {
        cell.getFill().setSolidFill(navyBlue);
        cell.getText().getTextStyle().setForegroundColor(white).setBold(true);
      } else if (r === 1) {
        cell.getFill().setSolidFill(pearlGreen);
        cell.getText().getTextStyle().setForegroundColor(white).setBold(true);
      } else {
        cell.getText().getTextStyle().setForegroundColor(black);
      }
    }
  }

  // SLIDE 9: Section Divider - Competitive Landscape
  createSectionDivider(presentation, '03', 'Competitive Landscape by Category', navyBlue, pearlGreen, white);

  // SLIDE 10: Real Estate Platforms
  createTableSlide(presentation, 'Real Estate Platforms',
    [['Company', 'Users', 'Pillars', 'Notes'],
     ['Zillow', '45M+', '0/5', 'Removed climate data Dec 2025'],
     ['Redfin', '30M+', 'Resilience', 'Keeping climate data--partnership candidate'],
     ['Realtor.com', '25M+', '0/5', 'NAR platform, no performance data']],
    'Opportunity: These platforms have massive reach but no comprehensive performance data.',
    navyBlue, white, black);

  // SLIDE 11: Climate/Risk Assessment
  createTableSlide(presentation, 'Climate/Risk Assessment',
    [['Company', 'Focus', 'Pillars', 'Notes'],
     ['First Street', 'Flood, fire, wind, heat', 'Resilience', 'Lost Zillow partnership'],
     ['ClimateCheck', 'Property climate risk', 'Resilience', 'B2B focus (lenders, insurers)']],
    'Opportunity: Strong in Resilience, but missing 4 other pillars. Data partnership potential.',
    navyBlue, white, black);

  // SLIDE 12: Energy Efficiency
  createTableSlide(presentation, 'Energy Efficiency',
    [['Company', 'Focus', 'Pillars', 'Notes'],
     ['RESNET/HERS', 'HERS Index ratings', 'Energy', 'Primarily new construction'],
     ['ENERGY STAR', 'New home certification', 'Energy', 'Government program'],
     ['Sense', 'Real-time monitoring', 'Energy', 'PIVOTING to utility B2B Dec 2025'],
     ['Ecobee/Nest', 'Smart thermostats', 'Comfort + Energy', '20M+ users combined']],
    'Challenge: Crowded space with new construction bias. Pearl differentiates with existing homes.',
    navyBlue, white, black);

  // SLIDE 13: Home Management
  createTableSlide(presentation, 'Home Management',
    [['Company', 'Focus', 'Pillars', 'Notes'],
     ['HomeZada', 'Inventory, maintenance, finances', 'Operations', 'Free-$99/yr'],
     ['Centriq', 'Appliance manuals', 'N/A', 'SHUT DOWN Jan 2025']],
    'Opportunity: Users track value; Pearl adds performance scoring.',
    navyBlue, white, black);

  // SLIDE 14: Property Condition & Valuation (NEW)
  createTableSlide(presentation, 'Property Condition & Valuation',
    [['Company', 'Focus', 'Pillars', 'Notes'],
     ['Kukun (PICO Score)', 'Property condition scoring, renovation ROI', 'Operations', 'Direct competitor--score affects value'],
     ['Homebot', 'Home finance insights for lenders/agents', '0/5', 'B2B engagement; distribution partner']],
    'Alert: Kukun PICO Score is the closest thing to Pearl\'s value proposition we\'ve seen.',
    navyBlue, white, black);

  // SLIDE 15: Smart Home Platforms
  createTableSlide(presentation, 'Smart Home Platforms',
    [['Company', 'Users', 'Pillars', 'Notes'],
     ['Google Home', '100M+', 'Safety + Ops + Energy', 'Limited performance data'],
     ['Apple Home', '50M+', 'Safety + Ops', 'Device ecosystem'],
     ['Samsung SmartThings', '70M+', 'Safety + Ops + Energy', 'Broad compatibility']],
    'Challenge: Massive user bases but focused on device control, not performance scoring.',
    navyBlue, white, black);

  // SLIDE 16: Section Divider - Competitor Alert
  createSectionDivider(presentation, '04', 'New Competitor Alert: Kukun', navyBlue, pearlGreen, white);

  // SLIDE 17: Kukun PICO Score
  var slide17 = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);

  var title17 = slide17.insertTextBox('Kukun PICO Score - Closest Competitor', 50, 20, 620, 40);
  title17.getText().getTextStyle().setFontSize(28).setForegroundColor(navyBlue).setBold(true);

  // Left column
  var leftBox17 = slide17.insertShape(SlidesApp.ShapeType.RECTANGLE, 50, 80, 310, 280);
  leftBox17.getFill().setSolidFill(lightGrey);
  leftBox17.getBorder().setTransparent();

  var leftTitle17 = slide17.insertTextBox('PICO Score Details', 70, 95, 270, 25);
  leftTitle17.getText().getTextStyle().setFontSize(16).setForegroundColor(navyBlue).setBold(true);

  var leftContent17 = slide17.insertTextBox('- Score range: 500-850\n- Claims estimates off by $20K-$50K\n- Asks about updates (roof, HVAC, kitchen)\n- Calculates actual vs. neighborhood value\n- Free forever\n- Covers: Operations only', 70, 130, 270, 180);
  leftContent17.getText().getTextStyle().setFontSize(13).setForegroundColor(black);

  // Right column
  var rightBox17 = slide17.insertShape(SlidesApp.ShapeType.RECTANGLE, 380, 80, 310, 280);
  rightBox17.getFill().setSolidFill(pearlGreen);
  rightBox17.getBorder().setTransparent();

  var rightTitle17 = slide17.insertTextBox('Pearl Comparison', 400, 95, 270, 25);
  rightTitle17.getText().getTextStyle().setFontSize(16).setForegroundColor(white).setBold(true);

  var rightContent17 = slide17.insertTextBox('- Pearl SCORE: Comprehensive\n- Full performance picture\n- All 5 pillars\n- Standardized national score\n- Value Before Verification\n- Covers: S-C-O-R-E (all 5)', 400, 130, 270, 180);
  rightContent17.getText().getTextStyle().setFontSize(13).setForegroundColor(white);

  // SLIDE 18: Kukun Key Takeaways
  var slide18 = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);

  var title18 = slide18.insertTextBox('Kukun: Key Takeaways', 50, 20, 620, 40);
  title18.getText().getTextStyle().setFontSize(28).setForegroundColor(navyBlue).setBold(true);

  var whyTitle = slide18.insertTextBox('Why they matter:', 50, 80, 200, 25);
  whyTitle.getText().getTextStyle().setFontSize(16).setForegroundColor(navyBlue).setBold(true);

  var whyContent = slide18.insertTextBox('- PICO Score directly ties property condition to home value\n- Same core value proposition as Pearl SCORE\n- Targets lenders (Property Condition Data API)\n- Free consumer product builds awareness', 50, 110, 400, 100);
  whyContent.getText().getTextStyle().setFontSize(14).setForegroundColor(black);

  var advTitle = slide18.insertTextBox('Pearl\'s advantage:', 50, 220, 200, 25);
  advTitle.getText().getTextStyle().setFontSize(16).setForegroundColor(pearlGreen).setBold(true);

  var advContent = slide18.insertTextBox('- Only covers Operations pillar (1/5)\n- No Safety, Comfort, Resilience, or Energy\n- No transaction infrastructure positioning\n- No 87M home registry', 50, 250, 400, 100);
  advContent.getText().getTextStyle().setFontSize(14).setForegroundColor(black);

  // SLIDE 19: Homebot
  var slide19 = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);

  var title19 = slide19.insertTextBox('Homebot - Potential Distribution Partner', 50, 20, 620, 40);
  title19.getText().getTextStyle().setFontSize(28).setForegroundColor(navyBlue).setBold(true);

  var whatTitle = slide19.insertTextBox('What they do:', 50, 80, 200, 25);
  whatTitle.getText().getTextStyle().setFontSize(16).setForegroundColor(navyBlue).setBold(true);

  var whatContent = slide19.insertTextBox('Home finance insights platform for loan officers and real estate agents', 50, 110, 350, 40);
  whatContent.getText().getTextStyle().setFontSize(14).setForegroundColor(black);

  // Stats boxes
  var stat1 = slide19.insertShape(SlidesApp.ShapeType.RECTANGLE, 50, 170, 130, 80);
  stat1.getFill().setSolidFill(lightGrey);
  stat1.getBorder().setTransparent();
  var stat1Num = slide19.insertTextBox('75%', 50, 180, 130, 40);
  stat1Num.getText().getTextStyle().setFontSize(28).setForegroundColor(pearlGreen).setBold(true);
  stat1Num.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
  var stat1Label = slide19.insertTextBox('open rate', 50, 215, 130, 25);
  stat1Label.getText().getTextStyle().setFontSize(12).setForegroundColor(black);
  stat1Label.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

  var stat2 = slide19.insertShape(SlidesApp.ShapeType.RECTANGLE, 200, 170, 130, 80);
  stat2.getFill().setSolidFill(lightGrey);
  stat2.getBorder().setTransparent();
  var stat2Num = slide19.insertTextBox('52%', 200, 180, 130, 40);
  stat2Num.getText().getTextStyle().setFontSize(28).setForegroundColor(pearlGreen).setBold(true);
  stat2Num.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
  var stat2Label = slide19.insertTextBox('monthly engagement', 200, 215, 130, 25);
  stat2Label.getText().getTextStyle().setFontSize(12).setForegroundColor(black);
  stat2Label.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

  var stat3 = slide19.insertShape(SlidesApp.ShapeType.RECTANGLE, 350, 170, 130, 80);
  stat3.getFill().setSolidFill(lightGrey);
  stat3.getBorder().setTransparent();
  var stat3Num = slide19.insertTextBox('4x', 350, 180, 130, 40);
  stat3Num.getText().getTextStyle().setFontSize(28).setForegroundColor(pearlGreen).setBold(true);
  stat3Num.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
  var stat3Label = slide19.insertTextBox('more likely to transact', 350, 215, 130, 25);
  stat3Label.getText().getTextStyle().setFontSize(12).setForegroundColor(black);
  stat3Label.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

  var oppTitle = slide19.insertTextBox('Partnership opportunity:', 50, 280, 250, 25);
  oppTitle.getText().getTextStyle().setFontSize(16).setForegroundColor(navyBlue).setBold(true);

  var oppContent = slide19.insertTextBox('Pearl data enriches Homebot\'s homeowner insights. Distribution channel with engaged audience.', 50, 310, 400, 50);
  oppContent.getText().getTextStyle().setFontSize(14).setForegroundColor(black);

  // SLIDE 20: Section Divider - Partnership Strategy
  createSectionDivider(presentation, '05', 'Partnership Strategy', navyBlue, pearlGreen, white);

  // SLIDE 21: Partnership Tiers Overview
  var slide21 = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);

  var title21 = slide21.insertTextBox('Partnership Opportunities by Tier', 50, 20, 620, 40);
  title21.getText().getTextStyle().setFontSize(28).setForegroundColor(navyBlue).setBold(true);

  var tiers = [
    ['01', 'Tier 1: High Priority', 'Redfin, Zillow, Realtor.com'],
    ['02', 'Tier 2: Complementary Data', 'First Street, Sense (B2B), Homebot'],
    ['03', 'Tier 3: Home Management', 'HomeZada'],
    ['04', 'Tier 4: Contractor Ecosystem', 'Angi, Thumbtack, Houzz']
  ];

  var tierX = 50;
  var tierY = 80;
  for (var i = 0; i < tiers.length; i++) {
    var tierBox = slide21.insertShape(SlidesApp.ShapeType.RECTANGLE, tierX, tierY, 310, 120);
    tierBox.getFill().setSolidFill(lightGrey);
    tierBox.getBorder().setTransparent();

    var tierNum = slide21.insertTextBox(tiers[i][0], tierX + 15, tierY + 15, 50, 30);
    tierNum.getText().getTextStyle().setFontSize(20).setForegroundColor(pearlGreen).setBold(true);

    var tierTitle = slide21.insertTextBox(tiers[i][1], tierX + 15, tierY + 45, 280, 25);
    tierTitle.getText().getTextStyle().setFontSize(14).setForegroundColor(navyBlue).setBold(true);

    var tierPartners = slide21.insertTextBox(tiers[i][2], tierX + 15, tierY + 70, 280, 40);
    tierPartners.getText().getTextStyle().setFontSize(12).setForegroundColor(black);

    tierX += 330;
    if (tierX > 400) {
      tierX = 50;
      tierY += 140;
    }
  }

  // SLIDE 22: Tier 1 Details
  createTableSlide(presentation, 'Tier 1: High Priority Partnerships',
    [['Partner', 'Opportunity', 'Rationale'],
     ['Redfin', 'Embed Pearl SCORE', 'Aligned on transparency, differentiation from Zillow'],
     ['Zillow', 'Replace First Street data', 'They need credible performance data'],
     ['Realtor.com', 'NAR relationship', 'Existing Pearl-NAR partnership']],
    'Strategy: Real estate portals need performance data. Pearl provides comprehensive solution.',
    navyBlue, white, black);

  // SLIDE 23: Tier 2 Details
  createTableSlide(presentation, 'Tier 2: Complementary Data Partners',
    [['Partner', 'Opportunity', 'Rationale'],
     ['First Street', 'Data partnership', 'They have Resilience; Pearl has 4 other pillars'],
     ['Sense', 'Utility partnership', 'Pivoting to B2B; 3.7M smart meters'],
     ['Homebot', 'Distribution channel', '75% open rates; Pearl data enriches insights']],
    'Strategy: Combine strengths to create more complete picture.',
    navyBlue, white, black);

  // SLIDE 24: Section Divider - Key Insights
  createSectionDivider(presentation, '06', 'Key Insights & Market Context', navyBlue, pearlGreen, white);

  // SLIDE 25: 6 Key Insights
  var slide25 = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);

  var title25 = slide25.insertTextBox('Key Insights', 50, 20, 620, 40);
  title25.getText().getTextStyle().setFontSize(28).setForegroundColor(navyBlue).setBold(true);

  var insights = [
    ['01', 'No direct competitor covers all 5 pillars for existing homes'],
    ['02', 'Zillow/First Street breakup creates immediate opening'],
    ['03', 'Energy is crowded; Resilience is hot--lead with 5-pillar story'],
    ['04', 'Consumer demand is real: 86% of buyers want climate-resilient features'],
    ['05', 'B2B opportunity: Lenders/insurers need property-level data; Pearl\'s 87M home registry is unique'],
    ['06', 'Kukun is closest competitor--PICO Score ties condition to value, but only covers Operations (1/5)']
  ];

  var insightX = 50;
  var insightY = 70;
  for (var i = 0; i < insights.length; i++) {
    var insightBox = slide25.insertShape(SlidesApp.ShapeType.RECTANGLE, insightX, insightY, 215, 100);
    insightBox.getFill().setSolidFill(lightGrey);
    insightBox.getBorder().setTransparent();

    var insightNum = slide25.insertTextBox(insights[i][0], insightX + 10, insightY + 10, 40, 25);
    insightNum.getText().getTextStyle().setFontSize(16).setForegroundColor(pearlGreen).setBold(true);

    var insightText = slide25.insertTextBox(insights[i][1], insightX + 10, insightY + 35, 195, 60);
    insightText.getText().getTextStyle().setFontSize(10).setForegroundColor(black);

    insightX += 230;
    if (insightX > 500) {
      insightX = 50;
      insightY += 115;
    }
  }

  // SLIDE 26: Section Divider - Consolidation Threats
  createSectionDivider(presentation, '07', 'Consolidation Threat Analysis', navyBlue, pearlGreen, white);

  // SLIDE 27: Threat Heatmap
  var slideHeatmap = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);

  var titleHeatmap = slideHeatmap.insertTextBox('Competitor Coverage Heatmap', 50, 15, 620, 35);
  titleHeatmap.getText().getTextStyle().setFontSize(24).setForegroundColor(navyBlue).setBold(true);

  var subtitleHeatmap = slideHeatmap.insertTextBox('Risk: 2-3 companies merging could close Pearl\'s competitive gap', 50, 45, 500, 20);
  subtitleHeatmap.getText().getTextStyle().setFontSize(11).setForegroundColor('#666666').setItalic(true);

  // Heatmap colors
  var threatRed = '#cc0000';
  var threatOrange = '#e67300';
  var threatYellow = '#cccc00';
  var safeGreen = '#2eb67d';
  var emptyGrey = '#e0e0e0';

  // Heatmap data: [Company, S, C, O, R, E, ThreatLevel]
  // ThreatLevel: 1=existential, 2=significant, 3=monitor
  var heatmapData = [
    ['Pearl', 'Y', 'Y', 'Y', 'Y', 'Y', 0],
    ['Kukun (HIGHEST)', '-', '-', 'Y', '-', '-', 1],
    ['Google/Nest (36M)', 'Y', 'Y', '-', '-', 'Y', 2],
    ['First Street (B2B)', '-', '-', '-', 'Y', '-', 2],
    ['Zillow (45M)', '-', '-', '-', '-', '-', 1],
    ['Redfin (30M)', '-', '-', '-', 'Y', '-', 2],
    ['Sense (PIVOTING)', '-', '-', '-', '-', 'Y', 3],
    ['HomeZada', '-', '-', 'Y', '-', '-', 3]
  ];

  // Draw heatmap header
  var pillars = ['S', 'C', 'O', 'R', 'E'];
  var cellW = 50;
  var cellH = 30;
  var startX = 180;
  var startY = 75;

  for (var p = 0; p < pillars.length; p++) {
    var headerCell = slideHeatmap.insertShape(SlidesApp.ShapeType.RECTANGLE, startX + (p * cellW), startY, cellW, cellH);
    headerCell.getFill().setSolidFill(navyBlue);
    headerCell.getBorder().setTransparent();
    var headerText = slideHeatmap.insertTextBox(pillars[p], startX + (p * cellW), startY + 5, cellW, cellH);
    headerText.getText().getTextStyle().setFontSize(14).setForegroundColor(white).setBold(true);
    headerText.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
  }

  // Threat level header
  var threatHeader = slideHeatmap.insertShape(SlidesApp.ShapeType.RECTANGLE, startX + (5 * cellW), startY, 80, cellH);
  threatHeader.getFill().setSolidFill(navyBlue);
  threatHeader.getBorder().setTransparent();
  var threatHeaderText = slideHeatmap.insertTextBox('Threat', startX + (5 * cellW), startY + 5, 80, cellH);
  threatHeaderText.getText().getTextStyle().setFontSize(12).setForegroundColor(white).setBold(true);
  threatHeaderText.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

  // Draw heatmap rows
  for (var r = 0; r < heatmapData.length; r++) {
    var rowY = startY + ((r + 1) * cellH);
    var row = heatmapData[r];
    var threatLevel = row[6];

    // Company name
    var companyCell = slideHeatmap.insertShape(SlidesApp.ShapeType.RECTANGLE, 50, rowY, 130, cellH);
    if (r === 0) {
      companyCell.getFill().setSolidFill(safeGreen);
    } else {
      companyCell.getFill().setSolidFill(lightGrey);
    }
    companyCell.getBorder().setTransparent();
    var companyText = slideHeatmap.insertTextBox(row[0], 55, rowY + 5, 120, cellH);
    companyText.getText().getTextStyle().setFontSize(11).setForegroundColor(r === 0 ? white : black).setBold(r === 0);

    // Pillar cells
    for (var c = 1; c <= 5; c++) {
      var cellColor = row[c] === 'Y' ? (r === 0 ? safeGreen : threatOrange) : emptyGrey;
      var dataCell = slideHeatmap.insertShape(SlidesApp.ShapeType.RECTANGLE, startX + ((c-1) * cellW), rowY, cellW, cellH);
      dataCell.getFill().setSolidFill(cellColor);
      dataCell.getBorder().setTransparent();
      var cellText = slideHeatmap.insertTextBox(row[c], startX + ((c-1) * cellW), rowY + 5, cellW, cellH);
      cellText.getText().getTextStyle().setFontSize(12).setForegroundColor(row[c] === 'Y' ? white : '#999999');
      cellText.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
    }

    // Threat level indicator
    var threatColors = [safeGreen, threatRed, threatOrange, threatYellow];
    var threatLabels = ['LEADER', 'TIER 1', 'TIER 2', 'TIER 3'];
    var threatCell = slideHeatmap.insertShape(SlidesApp.ShapeType.RECTANGLE, startX + (5 * cellW), rowY, 80, cellH);
    threatCell.getFill().setSolidFill(threatColors[threatLevel]);
    threatCell.getBorder().setTransparent();
    var threatText = slideHeatmap.insertTextBox(threatLabels[threatLevel], startX + (5 * cellW), rowY + 5, 80, cellH);
    threatText.getText().getTextStyle().setFontSize(10).setForegroundColor(white).setBold(true);
    threatText.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
  }

  // Legend
  var legendY = 350;
  var legendItems = [
    [threatRed, 'Tier 1: Existential'],
    [threatOrange, 'Tier 2: Significant'],
    [threatYellow, 'Tier 3: Monitor'],
    [safeGreen, 'Pearl (Leader)']
  ];
  for (var l = 0; l < legendItems.length; l++) {
    var legendBox = slideHeatmap.insertShape(SlidesApp.ShapeType.RECTANGLE, 50 + (l * 170), legendY, 15, 15);
    legendBox.getFill().setSolidFill(legendItems[l][0]);
    legendBox.getBorder().setTransparent();
    var legendLabel = slideHeatmap.insertTextBox(legendItems[l][1], 70 + (l * 170), legendY - 2, 140, 20);
    legendLabel.getText().getTextStyle().setFontSize(10).setForegroundColor(black);
  }

  // SLIDE 28: Merger Threat Matrix
  var slideMerger = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);

  var titleMerger = slideMerger.insertTextBox('Merger Threat Scenarios', 50, 20, 620, 40);
  titleMerger.getText().getTextStyle().setFontSize(28).setForegroundColor(navyBlue).setBold(true);

  // Tier 1 box
  var tier1Box = slideMerger.insertShape(SlidesApp.ShapeType.RECTANGLE, 30, 70, 220, 160);
  tier1Box.getFill().setSolidFill('#ffcccc');
  tier1Box.getBorder().getLineFill().setSolidFill(threatRed);

  var tier1Title = slideMerger.insertTextBox('TIER 1: EXISTENTIAL', 40, 80, 200, 25);
  tier1Title.getText().getTextStyle().setFontSize(12).setForegroundColor(threatRed).setBold(true);

  var tier1Content = slideMerger.insertTextBox('Kukun + First Street\n  -> O + R (2/5) + Scoring\n\nZillow + Kukun\n  -> O + 45M users\n\nRedfin + Kukun\n  -> O + R + Transparency', 40, 105, 200, 120);
  tier1Content.getText().getTextStyle().setFontSize(10).setForegroundColor(black);

  // Tier 2 box
  var tier2Box = slideMerger.insertShape(SlidesApp.ShapeType.RECTANGLE, 260, 70, 220, 160);
  tier2Box.getFill().setSolidFill('#ffe6cc');
  tier2Box.getBorder().getLineFill().setSolidFill(threatOrange);

  var tier2Title = slideMerger.insertTextBox('TIER 2: SIGNIFICANT', 270, 80, 200, 25);
  tier2Title.getText().getTextStyle().setFontSize(12).setForegroundColor(threatOrange).setBold(true);

  var tier2Content = slideMerger.insertTextBox('Google/Nest + First Street\n  -> S + C + E + R (4/5)\n\nKukun + Sense\n  -> O + E (2/5) + B2B\n\nZillow + First Street\n  -> R + 45M users (reconcile)', 270, 105, 200, 120);
  tier2Content.getText().getTextStyle().setFontSize(10).setForegroundColor(black);

  // Tier 3 box
  var tier3Box = slideMerger.insertShape(SlidesApp.ShapeType.RECTANGLE, 490, 70, 200, 160);
  tier3Box.getFill().setSolidFill('#ffffcc');
  tier3Box.getBorder().getLineFill().setSolidFill(threatYellow);

  var tier3Title = slideMerger.insertTextBox('TIER 3: MONITOR', 500, 80, 180, 25);
  tier3Title.getText().getTextStyle().setFontSize(12).setForegroundColor('#999900').setBold(true);

  var tier3Content = slideMerger.insertTextBox('First Street + ClimateCheck\n  -> Resilience monopoly\n\nCentriq: SHUT DOWN\n  (Jan 2025)\n\nSense: PIVOTING\n  (Utility B2B only)', 500, 105, 180, 120);
  tier3Content.getText().getTextStyle().setFontSize(10).setForegroundColor(black);

  // Defensive strategy callout
  var defenseBox = slideMerger.insertShape(SlidesApp.ShapeType.RECTANGLE, 30, 250, 660, 100);
  defenseBox.getFill().setSolidFill(navyBlue);
  defenseBox.getBorder().setTransparent();

  var defenseTitle = slideMerger.insertTextBox('DEFENSIVE STRATEGY', 50, 260, 200, 25);
  defenseTitle.getText().getTextStyle().setFontSize(14).setForegroundColor(pearlGreen).setBold(true);

  var defenseContent = slideMerger.insertTextBox('1. Move FAST on Tier 1 partnerships -- lock in Redfin, Zillow, or First Street before competitors do\n2. Monitor M&A activity -- track funding rounds and acquisition rumors for Kukun, First Street, Sense\n3. Build switching costs -- deep integrations make Pearl harder to replace\n4. Lead with 5-pillar story -- even merged competitors need time to integrate; Pearl is ready NOW', 50, 285, 620, 60);
  defenseContent.getText().getTextStyle().setFontSize(10).setForegroundColor(white);

  // SLIDE 29: Market Stats
  var slide29 = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);

  var title29 = slide29.insertTextBox('Consumer Demand is Real', 50, 20, 620, 40);
  title29.getText().getTextStyle().setFontSize(28).setForegroundColor(navyBlue).setBold(true);

  var stats = [
    ['86%', 'of buyers want at least one climate-resilient feature', '(Zillow)'],
    ['80%+', 'consider climate risk in purchase decisions', ' '],
    ['67%', 'say low disaster risk is non-negotiable', '(Redfin)']
  ];

  var statX = 50;
  for (var i = 0; i < stats.length; i++) {
    var statBox = slide29.insertShape(SlidesApp.ShapeType.RECTANGLE, statX, 100, 200, 200);
    statBox.getFill().setSolidFill(lightGrey);
    statBox.getBorder().setTransparent();

    var statNum = slide29.insertTextBox(stats[i][0], statX, 130, 200, 60);
    statNum.getText().getTextStyle().setFontSize(48).setForegroundColor(pearlGreen).setBold(true);
    statNum.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

    var statLabel = slide29.insertTextBox(stats[i][1], statX + 15, 200, 170, 60);
    statLabel.getText().getTextStyle().setFontSize(12).setForegroundColor(black);
    statLabel.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

    var statSource = slide29.insertTextBox(stats[i][2], statX + 15, 260, 170, 25);
    statSource.getText().getTextStyle().setFontSize(10).setForegroundColor('#666666').setItalic(true);
    statSource.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

    statX += 220;
  }

  // SLIDE 30: Strategic Recommendations
  var slide30 = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);

  var title30 = slide30.insertTextBox('Strategic Recommendations', 50, 20, 620, 40);
  title30.getText().getTextStyle().setFontSize(28).setForegroundColor(navyBlue).setBold(true);

  var recs = [
    ['01', 'Lead with 5 Pillars', 'Pearl\'s comprehensive coverage is the key differentiator. No competitor matches all 5 pillars for existing homes.'],
    ['02', 'Pursue Partnerships', 'Prioritize Redfin (aligned values), Zillow (data gap), and Realtor.com (existing NAR relationship).'],
    ['03', 'Monitor Kukun', 'PICO Score is the closest competitive threat. Track their lender partnerships and consumer adoption.']
  ];

  var recX = 50;
  for (var i = 0; i < recs.length; i++) {
    var recBox = slide30.insertShape(SlidesApp.ShapeType.RECTANGLE, recX, 80, 210, 260);
    recBox.getFill().setSolidFill(lightGrey);
    recBox.getBorder().setTransparent();

    var recNum = slide30.insertTextBox(recs[i][0], recX + 15, 95, 50, 30);
    recNum.getText().getTextStyle().setFontSize(20).setForegroundColor(pearlGreen).setBold(true);

    var recTitle = slide30.insertTextBox(recs[i][1], recX + 15, 130, 180, 30);
    recTitle.getText().getTextStyle().setFontSize(14).setForegroundColor(navyBlue).setBold(true);

    var recContent = slide30.insertTextBox(recs[i][2], recX + 15, 165, 180, 150);
    recContent.getText().getTextStyle().setFontSize(12).setForegroundColor(black);

    recX += 225;
  }

  // SLIDE 31: Closing Slide
  var slide31 = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  slide31.getBackground().setSolidFill(navyBlue);

  var closing = slide31.insertTextBox('pearlscore.com', 200, 300, 320, 50);
  closing.getText().getTextStyle().setFontSize(24).setForegroundColor(white);
  closing.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

  // Log the URL
  Logger.log('Presentation updated: ' + presentation.getUrl());

  return presentation.getUrl();
}

// Helper function: Create section divider slide
function createSectionDivider(presentation, number, title, navyBlue, pearlGreen, white) {
  var slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  slide.getBackground().setSolidFill(navyBlue);

  var numText = slide.insertTextBox(number, 50, 200, 100, 60);
  numText.getText().getTextStyle().setFontSize(48).setForegroundColor(pearlGreen).setBold(true);

  var titleText = slide.insertTextBox(title, 50, 260, 600, 60);
  titleText.getText().getTextStyle().setFontSize(36).setForegroundColor(white).setBold(true);

  return slide;
}

// Helper function: Create table slide
function createTableSlide(presentation, title, tableData, footnote, navyBlue, white, black) {
  var slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);

  var titleBox = slide.insertTextBox(title, 50, 20, 620, 40);
  titleBox.getText().getTextStyle().setFontSize(28).setForegroundColor(navyBlue).setBold(true);

  var table = slide.insertTable(tableData.length, tableData[0].length);
  table.setLeft(50);
  table.setTop(80);

  for (var r = 0; r < tableData.length; r++) {
    for (var c = 0; c < tableData[r].length; c++) {
      var cell = table.getCell(r, c);
      cell.getText().setText(tableData[r][c]);
      cell.getText().getTextStyle().setFontSize(11);

      if (r === 0) {
        cell.getFill().setSolidFill(navyBlue);
        cell.getText().getTextStyle().setForegroundColor(white).setBold(true);
      } else {
        cell.getText().getTextStyle().setForegroundColor(black);
      }
    }
  }

  if (footnote) {
    var footBox = slide.insertTextBox(footnote, 50, 330, 620, 40);
    footBox.getText().getTextStyle().setFontSize(12).setForegroundColor(navyBlue).setBold(true);
  }

  return slide;
}
