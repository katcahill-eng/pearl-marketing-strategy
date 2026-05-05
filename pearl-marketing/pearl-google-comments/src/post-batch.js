#!/usr/bin/env node
// Usage: node src/post-batch.js <batch.json>
// batch.json shape: [{ fileId, quotedFileContent?, content }, ...]
import fs from "node:fs/promises";
import { createComment } from "./comments.js";

const path = process.argv[2];
if (!path) {
  console.error("Usage: node src/post-batch.js <batch.json>");
  process.exit(2);
}
const items = JSON.parse(await fs.readFile(path, "utf8"));
const results = [];
for (const [i, item] of items.entries()) {
  try {
    const created = await createComment(item.fileId, {
      quotedFileContent: item.quotedFileContent,
      content: item.content,
    });
    results.push({ ok: true, idx: i, fileId: item.fileId, id: created.id });
    console.error(`[${i + 1}/${items.length}] OK ${item.fileId} ${created.id}`);
  } catch (e) {
    results.push({ ok: false, idx: i, fileId: item.fileId, error: e.message });
    console.error(`[${i + 1}/${items.length}] FAIL ${item.fileId}: ${e.message}`);
  }
}
console.log(JSON.stringify(results, null, 2));
