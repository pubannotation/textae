---
name: dev-server-playwright-check
description: Start the TextAE development server and verify runtime behavior with Playwright MCP. Use this skill when asked to confirm that local development pages are up, reproduce UI behavior via browser actions, or collect browser console/runtime errors after interactive operations.
---

# Dev Server Playwright Check

Use this workflow to prove local startup and reproduce browser-side issues in a deterministic way.

## Standard Workflow

1. Start the dev server in the repository root.
2. Open the target page with Playwright MCP.
3. Execute the user-requested UI operations.
4. Capture page status and console errors.
5. Stop the server process.

## Commands And Targets

- Start server: `npm run dev:server`
- Primary check page: `http://localhost:3001/dev/development.html`
- Optional health check if Playwright is unavailable:
  - `curl -I -sS http://localhost:3001/dev/development.html | head -n 1`

## Playwright MCP Procedure

1. Navigate to the check page with `browser_navigate`.
2. Confirm load success from:
   - returned page URL
   - visible UI snapshot
3. Perform requested interactions with `browser_click`, `browser_fill_form`, `browser_type`, `browser_press_key`, or `browser_run_code`.
4. Read browser errors via `browser_console_messages` with `level: "error"`.
5. Report whether behavior is reproduced and include key error stack lines.

## Failure Handling

- If `browser_navigate` times out, confirm server response with `curl` before concluding failure.
- If Playwright MCP is unavailable but server responds `200`, report:
  - server startup is confirmed
  - Playwright-level verification is blocked by MCP state
- If `npm` cache permission errors appear, run command with temporary cache:
  - `npm_config_cache=/tmp/.npm-cache <command>`

## Output Checklist

- Command used to start server
- Target URL tested
- Reproduction result for each requested behavior
- Console error summary (if any)
- Confirmation that server was stopped (`Ctrl+C`)
