"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { useGet } from "@/src/hooks/useGet";
import { usePatch } from "@/src/hooks/usePatch";
import { useState } from "react";
import { toast } from "react-toastify";
import { mapToScope, scopeToMap, type RbacScopeEntry } from "@/src/types/rbac/rbac";
import ResourcePermissionMatrix, {
  type SelectedGrants,
} from "../../shared/ResourcePermissionMatrix";
import { RbacUser } from "../types";

interface Props {
  user: RbacUser | null;
  onClose: () => void;
}

interface PermissionsResponse {
  userId: string;
  permissions: RbacScopeEntry[];
}

export default function UserPermissionsModal({ user, onClose }: Props) {
  const isOpen = !!user;

  // Load current permissions; the editor remounts (via key) once loaded.
  const { data, isFetching } = useGet<PermissionsResponse>(
    `/api/branches/users/${user?.id}/permissions`,
    ["user-permissions", user?.id ?? ""],
    undefined,
    { enabled: isOpen },
  );
  const loaded = !isFetching;
  const serverPerms = (data?.data as PermissionsResponse | undefined)?.permissions;
  const initial = scopeToMap(serverPerms ?? user?.permissions ?? []);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            Permissions — {user ? [user.firstName, user.lastName].filter(Boolean).join(" ") : ""}
          </DialogTitle>
        </DialogHeader>
        {user && (
          <Editor
            key={`${user.id}-${loaded}`}
            userId={user.id}
            initial={initial}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function Editor({
  userId,
  initial,
  onClose,
}: {
  userId: string;
  initial: SelectedGrants;
  onClose: () => void;
}) {
  const [grants, setGrants] = useState<SelectedGrants>(initial);

  const { mutate, isPending } = usePatch(
    () => {
      toast.success("Permissions updated!");
      onClose();
    },
    [["rbac-users"], ["user-permissions"]],
  );

  const handleSave = () => {
    mutate({
      url: `/api/branches/users/${userId}/permissions`,
      data: { permissions: mapToScope(grants) },
    });
  };

  return (
    <>
      <p className="text-xs text-gray-400 mb-2">
        Choose which routes this user can access and which actions they can perform.
      </p>
      <ResourcePermissionMatrix selected={grants} onChange={setGrants} />
      <div className="flex items-center justify-end gap-4 mt-4">
        <Button
          type="button"
          onClick={onClose}
          className="text-secondary-foreground bg-transparent hover:bg-transparent border shadow-none cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="text-sm bg-primary hover:bg-primary/80 text-white cursor-pointer"
        >
          {isPending ? "Saving…" : "Save Permissions"}
        </Button>
      </div>
    </>
  );
}
