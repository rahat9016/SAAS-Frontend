"use client";

import DesignDetail from "@/src/components/admin/PLM/DesignTeam/DesignDetail";
import PlmRouteGuard from "@/src/components/admin/PLM/shared/PlmRouteGuard";
import { useParams } from "next/navigation";

export default function DesignDetailPage() {
  const params = useParams();
  const id = params.id as string;
  return (
    <PlmRouteGuard requiredPermission="plm.design.view">
      <DesignDetail designId={id} />
    </PlmRouteGuard>
  );
}
