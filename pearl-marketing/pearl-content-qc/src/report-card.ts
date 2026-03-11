import { QCResult, QCIssue } from './qc-runner';

// --- Helpers ---

function formatIssue(issue: QCIssue, index: number): string {
  const lines: string[] = [];
  lines.push(`${index + 1}. [${issue.confidence}] [${issue.category}]`);
  if (issue.originalText) {
    lines.push(`   Original: "${issue.originalText}"`);
  }
  lines.push(`   Issue: ${issue.issue}`);
  if (issue.suggestedFix) {
    lines.push(`   Fix: ${issue.suggestedFix}`);
  }
  return lines.join('\n');
}

function formatIssueMarkdown(issue: QCIssue, index: number): string {
  const lines: string[] = [];
  lines.push(`${index + 1}. **[${issue.confidence}]** \`${issue.category}\``);
  if (issue.originalText) {
    lines.push(`   > "${issue.originalText}"`);
  }
  lines.push(`   - **Issue:** ${issue.issue}`);
  if (issue.suggestedFix) {
    lines.push(`   - **Fix:** ${issue.suggestedFix}`);
  }
  return lines.join('\n');
}

function gradeEmoji(grade: string): string {
  switch (grade) {
    case 'A': return '[PASS]';
    case 'B': return '[GOOD]';
    case 'C': return '[FAIR]';
    case 'D': return '[WARN]';
    case 'F': return '[FAIL]';
    default: return '';
  }
}

// --- Public API ---

/**
 * Generate a plain text report card suitable for Slack or terminal output.
 */
export function generateReportCard(result: QCResult): string {
  const lines: string[] = [];

  // Header
  lines.push('='.repeat(60));
  lines.push(`  PEARL CONTENT QC REPORT CARD`);
  lines.push(`  Grade: ${result.grade} ${gradeEmoji(result.grade)}`);
  lines.push('='.repeat(60));
  lines.push('');

  // Summary
  lines.push('SUMMARY');
  lines.push('-'.repeat(40));
  lines.push(result.summary);
  lines.push('');

  // Issue counts
  lines.push('ISSUE COUNTS');
  lines.push('-'.repeat(40));
  lines.push(`  Critical: ${result.criticalIssues.length}`);
  lines.push(`  Important: ${result.importantIssues.length}`);
  lines.push(`  Minor: ${result.minorIssues.length}`);
  lines.push('');

  // Critical issues
  if (result.criticalIssues.length > 0) {
    lines.push('CRITICAL ISSUES (must fix before publishing)');
    lines.push('-'.repeat(40));
    result.criticalIssues.forEach((issue, i) => {
      lines.push(formatIssue(issue, i));
      lines.push('');
    });
  }

  // Important issues
  if (result.importantIssues.length > 0) {
    lines.push('IMPORTANT ISSUES (should fix)');
    lines.push('-'.repeat(40));
    result.importantIssues.forEach((issue, i) => {
      lines.push(formatIssue(issue, i));
      lines.push('');
    });
  }

  // Minor issues
  if (result.minorIssues.length > 0) {
    lines.push('MINOR ISSUES (nice to fix)');
    lines.push('-'.repeat(40));
    result.minorIssues.forEach((issue, i) => {
      lines.push(formatIssue(issue, i));
      lines.push('');
    });
  }

  // Positioning stress test
  if (result.positioningStressTest) {
    lines.push('POSITIONING STRESS TEST');
    lines.push('-'.repeat(40));
    lines.push(result.positioningStressTest);
    lines.push('');
  }

  // Bunny detection
  if (result.bunnyDetection) {
    lines.push('BUNNY DETECTION TEST');
    lines.push('-'.repeat(40));
    lines.push(result.bunnyDetection);
    lines.push('');
  }

  // Brand essence tone check
  if (result.brandEssenceToneCheck) {
    lines.push('BRAND ESSENCE TONE CHECK');
    lines.push('-'.repeat(40));
    lines.push(result.brandEssenceToneCheck);
    lines.push('');
  }

  // Data provenance audit
  if (result.dataProvenanceAudit) {
    lines.push('DATA PROVENANCE AUDIT');
    lines.push('-'.repeat(40));
    lines.push(result.dataProvenanceAudit);
    lines.push('');
  }

  // Overall assessment
  if (result.overallAssessment) {
    lines.push('OVERALL POSITIONING ASSESSMENT');
    lines.push('-'.repeat(40));
    lines.push(result.overallAssessment);
    lines.push('');
  }

  lines.push('='.repeat(60));
  return lines.join('\n');
}

/**
 * Generate a markdown report card suitable for Google Docs or rich display.
 */
export function generateReportCardMarkdown(result: QCResult): string {
  const lines: string[] = [];

  // Header
  lines.push(`# Pearl Content QC Report Card`);
  lines.push('');
  lines.push(`**Grade: ${result.grade}** ${gradeEmoji(result.grade)}`);
  lines.push('');

  // Summary
  lines.push('## Summary');
  lines.push('');
  lines.push(result.summary);
  lines.push('');

  // Issue counts
  lines.push('## Issue Counts');
  lines.push('');
  lines.push(`| Severity | Count |`);
  lines.push(`|----------|-------|`);
  lines.push(`| Critical | ${result.criticalIssues.length} |`);
  lines.push(`| Important | ${result.importantIssues.length} |`);
  lines.push(`| Minor | ${result.minorIssues.length} |`);
  lines.push('');

  // Critical issues
  if (result.criticalIssues.length > 0) {
    lines.push('## Critical Issues (must fix before publishing)');
    lines.push('');
    result.criticalIssues.forEach((issue, i) => {
      lines.push(formatIssueMarkdown(issue, i));
      lines.push('');
    });
  }

  // Important issues
  if (result.importantIssues.length > 0) {
    lines.push('## Important Issues (should fix)');
    lines.push('');
    result.importantIssues.forEach((issue, i) => {
      lines.push(formatIssueMarkdown(issue, i));
      lines.push('');
    });
  }

  // Minor issues
  if (result.minorIssues.length > 0) {
    lines.push('## Minor Issues (nice to fix)');
    lines.push('');
    result.minorIssues.forEach((issue, i) => {
      lines.push(formatIssueMarkdown(issue, i));
      lines.push('');
    });
  }

  // Positioning stress test
  if (result.positioningStressTest) {
    lines.push('## Positioning Stress Test');
    lines.push('');
    lines.push(result.positioningStressTest);
    lines.push('');
  }

  // Bunny detection
  if (result.bunnyDetection) {
    lines.push('## Bunny Detection Test');
    lines.push('');
    lines.push(result.bunnyDetection);
    lines.push('');
  }

  // Brand essence tone check
  if (result.brandEssenceToneCheck) {
    lines.push('## Brand Essence Tone Check');
    lines.push('');
    lines.push(result.brandEssenceToneCheck);
    lines.push('');
  }

  // Data provenance audit
  if (result.dataProvenanceAudit) {
    lines.push('## Data Provenance Audit');
    lines.push('');
    lines.push(result.dataProvenanceAudit);
    lines.push('');
  }

  // Overall assessment
  if (result.overallAssessment) {
    lines.push('## Overall Positioning Assessment');
    lines.push('');
    lines.push(result.overallAssessment);
    lines.push('');
  }

  return lines.join('\n');
}
