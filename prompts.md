# Development Prompt Log

## Step 1: Project Setup & Architecture
> Read AGENTS.md and all files in docs/. Summarise the app in 8 bullets and list any questions or ambiguities. Then set up a React + Vite + Tailwind CSS project with empty placeholder pages for all 7 screens, the dark charcoal (#1F2937) + gold (#D4A017) theme, and a working English/Gujarati language toggle. Also include a vercel.json SPA rewrite rule so refreshing routes never returns 404. Stop once `npm run dev` builds cleanly without errors.

## Step 2: Screen 1 (Home) & Screen 2 (Join Queue)
> Read AGENTS.md and docs/02-screens.md. Build Screen 1 (Home) and Screen 2 (Join Queue) with dummy services and 3 on-duty barbers (Ravi, Amit, Imran). Enforce 10-digit phone validation, duplicate phone detection, and the 3-service limit, with the sticky live summary updating dynamically in both English and Gujarati. Stop once `npm run dev` builds cleanly.
