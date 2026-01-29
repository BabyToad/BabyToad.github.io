interface Env {
  TASKS_KV: KVNamespace;
  PASSWORD_HASH: string;
  JWT_SECRET: string;
  ASSETS: Fetcher;
}

const TASKS_KEY = "tasks.md";
const TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

// Simple JWT implementation for Workers
async function createToken(secret: string): Promise<string> {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({
    exp: Date.now() + TOKEN_EXPIRY,
    iat: Date.now()
  }));
  const data = `${header}.${payload}`;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data)
  );

  const sig = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");

  return `${data}.${sig}`;
}

async function verifyToken(token: string, secret: string): Promise<boolean> {
  try {
    const [header, payload, signature] = token.split(".");
    if (!header || !payload || !signature) return false;

    const data = `${header}.${payload}`;
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    // Restore base64 padding
    const sig = signature.replace(/-/g, "+").replace(/_/g, "/");
    const sigBytes = Uint8Array.from(atob(sig), c => c.charCodeAt(0));

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      new TextEncoder().encode(data)
    );

    if (!valid) return false;

    const payloadData = JSON.parse(atob(payload));
    return payloadData.exp > Date.now();
  } catch {
    return false;
  }
}

// Simple password verification (compare with stored hash)
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex === hash;
}

function getTokenFromRequest(request: Request): string | null {
  // Check Authorization header
  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  // Check cookie
  const cookies = request.headers.get("Cookie") || "";
  const match = cookies.match(/token=([^;]+)/);
  return match ? match[1] : null;
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers for API
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
      });
    }

    // API routes
    if (path.startsWith("/api/")) {
      return handleAPI(request, env, path);
    }

    // Serve static assets via ASSETS binding
    return env.ASSETS.fetch(request);
  }
};

async function handleAPI(request: Request, env: Env, path: string): Promise<Response> {
  // Public routes
  if (path === "/api/login" && request.method === "POST") {
    try {
      const { password } = await request.json() as { password: string };
      const valid = await verifyPassword(password, env.PASSWORD_HASH);

      if (!valid) {
        return jsonResponse({ error: "Invalid password" }, 401);
      }

      const token = await createToken(env.JWT_SECRET);

      return new Response(JSON.stringify({ success: true }), {
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`
        }
      });
    } catch {
      return jsonResponse({ error: "Invalid request" }, 400);
    }
  }

  if (path === "/api/logout" && request.method === "POST") {
    return new Response(JSON.stringify({ success: true }), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": "token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0"
      }
    });
  }

  // Check auth for other API routes
  const token = getTokenFromRequest(request);
  if (!token || !(await verifyToken(token, env.JWT_SECRET))) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  // GET /api/tasks - Get tasks content
  if (path === "/api/tasks" && request.method === "GET") {
    const content = await env.TASKS_KV.get(TASKS_KEY) || getDefaultTasks();
    const metadata = await env.TASKS_KV.getWithMetadata(TASKS_KEY);
    return jsonResponse({
      content,
      updatedAt: (metadata.metadata as { updatedAt?: string })?.updatedAt || null
    });
  }

  // PUT /api/tasks - Update tasks content
  if (path === "/api/tasks" && request.method === "PUT") {
    try {
      const { content } = await request.json() as { content: string };
      const updatedAt = new Date().toISOString();
      await env.TASKS_KV.put(TASKS_KEY, content, {
        metadata: { updatedAt }
      });
      return jsonResponse({ success: true, updatedAt });
    } catch {
      return jsonResponse({ error: "Invalid request" }, 400);
    }
  }

  // POST /api/tasks/add - Quick add a task
  if (path === "/api/tasks/add" && request.method === "POST") {
    try {
      const { task } = await request.json() as { task: string };
      let content = await env.TASKS_KV.get(TASKS_KEY) || getDefaultTasks();

      // Add to Inbox section (handle different line endings)
      const inboxMatch = content.match(/## Inbox\r?\n/);
      if (inboxMatch && inboxMatch.index !== undefined) {
        const insertPos = inboxMatch.index + inboxMatch[0].length;
        content = content.slice(0, insertPos) + `- [ ] ${task}\n` + content.slice(insertPos);
      } else {
        // Fallback: insert after first heading
        const headingMatch = content.match(/^# .+\r?\n/m);
        if (headingMatch && headingMatch.index !== undefined) {
          const insertPos = headingMatch.index + headingMatch[0].length;
          content = content.slice(0, insertPos) + `\n## Inbox\n- [ ] ${task}\n` + content.slice(insertPos);
        } else {
          content = `# Tasks\n\n## Inbox\n- [ ] ${task}\n` + content;
        }
      }

      const updatedAt = new Date().toISOString();
      await env.TASKS_KV.put(TASKS_KEY, content, {
        metadata: { updatedAt }
      });
      return jsonResponse({ success: true, updatedAt });
    } catch {
      return jsonResponse({ error: "Invalid request" }, 400);
    }
  }

  // POST /api/tasks/toggle - Toggle a checkbox
  if (path === "/api/tasks/toggle" && request.method === "POST") {
    try {
      const { lineIndex } = await request.json() as { lineIndex: number };
      let content = await env.TASKS_KV.get(TASKS_KEY) || getDefaultTasks();
      const lines = content.split("\n");

      if (lineIndex >= 0 && lineIndex < lines.length) {
        const line = lines[lineIndex];
        if (line.includes("- [ ]")) {
          lines[lineIndex] = line.replace("- [ ]", "- [x]");
        } else if (line.includes("- [x]")) {
          lines[lineIndex] = line.replace("- [x]", "- [ ]");
        }
        content = lines.join("\n");

        const updatedAt = new Date().toISOString();
        await env.TASKS_KV.put(TASKS_KEY, content, {
          metadata: { updatedAt }
        });
      }

      return jsonResponse({ success: true });
    } catch {
      return jsonResponse({ error: "Invalid request" }, 400);
    }
  }

  return jsonResponse({ error: "Not found" }, 404);
}

function getDefaultTasks(): string {
  return `# Tasks

## Inbox
- [ ] Add your first task here

## Today


## This Week


## Someday


## Waiting

`;
}
