import type { CodeLine, AnalysisRecord } from "@/types";

export const DEMO_CODE_LINES: CodeLine[] = [
  { text: "Error: Cannot read property 'map' of undefined", type: "error", delay: 0 },
  { text: "    at UserList.render (src/components/UserList.tsx:24:18)", type: "trace", delay: 0.1 },
  { text: "    at processChild (node_modules/react-dom/cjs/...)", type: "trace", delay: 0.2 },
  { text: "    at resolveChildren (node_modules/react-dom/cjs/...)", type: "trace", delay: 0.3 },
  { text: "", type: "empty", delay: 0.5 },
  { text: "✓ Analyzing stack trace...", type: "step", delay: 1.0 },
  { text: "✓ Found: src/components/UserList.tsx:24", type: "success", delay: 1.5 },
  { text: "✓ AI generated fix", type: "success", delay: 2.0 },
  { text: "✓ Created branch: fix/userlist-map-undefined", type: "success", delay: 2.5 },
  { text: "✓ Pull Request #42 created!", type: "success", delay: 3.0 },
  { text: "", type: "empty", delay: 3.2 },
  { text: "→ https://github.com/acme/app/pull/42", type: "link", delay: 3.5 },
];

export const MOCK_HISTORY: AnalysisRecord[] = [
  {
    id: "1",
    repo: "acme/api-server",
    branch: "fix/null-pointer-123",
    prUrl: "https://github.com/acme/api-server/pull/42",
    status: "success",
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    summary: "Fixed NullPointerException in UserService.getUser()",
  },
  {
    id: "2",
    repo: "acme/web-client",
    branch: "fix/undefined-map-456",
    prUrl: "https://github.com/acme/web-client/pull/18",
    status: "success",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    summary: "Fixed TypeError: Cannot read property 'map' of undefined",
  },
];

