# Pearl Marketing Google Apps Script Style Guide

This document defines the formatting standards for all Pearl Marketing Google Docs generated via Apps Script.

---

## Color Palette

```javascript
var BLUE = '#003366';      // Headers, headings
var BLACK = '#000000';     // Body text
var GRAY = '#e6e6e6';      // Table backgrounds (light)
var LIGHT_BLUE = '#e6f3ff'; // Highlight backgrounds
var WHITE = '#ffffff';     // Header row text
```

---

## Header Table (Document Metadata)

The first table in every document shows Document | Status | Updated.

### Correct Styling:
- **Header row (row 0):** Blue background (#003366), white text, bold, 11pt
- **Data row (row 1):** White/transparent background, black text, NOT italic, NOT bold, 11pt
- **All cells:** Padding 6-8px

### Correct Code:
```javascript
function styleHeaderTable(table, headerColor, bodyColor) {
  // Style header row (labels)
  for (var j = 0; j < table.getRow(0).getNumCells(); j++) {
    table.getRow(0).getCell(j)
      .setBackgroundColor(headerColor)
      .getChild(0).asText()
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
  // Style data row (values) - NOT italic, NOT bold
  if (table.getNumRows() > 1) {
    for (var j = 0; j < table.getRow(1).getNumCells(); j++) {
      table.getRow(1).getCell(j)
        .getChild(0).asText()
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
```

### WRONG (causes italic text):
```javascript
// This applies styles to the cell, not the text - can cause inherited italic
table.getRow(1).getCell(j)
  .setForegroundColor(bodyColor)  // WRONG - applies to cell
```

### CORRECT:
```javascript
// Get the text element inside the cell and style it directly
table.getRow(1).getCell(j)
  .getChild(0).asText()
  .setForegroundColor(bodyColor)
  .setItalic(false)  // Explicitly turn off italic
```

---

## Data Tables (Content Tables)

Tables showing data like Pillars, Story Angles, Spokespeople, etc.

### Correct Styling:
- **Header row:** Blue background (#003366), white text, bold, 11pt
- **Data rows:** White background, black text, NOT bold, NOT italic, 11pt
- **Padding:** 4-6px

### Correct Code:
```javascript
function styleDataTable(table, headerColor, bodyColor) {
  // Style header row
  for (var j = 0; j < table.getRow(0).getNumCells(); j++) {
    table.getRow(0).getCell(j)
      .setBackgroundColor(headerColor);
    table.getRow(0).getCell(j)
      .getChild(0).asText()
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
  // Style data rows
  for (var i = 1; i < table.getNumRows(); i++) {
    for (var j = 0; j < table.getRow(i).getNumCells(); j++) {
      table.getRow(i).getCell(j)
        .getChild(0).asText()
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
```

---

## Headings

| Level | Use For | Style |
|-------|---------|-------|
| HEADING1 | Document title | Blue (#003366), default size |
| HEADING2 | Major sections | Blue (#003366), default size |
| HEADING3 | Subsections | Blue (#003366), default size |

### Code:
```javascript
body.appendParagraph('Section Title')
  .setHeading(DocumentApp.ParagraphHeading.HEADING2)
  .setForegroundColor(BLUE);
```

---

## Body Text

| Type | Style |
|------|-------|
| Normal paragraph | Black, 11pt, not bold, not italic |
| Emphasis | Italic only when intentional (quotes, notes) |
| Strong emphasis | Bold only for key terms |
| Mission/Key statements | Bold, black |

### Code:
```javascript
// Normal text
body.appendParagraph('Regular content here.')
  .setForegroundColor(BLACK);

// Bold statement
body.appendParagraph('Mission: Make home performance matter.')
  .setBold(true)
  .setForegroundColor(BLACK);

// Intentionally italic (e.g., a note)
body.appendParagraph('This is a note.')
  .setItalic(true)
  .setForegroundColor(BLACK);
```

---

## Bullet Lists

```javascript
function addBullet(body, text, color) {
  body.appendListItem(text)
    .setGlyphType(DocumentApp.GlyphType.BULLET)
    .setForegroundColor(color);
}
```

---

## Common Mistakes to Avoid

1. **Applying styles to cells instead of text** - Always use `.getChild(0).asText()` to style text in table cells
2. **Forgetting to explicitly set `.setItalic(false)`** - Google Docs can inherit styles; always be explicit
3. **Forgetting to explicitly set `.setBold(false)`** - Same issue
4. **Using `.setForegroundColor()` on table cells** - Use on the text element inside the cell instead

---

## Document Structure Template

Every Pearl Marketing Doc should follow this structure:

1. **Header Table** (Document | Status | Updated)
2. **Document Title** (HEADING1)
3. **Sections** (HEADING2) with subsections (HEADING3)
4. **Source Documents** section at end
5. **Last updated** line (italic, at very end)

---

## Test Checklist

Before finalizing a script, verify:

- [ ] Header table data row is NOT italic
- [ ] Header table data row is NOT bold
- [ ] All data tables have non-italic, non-bold data rows
- [ ] Headings are blue (#003366)
- [ ] Body text is black (#000000)
- [ ] Only intentionally styled text is italic/bold

---

*Last updated: January 2026*
