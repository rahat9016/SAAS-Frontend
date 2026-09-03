# Familie Munshi Frontend

E-commerce storefront and admin dashboard built with Next.js (App Router), React, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS 4, Radix UI, shadcn-style components (`components.json`)
- **State/Data:** Redux Toolkit, TanStack Query, TanStack Table
- **Forms:** React Hook Form, Zod / Yup resolvers
- **Auth:** JWT (jsonwebtoken, jwt-decode), Google OAuth (`@react-oauth/google`)
- **Editor:** Tiptap
- **Other:** Axios, date-fns, Recharts, jsPDF, html2canvas

## Prerequisites

- Node.js 20+
- Yarn

## Getting Started

```bash
yarn install
yarn dev
```

App runs at [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_SITE_NAME=
NEXT_PUBLIC_SITE_DESCRIPTION=
NEXT_PUBLIC_CURRENCY=
NEXT_PUBLIC_CURRENCY_SYMBOL=
NEXT_PUBLIC_EMAIL=
NEXT_PUBLIC_PHONE_
NEXT_PUBLIC_ADDRESS=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```

## Scripts

| Script           | Description                          |
| ---------------- | ------------------------------------- |
| `yarn dev`        | Start dev server                     |
| `yarn build`       | Production build                     |
| `yarn start`       | Start production server              |
| `yarn lint`        | Lint codebase                        |
| `yarn format`      | Format codebase with Prettier        |
| `yarn spotless`     | Lint (fix) + format                  |

## Project Structure

```
src/
├── app/                # Routes (App Router)
│   ├── (root)/          # Storefront: products, cart, checkout, orders, account, wishlist...
│   ├── admin/           # Admin dashboard: products, brands, RBAC, content, users...
│   └── auth/            # Login / signup
├── components/          # UI + feature components (ui, home, auth, layout, admin, shared, account)
├── actions/             # Server actions
├── services/            # API service layer
├── hooks/               # Custom React hooks
├── lib/                 # Redux store, React Query, Google auth setup
├── helpers/              # Axios instance, misc helpers
├── data/                 # Static/mock data
├── constants/             # App constants
├── config/                # App configuration
├── types/                 # Shared TypeScript types
└── utils/                 # Utility functions
```

## Git Hooks

Husky + lint-staged run ESLint and Prettier on staged files pre-commit.

## License

See [LICENSE](./LICENSE).
