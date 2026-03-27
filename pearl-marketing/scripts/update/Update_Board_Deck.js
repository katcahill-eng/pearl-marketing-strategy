/**
 * Updates the Board Deck presentation
 * Presentation ID: 1IfMilLCp41cjlwixDZ_tXI1paqcdNJziV2HTGINQp-8
 * 41 slides — general-purpose deck management (templates, charts, text, deletions, images)
 *
 * The deck uses a corporate template with reusable layout slides (indices 16-31).
 * New content slides should be created by duplicating a template slide, NOT from scratch.
 *
 * Usage pattern:
 *   1. Claude reads slide state via MCP (get_google_slides_content)
 *   2. For things MCP can handle (text formatting, shape creation): Claude does directly
 *   3. For things MCP can't handle (delete, image swap, image insert, slide duplication):
 *      Claude tells user which function to run with specific parameters
 *   4. For chart updates: regenerate PNGs → upload to Drive → run updatePRDashboardCharts()
 *   5. For new slides: duplicate a template → populate with content
 */

// =====================
// CONFIGURATION
// =====================

var PRESENTATION_ID = '1IfMilLCp41cjlwixDZ_tXI1paqcdNJziV2HTGINQp-8';
var CHARTS_FOLDER_NAME = 'PR Dashboard Charts';

// Chart image tag → Drive filename mapping
var CHART_MAP = {
  'pr_bar_chart':          'bar_chart.png',
  'pr_progress_rings':     'progress_rings.png',
  'pr_timeline':           'timeline.png',
  'pr_pipeline':           'pipeline.png',
  'pr_thought_leadership': 'thought_leadership.png',
  'pr_status_key':         'status_key.png'
};

// Corporate template slide index → layout name (master layout in parentheses)
// These are the reusable layout slides built into the deck.
// Use duplicateTemplateSlide() to create new on-brand slides from these.
var TEMPLATE_MAP = {
  'title':                 0,   // Title slide — TITLE
  'section_divider':       1,   // Section divider (number, title, TOC) — SECTION_HEADER_1
  'dashboard':             2,   // Dashboard content (title + image areas) — TITLE_AND_BODY_1
  'title_body':            16,  // Title + body text — ONE_COLUMN_TEXT_1
  'title_3sections':       17,  // Title + 3 section headings with body — ONE_COLUMN_TEXT
  'title_3subtitles':      18,  // Title + 3 subtitle/body pairs — CUSTOM_2_1_1_1_2_2_2
  'title_3sections_alt':   19,  // Title + 3 section headings (variant) — ONE_COLUMN_TEXT
  'title_3subtitles_alt':  20,  // Title + 3 subtitle/body pairs (variant) — CUSTOM_2_1_1_1_2_2_2
  'title_rounded_rect':    21,  // Title + rounded rectangle shape — TITLE_AND_BODY
  'timeline':              22,  // Timeline with 4 date markers — TITLE_AND_BODY
  'title_table':           23,  // Title + table — TITLE_AND_BODY
  'title_table_alt':       24,  // Title + table (variant) — TITLE_AND_BODY_1
  '3sections_no_title':    25,  // 3 section headings (no title) — ONE_COLUMN_TEXT_1_5
  'profile_single':        26,  // Person profile card (1 person) — CUSTOM_4_1
  'profile_double':        27,  // Person profile card (2 people) — CUSTOM_4_1_1
  'testimonials_triple':   28,  // 3 testimonial quotes — CUSTOM_4_1_1_1
  '3subtitles_image':      30,  // 3 subtitle/body pairs + image — CUSTOM_3_1_1
  '3subtitles_image_alt':  31,  // 3 subtitle/body pairs + image (variant) — CUSTOM_3_1
  'thank_you':             36   // Thank You / closing — CUSTOM_6
};

// =====================
// TEMPLATE / LAYOUT FUNCTIONS
// =====================

/**
 * Lists all available template layouts with their names and slide indices.
 * Run this to see what layouts are available before creating new slides.
 */
function listTemplates() {
  Logger.log('=== Available Corporate Templates ===');
  Logger.log('');
  Logger.log('Use duplicateTemplateSlide(templateName, insertAtIndex) to create a new slide.');
  Logger.log('');

  var names = Object.keys(TEMPLATE_MAP);
  for (var i = 0; i < names.length; i++) {
    Logger.log('  "' + names[i] + '" → slide ' + (TEMPLATE_MAP[names[i]] + 1) + ' (index ' + TEMPLATE_MAP[names[i]] + ')');
  }

  Logger.log('');
  Logger.log('Also run listMasterLayouts() to see the presentation\'s built-in master layouts.');
}

/**
 * Lists the presentation's master slide layouts (the built-in Slides layouts).
 * These are separate from the template slides in TEMPLATE_MAP.
 */
function listMasterLayouts() {
  var presentation = SlidesApp.openById(PRESENTATION_ID);
  var layouts = presentation.getLayouts();

  Logger.log('=== Master Layouts (' + layouts.length + ') ===');
  Logger.log('');

  for (var i = 0; i < layouts.length; i++) {
    var layout = layouts[i];
    Logger.log('[' + i + '] "' + layout.getLayoutName() + '" | objectId: ' + layout.getObjectId());
  }

  Logger.log('');
  Logger.log('Use appendSlideFromLayout(layoutName) to add a slide using a master layout.');
}

/**
 * Duplicates a template slide and inserts the copy at a specific position.
 * This is the primary way to create new on-brand slides.
 *
 * The new slide inherits all formatting, shapes, and brand elements from the template.
 * After duplication, use updateTextById() or MCP tools to populate the placeholder content.
 *
 * @param {string} templateName - A key from TEMPLATE_MAP (e.g., 'title_body', 'timeline')
 * @param {number} insertAtIndex - 0-based position where the new slide should appear
 */
function duplicateTemplateSlide(templateName, insertAtIndex) {
  var sourceIndex = TEMPLATE_MAP[templateName];
  if (sourceIndex === undefined) {
    Logger.log('ERROR: Unknown template "' + templateName + '"');
    Logger.log('Available templates: ' + Object.keys(TEMPLATE_MAP).join(', '));
    return;
  }

  var presentation = SlidesApp.openById(PRESENTATION_ID);
  var slides = presentation.getSlides();

  if (sourceIndex >= slides.length) {
    Logger.log('ERROR: Template slide index ' + sourceIndex + ' out of range');
    return;
  }

  if (insertAtIndex < 0 || insertAtIndex > slides.length) {
    Logger.log('ERROR: insertAtIndex ' + insertAtIndex + ' out of range (0-' + slides.length + ')');
    return;
  }

  var sourceSlide = slides[sourceIndex];
  var newSlide = presentation.insertSlide(insertAtIndex, sourceSlide);

  Logger.log('Created slide from template "' + templateName + '"');
  Logger.log('  Source: slide ' + (sourceIndex + 1));
  Logger.log('  Inserted at: position ' + (insertAtIndex + 1));
  Logger.log('  New slide objectId: ' + newSlide.getObjectId());
  Logger.log('');

  // Log the new slide's elements so user knows what to populate
  var elements = newSlide.getPageElements();
  Logger.log('Elements to populate (' + elements.length + '):');
  for (var i = 0; i < elements.length; i++) {
    var el = elements[i];
    var type = el.getPageElementType();
    var info = '  [' + i + '] ' + type + ' | id: ' + el.getObjectId();

    if (type === SlidesApp.PageElementType.SHAPE) {
      var text = el.asShape().getText().asString().replace(/\n/g, '\\n');
      if (text.length > 50) text = text.substring(0, 50) + '...';
      info += ' | text: "' + text + '"';
    }
    if (type === SlidesApp.PageElementType.IMAGE) {
      info += ' | image (replace via insertImageFromDrive or manually)';
    }

    Logger.log(info);
  }
}

/**
 * Appends a new slide using one of the presentation's master layouts.
 * Use listMasterLayouts() to see available layout names.
 *
 * @param {string} layoutName - The master layout name (e.g., 'BLANK', 'TITLE')
 */
function appendSlideFromLayout(layoutName) {
  var presentation = SlidesApp.openById(PRESENTATION_ID);
  var layouts = presentation.getLayouts();
  var targetLayout = null;

  for (var i = 0; i < layouts.length; i++) {
    if (layouts[i].getLayoutName() === layoutName) {
      targetLayout = layouts[i];
      break;
    }
  }

  if (!targetLayout) {
    Logger.log('ERROR: Layout "' + layoutName + '" not found');
    Logger.log('Run listMasterLayouts() to see available names.');
    return;
  }

  var newSlide = presentation.appendSlide(targetLayout);

  Logger.log('Appended slide using master layout "' + layoutName + '"');
  Logger.log('  New slide objectId: ' + newSlide.getObjectId());
  Logger.log('  Position: slide ' + presentation.getSlides().length);
}

/**
 * Moves a slide from one position to another.
 * Useful after duplicating a template to reposition it in the deck.
 *
 * @param {number} fromIndex - Current 0-based index of the slide
 * @param {number} toIndex - Target 0-based index
 */
function moveSlide(fromIndex, toIndex) {
  var presentation = SlidesApp.openById(PRESENTATION_ID);
  var slides = presentation.getSlides();

  if (fromIndex < 0 || fromIndex >= slides.length) {
    Logger.log('ERROR: fromIndex ' + fromIndex + ' out of range (0-' + (slides.length - 1) + ')');
    return;
  }
  if (toIndex < 0 || toIndex >= slides.length) {
    Logger.log('ERROR: toIndex ' + toIndex + ' out of range (0-' + (slides.length - 1) + ')');
    return;
  }

  slides[fromIndex].move(toIndex);
  Logger.log('Moved slide from position ' + (fromIndex + 1) + ' to position ' + (toIndex + 1));
}

/**
 * Deletes a slide by its 0-based index.
 *
 * @param {number} slideIndex - 0-based slide index to delete
 */
function deleteSlide(slideIndex) {
  var presentation = SlidesApp.openById(PRESENTATION_ID);
  var slides = presentation.getSlides();

  if (slideIndex < 0 || slideIndex >= slides.length) {
    Logger.log('ERROR: slideIndex ' + slideIndex + ' out of range (0-' + (slides.length - 1) + ')');
    return;
  }

  var slideId = slides[slideIndex].getObjectId();
  slides[slideIndex].remove();
  Logger.log('Deleted slide ' + (slideIndex + 1) + ' (objectId: ' + slideId + ')');
  Logger.log('Deck now has ' + (slides.length - 1) + ' slides');
}

// =====================
// CHART FUNCTIONS
// =====================

/**
 * One-time setup: logs chart images on slides 3-4 with position and ID details
 * so you can assign description tags via setDescriptionForImage().
 *
 * Run once after placing chart images on slides 3-4.
 */
function tagPRDashboardCharts() {
  var presentation = SlidesApp.openById(PRESENTATION_ID);
  var slides = presentation.getSlides();
  var chartTags = Object.keys(CHART_MAP);

  // Slides 3-4 are index 2-3
  for (var s = 2; s <= 3 && s < slides.length; s++) {
    var slide = slides[s];
    var elements = slide.getPageElements();
    var imageIndex = 0;

    Logger.log('--- Slide ' + (s + 1) + ' ---');

    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];

      if (element.getPageElementType() === SlidesApp.PageElementType.IMAGE) {
        var image = element.asImage();
        var left = element.getLeft();
        var top = element.getTop();
        var width = element.getWidth();
        var height = element.getHeight();

        Logger.log(
          'Image ' + imageIndex +
          ' | objectId: ' + element.getObjectId() +
          ' | left: ' + left +
          ' | top: ' + top +
          ' | width: ' + width +
          ' | height: ' + height +
          ' | current description: ' + (image.getDescription() || '(none)')
        );

        imageIndex++;
      }
    }

    Logger.log('Found ' + imageIndex + ' images on slide ' + (s + 1));
    Logger.log('Available chart tags: ' + chartTags.join(', '));
  }

  Logger.log('');
  Logger.log('To assign tags, use setDescriptionForImage(objectId, tag)');
}

/**
 * Sets the description (alt text) on a specific image by object ID.
 * Use after running tagPRDashboardCharts() to identify which image gets which tag.
 *
 * @param {string} objectId - The element's object ID (from tagPRDashboardCharts log)
 * @param {string} tag - A key from CHART_MAP (e.g., 'pr_bar_chart')
 */
function setDescriptionForImage(objectId, tag) {
  var presentation = SlidesApp.openById(PRESENTATION_ID);
  var slides = presentation.getSlides();

  for (var s = 0; s < slides.length; s++) {
    var elements = slides[s].getPageElements();
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].getObjectId() === objectId) {
        elements[i].asImage().setDescription(tag);
        Logger.log('Set description "' + tag + '" on image ' + objectId + ' (slide ' + (s + 1) + ')');
        return;
      }
    }
  }

  Logger.log('ERROR: No element found with objectId: ' + objectId);
}

/**
 * Repeatable chart refresh: swaps chart images on slides 3-4 with updated PNGs from Drive.
 *
 * For each image that has a recognized description tag (from CHART_MAP):
 *   - Finds the matching PNG in the CHARTS_FOLDER_NAME Drive folder
 *   - Replaces the image blob in-place (preserves position and size)
 *
 * Images without tags are skipped (non-chart images stay untouched).
 */
function updatePRDashboardCharts() {
  var presentation = SlidesApp.openById(PRESENTATION_ID);
  var slides = presentation.getSlides();

  // Find the charts folder in Drive
  var folders = DriveApp.getFoldersByName(CHARTS_FOLDER_NAME);
  if (!folders.hasNext()) {
    Logger.log('ERROR: Drive folder "' + CHARTS_FOLDER_NAME + '" not found');
    return;
  }
  var folder = folders.next();

  var updated = 0;
  var skipped = 0;

  // Slides 3-4 are index 2-3
  for (var s = 2; s <= 3 && s < slides.length; s++) {
    var slide = slides[s];
    var elements = slide.getPageElements();

    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];

      if (element.getPageElementType() !== SlidesApp.PageElementType.IMAGE) {
        continue;
      }

      var image = element.asImage();
      var tag = image.getDescription();

      if (!tag || !CHART_MAP[tag]) {
        skipped++;
        continue;
      }

      var filename = CHART_MAP[tag];
      var files = folder.getFilesByName(filename);

      if (!files.hasNext()) {
        Logger.log('WARNING: File "' + filename + '" not found in folder for tag "' + tag + '"');
        continue;
      }

      var file = files.next();
      image.replace(file.getBlob());
      updated++;
      Logger.log('Updated: ' + tag + ' ← ' + filename + ' (slide ' + (s + 1) + ')');
    }
  }

  Logger.log('');
  Logger.log('Chart update complete: ' + updated + ' updated, ' + skipped + ' skipped (untagged)');
}

// =====================
// ELEMENT MANAGEMENT
// =====================

/**
 * Deletes specific elements by their object IDs.
 * Use MCP get_google_slides_content to find the IDs first.
 *
 * @param {string[]} objectIds - Array of element object IDs to delete
 */
function deleteElementsByIds(objectIds) {
  var presentation = SlidesApp.openById(PRESENTATION_ID);
  var slides = presentation.getSlides();
  var deleted = 0;

  for (var s = 0; s < slides.length; s++) {
    var elements = slides[s].getPageElements();

    for (var i = elements.length - 1; i >= 0; i--) {
      var element = elements[i];

      if (objectIds.indexOf(element.getObjectId()) !== -1) {
        var objectId = element.getObjectId();
        var type = element.getPageElementType();
        element.remove();
        deleted++;
        Logger.log('Deleted: ' + objectId + ' (type: ' + type + ', slide ' + (s + 1) + ')');
      }
    }
  }

  Logger.log('');
  Logger.log('Deletion complete: ' + deleted + '/' + objectIds.length + ' elements removed');

  if (deleted < objectIds.length) {
    Logger.log('WARNING: ' + (objectIds.length - deleted) + ' IDs not found');
  }
}

/**
 * Replaces text content in a specific element, preserving formatting.
 *
 * @param {string} objectId - The element's object ID
 * @param {string} newText - The replacement text
 */
function updateTextById(objectId, newText) {
  var presentation = SlidesApp.openById(PRESENTATION_ID);
  var slides = presentation.getSlides();

  for (var s = 0; s < slides.length; s++) {
    var elements = slides[s].getPageElements();

    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];

      if (element.getObjectId() !== objectId) {
        continue;
      }

      var shape;
      var type = element.getPageElementType();

      if (type === SlidesApp.PageElementType.SHAPE) {
        shape = element.asShape();
      } else if (type === SlidesApp.PageElementType.TABLE) {
        Logger.log('ERROR: Element is a table — use table-specific methods instead');
        return;
      } else {
        Logger.log('ERROR: Element type ' + type + ' does not support text replacement');
        return;
      }

      var textRange = shape.getText();
      var oldText = textRange.asString();

      // Capture style from the first character to preserve formatting
      var style = null;
      if (oldText.length > 0) {
        style = textRange.getRange(0, 1).getTextStyle();
      }

      textRange.setText(newText);

      // Re-apply the original style to the new text
      if (style && newText.length > 0) {
        var newStyle = textRange.getTextStyle();
        if (style.getFontFamily()) newStyle.setFontFamily(style.getFontFamily());
        if (style.getFontSize()) newStyle.setFontSize(style.getFontSize());
        if (style.getForegroundColor()) newStyle.setForegroundColor(style.getForegroundColor());
        newStyle.setBold(style.isBold());
        newStyle.setItalic(style.isItalic());
      }

      Logger.log('Updated text on slide ' + (s + 1) + ' (' + objectId + ')');
      Logger.log('  Old: ' + oldText.substring(0, 80).replace(/\n/g, '\\n'));
      Logger.log('  New: ' + newText.substring(0, 80).replace(/\n/g, '\\n'));
      return;
    }
  }

  Logger.log('ERROR: No element found with objectId: ' + objectId);
}

// =====================
// IMAGE INSERTION
// =====================

/**
 * Inserts an image from a named Drive folder onto a specific slide.
 *
 * @param {number} slideIndex - 0-based slide index
 * @param {string} fileName - Image filename in Drive folder
 * @param {string} folderName - Drive folder name containing the image
 * @param {number} left - Left position in points
 * @param {number} top - Top position in points
 * @param {number} width - Width in points
 * @param {number} height - Height in points
 */
function insertImageFromDrive(slideIndex, fileName, folderName, left, top, width, height) {
  var presentation = SlidesApp.openById(PRESENTATION_ID);
  var slides = presentation.getSlides();

  if (slideIndex < 0 || slideIndex >= slides.length) {
    Logger.log('ERROR: slideIndex ' + slideIndex + ' out of range (0-' + (slides.length - 1) + ')');
    return;
  }

  var folders = DriveApp.getFoldersByName(folderName);
  if (!folders.hasNext()) {
    Logger.log('ERROR: Drive folder "' + folderName + '" not found');
    return;
  }
  var folder = folders.next();

  var files = folder.getFilesByName(fileName);
  if (!files.hasNext()) {
    Logger.log('ERROR: File "' + fileName + '" not found in folder "' + folderName + '"');
    return;
  }
  var file = files.next();

  var slide = slides[slideIndex];
  var image = slide.insertImage(file.getBlob(), left, top, width, height);

  Logger.log('Inserted image on slide ' + (slideIndex + 1));
  Logger.log('  File: ' + fileName + ' (from ' + folderName + ')');
  Logger.log('  Position: left=' + left + ', top=' + top);
  Logger.log('  Size: ' + width + 'x' + height);
  Logger.log('  Object ID: ' + image.getObjectId());
}

// =====================
// DIAGNOSTICS
// =====================

/**
 * Lists all elements on a slide with type, objectId, position, size, and text preview.
 *
 * @param {number} slideIndex - 0-based slide index
 */
function listSlideElements(slideIndex) {
  var presentation = SlidesApp.openById(PRESENTATION_ID);
  var slides = presentation.getSlides();

  if (slideIndex < 0 || slideIndex >= slides.length) {
    Logger.log('ERROR: slideIndex ' + slideIndex + ' out of range (0-' + (slides.length - 1) + ')');
    return;
  }

  var slide = slides[slideIndex];
  var elements = slide.getPageElements();
  var layout = slide.getLayout();

  Logger.log('=== Slide ' + (slideIndex + 1) + ' (' + elements.length + ' elements) ===');
  Logger.log('Layout: ' + layout.getLayoutName());
  Logger.log('');

  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    var type = element.getPageElementType();
    var objectId = element.getObjectId();
    var left = element.getLeft();
    var top = element.getTop();
    var width = element.getWidth();
    var height = element.getHeight();

    var info = '[' + i + '] ' + type +
      ' | id: ' + objectId +
      ' | pos: (' + left + ', ' + top + ')' +
      ' | size: ' + width + 'x' + height;

    // Add text preview for shapes
    if (type === SlidesApp.PageElementType.SHAPE) {
      var text = element.asShape().getText().asString().replace(/\n/g, '\\n');
      if (text.length > 60) {
        text = text.substring(0, 60) + '...';
      }
      info += ' | text: "' + text + '"';
    }

    // Add description for images
    if (type === SlidesApp.PageElementType.IMAGE) {
      var desc = element.asImage().getDescription();
      info += ' | desc: "' + (desc || '') + '"';
    }

    // Add row/col count for tables
    if (type === SlidesApp.PageElementType.TABLE) {
      var table = element.asTable();
      info += ' | rows: ' + table.getNumRows() + ', cols: ' + table.getNumColumns();
    }

    Logger.log(info);
  }
}

/**
 * Lists all slides in the deck with their index, objectId, layout name, and title text.
 * Useful for getting a quick overview of the full deck structure.
 */
function listAllSlides() {
  var presentation = SlidesApp.openById(PRESENTATION_ID);
  var slides = presentation.getSlides();

  Logger.log('=== ' + presentation.getName() + ' (' + slides.length + ' slides) ===');
  Logger.log('');

  for (var s = 0; s < slides.length; s++) {
    var slide = slides[s];
    var layout = slide.getLayout();
    var elements = slide.getPageElements();

    // Find the first non-empty text to use as a title preview
    var titlePreview = '';
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      if (el.getPageElementType() === SlidesApp.PageElementType.SHAPE) {
        var text = el.asShape().getText().asString().trim();
        if (text.length > 0) {
          titlePreview = text.replace(/\n/g, ' ');
          if (titlePreview.length > 50) titlePreview = titlePreview.substring(0, 50) + '...';
          break;
        }
      }
    }

    Logger.log(
      '[' + s + '] ' +
      'id: ' + slide.getObjectId() +
      ' | layout: ' + layout.getLayoutName() +
      ' | "' + titlePreview + '"'
    );
  }
}
