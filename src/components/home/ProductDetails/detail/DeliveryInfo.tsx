import { PackageCheck, RotateCcw, Truck } from "lucide-react";

interface DeliveryInfoProps {
  soldBy: string;
  range: string;
  cost: string;
}

/** Sold-by + delivery + perks block. */
export default function DeliveryInfo({ soldBy, range, cost }: DeliveryInfoProps) {
  return (
    <div className="rounded-xl border border-gray-200">
      <div className="border-b border-gray-100 px-4 py-3 text-sm text-gray-600">
        Sold and shipped by <span className="font-semibold text-secondary">{soldBy}</span>.
      </div>

      <div className="flex items-start gap-3 border-b border-gray-100 px-4 py-3">
        <Truck size={20} className="mt-0.5 shrink-0 text-secondary" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-secondary">{range}</p>
          <p className="text-xs text-gray-500">Standard delivery</p>
        </div>
        <span className="text-sm font-semibold text-secondary">{cost}</span>
      </div>

      <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
        <PackageCheck size={20} className="shrink-0 text-secondary" />
        <span className="text-sm font-semibold text-secondary">Free delivery and free returns</span>
      </div>

      <div className="flex items-center gap-3 px-4 py-3">
        <RotateCcw size={20} className="shrink-0 text-secondary" />
        <span className="text-sm font-semibold text-secondary">14 day return policy</span>
      </div>
    </div>
  );
}
