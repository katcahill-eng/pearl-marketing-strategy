function updateWithValueProp() {
  var doc = DocumentApp.openById('1hwIfV-5Rb0EHjVnq3bztcZRTDHq7y_8Uh1b-iRfOtHE');
  var body = doc.getBody();

  // Add new talking points after existing podcast talking points
  body.replaceText(
    "pearlscore\\.com - look up any home",
    "pearlscore.com - look up any home\n\nNEW: \"Performance on Rails\" Messaging (Q1 2026):\n• \"When two non-experts debate expert subjects during a home purchase, the conversation itself becomes the risk. Pearl puts those conversations on rails.\"\n• \"Pearl helps buyers and sellers get on the same page—before commitment and pressure peak.\"\n• \"We're not here to help one side win. We're here to create common ground.\"\n• \"Pearl is transaction infrastructure—we facilitate deals by replacing debates with structured discovery.\""
  );

  // Update core narrative to match new value prop
  body.replaceText(
    "Pearl is the translator between building-science experts and homeowners—the bridge that makes home performance understandable, relatable, and actionable\\.",
    "Pearl puts home performance conversations on rails. When buyers and sellers—two non-experts—are forced to navigate complex building science questions during a high-stakes transaction, the conversation itself becomes the risk. Pearl changes that by providing neutral ground, structured discovery, and clarity before commitment and pressure peak."
  );

  doc.saveAndClose();
  Logger.log('Value Prop updates complete');
}
