# Branch RBAC/ABAC — Phase 1

Multi-branch dynamic Role-Based + action-based Access Control. Self-contained
within this Next.js app (Prisma + PostgreSQL). The legacy PLM subsystem has been
fully removed (code + DB tables); this is the sole RBAC system.

Auth lives in `src/lib/auth-tokens.ts` (`signTokens`/`verifyToken`/`getAuthUser`)
+ `/api/auth/{login,refresh,profile}`. JWT secret shared via `JWT_SECRET` env.

## Concept

- **Attributes = CRUD-style actions only**: `create`, `read`, `update`, `delete`, `export`. No condition logic.
- **Permission = Resource + Actions** (e.g. `orders: [read, update]`). Resources are routes/modules.
- **Top-down validation**:
  1. **Super Admin** creates a Branch and assigns its allowed scope (`BranchPermission`).
  2. **Branch Admin** creates Roles + Users inside the branch.
  3. A Branch Admin can ONLY grant permissions that exist in the branch's scope (subset enforced server-side).

## Roles (`GlobalRole`)

| Role | Access |
|---|---|
| `SUPER_ADMIN` | Global. Bypasses branch scope. Manages branches + all branch roles/users. |
| `BRANCH_ADMIN` | Owns one branch. Full branch scope. Creates roles + users in own branch. |
| `BRANCH_USER` | Effective permissions = assigned Role grants ∩ branch scope. |

## Data Model (additive to existing schema)

- `GlobalRole` enum on `User.globalRole`; `User.roleId` → primary `Role`.
- `Role.branchId` → branch-scoped roles (namespaced `"<CODE> - <name>"`, global `name @unique`).
- `BranchPermission` (`branchId`, `resource`, `actions[]`) — branch scope / ceiling.
- `RoleResourcePermission` (`roleId`, `resource`, `actions[]`) — role grants.

Migration: `prisma/migrations/20260604174047_add_branch_rbac` (additive only).
Seed: `prisma/seed-rbac.ts` → `npx ts-node prisma/seed-rbac.ts`.

## API

| Method | Route | Guard | Purpose |
|---|---|---|---|
| POST | `/api/auth/login` | — | Credentials → access+refresh JWT (identity + global role). |
| POST | `/api/auth/refresh` | — | Refresh token → new tokens. |
| GET | `/api/auth/profile` | auth | Current user profile. |
| GET | `/api/auth/permissions` | auth | O(1) `{user, permissions}` map. Re-derived from DB (token = identity only). |
| GET/POST | `/api/super-admin/branches` | SUPER_ADMIN | List branches+scope / create branch + scope |
| GET/POST | `/api/super-admin/organizations` | SUPER_ADMIN | Org list/create (branch needs an org) |
| GET/POST | `/api/branches/roles` | BRANCH_ADMIN, SUPER_ADMIN | List / create dynamic role (grants ⊆ branch scope) |
| GET/PATCH/DELETE | `/api/branches/roles/[id]` | BRANCH_ADMIN, SUPER_ADMIN | Get / rename+repermission / delete (branch-owned) |
| GET/POST | `/api/branches/users` | BRANCH_ADMIN, SUPER_ADMIN | List / create user, assign existing `roleId` (or inline role) |

Permission map rules:
- `SUPER_ADMIN` → all resources/actions `true`.
- `BRANCH_ADMIN` → full branch scope.
- `BRANCH_USER` → role grants ∩ branch scope (resources outside scope denied).

Branch isolation: non-super-admin requests are hard-scoped to `user.branchId`;
`branchId` in the body is ignored for Branch Admins.

## Backend files

- `src/lib/rbac.ts` — auth layer: token verify, `getRbacUser` (DB re-derive), `buildPermissionMap`, guards (`requireAuth`/`requireGlobalRole`/`requireResourceAction`), `branchScopeWhere`, `validateGrantsAgainstScope`, `resolveTargetBranchId`.
- `src/config/rbac.ts` — `RESOURCES`, `ACTIONS`, map helpers.
- `src/lib/prisma.ts` — Prisma singleton.

## Frontend files

- Redux: `src/lib/redux/features/rbac/{rbacSlice,rbacTypes,rbacSelectors}.ts` (wired in `store.ts`).
  - `selectCan(resource, action)`, `selectIsSuperAdmin` for button gating.
- Loader: `src/services/rbac.service.ts` + `src/hooks/useRbacPermissions.ts`.
- Types: `src/types/rbac/rbac.ts` (`scopeToMap`/`mapToScope`).
- Components `src/components/admin/RBAC/`:
  - `shared/RbacRouteGuard.tsx` (role-gated page wrapper).
  - `shared/ResourcePermissionMatrix.tsx` (resource × action grid; `scope` prop constrains to branch ceiling).
  - `Branches/BranchRbacManager.tsx` + `BranchFormModal.tsx`.
  - `Roles/BranchRolesManager.tsx` + `BranchRoleFormModal.tsx`.
  - `Users/BranchUsersManager.tsx` + `BranchUserFormModal.tsx`.
- Pages `src/app/admin/(rbac)/rbac/{branches,roles,users}/page.tsx`.
- Nav: `src/utils/getMenuItems.ts` → "Access Control → Branch RBAC".

## Seed logins (`password123`)

| Email | Role | Branch / scope |
|---|---|---|
| `superadmin@demo.com` | SUPER_ADMIN | global |
| `admin.a@demo.com` | BRANCH_ADMIN | BR-A (orders C/R/U/export, products R) |
| `staff.a@demo.com` | BRANCH_USER | BR-A, role `orders:[read]` |
| `admin.b@demo.com` | BRANCH_ADMIN | BR-B (orders R, products C/R) — isolated |

## Notes / TODO

- Sidebar RBAC group currently shows for any admin (page guard still blocks unauthorized roles). To hide by `globalRole`, wire the `rbac` slice into `SidebarMenu`.
- Role `name` is globally unique → branch role names are namespaced with the branch code (UI strips the prefix for display).
