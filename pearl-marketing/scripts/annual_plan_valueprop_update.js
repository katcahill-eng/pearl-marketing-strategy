function updateWithValueProp() {
  var doc = DocumentApp.openById('1v2kMWxcv_ogy6UT4lRUnp9M9EVCAPmdp0Y8dG1YtyG8');
  var body = doc.getBody();

  // Add 5th strategic objective
  body.replaceText(
    "key partnerships \\(verify usage rights\\)",
    "key partnerships (verify usage rights)\n5. Position Pearl as transaction infrastructure — \"Performance on Rails\" messaging that emphasizes neutral mediation and Value Before Verification"
  );

  // Update core narrative to match new value prop
  body.replaceText(
    "Pearl is the translator between building-science experts and homeowners—the bridge that makes home performance understandable, relatable, and actionable\\.",
    "Pearl puts home performance conversations on rails. When buyers and sellers—two non-experts—are forced to navigate complex building science questions during a high-stakes transaction, the conversation itself becomes the risk. Pearl changes that by providing neutral ground, structured discovery, and clarity before commitment and pressure peak."
  );

  // Add clarifying statement after mission
  body.replaceText(
    "Mission: Make home performance matter\\.",
    "Mission: Make home performance matter.\n\nClarifying Statement: The Pearl app helps buyers and sellers get on the same page, prioritize what's most important, and achieve clarity on a home's performance—before commitment and pressure peak."
  );

  doc.saveAndClose();
  Logger.log('Value Prop updates complete');
}

/**
 * Adds Competitive Analysis as first item in Supporting Documents table
 * Run: addCompetitiveAnalysisLink()
 */
function addCompetitiveAnalysisLink() {
  var doc = DocumentApp.openById('1v2kMWxcv_ogy6UT4lRUnp9M9EVCAPmdp0Y8dG1YtyG8');
  var body = doc.getBody();
  var competitiveDocUrl = 'https://docs.google.com/document/d/135XmaoOKqgkhS1viMItEThITQp3Ozod1pqeKI2jx6pQ/edit';

  // Find all tables in the document
  var tables = body.getTables();

  for (var i = 0; i < tables.length; i++) {
    var table = tables[i];

    // Check if table has at least 2 columns
    if (table.getRow(0).getNumCells() < 2) continue;

    var firstCell = table.getCell(0, 0).getText();
    var secondCell = table.getCell(0, 1).getText();

    // Check if this is the Supporting Documents table (has "Document" AND "Purpose" headers)
    if (firstCell.indexOf('Document') > -1 && secondCell.indexOf('Purpose') > -1) {
      // Copy row 2 (first data row) to use as template
      var templateRow = table.getRow(2).copy();

      // Insert the copied row at position 1 (after header)
      var newRow = table.insertTableRow(1, templateRow);

      // Set first cell: Document name with link
      var docCell = newRow.getCell(0);
      docCell.clear();
      docCell.setText('Competitive Analysis');
      docCell.editAsText().setBold(false).setLinkUrl(competitiveDocUrl);

      // Set second cell: Purpose
      var purposeCell = newRow.getCell(1);
      purposeCell.clear();
      purposeCell.setText('Competitor mapping, 5-pillar coverage, partnership opportunities');
      purposeCell.editAsText().setBold(false);

      Logger.log('Link added to Supporting Documents table');
      break;
    }
  }

  doc.saveAndClose();
}

/**
 * Removes the misplaced Competitive Analysis row from any table
 * Run: removeCompetitiveAnalysisLink()
 */
function removeCompetitiveAnalysisLink() {
  var doc = DocumentApp.openById('1v2kMWxcv_ogy6UT4lRUnp9M9EVCAPmdp0Y8dG1YtyG8');
  var body = doc.getBody();

  var tables = body.getTables();

  for (var i = 0; i < tables.length; i++) {
    var table = tables[i];
    var numRows = table.getNumRows();

    // Iterate backwards to avoid index issues when removing rows
    for (var r = numRows - 1; r >= 0; r--) {
      try {
        var cellText = table.getCell(r, 0).getText();
        if (cellText.indexOf('Competitive Analysis') > -1) {
          table.removeRow(r);
          Logger.log('Removed row ' + r + ' from table ' + i);
        }
      } catch (e) {
        // Skip rows that cause errors
        continue;
      }
    }
  }

  doc.saveAndClose();
}
