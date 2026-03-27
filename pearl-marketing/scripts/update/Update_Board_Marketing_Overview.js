/**
 * Updates the Board Marketing Overview presentation
 * Presentation ID: 1kz-4Xm7f4gQwab82nFlLqZSVjIkeFdJ-8zIIqX6hb_Y
 * 6 slides: B2B Strategy, B2C Strategy, Agency Partners, Calendar, Metrics, 90-Day Focus
 */

function updateBoardMarketingOverview() {
  var presentationId = '1kz-4Xm7f4gQwab82nFlLqZSVjIkeFdJ-8zIIqX6hb_Y';
  var presentation = SlidesApp.openById(presentationId);

  // Remove existing slides
  var slides = presentation.getSlides();
  for (var i = slides.length - 1; i >= 0; i--) {
    slides[i].remove();
  }

  // Pearl brand colors (Master Theme 2025)
  var darkBlue = '#0c3860';
  var pearlBlue = '#1c4c75';
  var teal = '#04b290';
  var lightBlue = '#e8f4f8';
  var lightTeal = '#e6f5f3';
  var white = '#ffffff';

  // =====================
  // SLIDE 1: B2B STRATEGY
  // =====================
  var slide1 = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  slide1.getBackground().setSolidFill(white);

  var title1 = slide1.insertTextBox('Pearl Marketing Strategy Overview: B2B', 40, 25, 600, 45);
  title1.getText().getTextStyle().setFontSize(26).setBold(true).setForegroundColor(darkBlue);

  var meta1 = slide1.insertTextBox(
    'Audience: Real Estate Professionals\n' +
    'Main message: Pearl is the standard for home performance rating\n' +
    'Strategy: Drumbeat, Surge',
    40, 75, 600, 60
  );
  meta1.getText().getTextStyle().setFontSize(11).setItalic(true).setForegroundColor(pearlBlue);

  // Table headers
  var drumHeader = slide1.insertShape(SlidesApp.ShapeType.RECTANGLE, 200, 145, 200, 35);
  drumHeader.getFill().setSolidFill(darkBlue);
  drumHeader.getBorder().setTransparent();
  drumHeader.getText().setText('Drumbeat\n(Continuous activities)');
  drumHeader.getText().getTextStyle().setFontSize(10).setBold(true).setForegroundColor(white);
  drumHeader.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

  var surgeHeader = slide1.insertShape(SlidesApp.ShapeType.RECTANGLE, 410, 145, 250, 35);
  surgeHeader.getFill().setSolidFill(darkBlue);
  surgeHeader.getBorder().setTransparent();
  surgeHeader.getText().setText('Surge\n(Sprints around event or milestone)');
  surgeHeader.getText().getTextStyle().setFontSize(10).setBold(true).setForegroundColor(white);
  surgeHeader.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

  // Row labels and content
  var rows = [
    { label: 'Owned', drum: '• Social media\n• Blog', surge: '• Social Media\n• Blog' },
    { label: 'Paid', drum: '• Speaker opportunities\n• LinkedIn ads', surge: '• Targeted LinkedIn ads\n• Targeted geofenced ads (10 events)\n• Event sponsorships' },
    { label: 'Partner', drum: '• Targeting media pitching\n• Editorials/Commentaries', surge: '• Press releases' }
  ];

  var yPos = 185;
  rows.forEach(function(row) {
    var labelBox = slide1.insertShape(SlidesApp.ShapeType.RECTANGLE, 40, yPos, 150, 55);
    labelBox.getFill().setSolidFill(lightBlue);
    labelBox.getBorder().setWeight(1).getLineFill().setSolidFill('#cccccc');
    labelBox.getText().setText(row.label);
    labelBox.getText().getTextStyle().setFontSize(12).setBold(true).setForegroundColor(darkBlue);
    labelBox.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

    var drumBox = slide1.insertShape(SlidesApp.ShapeType.RECTANGLE, 200, yPos, 200, 55);
    drumBox.getFill().setSolidFill(white);
    drumBox.getBorder().setWeight(1).getLineFill().setSolidFill('#cccccc');
    drumBox.getText().setText(row.drum);
    drumBox.getText().getTextStyle().setFontSize(9).setForegroundColor(darkBlue);

    var surgeBox = slide1.insertShape(SlidesApp.ShapeType.RECTANGLE, 410, yPos, 250, 55);
    surgeBox.getFill().setSolidFill(white);
    surgeBox.getBorder().setWeight(1).getLineFill().setSolidFill('#cccccc');
    surgeBox.getText().setText(row.surge);
    surgeBox.getText().getTextStyle().setFontSize(9).setForegroundColor(darkBlue);

    yPos += 60;
  });

  // Key Moments row
  var momentsLabel = slide1.insertShape(SlidesApp.ShapeType.RECTANGLE, 40, yPos, 150, 35);
  momentsLabel.getFill().setSolidFill(lightBlue);
  momentsLabel.getBorder().setWeight(1).getLineFill().setSolidFill('#cccccc');
  momentsLabel.getText().setText('Key Moments');
  momentsLabel.getText().getTextStyle().setFontSize(12).setBold(true).setForegroundColor(darkBlue);
  momentsLabel.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

  var momentsContent = slide1.insertShape(SlidesApp.ShapeType.RECTANGLE, 200, yPos, 460, 35);
  momentsContent.getFill().setSolidFill(white);
  momentsContent.getBorder().setWeight(1).getLineFill().setSolidFill('#cccccc');
  momentsContent.getText().setText('Inman Connect NYC & San Diego  •  NAR Sustainability Summit  •  T3 Sixty  •  NAR NXT');
  momentsContent.getText().getTextStyle().setFontSize(10).setForegroundColor(darkBlue);
  momentsContent.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

  // Bottom tagline
  var tagline1 = slide1.insertTextBox('All channels activate together during key industry moments for maximum impact.', 40, 410, 620, 25);
  tagline1.getText().getTextStyle().setFontSize(11).setBold(true).setForegroundColor(darkBlue);

  // =====================
  // SLIDE 2: B2C STRATEGY
  // =====================
  var slide2 = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  slide2.getBackground().setSolidFill(white);

  var title2 = slide2.insertTextBox('Pearl Marketing Strategy Overview: B2C', 40, 25, 600, 45);
  title2.getText().getTextStyle().setFontSize(26).setBold(true).setForegroundColor(darkBlue);

  var meta2 = slide2.insertTextBox(
    'Audience: Homebuyers\n' +
    'Main message: Pearl helps buyers understand what it\'s actually like to live in a home\n' +
    'Strategy: Drumbeat, Surge',
    40, 75, 600, 60
  );
  meta2.getText().getTextStyle().setFontSize(11).setItalic(true).setForegroundColor(teal);

  // Table headers
  var drumHeader2 = slide2.insertShape(SlidesApp.ShapeType.RECTANGLE, 200, 145, 200, 35);
  drumHeader2.getFill().setSolidFill(teal);
  drumHeader2.getBorder().setTransparent();
  drumHeader2.getText().setText('Drumbeat\n(Continuous activities)');
  drumHeader2.getText().getTextStyle().setFontSize(10).setBold(true).setForegroundColor(white);
  drumHeader2.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

  var surgeHeader2 = slide2.insertShape(SlidesApp.ShapeType.RECTANGLE, 410, 145, 250, 35);
  surgeHeader2.getFill().setSolidFill(teal);
  surgeHeader2.getBorder().setTransparent();
  surgeHeader2.getText().setText('Surge\n(Sprints around event or milestone)');
  surgeHeader2.getText().getTextStyle().setFontSize(10).setBold(true).setForegroundColor(white);
  surgeHeader2.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

  // Row labels and content
  var rows2 = [
    { label: 'Owned', drum: '• Social media\n• Blog', surge: '• Social Media\n• Blog\n• Email Marketing' },
    { label: 'Paid', drum: '• Meta ads', surge: '• Targeted LinkedIn ads' },
    { label: 'Partner', drum: '• AI-optimized blog posts\n• AI-optimized social media posts', surge: ' ' }
  ];

  yPos = 185;
  rows2.forEach(function(row) {
    var labelBox = slide2.insertShape(SlidesApp.ShapeType.RECTANGLE, 40, yPos, 150, 55);
    labelBox.getFill().setSolidFill(lightTeal);
    labelBox.getBorder().setWeight(1).getLineFill().setSolidFill('#cccccc');
    labelBox.getText().setText(row.label);
    labelBox.getText().getTextStyle().setFontSize(12).setBold(true).setForegroundColor(darkBlue);
    labelBox.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

    var drumBox = slide2.insertShape(SlidesApp.ShapeType.RECTANGLE, 200, yPos, 200, 55);
    drumBox.getFill().setSolidFill(white);
    drumBox.getBorder().setWeight(1).getLineFill().setSolidFill('#cccccc');
    drumBox.getText().setText(row.drum);
    drumBox.getText().getTextStyle().setFontSize(9).setForegroundColor(darkBlue);

    var surgeBox = slide2.insertShape(SlidesApp.ShapeType.RECTANGLE, 410, yPos, 250, 55);
    surgeBox.getFill().setSolidFill(white);
    surgeBox.getBorder().setWeight(1).getLineFill().setSolidFill('#cccccc');
    surgeBox.getText().setText(row.surge);
    surgeBox.getText().getTextStyle().setFontSize(9).setForegroundColor(darkBlue);

    yPos += 60;
  });

  // Key Moments row
  var momentsLabel2 = slide2.insertShape(SlidesApp.ShapeType.RECTANGLE, 40, yPos, 150, 35);
  momentsLabel2.getFill().setSolidFill(lightTeal);
  momentsLabel2.getBorder().setWeight(1).getLineFill().setSolidFill('#cccccc');
  momentsLabel2.getText().setText('Key Moments');
  momentsLabel2.getText().getTextStyle().setFontSize(12).setBold(true).setForegroundColor(darkBlue);
  momentsLabel2.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

  var momentsContent2 = slide2.insertShape(SlidesApp.ShapeType.RECTANGLE, 200, yPos, 460, 35);
  momentsContent2.getFill().setSolidFill(white);
  momentsContent2.getBorder().setWeight(1).getLineFill().setSolidFill('#cccccc');
  momentsContent2.getText().setText('Spring Buying Season (Mar)  •  Storm Season (Jul)  •  Fall Buying Season (Sep)');
  momentsContent2.getText().getTextStyle().setFontSize(10).setForegroundColor(darkBlue);
  momentsContent2.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

  // Bottom tagline
  var tagline2 = slide2.insertTextBox('All channels activate together during key industry moments for maximum impact.', 40, 410, 620, 25);
  tagline2.getText().getTextStyle().setFontSize(11).setBold(true).setForegroundColor(darkBlue);

  // =====================
  // SLIDE 3: AGENCY PARTNERS
  // =====================
  var slide3 = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  slide3.getBackground().setSolidFill(white);

  var title3 = slide3.insertTextBox('Agency Partners', 40, 30, 640, 50);
  title3.getText().getTextStyle().setFontSize(28).setBold(true).setForegroundColor(darkBlue);

  // Left card - Atkinson
  var atkCard = slide3.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, 40, 100, 320, 250);
  atkCard.getFill().setSolidFill('#f5f5f5');
  atkCard.getBorder().setTransparent();

  var atkBadge = slide3.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, 55, 115, 120, 24);
  atkBadge.getFill().setSolidFill(darkBlue);
  atkBadge.getBorder().setTransparent();
  atkBadge.getText().setText('MEDIA PARTNER');
  atkBadge.getText().getTextStyle().setFontSize(9).setBold(true).setForegroundColor(white);
  atkBadge.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

  var atkTitle = slide3.insertTextBox('Atkinson Strategic Group', 55, 150, 290, 30);
  atkTitle.getText().getTextStyle().setFontSize(18).setBold(true).setForegroundColor(darkBlue);

  var atkDesc = slide3.insertTextBox('National media outreach focusing on B2B/Real Estate publications.', 55, 185, 290, 40);
  atkDesc.getText().getTextStyle().setFontSize(11).setItalic(true).setForegroundColor(pearlBlue);

  var atkDeliverables = slide3.insertTextBox(
    'Deliverables:\n' +
    '• Media pitches to journalists\n' +
    '• Podcast booking\n' +
    '• Press release drafting\n' +
    '• Media monitoring',
    55, 230, 290, 100
  );
  atkDeliverables.getText().getTextStyle().setFontSize(11).setForegroundColor(darkBlue);
  atkDeliverables.getText().getRange(0, 13).getTextStyle().setBold(true);

  // Right card - First Page Sage
  var fpsCard = slide3.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, 380, 100, 320, 250);
  fpsCard.getFill().setSolidFill('#f5f5f5');
  fpsCard.getBorder().setTransparent();

  var fpsBadge = slide3.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, 395, 115, 120, 24);
  fpsBadge.getFill().setSolidFill(teal);
  fpsBadge.getBorder().setTransparent();
  fpsBadge.getText().setText('SEO/AI PARTNER');
  fpsBadge.getText().getTextStyle().setFontSize(9).setBold(true).setForegroundColor(white);
  fpsBadge.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

  var fpsTitle = slide3.insertTextBox('First Page Sage', 395, 150, 290, 30);
  fpsTitle.getText().getTextStyle().setFontSize(18).setBold(true).setForegroundColor(darkBlue);

  var fpsDesc = slide3.insertTextBox('B2C content strategy focusing on increasing AI response appearances for homebuyer audience.', 395, 185, 290, 40);
  fpsDesc.getText().getTextStyle().setFontSize(11).setItalic(true).setForegroundColor(teal);

  var fpsDeliverables = slide3.insertTextBox(
    'Deliverables:\n' +
    '• SEO blog articles\n' +
    '• Social Media posts\n' +
    '• Monthly performance reports\n' +
    '• Weekly consulting calls',
    395, 230, 290, 100
  );
  fpsDeliverables.getText().getTextStyle().setFontSize(11).setForegroundColor(darkBlue);
  fpsDeliverables.getText().getRange(0, 13).getTextStyle().setBold(true);

  // =====================
  // SLIDE 4: 2026 MOMENT CALENDAR
  // =====================
  var slide4 = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  slide4.getBackground().setSolidFill(white);

  var title4 = slide4.insertTextBox('2026 Moment Calendar', 40, 25, 640, 45);
  title4.getText().getTextStyle().setFontSize(28).setBold(true).setForegroundColor(darkBlue);

  // B2B Section
  var b2bHeader = slide4.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, 40, 80, 310, 30);
  b2bHeader.getFill().setSolidFill(darkBlue);
  b2bHeader.getBorder().setTransparent();
  b2bHeader.getText().setText('B2B: INDUSTRY MOMENTS');
  b2bHeader.getText().getTextStyle().setFontSize(12).setBold(true).setForegroundColor(white);
  b2bHeader.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

  var b2bMoments = [
    ['Q1', 'Inman Connect NYC', 'Jan'],
    ['Q2', 'NAR Sustainability Summit', 'Jun'],
    ['Q2', 'T3 Sixty Summit', 'TBD'],
    ['Q3', 'Inman Connect San Diego', 'Jul'],
    ['Q4', 'NAR NXT', 'Nov']
  ];

  var b2bBox = slide4.insertShape(SlidesApp.ShapeType.RECTANGLE, 40, 115, 310, 160);
  b2bBox.getFill().setSolidFill(lightBlue);
  b2bBox.getBorder().setTransparent();

  yPos = 125;
  b2bMoments.forEach(function(moment) {
    var qLabel = slide4.insertTextBox(moment[0], 50, yPos, 35, 22);
    qLabel.getText().getTextStyle().setFontSize(10).setBold(true).setForegroundColor(pearlBlue);

    var eventLabel = slide4.insertTextBox(moment[1], 90, yPos, 180, 22);
    eventLabel.getText().getTextStyle().setFontSize(10).setForegroundColor(darkBlue);

    var dateLabel = slide4.insertTextBox(moment[2], 280, yPos, 50, 22);
    dateLabel.getText().getTextStyle().setFontSize(10).setForegroundColor(pearlBlue);

    yPos += 28;
  });

  // B2C Section
  var b2cHeader = slide4.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, 370, 80, 310, 30);
  b2cHeader.getFill().setSolidFill(teal);
  b2cHeader.getBorder().setTransparent();
  b2cHeader.getText().setText('B2C: SEASONAL MOMENTS');
  b2cHeader.getText().getTextStyle().setFontSize(12).setBold(true).setForegroundColor(white);
  b2cHeader.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

  var b2cMoments = [
    ['Q1', 'State of Home Performance Report', 'Jan'],
    ['Q1', 'Spring Buying Season Push', 'Mar'],
    ['Q3', 'Resilience / Storm Season', 'Jul'],
    ['Q3', 'Fall Buying Season Push', 'Sep'],
    ['Q4', 'Year-End Recap', 'Nov']
  ];

  var b2cBox = slide4.insertShape(SlidesApp.ShapeType.RECTANGLE, 370, 115, 310, 160);
  b2cBox.getFill().setSolidFill(lightTeal);
  b2cBox.getBorder().setTransparent();

  yPos = 125;
  b2cMoments.forEach(function(moment) {
    var qLabel = slide4.insertTextBox(moment[0], 380, yPos, 35, 22);
    qLabel.getText().getTextStyle().setFontSize(10).setBold(true).setForegroundColor(teal);

    var eventLabel = slide4.insertTextBox(moment[1], 420, yPos, 180, 22);
    eventLabel.getText().getTextStyle().setFontSize(10).setForegroundColor(darkBlue);

    var dateLabel = slide4.insertTextBox(moment[2], 610, yPos, 50, 22);
    dateLabel.getText().getTextStyle().setFontSize(10).setForegroundColor(teal);

    yPos += 28;
  });

  // Visual timeline
  var timelineLabel = slide4.insertTextBox('2026', 40, 290, 640, 20);
  timelineLabel.getText().getTextStyle().setFontSize(10).setBold(true).setForegroundColor(darkBlue);
  timelineLabel.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

  var timelineBar = slide4.insertShape(SlidesApp.ShapeType.RECTANGLE, 40, 310, 640, 8);
  timelineBar.getFill().setSolidFill('#e0e0e0');
  timelineBar.getBorder().setTransparent();

  // Month labels
  var months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  months.forEach(function(m, i) {
    var label = slide4.insertTextBox(m, 45 + (i * 53.3), 325, 20, 15);
    label.getText().getTextStyle().setFontSize(8).setForegroundColor(darkBlue);
  });

  // Legend
  var legendB2B = slide4.insertShape(SlidesApp.ShapeType.ELLIPSE, 260, 355, 12, 12);
  legendB2B.getFill().setSolidFill(darkBlue);
  legendB2B.getBorder().setTransparent();
  var legendB2BLabel = slide4.insertTextBox('B2B', 277, 352, 40, 18);
  legendB2BLabel.getText().getTextStyle().setFontSize(10).setForegroundColor(darkBlue);

  var legendB2C = slide4.insertShape(SlidesApp.ShapeType.ELLIPSE, 320, 355, 12, 12);
  legendB2C.getFill().setSolidFill(teal);
  legendB2C.getBorder().setTransparent();
  var legendB2CLabel = slide4.insertTextBox('B2C', 337, 352, 40, 18);
  legendB2CLabel.getText().getTextStyle().setFontSize(10).setForegroundColor(darkBlue);

  // =====================
  // SLIDE 5: SUCCESS METRICS
  // =====================
  var slide5 = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  slide5.getBackground().setSolidFill(white);

  var title5 = slide5.insertTextBox('Success Metrics', 40, 25, 640, 45);
  title5.getText().getTextStyle().setFontSize(28).setBold(true).setForegroundColor(darkBlue);

  // B2B Metrics
  var b2bMetricsHeader = slide5.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, 40, 80, 310, 30);
  b2bMetricsHeader.getFill().setSolidFill(darkBlue);
  b2bMetricsHeader.getBorder().setTransparent();
  b2bMetricsHeader.getText().setText('B2B METRICS');
  b2bMetricsHeader.getText().getTextStyle().setFontSize(12).setBold(true).setForegroundColor(white);
  b2bMetricsHeader.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

  var b2bMetricsBox = slide5.insertShape(SlidesApp.ShapeType.RECTANGLE, 40, 115, 310, 180);
  b2bMetricsBox.getFill().setSolidFill(lightBlue);
  b2bMetricsBox.getBorder().setTransparent();

  var b2bMetrics = [
    ['Tier-1 Media Placements', '6+ annually'],
    ['Podcast Appearances', '4-6 per month'],
    ['Sponsored Speaking Slots', '6-8 annually'],
    ['LinkedIn Engagement', '500+ per post (surge)']
  ];

  yPos = 130;
  b2bMetrics.forEach(function(metric) {
    var metricName = slide5.insertTextBox(metric[0], 55, yPos, 200, 20);
    metricName.getText().getTextStyle().setFontSize(11).setForegroundColor(darkBlue);

    var metricTarget = slide5.insertTextBox(metric[1], 55, yPos + 18, 200, 20);
    metricTarget.getText().getTextStyle().setFontSize(13).setBold(true).setForegroundColor(pearlBlue);

    yPos += 45;
  });

  // B2C Metrics
  var b2cMetricsHeader = slide5.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, 370, 80, 310, 30);
  b2cMetricsHeader.getFill().setSolidFill(teal);
  b2cMetricsHeader.getBorder().setTransparent();
  b2cMetricsHeader.getText().setText('B2C METRICS');
  b2cMetricsHeader.getText().getTextStyle().setFontSize(12).setBold(true).setForegroundColor(white);
  b2cMetricsHeader.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

  var b2cMetricsBox = slide5.insertShape(SlidesApp.ShapeType.RECTANGLE, 370, 115, 310, 180);
  b2cMetricsBox.getFill().setSolidFill(lightTeal);
  b2cMetricsBox.getBorder().setTransparent();

  var b2cMetrics = [
    ['Website Traffic Growth', '25% QoQ'],
    ['Report/Content Downloads', '500+ per pillar'],
    ['Home Claims', 'Trending up'],
    ['SEO Rankings', 'Top 10 target keywords']
  ];

  yPos = 130;
  b2cMetrics.forEach(function(metric) {
    var metricName = slide5.insertTextBox(metric[0], 385, yPos, 200, 20);
    metricName.getText().getTextStyle().setFontSize(11).setForegroundColor(darkBlue);

    var metricTarget = slide5.insertTextBox(metric[1], 385, yPos + 18, 200, 20);
    metricTarget.getText().getTextStyle().setFontSize(13).setBold(true).setForegroundColor(teal);

    yPos += 45;
  });

  var metricsNote = slide5.insertTextBox('Metrics reviewed monthly; reported to leadership quarterly', 40, 310, 640, 25);
  metricsNote.getText().getTextStyle().setFontSize(11).setItalic(true).setForegroundColor(pearlBlue);
  metricsNote.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

  // =====================
  // SLIDE 6: 90-DAY FOCUS
  // =====================
  var slide6 = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  slide6.getBackground().setSolidFill(white);

  var title6 = slide6.insertTextBox('90-Day Focus: Q1 2026', 40, 25, 640, 45);
  title6.getText().getTextStyle().setFontSize(28).setBold(true).setForegroundColor(darkBlue);

  var subtitle6 = slide6.insertTextBox('Launch & Establish Authority', 40, 70, 640, 25);
  subtitle6.getText().getTextStyle().setFontSize(14).setItalic(true).setForegroundColor(pearlBlue);

  // B2B Q1
  var b2bQ1Header = slide6.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, 40, 105, 310, 30);
  b2bQ1Header.getFill().setSolidFill(darkBlue);
  b2bQ1Header.getBorder().setTransparent();
  b2bQ1Header.getText().setText('B2B PRIORITIES');
  b2bQ1Header.getText().getTextStyle().setFontSize(12).setBold(true).setForegroundColor(white);
  b2bQ1Header.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

  var b2bQ1Box = slide6.insertShape(SlidesApp.ShapeType.RECTANGLE, 40, 140, 310, 150);
  b2bQ1Box.getFill().setSolidFill(lightBlue);
  b2bQ1Box.getBorder().setTransparent();

  var b2bQ1List = slide6.insertTextBox(
    '• Inman Connect NYC activation\n' +
    '  — Geo-fence + LinkedIn surge\n\n' +
    '• Secure 2+ Tier-1 media placements\n\n' +
    '• 12+ podcast appearances booked\n\n' +
    '• Launch local TV outreach',
    55, 150, 280, 130
  );
  b2bQ1List.getText().getTextStyle().setFontSize(11).setForegroundColor(darkBlue);

  // B2C Q1
  var b2cQ1Header = slide6.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, 370, 105, 310, 30);
  b2cQ1Header.getFill().setSolidFill(teal);
  b2cQ1Header.getBorder().setTransparent();
  b2cQ1Header.getText().setText('B2C PRIORITIES');
  b2cQ1Header.getText().getTextStyle().setFontSize(12).setBold(true).setForegroundColor(white);
  b2cQ1Header.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

  var b2cQ1Box = slide6.insertShape(SlidesApp.ShapeType.RECTANGLE, 370, 140, 310, 150);
  b2cQ1Box.getFill().setSolidFill(lightTeal);
  b2cQ1Box.getBorder().setTransparent();

  var b2cQ1List = slide6.insertTextBox(
    '• Launch "State of Home Performance\n' +
    '  2026" report\n\n' +
    '• 500+ report downloads\n\n' +
    '• Build content engine\n' +
    '  — 8-10 derivative pieces per pillar\n\n' +
    '• Spring buying season prep',
    385, 150, 280, 130
  );
  b2cQ1List.getText().getTextStyle().setFontSize(11).setForegroundColor(darkBlue);

  // Key moment callout
  var momentCallout = slide6.insertShape(SlidesApp.ShapeType.ROUND_RECTANGLE, 140, 305, 440, 45);
  momentCallout.getFill().setSolidFill(darkBlue);
  momentCallout.getBorder().setTransparent();
  var momentText = momentCallout.getText();
  momentText.setText('KEY MOMENT: Inman Connect NYC (January)\nAll channels surge together for maximum impact');
  momentText.getTextStyle().setFontSize(11).setForegroundColor(white);
  momentText.getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

  Logger.log('Presentation updated with all 6 slides');
}
