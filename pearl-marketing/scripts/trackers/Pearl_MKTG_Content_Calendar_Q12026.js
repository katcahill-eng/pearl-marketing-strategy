// ============================================================
// Pearl 2026 Organic Content Calendar - Google Apps Script
// Creates a Google Sheet for tracking B2B and B2C organic content
// Tabs: Q1, Q2, Q3, Q4, Content Ideas, Pillar Reference
// Note: Paid/surge campaigns tracked separately in Pearl_MKTG_Surge_Tracker_2026
// ============================================================

// CONFIGURATION - Set this after creating the sheet
var SHEET_ID = '1BAUNAuyRNbdDXr6by_1MPOWUOo_4sRY3kJTNkPI4ZyY';

// ============================================================
// CREATE new spreadsheet (annual with quarterly tabs)
// ============================================================
function createContentCalendar() {
  var ss = SpreadsheetApp.create('Pearl_MKTG_Organic Content Calendar_2026');

  // Build quarterly tabs
  buildQ1Sheet(ss);
  buildQ2Sheet(ss);
  buildQ3Sheet(ss);
  buildQ4Sheet(ss);

  // Build reference sheets
  buildContentIdeasSheet(ss);
  buildPillarContentSheet(ss);

  // Delete default Sheet1
  var defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet) {
    ss.deleteSheet(defaultSheet);
  }

  Logger.log('Spreadsheet created: ' + ss.getUrl());
  Logger.log('Sheet ID: ' + ss.getId());
}

// ============================================================
// UPDATE existing spreadsheet
// ============================================================
function updateContentCalendar() {
  var ss = SpreadsheetApp.openById(SHEET_ID);

  // Clear and rebuild Q1 (or create if missing)
  var q1Sheet = ss.getSheetByName('Q1');
  if (q1Sheet) {
    q1Sheet.clear();
  } else {
    q1Sheet = ss.insertSheet('Q1');
  }
  buildQ1Data(q1Sheet);

  // Clear and rebuild Q2 (or create if missing)
  var q2Sheet = ss.getSheetByName('Q2');
  if (q2Sheet) {
    q2Sheet.clear();
  } else {
    q2Sheet = ss.insertSheet('Q2');
  }
  buildQ2Data(q2Sheet);

  // Clear and rebuild Q3 (or create if missing)
  var q3Sheet = ss.getSheetByName('Q3');
  if (q3Sheet) {
    q3Sheet.clear();
  } else {
    q3Sheet = ss.insertSheet('Q3');
  }
  buildQ3Data(q3Sheet);

  // Clear and rebuild Q4 (or create if missing)
  var q4Sheet = ss.getSheetByName('Q4');
  if (q4Sheet) {
    q4Sheet.clear();
  } else {
    q4Sheet = ss.insertSheet('Q4');
  }
  buildQ4Data(q4Sheet);

  // Clear and rebuild Content Ideas (or create if missing)
  var ideasSheet = ss.getSheetByName('Content Ideas');
  if (ideasSheet) {
    ideasSheet.clear();
  } else {
    ideasSheet = ss.insertSheet('Content Ideas');
  }
  buildIdeasData(ideasSheet);

  // Clear and rebuild Pillar Reference (or create if missing)
  var pillarSheet = ss.getSheetByName('Pillar Reference');
  if (pillarSheet) {
    pillarSheet.clear();
  } else {
    pillarSheet = ss.insertSheet('Pillar Reference');
  }
  buildPillarData(pillarSheet);

  // Clean up old sheet names if they exist (Surge moved to separate tracker)
  var oldSheets = ['Q1 Calendar', 'Pillar Deep Dives', 'Media Coverage', 'Surge Campaigns'];
  oldSheets.forEach(function(name) {
    var oldSheet = ss.getSheetByName(name);
    if (oldSheet) {
      ss.deleteSheet(oldSheet);
    }
  });

  Logger.log('Spreadsheet updated: ' + ss.getUrl());
}

// ============================================================
// SHEET 1: Q1 (January - March)
// ============================================================
function buildQ1Sheet(ss) {
  var sheet = ss.insertSheet('Q1');
  buildQ1Data(sheet);
}

function buildQ1Data(sheet) {
  // Colors
  var BLUE = '#003366';
  var LIGHT_BLUE = '#e6f3ff';   // B2B
  var LIGHT_GREEN = '#e6ffe6';  // B2C
  var LIGHT_GRAY = '#f0f0f0';   // FPS (incoming, needs review)
  var LIGHT_PURPLE = '#f3e5f5'; // Culture

  // Header
  var headers = ['Week', 'Date Range', 'Audience', 'Content Type', 'Title/Topic', 'Channel', 'Owner', 'Status', 'Notes'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground(BLUE)
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Q1 Content Data - REALISTIC CADENCE for 1-person team
  // FPS content grayed out (incoming/review, not creation)
  // Pillar weeks = NO other original content
  // Consumer Survey is STRETCH goal
  // Instagram integrated by week (not hidden at bottom)
  var data = [
    // ============ WEEKS 1-2: FOUNDATION (No heavy lifts) ============
    // Focus: Audits, Atkinson briefing, report prep, one AI-assisted blog
    ['1', 'Jan 13-17', 'B2C', 'Review (FPS)', 'FPS Blog #1 - Review by Jan 17', 'Website', 'Front Page Sage', 'Planned', 'INCOMING: Delivered Fri, review needed'],
    ['1', 'Jan 13-17', 'B2B', 'Social', 'LinkedIn/X posts (3-4)', 'LinkedIn/X', 'Marketing', 'Planned', 'Industry news, Pearl updates'],
    ['1', 'Jan 13-17', 'B2C', 'Social', 'Facebook/BlueSky posts (2-3)', 'Facebook/BlueSky', 'Marketing', 'Planned', 'Homeowner tips'],
    ['1', 'Jan 13-17', 'Culture', 'Social', 'Instagram posts (1-2)', 'Instagram', 'Marketing', 'Planned', 'Team highlights | Source: Water Cooler/Slack'],
    ['2', 'Jan 20-24', 'B2C', 'Review (FPS)', 'FPS Blog #2 - Review by Jan 24', 'Website', 'Front Page Sage', 'Planned', 'INCOMING: Delivered Fri, review needed'],
    ['2', 'Jan 20-24', 'B2B', 'Blog', 'Pearl SCORE: What Agents Need to Know', 'Website', 'Marketing + AI', 'Planned', 'Expand Chicago Agent Mag article | AI drafts, you edit'],
    ['2', 'Jan 20-24', 'B2B', 'Social', 'LinkedIn/X posts (3-4)', 'LinkedIn/X', 'Marketing', 'Planned', 'Blog launch + report teaser'],
    ['2', 'Jan 20-24', 'B2C', 'Social', 'Facebook/BlueSky posts (2-3)', 'Facebook/BlueSky', 'Marketing', 'Planned', 'Homeowner tips'],
    ['2', 'Jan 20-24', 'Culture', 'Social', 'Instagram posts (1-2)', 'Instagram', 'Marketing', 'Planned', 'Team highlights | Source: Water Cooler/Slack'],

    // ============ WEEKS 3-4: REPORT LAUNCH (PILLAR #1) ============
    // Focus: State of Home Performance 2026 + Inman NYC
    // NO other original content creation - just report + social surge
    ['3', 'Jan 27-31', 'B2C', 'Review (FPS)', 'FPS Blog #3 - Review by Jan 31', 'Website', 'Front Page Sage', 'Planned', 'INCOMING: Delivered Fri, review needed'],
    ['3', 'Jan 27-31', 'B2B', 'Report', 'STATE OF HOME PERFORMANCE 2026', 'Website/PR', 'Marketing', 'Planned', '>>> PILLAR #1 - Full week focus <<<'],
    ['3', 'Jan 27-31', 'B2B', 'Social', 'LinkedIn/X SURGE - Report launch', 'LinkedIn/X', 'Marketing', 'Planned', 'Daily posting (7+ posts) - AI batch create'],
    ['3', 'Jan 27-31', 'B2C', 'Social', 'Facebook/BlueSky - Report highlights', 'Facebook/BlueSky', 'Marketing', 'Planned', '3-4 posts consumer angle'],
    ['3', 'Jan 27-31', 'Culture', 'Social', 'Instagram posts (1-2)', 'Instagram', 'Marketing', 'Planned', 'Report launch celebration | Source: Water Cooler/Slack'],
    ['4', 'Feb 3-7', 'B2C', 'Review (FPS)', 'FPS Blog #4 - Review by Feb 7', 'Website', 'Front Page Sage', 'Planned', 'INCOMING: Delivered Fri, review needed'],
    ['4', 'Feb 3-7', 'B2B', 'Event', 'Inman Connect NYC', 'Conference', 'BD + Marketing', 'Planned', 'Support BD, capture content'],
    ['4', 'Feb 3-7', 'B2B', 'Social', 'LinkedIn/X SURGE - Inman + Report', 'LinkedIn/X', 'Marketing', 'Planned', 'Daily posting (7+ posts) - live event + report reshares'],
    ['4', 'Feb 3-7', 'B2C', 'Social', 'Facebook/BlueSky posts (2-3)', 'Facebook/BlueSky', 'Marketing', 'Planned', 'Report reshares, homeowner angle'],
    ['4', 'Feb 3-7', 'Culture', 'Social', 'Instagram posts (2-3)', 'Instagram', 'Marketing', 'Planned', 'Inman NYC behind the scenes | Source: Water Cooler/Slack'],

    // ============ WEEKS 5-6: DERIVATIVES + BREATHING ROOM ============
    // Focus: Create derivatives from report, normal cadence returns
    ['5', 'Feb 10-14', 'B2C', 'Review (FPS)', 'FPS Blog #5 - Review by Feb 14', 'Website', 'Front Page Sage', 'Planned', 'INCOMING: Delivered Fri, review needed'],
    ['5', 'Feb 10-14', 'Both', 'Derivative', 'Report Infographic (key findings)', 'Website/Social', 'Marketing + AI', 'Planned', 'AI drafts copy, design in Canva'],
    ['5', 'Feb 10-14', 'Both', 'Derivative', 'Social Quote Cards (4-6)', 'Social', 'Marketing + AI', 'Planned', 'Pull quotes from report, batch create'],
    ['5', 'Feb 10-14', 'B2B', 'Social', 'LinkedIn/X posts (3-4)', 'LinkedIn/X', 'Marketing', 'Planned', 'Report derivatives + industry news'],
    ['5', 'Feb 10-14', 'B2C', 'Social', 'Facebook/BlueSky posts (2-3)', 'Facebook/BlueSky', 'Marketing', 'Planned', 'Infographic shares, tips'],
    ['5', 'Feb 10-14', 'Culture', 'Social', 'Instagram posts (1-2)', 'Instagram', 'Marketing', 'Planned', 'Team highlights | Source: Water Cooler/Slack'],
    ['6', 'Feb 17-21', 'B2C', 'Review (FPS)', 'FPS Blog #6 - Review by Feb 21', 'Website', 'Front Page Sage', 'Planned', 'INCOMING: Delivered Fri, review needed'],
    ['6', 'Feb 17-21', 'Both', 'Derivative', 'Ad Creatives (4 variations)', 'LinkedIn Ads', 'Marketing + AI', 'Planned', 'For paid surge, batch create'],
    ['6', 'Feb 17-21', 'B2B', 'Social', 'LinkedIn/X posts (3-4)', 'LinkedIn/X', 'Marketing', 'Planned', 'Normal cadence'],
    ['6', 'Feb 17-21', 'B2C', 'Social', 'Facebook/BlueSky posts (2-3)', 'Facebook/BlueSky', 'Marketing', 'Planned', 'Normal cadence'],
    ['6', 'Feb 17-21', 'Culture', 'Social', 'Instagram posts (1-2)', 'Instagram', 'Marketing', 'Planned', 'Team highlights | Source: Water Cooler/Slack'],

    // ============ WEEKS 7-8: B2B BLOG + BREATHING ROOM ============
    // Focus: One B2B blog (AI-assisted), case study if data ready
    ['7', 'Feb 24-28', 'B2C', 'Review (FPS)', 'FPS Blog #7 - Review by Feb 28', 'Website', 'Front Page Sage', 'Planned', 'INCOMING: Delivered Fri, review needed'],
    ['7', 'Feb 24-28', 'B2B', 'Blog', 'How Pearl SCORE Helps Answer Buyer Questions', 'Website', 'Marketing + AI', 'Planned', 'AI drafts, you edit | Agent value prop'],
    ['7', 'Feb 24-28', 'B2B', 'Social', 'LinkedIn/X posts (4-5)', 'LinkedIn/X', 'Marketing', 'Planned', 'Blog launch + key points'],
    ['7', 'Feb 24-28', 'B2C', 'Social', 'Facebook/BlueSky posts (2-3)', 'Facebook/BlueSky', 'Marketing', 'Planned', 'Normal cadence'],
    ['7', 'Feb 24-28', 'Culture', 'Social', 'Instagram posts (1-2)', 'Instagram', 'Marketing', 'Planned', 'Team highlights | Source: Water Cooler/Slack'],
    ['8', 'Mar 3-7', 'B2C', 'Review (FPS)', 'FPS Blog #8 - Review by Mar 7', 'Website', 'Front Page Sage', 'Planned', 'INCOMING: Delivered Fri, review needed'],
    ['8', 'Mar 3-7', 'B2B', 'Case Study', 'Case Study: [TBD] - IF DATA READY', 'Website', 'Marketing + AI', 'Planned', 'STRETCH: Only if agent data available'],
    ['8', 'Mar 3-7', 'B2B', 'Social', 'LinkedIn/X posts (3-4)', 'LinkedIn/X', 'Marketing', 'Planned', 'Blog reshares + industry news'],
    ['8', 'Mar 3-7', 'B2C', 'Social', 'Facebook/BlueSky posts (2-3)', 'Facebook/BlueSky', 'Marketing', 'Planned', 'Normal cadence'],
    ['8', 'Mar 3-7', 'Culture', 'Social', 'Instagram posts (1-2)', 'Instagram', 'Marketing', 'Planned', 'Team highlights | Source: Water Cooler/Slack'],

    // ============ WEEKS 9-10: PILLAR #2 LAUNCH ============
    // Focus: What Buyers Want report
    // Consumer Survey is STRETCH - only if bandwidth allows
    ['9', 'Mar 10-14', 'B2C', 'Review (FPS)', 'FPS Blog #9 - Review by Mar 14', 'Website', 'Front Page Sage', 'Planned', 'INCOMING: Delivered Fri, review needed'],
    ['9', 'Mar 10-14', 'B2B', 'Report', 'WHAT BUYERS WANT (THAT LISTINGS DON\'T SHOW)', 'Website/PR', 'Marketing', 'Planned', '>>> PILLAR #2 - Full week focus <<<'],
    ['9', 'Mar 10-14', 'B2B', 'Social', 'LinkedIn/X SURGE - Report launch', 'LinkedIn/X', 'Marketing', 'Planned', 'Daily posting (7+ posts) - AI batch create'],
    ['9', 'Mar 10-14', 'B2C', 'Social', 'Facebook/BlueSky - Buyer insights', 'Facebook/BlueSky', 'Marketing', 'Planned', '3-4 posts consumer angle'],
    ['9', 'Mar 10-14', 'Culture', 'Social', 'Instagram posts (1-2)', 'Instagram', 'Marketing', 'Planned', 'Report launch celebration | Source: Water Cooler/Slack'],
    ['10', 'Mar 17-21', 'B2C', 'Review (FPS)', 'FPS Blog #10 - Review by Mar 21', 'Website', 'Front Page Sage', 'Planned', 'INCOMING: Delivered Fri, review needed'],
    ['10', 'Mar 17-21', 'B2C', 'Report', 'Consumer Survey - STRETCH GOAL', 'Website/PR', 'Marketing', 'Planned', 'ONLY if bandwidth allows'],
    ['10', 'Mar 17-21', 'B2B', 'Social', 'LinkedIn/X posts (4-5)', 'LinkedIn/X', 'Marketing', 'Planned', 'Report reshares + findings'],
    ['10', 'Mar 17-21', 'B2C', 'Social', 'Facebook/BlueSky posts (3-4)', 'Facebook/BlueSky', 'Marketing', 'Planned', 'Report reshares, buyer tips'],
    ['10', 'Mar 17-21', 'Culture', 'Social', 'Instagram posts (1-2)', 'Instagram', 'Marketing', 'Planned', 'Team highlights | Source: Water Cooler/Slack'],

    // ============ WEEKS 11-12: B2B BLOG + Q2 PREP ============
    // Focus: Final B2B blog, Q1 wrap-up, Q2 planning
    ['11', 'Mar 24-28', 'B2C', 'Review (FPS)', 'FPS Blog #11 - Review by Mar 28', 'Website', 'Front Page Sage', 'Planned', 'INCOMING: Delivered Fri, review needed'],
    ['11', 'Mar 24-28', 'B2B', 'Blog', 'Spring Market Prep: Differentiate with Performance Data', 'Website', 'Marketing + AI', 'Planned', 'AI drafts, you edit | Seasonal hook'],
    ['11', 'Mar 24-28', 'B2B', 'Social', 'LinkedIn/X posts (4-5)', 'LinkedIn/X', 'Marketing', 'Planned', 'Blog launch + seasonal tips'],
    ['11', 'Mar 24-28', 'B2C', 'Social', 'Facebook/BlueSky posts (2-3)', 'Facebook/BlueSky', 'Marketing', 'Planned', 'Normal cadence'],
    ['11', 'Mar 24-28', 'Culture', 'Social', 'Instagram posts (1-2)', 'Instagram', 'Marketing', 'Planned', 'Team highlights | Source: Water Cooler/Slack'],
    ['12', 'Mar 31-Apr 4', 'B2C', 'Review (FPS)', 'FPS Blog #12 - Review by Apr 4', 'Website', 'Front Page Sage', 'Planned', 'INCOMING: Delivered Fri, review needed'],
    ['12', 'Mar 31-Apr 4', 'Both', 'Planning', 'Q1 Assessment + Q2 Calendar', 'Internal', 'Marketing', 'Planned', 'Metrics review, plan Q2'],
    ['12', 'Mar 31-Apr 4', 'B2B', 'Social', 'LinkedIn/X posts (3-4)', 'LinkedIn/X', 'Marketing', 'Planned', 'Q1 highlights, best content reshares'],
    ['12', 'Mar 31-Apr 4', 'B2C', 'Social', 'Facebook/BlueSky posts (2-3)', 'Facebook/BlueSky', 'Marketing', 'Planned', 'Q1 recap, homeowner tips'],
    ['12', 'Mar 31-Apr 4', 'Culture', 'Social', 'Instagram posts (1-2)', 'Instagram', 'Marketing', 'Planned', 'Q1 team wins | Source: Water Cooler/Slack']
  ];

  sheet.getRange(2, 1, data.length, data[0].length).setValues(data);

  // Color coding:
  // - FPS rows: entire row grayed out (incoming content, needs review)
  // - Other rows: just Audience column colored (B2B=blue, B2C=green, Culture=purple)
  for (var i = 0; i < data.length; i++) {
    var rowRange = sheet.getRange(i + 2, 1, 1, data[0].length);
    var audienceCell = sheet.getRange(i + 2, 3);
    var contentType = data[i][3];

    // FPS/Review rows get entirely grayed out
    if (contentType === 'Review (FPS)') {
      rowRange.setBackground(LIGHT_GRAY);
      rowRange.setFontColor('#666666');  // Gray text too
    } else {
      // Regular rows: just color the audience cell
      if (data[i][2] === 'B2B') {
        audienceCell.setBackground(LIGHT_BLUE);
      } else if (data[i][2] === 'B2C') {
        audienceCell.setBackground(LIGHT_GREEN);
      } else if (data[i][2] === 'Both') {
        audienceCell.setBackground('#fff9e6');  // Light yellow for Both
      } else if (data[i][2] === 'Culture') {
        audienceCell.setBackground(LIGHT_PURPLE);
      }
    }
  }

  // Column widths - wider to prevent cutoff
  sheet.setColumnWidth(1, 55);   // Week
  sheet.setColumnWidth(2, 95);   // Date Range
  sheet.setColumnWidth(3, 65);   // Audience
  sheet.setColumnWidth(4, 85);   // Content Type
  sheet.setColumnWidth(5, 380);  // Title/Topic
  sheet.setColumnWidth(6, 110);  // Channel
  sheet.setColumnWidth(7, 85);   // Owner
  sheet.setColumnWidth(8, 80);   // Status
  sheet.setColumnWidth(9, 280);  // Notes

  // Enable text wrap for Title and Notes columns
  sheet.getRange(2, 5, data.length, 1).setWrap(true);  // Title
  sheet.getRange(2, 9, data.length, 1).setWrap(true);  // Notes

  // Freeze header row
  sheet.setFrozenRows(1);

  // Add data validation for Status
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Planned', 'In Progress', 'Review', 'Published', 'On Hold'], true)
    .build();
  sheet.getRange(2, 8, data.length, 1).setDataValidation(statusRule);

  // Add data validation for Audience
  var audienceRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['B2B', 'B2C', 'Culture', 'Both'], true)
    .build();
  sheet.getRange(2, 3, data.length, 1).setDataValidation(audienceRule);
}

// ============================================================
// SHEET 2: Q2 (April - June)
// ============================================================
function buildQ2Sheet(ss) {
  var sheet = ss.insertSheet('Q2');
  buildQ2Data(sheet);
}

function buildQ2Data(sheet) {
  var BLUE = '#003366';
  var LIGHT_GRAY = '#f5f5f5';
  var LIGHT_BLUE = '#e6f3ff';
  var LIGHT_GREEN = '#e6ffe6';
  var LIGHT_YELLOW = '#fff9e6';

  var headers = ['Week', 'Date Range', 'Audience', 'Content Type', 'Title/Topic', 'Channel', 'Owner', 'Status', 'Notes'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground(BLUE)
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Q2 placeholder - to be planned at end of Q1
  var data = [
    ['13', 'Apr 7-11', '', '', 'Q2 content to be planned during Week 12', '', 'Marketing', 'Planned', 'Plan during Q1 Assessment'],
    ['', '', '', '', '', '', '', '', ''],
    ['--- KEY Q2 EVENTS ---', '', '', '', '', '', '', '', ''],
    ['14', 'Apr 14-18', 'B2B', 'Event', 'Natl Home Performance Conference (Apr 13)', 'Conference', 'BD + Marketing', 'Planned', 'Geo-fence campaign'],
    ['15', 'Apr 21-25', 'B2B', 'Event', 'RESO Spring', 'Conference', 'Product + Marketing', 'Planned', 'TBD'],
    ['16', 'Apr 28-May 2', 'B2B', 'Event', 'The Gathering', 'Conference', 'BD + Marketing', 'Planned', 'TBD'],
    ['', '', '', '', '', '', '', '', ''],
    ['--- Q2 PILLAR CONTENT (Newsworthy + PR) ---', '', '', '', '', '', '', '', ''],
    ['', 'May', 'B2B', 'Report', 'Agent\'s Guide to Pearl SCORE', 'Website/PR', 'Marketing', 'Planned', 'PR HOOK: Supports NAR events | Reusable for podcasts, speaking'],
    ['', '', '', '', '', '', '', '', ''],
    ['--- Q2 CONTENT IDEAS (from backlog) ---', '', '', '', '', '', '', '', ''],
    ['', '', 'B2C', 'Blog', 'How to Improve Your Pearl SCORE', '', 'Marketing + AI', 'Planned', ''],
    ['', '', 'B2C', 'Blog', 'Preparing Your Home for Storm Season', '', 'Marketing + AI', 'Planned', 'Resilience content'],
    ['', '', 'B2C', 'Blog', 'Your Home Is As Old As You Are (Expanded)', '', 'Marketing + AI', 'Planned', 'Chicago Agent Mag expansion']
  ];

  sheet.getRange(2, 1, data.length, data[0].length).setValues(data);

  // Style placeholder rows
  sheet.getRange(2, 1, 1, data[0].length).setBackground(LIGHT_GRAY).setFontStyle('italic');

  // Color code Audience column
  for (var i = 0; i < data.length; i++) {
    var audienceCell = sheet.getRange(i + 2, 3);
    if (data[i][2] === 'B2B') {
      audienceCell.setBackground(LIGHT_BLUE);
    } else if (data[i][2] === 'B2C') {
      audienceCell.setBackground(LIGHT_GREEN);
    } else if (data[i][2] === 'Both') {
      audienceCell.setBackground(LIGHT_YELLOW);
    }
  }

  // Column widths
  sheet.setColumnWidth(1, 55);
  sheet.setColumnWidth(2, 95);
  sheet.setColumnWidth(3, 65);
  sheet.setColumnWidth(4, 85);
  sheet.setColumnWidth(5, 380);
  sheet.setColumnWidth(6, 110);
  sheet.setColumnWidth(7, 85);
  sheet.setColumnWidth(8, 80);
  sheet.setColumnWidth(9, 280);

  sheet.setFrozenRows(1);
}

// ============================================================
// SHEET 3: Q3 (July - September)
// ============================================================
function buildQ3Sheet(ss) {
  var sheet = ss.insertSheet('Q3');
  buildQ3Data(sheet);
}

function buildQ3Data(sheet) {
  var BLUE = '#003366';
  var LIGHT_GRAY = '#f5f5f5';
  var LIGHT_BLUE = '#e6f3ff';
  var LIGHT_GREEN = '#e6ffe6';
  var LIGHT_YELLOW = '#fff9e6';

  var headers = ['Week', 'Date Range', 'Audience', 'Content Type', 'Title/Topic', 'Channel', 'Owner', 'Status', 'Notes'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground(BLUE)
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Q3 placeholder
  var data = [
    ['27', 'Jul 6-10', '', '', 'Q3 content to be planned during Q2', '', 'Marketing', 'Planned', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['--- KEY Q3 EVENTS ---', '', '', '', '', '', '', '', ''],
    ['', 'Jul 28', 'B2B', 'Event', 'Inman Connect San Diego', 'Conference', 'BD + Marketing', 'Planned', 'Geo-fence opportunity'],
    ['', 'Q3', 'Both', 'PR', 'Partnership Announcement (TBD)', 'PR', 'Marketing', 'Planned', 'Major PR moment'],
    ['', '', '', '', '', '', '', '', ''],
    ['--- Q3 PILLAR CONTENT (Newsworthy + PR) ---', '', '', '', '', '', '', '', ''],
    ['', 'Jul', 'B2C', 'Report', 'Home Resilience Before Storm Season', 'Website/PR', 'Marketing', 'Planned', 'PR HOOK: Timely news hook | Storm season prep']
  ];

  sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
  sheet.getRange(2, 1, 1, data[0].length).setBackground(LIGHT_GRAY).setFontStyle('italic');

  // Color code Audience column
  for (var i = 0; i < data.length; i++) {
    var audienceCell = sheet.getRange(i + 2, 3);
    if (data[i][2] === 'B2B') {
      audienceCell.setBackground(LIGHT_BLUE);
    } else if (data[i][2] === 'B2C') {
      audienceCell.setBackground(LIGHT_GREEN);
    } else if (data[i][2] === 'Both') {
      audienceCell.setBackground(LIGHT_YELLOW);
    }
  }

  // Column widths
  sheet.setColumnWidth(1, 55);
  sheet.setColumnWidth(2, 95);
  sheet.setColumnWidth(3, 65);
  sheet.setColumnWidth(4, 85);
  sheet.setColumnWidth(5, 380);
  sheet.setColumnWidth(6, 110);
  sheet.setColumnWidth(7, 85);
  sheet.setColumnWidth(8, 80);
  sheet.setColumnWidth(9, 280);

  sheet.setFrozenRows(1);
}

// ============================================================
// SHEET 4: Q4 (October - December)
// ============================================================
function buildQ4Sheet(ss) {
  var sheet = ss.insertSheet('Q4');
  buildQ4Data(sheet);
}

function buildQ4Data(sheet) {
  var BLUE = '#003366';
  var LIGHT_GRAY = '#f5f5f5';
  var LIGHT_BLUE = '#e6f3ff';
  var LIGHT_GREEN = '#e6ffe6';
  var LIGHT_YELLOW = '#fff9e6';

  var headers = ['Week', 'Date Range', 'Audience', 'Content Type', 'Title/Topic', 'Channel', 'Owner', 'Status', 'Notes'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground(BLUE)
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Q4 placeholder
  var data = [
    ['40', 'Oct 5-9', '', '', 'Q4 content to be planned during Q3', '', 'Marketing', 'Planned', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['--- KEY Q4 EVENTS ---', '', '', '', '', '', '', '', ''],
    ['', 'Nov', 'B2B', 'Event', 'NAR NXT', 'Conference', 'BD + Marketing', 'Planned', 'Major event - geo-fence'],
    ['', '', '', '', '', '', '', '', ''],
    ['--- Q4 PILLAR CONTENT (Newsworthy + PR) ---', '', '', '', '', '', '', '', ''],
    ['', 'Sep', 'B2C', 'Report', 'True Cost of Homeownership', 'Website/PR', 'Marketing', 'Planned', 'PR HOOK: Fall buying season | Budget planning'],
    ['', 'Nov', 'Both', 'Report', 'Year in Review + 2027 Preview', 'Website/PR', 'Marketing', 'Planned', 'PR HOOK: Year-end media, trend stories']
  ];

  sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
  sheet.getRange(2, 1, 1, data[0].length).setBackground(LIGHT_GRAY).setFontStyle('italic');

  // Color code Audience column
  for (var i = 0; i < data.length; i++) {
    var audienceCell = sheet.getRange(i + 2, 3);
    if (data[i][2] === 'B2B') {
      audienceCell.setBackground(LIGHT_BLUE);
    } else if (data[i][2] === 'B2C') {
      audienceCell.setBackground(LIGHT_GREEN);
    } else if (data[i][2] === 'Both') {
      audienceCell.setBackground(LIGHT_YELLOW);
    }
  }

  // Column widths
  sheet.setColumnWidth(1, 55);
  sheet.setColumnWidth(2, 95);
  sheet.setColumnWidth(3, 65);
  sheet.setColumnWidth(4, 85);
  sheet.setColumnWidth(5, 380);
  sheet.setColumnWidth(6, 110);
  sheet.setColumnWidth(7, 85);
  sheet.setColumnWidth(8, 80);
  sheet.setColumnWidth(9, 280);

  sheet.setFrozenRows(1);
}

// ============================================================
// SHEET 5: Content Ideas (Backlog)
// ============================================================
function buildContentIdeasSheet(ss) {
  var sheet = ss.insertSheet('Content Ideas');
  buildIdeasData(sheet);
}

function buildIdeasData(sheet) {
  var BLUE = '#003366';

  // Backlog of content ideas for future quarters
  // High priority = consider moving to active calendar
  var headers = ['Audience', 'Content Type', 'Title/Topic Idea', 'Hook/Angle', 'Priority', 'Quarter', 'AI Assist?'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground(BLUE)
    .setFontColor('#ffffff')
    .setFontWeight('bold');

  var ideas = [
    // B2B Ideas
    ['B2B', 'Blog', 'The Data Agents Can Finally Use', 'Transaction-facilitating, not blocking', 'High', 'Q2', 'Yes - draft'],
    ['B2B', 'Blog', 'What MLSs Are Saying About Home Performance Data', 'Industry perspective with quotes', 'Medium', 'Q2', 'Need interviews'],
    ['B2B', 'Guide', 'Agent\'s Complete Guide to Pearl SCORE', 'How to use in transactions', 'High', 'Q2', 'Yes - expand from blogs'],
    ['B2B', 'Case Study', 'Agent Success Story Template', 'Prove ROI for agents', 'High', 'Q2', 'Need data'],

    // B2C Ideas - Simple, approachable content
    ['B2C', 'Blog', 'How to Improve Your Pearl SCORE', 'Actionable tips by pillar', 'High', 'Q2', 'Yes - draft'],
    ['B2C', 'Blog', 'What Your Home\'s Score Says About Your Utility Bills', 'Cost connection', 'Medium', 'Q2', 'Yes - draft'],
    ['B2C', 'Blog', 'Preparing Your Home for Storm Season', 'Resilience deep dive', 'High', 'Q2', 'Yes - seasonal'],
    ['B2C', 'Blog', 'Your Home Is As Old As You Are (Expanded)', 'Cost implications for 1980s homes', 'High', 'Q2', 'Chicago Agent Mag expansion'],
    ['B2C', 'Video', 'Pearl SCORE Explained in 60 Seconds', 'Quick explainer', 'Medium', 'Q2', 'Script: Yes'],
    ['B2C', 'Infographic', 'What High-Performing Homes Have in Common', '7 attributes from data', 'Medium', 'Q2', 'Copy: Yes'],

    // Both
    ['Both', 'Report', 'Regional Home Performance Trends', 'Which states have most efficient homes?', 'Medium', 'Q3', 'Yes - data analysis'],
    ['Both', 'Blog', 'IRA Rebates: How Pearl Helps You Qualify', 'Policy tie-in', 'Low', 'Q3', 'Yes - evergreen']
  ];

  sheet.getRange(2, 1, ideas.length, ideas[0].length).setValues(ideas);

  // Column widths - wider to prevent cutoff
  sheet.setColumnWidth(1, 70);
  sheet.setColumnWidth(2, 90);
  sheet.setColumnWidth(3, 300);
  sheet.setColumnWidth(4, 260);
  sheet.setColumnWidth(5, 70);
  sheet.setColumnWidth(6, 60);
  sheet.setColumnWidth(7, 220);

  // Enable text wrap for longer columns
  sheet.getRange(2, 3, ideas.length, 1).setWrap(true);  // Title/Topic
  sheet.getRange(2, 4, ideas.length, 1).setWrap(true);  // Hook/Angle
  sheet.getRange(2, 7, ideas.length, 1).setWrap(true);  // Notes

  sheet.setFrozenRows(1);

  // Data validation
  var priorityRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['High', 'Medium', 'Low'], true)
    .build();
  sheet.getRange(2, 5, ideas.length, 1).setDataValidation(priorityRule);
}

// ============================================================
// SHEET 3: Pillar Deep Dives (B2C Education)
// ============================================================
function buildPillarContentSheet(ss) {
  var sheet = ss.insertSheet('Pillar Reference');
  buildPillarData(sheet);
}

function buildPillarData(sheet) {
  var BLUE = '#003366';

  // Reference sheet for the 5 Pearl SCORE pillars
  // Use for messaging consistency and content ideation
  var headers = ['Pillar', 'Homeowner Question', 'Key Topics', 'PRN Tie-In', 'Q1 Usage', 'Future Content Ideas'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground(BLUE)
    .setFontColor('#ffffff')
    .setFontWeight('bold');

  var pillars = [
    ['Safety', '"Is my home protecting my family\'s health?"', 'Indoor air quality, ventilation, CO detection, radon, combustion safety, moisture control', 'HVAC techs, home inspectors, air quality specialists', 'In reports + social', 'DIY safety tips blog (Q2)'],
    ['Comfort', '"Is my home comfortable year-round?"', 'Thermal comfort, even temperatures, no drafts, acoustic comfort, insulation, daylighting', 'Insulation contractors, HVAC pros, window specialists', 'In reports + social', 'Comfort upgrade guide (Q2)'],
    ['Operations', '"How much does it cost to run my home?"', 'Energy/water efficiency, HVAC, appliances, building envelope, maintenance requirements', 'Energy auditors, appliance installers, weatherization pros', 'In reports + social', '"Homes as old as you" expansion'],
    ['Resilience', '"Can my home handle storms and outages?"', 'Extreme weather readiness, backup systems, robust design, power outage preparation', 'Electricians, roofing contractors, storm prep specialists', 'In reports + social', 'Storm season content (Q2)'],
    ['Energy', '"Is my home ready for modern energy needs?"', 'Solar, battery storage, smart management, EV readiness, grid integration', 'Solar installers, electricians, smart home pros', 'Minimal (Q2 focus)', 'Summer energy series']
  ];

  sheet.getRange(2, 1, pillars.length, pillars[0].length).setValues(pillars);

  // Column widths - wider to prevent cutoff
  sheet.setColumnWidth(1, 90);
  sheet.setColumnWidth(2, 220);
  sheet.setColumnWidth(3, 320);
  sheet.setColumnWidth(4, 200);
  sheet.setColumnWidth(5, 120);
  sheet.setColumnWidth(6, 180);

  // Enable text wrap for longer columns
  sheet.getRange(2, 2, pillars.length, 1).setWrap(true);  // Homeowner Question
  sheet.getRange(2, 3, pillars.length, 1).setWrap(true);  // Key Topics
  sheet.getRange(2, 4, pillars.length, 1).setWrap(true);  // PRN Tie-In
  sheet.getRange(2, 6, pillars.length, 1).setWrap(true);  // Future Content Ideas

  sheet.setFrozenRows(1);
}

// ============================================================
// Note: Surge campaigns tracked in Pearl_MKTG_Surge_Tracker_2026
// Note: Media Coverage tracked in Pearl_MKTG_PR_Tracker_2026
// ============================================================
