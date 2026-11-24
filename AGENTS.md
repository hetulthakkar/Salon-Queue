# AGENTS.md — Salon Queue Management System

Real-time queue management web app for a barbershop/salon: customers join remotely or as walk-ins, track live wait times, and get notified when called; receptionists, barbers, and the owner manage the queue across devices, synced with a waiting-area TV display.

## Read First
- `docs/01-brief.md` — Problem, target users, MVP features, and strict "Don't Build" boundaries.
- `docs/02-screens.md` — Complete UI layout, components, button actions, and responsive rules for all 7 screens.
- `docs/03-flows-rules.md` — State transitions, queue ordering algorithms, wait-time math, edge cases, and test checklist.

## Tech Stack & Architecture
- **Frontend:** React + Vite + Tailwind CSS (`npm run dev`).
- **Real-Time Sync & Storage:** Choose the simplest persistent storage that keeps separate browser tabs/devices (Phone, Tablet, TV) synced within 5 seconds (e.g., Supabase Realtime / Firebase Firestore, or a lightweight Express + Socket.io/polling backend). Explain your storage choice in 3 lines before implementing.
- **Hosting:** Vercel (frontend); Render or Railway (if a custom backend is used).
- **Submission Rule:** Keep the live deployment URL at the very top of `README.md` right below the title.

## Working Rules
1. **Incremental Scope:** Build strictly one screen or one step per prompt. Do not alter unrelated screens.
2. **Design System:** Dark charcoal (`#1F2937` / `#111827`) background, warm gold (`#D4A017`) accents, crisp white/light-gray typography, and rounded cards (`rounded-xl`). Minimum `44px` tap targets on mobile.
3. **Bilingual Support:** Every visible label, button, status, and alert must come from a centralized `en` / `gu` translation dictionary—no hardcoded UI strings.
4. **Single Source of Truth:** All queue calculations (wait time, next customer selection, token generation) must live in one shared utility module (`src/utils/queueLogic.js`) reused across all views.
5. **Scope Discipline:** Never build anything listed under "Don't Build" in `docs/01-brief.md`.
6. **Post-Task Summary:** After every task, list the exact files created/modified and give 2–3 quick steps to verify the change.