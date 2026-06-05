# Branch RBAC/ABAC

Multi-branch **dynamic** Role + action-based Access Control. Self-contained in this
Next.js app (Prisma + PostgreSQL). The legacy PLM subsystem is fully removed; this is
the sole RBAC system.

Auth lives in `src/lib/auth-tokens.ts` (`signTokens`/`verifyToken`/`getAuthUser`) +
`/api/auth/{login,refresh,profile}`. JWT secret via `JWT_SECRET`. The token carries
**identity only** (`sub`, `isSuperAdmin`); permissions are always re-derived from the DB.

## Concept

- **Actions are dynamic** — rows in the `actions` table (`create/read/update/delete/export`
  + any custom key the super admin creates). Referenced by key in permission arrays.
- **Resources** are a fixed config list in `src/config/rbac.ts` (`RESOURCES`).
- **Permission = Resource + Actions** (e.g. `orders: [read, update]`).
- **Roles are dynamic, with two scopes / two places:**
  - `SUPER_ADMIN` scope (global) — managed at `/api/super-admin/roles`, **no branch ceiling**.
  - `BRANCH` scope — managed at `/api/branches/roles`, **capped to the branch's scope**.
- **Top-down validation:** super admin sets a branch's allowed scope (`BranchPermission`);
  branch managers may only grant role permissions that are a subset of that scope.

## Identity (no fixed role enum)

| Who | How | Powers |
|---|---|---|
| **Super admin** | `User.isSuperAdmin = true` (bootstrap, seeded) | Bypasses everything; CRUD on actions/branches/global roles. |
| **Branch admin** | a branch user whose role has `users`+`roles` CRUD | Manages roles/users in their own branch (permission-driven, not a hard role). |
| **Branch user** | branch user with a limited role | Effective perms = role grants ∩ branch scope. |

Cases: (1) super admin full CRUD on roles + actions; (2) a branch admin grants a user
read-only (`orders:[read]`); (3) super admin grants any resource×action dynamically.

## Data Model

- `User.isSuperAdmin` (bootstrap god flag) + `User.roleId` → primary `Role`.
- `enum RoleScope { SUPER_ADMIN BRANCH }`; `Role.scope`, `Role.branchId` (null for global).
  Branch role names namespaced `"<CODE> - <name>"` (global `name @unique`); UI strips prefix.
- `Action` (`key @unique`, `label`, `isBuiltIn`) — dynamic action catalog.
- `BranchPermission` (`branchId`, `resource`, `actions[]`) — branch scope / ceiling.
- `RoleResourcePermission` (`roleId`, `resource`, `actions[]`) — role grants.

Migrations: `…_add_branch_rbac` then `…_dynamic_rbac`.
Seed: `npx ts-node prisma/seed-rbac.ts` (also wired as the Prisma seed in package.json).

## API

| Method | Route | Guard | Purpose |
|---|---|---|---|
| POST | `/api/auth/login` | — | Credentials → access+refresh JWT (`isSuperAdmin`). |
| POST | `/api/auth/refresh` | — | Refresh token → new tokens. |
| GET | `/api/auth/profile` | auth | Current user profile. |
| GET | `/api/auth/permissions` | auth | O(1) `{user:{id,isSuperAdmin,branchId}, permissions}` map, DB-derived. |
| GET/POST | `/api/actions` | auth (GET) | Read-only action catalog for the permission matrix. |
| GET/POST | `/api/super-admin/actions` (+`/[id]` PATCH/DELETE) | super admin | Dynamic action CRUD (built-ins delete-protected). |
| GET/POST | `/api/super-admin/roles` (+`/[id]`) | super admin | Global (SUPER_ADMIN-scope) roles — no branch ceiling. |
| GET/POST | `/api/super-admin/branches` | super admin | Branches + scope (paginated). |
| GET/POST | `/api/super-admin/organizations` | super admin | Org list/create. |
| GET/POST | `/api/branches/roles` (+`/[id]`) | super admin or `roles` access | Branch roles; grants ⊆ branch scope. |
| GET/POST | `/api/branches/users` (+`/[id]` PATCH/DELETE) | super admin or `users` access | Branch users; assign `roleId`. |

Permission map rules:
- `isSuperAdmin` → every resource × every action key `true`.
- `SUPER_ADMIN`-scope role → grants verbatim (no ceiling).
- `BRANCH`-scope role → grants ∩ branch scope.

Branch isolation: non-super-admin is hard-scoped to `user.branchId`; `branchId` in the body
is ignored for branch users.

## Backend files

- `src/lib/rbac.ts` — token verify, `getRbacUser`, `getActionKeys`, `buildPermissionMap(user, actionKeys)`,
  guards (`requireAuth`/`requireSuperAdmin`/`requireResourceAction`/`requireManage`),
  `branchScopeWhere`, `validateGrantsAgainstScope`, `resolveTargetBranchId`, `rbacPaginated`/`getListParams`.
- `src/config/rbac.ts` — `RESOURCES`, `BUILT_IN_ACTIONS`, dynamic-action map helpers.
- `src/lib/auth-tokens.ts` — JWT + `getAuthUser` (returns `isSuperAdmin`).
- `src/lib/prisma.ts` — Prisma singleton.

## Frontend files (brands pattern)

Each entity follows `src/components/admin/Brands/`: `XList` (useGet+usePagination+useSearchDebounce+useDelete)
→ `XTable` (`ui/data-table`) + `Form/CreateUpdateX` (Dialog + FormProvider + yupResolver + usePost/usePatch)
+ `Form/XForm` (Controlled* fields) + `Schema/*` (yup) + `TableColumns/*` + `types/`.

- `src/components/admin/RBAC/Actions/*` — dynamic action CRUD.
- `src/components/admin/RBAC/Roles/*` — scope tabs (Global vs Branch) + branch picker; `RoleForm` embeds the matrix.
- `src/components/admin/RBAC/Branches/*` — create branch + scope matrix (super admin).
- `src/components/admin/RBAC/Users/*` — create/edit user, assign branch role.
- `src/components/admin/RBAC/shared/ResourcePermissionMatrix.tsx` — resource × **dynamic action** grid,
  `scope` prop caps to branch ceiling. `shared/RbacRouteGuard.tsx` — gates by `isSuperAdmin` or a resource.
- `src/hooks/useActions.ts` — action catalog; `src/hooks/useRbacPermissions.ts` — loads the map into redux.
- Redux `src/lib/redux/features/rbac/*`: user `{ id, isSuperAdmin, branchId }`; `selectCan`, `selectIsSuperAdmin`.
- Pages `src/app/admin/(rbac)/rbac/{actions,roles,branches,users}/page.tsx`.
- Nav: `src/utils/getMenuItems.ts` → "Access Control" (Branches, Actions, Roles, Users).

## Seed logins (`password123`)

| Email | isSuperAdmin | Branch | Role |
|---|---|---|---|
| `superadmin@demo.com` | yes | — | (bypass) |
| `admin.a@demo.com` | no | BR-A | `BR-A - Branch Admin` (users+roles CRUD, orders all) |
| `staff.a@demo.com` | no | BR-A | `BR-A - Orders Staff` (`orders:[read]`) |
| `admin.b@demo.com` | no | BR-B | `BR-B - Branch Admin` (isolated) |

Plus a `Platform Admin` global (SUPER_ADMIN-scope) role demo.

## Notes

- After `prisma generate`, a running `next dev` keeps a stale Prisma client — **restart the dev
  server** before testing the new fields/endpoints over HTTP.
- ESLint binary is currently broken in `node_modules` (missing `./eslint` internal) — reinstall to lint.
- Sidebar group shows for any admin; pages still guard by `isSuperAdmin` / resource permission.
