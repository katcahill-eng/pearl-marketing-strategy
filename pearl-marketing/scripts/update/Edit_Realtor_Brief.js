/**
 * Edit the Realtor.com Negotiation Brief:
 * 1. Rename "Agent Marketing Tools Integration" → "Agent Adoption Pipeline"
 * 2. Update the description, why it matters, and what it's worth
 * 3. Delete the "Cross-Promotion in Agent Communications" section
 *
 * Run: editRealtorBrief()
 */

const REALTOR_BRIEF_ID = '1OdKd37HiFPbuJMSJYxvDbhfe77pm3vSp';

function editRealtorBrief() {
  const doc = DocumentApp.openById(REALTOR_BRIEF_ID);
  const body = doc.getBody();

  // 1. Rename heading
  body.replaceText(
    'Agent Marketing Tools Integration',
    'Agent Adoption Pipeline'
  );

  // 2. Update description
  body.replaceText(
    "Include SCORE data in realtor\\.com's agent marketing suite \\(listing flyers, CMA tools, client presentations\\)\\.",
    "Include SCORE data in realtor.com's agent marketing suite (listing flyers, CMA tools, client presentations) and feature Pearl in agent newsletters, webinars, and training materials."
  );

  // 3. Update why it matters
  body.replaceText(
    'Agent adoption accelerator — tools they already use with SCORE built in\\.',
    'Agent adoption accelerator on two fronts — embedded in tools agents already use, and promoted through education channels they already consume. Pearl can provide turnkey content.'
  );

  // 4. Update what it's worth
  body.replaceText(
    "Reduces Pearl's agent acquisition cost and accelerates market penetration\\.",
    "Reduces Pearl's agent acquisition cost and accelerates market penetration across realtor.com's full agent ecosystem."
  );

  // 5. Delete "Cross-Promotion in Agent Communications" section
  const paragraphs = body.getParagraphs();
  let deleteStart = -1;
  let deleteEnd = -1;

  for (let i = 0; i < paragraphs.length; i++) {
    const text = paragraphs[i].getText();

    if (text.includes('Cross-Promotion in Agent Communications')) {
      deleteStart = i;
      continue;
    }

    if (deleteStart >= 0 && deleteEnd < 0) {
      // Check if we've reached the next numbered heading or major section
      const heading = paragraphs[i].getHeading();
      if (heading !== DocumentApp.ParagraphHeading.NORMAL && !text.startsWith('The ask') && !text.startsWith("Why it") && !text.startsWith('How to frame')) {
        deleteEnd = i - 1;
        break;
      }
    }
  }

  // If we never found the end, delete to the last paragraph before next section
  if (deleteStart >= 0 && deleteEnd < 0) {
    deleteEnd = deleteStart + 4; // heading + 4 content lines
  }

  // Delete in reverse to preserve indices
  if (deleteStart >= 0) {
    for (let i = deleteEnd; i >= deleteStart; i--) {
      if (i < paragraphs.length) {
        body.removeChild(paragraphs[i]);
      }
    }
    Logger.log('Deleted Cross-Promotion section (paragraphs ' + deleteStart + ' to ' + deleteEnd + ')');
  }

  doc.saveAndClose();
  Logger.log('Done editing Realtor.com brief.');
}
