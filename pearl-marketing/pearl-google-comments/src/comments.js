import { google } from "googleapis";
import { getAuthClient } from "./auth.js";

function shapeReply(r) {
  return {
    id: r.id,
    author: r.author?.displayName ?? null,
    createdTime: r.createdTime,
    modifiedTime: r.modifiedTime,
    action: r.action ?? null,
    content: r.content ?? "",
    deleted: r.deleted ?? false,
  };
}

function shapeComment(c) {
  return {
    id: c.id,
    author: c.author?.displayName ?? null,
    createdTime: c.createdTime,
    modifiedTime: c.modifiedTime,
    resolved: c.resolved ?? false,
    deleted: c.deleted ?? false,
    quotedFileContent: c.quotedFileContent?.value ?? null,
    anchor: c.anchor ?? null,
    content: c.content ?? "",
    replies: (c.replies ?? []).map(shapeReply),
  };
}

export async function createReply(fileId, commentId, content) {
  if (!content) throw new Error("content is required");
  const auth = await getAuthClient();
  const drive = google.drive({ version: "v3", auth });
  const { data } = await drive.replies.create({
    fileId,
    commentId,
    fields: "id,createdTime,content",
    requestBody: { content },
  });
  return data;
}

export async function deleteComment(fileId, commentId) {
  const auth = await getAuthClient();
  const drive = google.drive({ version: "v3", auth });
  await drive.comments.delete({ fileId, commentId });
}

export async function createComment(fileId, { quotedFileContent, content }) {
  if (!content) throw new Error("content is required");
  const auth = await getAuthClient();
  const drive = google.drive({ version: "v3", auth });
  const requestBody = { content };
  if (quotedFileContent) {
    requestBody.quotedFileContent = { value: quotedFileContent };
  }
  const { data } = await drive.comments.create({
    fileId,
    fields: "id,createdTime,quotedFileContent,content",
    requestBody,
  });
  return data;
}

export async function fetchComments(fileId, { includeDeleted = false } = {}) {
  const auth = await getAuthClient();
  const drive = google.drive({ version: "v3", auth });

  const all = [];
  let pageToken;
  do {
    const { data } = await drive.comments.list({
      fileId,
      fields: "comments(id,author/displayName,createdTime,modifiedTime,resolved,deleted,quotedFileContent,anchor,content,replies(id,author/displayName,createdTime,modifiedTime,action,content,deleted)),nextPageToken",
      pageSize: 100,
      includeDeleted,
      pageToken,
    });
    for (const c of data.comments ?? []) all.push(shapeComment(c));
    pageToken = data.nextPageToken;
  } while (pageToken);

  return all;
}
