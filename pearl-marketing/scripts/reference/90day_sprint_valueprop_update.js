function updateWithValueProp() {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();

  // Add new talking points after existing podcast talking points
  body.replaceText(
    "pearlscore\\.com - look up any home",
    "pearlscore.com - look up any home\n\nNEW: \"Performance on Rails\" Messaging (Q1 2026):\n• \"When two non-experts debate expert subjects during a home purchase, the conversation itself becomes the risk. Pearl puts those conversations on rails.\"\n• \"Pearl helps buyers and sellers get on the same page—before commitment and pressure peak.\"\n• \"We're not here to help one side win. We're here to create common ground.\"\n• \"Pearl is transaction infrastructure—we facilitate deals by replacing debates with structured discovery.\""
  );

  Logger.log('Value Prop updates complete');
}
