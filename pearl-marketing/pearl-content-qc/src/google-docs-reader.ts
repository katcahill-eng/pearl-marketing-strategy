import { google } from 'googleapis';

// --- Helpers ---

/**
 * Extract a Google Docs document ID from a URL or return the input as-is if it's already an ID.
 * Supports URLs like:
 *   - https://docs.google.com/document/d/DOCUMENT_ID/edit
 *   - https://docs.google.com/document/d/DOCUMENT_ID
 *   - Just the raw document ID
 */
function extractDocumentId(urlOrId: string): string {
  const trimmed = urlOrId.trim();

  // Try to extract from URL
  const urlMatch = trimmed.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (urlMatch) {
    return urlMatch[1];
  }

  // If it looks like a URL but we couldn't extract the ID, throw
  if (trimmed.startsWith('http')) {
    throw new Error(`Could not extract document ID from URL: ${trimmed}`);
  }

  // Assume it's a raw document ID
  return trimmed;
}

/**
 * Authenticate with Google APIs using a service account.
 * Reads credentials from the GOOGLE_SERVICE_ACCOUNT_JSON environment variable.
 */
function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw || raw === 'undefined') {
    throw new Error(
      'GOOGLE_SERVICE_ACCOUNT_JSON environment variable is required. ' +
      'Set it to the full JSON contents of your service account key file.'
    );
  }

  let credentials: Record<string, unknown>;
  try {
    credentials = JSON.parse(raw);
  } catch {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON.');
  }

  if (!credentials.client_email) {
    throw new Error('Service account JSON is missing the client_email field.');
  }

  return google.auth.fromJSON({
    ...credentials,
    scopes: ['https://www.googleapis.com/auth/documents.readonly'],
  });
}

/**
 * Recursively extract text from a Google Docs structural element.
 * Handles paragraphs, tables, and lists.
 */
function extractTextFromElement(element: Record<string, unknown>): string {
  const parts: string[] = [];

  // Handle paragraph elements
  if (element.paragraph) {
    const paragraph = element.paragraph as Record<string, unknown>;
    const elements = paragraph.elements as Array<Record<string, unknown>> | undefined;
    if (elements) {
      for (const el of elements) {
        const textRun = el.textRun as Record<string, unknown> | undefined;
        if (textRun && typeof textRun.content === 'string') {
          parts.push(textRun.content);
        }
      }
    }
  }

  // Handle table elements
  if (element.table) {
    const table = element.table as Record<string, unknown>;
    const tableRows = table.tableRows as Array<Record<string, unknown>> | undefined;
    if (tableRows) {
      for (const row of tableRows) {
        const cells = row.tableCells as Array<Record<string, unknown>> | undefined;
        if (cells) {
          const cellTexts: string[] = [];
          for (const cell of cells) {
            const content = cell.content as Array<Record<string, unknown>> | undefined;
            if (content) {
              const cellText = content.map((el) => extractTextFromElement(el)).join('');
              cellTexts.push(cellText.trim());
            }
          }
          parts.push(cellTexts.join(' | '));
          parts.push('\n');
        }
      }
    }
  }

  // Handle table of contents
  if (element.tableOfContents) {
    const toc = element.tableOfContents as Record<string, unknown>;
    const content = toc.content as Array<Record<string, unknown>> | undefined;
    if (content) {
      for (const el of content) {
        parts.push(extractTextFromElement(el));
      }
    }
  }

  return parts.join('');
}

// --- Public API ---

/**
 * Read a Google Doc and return its content as plain text.
 *
 * @param urlOrId — A Google Docs URL or document ID
 * @returns The document's text content
 *
 * Requires GOOGLE_SERVICE_ACCOUNT_JSON environment variable.
 * The service account must have read access to the document.
 */
export async function readGoogleDoc(urlOrId: string): Promise<string> {
  const documentId = extractDocumentId(urlOrId);
  const auth = getAuth();

  const docs = google.docs({ version: 'v1', auth: auth as any });

  const response = await docs.documents.get({
    documentId,
  });

  const document = response.data;

  if (!document.body?.content) {
    return '';
  }

  const textParts: string[] = [];
  for (const element of document.body.content) {
    const text = extractTextFromElement(element as Record<string, unknown>);
    if (text) {
      textParts.push(text);
    }
  }

  return textParts.join('').trim();
}
