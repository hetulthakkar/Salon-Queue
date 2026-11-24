# User Flows, Business Rules & Test Checklist

## 1. Core User Flows

### Flow A: Remote Customer Joining & Getting Served
1. Customer opens `/` on phone, sees `4 people waiting (~35 min)`, taps **Join Queue**.
2. Enters Name + 10-digit Phone, selects `Haircut (30m)` + `Beard Trim (15m)`, chooses `Any Barber (Fastest)`, taps **Confirm**.
3. System assigns token `S-10` with status `Waiting` and opens `/status/S-10`.
4. As customers ahead finish, `S-10` moves up. At position #2, banner changes to `"Start coming to the salon"`.
5. Barber Amit finishes his customer; Receptionist (or Amit) taps **Call Next**.
6. `S-10` becomes `Called` assigned to `Amit`. Customer's phone triggers full-screen gold `"It's your turn! Go to Amit"`, and TV flashes `S-10`.
7. Customer sits down; Amit taps **Start Service** (`In Chair`).
8. Haircut finishes; Amit taps **Mark Done** (`Done`). `S-10` exits active queue and increments `Served Today`.

### Flow B: Walk-In Customer
1. Customer walks in without a smartphone.
2. Receptionist taps **+ Add Walk-in** on `/reception`, enters details, and submits.
3. Walk-in customer receives the next sequential token and joins the exact same FIFO queue at the end.

---

## 2. Queue Statuses & Allowed Transitions
- `Waiting` -> `Called` (via Reception or Barber "Call Next")
- `Waiting` -> `Cancelled` (via Customer "Cancel My Spot" or Reception "Cancel")
- `Called` -> `In Chair` (via Barber "Start Service")
- `Called` -> `No-Show` (via Reception "No-Show" if customer doesn't arrive within 10 mins)
- `In Chair` -> `Done` (via Barber "Mark Done")
- **Strict Rule:** Statuses never move backward. `Done`, `Cancelled`, and `No-Show` are terminal states.

---

## 3. Business & Calculation Rules
1. **Next Customer Selection ("Call Next" for Barber $X$):**
   - Scan the `Waiting` list in strict chronological order (earliest `createdAt` first).
   - Pick the **first** customer whose `preferredBarber` is either `$X$` OR `'Any'`.
   - **Hard Constraint:** A customer who specifically selected `Ravi` must NEVER be assigned to `Amit`, even if Amit is idle.
2. **Chair Concurrency:** A barber can only have **one** active customer (`Called` or `In Chair`) at any time.
3. **Estimated Wait Time Formula:**
   - Count active on-duty barbers who are NOT `On Break` (minimum 1 to avoid division by zero).
   - Sum the total service minutes of all `Waiting` customers ahead of the target customer (matching their barber constraint or general pool) + remaining minutes of customers currently `In Chair`.
   - Divide total ahead minutes by the number of active working barbers, rounded to the nearest 5 minutes.
4. **Duplicate Phone Prevention:** Only **one** active queue entry (`Waiting`, `Called`, or `In Chair`) is allowed per 10-digit phone number. Re-submitting the same phone redirects to the existing `/status/:id` page.
5. **No-Show Re-entry:** If a `No-Show` customer returns later, they are NOT restored to their old spot; they must be added as a brand-new token at the **end** of the queue.
6. **Barber On Break:** If a barber toggles `On Break`, customers on `/join` see `"Ravi (On Break)"` and cannot select him for new bookings. Existing customers waiting specifically for Ravi see a notice on `/status/:id` that Ravi is on a short break.
7. **Closing Time Cutoff:** Online joining automatically locks (or can be toggled closed by Owner) 30 minutes before closing time (`8:30 PM`), while Reception walk-ins remain enabled until `9:00 PM`.

---

## 4. Verification Test Checklist
- [ ] **Service Limit & Math:** Selecting 2 services updates total duration and ₹ price accurately; selecting a 4th service is blocked.
- [ ] **Phone Validation & Deduplication:** Invalid (<10 digit) phone shows error; joining twice with the same phone opens the existing token instead of duplicating.
- [ ] **Barber Preference Isolation:** Queue has `S-1 (prefers Ravi)` and `S-2 (Any)`. Clicking **Call Next** for `Amit` skips `S-1` and calls `S-2`.
- [ ] **Real-Time Sync (< 5s):** Calling a token on `/reception` updates `/status/:id` (gold screen) and `/display` (TV flash) within 5 seconds without manual refresh.
- [ ] **Barber Lifecycle:** Tapping `Start Service` -> `Mark Done` on `/barber/:name` frees the barber card on `/reception` and removes the token from TV `Now Serving`.
- [ ] **No-Show & Re-add:** Marking a `Called` token as `No-Show` removes them; re-adding them places a new token at the end of the queue.
- [ ] **Owner Controls:** Toggling off a service on `/admin` hides it on `/join`; closing the online queue disables `[ Join Queue ]` on `/` with a clear closed message.
- [ ] **Bilingual Gujarati Mode:** Toggling `ગુજરાતી` translates all buttons, headers, service names, and status banners cleanly without text overflow.
- [ ] **Dynamic Wait Time:** Completing a customer (`Done`) reduces the estimated wait minutes shown for remaining `Waiting` customers.
- [ ] **Empty State:** When 0 customers are waiting, Home displays `"No one waiting — walk right in!"` and Reception displays `"Queue is clear!"`.