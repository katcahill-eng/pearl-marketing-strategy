/**
 * Adds new slides to the Board Marketing Overview presentation
 * Presentation ID: 1kz-4Xm7f4gQwab82nFlLqZSVjIkeFdJ-8zIIqX6hb_Y
 * Adds: 2026 Calendar, Success Metrics, 90-Day Focus
 * All clearly delineated by B2B and B2C
 */

function addBoardSlides() {
  var presentationId = '1kz-4Xm7f4gQwab82nFlLqZSVjIkeFdJ-8zIIqX6hb_Y';
  var presentation = SlidesApp.openById(presentationId);

  // Pearl brand colors
  var darkBlue = '#1a3c5a';
  var pearlBlue = '#2d5a7b';
  var teal = '#2a9d8f';
  var lightBlue = '#e8f4f8';
  var lightTeal = '#e6f5f3';
  var white = '#ffffff';

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

  var yPos = 125;
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

  // Visual timeline bar
  var timelineLabel = slide4.insertTextBox('2026', 40, 295, 640, 20);
  timelineLabel.getText().getTextStyle().setFontSize(10).setBold(true).setForegroundColor(darkBlue);
  timelineLabel.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

  var timelineBar = slide4.insertShape(SlidesApp.ShapeType.RECTANGLE, 40, 315, 640, 8);
  timelineBar.getFill().setSolidFill('#e0e0e0');
  timelineBar.getBorder().setTransparent();

  // Timeline markers (B2B = blue dots, B2C = teal dots)
  var markers = [
    { month: 1, color: darkBlue },   // Jan - Inman NYC
    { month: 1, color: teal },       // Jan - Report
    { month: 3, color: teal },       // Mar - Spring
    { month: 6, color: darkBlue },   // Jun - NAR Sustainability
    { month: 7, color: darkBlue },   // Jul - Inman SD
    { month: 7, color: teal },       // Jul - Resilience
    { month: 9, color: teal },       // Sep - Fall
    { month: 11, color: darkBlue },  // Nov - NAR NXT
    { month: 11, color: teal }       // Nov - Year-end
  ];

  markers.forEach(function(m) {
    var xPos = 40 + ((m.month - 1) / 11) * 620;
    var dot = slide4.insertShape(SlidesApp.ShapeType.ELLIPSE, xPos, 312, 14, 14);
    dot.getFill().setSolidFill(m.color);
    dot.getBorder().setTransparent();
  });

  // Month labels
  var months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  months.forEach(function(m, i) {
    var label = slide4.insertTextBox(m, 45 + (i * 53.3), 330, 20, 15);
    label.getText().getTextStyle().setFontSize(8).setForegroundColor(darkBlue);
  });

  // Legend
  var legendB2B = slide4.insertShape(SlidesApp.ShapeType.ELLIPSE, 240, 355, 10, 10);
  legendB2B.getFill().setSolidFill(darkBlue);
  legendB2B.getBorder().setTransparent();
  var legendB2BLabel = slide4.insertTextBox('B2B', 255, 352, 30, 15);
  legendB2BLabel.getText().getTextStyle().setFontSize(9).setForegroundColor(darkBlue);

  var legendB2C = slide4.insertShape(SlidesApp.ShapeType.ELLIPSE, 300, 355, 10, 10);
  legendB2C.getFill().setSolidFill(teal);
  legendB2C.getBorder().setTransparent();
  var legendB2CLabel = slide4.insertTextBox('B2C', 315, 352, 30, 15);
  legendB2CLabel.getText().getTextStyle().setFontSize(9).setForegroundColor(darkBlue);

  // =====================
  // SLIDE 5: SUCCESS METRICS
  // =====================
  var slide5 = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  slide5.getBackground().setSolidFill(white);

  var title5 = slide5.insertTextBox('Success Metrics', 40, 25, 640, 45);
  title5.getText().getTextStyle().setFontSize(28).setBold(true).setForegroundColor(darkBlue);

  // B2B Metrics Section
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

  // B2C Metrics Section
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

  // Bottom note
  var metricsNote = slide5.insertTextBox('Metrics reviewed monthly; reported to leadership quarterly', 40, 310, 640, 25);
  metricsNote.getText().getTextStyle().setFontSize(11).setItalic(true).setForegroundColor(pearlBlue);
  metricsNote.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);

  // =====================
  // SLIDE 6: 90-DAY FOCUS (Q1 2026)
  // =====================
  var slide6 = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  slide6.getBackground().setSolidFill(white);

  var title6 = slide6.insertTextBox('90-Day Focus: Q1 2026', 40, 25, 640, 45);
  title6.getText().getTextStyle().setFontSize(28).setBold(true).setForegroundColor(darkBlue);

  var subtitle6 = slide6.insertTextBox('Launch & Establish Authority', 40, 70, 640, 25);
  subtitle6.getText().getTextStyle().setFontSize(14).setItalic(true).setForegroundColor(pearlBlue);

  // B2B Q1 Section
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

  // B2C Q1 Section
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

  Logger.log('Added 3 new slides to presentation');
}
