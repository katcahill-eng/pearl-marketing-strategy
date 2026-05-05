#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { fetchComments, createComment } from "./comments.js";

const server = new Server(
  { name: "pearl-google-comments", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

const TOOLS = [
  {
    name: "read_doc_comments",
    description:
      "Read all comments (and threaded replies) on a Google Drive file — Doc, Sheet, Slide, or any file with comments. Pass the file ID from the URL (the long string between /d/ and /edit).",
    inputSchema: {
      type: "object",
      properties: {
        fileId: {
          type: "string",
          description: "Google Drive file ID.",
        },
        includeDeleted: {
          type: "boolean",
          description: "Include deleted comments. Default false.",
          default: false,
        },
      },
      required: ["fileId"],
    },
  },
  {
    name: "create_doc_comment",
    description:
      "Create a comment on a Google Drive file. If quotedFileContent is provided, the comment is anchored to that text in the doc (the first match). Use this to leave proposed-edit suggestions next to the original text.",
    inputSchema: {
      type: "object",
      properties: {
        fileId: { type: "string", description: "Google Drive file ID." },
        content: { type: "string", description: "Comment body." },
        quotedFileContent: {
          type: "string",
          description: "Optional. Exact text in the doc to anchor the comment to.",
        },
      },
      required: ["fileId", "content"],
    },
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const args = req.params.arguments ?? {};
  if (req.params.name === "read_doc_comments") {
    if (!args.fileId) throw new Error("fileId is required");
    const comments = await fetchComments(args.fileId, { includeDeleted: args.includeDeleted });
    return {
      content: [
        { type: "text", text: JSON.stringify({ fileId: args.fileId, count: comments.length, comments }, null, 2) },
      ],
    };
  }
  if (req.params.name === "create_doc_comment") {
    if (!args.fileId) throw new Error("fileId is required");
    if (!args.content) throw new Error("content is required");
    const created = await createComment(args.fileId, {
      quotedFileContent: args.quotedFileContent,
      content: args.content,
    });
    return {
      content: [{ type: "text", text: JSON.stringify(created, null, 2) }],
    };
  }
  throw new Error(`Unknown tool: ${req.params.name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
