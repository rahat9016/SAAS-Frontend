interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number; dataKey: string }[];
  label?: string;
}

export default function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 min-w-[160px]">
        <p className="text-xs font-medium text-gray-400 mb-1.5">{label}</p>
        {payload.map((entry) => (
          <div
            key={entry.dataKey}
            className="flex items-center justify-between gap-4"
          >
            <span className="text-sm text-gray-600 capitalize">
              {entry.dataKey}
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {entry.dataKey === "revenue"
                ? `৳${(entry.value / 1000).toFixed(0)}k`
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}
