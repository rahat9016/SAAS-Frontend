import { Skeleton } from "@/src/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";

export default function RecentOrdersSkeleton() {
  return (
    <Card className="border-gray-100 shadow-sm rounded-2xl py-4 sm:py-5 h-full">
      <CardHeader className="pb-2 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 sm:h-5 w-28 sm:w-32 rounded" />
            <Skeleton className="h-3 w-32 sm:w-40 rounded" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 px-2 sm:px-6">
        {/* Mobile skeleton */}
        <div className="block sm:hidden space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50/70 border border-gray-100"
            >
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3.5 w-20 rounded" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>
                <Skeleton className="h-3 w-24 rounded" />
                <Skeleton className="h-2.5 w-20 rounded" />
              </div>
              <Skeleton className="h-5 w-16 rounded ml-3" />
            </div>
          ))}
        </div>

        {/* Desktop/tablet skeleton */}
        <div className="hidden sm:block">
          {/* Header row */}
          <div className="flex items-center gap-4 py-3 border-b border-gray-100">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-3 w-20 rounded hidden md:block" />
            <div className="flex-1" />
            <Skeleton className="h-3 w-14 rounded" />
            <Skeleton className="h-3 w-14 rounded" />
          </div>
          {/* Data rows */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 py-3.5 border-b border-gray-50"
            >
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-4 w-20 rounded hidden md:block" />
              <div className="flex-1" />
              <Skeleton className="h-4 w-16 rounded" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
