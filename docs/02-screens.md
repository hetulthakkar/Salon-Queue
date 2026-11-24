# Screens & Features Specification

All screens include a top-right `EN | ગુજરાતી` toggle and a subtle staff navigation switcher (protected by a simple PIN `1234` for `/reception`, `/barber/:name`, and `/admin`).

---

## Screen 1: Home (`/`)
- **Users & Purpose:** Customers arriving at the salon or checking remotely to see current wait times before joining.
- **UI Elements (Top to Bottom):**
  1. **Header:** Salon logo/title ("Aura Grooming Lounge") + live status pill (`Open • Closes 9:00 PM` in green, or `Queue Closed` in red).
  2. **Live Wait Summary Card:** Large gold metric showing current queue load (e.g., `6 people waiting • ~50 min wait`) or `No one waiting — walk right in!` when empty.
  3. **Barbers on Duty Row:** Horizontal cards/chips for active barbers (e.g., Ravi, Amit, Imran) showing avatar, name, and status badge (`Free` in green, `Busy • ~12m left` in gold, `On Break` in gray).
  4. **Primary CTA:** Full-width sticky gold button `[ Join Queue ]` (disabled with explanation banner if online queue is closed).
  5. **Quick Lookup Link:** "Already have a token? Check Status" input/link.
- **Responsive:** Single-column mobile-first (`max-w-md mx-auto`).

---

## Screen 2: Join Queue (`/join`)
- **Users & Purpose:** Customers entering their details and choosing services/barber to get a queue token.
- **UI Elements (Top to Bottom):**
  1. **Back Header:** `<- Back to Home` + screen title.
  2. **Customer Details:** Text input for `Full Name` (required) and numeric input for `Phone Number` (strictly 10 digits, validated).
  3. **Service Selector (Multi-select, max 3):** Tappable cards showing service name (EN/GU), duration, and price in ₹:
     - Haircut (`30 min` • `₹150`)
     - Beard Trim & Styling (`15 min` • `₹80`)
     - Hair Spa (`45 min` • `₹400`)
     - Head Massage (`20 min` • `₹120`)
     - Facial Cleanup (`40 min` • `₹350`)
     *(Shows warning toast if user tries to select a 4th service).*
  4. **Barber Preference:** Radio cards for `Any Barber (Fastest)` (default, highlighted) or individual on-duty barbers (showing if someone is currently `On Break`).
  5. **Sticky Live Summary Footer:** Dynamically calculates `Total: 45 min • ₹230` and `Est. Wait: ~35 min` + gold button `[ Confirm & Get Token ]`.
- **Error/Edge States:** If phone number already has an active token, redirect straight to their existing `/status/:id` screen instead of creating a duplicate.

---

## Screen 3: My Status (`/status/:id`)
- **Users & Purpose:** Customer tracking their live turn from home or the waiting lounge.
- **UI Elements (Top to Bottom):**
  1. **Token Hero Card:** Massive gold token number (`S-14`), customer name, chosen services, and assigned/preferred barber.
  2. **Live Countdown Ring:** Circular progress indicator showing `~35 min` estimated wait and position badge (`4th in line`). Auto-updates without page reload.
  3. **Contextual Status Banners:**
     - **Position #2:** Pulsing amber alert banner: `"You're 2nd in line! Please start heading to the salon."`
     - **Status = `Called`:** Full-screen gold takeover with pulse animation, `navigator.vibrate([300, 150, 300])`, and bold text: `"IT'S YOUR TURN! Please proceed to [Barber Name]'s chair."`
     - **Status = `In Chair`:** Calm card showing `"You are currently with [Barber Name]. Enjoy your service!"`
  4. **Cancel Action:** Secondary outline button `[ Cancel My Spot ]` (visible only while `Waiting`) triggering a confirmation modal (`Yes, Cancel` / `Keep My Spot`).

---

## Screen 4: Reception Dashboard (`/reception`)
- **Users & Purpose:** Front-desk receptionist managing live chairs and walk-in traffic on a 10-inch tablet in landscape.
- **UI Elements:**
  1. **Top Action Bar:** Salon live stats pill (`Waiting: 6 | In Chair: 2 | Served Today: 14`), PIN lock indicator, and prominent gold button `[ + Add Walk-in ]` (opens slide-over/modal with Name, Phone, Services, Barber preference).
  2. **Left Column (40% width — Active Barber Chairs):** 3 stacked cards (one per on-duty barber). Shows barber name, status, current customer (`S-12 • Rahul`), service progress bar / elapsed time, and primary button `[ Call Next ]` (disabled if chair is occupied or no eligible customer is waiting).
  3. **Right Column (60% width — Waiting Queue):** Ordered list of `Waiting` and `Called` customers showing Token, Name, Services, Preferred Barber, and Wait Duration badge (highlighted in **amber** if waiting > 60 min).
     - Row actions: `[ No-Show ]` (enabled when status is `Called`) and `[ Cancel ]`.
- **Empty State:** `"Queue is clear! Ready for walk-ins."`

---

## Screen 5: Barber View (`/barber/:name`)
- **Users & Purpose:** Individual barber on their phone managing their chair without walking to the reception desk.
- **UI Elements (Top to Bottom):**
  1. **Header:** Barber name/photo + prominent status switch (`Available` green / `On Break` amber).
  2. **Active Chair Card:**
     - When `Called` (waiting for customer to sit): Shows token `S-14 • Kunal`, services list, and large gold `[ Start Service ]` button.
     - When `In Chair`: Shows live running timer (`14:22 / 30:00 min`), services checklist, and large green `[ Mark Done ]` button.
     - When `Free`: Shows `"Chair is free"` + `[ Call Next Customer ]` shortcut button.
  3. **Up Next Preview Card:** `"Next eligible for you: S-15 • Dev (Haircut - 30m)"`.

---

## Screen 6: Waiting Area TV (`/display`)
- **Users & Purpose:** Mounted 1080p landscape monitor/TV inside the salon readable from 5 meters away. No interactive clutter.
- **UI Elements:**
  1. **Top Bar:** Salon Name, current clock time, and `"Scan QR or visit [app-url] to join queue"` banner.
  2. **Left Half (Now Serving — Barber Chairs):** Large high-contrast cards per active barber showing Barber Name, `NOW SERVING`, and huge gold Token (`S-12`) + Customer First Name.
  3. **Right Half (Up Next — Next 5 Tokens):** Clean 5-row table displaying `Token`, `Name`, `Barber Pref`, and `Est. Wait`.
  4. **Call Alert Overlay:** Whenever any customer transitions to `Called`, flash a gold highlight border/banner for 8 seconds (`"Token S-14 -> Go to Amit"`) and play a pleasant chime sound (with an initial `"Click to enable TV audio"` button to satisfy browser autoplay rules).

---

## Screen 7: Owner Settings (`/admin`)
- **Users & Purpose:** Salon owner configuring operations and reviewing daily performance.
- **UI Elements:**
  1. **Today's Performance Cards (3-column):** `Customers Served`, `Average Wait Time`, `No-Shows Today`.
  2. **Master Queue Control:** Toggle switch for `Online Queue Joining: OPEN / CLOSED` with helper text explaining walk-ins still work when closed.
  3. **Barbers on Duty:** List of barbers with toggle switches (`On Duty` / `Off Today`).
  4. **Service Catalog Manager:** List of services with inline edit or modal for `Name (EN)`, `Name (GU)`, `Duration (mins)`, `Price (₹)`, and an `Active` toggle switch.