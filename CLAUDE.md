# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev          # start Next.js dev server
yarn build        # production build
yarn lint         # ESLint (.ts/.tsx)
yarn format       # Prettier
yarn spotless     # lint --fix + prettier (use before committing)
```

**Prisma:**
```bash
npx prisma migrate dev      # apply migrations (local)
npx prisma generate         # regenerate client after schema changes
npx prisma db seed          # seed with org/branch/roles/users
npx prisma studio           # GUI explorer
```

No test suite exists (`yarn test` is a no-op).

## Architecture

This is a **Next.js 16 App Router** monorepo with two distinct sub-systems sharing the same codebase:

### 1. E-commerce Storefront (`src/app/(root)/`)
Customer-facing shop. Pages are thin shells; all logic lives in `src/components/home/` and `src/components/account/`. Data fetched via `axiosInstance` to an **external backend** (`NEXT_PUBLIC_API_BASE_URL`).

### 2. Admin Dashboard (`src/app/admin/`)
- **E-commerce admin** (brands, categories, products, orders, finance, content, hero management) — same external backend via `axiosInstance`.
- **PLM system** (`src/app/admin/(plm)/`) — **self-contained**: all data from Next.js API routes backed by Prisma + PostgreSQL locally. No external backend for PLM.

### API Layer: two modes

| Traffic | Path | Backend |
|---|---|---|
| E-commerce | `axiosInstance` → `NEXT_PUBLIC_API_BASE_URL` | External REST API |
| PLM | `axiosInstance` → `/api/plm/*` → Next.js route handlers | Local PostgreSQL via Prisma |

`axiosInstance` (`src/helpers/axios/axiosInstance.ts`) detects `/api/` prefixed URLs and rewrites them to `window.location.origin` to hit local route handlers instead of the external base URL.

### PLM API Routes (`src/app/api/plm/`)
All route handlers use helpers from `src/lib/plm-api.ts`:
- `requireAuth(request)` — validates JWT Bearer token
- `requirePermission(request, ...keys)` — RBAC guard
- `requireRole(request, ...roles)` — role guard
- `success()`, `paginated()`, `error()` — standardized response format `{ data, meta }`
- `STATUS_TRANSITIONS` — enforces the 22-step `ProductStatus` lifecycle

Prisma client is a singleton in `src/lib/prisma.ts` using `@prisma/adapter-pg` (PgBouncer-safe pool).

### PLM Domain Model
`ProductDesign` is the core entity, flowing through 22 `ProductStatus` states: `CONCEPT → DESIGN_IN_PROGRESS → … → LIVE_FOR_SALE`. Approval at two levels (MODERATOR, SUPER_ADMIN). Branch-scoped roles (`BRANCH_MODERATOR`, `DESIGN_TEAM`, `PRODUCTION_TEAM`, `INVENTORY_TEAM`) can only see their branch's data; `SUPER_ADMIN` sees all.

### State Management
Redux Toolkit store (`src/lib/redux/store.ts`):
- `auth` — ecommerce user session (JWT in localStorage/cookies)
- `user` — user profile
- `permission` — PLM permissions array (checked via `permissionSelectors`)
- `plm` / `plmRoles` — PLM design & role state
- `cart`, `wishlist`, `filter` — ecommerce UI state

TanStack Query handles server-state caching for data fetching (provider in `src/lib/react-query/`).

### PLM Frontend Guard
`PlmRouteGuard` component wraps PLM pages and checks `permission` Redux slice against a `requiredPermission` prop (e.g., `"plm.dashboard.view"`).

### Key Directories

| Path | Purpose |
|---|---|
| `src/app/api/plm/` | PLM Next.js route handlers |
| `src/lib/plm-api.ts` | PLM auth guards, response helpers, status transitions |
| `src/lib/prisma.ts` | Prisma singleton (PgBouncer-safe) |
| `src/helpers/axios/` | Axios instance with auth interceptors & token refresh |
| `src/lib/redux/` | Redux store + slice features |
| `src/components/admin/PLM/` | PLM UI components |
| `src/modules/` | PLM functional modules (approvals, designs, inventory, production, workflow) |
| `src/components/shared/sidebar/` | Admin sidebar components |
| `prisma/schema.prisma` | Database schema (Organization → Branch → User/Design lifecycle) |
| `prisma/seed.ts` | Seeds org, branches, roles (SUPER_ADMIN, BRANCH_MODERATOR, DESIGN_TEAM, etc.), permissions |

## Environment Variables

```
DATABASE_URL                  # PostgreSQL connection string (required for PLM)
NEXT_PUBLIC_API_BASE_URL      # External e-commerce backend URL
NEXT_PUBLIC_GOOGLE_CLIENT_ID  # Google OAuth
JWT_SECRET                    # PLM JWT signing key (defaults to weak dev string)
```

## Conventions

- Shadcn/ui components in `src/components/ui/` — add via `components.json` config
- Form validation uses `react-hook-form` + `zod` (v4) or `yup` — both are in use, pick one per feature
- Axios response interceptor unwraps `response.data.data` → caller receives `{ data, meta }` directly
- Admin route group dirs use parentheses: `(plm)`, `(finance)`, etc. — these don't affect URL paths
- PLM permission keys follow pattern: `plm.<module>.<action>` (e.g., `plm.design.submit`)
