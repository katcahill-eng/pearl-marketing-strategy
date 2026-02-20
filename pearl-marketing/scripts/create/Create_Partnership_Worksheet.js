// ============================================================
// PARTNERSHIP ANALYSIS WORKSHEET - Google Sheets Version
// Run this script to create/update the Google Sheet
// ============================================================
// INSTRUCTIONS:
// 1. First run: Use createNewSheet() to create a new Google Sheet
// 2. Copy the Sheet ID from the logs
// 3. Paste it into SHEET_ID below
// 4. Future runs: Use updateSheet() to refresh content
// ============================================================

var SHEET_ID = '1A3jGfKxYOhc4nMhoWTLcUURvWVRjpSoz4E01lGPm6PM';

function createNewSheet() {
  var ss = SpreadsheetApp.create('Pearl_MKTG_Partnership Audit Worksheet_Q12026');
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

  // Partner data used across sheets
  var partners = [
    {name: 'DOE', fullName: 'DOE (Home Performance with ENERGY STAR)', type: 'Government'},
    {name: 'NAR', fullName: 'NAR (National Association of Realtors)', type: 'Industry Association'},
    {name: 'RESO', fullName: 'RESO (Real Estate Standards Organization)', type: 'Standards Body'},
    {name: 'Appraisal Inst', fullName: 'Appraisal Institute', type: 'Industry Association'},
    {name: 'NASEO', fullName: 'NASEO (Affiliate Membership)', type: 'Government'},
    {name: 'RESNET', fullName: 'RESNET', type: 'Standards Body'}
  ];

  // Track sheet IDs for hyperlinks
  var sheetIds = {};
  var execSummaryId = execSummary.getSheetId();

  // ===== CREATE INDIVIDUAL PARTNER SHEETS FIRST (to get their IDs) =====
  for (var i = 0; i < partners.length; i++) {
    var p = partners[i];
    var sheet = ss.insertSheet(p.name);
    sheetIds[p.name] = sheet.getSheetId();

    // Header
    sheet.getRange('A1').setValue(p.fullName).setFontSize(16).setFontWeight('bold').setFontColor(BLUE);
    sheet.getRange('A2').setValue('Type: ' + p.type).setFontStyle('italic');

    // Basic Info
    sheet.getRange('A4:B4').setValues([['Internal Owner:', '']]);
    sheet.getRange('A5:B5').setValues([['Primary Contact:', '']]);
    sheet.getRange('A6:B6').setValues([['Annual Cost:', '$']]);
    sheet.getRange('A7:B7').setValues([['Contract End Date:', '']]);
    sheet.getRange('A4:A7').setFontWeight('bold');
    sheet.getRange('B4:B7').setBackground(YELLOW).setWrap(true);

    // Benefits Inventory
    sheet.getRange('A9').setValue('BENEFITS INVENTORY').setFontWeight('bold').setFontColor(WHITE).setBackground(BLUE);
    sheet.getRange('A9:E9').mergeAcross().setBackground(BLUE);

    var invHeaders = [['Benefit', 'Included?', 'Currently Using?', 'Value (H/M/L)', 'Action Needed']];
    var invData = [
      ['Logo/brand usage rights', 'Y / N', 'Y / N', '', ''],
      ['Speaking opportunities', 'Y / N', 'Y / N', '', ''],
      ['Content/research access', 'Y / N', 'Y / N', '', ''],
      ['Event participation', 'Y / N', 'Y / N', '', ''],
      ['Member communications', 'Y / N', 'Y / N', '', ''],
      ['Co-marketing opportunities', 'Y / N', 'Y / N', '', ''],
      ['Committee access', 'Y / N', 'Y / N', '', ''],
      ['Newsletter placement', 'Y / N', 'Y / N', '', ''],
      ['Webinar hosting', 'Y / N', 'Y / N', '', ''],
      ['Other:', 'Y / N', 'Y / N', '', '']
    ];

    sheet.getRange('A10:E10').setValues(invHeaders).setFontWeight('bold').setBackground(LIGHT_BLUE);
    sheet.getRange('A11:E20').setValues(invData);
    sheet.getRange('A10:E20').setBorder(true, true, true, true, true, true);
    sheet.getRange('B11:E20').setBackground(YELLOW).setWrap(true);

    // Optimization
    sheet.getRange('A22').setValue('OPTIMIZATION OPPORTUNITIES').setFontWeight('bold').setFontColor(WHITE).setBackground(BLUE);
    sheet.getRange('A22:B22').mergeAcross().setBackground(BLUE);
    sheet.getRange('A23').setValue('1.');
    sheet.getRange('A24').setValue('2.');
    sheet.getRange('A25').setValue('3.');
    sheet.getRange('B23:B25').setBackground(YELLOW).setWrap(true);

    // Recommendation
    sheet.getRange('A27').setValue('RECOMMENDATION').setFontWeight('bold');
    sheet.getRange('A28:D28').setValues([['[ ] Renew', '[ ] Renegotiate', '[ ] Discontinue', '[ ] Expand']]);

    sheet.autoResizeColumns(1, 5);
    sheet.setColumnWidth(5, 200);
  }

  // ===== EXECUTIVE SUMMARY SHEET (passed in as parameter) =====
  // Title
  execSummary.getRange('A1').setValue('Partnership Overview').setFontSize(18).setFontWeight('bold').setFontColor(BLUE);
  execSummary.getRange('A2').setValue('Q1 Audit: Document costs, benefits, and marketing usage rights - click partner name for details').setFontStyle('italic');

  // Executive Summary Table
  var execHeaders = [['Partner', 'Type', 'Owner (Division)', 'Paid?', 'Annual Cost', 'Using Benefits?', 'Marketing Can Use?']];
  execSummary.getRange('A4:G4').setValues(execHeaders).setFontWeight('bold').setBackground(BLUE).setFontColor(WHITE);

  // Add partner rows with hyperlinks to tabs
  for (var i = 0; i < partners.length; i++) {
    var p = partners[i];
    var row = i + 5;
    var sheetId = sheetIds[p.name];

    // Create hyperlink to the partner's tab
    var sheetUrl = ss.getUrl() + '#gid=' + sheetId;
    var linkFormula = '=HYPERLINK("' + sheetUrl + '", "' + p.fullName + '")';
    execSummary.getRange('A' + row).setFormula(linkFormula).setFontColor(BLUE).setFontWeight('bold');

    // Fill in type column
    execSummary.getRange('B' + row).setValue(p.type);

    // Yellow for input cells
    execSummary.getRange('C' + row + ':G' + row).setBackground(YELLOW);
  }

  // Total row
  var totalRow = partners.length + 5;
  execSummary.getRange('A' + totalRow).setValue('TOTAL').setFontWeight('bold');
  execSummary.getRange('E' + totalRow).setValue('$').setFontWeight('bold');

  execSummary.getRange('A4:G' + totalRow).setBorder(true, true, true, true, true, true);

  // Enable text wrapping for input cells
  execSummary.getRange('C5:G' + totalRow).setWrap(true);

  // Legend
  execSummary.getRange('A' + (totalRow + 2)).setValue('Paid options: Yes / No').setFontStyle('italic').setFontColor('#666666');
  execSummary.getRange('A' + (totalRow + 3)).setValue('Using Benefits: Yes / Partial / No').setFontStyle('italic').setFontColor('#666666');
  execSummary.getRange('A' + (totalRow + 4)).setValue('Marketing Can Use: Yes / No / Verify (check contract for logo/naming rights)').setFontStyle('italic').setFontColor('#666666');

  // Warning note
  execSummary.getRange('A' + (totalRow + 6)).setValue('⚠️ Marketing usage rights are needed to articulate Pearl\'s moat in investor materials.').setFontWeight('bold').setFontColor('#cc6600');

  // Set explicit column widths to fit headers
  execSummary.setColumnWidth(1, 300);  // Partner
  execSummary.setColumnWidth(2, 150);  // Type
  execSummary.setColumnWidth(3, 150);  // Owner (Division)
  execSummary.setColumnWidth(4, 80);   // Paid?
  execSummary.setColumnWidth(5, 110);  // Annual Cost
  execSummary.setColumnWidth(6, 130);  // Using Benefits?
  execSummary.setColumnWidth(7, 150);  // Marketing Can Use?

  // Move Executive Summary to first position
  ss.setActiveSheet(execSummary);
  ss.moveActiveSheet(1);

  // ===== DETAILED SUMMARY SHEET =====
  var summary = ss.insertSheet('Detailed Summary');

  // Title
  summary.getRange('A1').setValue('Partnership Analysis - Detailed View').setFontSize(18).setFontWeight('bold').setFontColor(BLUE);
  summary.getRange('A2').setValue('Complete cost, benefit, and rights analysis for each partnership').setFontStyle('italic');

  // Costs & Ownership Section
  summary.getRange('A4').setValue('COSTS & OWNERSHIP').setFontWeight('bold').setFontColor(WHITE).setBackground(BLUE);
  summary.getRange('A4:G4').mergeAcross().setBackground(BLUE);

  var costsHeaders = [['Partner', 'Paid?', 'Annual Cost', 'Renewal Date', 'Relationship Owner', 'Primary Beneficiary', 'Marketing Contact']];
  var costsData = [
    ['DOE', '', '', '', '', '', ''],
    ['NAR', '', '', '', '', '', ''],
    ['RESO', '', '', '', '', '', ''],
    ['Appraisal Institute', '', '', '', '', '', ''],
    ['NASEO', '', '', '', '', '', ''],
    ['RESNET', '', '', '', '', '', ''],
    ['TOTAL', '', '', '', '', '', '']
  ];

  summary.getRange('A5:G5').setValues(costsHeaders).setFontWeight('bold').setBackground(LIGHT_BLUE);
  summary.getRange('A6:G12').setValues(costsData);
  summary.getRange('A5:G12').setBorder(true, true, true, true, true, true);
  summary.getRange('B6:G12').setBackground(YELLOW).setWrap(true);
  summary.getRange('A12').setFontWeight('bold');

  // Legend
  summary.getRange('A14').setValue('Relationship Owner = Who manages the partnership internally').setFontStyle('italic').setFontColor('#666666');
  summary.getRange('A15').setValue('Primary Beneficiary = Which team gets most value (BD, Product, Marketing, etc.)').setFontStyle('italic').setFontColor('#666666');
  summary.getRange('A16').setValue('Marketing Contact = Who Marketing coordinates with to activate benefits').setFontStyle('italic').setFontColor('#666666');

  // Benefits & Utilization Section
  summary.getRange('A18').setValue('BENEFITS & UTILIZATION').setFontWeight('bold').setFontColor(WHITE).setBackground(BLUE);
  summary.getRange('A18:D18').mergeAcross().setBackground(BLUE);

  var benefitsHeaders = [['Partner', 'Key Benefits Included', 'Currently Using?', 'Optimized?']];
  var benefitsData = [
    ['DOE', '', 'Y / Partial / N', 'Y / N'],
    ['NAR', '', 'Y / Partial / N', 'Y / N'],
    ['RESO', '', 'Y / Partial / N', 'Y / N'],
    ['Appraisal Institute', '', 'Y / Partial / N', 'Y / N'],
    ['NASEO', '', 'Y / Partial / N', 'Y / N'],
    ['RESNET', '', 'Y / Partial / N', 'Y / N']
  ];

  summary.getRange('A19:D19').setValues(benefitsHeaders).setFontWeight('bold').setBackground(LIGHT_BLUE);
  summary.getRange('A20:D25').setValues(benefitsData);
  summary.getRange('A19:D25').setBorder(true, true, true, true, true, true);
  summary.getRange('B20:D25').setBackground(YELLOW).setWrap(true);

  // Marketing Usage Rights Section
  summary.getRange('A27').setValue('MARKETING USAGE RIGHTS').setFontWeight('bold').setFontColor(WHITE).setBackground(BLUE);
  summary.getRange('A27:E27').mergeAcross().setBackground(BLUE);

  var rightsHeaders = [['Partner', 'Can Name in Marketing?', 'Can Use Logo?', 'Can Say "Partner of"?', 'Restrictions']];
  var rightsData = [
    ['DOE', 'Y / N / Verify', 'Y / N / Verify', 'Y / N / Verify', ''],
    ['NAR', 'Y / N / Verify', 'Y / N / Verify', 'Y / N / Verify', ''],
    ['RESO', 'Y / N / Verify', 'Y / N / Verify', 'Y / N / Verify', ''],
    ['Appraisal Institute', 'Y / N / Verify', 'Y / N / Verify', 'Y / N / Verify', ''],
    ['NASEO', 'Y / N / Verify', 'Y / N / Verify', 'Y / N / Verify', ''],
    ['RESNET', 'Y / N / Verify', 'Y / N / Verify', 'Y / N / Verify', '']
  ];

  summary.getRange('A28:E28').setValues(rightsHeaders).setFontWeight('bold').setBackground(LIGHT_BLUE);
  summary.getRange('A29:E34').setValues(rightsData);
  summary.getRange('A28:E34').setBorder(true, true, true, true, true, true);
  summary.getRange('B29:E34').setBackground(YELLOW).setWrap(true);

  summary.getRange('A36').setValue('⚠️ Marketing usage rights are needed to articulate Pearl\'s moat in investor materials.').setFontWeight('bold').setFontColor('#cc6600');

  // Set explicit column widths for all tables
  summary.setColumnWidth(1, 150);  // Partner
  summary.setColumnWidth(2, 200);  // Key Benefits / Can Name
  summary.setColumnWidth(3, 120);  // Renewal Date / Can Use Logo
  summary.setColumnWidth(4, 150);  // Relationship Owner
  summary.setColumnWidth(5, 150);  // Primary Beneficiary / Restrictions
  summary.setColumnWidth(6, 150);  // Marketing Contact
  summary.setColumnWidth(7, 150);  // (extra)

  // Move Detailed Summary to second position
  ss.setActiveSheet(summary);
  ss.moveActiveSheet(2);

  // ===== QUESTIONS SHEET =====
  var questions = ss.insertSheet('Key Questions');
  questions.getRange('A1').setValue('Key Questions for Leadership').setFontSize(16).setFontWeight('bold').setFontColor(BLUE);

  var qData = [
    ['Question', 'Answer/Discussion Notes'],
    ['1. Are we paying for benefits we\'re not using?', ''],
    ['2. Which partnerships deliver the most value per dollar?', ''],
    ['3. Are there partnerships we should expand or discontinue?', ''],
    ['4. Who should own activation of marketing-related benefits?', ''],
    ['5. Which partnerships can we name in investor materials?', '']
  ];

  questions.getRange('A3:B8').setValues(qData);
  questions.getRange('A3:B3').setFontWeight('bold').setBackground(LIGHT_BLUE);
  questions.getRange('A3:B8').setBorder(true, true, true, true, true, true);
  questions.getRange('B4:B8').setBackground(YELLOW).setWrap(true);
  questions.setColumnWidth(1, 400);
  questions.setColumnWidth(2, 400);

  questions.getRange('A10').setValue('Worksheet completed by:');
  questions.getRange('A11').setValue('Date:');
  questions.getRange('B10:B11').setBackground(YELLOW);
}
