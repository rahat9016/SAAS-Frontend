"use client";

import { useAppSelector } from "@/src/lib/redux/hooks";
import { useAppDispatch } from "@/src/lib/redux/hooks";
import { setSelectedBranch } from "@/src/lib/redux/features/plm/plmSlice";
import { MapPin } from "lucide-react";

interface BranchSelectorProps {
  showAll?: boolean;
}

export default function BranchSelector({ showAll = true }: BranchSelectorProps) {
  const dispatch = useAppDispatch();
  const branches = useAppSelector((state) => state.plm.branches);
  const selectedBranchId = useAppSelector(
    (state) => state.plm.selectedBranchId
  );

  return (
    <div className="flex items-center gap-2">
      <MapPin className="w-4 h-4 text-gray-400" />
      <select
        value={selectedBranchId || ""}
        onChange={(e) =>
          dispatch(setSelectedBranch(e.target.value || null))
        }
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
      >
        {showAll && <option value="">All Branches</option>}
        {branches.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.name}
          </option>
        ))}
      </select>
    </div>
  );
}
