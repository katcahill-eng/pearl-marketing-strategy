/**
 * Insert_SEO_Charts.js
 * Inserts chart images from Drive into the board deck.
 *
 * Charts uploaded to: Pearl/Board Deck/PR Dashboard Charts/
 * - branded_vs_nonbranded.png   → Slide 8 (SEO Dashboard)
 * - ai_visibility_comparison.png → Slide 10 (GEO Dashboard)
 * - ai_audience_comparison.png  → Slide 10 (GEO Dashboard)
 * - social_impressions.png      → Slide 6 (Content Marketing)
 * - social_engagement_rate.png  → Slide 6 (Content Marketing)
 *
 * Run: insertAllCharts()
 */

var PRESENTATION_ID = '1IfMilLCp41cjlwixDZ_tXI1paqcdNJziV2HTGINQp-8';
var FOLDER_NAME = 'PR Dashboard Charts';

function insertAllCharts() {
  // Slide 6 (index 5) — Content Marketing Dashboard
  // Social impressions by platform — right column area
  insertChart_(5, 'social_impressions.png', 365, 105, 330, 155);

  // Engagement rate by platform — right column below impressions
  insertChart_(5, 'social_engagement_rate.png', 365, 270, 330, 120);

  // Slide 8 (index 7) — SEO Dashboard
  // Branded vs. non-branded donut chart — lower-left area
  insertChart_(7, 'branded_vs_nonbranded.png', 30, 170, 280, 200);

  // Slide 10 (index 9) — GEO Dashboard
  // AI Visibility comparison bar chart — lower-left
  insertChart_(9, 'ai_visibility_comparison.png', 25, 170, 330, 185);

  // AI Audience comparison bar chart — lower-right
  insertChart_(9, 'ai_audience_comparison.png', 365, 170, 330, 185);

  Logger.log('All 5 charts inserted. Adjust positions in Slides if needed.');
}

/**
 * Helper: insert a single chart image from Drive folder onto a slide.
 * @param {number} slideIndex - 0-based slide index
 * @param {string} fileName - filename in FOLDER_NAME
 * @param {number} left - x position in points
 * @param {number} top - y position in points
 * @param {number} width - width in points
 * @param {number} height - height in points
 */
function insertChart_(slideIndex, fileName, left, top, width, height) {
  var presentation = SlidesApp.openById(PRESENTATION_ID);
  var slides = presentation.getSlides();

  if (slideIndex < 0 || slideIndex >= slides.length) {
    Logger.log('ERROR: slideIndex ' + slideIndex + ' out of range');
    return;
  }

  var folders = DriveApp.getFoldersByName(FOLDER_NAME);
  if (!folders.hasNext()) {
    Logger.log('ERROR: Drive folder "' + FOLDER_NAME + '" not found');
    return;
  }
  var folder = folders.next();

  var files = folder.getFilesByName(fileName);
  if (!files.hasNext()) {
    Logger.log('ERROR: File "' + fileName + '" not found');
    return;
  }
  var file = files.next();

  var slide = slides[slideIndex];
  var image = slide.insertImage(file.getBlob(), left, top, width, height);
  Logger.log('Inserted ' + fileName + ' on slide ' + (slideIndex + 1) +
    ' at (' + left + ', ' + top + ') size ' + width + 'x' + height);
}
