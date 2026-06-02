# Dynamic PLM Auth — Login-Based RBAC & ABAC

## What This Solves

The current system uses a **dev-mode profile switcher** — anyone can impersonate any role. This plan replaces it with:
1. **Real login** → JWT token carries the user's role(s) and branch assignment  
2. **Dynamic role creation** → Super Admin creates named roles and assigns granular PLM permissions  
3. **Dynamic user-role assignment** → Super Admin assigns roles to users per branch  
4. **RBAC enforcement** → every page and action checks the logged-in user's actual role set  
5. **ABAC enforcement** → branch-scoped data filtering based on JWT claims  

---

## Architecture Overview

```
Login (JWT)
    ↓
UserFetcher (decode token → user.plmRoles + user.branchId)
    ↓
Redux plmSlice.userProfile (replaces dev switcher)
    ↓
PlmRouteGuard (RBAC check)  +  Component filtering (ABAC check)
```

---

## Proposed Changes

### 1. Auth Layer — PLM Claims from JWT

#### [MODIFY] `src/lib/redux/features/auth/authTypes.ts`
Add `plmRoles` and `branchId` to `IUserInformation`:
```ts
export interface IUserInformation {
  // ... existing fields
  plmRoles: PlmRole[];      // NEW: e.g. ["BRANCH_MODERATOR", "DESIGN_TEAM"]
  branchId: string | null;  // NEW: ABAC branch assignment
  branchName: string | null; // NEW: for display
}
```

#### [MODIFY] `src/app/UserFetcher.tsx`
After user data is fetched, **auto-set the PLM user profile** from the JWT claims — removing the need for the dev switcher entirely:
```ts
// After isSuccess && data?.data:
dispatch(setUserProfile({
  id: data.data.id,
  name: `${data.data.firstName} ${data.data.lastName}`,
  roles: data.data.plmRoles || [],
  branchId: data.data.branchId || null,
  branchName: data.data.branchName || null,
}));
```

---

### 2. Dynamic Role Management Redux Slice

#### [NEW] `src/lib/redux/features/plm/plmRoleSlice.ts`

Manages dynamically created roles and their permissions:
```ts
interface IPlmCustomRole {
  id: string;
  name: string;           // e.g. "Senior Moderator"
  description: string;
  permissions: PlmPermission[];
  createdBy: string;
  createdAt: string;
}

interface IPlmRoleState {
  customRoles: IPlmCustomRole[];
  userRoleAssignments: IUserRoleAssignment[];
}

interface IUserRoleAssignment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  plmRoles: PlmRole[];
  branchId: string | null;
  branchName: string | null;
  assignedBy: string;
  assignedAt: string;
}
```

Reducers:
- `createCustomRole` — Super Admin creates a named role with permissions
- `updateCustomRole` — edit role permissions
- `deleteCustomRole`
- `assignRoleToUser` — Super Admin assigns PLM roles to a user for a branch
- `revokeRoleFromUser`

---

### 3. New Pages — Super Admin only

#### [NEW] `/admin/plm/roles` — Role Management Page
A full CRUD interface for managing PLM roles:
- **Role List table**: name, permissions count, assigned users, actions
- **Create Role modal**: name, description, + permission matrix checkboxes (all 16 permissions)
- **Edit Role**: same form pre-filled
- **Delete Role**: with confirmation

#### [NEW] `/admin/plm/role-assignments` — User-Role Assignments Page
Assign PLM roles to users:
- **Assignments table**: user name, email, assigned roles (badges), branch, assigned by
- **Assign Role form**: 
  - Search/select user (from existing users)
  - Select branch (dropdown)
  - Select PLM roles (multi-select checkboxes)
- **Revoke button** per assignment

---

### 4. Login Page — PLM-Aware Login

#### [MODIFY] `src/components/auth/Login/Login.tsx`
After successful login, detect if the logged-in user has PLM roles and redirect accordingly:
- Super Admin → `/admin/plm` (PLM Dashboard)
- Branch Moderator → `/admin/plm/moderation`
- Design Team → `/admin/plm/designs`
- Production/Inventory → their respective pages

---

### 5. RoleSwitcher → PLM Identity Display

#### [MODIFY] `src/components/admin/PLM/shared/RoleSwitcher.tsx`
Replace the dev dropdown entirely with a **read-only identity card** showing:
- User's real name from auth
- Their PLM roles (colored badges)
- Assigned branch name
- A small "⚙ Manage Roles" link (Super Admin only → `/admin/plm/roles`)

> The dev-mode presets are **removed** entirely (or kept behind a `NODE_ENV === 'development'` flag)

---

### 6. Menu & Guards — Driven by Auth

#### [MODIFY] `src/app/UserFetcher.tsx`
Dispatch `setUserProfile` from real auth data (as above)

#### [MODIFY] All route guards
`PlmRouteGuard` already works — no change needed since it reads from `state.plm.userProfile.roles` which is now set from real auth

---

### 7. Mock Data for Dev (Preserved)
Since backend might not have PLM role fields yet, keep dev presets **only** when `NEXT_PUBLIC_PLM_DEV_MODE=true` env var is set. In production, the switcher is hidden entirely.

---

## New Sidebar Menu Items (Super Admin only)

```
PRODUCT LIFECYCLE
├── PLM Dashboard
├── Approvals
│   ├── Approval Panel
│   └── All Branches
├── Role Management       ← NEW
│   ├── PLM Roles
│   └── User Assignments
├── Production
└── Inventory
```

---

## Data Flow

```
1. User logs in (email + password)
2. Backend returns JWT with:  { id, role, plmRoles: ["BRANCH_MODERATOR"], branchId: "dhk-01", branchName: "Dhaka Main" }
3. UserFetcher decodes token → dispatches setUserProfile({ roles: ["BRANCH_MODERATOR"], branchId: "dhk-01" })
4. Redux userProfile is set
5. SidebarMenu reads userProfile.roles → shows filtered menus
6. PlmRouteGuard reads userProfile.roles → enforces page access
7. Components read userProfile.branchId → ABAC filtering
```

---

## Open Questions

> [!IMPORTANT]
> **Backend readiness**: Does the backend currently return `plmRoles` and `branchId` in the user API response? If not, should we keep the dev switcher as a fallback when those fields are missing?

> [!IMPORTANT]
> **Role granularity**: Should custom roles (e.g. "Senior Moderator") be stored in the backend DB, or is client-side mock storage (Redux) sufficient for now?

> [!NOTE]
> **Dev mode**: I'll keep a `NEXT_PUBLIC_PLM_DEV_MODE=true` env flag that shows the preset switcher — so you can demo without a real backend.

---

## Verification Plan

1. `next build` passes
2. Login as Super Admin → PLM Dashboard + Role Management pages visible
3. Login as Branch Moderator → only Moderation pages visible, Approvals = Access Denied
4. Super Admin creates a new role "Senior Designer" with design.create + design.submit permissions
5. Super Admin assigns "Senior Designer" role to a user for Dhaka branch
6. That user logs in → sidebar shows only design pages, ABAC filters to Dhaka
7. Remove role assignment → user loses access immediately on next login
