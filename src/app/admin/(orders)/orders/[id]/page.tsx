"use client";

import OrderDetail from "@/src/components/admin/Orders/OrderDetail/OrderDetail";
import { use } from "react";

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <OrderDetail orderId={id} />;
}
