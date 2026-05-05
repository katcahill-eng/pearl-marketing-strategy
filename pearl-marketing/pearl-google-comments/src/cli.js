#!/usr/bin/env node
import { fetchComments } from "./comments.js";

const fileId = process.argv[2];
if (!fileId) {
  console.error("Usage: node src/cli.js <fileId>");
  process.exit(2);
}

const comments = await fetchComments(fileId);
console.log(JSON.stringify({ fileId, count: comments.length, comments }, null, 2));
