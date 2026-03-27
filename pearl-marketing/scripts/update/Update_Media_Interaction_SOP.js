/**
 * Updates the Media Interaction Protocol SOP
 * Document ID: 1ZqmzKU5z1gN04DIFUs8YzDyj9of37WyL0v21AkAAPGk
 */

function updateMediaInteractionSOP() {
  var docId = '1ZqmzKU5z1gN04DIFUs8YzDyj9of37WyL0v21AkAAPGk';
  var doc = DocumentApp.openById(docId);
  var body = doc.getBody();

  // Clear existing content
  body.clear();

  // Colors
  var darkBlue = '#0c3860';
  var black = '#000000';
  var gray = '#666666';

  // === HEADER SECTION ===
  var sopLabel = body.appendParagraph('STANDARD OPERATING PROCEDURE (SOP)');
  sopLabel.setFontSize(10);
  sopLabel.setBold(true);
  sopLabel.setForegroundColor(black);
  sopLabel.setSpacingAfter(12);

  var title = body.appendParagraph('Media Interaction Protocol');
  title.setHeading(DocumentApp.ParagraphHeading.TITLE);
  title.setFontSize(26);
  title.setForegroundColor(black);
  title.setSpacingAfter(16);

  // Metadata block
  var metadata = [
    ['SOP Title:', 'Reporter & Media Interaction at Events'],
    ['Department:', 'Communications / Marketing'],
    ['Project Number:', 'MKT-000043'],
    ['SOP Number:', 'PR-###'],
    ['Version:', '1.0'],
    ['Effective Date:', ''],
    ['Owner:', 'Communications Lead'],
    ['Approver:', 'CMO'],
    ['Related Documents:', 'PR Response SOP, Messaging Framework, Media Training Materials']
  ];

  metadata.forEach(function(item) {
    var para = body.appendParagraph(item[0] + ' ' + (item[1] || '[TBD]'));
    para.editAsText().setBold(0, item[0].length, true);
    para.setFontSize(10);
    para.setSpacingAfter(2);
  });

  body.appendParagraph('').setSpacingAfter(8);
  addHorizontalRule(body);

  // === SECTION 1: PURPOSE ===
  addSectionHeading(body, '1. Purpose');
  var purpose = body.appendParagraph('To provide Pearl team members with a simple, consistent approach for handling reporter interactions at conferences, events, and other public settings.');
  purpose.setFontSize(11);
  purpose.setSpacingAfter(12);

  addHorizontalRule(body);

  // === SECTION 2: SCOPE ===
  addSectionHeading(body, '2. Scope');
  var scope = body.appendParagraph('Applies to all Pearl employees who may encounter journalists, podcasters, bloggers, or other media representatives in professional or social settings.');
  scope.setFontSize(11);
  scope.setSpacingAfter(12);

  addHorizontalRule(body);

  // === SECTION 3: WHY THIS MATTERS ===
  addSectionHeading(body, '3. Why This Matters');
  var why = body.appendParagraph('Pearl is a good story. Our mission, history, and transformation create a compelling narrative—and our database offers unparalleled visibility into U.S. housing stock and homeowner trends. Reporters are always looking for good stories. We want to make it easy for them to tell ours.');
  why.setFontSize(11);
  why.setSpacingAfter(12);

  addHorizontalRule(body);

  // === SECTION 4: PROTOCOL BY ROLE ===
  addSectionHeading(body, '4. Protocol by Role');

  // VP and Above subsection
  var vpHeading = body.appendParagraph('VPs and Above');
  vpHeading.setHeading(DocumentApp.ParagraphHeading.HEADING3);
  vpHeading.setFontSize(13);
  vpHeading.setBold(true);
  vpHeading.setSpacingBefore(12);
  vpHeading.setSpacingAfter(8);

  // VP Table
  var vpTableData = [
    ['Step', 'Action'],
    ['1', 'Prepare – Review key messages before events'],
    ['2', 'Engage – Do the interview if comfortable'],
    ['3', 'Hand off – Tell them PR will follow up'],
    ['4', 'Report – Notify Bill (cc: Kat) immediately']
  ];

  var vpTable = body.appendTable(vpTableData);
  formatTable(vpTable);
  formatActionColumn(vpTable);

  body.appendParagraph('').setSpacingAfter(8);

  // Directors and Below subsection
  var dirHeading = body.appendParagraph('Directors and Below');
  dirHeading.setHeading(DocumentApp.ParagraphHeading.HEADING3);
  dirHeading.setFontSize(13);
  dirHeading.setBold(true);
  dirHeading.setSpacingBefore(12);
  dirHeading.setSpacingAfter(8);

  // Director Table
  var dirTableData = [
    ['Step', 'Action'],
    ['1', 'Collect – Get the reporter\'s contact information'],
    ['2', 'Hand off – Let them know our PR team will reach out to schedule an interview'],
    ['3', 'Report – Notify Bill (cc: Kat) immediately']
  ];

  var dirTable = body.appendTable(dirTableData);
  formatTable(dirTable);
  formatActionColumn(dirTable);

  body.appendParagraph('').setSpacingAfter(8);
  addHorizontalRule(body);

  // === SECTION 5: KEY REMINDERS ===
  addSectionHeading(body, '5. Key Reminders');

  var reminders = [
    ['Speed matters.', 'Reporters move fast. Responding quickly keeps Pearl in the conversation.'],
    ['Deadlines are sacred.', 'Always ask if they\'re on deadline and when they need a response.'],
    ['Lock it down.', 'If a reporter says "let\'s talk sometime," try to schedule a specific time before parting ways.']
  ];

  reminders.forEach(function(item) {
    var listItem = body.appendListItem('');
    var boldPart = listItem.appendText(item[0] + ' ');
    boldPart.setBold(true);
    var normalPart = listItem.appendText(item[1]);
    normalPart.setBold(false);
    listItem.setFontSize(11);
    listItem.setGlyphType(DocumentApp.GlyphType.BULLET);
  });

  body.appendParagraph('').setSpacingAfter(8);
  addHorizontalRule(body);

  // === SECTION 6: REVISION HISTORY ===
  addSectionHeading(body, '6. Revision History');

  var revisionData = [
    ['Version', 'Date', 'Author', 'Description of Change'],
    ['1.0', 'YYYY-MM-DD', 'Comms', 'Initial release']
  ];

  var revTable = body.appendTable(revisionData);
  formatTable(revTable);

  doc.saveAndClose();
  Logger.log('Media Interaction SOP updated successfully');
}

function addSectionHeading(body, text) {
  var heading = body.appendParagraph(text);
  heading.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  heading.setFontSize(16);
  heading.setBold(true);
  heading.setSpacingBefore(16);
  heading.setSpacingAfter(8);
  return heading;
}

function addHorizontalRule(body) {
  var hr = body.appendHorizontalRule();
  body.appendParagraph('').setSpacingAfter(4);
}

function formatTable(table) {
  // Format header row
  var headerRow = table.getRow(0);
  for (var i = 0; i < headerRow.getNumCells(); i++) {
    var cell = headerRow.getCell(i);
    cell.setBackgroundColor('#f0f0f0');
    var text = cell.editAsText();
    text.setBold(true);
    text.setFontSize(10);
  }

  // Format data rows
  for (var r = 1; r < table.getNumRows(); r++) {
    var row = table.getRow(r);
    for (var c = 0; c < row.getNumCells(); c++) {
      var cell = row.getCell(c);
      var text = cell.editAsText();
      text.setFontSize(10);
    }
  }

  // Set column widths if 2-column table
  if (table.getRow(0).getNumCells() === 2) {
    table.setColumnWidth(0, 50);
    table.setColumnWidth(1, 400);
  }
}

function formatActionColumn(table) {
  // Bold the action keyword (before the dash) in the Action column
  for (var r = 1; r < table.getNumRows(); r++) {
    var cell = table.getRow(r).getCell(1);
    var text = cell.getText();
    var dashIndex = text.indexOf('–');
    if (dashIndex > 0) {
      cell.editAsText().setBold(0, dashIndex, true);
    }
  }
}
