# GreenOps Dashboard (Frontend MVP)

A **frontend-only product dashboard** that helps teams **understand and reduce the estimated environmental impact of web usage** by transforming usage data into clear insights and actionable recommendations.

> This project is intentionally **frontend-only**.
> All data processing, state management, and logic live in the browser.

---

## Why this project exists

Frontend teams increasingly own **performance, sustainability, and user experience** concerns, but tooling often targets backend or infrastructure layers.

This project explores how a **frontend application alone** can:
- ingest usage data
- transform it into meaningful insights
- guide decision-making through UX and domain logic

It is designed as a **product-oriented frontend exercise**, not as a real carbon accounting tool.

---

## Target user

- Frontend engineers
- Tech Leads
- Product teams looking for **quick insights**, not perfect accuracy

---

## Scope & constraints

### In scope
- Client-side data ingestion (CSV / seeded data)
- Domain modeling & calculations in TypeScript
- State management and UI flows
- Testing of core logic and critical UI behavior
- Accessibility and performance basics

### Explicitly out of scope
- Backend services or APIs
- Authentication / authorization
- Real carbon footprint accuracy
- Persistence beyond the browser (except local storage)
- Enterprise-scale data volumes

---

## Core MVP features (vertical slices)

### ✅ 1. Data ingestion & Feedback
- Upload a CSV file or load a predefined dataset.
- Validate and parse records in the browser.
- Handle invalid data gracefully, showing detailed per-row errors.

### ✅ 2. First Insights
- Aggregate key metrics from the loaded data (page views, data transfer, etc.).
- Present a high-level summary dashboard to the user immediately after upload.

### 🔲 3. Recommendations
- Generate simple, rule-based recommendations.
- Prioritize actions by estimated impact.
- Explain *why* each recommendation exists.

### 🔲 4. Report history
- Persist generated reports locally.
- Compare previous runs.
- Enable quick iteration and learning.

---

## Architecture principles

- **Vertical slice architecture**
```text
📁 src/
 ├─ 📁 features/
 │   ├─ 📁 data-import/
 │   ├─ 📁 insights/
 │   └─ 📁 recommendations/
 ├─ 📁 domain/
 └─ 📁 shared/
```
 ---
 
- Clear separation between:
- UI components
- Domain logic (pure, testable)
- Infrastructure (parsing, storage)

- Decisions are documented using **lightweight ADRs** (`/docs/decisions`)

---

## Tech stack

- Next.js (App Router)
- React
- TypeScript
- React Testing Library
- ESLint & Prettier
- CSS Modules / Tailwind (implementation detail)

Optional tools are introduced **only if they add clear value**.

---

## Quality bar

- Meaningful tests for:
- CSV parsing & validation
- Core calculations
- Critical user flows
- Accessible UI:
- keyboard navigation
- semantic HTML
- Reasonable performance:
- avoid unnecessary re-renders
- memoization only when justified

---

## Local development

```bash
pnpm install
pnpm dev
pnpm test
pnpm lint
```
---

## Project status

This project is an iterative MVP.

Next planned milestones:

- CSV upload & validation

- First insights screen

- Basic recommendations engine

- Local report persistence

---

## Disclaimer

This project is not a real sustainability measurement tool.

It exists to demonstrate:

- frontend architecture

- product-oriented thinking

- code quality and maintainability

- ability to build complete frontend solutions
