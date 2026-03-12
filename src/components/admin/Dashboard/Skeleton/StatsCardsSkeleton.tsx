import { Skeleton } from "@/src/components/ui/skeleton";

export default function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 xl:gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="relative bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-4 xl:p-6 overflow-hidden"
        >
          {/* Icon placeholder */}
          <Skeleton className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-5 lg:right-5 w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl" />

          <div className="pr-12 sm:pr-14 lg:pr-16 space-y-2 sm:space-y-3">
            {/* Label */}
            <Skeleton className="h-3 sm:h-4 w-20 sm:w-24 rounded" />
            {/* Value */}
            <Skeleton className="h-6 sm:h-7 lg:h-8 w-28 sm:w-32 rounded" />
            {/* Badge */}
            <Skeleton className="h-5 w-16 sm:w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
