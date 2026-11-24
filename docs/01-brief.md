# Salon Queue Management — Project Brief & Scope

## Problem
During peak hours and weekends, walk-in salon customers wait 1 to 2 hours without knowing how many people are ahead of them or when their turn will come. Customers either abandon the shop out of frustration or argue at the counter over queue order.

## Users
1. **Customer (Mobile):** Joins the queue remotely or inside the shop, checks live wait time, and receives a visual/vibration alert when called.
2. **Receptionist (10" Tablet):** Adds walk-in customers, calls the next eligible customer for an available barber, and handles no-shows or cancellations.
3. **Barber (Phone):** Views their active customer, starts/completes haircuts, sees their next queued client, and toggles break availability.
4. **Waiting Area TV (Landscape Screen):** Displays who is currently in each barber's chair and the next 5 upcoming tokens.
5. **Salon Owner (Mobile/Desktop):** Manages active services (duration & pricing), sets which barbers are on duty, opens/closes online queue registration, and monitors daily stats.

## Must-Have Features (MVP)
1. **Self-Service Queue Joining:** Pick up to 3 services, choose a specific barber or "Any Barber (Fastest)", and receive a sequential token (`S-1`, `S-2`...).
2. **Live Status & Alerts:** Real-time queue position, dynamic estimated wait countdown, "Start coming to the salon" alert at position #2, and a full-screen gold "It's your turn!" alert when called.
3. **Smart Receptionist Dashboard:** Split view showing barber chair timers/controls on the left and a live filterable waiting queue on the right with walk-in entry, "Call Next", "No-show", and "Cancel" actions.
4. **Barber Station View:** Focused mobile screen with a live service timer, `Start` -> `Done` workflow, preview of the next assigned customer, and an `Available / On Break` toggle.
5. **Waiting Area TV Display:** High-contrast, 5-meter readable screen showing active barber chairs, next 5 tokens, and a gold highlight flash + audio chime when a new token is called.
6. **Owner Admin Panel:** Toggle services on/off, edit service time/price, toggle barbers on duty, open/close online queue joining, and view today's KPIs (served, avg wait, no-shows).
7. **Bilingual UI (English & Gujarati):** Instant language toggle across all customer and staff screens.

## Don't Build (Strict Out-of-Scope)
- Online payments, UPI integration, or tipping
- Future-date or time-slot appointment booking
- Automated SMS, WhatsApp, or email notifications
- Customer accounts, passwords, or loyalty/reward points
- Multi-branch or multi-salon management

## Look & Feel
Premium modern grooming lounge aesthetic: dark charcoal (`#1F2937`) surfaces with brushed gold (`#D4A017`) accents, high-contrast typography, and mobile-first responsive cards available in English and Gujarati.