# Task Dashboard

Personal task manager that syncs between Cloudflare (always available) and local file (for Claude Code).

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Edge                          │
│  KV Store ◄──► Worker (Web UI + API)                        │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ https://tasks.yourdomain.com
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   iPhone Safari        Laptop Browser         PC Sync Script
                                                    │
                                              Tasks.md (local)
                                                    │
                                              Claude Code
```

## Setup

### 1. Install dependencies

```bash
cd task-dashboard
npm install
```

### 2. Create Cloudflare KV namespace

```bash
npx wrangler kv:namespace create TASKS_KV
```

Copy the output ID and paste it into `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "TASKS_KV"
id = "YOUR_NAMESPACE_ID_HERE"
```

### 3. Set secrets

Generate a password hash:

```bash
npm run hash-password
# Enter your desired password
# Copy the hash
```

Set the secrets:

```bash
npx wrangler secret put PASSWORD_HASH
# Paste your password hash

npx wrangler secret put JWT_SECRET
# Enter a random string (or use: openssl rand -hex 32)
```

### 4. Deploy

```bash
npm run deploy
```

Your dashboard is now live at: `https://task-dashboard.YOUR_SUBDOMAIN.workers.dev`

### 5. (Optional) Custom domain

In Cloudflare dashboard:
1. Go to Workers & Pages → task-dashboard → Settings → Domains & Routes
2. Add a custom domain like `tasks.allknivesnobagel.com`

### 6. Set up PC sync

Create a `.env` file or set environment variables:

```bash
# Windows (PowerShell)
$env:WORKER_URL = "https://task-dashboard.YOUR_SUBDOMAIN.workers.dev"
$env:TASKS_PATH = "C:\Users\heink\Documents\Exocortex\Tasks.md"
$env:TASKS_AUTH_TOKEN = "your-jwt-token-from-browser"
```

To get the auth token:
1. Log into the dashboard in your browser
2. Open DevTools → Application → Cookies
3. Copy the `token` cookie value

Run the sync:

```bash
# One-time sync
node sync/sync.js

# Watch mode (continuous)
node sync/sync.js --watch
```

### 7. Auto-start sync on boot (Windows)

Create a scheduled task or startup script:

```powershell
# Create startup script
$script = @"
cd "H:\Personal Projects\BabyToad.github.io\task-dashboard"
$env:WORKER_URL = "https://task-dashboard.YOUR_SUBDOMAIN.workers.dev"
$env:TASKS_AUTH_TOKEN = "your-token"
node sync/sync.js --watch
"@

$script | Out-File "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\task-sync.ps1"
```

## Usage

### Web UI

- **Quick add**: Type in the input at top, press Enter
- **Toggle task**: Click the checkbox
- **Edit mode**: Click ✎ button or press `Ctrl+E`
- **Save**: Click Save or press `Ctrl+S`
- **Refresh**: Click ↻ button

### API

All endpoints require authentication via Bearer token or cookie.

```bash
# Get tasks
curl -H "Authorization: Bearer $TOKEN" https://your-worker/api/tasks

# Update tasks
curl -X PUT -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "# Tasks\n\n## Inbox\n- [ ] New task"}' \
  https://your-worker/api/tasks

# Quick add
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"task": "New task"}' \
  https://your-worker/api/tasks/add

# Toggle checkbox
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"lineIndex": 5}' \
  https://your-worker/api/tasks/toggle
```

### Claude Code

Claude Code can directly edit `C:\Users\heink\Documents\Exocortex\Tasks.md`.

The sync script will push changes to the cloud when it detects local modifications.

## File Format

```markdown
# Tasks

## Inbox
- [ ] Uncompleted task
- [x] Completed task

## Today
- [ ] Today's tasks

## This Week
- [ ] Weekly tasks

## Someday
- [ ] Future tasks

## Waiting
- [ ] Blocked tasks
```

## Development

```bash
# Local dev server
npm run dev

# Deploy to production
npm run deploy
```

## Troubleshooting

**401 Unauthorized on sync**
- Token expired. Re-login to the web UI and copy the new token from cookies.

**Sync conflicts**
- The sync script uses timestamps. Newer version wins.
- If in doubt, the cloud version is preserved.

**Local file not updating**
- Check that the sync script is running
- Verify TASKS_PATH environment variable is correct
