"use client";

import ControlledSelectField from "@/src/components/shared/FromController/ControlledSelectField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { selectIsSuperAdmin, selectRbac } from "@/src/lib/redux/features/rbac/rbacSelectors";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { mapToScope, scopeToMap } from "@/src/types/rbac/rbac";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import { mockRbacUsersList } from "../../Users/data/mockRbacUserData";
import ResourcePermissionMatrix, {
  type SelectedGrants,
} from "../../shared/ResourcePermissionMatrix";

const LIST_PATH = "/admin/rbac/permissions";

/** `userId` set = edit mode (fixed user); omitted = create mode (pick a user). */
export default function PermissionForm({ userId }: { userId?: string }) {
  const router = useRouter();
  const isSuperAdmin = useAppSelector(selectIsSuperAdmin);
  const rbac = useAppSelector(selectRbac);

  // Ceiling: a non-super-admin may only grant within their OWN permissions.
  const ceiling: SelectedGrants | undefined = useMemo(() => {
    if (isSuperAdmin) return undefined;
    const out: SelectedGrants = {};
    for (const [resource, actions] of Object.entries(rbac.permissions ?? {})) {
      const on = Object.entries(actions)
        .filter(([, v]) => v)
        .map(([k]) => k);
      if (on.length) out[resource] = on;
    }
    return out;
  }, [isSuperAdmin, rbac.permissions]);

  const methods = useForm<{ userId: string }>({
    defaultValues: { userId: userId ?? "" },
  });
  const selectedUserId = useWatch({ control: methods.control, name: "userId" }) || "";

  const users = mockRbacUsersList.filter((u) => !u.role?.isSuperAdmin);
  const userOptions = users.map((u) => ({
    label: `${[u.firstName, u.lastName].filter(Boolean).join(" ")} · ${u.email}${
      u.role?.name ? ` (${u.role.name})` : ""
    }`,
    value: u.id,
  }));
  const activeUser = users.find((u) => u.id === selectedUserId);
  const initial = scopeToMap(activeUser?.permissions ?? []);

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary">
            {userId ? "Edit Permission" : "Create Permission"}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Map which routes a user can access and which actions they can perform
          </p>
        </div>
        <Button
          type="button"
          onClick={() => router.push(LIST_PATH)}
          className="text-secondary-foreground bg-transparent hover:bg-transparent border shadow-none cursor-pointer"
        >
          Back
        </Button>
      </div>

      <div className="space-y-6">
        {/* Section 1 — User */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-secondary">User</h3>
            <p className="text-sm text-gray-400 mt-0.5">
              Select the user to map permissions to
            </p>
          </div>
          <div className="p-6">
            {userId ? (
              <p className="text-sm text-gray-700">
                <span className="font-semibold">
                  {activeUser
                    ? [activeUser.firstName, activeUser.lastName].filter(Boolean).join(" ")
                    : "—"}
                </span>
                {activeUser ? ` · ${activeUser.email}` : ""}
              </p>
            ) : (
              <FormProvider {...methods}>
                <div className="max-w-md">
                  <InputLabel label="User" required />
                  <ControlledSelectField
                    name="userId"
                    options={userOptions}
                    placeholder="Select a user to map"
                  />
                </div>
              </FormProvider>
            )}
          </div>
        </div>

        {/* Section 2 — Routes & Actions (always visible) */}
        <Editor
          key={selectedUserId}
          userId={selectedUserId}
          initial={initial}
          ceiling={ceiling}
          mode={userId ? "edit" : "create"}
          onSaved={() => router.push(LIST_PATH)}
        />
      </div>
    </div>
  );
}

function Editor({
  userId,
  initial,
  ceiling,
  mode,
  onSaved,
}: {
  userId: string;
  initial: SelectedGrants;
  ceiling?: SelectedGrants;
  mode: "create" | "edit";
  onSaved: () => void;
}) {
  const [grants, setGrants] = useState<SelectedGrants>(initial);

  const handleSave = () => {
    if (!userId) {
      toast.error("Select a user first");
      return;
    }
    // Written straight into the mock directory so the change survives the
    // redirect back to the list. Swap for the PATCH mutation once the RBAC
    // backend is live.
    const target = mockRbacUsersList.find((u) => u.id === userId);
    if (target) target.permissions = mapToScope(grants);
    toast.success("Permissions saved!");
    onSaved();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-secondary">Routes &amp; Actions</h3>
          <p className="text-sm text-gray-400 mt-0.5">
            Tick the actions this user can perform on each route
          </p>
        </div>
        <div className="p-6">
          <ResourcePermissionMatrix selected={grants} onChange={setGrants} scope={ceiling} />
        </div>
      </div>

      <div className="flex items-center justify-end">
        <SubmitButton
          isLoading={!userId}
          label={mode === "edit" ? "Update Permission" : "Create Permission"}
        />
      </div>
    </form>
  );
}
