# VELORA — AI-Powered Personal Finance for Students & Young Adults

VELORA is a dark editorial personal finance platform ("warm newspaper meets financial data terminal") designed for college students and young adults to master their cashflow, build consistent savings habits, and receive institutional-grade financial analysis.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following requirements and user preferences have been incorporated into this architectural plan:
> - **Initialization Choice**: Users can choose during onboarding to either explore with a realistic student demo dataset (hostel rent, campus meals, books, freelance stipend, metro commute) or start with a clean slate.
> - **AI Persona**: The Velora AI financial assistant will operate as a **direct and concise financial terminal analyst**, providing rigorous, fluff-free spending audits and tactical cashflow directives.
> - **Currency Strategy**: Defaults to **Indian Rupee (INR ₹)** with an instant currency switcher in Settings and onboarding (supporting ₹, $, €, and £ with correct locale formatting and tabular numerals).
> - **Bespoke Custom CSS**: Pure hand-crafted CSS token architecture (no Tailwind utility classes or third-party UI libraries), adhering strictly to the `--ink`, `--cream`, and `--accent` color system.

---

## 1. Overview & Core Concept

- **What It Does**: VELORA delivers an end-to-end money cockpit with date-grouped transaction logs, budget analytics, interactive savings goal simulators, daily streak tracking with a 90-day activity matrix, and an AI financial assistant with live context from the user's ledger.
- **Target Audience / Persona**: College undergrads, postgrads, and young professionals navigating allowances, part-time jobs, shared rent, campus food costs, and disciplined savings goals.
- **Key Value**: Replaces chaotic spreadsheets and generic banking apps with a disciplined, editorial interface that encourages daily check-ins, tracks streaks like a code repository, and delivers clear financial clarity.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Landing Page**: Fixed nav (Wordmark, "Sign In", "Get Started"), typography hero with *"Your money, finally understood."*, animated real-time balance terminal card, dual CTAs, editorial asymmetric feature sections with scroll fade-ins, and clean newspaper-style footer.
2. **Auth & 3-Step Onboarding**:
   - Clean Sign Up (name, email, password strength meter) and Log In with password reveal.
   - Step 1: Currency selection (default INR ₹).
   - Step 2: Income cadence (Monthly stipend, Weekly allowance, Irregular freelance).
   - Step 3: First savings target + Choice to load realistic student demo data or start empty.
3. **Cockpit Dashboard**:
   - Quick period filter (Today / Week / Month).
   - 4 primary metric cards: Net Balance, Total Inflow, Total Outflow, Savings Rate (%).
   - Interactive Chart.js Cashflow Line Chart (Inflow vs. Outflow timeline).
   - Category Distribution Donut Chart.
   - Recent Transactions feed with quick-add trigger.
   - Goals progress preview & Daily Streak widget.
4. **Transactions Ledger**:
   - Date-grouped feed with search by description, type toggles (All/Income/Expense), and category filter.
   - Add/Edit/Delete Transaction modal with validation, amount keypad formatting, and payment method (UPI, Cash, Card, Bank Transfer).
   - One-click CSV export.
5. **Analytics Engine**:
   - Income vs. Expense monthly bar charts.
   - Horizontal category breakdown with percentage share.
   - Savings rate trendline.
   - Editorial text insights ("Top spending category is Food (34% of outflow)", "Weekend spend is 2.1x weekday average").
6. **Savings Goals & Simulator**:
   - Visual goal cards with target vs. accumulated balance, countdown to deadline, and required monthly allocation.
   - Add Goal modal & Contribution modal with confetti/feedback.
   - Interactive Contribution Simulator: *"What if I save ₹X extra every week?"* with instant timeline acceleration calculation.
7. **Streaks & Habit Engine**:
   - Large terminal streak counter with flame typography.
   - 90-day GitHub-style interactive heatmap grid of daily financial activity.
   - Daily Tasks Checklist: (1) Log at least one transaction, (2) Review weekly budget pacing, (3) Check savings goal progress.
   - 4 unlockable achievement badges: *First Ledger*, *7-Day Disciplined*, *Goal Crusher*, *Savvy Saver*.
8. **AI Financial Assistant (Terminal Mentor)**:
   - Full-duplex conversational terminal connected to the user's actual localStorage transactions and metrics.
   - Demo mode banner with 5 instant offline prompts & responses if no API key is supplied.
   - Suggested query chips: *"Audit my food spend this month"*, *"Can I afford a ₹3,000 concert ticket?"*, *"How do I increase my savings rate by 10%?"*.
9. **Settings & Data Sovereignty**:
   - Profile name update.
   - Currency switcher (INR ₹, USD $, EUR €, GBP £).
   - One-click full data export (CSV transactions, JSON backup).
   - Safe factory reset / data wipe with double confirmation modal.

### Visual Identity & Theme
```css
:root {
  --ink: #0E0D0B;
  --ink-raised: #1A1916;
  --ink-border: #2C2A26;
  --cream: #F0EDE6;
  --cream-dim: #A89F94;
  --accent: #C9A84C;
  --positive: #4CAF82;
  --negative: #D9604A;
  --warning: #E8A838;
  --font-serif: "DM Serif Display", serif;
  --font-sans: "DM Sans", -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: "DM Sans", monospace;
}
```
- **Editorial Newspaper meets Terminal**: Dark, warm charcoal canvas (`--ink`) with raised editorial surfaces (`--ink-raised`), crisp hairline dividers (`--ink-border`), warm cream text (`--cream`), and refined gold leaf accents (`--accent`).
- **Zero-Pill Discipline**: Metadata is displayed with clean unboxed typography and `·` separators (e.g. `UPI · 14 Oct 2026 · Food & Dining`).
- **Tabular Figures**: Every currency number and percentage strictly uses `tabular-nums` to ensure zero layout jitter.
- **Responsive Layout**:
  - Desktop (>1024px): 240px fixed editorial sidebar with navigation categories (MONEY, GOALS, AI, SYSTEM).
  - Mobile (<1024px): Smooth top bar + 5-tab sticky bottom navigation bar with min 44px touch targets.

---

## 3. Key Product Decisions & Trade-Offs

- **Pure Custom CSS Architecture**: Eliminates heavy utility CSS frameworks in favor of a clean, structured design system with CSS custom properties, responsive grid/flex layouts, and lightweight keyframe animations.
- **Local-First Reactive Storage (`src/lib/storage.js`)**: Uses a single structured JSON schema in `localStorage` with custom browser storage event dispatching so changes in one tab or modal instantly re-render charts, stats, and widgets without page refreshes.
- **Isolated Financial Math (`src/lib/finance.js`)**: All calculations (balance, category aggregations, savings velocity, daily streak verification, date formatting) are purely functional and independently testable.
- **Server-Side Gemini AI Integration**: A lightweight server endpoint (`/api/assistant/chat`) securely calls `@google/genai` using `gemini-3.8-flash` with the user's ledger summary injected as structured system context. If the server is offline or lacks a key, a client-side terminal emulator provides 5 contextual financial audits.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram
```
┌────────────────────────────────────────────────────────────────────────┐
│                          VELORA Client App                             │
│                                                                        │
│  ┌───────────────────────┐  ┌───────────────────────────────────────┐  │
│  │   Navigation Shell    │  │          Page Views (Router)          │  │
│  │  • Desktop Sidebar    │  │  • Landing     • Dashboard • Ledgers  │  │
│  │  • Mobile Bottom Bar  │  │  • Analytics   • Goals     • Streaks  │  │
│  │                       │  │  • AI Terminal • Settings  • Auth/Onb │  │
│  └───────────┬───────────┘  └───────────────────┬───────────────────┘  │
│              │                                  │                      │
│              ▼                                  ▼                      │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     Component & UI Primitives                    │  │
│  │   Button · Input · Select · Modal · Card · Badge · Skeleton      │  │
│  │           EmptyState · ErrorState · Spinner                      │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
│                                     │                                  │
│              ┌──────────────────────┴──────────────────────┐           │
│              ▼                                             ▼           │
│  ┌───────────────────────┐                     ┌────────────────────┐  │
│  │    src/lib/finance    │                     │   src/lib/storage  │  │
│  │ • Net balance math    │                     │ • localStorage API │  │
│  │ • Category totals     │                     │ • Reactive events  │  │
│  │ • Savings rate trends │                     │ • Seed demo data   │  │
│  │ • Streak 90-day calc  │                     │ • Import / Export  │  │
│  └───────────────────────┘                     └─────────┬──────────┘  │
└──────────────────────────────────────────────────────────┼─────────────┘
                                                           │
                                                           ▼
┌──────────────────────────────────────┐        ┌──────────────────────┐
│  Server-Side Gemini Endpoint         │        │    Local Storage     │
│  POST /api/assistant/chat            │        │  velora_state_v1     │
│  • Model: gemini-3.8-flash           │        │  • User Profile      │
│  • Context: Ledger & Category Totals │        │  • Transactions      │
│  • Direct financial terminal tone    │        │  • Savings Goals     │
│  • Client-side fallback if offline   │        │  • Daily Streaks     │
└──────────────────────────────────────┘        └──────────────────────┘
```

### Storage Schema (`velora_state_v1`)
```typescript
interface VeloraState {
  user: {
    name: string;
    email: string;
    currency: 'INR' | 'USD' | 'EUR' | 'GBP';
    incomeFrequency: 'monthly' | 'weekly' | 'irregular';
    hasCompletedOnboarding: boolean;
  };
  transactions: Array<{
    id: string;
    type: 'income' | 'expense';
    amount: number;
    description: string;
    category: 'Food' | 'Transport' | 'Shopping' | 'Education' | 'Housing' | 'Bills' | 'Healthcare' | 'Entertainment' | 'Travel' | 'Other';
    date: string; // YYYY-MM-DD
    paymentMethod: 'UPI' | 'Cash' | 'Card' | 'Bank Transfer';
  }>;
  goals: Array<{
    id: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: string; // YYYY-MM-DD
    category: string;
    createdAt: string;
  }>;
  streak: {
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string; // YYYY-MM-DD
    completedDates: string[]; // ['2026-10-15', ...]
    todayTasks: {
      loggedTransaction: boolean;
      checkedBudget: boolean;
      reviewedGoals: boolean;
    };
  };
}
```

---

## 5. Implementation Sequence

1. **Dependencies & Project Configuration**:
   - Install `react-router-dom`, `chart.js`, `react-chartjs-2`.
   - Update `metadata.json` with app title and description.
   - Configure Google Fonts (`DM Serif Display` and `DM Sans`) in `index.html`.
2. **Core Storage & Financial Engine**:
   - Implement `src/lib/storage.js` with CRUD, reactive event dispatchers, demo seed generator, CSV export/import, and data wipe.
   - Implement `src/lib/finance.js` with balance calculations, category sums, period filtering, savings rate formulas, and 90-day streak map generation.
3. **Design System & CSS Styling**:
   - Create `src/index.css` with exact `:root` design tokens, editorial typography scale, reset, transitions, scroll behavior, and dark terminal aesthetic.
4. **UI Primitives**:
   - Build reusable components: `Button`, `Input`, `Select`, `Modal`, `Card`, `Badge`, `Skeleton`, `EmptyState`, `ErrorState`, `Spinner`.
5. **App Navigation & Shell**:
   - Build responsive layout with 240px fixed sidebar for desktop and bottom bar for mobile.
6. **Feature Pages**:
   - **Landing Page**: Hero terminal showcase, scroll fade-in feature sections, CTAs.
   - **Auth & Onboarding**: Sign-up, login, 3-step wizard with demo data toggle.
   - **Dashboard**: Period filter, 4 KPI cards, cashflow line chart, category donut chart, recent transactions, quick actions.
   - **Transactions**: Date-grouped list, add/edit/delete modal, search, filter, CSV download.
   - **Analytics**: Dual charts, category horizontal bars, data-driven financial advice.
   - **Savings Goals**: Goal cards, contribution modal, interactive "What-If" simulator.
   - **Streaks**: 90-day activity matrix, streak counter, daily 3-task checklist, 4 badges.
   - **AI Assistant**: Terminal chat interface, ledger context injection, prompt chips, demo fallback mode.
   - **Settings**: Name editor, currency switcher, CSV download, reset data.
7. **Gemini Server Endpoint**:
   - Setup `/api/assistant/chat` with `@google/genai` (model `gemini-3.8-flash`) and direct terminal analyst system prompt.
8. **Verification & Audit**:
   - Execute `compile_applet` and test edge cases (empty states, small screens at 375px, currency conversions).
