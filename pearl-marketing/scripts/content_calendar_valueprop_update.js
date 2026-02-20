function updateWithValueProp() {
  var ss = SpreadsheetApp.openById('1BAUNAuyRNbdDXr6by_1MPOWUOo_4sRY3kJTNkPI4ZyY');

  // 1. Update Content Ideas sheet - add new "Performance on Rails" content ideas
  var ideasSheet = ss.getSheetByName('Content Ideas');
  if (ideasSheet) {
    var lastRow = ideasSheet.getLastRow();

    // Add new content ideas based on "Performance on Rails" messaging
    var newIdeas = [
      ['', '', '', '', '', '', ''],  // Blank row separator
      ['--- PERFORMANCE ON RAILS MESSAGING (Q1 2026) ---', '', '', '', '', '', ''],
      ['B2B', 'Blog', 'The Conversation Problem in Real Estate', 'When non-experts debate expert subjects, deals fall apart', 'High', 'Q1', 'Yes - use value prop doc'],
      ['B2B', 'Blog', 'How Pearl Puts Home Performance on Rails', 'Structured discovery replaces adversarial debates', 'High', 'Q1', 'Yes - use value prop doc'],
      ['Both', 'Blog', 'Getting Buyers and Sellers on the Same Page', 'Pearl as neutral mediator, not buyer-only tool', 'High', 'Q1', 'Yes - use value prop doc'],
      ['B2B', 'Social Series', '"Performance on Rails" Quote Cards', '4 key talking points for LinkedIn/X', 'High', 'Q1', 'Batch create from talking points'],
      ['B2B', 'Guide', 'Value Before Verification: How Pearl Creates Trust', 'The claiming flywheel explained', 'Medium', 'Q2', 'Yes - expand from value prop']
    ];

    ideasSheet.getRange(lastRow + 1, 1, newIdeas.length, newIdeas[0].length).setValues(newIdeas);

    // Bold the section header
    ideasSheet.getRange(lastRow + 2, 1, 1, 7).setFontWeight('bold').setBackground('#f0f0f0');
  }

  // 2. Update Pillar Reference sheet - add new messaging framework
  var pillarSheet = ss.getSheetByName('Pillar Reference');
  if (pillarSheet) {
    var pillarLastRow = pillarSheet.getLastRow();

    // Add new messaging framework section
    var newMessaging = [
      ['', '', '', '', '', ''],
      ['--- PERFORMANCE ON RAILS MESSAGING ---', '', '', '', '', ''],
      ['Core Insight', '"When two non-experts debate expert subjects during a home purchase, the conversation itself becomes the risk."', '', '', '', ''],
      ['Clarifying Statement', '"The Pearl app helps buyers and sellers get on the same page, prioritize what\'s most important, and achieve clarity on a home\'s performance—before commitment and pressure peak."', '', '', '', ''],
      ['Key Talking Points', '• Pearl puts conversations on rails\n• We help both parties, not one at expense of other\n• Transaction infrastructure, not just data\n• Value Before Verification principle', '', '', '', ''],
      ['The Rails Sequence', '1. Orientation → 2. Education → 3. Personal Relevance → 4. Transparency', 'Use this sequence in content structure', '', '', '']
    ];

    pillarSheet.getRange(pillarLastRow + 1, 1, newMessaging.length, newMessaging[0].length).setValues(newMessaging);

    // Bold the section header
    pillarSheet.getRange(pillarLastRow + 2, 1, 1, 6).setFontWeight('bold').setBackground('#f0f0f0');
  }

  // 3. Update Q1 sheet - update relevant blog titles to incorporate new messaging
  var q1Sheet = ss.getSheetByName('Q1');
  if (q1Sheet) {
    var q1Data = q1Sheet.getDataRange().getValues();

    for (var i = 0; i < q1Data.length; i++) {
      var title = q1Data[i][4];  // Title/Topic column (index 4)

      // Update "How Pearl SCORE Helps Answer Buyer Questions"
      if (title === 'How Pearl SCORE Helps Answer Buyer Questions') {
        q1Sheet.getRange(i + 1, 5).setValue('How Pearl Puts Home Performance Conversations on Rails');
        q1Sheet.getRange(i + 1, 9).setValue('AI drafts, you edit | Updated with "Performance on Rails" messaging');
      }

      // Add note about new messaging to report launches
      if (title === 'STATE OF HOME PERFORMANCE 2026') {
        q1Sheet.getRange(i + 1, 9).setValue('>>> PILLAR #1 - Full week focus <<< | Include "Performance on Rails" positioning');
      }
    }
  }

  Logger.log('Value Prop updates complete - Content Calendar updated');
}
