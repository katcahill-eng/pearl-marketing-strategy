import ExcelJS from 'exceljs';
import { QCResult, QCIssue } from './qc-runner';

// --- Helpers ---

interface ExcelRow {
  rowNum: number;
  section: string;
  originalCopy: string;
  issueCategory: string;
  issueDescription: string;
  suggestedCopy: string;
  confidence: string;
  status: string;
}

function issuesToRows(issues: QCIssue[], severity: string): ExcelRow[] {
  return issues.map((issue, index) => ({
    rowNum: index + 1,
    section: severity,
    originalCopy: issue.originalText,
    issueCategory: issue.category,
    issueDescription: issue.issue,
    suggestedCopy: issue.suggestedFix,
    confidence: issue.confidence,
    status: 'Open',
  }));
}

// --- Public API ---

/**
 * Generate an Excel workbook with original copy and suggested copy columns.
 * Issues are organized by severity with conditional formatting:
 *   - Red for critical issues
 *   - Yellow for important issues
 *   - Blue for minor issues
 *
 * Returns a Buffer suitable for writing to disk or uploading.
 */
export async function generateExcel(result: QCResult): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Pearl Content QC';
  workbook.created = new Date();

  // --- Issues Sheet ---
  const sheet = workbook.addWorksheet('QC Issues', {
    properties: {
      defaultColWidth: 30,
    },
  });

  // Define columns
  sheet.columns = [
    { header: 'Row #', key: 'rowNum', width: 8 },
    { header: 'Severity', key: 'section', width: 12 },
    { header: 'Original Copy', key: 'originalCopy', width: 45 },
    { header: 'Issue Category', key: 'issueCategory', width: 22 },
    { header: 'Issue Description', key: 'issueDescription', width: 45 },
    { header: 'Suggested Copy', key: 'suggestedCopy', width: 45 },
    { header: 'Confidence', key: 'confidence', width: 12 },
    { header: 'Status', key: 'status', width: 12 },
  ];

  // Style the header row
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF2D3748' },
  };
  headerRow.alignment = { vertical: 'middle', wrapText: true };
  headerRow.height = 24;

  // Build rows from all severity levels
  const criticalRows = issuesToRows(result.criticalIssues, 'Critical');
  const importantRows = issuesToRows(result.importantIssues, 'Important');
  const minorRows = issuesToRows(result.minorIssues, 'Minor');

  const allRows = [...criticalRows, ...importantRows, ...minorRows];

  // Renumber sequentially
  allRows.forEach((row, i) => {
    row.rowNum = i + 1;
  });

  // Handle the empty case gracefully
  if (allRows.length === 0) {
    const emptyRow = sheet.addRow({
      rowNum: 1,
      section: '-',
      originalCopy: 'No issues found',
      issueCategory: '-',
      issueDescription: 'Content passes QC review',
      suggestedCopy: '-',
      confidence: '-',
      status: 'N/A',
    });
    emptyRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6FFE6' }, // Light green
    };
  } else {
    // Add data rows with severity-based coloring
    for (const rowData of allRows) {
      const excelRow = sheet.addRow(rowData);

      // Apply conditional formatting based on severity
      let fillColor: string;
      switch (rowData.section) {
        case 'Critical':
          fillColor = 'FFFEE2E2'; // Light red
          break;
        case 'Important':
          fillColor = 'FFFFFBEB'; // Light yellow
          break;
        case 'Minor':
          fillColor = 'FFEFF6FF'; // Light blue
          break;
        default:
          fillColor = 'FFFFFFFF';
      }

      excelRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: fillColor },
      };

      // Wrap text for long content columns
      excelRow.alignment = { vertical: 'top', wrapText: true };
    }
  }

  // Add borders to all cells
  const totalRows = sheet.rowCount;
  for (let r = 1; r <= totalRows; r++) {
    const row = sheet.getRow(r);
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      };
    });
  }

  // --- Summary Sheet ---
  const summarySheet = workbook.addWorksheet('Summary');

  summarySheet.columns = [
    { header: 'Metric', key: 'metric', width: 30 },
    { header: 'Value', key: 'value', width: 60 },
  ];

  const summaryHeaderRow = summarySheet.getRow(1);
  summaryHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  summaryHeaderRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF2D3748' },
  };

  summarySheet.addRow({ metric: 'Grade', value: result.grade });
  summarySheet.addRow({ metric: 'Summary', value: result.summary });
  summarySheet.addRow({ metric: 'Critical Issues', value: result.criticalIssues.length });
  summarySheet.addRow({ metric: 'Important Issues', value: result.importantIssues.length });
  summarySheet.addRow({ metric: 'Minor Issues', value: result.minorIssues.length });
  summarySheet.addRow({ metric: 'Total Issues', value: allRows.length });
  summarySheet.addRow({ metric: '', value: '' });
  summarySheet.addRow({ metric: 'Positioning Stress Test', value: result.positioningStressTest });
  summarySheet.addRow({ metric: 'Bunny Detection', value: result.bunnyDetection });
  summarySheet.addRow({ metric: 'Brand Essence Tone Check', value: result.brandEssenceToneCheck });
  summarySheet.addRow({ metric: 'Data Provenance Audit', value: result.dataProvenanceAudit });
  summarySheet.addRow({ metric: 'Overall Assessment', value: result.overallAssessment });

  // Wrap text on summary sheet
  for (let r = 2; r <= summarySheet.rowCount; r++) {
    summarySheet.getRow(r).alignment = { vertical: 'top', wrapText: true };
  }

  // Write to buffer
  const arrayBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
}
