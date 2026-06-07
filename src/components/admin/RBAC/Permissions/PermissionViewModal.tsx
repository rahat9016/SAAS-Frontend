"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { RbacUser } from "@/src/types/rbac/rbac";

interface Props {
  user: RbacUser | null;
  onClose: () => void;
}

export default function PermissionViewModal({ user, onClose }: Props) {
  const isOpen = !!user;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            Permission Details
          </DialogTitle>
        </DialogHeader>

        {user && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Detail label="Name" value={[user.firstName, user.lastName].filter(Boolean).join(" ")} />
              <Detail label="Email" value={user.email} />
              <Detail label="Role" value={user.role?.name ?? "—"} />
              <Detail label="Branch" value={user.branch?.code ?? "—"} />
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Routes & Actions
              </p>
              {user.role?.isSuperAdmin ? (
                <p className="text-sm text-amber-600">Super admin — full access to everything.</p>
              ) : (user.permissions?.length ?? 0) === 0 ? (
                <p className="text-sm text-gray-400 italic">No permissions assigned.</p>
              ) : (
                <div className="space-y-2">
                  {user.permissions.map((p) => (
                    <div
                      key={p.resource}
                      className="flex items-center gap-2 border border-gray-100 rounded-lg px-3 py-2"
                    >
                      <span className="text-sm font-semibold text-gray-700 capitalize w-28">
                        {p.resource}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {p.actions.map((a) => (
                          <span
                            key={a}
                            className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-gray-400 uppercase">{label}</p>
      <p className="text-sm text-gray-800">{value}</p>
    </div>
  );
}
