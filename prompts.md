# Development Prompt Log

## Step 1: Project Setup & Architecture
> Read AGENTS.md and all files in docs/. Summarise the app in 8 bullets and list any questions or ambiguities. Then set up a React + Vite + Tailwind CSS project with empty placeholder pages for all 7 screens, the dark charcoal (#1F2937) + gold (#D4A017) theme, and a working English/Gujarati language toggle.
## Step 2 : Screen 1 (Home) & Screen 2 (Join Queue)
> Read AGENTS.md and docs/02-screens.md. Build Screen 1 (Home) and Screen 2 (Join Queue) with dummy services and 3 on-duty barbers (Ravi, Amit, Imran). Enforce 10-digit phone validation, duplicate phone detection, and the 3-service limit, with the sticky live summary updating dynamically in both English and Gujarati. Stop once `npm run dev` builds cleanly.

## Step 3 : Shared Queue State + Screen 3 (My Status)
> Read AGENTS.md, docs/02-screens.md, and docs/03-flows-rules.md. Create the centralized queue logic in src/utils/queueLogic.js and build Screen 3 (My Status) at /status/:id. Generate sequential tokens (S-1, S-2...), calculate estimated wait using the exact formula in docs/03-flows-rules.md, and implement the 'Start coming' banner at #2, the full-screen gold 'It's your turn!' alert with vibration when Called, and the Cancel confirmation modal.

## Step 4 : Screen 4 (Reception Dashboard)
> Read AGENTS.md, docs/02-screens.md, and docs/03-flows-rules.md. Build Screen 4 (Reception Dashboard) at /reception with PIN protection (1234), optimized for a 10-inch tablet in landscape. Include the '+ Add Walk-in' modal, barber chair cards with progress bars and 'Call Next' following the exact barber-preference rules, and the waiting list highlighting anyone waiting over 60 minutes in amber.

## Step 5 : Screen 5 (Barber View) & Screen 6 (Waiting Area TV)
> Read AGENTS.md, docs/02-screens.md, and docs/03-flows-rules.md. Build Screen 5 (Barber View at /barber/:name) and Screen 6 (Waiting Area TV at /display). Ensure Start Service, Mark Done, and On Break updates propagate within 5 seconds across all open views, and trigger the gold flash + chime on /display whenever a new token is called.

## ## Step 6: Screen 7 (Owner Settings) & Full Checklist Audit
> Read AGENTS.md, docs/02-screens.md, and docs/03-flows-rules.md. Build Screen 7 (Owner Settings at /admin) with today's KPI cards, service toggles/editing, barber duty switches, and the online queue open/closed switch. Then run through the entire verification test checklist in docs/03-flows-rules.md, fix any edge cases or Gujarati text overflows, and verify mobile tap targets are at least 44px.