import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatisticsSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-full">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-24 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Price Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-6 w-56" />
          </div>
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>

      {/* Rating Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-6 w-64" />
          </div>
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 rounded-lg sticky top-0 z-1">
                  <tr>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <th key={i} className="px-4 py-3">
                        <Skeleton className="h-3 w-16" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 8 }).map((_, rowIndex) => (
                    <tr key={rowIndex} className="border-b">
                      {Array.from({ length: 10 }).map((_, colIndex) => (
                        <td key={colIndex} className="px-4 py-3">
                          <Skeleton className="h-4 w-full" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trending Properties */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-6 w-80" />
          </div>
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 rounded-lg sticky top-0 z-1">
                  <tr>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <th key={i} className="px-4 py-3">
                        <Skeleton className="h-3 w-20" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, rowIndex) => (
                    <tr key={rowIndex} className="border-b">
                      {Array.from({ length: 8 }).map((_, colIndex) => (
                        <td key={colIndex} className="px-4 py-3">
                          <Skeleton className="h-4 w-full" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Hosts Ranking */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-6 w-64" />
          </div>
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 rounded-lg sticky top-0 z-1">
                  <tr>
                    {Array.from({ length: 7 }).map((_, i) => (
                      <th key={i} className="px-4 py-3">
                        <Skeleton className="h-3 w-20" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, rowIndex) => (
                    <tr key={rowIndex} className="border-b">
                      {Array.from({ length: 7 }).map((_, colIndex) => (
                        <td key={colIndex} className="px-4 py-3">
                          <Skeleton className="h-4 w-full" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
