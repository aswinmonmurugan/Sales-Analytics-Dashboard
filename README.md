# Sales Analytics Dashboard

A responsive Sales Analytics Dashboard built with React, TypeScript, Vite, TanStack Query, Axios, and Material UI.

## Tech Stack

- **React 19 + TypeScript** — component layer
- **Vite** — build tooling / dev server
- **React Router** — routing shell (single dashboard route today, structured to add more)
- **TanStack Query (React Query)** — server-state caching, background refetch, retries
- **Axios** — HTTP client with a shared instance and response-error normalization
- **MUI (Material UI) v7** — component library and theming
- **MSW (Mock Service Worker)** — mocks the REST API described in the assignment so the app runs standalone without a real backend

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` and is fully functional out of the box: it intercepts network calls to `/api/*` with MSW and serves data from an in-memory generated dataset (~500 orders), so no backend is required to review the implementation.

### Connecting a real backend

The app was built directly against the API contract in the assignment:

- `GET /api/dashboard/summary`
- `GET /api/sales?page=&limit=&search=&status=&category=&sortBy=&sortOrder=&startDate=&endDate=`

To point at a real backend:

1. Copy `.env.example` to `.env`.
2. Set `VITE_API_BASE_URL` to your backend's base URL (e.g. `https://api.example.com`).
3. Set `VITE_USE_MOCK_API=false` to disable MSW.

No other code changes are required — `src/services/salesService.ts` and `src/services/apiClient.ts` are the only places that talk to the network.

### Build

```bash
npm run build   # type-checks then produces a production build in dist/
npm run preview # serve the production build locally
```

## Project Structure

```
src/
 ├── components/     # Presentational + composed UI (KpiCard, SalesTable, filters bar, etc.)
 ├── pages/           # Route-level pages (DashboardPage)
 ├── hooks/           # Data hooks (useSales, useDashboardSummary) + utility hooks (debounce, localStorage)
 ├── services/        # Axios instance + typed API functions
 ├── types/           # Shared TypeScript types/interfaces
 ├── utils/           # Formatting, CSV generation/download helpers
 ├── constants/       # Enumerations, config, storage keys
 └── mocks/           # MSW handlers + generated mock dataset (dev/demo only)
```

## Feature Notes

- **KPI cards** — Total Sales, Total Orders, Total Customers, Average Order Value, each with independent loading/error handling.
- **Search** — debounced (400ms) search across Order ID, Customer Name, and Product Name; resets pagination to page 1.
- **Filters** — Date range, Order Status, Product Category, all combinable and sent as query params to the server so filtering happens server-side, not client-side.
- **Sorting** — Order Date, Amount, Quantity, toggled via clickable column headers (`TableSortLabel`), both ascending/descending.
- **Pagination** — server-side; page size selectable (10/25/50/100).
- **CSV Export** — exports the *currently filtered* dataset (ignoring pagination) via a dedicated `/api/sales/export`-style call, generated client-side as a downloadable `.csv` file.
- **Loading state** — skeleton rows sized to the current page size while data is loading, plus skeletons on KPI cards.
- **Empty state** — friendly message + icon when a filtered query returns zero results.
- **Error handling** — a shared Axios response interceptor normalizes network errors, timeouts, and 4xx/5xx responses into user-facing messages; both the KPI section and the table surface a Retry action independently (partial failure doesn't take down the whole page).
- **Bonus features implemented**:
  - Debounced search
  - Column visibility toggle (Category / Quantity / Order Date can be hidden)
  - Filters + column visibility persisted to `localStorage` (survives refresh)
  - Skeleton loaders (KPI cards + table rows)
  - Retry button on failed requests

## Architecture & Design Decisions

- **Server-side everything.** Search, filters, sorting, and pagination are all sent as query parameters and resolved server-side (mocked in MSW using the same logic a real backend would apply), matching the "server-side pagination" requirement and keeping the client fast regardless of dataset size.
- **TanStack Query as the state layer.** Rather than reaching for Redux/Context for server data, all remote state (summary, sales list) lives in React Query's cache, keyed by the full query-params object. This gives free request de-duplication, caching, retry, and `placeholderData: keepPreviousData` so pagination/sorting doesn't flash an empty table between pages.
- **Local UI state via small hooks**, not a global store: `useSalesFilters` centralizes filter/pagination state and derives the query-params object consumed by `useSales`, keeping `DashboardPage` a thin composition layer.
- **Typed API boundary.** All request/response shapes are defined once in `types/sales.ts` and shared by the mock handlers, the service functions, and the components — so the mock layer and a real backend are interchangeable as long as they satisfy the same TypeScript contract.
- **Errors normalized once**, at the Axios interceptor, so every consumer (KPI cards, table) gets a consistent `{ message, status }` shape instead of re-implementing Axios error parsing per call site.

## Assumptions & Limitations

- The assignment didn't specify exact response shapes, so I defined a `PaginatedResponse<T>` envelope (`{ data, total, page, limit, totalPages }`) for `/api/sales`, and a flat `DashboardSummary` object for `/api/dashboard/summary`. These are documented in `src/types/sales.ts` and easy to adjust to match the real backend's actual response shape.
- CSV export assumes a backend endpoint that returns the *full* filtered set unpaginated (`/api/sales/export`); if the real backend doesn't expose this, exporting can be adapted to loop over all pages of `/api/sales` instead — flagged as a one-line swap in `services/salesService.ts`.
- Currency formatting defaults to INR (`en-IN` locale) since no currency was specified; this is centralized in `utils/format.ts` and trivial to change.
- The mock API introduces a small (~3%) randomized failure rate and a simulated network delay specifically so the loading/error/retry states are visible during review — remove `FAILURE_RATE` logic in `src/mocks/handlers.ts` if you want an always-succeeding demo.
- Authentication/authorization was out of scope per the brief and isn't implemented.
