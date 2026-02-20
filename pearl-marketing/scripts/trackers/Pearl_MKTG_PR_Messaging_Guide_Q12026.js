// ============================================================
// Pearl PR Messaging Guide - Google Apps Script
// Creates or updates formatted Google Doc from messaging content
// Naming convention: Pearl_MKTG_[Name]_Q[#][Year]
// UPDATED: January 2026 - Added Value Prop "Performance on Rails" positioning
// ============================================================

// CONFIGURATION - Your existing document ID
var DOC_ID = '11YEVBkfKDvG71JGKyKg67KaqM9oiaj2GdVCM96rsbss';

// Resource links
var RESOURCE_LINKS = {
  messagingPlatform: 'YOUR_LINK_HERE',  // Nov 5, 2025 CEO Messaging Platform PDF
  prSOP: 'YOUR_LINK_HERE',              // PR Response SOP PDF
  inmanCampaign: 'YOUR_LINK_HERE',      // Inman Campaign Brief PDF
  fpsEditorialCalendar: 'https://docs.google.com/spreadsheets/d/1sFvleRcz_DwQuSMkdOsT8PjEmNA0DxU1mUtCz0t8x04/edit?usp=sharing',
  fpsStrategicPlan: 'YOUR_LINK_HERE',   // Front Page Sage Strategic Plan PDF
  valuePropNarrative: '260109-PERL-ValuePropNT-SDga.pdf'  // Value Prop document (Jan 2026)
};

// ============================================================
// UPDATE existing document (use this one)
// ============================================================
function updatePRMessagingGuide() {
  var doc = DocumentApp.openById(DOC_ID);
  var body = doc.getBody();

  // Clear existing content
  body.clear();

  // Build the document
  buildPRMessagingGuide(body);

  doc.saveAndClose();
  Logger.log('Document updated: ' + doc.getUrl());
}

// ============================================================
// CREATE new document (only use if starting fresh)
// ============================================================
function createPRMessagingGuide() {
  var doc = DocumentApp.create('Pearl_MKTG_PR Messaging Guide_Q12026');
  var body = doc.getBody();

  // Build the document
  buildPRMessagingGuide(body);

  doc.saveAndClose();
  Logger.log('Document created: ' + doc.getUrl());
}

// ============================================================
// SHARED: Build document content
// ============================================================
function buildPRMessagingGuide(body) {

  // Colors
  var BLUE = '#003366';
  var BLACK = '#000000';
  var GRAY = '#e6e6e6';
  var LIGHT_BLUE = '#e6f3ff';

  // ============================================================
  // HEADER GRID
  // ============================================================
  // Dynamic date for last revision
  var today = new Date();
  var dateString = Utilities.formatDate(today, Session.getScriptTimeZone(), 'MMMM yyyy');

  var headerTable = body.appendTable([
    ['Document', 'Status', 'Updated'],
    ['PR Messaging Guide', 'Draft', dateString]
  ]);
  styleHeaderTable(headerTable, BLUE, BLACK);

  body.appendParagraph('');
  body.appendParagraph('Pearl PR Messaging Guide').setHeading(DocumentApp.ParagraphHeading.HEADING1).setForegroundColor(BLUE);

  // ============================================================
  // THE PEARL STORY (UPDATED WITH VALUE PROP)
  // ============================================================
  body.appendParagraph('');
  body.appendParagraph('The Pearl Story (Core Narrative)').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);

  body.appendParagraph('Pearl puts home performance conversations on rails. When buyers and sellers—two non-experts—are forced to navigate complex building science questions during a high-stakes transaction, the conversation itself becomes the risk. Pearl changes that by providing neutral ground, structured discovery, and clarity before commitment and pressure peak.').setForegroundColor(BLACK);

  body.appendParagraph('Pearl is a ratings and standards company that quantifies how well homes perform. Our five-pillar framework and Pearl SCORE™ establish the first national benchmark for home performance—translating building science into clear, comparable metrics that help buyers and sellers get on the same page.').setForegroundColor(BLACK);

  body.appendParagraph('Mission: Make home performance matter.').setBold(true).setForegroundColor(BLACK);

  body.appendParagraph('');
  body.appendParagraph('Clarifying Statement: The Pearl app helps buyers and sellers get on the same page, prioritize what\'s most important, and achieve clarity on a home\'s performance—before commitment and pressure peak.').setBold(true).setItalic(true).setForegroundColor(BLUE);

  body.appendParagraph('The Translation').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  body.appendParagraph('Experts speak in technical language: BTUs, R-values, SEER ratings, kilowatt-hours. Homeowners think in everyday terms: Is my home safe? Is it comfortable? How much does it cost to run? Can it handle bad weather? Pearl SCORE™ bridges that gap—distilling complex building-science data into a single, intuitive number from 1 to 1000.').setForegroundColor(BLACK);

  // ============================================================
  // FIVE PILLARS
  // ============================================================
  body.appendParagraph('');
  body.appendParagraph('The Five Pillars of Home Performance (SCORE)').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);

  var pillarsTable = body.appendTable([
    ['Pillar', 'What It Measures', 'Homeowner Language'],
    ['Safety', 'Indoor air quality, ventilation, moisture control, hazard prevention (CO detection, radon, combustion safety)', '"Is my home protecting my family\'s health?"'],
    ['Comfort', 'Thermal comfort (even temperatures, no drafts), acoustic comfort, visual comfort (daylighting)', '"Is my home comfortable year-round?"'],
    ['Operations', 'Efficiency of energy/water systems, maintenance requirements, HVAC, appliances, building envelope', '"How much does it cost to run my home?"'],
    ['Resilience', 'Ability to withstand extreme weather, natural disasters, power outages through robust design and backup systems', '"Can my home handle storms and outages?"'],
    ['Energy', 'Renewable generation (solar), storage (batteries), smart management, EV readiness, grid integration', '"Is my home ready for modern energy needs?"']
  ]);
  styleDataTable(pillarsTable, BLUE, BLACK);
  pillarsTable.setColumnWidth(0, 80);
  pillarsTable.setColumnWidth(1, 250);
  pillarsTable.setColumnWidth(2, 170);

  body.appendParagraph('These five pillars are deeply interconnected—improvements in one area often create benefits in others.').setForegroundColor(BLACK).setItalic(true);

  // ============================================================
  // PEARL SCORE DETAILS
  // ============================================================
  body.appendParagraph('');
  body.appendParagraph('Pearl SCORE™ Details').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);

  body.appendParagraph('What It Is: The nation\'s first standardized measure of whole-home performance. It translates complex building-science data into a single, intuitive number that shows how well a home performs its essential jobs.').setForegroundColor(BLACK);

  body.appendParagraph('Scale: 1–1000').setBold(true).setForegroundColor(BLACK);

  body.appendParagraph('Performance Zones:').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  var zonesTable = body.appendTable([
    ['Zone', 'Description'],
    ['Needs Improvement', 'Lowest performing'],
    ['Typical', 'Average performance'],
    ['Good', 'Above average'],
    ['Very Good', 'Strong performance'],
    ['Excellent', 'High performance'],
    ['Exceptional', 'Top performing']
  ]);
  styleDataTable(zonesTable, BLUE, BLACK);
  zonesTable.setColumnWidth(0, 150);
  zonesTable.setColumnWidth(1, 350);

  body.appendParagraph('Key Threshold: Homes scoring 500 or higher are considered high-performing and may qualify for Pearl Certification.').setBold(true).setForegroundColor(BLACK);

  body.appendParagraph('The Registry: Pearl Home Performance Registry™ is a free, searchable database of every single-family home in America (92 million homes). Anyone can look up and compare home performance ratings. Currently in BETA with full public launch planned for late 2026.').setForegroundColor(BLACK);

  // ============================================================
  // NEW SECTION: PERFORMANCE ON RAILS
  // ============================================================
  body.appendParagraph('');
  body.appendParagraph('Performance on Rails: The New Positioning').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);

  body.appendParagraph('The Core Insight').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  body.appendParagraph('When two non-experts are forced to debate expert subjects—like home performance during a real estate transaction—the conversation itself becomes the risk. Disagreements escalate. Trust erodes. Deals fall apart or close with unresolved concerns.').setForegroundColor(BLACK);

  body.appendParagraph('Pearl is transaction infrastructure. Not just data, not just certification—Pearl puts home performance conversations on rails, guiding buyers and sellers through a structured sequence that creates clarity instead of conflict.').setBold(true).setForegroundColor(BLACK);

  body.appendParagraph('');
  body.appendParagraph('The Rails Sequence').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  body.appendParagraph('How Pearl guides the conversation:').setForegroundColor(BLACK);

  var railsTable = body.appendTable([
    ['Stage', 'What Happens', 'The Shift'],
    ['Orientation', 'Introduction to what performance means and why it matters', 'From "unknown unknowns" to awareness'],
    ['Education', 'Explanation of the five pillars (SCORE) in plain language', 'From confusion to comprehension'],
    ['Personal Relevance', 'Connecting performance to what this buyer/seller actually cares about', 'From abstract to personal'],
    ['Transparency', 'Clear view of home\'s current performance vs. potential', 'From hidden to visible']
  ]);
  styleDataTable(railsTable, BLUE, BLACK);
  railsTable.setColumnWidth(0, 120);
  railsTable.setColumnWidth(1, 220);
  railsTable.setColumnWidth(2, 160);

  body.appendParagraph('');
  body.appendParagraph('Value Before Verification (Critical Principle)').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  body.appendParagraph('Pearl must create value for both buyers and sellers BEFORE asking homeowners to claim or verify their data. The sequence matters:').setForegroundColor(BLACK);

  addBullet(body, 'First: Provide useful baseline information that helps both parties', BLACK);
  addBullet(body, 'Then: Show how verification improves accuracy and value', BLACK);
  addBullet(body, 'Finally: Invite homeowner engagement', BLACK);

  body.appendParagraph('This principle applies to all Pearl touchpoints—product, marketing, and communications.').setForegroundColor(BLACK).setItalic(true);

  body.appendParagraph('');
  body.appendParagraph('Why "Rails" Matters').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  addBullet(body, 'For agents: Pearl gives them a framework to handle performance questions they couldn\'t answer before', BLACK);
  addBullet(body, 'For buyers: Pearl provides structured discovery instead of adversarial interrogation', BLACK);
  addBullet(body, 'For sellers: Pearl creates a way to showcase home performance proactively, not defensively', BLACK);
  addBullet(body, 'For the transaction: Pearl facilitates deals by creating common ground, not blocking them with disputes', BLACK);

  // ============================================================
  // KEY HEADLINES / STORY ANGLES
  // ============================================================
  body.appendParagraph('');
  body.appendParagraph('Key Headlines / Story Angles').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);

  body.appendParagraph('For Tier-1 Media (WSJ, NYT, WaPo, NPR)').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  var tier1Table = body.appendTable([
    ['Headline Angle', 'Hook', 'Best For'],
    ['The Blind Spot in Every Home Purchase', 'Buyers spend $400K+ without knowing basic performance data', 'Consumer/real estate reporters'],
    ['92 Million Homes Scored: What the Data Reveals', 'First national database shows surprising regional patterns', 'Data/housing reporters'],
    ['Why Home Performance Is the New Home Value', 'Performance features increasingly drive buyer decisions', 'Real estate/economy reporters'],
    ['The Hidden Cost of Homeownership', 'Utility costs, maintenance, resilience—now visible', 'Personal finance reporters']
  ]);
  styleDataTable(tier1Table, BLUE, BLACK);

  body.appendParagraph('');
  body.appendParagraph('For Industry/Trade Publications (Inman, HousingWire, Realtor Magazine)').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  var tradeTable = body.appendTable([
    ['Headline Angle', 'Hook', 'Best For'],
    ['What Buyers Are Asking That Listings Don\'t Show', 'Agents fielding questions they can\'t answer', 'Agent-focused publications'],
    ['Home Performance: The New Differentiator', 'Forward-thinking agents using Pearl SCORE', 'Real estate tech publications'],
    ['Data Agents Can Finally Use', 'Transaction-facilitating, not transaction-blocking', 'MLS/broker publications']
  ]);
  styleDataTable(tradeTable, BLUE, BLACK);

  body.appendParagraph('');
  body.appendParagraph('For Energy/Climate Publications (Canary Media, ENN)').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  var energyTable = body.appendTable([
    ['Headline Angle', 'Hook', 'Best For'],
    ['Making Home Efficiency Visible at Scale', '92M homes scored across 5 pillars', 'Climate/energy reporters'],
    ['The Market Transformation Nobody Saw Coming', 'Consumer demand driving efficiency awareness', 'Policy/market reporters'],
    ['From Certification to Registry: Pearl\'s Evolution', 'How a certification company became a data company', 'Industry profiles']
  ]);
  styleDataTable(energyTable, BLUE, BLACK);

  // NEW: Rails Story Angles
  body.appendParagraph('');
  body.appendParagraph('The "Rails" Story (New Angle)').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  var railsAnglesTable = body.appendTable([
    ['Headline Angle', 'Hook', 'Best For'],
    ['The Conversation Problem in Real Estate', 'When non-experts debate expert subjects, deals fall apart', 'Consumer/real estate reporters'],
    ['How One App Is Defusing Home Performance Disputes', 'Pearl as neutral mediator in high-stakes transactions', 'Real estate tech publications'],
    ['Transaction Infrastructure: The Hidden Layer of Real Estate', 'Pearl builds the rails for performance conversations', 'Business/tech reporters'],
    ['Getting Buyers and Sellers on the Same Page', 'Structured discovery replaces adversarial interrogation', 'Agent-focused publications']
  ]);
  styleDataTable(railsAnglesTable, BLUE, BLACK);

  // ============================================================
  // TALKING POINTS
  // ============================================================
  body.appendParagraph('');
  body.appendParagraph('Talking Points (Sound Bites)').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);

  body.appendParagraph('The Problem We Solve').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  addBullet(body, '"Real estate is built on information asymmetry—sellers know more than buyers, and both know far less than they should about how the home actually performs."', BLACK);
  addBullet(body, '"For decades, the U.S. housing market has been flying blind on performance. Buyers, sellers, and lenders make decisions based on what can be seen—square footage, finishes, curb appeal—while ignoring how a home truly performs."', BLACK);
  addBullet(body, '"Every party in a transaction, including the lender, is making decisions with incomplete information about the single largest investment most people will ever make."', BLACK);

  // NEW: Neutral Mediator section
  body.appendParagraph('');
  body.appendParagraph('Pearl as Neutral Mediator (Performance on Rails)').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  addBullet(body, '"When two non-experts are forced to debate expert subjects during a home purchase, the conversation itself becomes the risk. Pearl puts those conversations on rails."', BLACK);
  addBullet(body, '"Pearl helps buyers and sellers get on the same page, prioritize what\'s most important, and achieve clarity on a home\'s performance—before commitment and pressure peak."', BLACK);
  addBullet(body, '"We\'re not here to help sellers get more money or buyers negotiate down. We\'re here to create common ground so everyone can make informed decisions."', BLACK);
  addBullet(body, '"Pearl is transaction infrastructure. We don\'t block deals—we facilitate them by replacing adversarial debates with structured discovery."', BLACK);

  body.appendParagraph('');
  body.appendParagraph('Pearl as Translator').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  addBullet(body, '"Pearl is the translator between building-science experts and homeowners. We take the science of home performance and express it through five things every homeowner cares about: Safety, Comfort, Operations, Resilience, and Energy."', BLACK);
  addBullet(body, '"It\'s not that BTUs, R-values, or SEER ratings don\'t matter—they matter a great deal. They\'re just not where the conversation starts. You start where homeowners live—with what they see, feel, and value."', BLACK);
  addBullet(body, '"Pearl SCORE doesn\'t replace technical precision—it unlocks it."', BLACK);

  body.appendParagraph('');
  body.appendParagraph('The Scale / Credibility').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  addBullet(body, '"We\'ve scored 92 million single-family homes across the US—every single one—using hundreds of verified data points per property."', BLACK);
  addBullet(body, '"Pearl SCORE rates homes on a 1-to-1000 scale across five pillars: Safety, Comfort, Operations, Resilience, and Energy."', BLACK);
  addBullet(body, '"Pearl Home Performance Registry is now publicly accessible—a free, searchable database where anyone can look up and compare home performance ratings."', BLACK);

  body.appendParagraph('');
  body.appendParagraph('The Data Challenge (What We Built)').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  addBullet(body, '"The hardest part wasn\'t the building science—it was assembling usable data across 92 million properties. Public records are fragmented and outdated. We\'ve had to create new datasets where none existed."', BLACK);
  addBullet(body, '"Pearl is the messenger—but also the means for homeowners to change the message. They can verify and enhance their record through Pearl\'s verification process."', BLACK);

  body.appendParagraph('');
  body.appendParagraph('For Investors / Business Audience').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  addBullet(body, '"Pearl has evolved from a certification company to a data-driven ratings and standards platform, defining the benchmark for transparency and performance-based value in the housing market."', BLACK);
  addBullet(body, '"This is a first-mover data advantage—92 million homes scored, proprietary methodology, the first national benchmark for home performance."', BLACK);
  addBullet(body, '"As a Certified B-Corporation, Pearl is held to rigorous standards of accountability and impact—answering not only to shareholders but also to the homeowners and communities it serves."', BLACK);

  // ============================================================
  // SPOKESPEOPLE & QUOTES
  // ============================================================
  body.appendParagraph('');
  body.appendParagraph('Key Spokespeople & Approved Quotes').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);

  var spokesTable = body.appendTable([
    ['Spokesperson', 'Best Topics', 'Notes'],
    ['Cynthia Adams (CEO & Co-Founder)', 'Vision, industry transformation, information asymmetry, investor story', 'Primary for Tier-1 media'],
    ['Robin LeBaron (President & Co-Founder)', 'Data infrastructure, operations, partnerships, industry relationships', 'Primary for trade media'],
    ['Tim Stanislaus (SVP Business Development)', 'Technology, data methodology, real estate applications', 'Tech-focused and industry stories']
  ]);
  styleDataTable(spokesTable, BLUE, BLACK);
  spokesTable.setColumnWidth(0, 180);
  spokesTable.setColumnWidth(1, 200);
  spokesTable.setColumnWidth(2, 120);

  body.appendParagraph('Approved Executive Quotes (for PR use)').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);

  body.appendParagraph('Cynthia Adams, CEO:').setBold(true).setForegroundColor(BLACK);
  body.appendParagraph('"Real estate is built on information asymmetry—sellers know more than buyers, and both know far less than they should about how the home actually performs. Every party in a transaction, including the lender, is making decisions with incomplete information about the single largest investment most people will ever make. Pearl SCORE changes that."').setForegroundColor(BLACK).setItalic(true);

  body.appendParagraph('');

  body.appendParagraph('Robin LeBaron, President:').setBold(true).setForegroundColor(BLACK);
  body.appendParagraph('"The hardest part wasn\'t the building science—it was assembling usable data across 92 million properties. Public records are fragmented and outdated. We\'ve had to create new datasets where none existed and reconcile sources that were never designed to work together. That infrastructure is what makes Pearl SCORE possible."').setForegroundColor(BLACK).setItalic(true);

  body.appendParagraph('');

  body.appendParagraph('Tim Stanislaus, SVP Business Development:').setBold(true).setForegroundColor(BLACK);
  body.appendParagraph('"Every home in America now has a performance profile that didn\'t exist six months ago. That changes the fundamental information architecture of residential real estate. Buyers and agents can now evaluate homes on how they actually perform—not just how they look."').setForegroundColor(BLACK).setItalic(true);

  // ============================================================
  // MESSAGING DON'TS (UPDATED)
  // ============================================================
  body.appendParagraph('');
  body.appendParagraph('Messaging Don\'ts').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);

  addBullet(body, 'Don\'t position as advocacy — Pearl is neutral, data-focused; we\'re a ratings and standards company', BLACK);
  addBullet(body, 'Don\'t promise home values will increase — We provide data, not valuations', BLACK);
  addBullet(body, 'Don\'t overstate accuracy — Scores reflect available data; homeowner verification improves accuracy. The Registry is still in BETA.', BLACK);
  addBullet(body, 'Don\'t compete with agents — Pearl SCORE brings performance into view for agents; we help them answer buyer questions', BLACK);
  addBullet(body, 'Don\'t lead with verification asks — Follow "Value Before Verification": create value first, then invite engagement (see Performance on Rails section)', BLACK);
  addBullet(body, 'Don\'t position as buyer-only or seller-only tool — Pearl helps BOTH parties get on the same page; we\'re neutral mediators', BLACK);
  addBullet(body, 'Don\'t use old pillar names — The pillars are Safety, Comfort, Operations, Resilience, Energy (NOT "energy efficiency, health, safety, resilience, sustainability")', BLACK);
  addBullet(body, 'Don\'t use articles before brand names — Write "Pearl SCORE reveals..." NOT "The Pearl SCORE reveals..."', BLACK);
  addBullet(body, 'Don\'t use as a verb — Write "Get your Pearl SCORE" NOT "Pearl SCORE your home"', BLACK);

  // ============================================================
  // BRAND USAGE
  // ============================================================
  body.appendParagraph('');
  body.appendParagraph('Brand Usage Guidelines').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);

  body.appendParagraph('Pearl SCORE™').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  addBullet(body, 'Capitalization: Always "Pearl SCORE" (Pearl = title case, SCORE = all caps)', BLACK);
  addBullet(body, 'Article usage: No article—treat like "Facebook" (e.g., "Pearl SCORE reveals..." not "The Pearl SCORE reveals...")', BLACK);
  addBullet(body, 'Trademark: Use ™ on first mention in each section, optional thereafter', BLACK);
  addBullet(body, 'Never use as a verb: "Get your Pearl SCORE" ✓ / "Pearl SCORE your home" ✗', BLACK);

  body.appendParagraph('');
  body.appendParagraph('Pearl Home Performance Registry™').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  addBullet(body, 'Full name on first reference: "Pearl Home Performance Registry™"', BLACK);
  addBullet(body, 'Subsequent references: "the Registry" or "Pearl Registry"', BLACK);
  addBullet(body, 'Article usage: Generally no article (same as Pearl SCORE), except in formal announcements', BLACK);

  body.appendParagraph('');
  body.appendParagraph('The SCORE Acronym').setHeading(DocumentApp.ParagraphHeading.HEADING3).setForegroundColor(BLUE);
  body.appendParagraph('When explaining what SCORE stands for:').setForegroundColor(BLACK);
  body.appendParagraph('"Pearl SCORE measures Safety, Comfort, Operations, Resilience, and Energy"').setForegroundColor(BLACK).setItalic(true);
  body.appendParagraph('After first reference, you may use "the SCORE framework" or "SCORE pillars."').setForegroundColor(BLACK);

  // ============================================================
  // SOURCE DOCUMENTS
  // ============================================================
  body.appendParagraph('');
  body.appendParagraph('Source Documents').setHeading(DocumentApp.ParagraphHeading.HEADING2).setForegroundColor(BLUE);
  addBullet(body, 'Value Prop Narrative (Jan 2026): 260109-PERL-ValuePropNT-SDga.pdf — Core positioning document introducing "Performance on Rails" concept and Value Before Verification principle', BLACK);

  body.appendParagraph('');
  body.appendParagraph('Last updated: January 2026').setForegroundColor(BLACK).setItalic(true);
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function addBullet(body, text, color) {
  body.appendListItem(text).setGlyphType(DocumentApp.GlyphType.BULLET).setForegroundColor(color);
}

function styleHeaderTable(table, headerColor, bodyColor) {
  // Style header row (labels)
  for (var j = 0; j < table.getRow(0).getNumCells(); j++) {
    table.getRow(0).getCell(j).setBackgroundColor(headerColor);
    table.getRow(0).getCell(j).getChild(0).asText()
      .setForegroundColor('#ffffff')
      .setBold(true)
      .setItalic(false)
      .setFontSize(11);
    table.getRow(0).getCell(j)
      .setPaddingTop(6)
      .setPaddingBottom(6)
      .setPaddingLeft(8)
      .setPaddingRight(8);
  }
  // Style data row (values) - explicitly NOT italic, NOT bold
  if (table.getNumRows() > 1) {
    for (var j = 0; j < table.getRow(1).getNumCells(); j++) {
      table.getRow(1).getCell(j).getChild(0).asText()
        .setFontSize(11)
        .setForegroundColor(bodyColor)
        .setBold(false)
        .setItalic(false);
      table.getRow(1).getCell(j)
        .setPaddingTop(6)
        .setPaddingBottom(6)
        .setPaddingLeft(8)
        .setPaddingRight(8);
    }
  }
  table.setBorderWidth(1);
}

function styleDataTable(table, headerColor, bodyColor) {
  // Style header row
  for (var j = 0; j < table.getRow(0).getNumCells(); j++) {
    table.getRow(0).getCell(j).setBackgroundColor(headerColor);
    table.getRow(0).getCell(j).getChild(0).asText()
      .setForegroundColor('#ffffff')
      .setBold(true)
      .setItalic(false)
      .setFontSize(11);
    table.getRow(0).getCell(j)
      .setPaddingTop(6)
      .setPaddingBottom(6)
      .setPaddingLeft(6)
      .setPaddingRight(6);
  }
  // Style data rows - explicitly NOT italic, NOT bold
  for (var i = 1; i < table.getNumRows(); i++) {
    for (var j = 0; j < table.getRow(i).getNumCells(); j++) {
      table.getRow(i).getCell(j).getChild(0).asText()
        .setFontSize(11)
        .setForegroundColor(bodyColor)
        .setBold(false)
        .setItalic(false);
      table.getRow(i).getCell(j)
        .setPaddingTop(4)
        .setPaddingBottom(4)
        .setPaddingLeft(6)
        .setPaddingRight(6);
    }
  }
  table.setBorderWidth(1);
}
