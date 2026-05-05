#!/usr/bin/env node
// Usage: node src/upload-md-as-doc.js <mdPath> <docName> [parentFolderId]
// Uploads a markdown file to Drive with conversion to Google Doc — Drive
// auto-formats headings, bullets, italics, bold, and links from the markdown.
import fs from "node:fs/promises";
import { google } from "googleapis";
import { getAuthClient } from "./auth.js";

const [, , mdPath, docName, parentFolderId] = process.argv;
if (!mdPath || !docName) {
  console.error("Usage: node src/upload-md-as-doc.js <mdPath> <docName> [parentFolderId]");
  process.exit(2);
}

const auth = await getAuthClient();
const drive = google.drive({ version: "v3", auth });
const content = await fs.readFile(mdPath, "utf8");

const { data } = await drive.files.create({
  requestBody: {
    name: docName,
    mimeType: "application/vnd.google-apps.document",
    parents: parentFolderId ? [parentFolderId] : undefined,
  },
  media: { mimeType: "text/markdown", body: content },
  fields: "id, name, webViewLink, parents",
  supportsAllDrives: true,
});

console.log(JSON.stringify(data, null, 2));
