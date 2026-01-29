#!/usr/bin/env node

/**
 * Task Sync Script
 *
 * Syncs Tasks.md between local file and Cloudflare KV.
 * Runs on PC to keep local file updated for Claude Code access.
 *
 * Usage:
 *   node sync/sync.js              # One-time sync
 *   node sync/sync.js --watch      # Watch for changes
 *   node sync/sync.js --pull       # Pull from cloud only
 *   node sync/sync.js --push       # Push to cloud only
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";

// Config - update these or set via environment variables
const CONFIG = {
  localPath: process.env.TASKS_PATH || "C:\\Users\\heink\\Documents\\Exocortex\\Tasks.md",
  workerUrl: process.env.WORKER_URL || "https://tasks.allknivesnobagel.com",
  password: process.env.TASKS_PASSWORD || "GinCQGizke1Vg1Bm",
  syncInterval: parseInt(process.env.SYNC_INTERVAL || "300000", 10), // 5 minutes
};

// State
let authToken = null;
let localLastModified = 0;

async function login() {
  console.log("[Sync] Logging in...");

  const response = await fetch(`${CONFIG.workerUrl}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: CONFIG.password })
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`);
  }

  // Extract token from Set-Cookie header
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) {
    const match = setCookie.match(/token=([^;]+)/);
    if (match) {
      authToken = match[1];
      console.log("[Sync] Login successful");
      return;
    }
  }

  throw new Error("No token in response");
}

async function apiRequest(path, options = {}) {
  if (!authToken) {
    await login();
  }

  const response = await fetch(`${CONFIG.workerUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
      ...options.headers
    }
  });

  if (response.status === 401) {
    // Token expired, re-login
    authToken = null;
    await login();
    return apiRequest(path, options);
  }

  return response;
}

function getLocalContent() {
  try {
    const content = fs.readFileSync(CONFIG.localPath, "utf-8");
    const stats = fs.statSync(CONFIG.localPath);
    localLastModified = stats.mtimeMs;
    return { content, modifiedAt: stats.mtimeMs };
  } catch (e) {
    if (e.code === "ENOENT") {
      return { content: null, modifiedAt: 0 };
    }
    throw e;
  }
}

function writeLocalContent(content) {
  const dir = path.dirname(CONFIG.localPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(CONFIG.localPath, content, "utf-8");
  const stats = fs.statSync(CONFIG.localPath);
  localLastModified = stats.mtimeMs;
  console.log(`[Sync] Wrote local file: ${CONFIG.localPath}`);
}

async function getCloudContent() {
  const response = await apiRequest("/api/tasks");

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }

  const data = await response.json();
  return { content: data.content, updatedAt: data.updatedAt };
}

async function pushToCloud(content) {
  const response = await apiRequest("/api/tasks", {
    method: "PUT",
    body: JSON.stringify({ content })
  });

  if (!response.ok) {
    throw new Error(`Failed to push: ${response.status}`);
  }

  const data = await response.json();
  console.log(`[Sync] Pushed to cloud at ${data.updatedAt}`);
}

async function sync() {
  console.log(`[Sync] Starting sync at ${new Date().toISOString()}`);

  try {
    const local = getLocalContent();
    const cloud = await getCloudContent();

    // If local file doesn't exist, pull from cloud
    if (local.content === null) {
      console.log("[Sync] Local file not found, pulling from cloud");
      if (cloud.content) {
        writeLocalContent(cloud.content);
      }
      return;
    }

    // If cloud is empty/default, push local
    if (!cloud.content || cloud.content.trim() === "") {
      console.log("[Sync] Cloud is empty, pushing local");
      await pushToCloud(local.content);
      return;
    }

    // If content is the same, nothing to do
    if (local.content === cloud.content) {
      console.log("[Sync] Already in sync");
      return;
    }

    // Compare timestamps - prefer newer version
    const cloudTime = cloud.updatedAt ? new Date(cloud.updatedAt).getTime() : 0;
    const localTime = local.modifiedAt;

    if (localTime > cloudTime) {
      console.log("[Sync] Local is newer, pushing to cloud");
      await pushToCloud(local.content);
    } else {
      console.log("[Sync] Cloud is newer, pulling to local");
      writeLocalContent(cloud.content);
    }
  } catch (e) {
    console.error("[Sync] Error:", e.message);
  }
}

async function watchMode() {
  console.log(`[Sync] Starting watch mode`);
  console.log(`[Sync] Local file: ${CONFIG.localPath}`);
  console.log(`[Sync] Cloud: ${CONFIG.workerUrl}`);
  console.log(`[Sync] Sync interval: ${CONFIG.syncInterval / 1000}s`);

  // Initial sync
  await sync();

  // Watch for local file changes
  let debounceTimer = null;
  const dir = path.dirname(CONFIG.localPath);
  const filename = path.basename(CONFIG.localPath);

  fs.watch(dir, async (eventType, changedFile) => {
    if (changedFile === filename) {
      // Debounce rapid changes
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        const stats = fs.statSync(CONFIG.localPath);
        // Only sync if file actually changed (not just our own write)
        if (stats.mtimeMs > localLastModified + 1000) {
          console.log("[Sync] Local file changed, pushing to cloud");
          const local = getLocalContent();
          if (local.content) {
            await pushToCloud(local.content);
          }
        }
      }, 1000);
    }
  });

  // Periodic sync to catch cloud changes
  setInterval(sync, CONFIG.syncInterval);

  console.log("[Sync] Watching for changes... (Ctrl+C to stop)");
}

async function pullOnly() {
  console.log("[Sync] Pulling from cloud...");
  const cloud = await getCloudContent();
  if (cloud.content) {
    writeLocalContent(cloud.content);
  }
  console.log("[Sync] Done");
}

async function pushOnly() {
  console.log("[Sync] Pushing to cloud...");
  const local = getLocalContent();
  if (!local.content) {
    console.error("[Sync] Local file not found");
    process.exit(1);
  }
  await pushToCloud(local.content);
  console.log("[Sync] Done");
}

// CLI
const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
Task Sync - Syncs Tasks.md between local file and Cloudflare

Usage:
  node sync.js              One-time bidirectional sync
  node sync.js --watch      Watch for changes and sync continuously
  node sync.js --pull       Pull from cloud to local only
  node sync.js --push       Push from local to cloud only

Environment variables:
  TASKS_PATH        Path to local Tasks.md
  WORKER_URL        Cloudflare Worker URL
  TASKS_PASSWORD    Dashboard password
  SYNC_INTERVAL     Watch mode sync interval in ms (default: 300000)
`);
  process.exit(0);
}

if (args.includes("--watch") || args.includes("-w")) {
  watchMode();
} else if (args.includes("--pull")) {
  pullOnly();
} else if (args.includes("--push")) {
  pushOnly();
} else {
  sync().then(() => process.exit(0));
}
