/**
 * Report Generator
 *
 * Takes scraped page data and QC results, generates:
 * - Excel workbook with Summary sheet and per-page detail sheets
 * - Console summary table
 */

import ExcelJS from 'exceljs';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import type { ScrapedPage } from './page-scraper';
import type { PageQCResult, QCIssue } from './qc-integration';

// --- Excel Colors ---

const HEADER_BG = 'FF2D3748';
const HEADER_FG = 'FFFFFFFF';
const BORDER_COLOR = 'FFE2E8F0';

const GRADE_COLORS: Record<string, string> = {
  A: 'FFD4EDDA', // green
  B: 'FFD4EDDA', // green
  C: 'FFFFF3CD', // yellow
  D: 'FFF8D7DA', // red
  F: 'FFF8D7DA', // red
};

const SEVERITY_COLORS: Record<string, string> = {
  Critical: 'FFFEE2E2',  // light red
  Important: 'FFFFFBEB', // light yellow
  Minor: 'FFEFF6FF',     // light blue
};

// --- Excel helpers ---

function styleHeaderRow(row: ExcelJS.Row): void {
  row.font = { bold: true, color: { argb: HEADER_FG } };
  row.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: HEADER_BG },
  };
  row.alignment = { vertical: 'middle', wrapText: true };
  row.height = 24;
}

function addBorders(sheet: ExcelJS.Worksheet): void {
  for (let r = 1; r <= sheet.rowCount; r++) {
    sheet.getRow(r).eachCell(cell => {
      cell.border = {
        top: { style: 'thin', color: { argb: BORDER_COLOR } },
        left: { style: 'thin', color: { argb: BORDER_COLOR } },
        bottom: { style: 'thin', color: { argb: BORDER_COLOR } },
        right: { style: 'thin', color: { argb: BORDER_COLOR } },
      };
    });
  }
}

function truncateSheetName(name: string, maxLength: number = 31): string {
  // Excel sheet names max 31 chars, no special chars
  const cleaned = name.replace(/[\\/*?:\[\]]/g, '').trim();
  return cleaned.length > maxLength ? cleaned.slice(0, maxLength - 1) + '\u2026' : cleaned;
}

// --- Public API ---

export interface ReportOptions {
  pages: ScrapedPage[];
  qcResults: PageQCResult[];
  outputDir: string;
}

/**
 * Generate an Excel workbook with:
 *   Sheet 1 "Summary" — one row per page with URL, Title, Grade, issue counts
 *   Sheet 2+ — one sheet per page that has issues, with issue details
 *
 * Also prints a console summary table.
 *
 * @returns Path to the generated Excel file
 */
export async function generateReport(options: ReportOptions): Promise<string> {
  const { pages, qcResults, outputDir } = options;
  const date = new Date().toISOString().split('T')[0];
  const filename = `website_qc_report_${date}.xlsx`;
  const outputPath = join(outputDir, filename);

  // Ensure output directory exists
  mkdirSync(dirname(outputPath), { recursive: true });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Pearl Website Manager';
  workbook.created = new Date();

  // --- Summary Sheet ---
  const summarySheet = workbook.addWorksheet('Summary', {
    properties: { defaultColWidth: 20 },
  });

  summarySheet.columns = [
    { header: 'URL', key: 'url', width: 50 },
    { header: 'Title', key: 'title', width: 40 },
    { header: 'Grade', key: 'grade', width: 10 },
    { header: 'Critical', key: 'critical', width: 10 },
    { header: 'Important', key: 'important', width: 10 },
    { header: 'Minor', key: 'minor', width: 10 },
    { header: 'Status', key: 'status', width: 15 },
  ];

  styleHeaderRow(summarySheet.getRow(1));

  // Track pages with issues for detail sheets
  const pagesWithIssues: { page: ScrapedPage; qcResult: PageQCResult }[] = [];
  const usedSheetNames = new Set<string>(['Summary']);

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const qcResult = qcResults.find(r => r.url === page.url);

    const grade = qcResult?.qcResult?.grade || (qcResult?.skipped ? 'Skipped' : 'Error');
    const critical = qcResult?.qcResult?.criticalIssues.length ?? 0;
    const important = qcResult?.qcResult?.importantIssues.length ?? 0;
    const minor = qcResult?.qcResult?.minorIssues.length ?? 0;

    let status = 'N/A';
    if (qcResult?.skipped) {
      status = 'Skipped';
    } else if (qcResult?.error) {
      status = 'Error';
    } else if (qcResult?.qcResult) {
      status = critical + important + minor === 0 ? 'Clean' : 'Issues Found';
    }

    const row = summarySheet.addRow({
      url: page.url,
      title: page.title || '(no title)',
      grade,
      critical,
      important,
      minor,
      status,
    });

    // Color-code grade cell
    const gradeCell = row.getCell('grade');
    const gradeColor = GRADE_COLORS[grade.charAt(0).toUpperCase()];
    if (gradeColor) {
      gradeCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: gradeColor },
      };
    }

    row.alignment = { vertical: 'top', wrapText: true };

    // Track pages with issues for detail sheets
    if (qcResult?.qcResult && (critical + important + minor) > 0) {
      pagesWithIssues.push({ page, qcResult });
    }
  }

  addBorders(summarySheet);

  // --- Detail Sheets (one per page with issues) ---
  for (const { page, qcResult } of pagesWithIssues) {
    const result = qcResult.qcResult!;
    const path = new URL(page.url).pathname.replace(/\//g, ' ').trim() || 'home';
    let sheetName = truncateSheetName(path);

    // Ensure unique sheet names
    let counter = 1;
    while (usedSheetNames.has(sheetName)) {
      const suffix = ` (${counter})`;
      sheetName = truncateSheetName(path, 31 - suffix.length) + suffix;
      counter++;
    }
    usedSheetNames.add(sheetName);

    const detailSheet = workbook.addWorksheet(sheetName, {
      properties: { defaultColWidth: 20 },
    });

    detailSheet.columns = [
      { header: '#', key: 'rowNum', width: 5 },
      { header: 'Severity', key: 'severity', width: 12 },
      { header: 'Category', key: 'category', width: 22 },
      { header: 'Original Text', key: 'originalText', width: 45 },
      { header: 'Issue', key: 'issue', width: 45 },
      { header: 'Suggested Fix', key: 'suggestedFix', width: 45 },
      { header: 'Confidence', key: 'confidence', width: 12 },
    ];

    styleHeaderRow(detailSheet.getRow(1));

    // Add page info row
    const infoRow = detailSheet.addRow({
      rowNum: '',
      severity: '',
      category: `URL: ${page.url}`,
      originalText: `Title: ${page.title}`,
      issue: `Grade: ${result.grade}`,
      suggestedFix: `Summary: ${result.summary}`,
      confidence: '',
    });
    infoRow.font = { italic: true };
    infoRow.alignment = { vertical: 'top', wrapText: true };

    // Add issues
    let rowNum = 1;
    const addIssues = (issues: QCIssue[], severity: string) => {
      for (const issue of issues) {
        const row = detailSheet.addRow({
          rowNum,
          severity,
          category: issue.category,
          originalText: issue.originalText,
          issue: issue.issue,
          suggestedFix: issue.suggestedFix,
          confidence: issue.confidence,
        });

        const color = SEVERITY_COLORS[severity] || 'FFFFFFFF';
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: color },
        };
        row.alignment = { vertical: 'top', wrapText: true };
        rowNum++;
      }
    };

    addIssues(result.criticalIssues, 'Critical');
    addIssues(result.importantIssues, 'Important');
    addIssues(result.minorIssues, 'Minor');

    addBorders(detailSheet);
  }

  // Write file
  const buffer = await workbook.xlsx.writeBuffer();
  writeFileSync(outputPath, Buffer.from(buffer));

  return outputPath;
}

/**
 * Print a console summary table of page grades.
 */
export function printConsoleSummary(qcResults: PageQCResult[]): void {
  console.log('');
  console.log('  Website QC Summary');
  console.log('  ' + '='.repeat(90));
  console.log(
    '  ' +
    'URL'.padEnd(50) +
    'Grade'.padEnd(8) +
    'Critical'.padEnd(10) +
    'Important'.padEnd(10) +
    'Minor'.padEnd(8)
  );
  console.log('  ' + '-'.repeat(90));

  let totalCritical = 0;
  let totalImportant = 0;
  let totalMinor = 0;
  const gradeCount: Record<string, number> = {};

  for (const result of qcResults) {
    const grade = result.qcResult?.grade || (result.skipped ? 'Skip' : 'Err');
    const critical = result.qcResult?.criticalIssues.length ?? 0;
    const important = result.qcResult?.importantIssues.length ?? 0;
    const minor = result.qcResult?.minorIssues.length ?? 0;

    totalCritical += critical;
    totalImportant += important;
    totalMinor += minor;

    const gradeKey = grade.charAt(0).toUpperCase();
    gradeCount[gradeKey] = (gradeCount[gradeKey] || 0) + 1;

    // Truncate URL for display
    const displayUrl = result.url.replace('https://pearlscore.com', '').replace('https://www.pearlscore.com', '') || '/';
    const truncatedUrl = displayUrl.length > 48 ? displayUrl.slice(0, 47) + '\u2026' : displayUrl;

    console.log(
      '  ' +
      truncatedUrl.padEnd(50) +
      grade.padEnd(8) +
      String(critical).padEnd(10) +
      String(important).padEnd(10) +
      String(minor).padEnd(8)
    );
  }

  console.log('  ' + '-'.repeat(90));
  console.log(
    '  ' +
    `Total (${qcResults.length} pages)`.padEnd(50) +
    ''.padEnd(8) +
    String(totalCritical).padEnd(10) +
    String(totalImportant).padEnd(10) +
    String(totalMinor).padEnd(8)
  );

  // Grade distribution
  const gradeStr = Object.entries(gradeCount)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([g, c]) => `${g}: ${c}`)
    .join('  ');
  console.log(`\n  Grade distribution: ${gradeStr}`);
  console.log('');
}
