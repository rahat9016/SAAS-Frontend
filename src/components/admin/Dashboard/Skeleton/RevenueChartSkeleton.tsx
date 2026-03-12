import { Skeleton } from "@/src/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";

export default function RevenueChartSkeleton() {
  return (
    <Card className="border-gray-100 shadow-sm rounded-2xl py-4 sm:py-5">
      <CardHeader className="pb-2 px-4 sm:px-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 sm:gap-3">
            <Skeleton className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 sm:h-5 w-32 sm:w-40 rounded" />
              <Skeleton className="h-3 w-44 sm:w-56 rounded" />
            </div>
          </div>
          <Skeleton className="hidden sm:block h-6 w-16 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="pt-2 px-2 sm:px-6">
        <Skeleton className="w-full h-[220px] sm:h-[280px] lg:h-[320px] rounded-xl" />
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <Skeleton className="w-3 h-3 rounded-full" />
            <Skeleton className="w-14 h-3 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-3 h-3 rounded-full" />
            <Skeleton className="w-12 h-3 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
