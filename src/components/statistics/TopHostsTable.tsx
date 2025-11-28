import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Star } from "lucide-react";
import type { HostRanking } from "@/types";
import SortableHeader, { type SortConfig } from "./SortableHeader";

interface TopHostsTableProps {
  hostRankings: HostRanking[];
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

export default function TopHostsTable({ hostRankings }: TopHostsTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig<HostRanking>>(null);

  const handleSort = (key: keyof HostRanking) => {
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

  const sortedHosts = useMemo(
    () => sortData(hostRankings, sortConfig),
    [hostRankings, sortConfig]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Top Anfitriões por Bairro
        </CardTitle>
        <CardDescription>
          Ranking dos melhores anfitriões com múltiplas propriedades
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
                    sortKey="hostName"
                    currentSort={sortConfig}
                    onSort={() => handleSort("hostName")}
                  >
                    Anfitrião
                  </SortableHeader>
                  <SortableHeader
                    sortKey="neighborhood"
                    currentSort={sortConfig}
                    onSort={() => handleSort("neighborhood")}
                  >
                    Bairro
                  </SortableHeader>
                  <SortableHeader
                    sortKey="totalProperties"
                    currentSort={sortConfig}
                    onSort={() => handleSort("totalProperties")}
                    align="right"
                  >
                    Propriedades
                  </SortableHeader>
                  <SortableHeader
                    sortKey="avgRating"
                    currentSort={sortConfig}
                    onSort={() => handleSort("avgRating")}
                    align="right"
                  >
                    Avaliação
                  </SortableHeader>
                  <SortableHeader
                    sortKey="totalReviews"
                    currentSort={sortConfig}
                    onSort={() => handleSort("totalReviews")}
                    align="right"
                  >
                    Total Reviews
                  </SortableHeader>
                  <SortableHeader
                    sortKey="avgPrice"
                    currentSort={sortConfig}
                    onSort={() => handleSort("avgPrice")}
                    align="right"
                  >
                    Preço Médio
                  </SortableHeader>
                </tr>
              </thead>
              <tbody>
                {sortedHosts.map((host) => (
                  <tr key={host.hostId} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">
                          #{host.originalRank}
                        </span>
                        {host.originalRank !== undefined &&
                          host.originalRank <= 3 && (
                            <Award className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {host.hostName}
                        </span>
                        {host.isSuperhost && (
                          <Badge variant="destructive" className="text-xs">
                            Superhost
                          </Badge>
                        )}
                        {host.verified && (
                          <Badge variant="outline" className="text-xs">
                            Verificado
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {host.neighborhood}
                      <span className="ml-2 text-xs text-gray-500">
                        (#{host.neighborhoodHostRank} no bairro)
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-blue-600">
                      {host.totalProperties}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1">
                        {host.avgRating}
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {host.totalReviews}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-green-600">
                      R$ {host.avgPrice.toFixed(0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sortedHosts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum anfitrião encontrado
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
