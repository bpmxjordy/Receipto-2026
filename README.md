# Receipto

iOS app that digitises paper receipts, auto-categorises items, and shows
your spending and CO₂ footprint. Solo build by Jordan Cartwright.

The full build plan lives in [`PLAN.md`](./PLAN.md). The status snapshot
at the top of that file says where we are.

## Repo layout

```
apps/
  mobile/      # Expo (React Native) app
  web/         # Next.js site on Vercel (privacy, terms, admin tools)
packages/
  shared/      # types + normalise() shared across mobile, web, functions
firebase/
  functions/   # Cloud Functions (TypeScript)
  ...          # rules, indexes, seed scripts
scripts/       # one-off utilities
Starting point/  # original deck + design refs
```

## How to run

> Filled in as we build. See `PLAN.md` Phase 0 for the current state.

Prerequisites:

- Node 20+
- pnpm 10+
- Firebase CLI (`npm i -g firebase-tools`)
- (Phase 4+) Xcode on a Mac, an iPhone

Quick commands:

```bash
pnpm install         # install all workspace deps
pnpm typecheck       # TS check across the workspace
pnpm lint            # ESLint across the workspace
```

## License

Private. All rights reserved.
