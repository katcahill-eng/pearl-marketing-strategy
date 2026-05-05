import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { OAuth2Client } from "google-auth-library";

const TOKEN_PATH =
  process.env.GOOGLE_WORKSPACE_MCP_TOKEN_PATH ||
  path.join(
    process.env.XDG_CONFIG_HOME || path.join(os.homedir(), ".config"),
    "google-workspace-mcp",
    "tokens.json"
  );

async function readTokens() {
  const raw = await fs.readFile(TOKEN_PATH, "utf8");
  return JSON.parse(raw);
}

async function writeTokens(tokens) {
  await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens, null, 2) + "\n", {
    mode: 0o600,
  });
}

export async function getAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error(
      "GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set (same values used by @dguido/google-workspace-mcp)."
    );
  }

  const tokens = await readTokens();
  const client = new OAuth2Client({ clientId, clientSecret });
  client.setCredentials(tokens);

  client.on("tokens", async (next) => {
    const merged = { ...tokens, ...next };
    try {
      await writeTokens(merged);
    } catch {
      // best-effort; don't fail the request if we can't persist
    }
  });

  return client;
}
