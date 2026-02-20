function updateWithValueProp() {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();

  // 1. Replace core narrative
  body.replaceText(
    "Pearl is the translator between building-science experts and homeowners—the bridge that makes home performance understandable, relatable, and actionable\\.",
    "Pearl puts home performance conversations on rails. When buyers and sellers—two non-experts—are forced to navigate complex building science questions during a high-stakes transaction, the conversation itself becomes the risk. Pearl changes that by providing neutral ground, structured discovery, and clarity before commitment and pressure peak."
  );

  // 2. Replace second paragraph ending
  body.replaceText(
    "translating building science into clear, comparable metrics for homeowners, buyers, and the real-estate industry\\.",
    "translating building science into clear, comparable metrics that help buyers and sellers get on the same page."
  );

  // 3. Add clarifying statement after mission
  body.replaceText(
    "Mission: Make home performance matter\\.",
    "Mission: Make home performance matter.\n\nClarifying Statement: The Pearl app helps buyers and sellers get on the same page, prioritize what's most important, and achieve clarity on a home's performance—before commitment and pressure peak."
  );

  Logger.log('Value Prop updates complete');
}
