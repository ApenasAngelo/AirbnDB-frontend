import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function HostProfileSkeleton() {
  return (
    <div className="p-3 space-y-3 pb-6">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-start gap-2 md:gap-3">
            <Skeleton className="w-12 h-12 md:w-16 md:h-16 rounded-full shrink-0" />
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton className="h-6 w-40" />
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>

      {/* Link Button */}
      <Skeleton className="h-10 w-full rounded-lg" />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="pt-3 md:pt-4 pb-3 md:pb-4 text-center px-1">
              <Skeleton className="h-8 w-12 mx-auto mb-2" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Properties Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-5 w-48" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-2.5 md:p-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
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
                <div className="flex items-center gap-1.5 mb-2">
                  <Skeleton className="h-4 w-16 rounded-full" />
                  <Skeleton className="h-4 w-20 rounded-full" />
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
      </div>
    </div>
  );
}
