"use client";

import { ShieldAlert, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";
import { PlmPermission } from "@/src/types/plm/plmPermissions";
import { PLM_ROLE_LABELS } from "@/src/constants/plm/plmConstants";
import { PlmRole } from "@/src/types/plm/productLifecycleTypes";
import { motion } from "framer-motion";

interface PlmAccessDeniedProps {
  permission: PlmPermission;
  currentRoles: PlmRole[];
}

export default function PlmAccessDenied({
  permission,
  currentRoles,
}: PlmAccessDeniedProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-[60vh] flex items-center justify-center"
    >
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center max-w-md shadow-sm">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
          <ShieldAlert className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Access Denied
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          You don&apos;t have the required permission to access this page.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <Lock className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-500">Required:</span>
            <code className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded font-mono">
              {permission}
            </code>
          </div>
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <ShieldAlert className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-500">Your roles:</span>
            {currentRoles.map((role) => (
              <span
                key={role}
                className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded"
              >
                {PLM_ROLE_LABELS[role]}
              </span>
            ))}
          </div>
        </div>

        <Button
          onClick={() => router.push("/admin/plm")}
          className="bg-primary hover:bg-primary/80 text-white text-sm gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Go to Dashboard
        </Button>
      </div>
    </motion.div>
  );
}
