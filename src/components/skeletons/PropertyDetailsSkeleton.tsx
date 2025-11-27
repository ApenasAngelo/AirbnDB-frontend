import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function PropertyDetailsSkeleton() {
  return (
    <div className="p-3 space-y-3 pb-6">
      {/* Header */}
      <div className="min-w-0 space-y-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      <Separator />

      {/* Price Card */}
      <Card className="bg-rose-50 border-rose-200 overflow-hidden">
        <CardContent className="pt-3 pb-3">
          <Skeleton className="h-8 w-32" />
        </CardContent>
      </Card>

      {/* Host Information */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-5 w-40" />
            <div className="flex gap-1.5">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-4 w-48" />
        </CardContent>
      </Card>

      {/* Property Details */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32 mt-2" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-20 rounded-full" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>

      {/* Link Button */}
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}
