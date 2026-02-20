// ============================================================
// Pearl 2026 Surge & Paid Campaign Tracker - Google Apps Script
// Tracks concentrated marketing moments, geo-fence campaigns, paid surges
// Strategy: "Moments, Not Months" - $24K concentrated = memorable
// Naming convention: Pearl_MKTG_[Name]_[Year]
// ============================================================

// CONFIGURATION - Set this after creating the sheet
var SHEET_ID = '1Nnubv4ryBnn8jeLJ1hVAWV-jh_cfx4Pyur-YGRG18Xw';

// ============================================================
// CREATE new spreadsheet
// ============================================================
function createSurgeTracker() {
  var ss = SpreadsheetApp.create('Pearl_MKTG_Surge Tracker_2026');

  // Build sheets
  buildSurgeCampaignsSheet(ss);
  buildGeoFenceSheet(ss);
  buildBudgetSheet(ss);

  // Delete default Sheet1
  var defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet) {
    ss.deleteSheet(defaultSheet);
  }

  Logger.log('Spreadsheet created: ' + ss.getUrl());
  Logger.log('IMPORTANT: Copy this Sheet ID to SHEET_ID variable: ' + ss.getId());
}

// ============================================================
// UPDATE existing spreadsheet
// ============================================================
function updateSurgeTracker() {
  var ss = SpreadsheetApp.openById(SHEET_ID);

  // Clear and rebuild Surge Campaigns
  var surgeSheet = ss.getSheetByName('Surge Campaigns');
  if (surgeSheet) {
    surgeSheet.clear();
  } else {
    surgeSheet = ss.insertSheet('Surge Campaigns');
  }
  buildSurgeData(surgeSheet);

  // Clear and rebuild Geo-Fence Campaigns
  var geoSheet = ss.getSheetByName('Geo-Fence Campaigns');
  if (geoSheet) {
    geoSheet.clear();
  } else {
    geoSheet = ss.insertSheet('Geo-Fence Campaigns');
  }
  buildGeoFenceData(geoSheet);

  // Clear and rebuild Budget Tracker
  var budgetSheet = ss.getSheetByName('Budget Tracker');
  if (budgetSheet) {
    budgetSheet.clear();
  } else {
    budgetSheet = ss.insertSheet('Budget Tracker');
  }
  buildBudgetData(budgetSheet);

  Logger.log('Spreadsheet updated: ' + ss.getUrl());
}

// ============================================================
// SHEET 1: Surge Campaigns
// ============================================================
function buildSurgeCampaignsSheet(ss) {
  var sheet = ss.insertSheet('Surge Campaigns');
  buildSurgeData(sheet);
}

function buildSurgeData(sheet) {
  var BLUE = '#003366';
  var LIGHT_BLUE = '#e6f3ff';   // B2B
  var LIGHT_GREEN = '#e6ffe6';  // B2C
  var LIGHT_YELLOW = '#fff9e6'; // Both
  var LIGHT_ORANGE = '#fff5e6'; // Geo-fence
  var LIGHT_GRAY = '#f5f5f5';

  var headers = ['Quarter', 'Moment', 'Type', 'Audience', 'Dates', 'Channels', 'Budget Est.', 'Content Needed', 'Status', 'Notes'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground(BLUE)
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // 2026 Surge Calendar - Concentrated moments for maximum impact
  // Per Annual Plan: "$24K spread = invisible, $24K concentrated = memorable"
  var data = [
    // ============ Q1 SURGES ============
    ['Q1', 'State of Home Performance 2026 Launch', 'Report + Social Surge', 'B2B', 'Jan 27-Feb 7', 'LinkedIn, X, Paid Social', '$2,000-3,000', 'Report, infographic, quote cards, ad creatives', 'Planned', 'Coincides with Inman NYC'],
    ['Q1', 'Inman Connect NYC', 'Conference + Geo-fence', 'B2B', 'Feb 4-6', 'LinkedIn, Geo-fence ads', '$1,500-2,000', 'Event social, geo-fence creative', 'Planned', 'Support BD presence'],
        ['Q1', 'What Buyers Want Report Launch', 'Report + Social Surge', 'Both', 'Mar 10-14', 'LinkedIn, X, Facebook', '$1,500-2,000', 'Report, social cards, ads', 'Planned', 'Spring market timing'],
    ['', '', '', '', '', '', '', '', '', ''],

    // ============ Q2 SURGES ============
    ['Q2', 'Natl Home Performance Conference', 'Geo-fence', 'B2B', 'Apr 13-15', 'Geo-fence ads', '$1,000-1,500', 'Conference creative', 'Planned', ''],
    ['Q2', 'RESO Spring', 'Conference', 'B2B', 'Apr (TBD)', 'LinkedIn', '$500', 'Social support', 'Planned', 'Product focus'],
    ['Q2', 'T3 Leadership Summit', 'Conference', 'B2B', 'May (TBD)', 'LinkedIn, Geo-fence', '$1,500', 'Leadership messaging', 'Planned', ''],
    ['Q2', 'Agent\'s Guide Launch', 'Report + Social', 'B2B', 'May (TBD)', 'LinkedIn, X, Paid', '$1,500-2,000', 'Guide, social cards, ads', 'Planned', 'Pillar content'],
    ['Q2', 'NAR Sustainability Summit', 'Conference', 'B2B', 'Q2 (TBD)', 'LinkedIn, Geo-fence', '$1,000-1,500', 'Sustainability messaging', 'Planned', ''],
    ['', '', '', '', '', '', '', '', '', ''],

    // ============ Q3 SURGES ============
    ['Q3', 'Inman Connect San Diego', 'Conference + Geo-fence', 'B2B', 'Jul 28', 'LinkedIn, Geo-fence', '$2,000', 'Event creative, geo-fence', 'Planned', 'Major event'],
    ['Q3', 'Home Resilience Report Launch', 'Report + Social', 'B2C', 'Jul (TBD)', 'Facebook, BlueSky, PR', '$1,500', 'Report, consumer social', 'Planned', 'Storm season hook'],
    ['Q3', 'Partnership Announcement (TBD)', 'PR Moment', 'Both', 'Q3', 'All social, PR', '$1,000-2,000', 'Announcement assets', 'Planned', 'Major PR opportunity'],
    ['', '', '', '', '', '', '', '', '', ''],

    // ============ Q4 SURGES ============
    ['Q4', 'True Cost of Homeownership Launch', 'Report + Social', 'B2C', 'Sep (TBD)', 'Facebook, LinkedIn, PR', '$1,500', 'Report, social cards', 'Planned', 'Fall buying season'],
    ['Q4', 'NAR NXT', 'Conference + Geo-fence', 'B2B', 'Nov', 'LinkedIn, Geo-fence', '$2,500-3,000', 'Event creative, geo-fence', 'Planned', 'Major event - high visibility'],
    ['Q4', 'Year in Review Launch', 'Report + Social + PR', 'Both', 'Nov/Dec', 'All channels, PR push', '$1,500-2,000', 'Report, social, PR pitch', 'Planned', 'Year-end media window'],
    ['', '', '', '', '', '', '', '', '', ''],

    // ============ AD WARMUP (No ads run in 1+ year) ============
    ['--- AD ACCOUNT WARMUP ---', '', '', '', '', '', '', '', '', ''],
    ['Q1', 'Meta warmup campaign', 'Warmup', 'B2C', 'Jan 6-24', 'Meta (Facebook)', '$500-1,000', 'Evergreen content, low-pressure CTA', 'Planned', 'Start 3 weeks before first surge'],
    ['Q1', 'LinkedIn warmup campaign', 'Warmup', 'B2B', 'Jan 6-24', 'LinkedIn', '$500-1,000', 'Thought leadership, awareness', 'Planned', 'Re-establish pixel, test audiences'],
    ['', '', '', '', '', '', '', '', '', ''],

    // ============ PLANNING NOTES ============
    ['--- SURGE PLANNING NOTES ---', '', '', '', '', '', '', '', '', ''],
    ['', 'AD WARMUP: Start 2-3 weeks before first surge with low budget', '', '', '', '', '', '', '', ''],
    ['', 'Meta: Pixel needs ~50 events/week to exit learning phase', '', '', '', '', '', '', '', ''],
    ['', 'LinkedIn: Less strict but benefits from audience testing first', '', '', '', '', '', '', '', ''],
    ['', 'Lead time: 2-3 weeks for creative prep', '', '', '', '', '', '', '', ''],
    ['', 'Geo-fence: Book venue lists 2 weeks before', '', '', '', '', '', '', '', ''],
    ['', 'Social surge: Batch create with AI, schedule in advance', '', '', '', '', '', '', '', ''],
    ['', 'PR coordination: Atkinson pitches 3-4 weeks ahead', '', '', '', '', '', '', '', '']
  ];

  sheet.getRange(2, 1, data.length, data[0].length).setValues(data);

  // Color coding
  for (var i = 0; i < data.length; i++) {
    var row = i + 2;
    var audienceCell = sheet.getRange(row, 4);
    var typeCell = sheet.getRange(row, 3);

    // Audience colors
    if (data[i][3] === 'B2B') {
      audienceCell.setBackground(LIGHT_BLUE);
    } else if (data[i][3] === 'B2C') {
      audienceCell.setBackground(LIGHT_GREEN);
    } else if (data[i][3] === 'Both') {
      audienceCell.setBackground(LIGHT_YELLOW);
    }

    // Geo-fence rows get orange highlight on Type
    if (data[i][2] && data[i][2].indexOf('Geo-fence') >= 0) {
      typeCell.setBackground(LIGHT_ORANGE);
    }

    // Bold section headers
    if (data[i][0] && data[i][0].indexOf('---') >= 0) {
      sheet.getRange(row, 1, 1, data[0].length).setFontWeight('bold').setBackground(LIGHT_GRAY);
    }
  }

  // Column widths
  sheet.setColumnWidth(1, 70);   // Quarter
  sheet.setColumnWidth(2, 260);  // Moment
  sheet.setColumnWidth(3, 140);  // Type
  sheet.setColumnWidth(4, 70);   // Audience
  sheet.setColumnWidth(5, 100);  // Dates
  sheet.setColumnWidth(6, 150);  // Channels
  sheet.setColumnWidth(7, 100);  // Budget Est.
  sheet.setColumnWidth(8, 250);  // Content Needed
  sheet.setColumnWidth(9, 80);   // Status
  sheet.setColumnWidth(10, 200); // Notes

  // Enable text wrap
  sheet.getRange(2, 2, data.length, 1).setWrap(true);
  sheet.getRange(2, 8, data.length, 1).setWrap(true);
  sheet.getRange(2, 10, data.length, 1).setWrap(true);

  sheet.setFrozenRows(1);

  // Data validation for Status
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Planned', 'In Progress', 'Complete', 'Cancelled'], true)
    .build();
  sheet.getRange(2, 9, 25, 1).setDataValidation(statusRule);
}

// ============================================================
// SHEET 2: Geo-Fence Campaigns (10 annual target)
// ============================================================
function buildGeoFenceSheet(ss) {
  var sheet = ss.insertSheet('Geo-Fence Campaigns');
  buildGeoFenceData(sheet);
}

function buildGeoFenceData(sheet) {
  var BLUE = '#003366';
  var LIGHT_BLUE = '#e6f3ff';
  var LIGHT_GREEN = '#e6ffe6';
  var LIGHT_ORANGE = '#fff5e6';

  var headers = ['#', 'Event/Venue', 'Dates', 'Location', 'Est. Attendance', 'Audience', 'Budget', 'Creative', 'Vendor', 'Status', 'Results'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground(BLUE)
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // 10 annual geo-fence campaigns
  var data = [
    // Q1
    ['1', 'Inman Connect NYC', 'Feb 4-6', 'New York, NY', '2,000-4,000', 'B2B', '$1,500-2,000', '', '', 'Planned', ''],
    
    // Q2
    ['3', 'Natl Home Performance Conf', 'Apr 13-15', 'TBD', '2,800', 'B2B', '$1,000-1,500', '', '', 'Planned', ''],
    ['4', 'T3 Leadership Summit', 'May (TBD)', 'TBD', 'TBD', 'B2B', '$1,000-1,500', '', '', 'Planned', ''],
    ['5', 'NAR Sustainability Summit', 'Q2 (TBD)', 'TBD', 'TBD', 'B2B', '$1,000-1,500', '', '', 'Planned', ''],

    // Q3
    ['6', 'Inman Connect San Diego', 'Jul 28', 'San Diego, CA', '2,000+', 'B2B', '$2,000', '', '', 'Planned', 'Major event'],

    // Q4
    ['7', 'NAR NXT', 'Nov', 'TBD', '10,000+', 'B2B', '$2,500-3,000', '', '', 'Planned', 'Major event'],

    // Remaining slots
    ['8', '[TBD - Opportunity]', '', '', '', '', '$1,000-1,500', '', '', 'Open', ''],
    ['9', '[TBD - Opportunity]', '', '', '', '', '$1,000-1,500', '', '', 'Open', ''],
    ['10', '[TBD - Opportunity]', '', '', '', '', '$1,000-1,500', '', '', 'Open', ''],
    ['', '', '', '', '', '', '', '', '', '', ''],

    // Summary
    ['--- ANNUAL SUMMARY ---', '', '', '', '', '', '', '', '', '', ''],
    ['Total Budget', '', '', '', '', '', '$13,500-17,500', '', '', '', ''],
    ['Target: 10 campaigns', '', '', '', '', '', '', '', '', '', '']
  ];

  sheet.getRange(2, 1, data.length, data[0].length).setValues(data);

  // Color coding
  for (var i = 0; i < data.length; i++) {
    var row = i + 2;
    var audienceCell = sheet.getRange(row, 6);

    if (data[i][5] === 'B2B') {
      audienceCell.setBackground(LIGHT_BLUE);
    } else if (data[i][5] === 'B2C') {
      audienceCell.setBackground(LIGHT_GREEN);
    }

    // Bold summary rows
    if (data[i][0] && data[i][0].indexOf('---') >= 0) {
      sheet.getRange(row, 1, 1, data[0].length).setFontWeight('bold').setBackground('#f5f5f5');
    }
  }

  // Column widths
  sheet.setColumnWidth(1, 40);
  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(3, 90);
  sheet.setColumnWidth(4, 120);
  sheet.setColumnWidth(5, 100);
  sheet.setColumnWidth(6, 70);
  sheet.setColumnWidth(7, 100);
  sheet.setColumnWidth(8, 120);
  sheet.setColumnWidth(9, 100);
  sheet.setColumnWidth(10, 80);
  sheet.setColumnWidth(11, 150);

  sheet.getRange(2, 11, data.length, 1).setWrap(true);
  sheet.setFrozenRows(1);

  // Data validation for Status
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Open', 'Planned', 'Booked', 'Live', 'Complete', 'Cancelled'], true)
    .build();
  sheet.getRange(2, 10, 15, 1).setDataValidation(statusRule);
}

// ============================================================
// SHEET 3: Budget Tracker
// ============================================================
function buildBudgetSheet(ss) {
  var sheet = ss.insertSheet('Budget Tracker');
  buildBudgetData(sheet);
}

function buildBudgetData(sheet) {
  var BLUE = '#003366';
  var LIGHT_GREEN = '#e8f5e9';
  var LIGHT_GRAY = '#f5f5f5';

  var headers = ['Quarter', 'Category', 'Budget', 'Spent', 'Remaining', 'Notes'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground(BLUE)
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Budget by quarter aligned with Annual Plan allocations
  var data = [
    // Q1
    ['Q1', 'Ad Warmup - Meta (3 weeks before surge)', '$500-1,000', '', '', 'Jan 6-24 | Re-establish pixel'],
    ['Q1', 'Ad Warmup - LinkedIn (3 weeks before surge)', '$500-1,000', '', '', 'Jan 6-24 | Test audiences'],
    ['Q1', 'Report Launch Surge (State of Home Perf)', '$2,000-3,000', '', '', 'Jan 27-Feb 7'],
    ['Q1', 'Inman Connect NYC Geo-fence', '$1,500-2,000', '', '', 'Feb 4-6'],
        ['Q1', 'What Buyers Want Launch', '$1,500-2,000', '', '', 'Mar 10-14'],
    ['Q1 TOTAL', '', '$7,000-10,500', '', '', 'Includes warmup'],
    ['', '', '', '', '', ''],

    // Q2
    ['Q2', 'Natl Home Perf Conf Geo-fence', '$1,000-1,500', '', '', 'Apr 13-15'],
    ['Q2', 'RESO Spring', '$500', '', '', 'Social support'],
    ['Q2', 'T3 Leadership Summit', '$1,500', '', '', 'Geo-fence + social'],
    ['Q2', 'Agent\'s Guide Launch', '$1,500-2,000', '', '', 'Pillar content'],
    ['Q2', 'NAR Sustainability Summit', '$1,000-1,500', '', '', 'Geo-fence'],
    ['Q2 TOTAL', '', '$5,500-7,000', '', '', ''],
    ['', '', '', '', '', ''],

    // Q3
    ['Q3', 'Inman Connect San Diego', '$2,000', '', '', 'Major event'],
    ['Q3', 'Home Resilience Report', '$1,500', '', '', 'Storm season'],
    ['Q3', 'Partnership Announcement', '$1,000-2,000', '', '', 'TBD'],
    ['Q3 TOTAL', '', '$4,500-5,500', '', '', ''],
    ['', '', '', '', '', ''],

    // Q4
    ['Q4', 'True Cost of Homeownership', '$1,500', '', '', 'Fall season'],
    ['Q4', 'NAR NXT Geo-fence', '$2,500-3,000', '', '', 'Major event'],
    ['Q4', 'Year in Review', '$1,500-2,000', '', '', 'Year-end PR'],
    ['Q4 TOTAL', '', '$5,500-7,500', '', '', ''],
    ['', '', '', '', '', ''],

    // Annual
    ['--- ANNUAL SUMMARY ---', '', '', '', '', ''],
    ['YEAR TOTAL', 'Surge/Paid Campaigns', '$22,500-30,500', '', '', 'Includes Q1 warmup ($1-2K)']
  ];

  sheet.getRange(2, 1, data.length, data[0].length).setValues(data);

  // Style quarterly totals and annual summary
  for (var i = 0; i < data.length; i++) {
    var row = i + 2;
    if (data[i][0] && (data[i][0].indexOf('TOTAL') >= 0 || data[i][0].indexOf('---') >= 0)) {
      sheet.getRange(row, 1, 1, data[0].length).setFontWeight('bold');
      if (data[i][0] === 'YEAR TOTAL') {
        sheet.getRange(row, 1, 1, data[0].length).setBackground(LIGHT_GREEN);
      } else if (data[i][0].indexOf('---') >= 0) {
        sheet.getRange(row, 1, 1, data[0].length).setBackground(LIGHT_GRAY);
      }
    }
  }

  // Column widths
  sheet.setColumnWidth(1, 100);
  sheet.setColumnWidth(2, 280);
  sheet.setColumnWidth(3, 120);
  sheet.setColumnWidth(4, 100);
  sheet.setColumnWidth(5, 100);
  sheet.setColumnWidth(6, 180);

  sheet.getRange(2, 6, data.length, 1).setWrap(true);
  sheet.setFrozenRows(1);
}
