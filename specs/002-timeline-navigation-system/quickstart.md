# Quickstart: Timeline Navigation System

## Prerequisites
- Node.js 22+
- npm 10+

## 1. Install dependencies
```bash
cd /Users/brianandres/Documents/Timeline/frontend
npm install
npx playwright install chromium
```

## 2. Run frontend
```bash
cd /Users/brianandres/Documents/Timeline/frontend
npm run dev -- --host 127.0.0.1 --port 4173
```

Open `http://127.0.0.1:4173`.

## 3. Run verification

Unit and integration timeline tests:
```bash
cd /Users/brianandres/Documents/Timeline/frontend
npm run test -- tests/timeline/*.test.ts
```

Browser interaction tests:
```bash
cd /Users/brianandres/Documents/Timeline/frontend
npm run test:e2e -- tests/timeline/*.spec.ts
```

## 4. Manual validation checklist
1. Drag timeline horizontally left/right and confirm proportional movement.
2. Zoom in/out and confirm resolution transitions (`year/month/day/hour`).
3. Verify zoom preserves focal context around cursor/center anchor.
4. Confirm labels update with resolution and remain readable.
5. Confirm edge fades remain visible and timeline vertical position is stable.

## 5. Scope guardrail check
- Ensure no memories/events/attachments are present in timeline rendering.
- Ensure no backend persistence assumptions are introduced.
