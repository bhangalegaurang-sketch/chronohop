# ChronoHop Price Gate Prototype

A high-fidelity, clickable front-end prototype of the **ChronoHop Price Gate** built with **Vite, React, TypeScript, Tailwind CSS, and Zustand**.

ChronoHop is a fictional startup that sells guided time-travel trips. This prototype demonstrates the **Four Locks** architecture that prevents pricing typos from publishing live, and strictly limits commercial exposure if an erroneous price slips through.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### Installation & Running
```bash
# 1. Install dependencies
npm install

# 2. Run unit tests (Vitest)
npm test

# 3. Start local development server
npm run dev

# 4. Open in browser
# Navigate to http://localhost:5173/
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 🏛 Architecture & Layout

The prototype features a synchronized, reactive, side-by-side display:

1. **Left Pane: Customer Mobile App (390×844px iPhone frame)**
   - **Parchment Theme:** `#F4EDDC` background, `#FBF7EC` cards, `#11231D` ink, `#46564D` muted, `#E3A93B` brass, `#8A5A0B` deep brass text, `#1B5A43` ok green.
   - **Screens:**
     - **Explore:** Search bar, trip catalog with photos (`dino.jpg`, `pyramids.jpg`, `pod.jpg`), flagship sale badges.
     - **Trip Page:** Dinosaur Walk hero, strikethrough list price `$2,000`, active sale price `$1,600`, **33-tick seat bar** (one tick per sale seat), departure slot chips (`06:00`, `06:30`, `07:00`, `07:30`), Fair Price Policy modal trigger, Book button.
     - **Checkout:** Boarding-pass format with perforation cutouts, **05:00 countdown timer** holding the slot, price re-check validation, and "The price you see is the price you pay" shield guarantee.
     - **Listing Paused:** Number 214 in line, "Nothing has been charged", disabled CTA.
     - **Sale Seats Gone:** Reverted to $2,000, 5-minute hold notice, waitlist CTA.
     - **Confirmation & Waitlist:** Completion receipts with policy guarantees.

2. **Right Pane: Staff Console ("ChronoHop Control")**
   - **Dark Control-Room Theme:** `#0A1612` background, `#0F1F19` panel, `#223A30` border, `#EDE6D4` text, `#A5B3AA` muted, `#E3A93B` brass, `#F1C46B` price neon glow, `#C4302B` / `#FF9A8D` danger red, `#6FD3A0` ok green.
   - **Four-Locks Status Strip:** Live status of Lock 1 (Percent Entry), Lock 2 (Second Look), Lock 3 (Sale-Seat Cap), Lock 4 (Speed Breaker).
   - **Price Gate Tab:** Discount percent input (0–100%, 1 decimal), price in digits and words at >2x size, 3-tier visual band indicator, cap calculation section with share slider (5–20%) and budget input, custom cap lowering, last 5 sales reference, goes-live scheduling (24h minimum), full-width red STOP banner with executive override controls.
   - **Approvals Tab:** Pending request side-by-side comparison (List price, New price, Drop %), exact price retype verification (3 failed tries cancels request), separate account identity check.
   - **Timeline Desk Tab:** Three dial gauges (Bookings per slot [Max 1], Lowest price sold vs list, Bookings last 5m vs forecast), sale-speed bar chart with forecast line (6) and breaker threshold (30), live operations controls (Pause listing, 1-click Resume, End sale early), and chronological audit event log.

3. **Bottom Sticky Demo Bar**
   - Interactive simulation triggers:
     - **One customer books:** Increments booking count by 1.
     - **Deal-site rush:** Simulates viral sharing with an escalating surge of bookings.
     - **Go live now (demo):** Bypasses the 24-hour scheduling requirement to publish the current draft immediately.
     - **Switch role:** Toggles active account between `Asha (Pricing Analyst)` and `Marcus (Peer Approver)`.
     - **Reset:** Restores store state to the initial baseline.
     - **Lock 3 Cap toggle:** Toggles Lock 3 on/off to demonstrate unconstrained loss.
     - **Lock 4 Breaker toggle:** Toggles Lock 4 on/off to demonstrate unchecked runaway surges.

---

## 📋 PRD Assumptions & Config Dictionary

All business rules reside in `src/config/pricingRules.ts` matching PRD specifications exactly:

| Parameter | Value | Source / Business Rationale |
|---|---|---|
| `LIST_PRICE` | `$2,000` | Standard catalog price for the flagship Dinosaur Walk trip. |
| `DAYS_IN_WINDOW` | `7 days` | Length of the promotional sale window. |
| `SLOTS_PER_DAY` | `48 slots` | 24 hours × 2 half-hour slots per hour (single traveller per pod). |
| `WINDOW_SEATS` | `336 seats` | Total capacity in window: 7 days × 48 slots = 336 seats. |
| `LOSS_PER_SEAT_AT_TYPO` | `$1,940` | Worst-case loss per seat if a $2,000 trip is typed as $2.00 or $60 floor. |
| `DEFAULT_SHARE_PCT` | `10%` | Default capacity share allocated to the sale (slider 5% to 20%). |
| `DEFAULT_BUDGET` | `$100,000` | Maximum corporate loss exposure accepted for a single promotion. |
| `DEFAULT_CAP` | `33 seats` | Rule: `min(floor(10% × 336), floor(100,000 / 1940)) = min(33, 51) = 33 seats`. *(Note: Although an early PRD draft mentioned 50 seats, the official worked formula yields 33 seats, and 33 is used consistently per instructions).* |
| `MAX_SEATS_PER_CUSTOMER` | `2 seats` | Cap of 2 sale seats per account and per credit card per sale. |
| `BAND_1_MAX_PCT` | `30.0%` | 0% to 30% discount: 1 person (pricing analyst alone). |
| `BAND_2_MAX_PCT` | `60.0%` | >30% to 60% discount: 2 people (requires peer approver). |
| `BAND_BLOCKED_PCT` | `>60.0%` | Over 60% discount or price above list: Blocked unless Finance Lead & Founder both approve with written justification. |
| `MAX_RETYPE_ATTEMPTS` | `3 tries` | Approver must type the exact final price; 3 wrong attempts cancels request. |
| `FLAGSHIP_MIN_SCHEDULE_HOURS` | `24 hours` | Flagship trip sales must be scheduled at least 24 hours in advance. |
| `BREAKER_MULTIPLIER` | `5×` | Trips when rolling 5-minute bookings exceed 5 times the forecast. |
| `BREAKER_FLOOR` | `10 bookings` | Floor threshold if booking forecast is missing or low. |
| `DEMO_FORECAST_5MIN` | `6 bookings` | Baseline forecast: 6 bookings per 5 minutes. |
| `DEMO_BREAKER_THRESHOLD` | `30 bookings` | 5 × 6 = 30 bookings in rolling 5 minutes triggers speed breaker. |
| `CHECKOUT_HOLD_SECONDS` | `480s (8 min)` | Duration a customer's departure slot and sale price are held during checkout. |
| `PRICE_CHECK_PROMISE_HOURS` | `1 hour` | ChronoHop commitment to notify and refund customers within 60 minutes if a price typo occurs. |

---

## 🧪 Verified Scenarios

Automated and interactive verification scenarios:

1. **Scenario A (Standard Sale):**
   - Analyst enters `20%`.
   - Price calculates to `$1,600` (`"One thousand six hundred dollars"`), cap is `33 seats`.
   - Scheduled and live on Customer App showing `$1,600`, `$2,000` struck through, and 33 sale seat ticks.

2. **Scenario B (Blocked Runaway Error):**
   - Analyst enters `99.9%`.
   - Full-width red **STOP banner** triggers immediately, Schedule button disabled.
   - Price shows `$2.00` (`"Two dollars"`).
   - Executive override panel requires written reason, Finance Lead sign-off, and Founder co-sign.

3. **Scenario C (Two-Person Peer Approval & Retype):**
   - Analyst enters `40%`.
   - Price is `$1,200` (`"One thousand two hundred dollars"`), Band 2 triggers.
   - Request sent to Approvals tab.
   - Switch to Approver account. Typing an incorrect price (e.g., `$1,500`) fails and decrements attempts.
   - Typing exact `$1,200` validates match and schedules sale.

4. **Scenario D (Deal-Site Rush & Dual Lock Protection):**
   - Test override forces `$2.00` price live.
   - Customer clicks "Deal-site rush".
   - Bookings surge rapidly:
     - **Lock 3 Auto-Revert:** When sold seats hit 33, price automatically returns to `$2,000`.
     - **Lock 4 Speed Breaker:** Rolling bookings exceed 30 (5× forecast), automatically pausing new bookings.
     - Customer phone displays paused screen: *"Your place is saved: number 214 in line. Nothing has been charged."*

5. **Scenario E (Timeline Desk Operations):**
   - On-call owner reviews Timeline Desk.
   - Clicks "Resume Listing (1-Click On-Call)" to restore live status.
   - Clicks "End Sale Early" to close the promotion and return standard list pricing permanently.

---

## 🎨 Design Tokens & Accessibility

- **Contrast:** All text maintains WCAG AAA/AA 4.5:1+ contrast ratios.
- **Color Independence:** Colors are consistently paired with semantic icons and explicit status labels.
- **Touch Targets:** All interactive buttons and inputs meet or exceed 44px minimum touch targets.
- **Typography:**
  - Display: `Fraunces` (Google Fonts)
  - UI Text: `Inter` (Google Fonts)
  - Numeric & Price Data: `JetBrains Mono` (Google Fonts)

---

## 📷 Media & Attribution

- **Dinosaur Walk (`dino.jpg`):** Triceratops model in fern forest by Martinvl, licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) via Wikimedia Commons.
- **Pyramids (`pyramids.jpg`):** Sunset at the Pyramids by Spottedviper, licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) via Wikimedia Commons.
- **ChronoPod (`pod.jpg`):** AI-generated time-travel pod illustration.
