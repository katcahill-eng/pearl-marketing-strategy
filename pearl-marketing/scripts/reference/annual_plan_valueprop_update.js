function updateWithValueProp() {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();

  // Add 5th strategic objective
  body.replaceText(
    "key partnerships \\(verify usage rights\\)",
    "key partnerships (verify usage rights)\n5. Position Pearl as transaction infrastructure — \"Performance on Rails\" messaging that emphasizes neutral mediation and Value Before Verification"
  );

  Logger.log('Value Prop updates complete');
}
