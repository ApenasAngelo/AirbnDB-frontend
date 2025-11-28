import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp as Trending } from "lucide-react";
import type { TrendingProperty } from "@/types";
import SortableHeader, { type SortConfig } from "./SortableHeader";

interface TrendingPropertiesTableProps {
  trendingProperties: TrendingProperty[];
}

const sortData = <T,>(data: T[], config: SortConfig<T>): T[] => {
  if (!config) return data;

  return [...data].sort((a, b) => {
    const aValue = a[config.key];
    const bValue = b[config.key];

    if (aValue === bValue) return 0;

    const comparison = aValue > bValue ? 1 : -1;
    return config.direction === "asc" ? comparison : -comparison;
  });
};

export default function TrendingPropertiesTable({
  trendingProperties,
}: TrendingPropertiesTableProps) {
  const [sortConfig, setSortConfig] =
    useState<SortConfig<TrendingProperty>>(null);

  const handleSort = (key: keyof TrendingProperty) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        if (current.direction === "asc") {
          return { key, direction: "desc" };
        }
        return null;
      }
      return { key, direction: "asc" };
    });
  };

  const sortedTrending = useMemo(
    () => sortData(trendingProperties, sortConfig),
    [trendingProperties, sortConfig]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trending className="h-5 w-5" />
          Propriedades Mais Populares (Últimos 6 Meses)
        </CardTitle>
        <CardDescription>
          Propriedades com maior engajamento de avaliações recentes
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 rounded-lg sticky top-0 z-1">
                <tr>
                  <th className="px-4 py-3">Rank</th>
                  <SortableHeader
                    sortKey="propertyName"
                    currentSort={sortConfig}
                    onSort={() => handleSort("propertyName")}
                  >
                    Propriedade
                  </SortableHeader>
                  <SortableHeader
                    sortKey="neighborhood"
                    currentSort={sortConfig}
                    onSort={() => handleSort("neighborhood")}
                  >
                    Bairro
                  </SortableHeader>
                  <SortableHeader
                    sortKey="hostName"
                    currentSort={sortConfig}
                    onSort={() => handleSort("hostName")}
                  >
                    Anfitrião
                  </SortableHeader>
                  <SortableHeader
                    sortKey="recentReviewsCount"
                    currentSort={sortConfig}
                    onSort={() => handleSort("recentReviewsCount")}
                    align="right"
                  >
                    Reviews (6m)
                  </SortableHeader>
                  <SortableHeader
                    sortKey="uniqueReviewers"
                    currentSort={sortConfig}
                    onSort={() => handleSort("uniqueReviewers")}
                    align="right"
                  >
                    Reviewers
                  </SortableHeader>
                  <SortableHeader
                    sortKey="rating"
                    currentSort={sortConfig}
                    onSort={() => handleSort("rating")}
                    align="right"
                  >
                    Avaliação
                  </SortableHeader>
                  <SortableHeader
                    sortKey="price"
                    currentSort={sortConfig}
                    onSort={() => handleSort("price")}
                    align="right"
                  >
                    Preço
                  </SortableHeader>
                </tr>
              </thead>
              <tbody>
                {sortedTrending.map((property) => (
                  <tr
                    key={property.propertyId}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">
                          #{property.originalRank}
                        </span>
                        {property.originalRank !== undefined &&
                          property.originalRank <= 3 && (
                            <Trending className="h-4 w-4 text-rose-500" />
                          )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900 line-clamp-2">
                        {property.propertyName}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {property.neighborhood}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900">
                          {property.hostName}
                        </span>
                        {property.isSuperhost && (
                          <Badge variant="destructive" className="text-xs">
                            Superhost
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-rose-600">
                      {property.recentReviewsCount}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-blue-600">
                      {property.uniqueReviewers}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1">
                        {property.rating}
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-green-600">
                      R$ {property.price.toFixed(0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sortedTrending.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhuma propriedade encontrada
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
