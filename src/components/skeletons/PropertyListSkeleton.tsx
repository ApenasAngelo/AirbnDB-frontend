import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyListSkeleton() {
  return (
    <div className="p-3 space-y-3 pb-6">
      {/* Count placeholder */}
      <Skeleton className="h-5 w-40 mb-4" />

      {/* Property cards */}
      {Array.from({ length: 5 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-2.5 md:p-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0 space-y-2">
                {/* Title */}
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                {/* Location */}
                <div className="flex items-center gap-1">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>

              {/* Price */}
              <div className="text-right shrink-0 min-w-[60px] space-y-1">
                <Skeleton className="h-5 w-16 ml-auto" />
                <Skeleton className="h-3 w-12 ml-auto" />
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
              <Skeleton className="h-4 w-16 rounded-full" />
              <Skeleton className="h-4 w-20 rounded-full" />
              <Skeleton className="h-4 w-24 rounded-full" />
            </div>

            {/* Property Details */}
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-12" />
            </div>

            {/* Amenities */}
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="flex flex-wrap gap-1">
                <Skeleton className="h-4 w-16 rounded-full" />
                <Skeleton className="h-4 w-20 rounded-full" />
                <Skeleton className="h-4 w-12 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
