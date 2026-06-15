"use client";

import ModerationPanel from "@/src/components/admin/PLM/Moderator/ModerationPanel";
import PlmRouteGuard from "@/src/components/admin/PLM/shared/PlmRouteGuard";

export default function ModerationPage() {
  return (
    <PlmRouteGuard requiredPermission="plm.moderation.review">
      <ModerationPanel />
    </PlmRouteGuard>
  );
}
