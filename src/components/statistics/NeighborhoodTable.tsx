import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star } from "lucide-react";
import type { NeighborhoodStats } from "@/types";
import SortableHeader, { type SortConfig } from "./SortableHeader";

interface NeighborhoodTableProps {
  stats: NeighborhoodStats[];
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

export default function NeighborhoodTable({ stats }: NeighborhoodTableProps) {
  const [sortConfig, setSortConfig] =
    useState<SortConfig<NeighborhoodStats>>(null);

  const handleSort = (key: keyof NeighborhoodStats) => {
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

  const sortedStats = useMemo(
    () => sortData(stats, sortConfig),
    [stats, sortConfig]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhes por Bairro</CardTitle>
        <CardDescription>
          Visão completa das métricas de cada bairro
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 rounded-lg sticky top-0 z-1">
                <tr>
                  <SortableHeader
                    sortKey="neighborhood"
                    currentSort={sortConfig}
                    onSort={() => handleSort("neighborhood")}
                  >
                    Bairro
                  </SortableHeader>
                  <SortableHeader
                    sortKey="totalListings"
                    currentSort={sortConfig}
                    onSort={() => handleSort("totalListings")}
                    align="right"
                  >
                    Acomodações
                  </SortableHeader>
                  <SortableHeader
                    sortKey="averagePrice"
                    currentSort={sortConfig}
                    onSort={() => handleSort("averagePrice")}
                    align="right"
                  >
                    Preço Médio
                  </SortableHeader>
                  <SortableHeader
                    sortKey="averageRating"
                    currentSort={sortConfig}
                    onSort={() => handleSort("averageRating")}
                    align="right"
                  >
                    Avaliação
                  </SortableHeader>
                  <SortableHeader
                    sortKey="averageCapacity"
                    currentSort={sortConfig}
                    onSort={() => handleSort("averageCapacity")}
                    align="right"
                  >
                    Capacidade
                  </SortableHeader>
                  <SortableHeader
                    sortKey="averageBedrooms"
                    currentSort={sortConfig}
                    onSort={() => handleSort("averageBedrooms")}
                    align="right"
                  >
                    Quartos
                  </SortableHeader>
                  <SortableHeader
                    sortKey="averageBathrooms"
                    currentSort={sortConfig}
                    onSort={() => handleSort("averageBathrooms")}
                    align="right"
                  >
                    Banheiros
                  </SortableHeader>
                  <SortableHeader
                    sortKey="averageReviews"
                    currentSort={sortConfig}
                    onSort={() => handleSort("averageReviews")}
                    align="right"
                  >
                    Reviews
                  </SortableHeader>
                  <SortableHeader
                    sortKey="superhostCount"
                    currentSort={sortConfig}
                    onSort={() => handleSort("superhostCount")}
                    align="right"
                  >
                    Superhosts
                  </SortableHeader>
                  <SortableHeader
                    sortKey="verifiedCount"
                    currentSort={sortConfig}
                    onSort={() => handleSort("verifiedCount")}
                    align="right"
                  >
                    Verificados
                  </SortableHeader>
                </tr>
              </thead>
              <tbody>
                {sortedStats.map((stat, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {stat.neighborhood}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {stat.totalListings}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-green-600">
                      R$ {stat.averagePrice}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1">
                        {stat.averageRating > 0 ? (
                          <>
                            {stat.averageRating}
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          </>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {stat.averageCapacity}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {stat.averageBedrooms}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {stat.averageBathrooms}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {stat.averageReviews}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-rose-600 font-medium">
                        {stat.superhostCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-blue-600 font-medium">
                        {stat.verifiedCount}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
