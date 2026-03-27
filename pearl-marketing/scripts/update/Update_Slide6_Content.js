/**
 * Update_Slide6_Content.js
 * Updates Content Marketing Dashboard (Slide 6) with Sprout Social data
 * and corrected platform strategy.
 *
 * Run: updateSlide6Content()
 * One-time use — paste in Apps Script editor and run.
 */

var PRESENTATION_ID = '1IfMilLCp41cjlwixDZ_tXI1paqcdNJziV2HTGINQp-8';

function updateSlide6Content() {
  var presentation = SlidesApp.openById(PRESENTATION_ID);

  // Text box IDs on slide 6 and their new content
  var updates = {
    'textBox_154d997d':
      'B2C Blog — "What Every Buyer Needs to Know" Pillar Series (Craft CMS)\n\n' +
      '  \u2022 Safety — Published Jan 7\n' +
      '  \u2022 Comfort — Published Jan 21\n' +
      '  \u2022 Operating Costs — Published Feb 4\n' +
      '  \u2022 Resilience — Published Feb 18\n' +
      '  \u2022 Energy — [Planned]\n' +
      '  \u2022 Average Utility Bill — In Review (Craft)\n\n' +
      'B2B Blog — pearlscore.com/news/industries (Agent-Facing)\n\n' +
      '  \u2022 "America\'s 40-Year-Old Problem" — Published Feb 6\n' +
      '  \u2022 "Five Things Your Clients Can\'t See in Listing Photos" — Published Jan 1\n' +
      '  \u2022 "Buyer Priorities Are Shifting" — Published Dec 9',

    'textBox_e1fe05a7':
      'Q1 2026 (Jan 1 – Mar 2) vs. Q4 2025 (Nov 1 – Dec 31)\n\n' +
      '  Impressions: 13,304\n' +
      '  Engagements: 919\n' +
      '  Post Link Clicks: 480 (+68.4%)\n' +
      '  Engagement Rate: 6.9%\n' +
      '  Published Posts: 37\n\n' +
      'Platform Breakdown:\n' +
      '  LinkedIn (B2B): 10,388 imp | 793 eng | 7.6% rate\n' +
      '  Facebook (B2C): 2,081 views | 81 eng | 3.9% rate\n' +
      '  Instagram (Culture): 583 views | 32 eng | 5.5% rate\n' +
      '  X (B2B): 212 imp | 11 eng | 5.2% rate\n' +
      '  BlueSky (B2B): Emerging — active posting, not yet in profile metrics',

    'textBox_87460fce':
      'LinkedIn dominates — 78% of all impressions, 86% of all engagements. ' +
      'Top posts: Inman Award press release (1,399 imp, 141 eng), new hire ' +
      'announcements (11% eng rates), and buyer-priorities thought leadership. ' +
      'Post link clicks up 68.4% vs. Q4 — content is driving click-through.\n\n' +
      'Two-audience model: LinkedIn + BlueSky for B2B (agents, brokers, MLSs), ' +
      'Meta for B2C (homeowners), Instagram for culture/recruitment. ' +
      'Major news cross-posted to Meta.\n\n' +
      'Next: Complete five-pillar series (Energy post), push average utility bill ' +
      'article to production, ramp B2B blog cadence on BlueSky + LinkedIn, ' +
      'develop SCORE Report launch content for April 2.',

    'textBox_e0a7e268':
      'Sources: Sprout Social Profile Performance Report (Jan 1 – Mar 2, 2026), ' +
      'Sprout Social Post Performance Report (Jan 1 – Mar 2, 2026), ' +
      'Craft CMS, pearlscore.com/news/industries/blogs'
  };

  var slides = presentation.getSlides();
  var updatedCount = 0;

  for (var i = 0; i < slides.length; i++) {
    var elements = slides[i].getPageElements();
    for (var j = 0; j < elements.length; j++) {
      var objectId = elements[j].getObjectId();
      if (updates[objectId]) {
        var shape = elements[j].asShape();
        var textRange = shape.getText();
        textRange.clear();
        textRange.setText(updates[objectId]);
        updatedCount++;
        Logger.log('Updated: ' + objectId);
      }
    }
  }

  Logger.log('Done. Updated ' + updatedCount + ' of ' + Object.keys(updates).length + ' text boxes.');
}
