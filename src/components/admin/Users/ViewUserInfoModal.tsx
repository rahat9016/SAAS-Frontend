"use client";

import StatusBadge from "@/src/components/shared/Status/Status";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import { StatusType } from "@/src/types/common/common";
import { BadgeCheck, Mail, Phone, Shield, UserRound } from "lucide-react";
import Image from "next/image";
import { IUser } from "./types";

interface ViewUserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: IUser;
}

const labelClass = "text-xs uppercase tracking-wide text-gray-500 mb-1";
const valueClass = "text-sm font-medium text-secondary break-words";

export default function ViewUserInfoModal({
  isOpen,
  onClose,
  user,
}: ViewUserInfoModalProps) {
  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white sm:max-w-140">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            User Information
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-xl border border-light-dark bg-linear-to-br from-primary/5 via-white to-white p-5">
            <div className="flex items-center gap-4">
              {user?.profilePicture ? (
                <Image
                  src={user.profilePicture}
                  alt={fullName || "User"}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/20"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-base font-semibold text-gray-600 ring-2 ring-gray-300/60">
                  {(user?.firstName?.[0] || "U").toUpperCase()}
                </div>
              )}

              <div className="min-w-0">
                <p className="text-lg font-semibold text-secondary truncate">
                  {fullName || "N/A"}
                </p>
                <p className="text-sm text-secondary-gary truncate">
                  {user?.email || "N/A"}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <StatusBadge
                    status={user?.status as StatusType}
                    className="px-2.5 py-0.5 text-xs font-medium"
                  />
                  <StatusBadge
                    status={
                      user?.isVerified
                        ? StatusType.VERIFIED
                        : StatusType.UNVERIFIED
                    }
                    className="px-2.5 py-0.5 text-xs font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-light-dark p-4 bg-light/40">
              <p className={labelClass}>User ID</p>
              <p className={valueClass}>{user?.id || "-"}</p>
            </div>

            <div className="rounded-lg border border-light-dark p-4 bg-light/40">
              <p className={labelClass}>Role</p>
              <p className={valueClass}>{user?.role || "-"}</p>
            </div>

            <div className="rounded-lg border border-light-dark p-4 bg-light/40">
              <p className={labelClass}>Contact Email</p>
              <p className={valueClass + " flex items-center gap-2"}>
                <Mail className="h-4 w-4 text-secondary-gary" />
                {user?.email || "-"}
              </p>
            </div>

            <div className="rounded-lg border border-light-dark p-4 bg-light/40">
              <p className={labelClass}>Contact Phone</p>
              <p className={valueClass + " flex items-center gap-2"}>
                <Phone className="h-4 w-4 text-secondary-gary" />
                {user?.phone || "-"}
              </p>
            </div>

            <div className="rounded-lg border border-light-dark p-4 bg-light/40">
              <p className={labelClass}>Identity</p>
              <p className={valueClass + " flex items-center gap-2"}>
                <UserRound className="h-4 w-4 text-secondary-gary" />
                {fullName || "-"}
              </p>
            </div>

            <div className="rounded-lg border border-light-dark p-4 bg-light/40">
              <p className={labelClass}>Verification State</p>
              <p className={valueClass + " flex items-center gap-2"}>
                <BadgeCheck className="h-4 w-4 text-secondary-gary" />
                {user?.isVerified ? "Verified Account" : "Verification Pending"}
              </p>
            </div>

            <div className="rounded-lg border border-light-dark p-4 bg-light/40 md:col-span-2">
              <p className={labelClass}>Security & Access</p>
              <p className={valueClass + " flex items-center gap-2 capitalize"}>
                <Shield className="h-4 w-4 text-secondary-dark " />
                Role: {user?.role?.toLocaleLowerCase() || "-"} | Status: {user?.status || "-"}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
