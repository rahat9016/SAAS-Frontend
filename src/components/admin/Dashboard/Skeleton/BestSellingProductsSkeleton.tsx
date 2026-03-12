import { Skeleton } from "@/src/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";

export default function BestSellingProductsSkeleton() {
  return (
    <Card className="border-gray-100 shadow-sm rounded-2xl py-4 sm:py-5 h-full">
      <CardHeader className="pb-2 px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <Skeleton className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 sm:h-5 w-36 sm:w-44 rounded" />
            <Skeleton className="h-3 w-32 sm:w-40 rounded" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 px-3 sm:px-6">
        <div className="space-y-3 sm:space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-3">
              {/* Rank */}
              <Skeleton className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg shrink-0" />
              {/* Info */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3.5 sm:h-4 w-32 sm:w-44 rounded" />
                  <Skeleton className="h-3.5 sm:h-4 w-16 sm:w-20 rounded" />
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Skeleton className="flex-1 h-1 sm:h-1.5 rounded-full" />
                  <Skeleton className="h-3 w-10 sm:w-14 rounded shrink-0" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
