// ============================================================
// CONFERENCE SPONSORSHIP WORKSHEET - Google Sheets Version
// Run this script to create/update the Google Sheet
// ============================================================
// INSTRUCTIONS:
// 1. First run: Use createNewSheet() to create a new Google Sheet
// 2. Copy the Sheet ID from the logs
// 3. Paste it into SHEET_ID below
// 4. Future runs: Use updateSheet() to refresh content
// ============================================================

var SHEET_ID = '1auiKdZPCEDM5TFsXrBpMBNpfrahQoKBFq49KFgPVzjo';

function createNewSheet() {
  var ss = SpreadsheetApp.create('Pearl_MKTG_Conference Sponsorship Worksheet_Q12026');
  Logger.log('Created new sheet with ID: ' + ss.getId());
  Logger.log('URL: ' + ss.getUrl());
  Logger.log('Update SHEET_ID in script, then run updateSheet()');

  // Rename default Sheet1 to Executive Summary and pass it to builder
  var execSummary = ss.getSheets()[0];
  execSummary.setName('Executive Summary');

  buildAllSheets(ss, execSummary);
}

function updateSheet() {
  if (SHEET_ID === 'YOUR_SHEET_ID_HERE') {
    Logger.log('ERROR: Set SHEET_ID first. Run createNewSheet() to create a new spreadsheet.');
    return;
  }
  var ss = SpreadsheetApp.openById(SHEET_ID);

  // Clear existing sheets except the first one
  var sheets = ss.getSheets();
  for (var i = sheets.length - 1; i > 0; i--) {
    ss.deleteSheet(sheets[i]);
  }

  // Clear first sheet and pass it to builder
  var execSummary = sheets[0];
  execSummary.clear();
  execSummary.setName('Executive Summary');

  buildAllSheets(ss, execSummary);
  Logger.log('Spreadsheet updated');
}

function buildAllSheets(ss, execSummary) {
  var BLUE = '#003366';
  var LIGHT_BLUE = '#e6f3ff';
  var YELLOW = '#ffffcc';
  var WHITE = '#ffffff';

  // Conference data used across sheets
  var conferences = [
    {name: 'Inman NYC', fullName: 'Inman Connect NYC', timing: 'January/February', priority: 'HIGH'},
    {name: 'Inman Vegas', fullName: 'Inman Connect Las Vegas', timing: 'July/August', priority: 'HIGH'},
    {name: 'NAR NXT', fullName: 'NAR NXT', timing: 'November', priority: 'MEDIUM'},
    {name: 'NAR Sustainability', fullName: 'NAR Sustainability Summit', timing: 'June', priority: 'HIGH'},
    {name: 'T3 Summit', fullName: 'T3 Sixty Summit', timing: 'TBD', priority: 'HIGH'},
    {name: 'RESO', fullName: 'RESO Conference', timing: 'TBD', priority: 'MEDIUM'},
        {name: 'ACEEE', fullName: 'ACEEE Summer Study', timing: 'August', priority: 'MEDIUM'},
    {name: 'Valuation Expo', fullName: 'Valuation Expo', timing: 'September', priority: 'MEDIUM'},
      ];

  // Track sheet IDs for hyperlinks
  var sheetIds = {};

  // ===== CREATE INDIVIDUAL CONFERENCE SHEETS FIRST (to get their IDs) =====
  for (var i = 0; i < conferences.length; i++) {
    var conf = conferences[i];
    var sheet = ss.insertSheet(conf.name);
    sheetIds[conf.name] = sheet.getSheetId();

    // Header
    sheet.getRange('A1').setValue(conf.fullName).setFontSize(16).setFontWeight('bold').setFontColor(BLUE);
    sheet.getRange('A2').setValue('Timing: ' + conf.timing + ' | Priority: ' + conf.priority).setFontStyle('italic');

    // Contact Info
    sheet.getRange('A4:B4').setValues([['Organizer Contact:', '']]);
    sheet.getRange('A5:B5').setValues([['Sponsorship Deck:', '[ ] Requested  [ ] Received']]);
    sheet.getRange('A4:A5').setFontWeight('bold');
    sheet.getRange('B4:B5').setBackground(YELLOW);

    // Sponsorship Tiers
    sheet.getRange('A7').setValue('SPONSORSHIP TIERS').setFontWeight('bold').setFontColor(WHITE).setBackground(BLUE);
    sheet.getRange('A7:D7').mergeAcross().setBackground(BLUE);

    var tierHeaders = [['Tier', 'Cost', 'Includes', 'Pearl Fit (H/M/L)']];
    var tierData = [
      ['Title/Platinum', '$', '', ''],
      ['Gold', '$', '', ''],
      ['Silver', '$', '', ''],
      ['Bronze', '$', '', ''],
      ['Other', '$', '', '']
    ];

    sheet.getRange('A8:D8').setValues(tierHeaders).setFontWeight('bold').setBackground(LIGHT_BLUE);
    sheet.getRange('A9:D13').setValues(tierData);
    sheet.getRange('A8:D13').setBorder(true, true, true, true, true, true);
    sheet.getRange('B9:D13').setBackground(YELLOW);

    // Speaking Opportunities
    sheet.getRange('A15').setValue('SPEAKING OPPORTUNITIES').setFontWeight('bold').setFontColor(WHITE).setBackground(BLUE);
    sheet.getRange('A15:D15').mergeAcross().setBackground(BLUE);

    var speakHeaders = [['Type', 'Cost', 'Application Deadline', 'Status']];
    var speakData = [
      ['Mainstage', '$', '', ''],
      ['Breakout/Panel', '$', '', ''],
      ['Workshop', '$', '', ''],
      ['Sponsored Session', '$', '', '']
    ];

    sheet.getRange('A16:D16').setValues(speakHeaders).setFontWeight('bold').setBackground(LIGHT_BLUE);
    sheet.getRange('A17:D20').setValues(speakData);
    sheet.getRange('A16:D20').setBorder(true, true, true, true, true, true);
    sheet.getRange('B17:D20').setBackground(YELLOW);

    // Exhibit Options
    sheet.getRange('A22').setValue('EXHIBIT OPTIONS').setFontWeight('bold').setFontColor(WHITE).setBackground(BLUE);
    sheet.getRange('A22:D22').mergeAcross().setBackground(BLUE);

    var exhibitHeaders = [['Option', 'Cost', 'Size/Details', 'Lead Capture?']];
    var exhibitData = [
      ['Standard Booth', '$', '', ''],
      ['Premium Location', '$', '', ''],
      ['Demo Station', '$', '', '']
    ];

    sheet.getRange('A23:D23').setValues(exhibitHeaders).setFontWeight('bold').setBackground(LIGHT_BLUE);
    sheet.getRange('A24:D26').setValues(exhibitData);
    sheet.getRange('A23:D26').setBorder(true, true, true, true, true, true);
    sheet.getRange('B24:D26').setBackground(YELLOW);

    // Add-on Opportunities
    sheet.getRange('A28').setValue('ADD-ON OPPORTUNITIES').setFontWeight('bold').setFontColor(WHITE).setBackground(BLUE);
    sheet.getRange('A28:C28').mergeAcross().setBackground(BLUE);

    var addOnHeaders = [['Opportunity', 'Cost', 'Value Assessment']];
    var addOnData = [
      ['VIP Dinner', '$', ''],
      ['Reception Sponsorship', '$', ''],
      ['Lanyard/Bag Sponsor', '$', ''],
      ['Other:', '$', '']
    ];

    sheet.getRange('A29:C29').setValues(addOnHeaders).setFontWeight('bold').setBackground(LIGHT_BLUE);
    sheet.getRange('A30:C33').setValues(addOnData);
    sheet.getRange('A29:C33').setBorder(true, true, true, true, true, true);
    sheet.getRange('B30:C33').setBackground(YELLOW);

    // Recommendation
    sheet.getRange('A35').setValue('RECOMMENDATION').setFontWeight('bold');
    sheet.getRange('A36:D36').setValues([['[ ] Skip', '[ ] Attend Only', '[ ] Sponsor', '[ ] Priority Investment']]);

    sheet.getRange('A38').setValue('Notes:').setFontWeight('bold');
    sheet.getRange('A39:D39').mergeAcross().setBackground(YELLOW);

    sheet.autoResizeColumns(1, 4);
    sheet.setColumnWidth(3, 200);
  }

  // ===== EXECUTIVE SUMMARY SHEET (passed in as parameter) =====
  // Title
  execSummary.getRange('A1').setValue('Conference Overview').setFontSize(18).setFontWeight('bold').setFontColor(BLUE);
  execSummary.getRange('A2').setValue('Quick reference for all target conferences - click event name for detailed research').setFontStyle('italic');

  // Executive Summary Table
  var execHeaders = [['Event', 'Date', 'Owner (Division)', 'Attending?', 'Target Audience', 'Marketing Needed?']];
  execSummary.getRange('A4:F4').setValues(execHeaders).setFontWeight('bold').setBackground(BLUE).setFontColor(WHITE);

  // Add conference rows with hyperlinks to tabs
  for (var i = 0; i < conferences.length; i++) {
    var conf = conferences[i];
    var row = i + 5;
    var sheetId = sheetIds[conf.name];

    // Create hyperlink to the conference's tab
    var sheetUrl = ss.getUrl() + '#gid=' + sheetId;
    var linkFormula = '=HYPERLINK("' + sheetUrl + '", "' + conf.fullName + '")';
    execSummary.getRange('A' + row).setFormula(linkFormula).setFontColor(BLUE).setFontWeight('bold');

    // Fill in other columns
    execSummary.getRange('B' + row).setValue(conf.timing);
    execSummary.getRange('C' + row + ':F' + row).setBackground(YELLOW);
  }

  execSummary.getRange('A4:F14').setBorder(true, true, true, true, true, true);

  // Enable text wrapping for input cells
  execSummary.getRange('C5:F14').setWrap(true);

  // Legend
  execSummary.getRange('A16').setValue('Attending options: Yes / No / TBD').setFontStyle('italic').setFontColor('#666666');
  execSummary.getRange('A17').setValue('Marketing Needed options: Yes / No / Partial (specify in notes)').setFontStyle('italic').setFontColor('#666666');

  // Set explicit column widths to fit headers
  execSummary.setColumnWidth(1, 280);  // Event
  execSummary.setColumnWidth(2, 130);  // Date
  execSummary.setColumnWidth(3, 150);  // Owner (Division)
  execSummary.setColumnWidth(4, 100);  // Attending?
  execSummary.setColumnWidth(5, 150);  // Target Audience
  execSummary.setColumnWidth(6, 150);  // Marketing Needed?

  // Move Executive Summary to first position
  ss.setActiveSheet(execSummary);
  ss.moveActiveSheet(1);

  // ===== COST RESEARCH SHEET =====
  var costResearch = ss.insertSheet('Cost Research');

  // Title
  costResearch.getRange('A1').setValue('Conference Sponsorship & Paid Opportunities').setFontSize(18).setFontWeight('bold').setFontColor(BLUE);
  costResearch.getRange('A2').setValue('Research paid sponsorship, speaking, and exhibit opportunities at target conferences').setFontStyle('italic');

  // Instructions
  costResearch.getRange('A4').setValue('RESEARCH INSTRUCTIONS').setFontWeight('bold').setFontColor(WHITE).setBackground(BLUE);
  costResearch.getRange('A4:D4').mergeAcross().setBackground(BLUE);

  var instructions = [
    ['1. Contact organizer or review sponsorship prospectus for each conference'],
    ['2. Document sponsorship tiers and costs'],
    ['3. Note speaking slot costs (if paid) and application deadlines'],
    ['4. Record booth/exhibit costs and lead capture options'],
    ['5. Identify add-on opportunities (dinners, receptions, etc.)']
  ];
  costResearch.getRange('A5:A9').setValues(instructions);

  // Cost Comparison Table
  costResearch.getRange('A11').setValue('COST COMPARISON').setFontWeight('bold').setFontColor(WHITE).setBackground(BLUE);
  costResearch.getRange('A11:F11').mergeAcross().setBackground(BLUE);

  var compHeaders = [['Conference', 'Priority', 'Lowest Sponsor', 'Speaking Cost', 'Booth Cost', 'Best Value Option']];
  var compData = [
    ['Inman Connect NYC', 'HIGH', '$', '$', '$', ''],
    ['Inman Connect Las Vegas', 'HIGH', '$', '$', '$', ''],
    ['NAR NXT', 'MEDIUM', '$', '$', '$', ''],
    ['NAR Sustainability Summit', 'HIGH', '$', '$', '$', ''],
    ['T3 Sixty Summit', 'HIGH', '$', '$', '$', ''],
    ['RESO Conference', 'MEDIUM', '$', '$', '$', ''],
        ['ACEEE Summer Study', 'MEDIUM', '$', '$', '$', ''],
    ['Valuation Expo', 'MEDIUM', '$', '$', '$', ''],
      ];

  costResearch.getRange('A12:F12').setValues(compHeaders).setFontWeight('bold').setBackground(LIGHT_BLUE);
  costResearch.getRange('A13:F22').setValues(compData);
  costResearch.getRange('A12:F22').setBorder(true, true, true, true, true, true);
  costResearch.getRange('C13:E22').setBackground(YELLOW);

  // Deadlines Calendar
  costResearch.getRange('A24').setValue('APPLICATION DEADLINES').setFontWeight('bold').setFontColor(WHITE).setBackground(BLUE);
  costResearch.getRange('A24:D24').mergeAcross().setBackground(BLUE);

  var deadlineHeaders = [['Conference', 'Speaking Deadline', 'Sponsor Deadline', 'Notes']];
  var deadlineData = [
    ['Inman Connect NYC', '', '', ''],
    ['Inman Connect Las Vegas', '', '', ''],
    ['NAR NXT', '', '', ''],
    ['NAR Sustainability Summit', '', '', ''],
    ['T3 Sixty Summit', '', '', ''],
    ['RESO Conference', '', '', ''],
        ['ACEEE Summer Study', '', '', ''],
    ['Valuation Expo', '', '', ''],
      ];

  costResearch.getRange('A25:D25').setValues(deadlineHeaders).setFontWeight('bold').setBackground(LIGHT_BLUE);
  costResearch.getRange('A26:D35').setValues(deadlineData);
  costResearch.getRange('A25:D35').setBorder(true, true, true, true, true, true);
  costResearch.getRange('B26:D35').setBackground(YELLOW);

  // Budget Recommendation
  costResearch.getRange('A37').setValue('BUDGET RECOMMENDATION').setFontWeight('bold').setFontColor(WHITE).setBackground(BLUE);
  costResearch.getRange('A37:D37').mergeAcross().setBackground(BLUE);

  var budgetHeaders = [['Conference', 'Investment Type', 'Estimated Cost', 'Priority']];
  var budgetData = [
    ['', '', '$', ''],
    ['', '', '$', ''],
    ['', '', '$', ''],
    ['', '', '$', ''],
    ['TOTAL', '', '$', '']
  ];

  costResearch.getRange('A38:D38').setValues(budgetHeaders).setFontWeight('bold').setBackground(LIGHT_BLUE);
  costResearch.getRange('A39:D43').setValues(budgetData);
  costResearch.getRange('A39:D43').setBorder(true, true, true, true, true, true);
  costResearch.getRange('A39:D42').setBackground(YELLOW);
  costResearch.getRange('A43').setFontWeight('bold');

  // Set explicit column widths
  costResearch.setColumnWidth(1, 220);  // Conference
  costResearch.setColumnWidth(2, 100);  // Priority
  costResearch.setColumnWidth(3, 130);  // Lowest Sponsor
  costResearch.setColumnWidth(4, 120);  // Speaking Cost
  costResearch.setColumnWidth(5, 110);  // Booth Cost
  costResearch.setColumnWidth(6, 150);  // Best Value Option

  // Move Cost Research to second position
  ss.setActiveSheet(costResearch);
  ss.moveActiveSheet(2);

  // ===== RESEARCH TRACKING SHEET =====
  var tracking = ss.insertSheet('Research Tracking');
  tracking.getRange('A1').setValue('Research Progress Tracker').setFontSize(16).setFontWeight('bold').setFontColor(BLUE);

  var trackHeaders = [['Conference', 'Contact Made?', 'Deck Received?', 'Sheet Complete?', 'Researcher', 'Date Completed']];
  var trackData = [
    ['Inman Connect NYC', '[ ]', '[ ]', '[ ]', '', ''],
    ['Inman Connect Las Vegas', '[ ]', '[ ]', '[ ]', '', ''],
    ['NAR NXT', '[ ]', '[ ]', '[ ]', '', ''],
    ['NAR Sustainability Summit', '[ ]', '[ ]', '[ ]', '', ''],
    ['T3 Sixty Summit', '[ ]', '[ ]', '[ ]', '', ''],
    ['RESO Conference', '[ ]', '[ ]', '[ ]', '', ''],
        ['ACEEE Summer Study', '[ ]', '[ ]', '[ ]', '', ''],
    ['Valuation Expo', '[ ]', '[ ]', '[ ]', '', ''],
      ];

  tracking.getRange('A3:F3').setValues(trackHeaders).setFontWeight('bold').setBackground(LIGHT_BLUE);
  tracking.getRange('A4:F13').setValues(trackData);
  tracking.getRange('A3:F13').setBorder(true, true, true, true, true, true);
  tracking.getRange('B4:F13').setBackground(YELLOW);

  tracking.getRange('A15').setValue('Research completed by:');
  tracking.getRange('A16').setValue('Date:');
  tracking.getRange('B15:B16').setBackground(YELLOW);

  // Set explicit column widths
  tracking.setColumnWidth(1, 220);  // Conference
  tracking.setColumnWidth(2, 120);  // Contact Made?
  tracking.setColumnWidth(3, 120);  // Deck Received?
  tracking.setColumnWidth(4, 130);  // Sheet Complete?
  tracking.setColumnWidth(5, 120);  // Researcher
  tracking.setColumnWidth(6, 130);  // Date Completed
}
