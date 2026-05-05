#!/usr/bin/env node
// Delete all comments authored today by current user that have null anchor (headless).
// Usage: node src/delete-headless.js <fileId> [<fileId>...]
import { fetchComments, deleteComment } from "./comments.js";

const fileIds = process.argv.slice(2);
if (!fileIds.length) {
  console.error("Usage: node src/delete-headless.js <fileId> [<fileId>...]");
  process.exit(2);
}

const today = new Date().toISOString().slice(0, 10);
let total = 0;
for (const fileId of fileIds) {
  const comments = await fetchComments(fileId);
  const headless = comments.filter(
    (c) => !c.anchor && c.createdTime.startsWith(today)
  );
  for (const c of headless) {
    await deleteComment(fileId, c.id);
    console.error(`deleted ${fileId} ${c.id}`);
    total++;
  }
}
console.log(`Deleted ${total} headless comments.`);
