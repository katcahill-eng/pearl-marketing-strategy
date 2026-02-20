// ============================================================
// Pearl 2026 PR & Media Tracker - Google Apps Script
// Tracks Atkinson PR deliverables, media coverage, podcasts
// Naming convention: Pearl_MKTG_[Name]_[Year]
// ============================================================

// CONFIGURATION - Set this after creating the sheet
var SHEET_ID = '1hstp9REbLnlSzrgpeYXgpxZePuaPEnqneWhqUBIXlu8';

// ============================================================
// CREATE new spreadsheet
// ============================================================
function createPRTracker() {
  var ss = SpreadsheetApp.create('Pearl_MKTG_PR Tracker_2026');

  // Build all sheets
  buildAtkinsonSheet(ss);
  buildMediaCoverageSheet(ss);
  buildPodcastSheet(ss);

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
function updatePRTracker() {
  var ss = SpreadsheetApp.openById(SHEET_ID);

  // Clear and rebuild Atkinson Deliverables
  var atkinsonSheet = ss.getSheetByName('Atkinson Deliverables');
  if (atkinsonSheet) {
    atkinsonSheet.clear();
  } else {
    atkinsonSheet = ss.insertSheet('Atkinson Deliverables');
  }
  buildAtkinsonData(atkinsonSheet);

  // Clear and rebuild Media Coverage
  var mediaSheet = ss.getSheetByName('Media Coverage');
  if (mediaSheet) {
    mediaSheet.clear();
  } else {
    mediaSheet = ss.insertSheet('Media Coverage');
  }
  buildMediaData(mediaSheet);

  // Clear and rebuild Podcast Tracker
  var podcastSheet = ss.getSheetByName('Podcast Tracker');
  if (podcastSheet) {
    podcastSheet.clear();
  } else {
    podcastSheet = ss.insertSheet('Podcast Tracker');
  }
  buildPodcastData(podcastSheet);

  Logger.log('Spreadsheet updated: ' + ss.getUrl());
}

// ============================================================
// SHEET 1: Atkinson Deliverables
// ============================================================
function buildAtkinsonSheet(ss) {
  var sheet = ss.insertSheet('Atkinson Deliverables');
  buildAtkinsonData(sheet);
}

function buildAtkinsonData(sheet) {
  var BLUE = '#003366';
  var LIGHT_BLUE = '#e6f3ff';
  var LIGHT_ORANGE = '#fff5e6';

  // Header
  var headers = ['Month', 'Deliverable', 'Contract', 'Target', 'Actual', 'Status', 'Notes'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground(BLUE)
    .setFontColor('#ffffff')
    .setFontWeight('bold');

  // Atkinson deliverables by month
  // Base retainer = $4,500/month
  var data = [
    // January
    ['January', 'Media pitches', 'Base', '20', '', 'Planned', ''],
    ['January', 'Story concepts + pitch memos', 'Base', '5', '', 'Planned', ''],
    ['January', 'Media monitoring report', 'Base', '1', '', 'Planned', 'End of month'],
    ['January', 'Status meeting', 'Base', '1', '', 'Planned', ''],
    ['January', 'Podcast pitches', 'Expanded?', '12', '', 'Planned', 'If expanded scope approved'],

    // February
    ['February', 'Media pitches', 'Base', '20', '', 'Planned', ''],
    ['February', 'Story concepts + pitch memos', 'Base', '5', '', 'Planned', ''],
    ['February', 'Media monitoring report', 'Base', '1', '', 'Planned', 'End of month'],
    ['February', 'Status meeting', 'Base', '1', '', 'Planned', ''],
    ['February', 'Podcast pitches', 'Expanded?', '12', '', 'Planned', ''],

    // March
    ['March', 'Media pitches', 'Base', '20', '', 'Planned', ''],
    ['March', 'Story concepts + pitch memos', 'Base', '5', '', 'Planned', ''],
    ['March', 'Media monitoring report', 'Base', '1', '', 'Planned', 'End of month'],
    ['March', 'Status meeting', 'Base', '1', '', 'Planned', ''],
    ['March', 'Podcast pitches', 'Expanded?', '12', '', 'Planned', ''],
    ['March', 'Q1 media summary', 'Base', '1', '', 'Planned', 'Full quarter coverage report'],

    // Q1 Totals row
    ['Q1 TOTAL', 'Media pitches', '', '60', '', '', ''],
    ['Q1 TOTAL', 'Story concepts', '', '15', '', '', ''],
    ['Q1 TOTAL', 'Podcast pitches', '', '36', '', '', 'If expanded'],
    ['Q1 TOTAL', 'Podcast bookings target', '', '12-18', '', '', '4-6/month']
  ];

  sheet.getRange(2, 1, data.length, data[0].length).setValues(data);

  // Color code Contract column (Base = blue, Expanded = orange)
  for (var i = 0; i < data.length; i++) {
    var contractCell = sheet.getRange(i + 2, 3);
    if (data[i][2] === 'Base') {
      contractCell.setBackground(LIGHT_BLUE);
    } else if (data[i][2] === 'Expanded?') {
      contractCell.setBackground(LIGHT_ORANGE);
    }
    // Bold the total rows
    if (data[i][0] === 'Q1 TOTAL') {
      sheet.getRange(i + 2, 1, 1, data[0].length).setFontWeight('bold').setBackground('#f5f5f5');
    }
  }

  // Column widths
  sheet.setColumnWidth(1, 90);
  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(3, 80);
  sheet.setColumnWidth(4, 60);
  sheet.setColumnWidth(5, 60);
  sheet.setColumnWidth(6, 80);
  sheet.setColumnWidth(7, 200);

  sheet.getRange(2, 7, data.length, 1).setWrap(true);
  sheet.setFrozenRows(1);

  // Data validation for Status
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Planned', 'In Progress', 'Complete', 'Behind'], true)
    .build();
  sheet.getRange(2, 6, data.length, 1).setDataValidation(statusRule);
}

// ============================================================
// SHEET 2: Media Coverage
// ============================================================
function buildMediaCoverageSheet(ss) {
  var sheet = ss.insertSheet('Media Coverage');
  buildMediaData(sheet);
}

function buildMediaData(sheet) {
  var BLUE = '#003366';
  var LIGHT_GREEN = '#e8f5e9';

  var headers = ['Date', 'Publication', 'Title', 'URL', 'Spokesperson', 'Type', 'Tier', 'Notes'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground(BLUE)
    .setFontColor('#ffffff')
    .setFontWeight('bold');

  // Existing + placeholder coverage
  var coverage = [
    // Historical coverage (for reference in pitches)
    ['2016', 'Canary Media', 'Interview with founders', '', 'Cynthia Adams, Robin LeBaron', 'Interview', 'Tier 2', 'Reference in pitches'],
    ['2024', 'Energy News Network', 'Pearl Certification profile', '', 'Pearl', 'Profile', 'Tier 2', 'Reference in pitches'],
    ['2024', 'Wall Street Journal', 'Coverage by Ashlea Ebeling', '', 'Cynthia Adams', 'Feature', 'Tier 1', 'Reference in pitches'],

    // Recent coverage
    ['Nov 2025', 'Inman', '2025 Inman Best of Proptech Award', 'https://www.inman.com/awards/', 'Pearl', 'Award', 'Tier 1', 'Website news'],
    ['Nov 12, 2025', 'Pearl Blog', 'Every Home in America Just Got a Performance Rating', 'https://pearlscore.com/blog/', 'Pearl', 'Owned', '', 'Registry launch announcement'],
    ['Jan 7, 2026', 'Chicago Agent Magazine', 'Pearl SCORE: First-time buyers buying homes as old as they are', 'https://chicagoagentmagazine.com/2026/01/07/pearl-score-2/', 'Cynthia Adams', 'Byline', 'Tier 2', 'Backlink in B2B blog'],

    // Q1 2026 placeholders
    ['', '', '', '', '', '', '', ''],
    ['--- Q1 2026 COVERAGE BELOW ---', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '']
  ];

  sheet.getRange(2, 1, coverage.length, coverage[0].length).setValues(coverage);

  // Highlight Tier 1 coverage
  for (var i = 0; i < coverage.length; i++) {
    if (coverage[i][6] === 'Tier 1') {
      sheet.getRange(i + 2, 1, 1, coverage[0].length).setBackground(LIGHT_GREEN);
    }
  }

  // Column widths
  sheet.setColumnWidth(1, 90);
  sheet.setColumnWidth(2, 150);
  sheet.setColumnWidth(3, 280);
  sheet.setColumnWidth(4, 200);
  sheet.setColumnWidth(5, 140);
  sheet.setColumnWidth(6, 80);
  sheet.setColumnWidth(7, 60);
  sheet.setColumnWidth(8, 180);

  sheet.getRange(2, 3, coverage.length, 1).setWrap(true);
  sheet.getRange(2, 8, coverage.length, 1).setWrap(true);
  sheet.setFrozenRows(1);

  // Data validation for Type
  var typeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Feature', 'Mention', 'Byline', 'Interview', 'Award', 'Profile', 'Podcast', 'Owned'], true)
    .build();
  sheet.getRange(2, 6, 50, 1).setDataValidation(typeRule);

  // Data validation for Tier
  var tierRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Tier 1', 'Tier 2', 'Tier 3', ''], true)
    .build();
  sheet.getRange(2, 7, 50, 1).setDataValidation(tierRule);
}

// ============================================================
// SHEET 3: Podcast Tracker
// ============================================================
function buildPodcastSheet(ss) {
  var sheet = ss.insertSheet('Podcast Tracker');
  buildPodcastData(sheet);
}

function buildPodcastData(sheet) {
  var BLUE = '#003366';
  var LIGHT_GREEN = '#e8f5e9';
  var LIGHT_YELLOW = '#fff9e6';
  var LIGHT_GRAY = '#f5f5f5';

  var headers = ['Podcast Name', 'Audience', 'Pitched', 'Response', 'Record Date', 'Air Date', 'Spokesperson', 'Status', 'Notes'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground(BLUE)
    .setFontColor('#ffffff')
    .setFontWeight('bold');

  // Placeholder rows for tracking
  var podcasts = [
    // Example format
    ['[Podcast Name]', 'B2B', '', '', '', '', '', 'Pitched', 'Add podcasts as Atkinson pitches them'],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    // Q1 Target summary
    ['--- Q1 TARGETS ---', '', '', '', '', '', '', '', ''],
    ['Pitches sent (Atkinson)', '', '', '', '', '', '', '', 'Target: 36 (12/month)'],
    ['Bookings confirmed', '', '', '', '', '', '', '', 'Target: 12-18'],
    ['Appearances completed', '', '', '', '', '', '', '', 'Target: 6+']
  ];

  sheet.getRange(2, 1, podcasts.length, podcasts[0].length).setValues(podcasts);

  // Column widths
  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 70);
  sheet.setColumnWidth(3, 90);
  sheet.setColumnWidth(4, 90);
  sheet.setColumnWidth(5, 90);
  sheet.setColumnWidth(6, 90);
  sheet.setColumnWidth(7, 120);
  sheet.setColumnWidth(8, 90);
  sheet.setColumnWidth(9, 200);

  sheet.getRange(2, 9, podcasts.length, 1).setWrap(true);
  sheet.setFrozenRows(1);

  // Data validation for Audience
  var audienceRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['B2B', 'B2C', 'Both'], true)
    .build();
  sheet.getRange(2, 2, 20, 1).setDataValidation(audienceRule);

  // Data validation for Status
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Pitched', 'Declined', 'Booked', 'Recorded', 'Aired', 'Cancelled'], true)
    .build();
  sheet.getRange(2, 8, 20, 1).setDataValidation(statusRule);
}
