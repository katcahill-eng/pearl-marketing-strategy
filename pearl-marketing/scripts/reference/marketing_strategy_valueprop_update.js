function updateWithValueProp() {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();

  // 1. Add conversation problem after historical problem
  body.replaceText(
    "too complicated to interpret\\.",
    "too complicated to interpret.\n\nThe Conversation Problem (New Framing)\n\nWhen buyers and sellers—two non-experts—are forced to navigate complex building science questions during a high-stakes transaction, the conversation itself becomes the risk. Disagreements escalate. Trust erodes. Deals fall apart or close with unresolved concerns.\n\nThe traditional solution was to avoid the topic entirely. But buyers are now asking questions that can't be ignored: What are the utility costs? How old is the HVAC? Will this home hold up in extreme weather?"
  );

  // 2. Add rails positioning after Pearl's Role paragraph
  body.replaceText(
    "the lived experience of a home is visible before you buy\\.",
    "the lived experience of a home is visible before you buy.\n\nPearl puts home performance conversations on rails. Instead of two non-experts debating complex building science, Pearl provides:\n\n• Structured Discovery — A guided sequence from orientation to transparency\n• Early Visibility — Performance data surfaces before commitment and pressure peak\n• Neutral Mediation — Common ground that helps both parties, not one at the expense of the other\n\nClarifying Statement: The Pearl app helps buyers and sellers get on the same page, prioritize what's most important, and achieve clarity on a home's performance—before commitment and pressure peak."
  );

  // 3. Update Claiming Flywheel title
  body.replaceText(
    "The Claiming Flywheel",
    "The Claiming Flywheel (Value Before Verification)"
  );

  // 4. Add to neutral positioning
  body.replaceText(
    "Transaction-facilitating \\(helps deals close smoother\\)",
    "Transaction infrastructure (puts conversations on rails)\n• A neutral mediator that helps BOTH parties get on the same page\n• Transaction-facilitating (helps deals close smoother)"
  );

  Logger.log('Value Prop updates complete');
}
