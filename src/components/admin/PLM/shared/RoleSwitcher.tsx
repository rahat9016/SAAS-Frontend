"use client";

import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { setUserProfile } from "@/src/lib/redux/features/plm/plmSlice";
import { PLM_ROLE_LABELS, PLM_ROLE_COLORS } from "@/src/constants/plm/plmConstants";
import { PLM_USER_PRESETS } from "@/src/types/plm/plmPermissions";
import { hasPermission } from "@/src/types/plm/plmPermissions";
import {
  ChevronDown,
  Shield,
  User,
  MapPin,
  Layers,
  Settings,
  Lock,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const DEV_MODE = process.env.NEXT_PUBLIC_PLM_DEV_MODE === "true";

export default function RoleSwitcher() {
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector((state) => state.plm.userProfile);
  const authUser = useAppSelector((state) => state.auth.userInformation);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // If auth user has real PLM roles (from backend), the profile is locked — no switcher needed
  const isRealAuthProfile =
    !!authUser?.id &&
    !!authUser?.plmRoles &&
    authUser.plmRoles.length > 0;

  const isSuperAdmin = hasPermission(userProfile.roles, "plm.branch.create");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activePreset = PLM_USER_PRESETS.find(
    (p) =>
      p.userId === userProfile.id &&
      JSON.stringify([...p.roles].sort()) ===
        JSON.stringify([...userProfile.roles].sort())
  );

  const isMultiRole = userProfile.roles.length > 1;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ── Trigger ─────────────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isRealAuthProfile && !DEV_MODE}
        className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-gray-200 bg-white transition-colors ${
          isRealAuthProfile && !DEV_MODE
            ? "cursor-default"
            : "hover:bg-gray-50 cursor-pointer"
        }`}
      >
        <div
          className={`w-7 h-7 rounded-md ${
            PLM_ROLE_COLORS[userProfile.roles[0]] ?? "bg-gray-400"
          } flex items-center justify-center`}
        >
          <Shield className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider leading-none mb-0.5">
            {isMultiRole ? "Multi-Role" : "Active Role"}
          </p>
          <p className="text-xs font-semibold text-gray-700 leading-none truncate">
            {userProfile.name}
          </p>
        </div>
        {isRealAuthProfile && !DEV_MODE ? (
          <Lock className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
        ) : (
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {/* ── Dropdown ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-50 overflow-hidden"
            style={{ minWidth: "290px" }}
          >
            {/* Current profile info */}
            <div className="px-3 py-2.5 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2 mb-1.5">
                <User className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs font-semibold text-gray-700">
                  {userProfile.name}
                </span>
                {isRealAuthProfile && (
                  <span className="ml-auto text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full uppercase">
                    Live Auth
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                {userProfile.roles.map((role) => (
                  <span
                    key={role}
                    className={`text-[10px] font-medium text-white px-1.5 py-0.5 rounded ${PLM_ROLE_COLORS[role]}`}
                  >
                    {PLM_ROLE_LABELS[role]}
                  </span>
                ))}
              </div>
              {userProfile.branchName && (
                <div className="flex items-center gap-1 mt-1.5">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span className="text-[10px] text-gray-500">
                    {userProfile.branchName}
                  </span>
                </div>
              )}

              {/* Manage Roles link — Super Admin only */}
              {isSuperAdmin && (
                <Link
                  href="/admin/plm/roles"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-1 mt-2 text-[10px] font-semibold text-primary hover:underline"
                >
                  <Settings className="w-3 h-3" />
                  Manage PLM Roles & Assignments
                </Link>
              )}
            </div>

            {/* Dev Mode Presets */}
            {DEV_MODE && (
              <div className="p-1 max-h-[320px] overflow-y-auto">
                <p className="px-2 py-1.5 text-[10px] font-semibold text-amber-500 uppercase tracking-wider flex items-center gap-1">
                  <Layers className="w-3 h-3" /> Dev Mode — Switch Profile
                </p>
                {PLM_USER_PRESETS.map((preset) => {
                  const isActive = activePreset?.id === preset.id;
                  const isMulti = preset.roles.length > 1;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        dispatch(
                          setUserProfile({
                            id: preset.userId,
                            name: preset.userName,
                            roles: preset.roles,
                            branchId: preset.branchId,
                            branchName: preset.branchName,
                          })
                        );
                        setIsOpen(false);
                      }}
                      className={`flex items-start gap-2 w-full px-2 py-2 rounded-md text-left transition-colors cursor-pointer ${
                        isActive
                          ? "bg-primary/10 ring-1 ring-primary/20"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-md ${
                          PLM_ROLE_COLORS[preset.roles[0]]
                        } flex items-center justify-center flex-shrink-0 mt-0.5`}
                      >
                        <Shield className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-gray-700 truncate">
                            {preset.label}
                          </span>
                          {isMulti && (
                            <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full uppercase">
                              Multi
                            </span>
                          )}
                          {isActive && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">
                          {preset.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* When not in dev mode and using real auth — show info */}
            {!DEV_MODE && isRealAuthProfile && (
              <div className="p-3 text-center text-[10px] text-gray-400">
                Role is set from your account profile.
              </div>
            )}

            {/* When not in dev mode but no real auth — show legacy presets with warning */}
            {!DEV_MODE && !isRealAuthProfile && (
              <div className="p-1 max-h-[320px] overflow-y-auto">
                <p className="px-2 py-1.5 text-[10px] font-semibold text-orange-500 uppercase tracking-wider flex items-center gap-1">
                  <Layers className="w-3 h-3" /> No Live Auth — Using Presets
                </p>
                {PLM_USER_PRESETS.map((preset) => {
                  const isActive = activePreset?.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        dispatch(
                          setUserProfile({
                            id: preset.userId,
                            name: preset.userName,
                            roles: preset.roles,
                            branchId: preset.branchId,
                            branchName: preset.branchName,
                          })
                        );
                        setIsOpen(false);
                      }}
                      className={`flex items-start gap-2 w-full px-2 py-2 rounded-md text-left transition-colors cursor-pointer ${
                        isActive ? "bg-primary/10" : "hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-md ${
                          PLM_ROLE_COLORS[preset.roles[0]]
                        } flex items-center justify-center flex-shrink-0 mt-0.5`}
                      >
                        <Shield className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-gray-700 truncate">
                            {preset.label}
                          </span>
                          {preset.roles.length > 1 && (
                            <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full uppercase">
                              Multi
                            </span>
                          )}
                          {isActive && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">
                          {preset.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
