import { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Star,
  Home,
  DollarSign,
  Users,
  Award,
  TrendingUp as Trending,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import api from "@/services/api";
import type { NeighborhoodStats, HostRanking, TrendingProperty } from "@/types";

type SortConfig<T> = {
  key: keyof T;
  direction: "asc" | "desc";
} | null;

export default function Statistics() {
  const [stats, setStats] = useState<NeighborhoodStats[]>([]);
  const [hostRankings, setHostRankings] = useState<HostRanking[]>([]);
  const [trendingProperties, setTrendingProperties] = useState<
    TrendingProperty[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Estados de ordenação para cada tabela
  const [statsSortConfig, setStatsSortConfig] =
    useState<SortConfig<NeighborhoodStats>>(null);
  const [hostsSortConfig, setHostsSortConfig] =
    useState<SortConfig<HostRanking>>(null);
  const [trendingSortConfig, setTrendingSortConfig] =
    useState<SortConfig<TrendingProperty>>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsData, hostsData, trendingData] = await Promise.all([
          api.getNeighborhoodStats(),
          api.getHostRanking(),
          api.getTrendingProperties(),
        ]);
        setStats(statsData);

        // Adicionar ranking original aos dados de hosts
        const hostsWithRank = hostsData.map((host, index) => ({
          ...host,
          originalRank: index + 1,
        }));
        setHostRankings(hostsWithRank);

        // Adicionar ranking original aos dados de trending
        const trendingWithRank = trendingData.map((property, index) => ({
          ...property,
          originalRank: index + 1,
        }));
        setTrendingProperties(trendingWithRank);
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Função genérica de ordenação
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

  // Handlers de ordenação para cada tabela
  const handleStatsSort = (key: keyof NeighborhoodStats) => {
    setStatsSortConfig((current) => {
      if (current?.key === key) {
        if (current.direction === "asc") {
          return { key, direction: "desc" };
        }
        return null; // Remove ordenação
      }
      return { key, direction: "asc" };
    });
  };

  const handleHostsSort = (key: keyof HostRanking) => {
    setHostsSortConfig((current) => {
      if (current?.key === key) {
        if (current.direction === "asc") {
          return { key, direction: "desc" };
        }
        return null;
      }
      return { key, direction: "asc" };
    });
  };

  const handleTrendingSort = (key: keyof TrendingProperty) => {
    setTrendingSortConfig((current) => {
      if (current?.key === key) {
        if (current.direction === "asc") {
          return { key, direction: "desc" };
        }
        return null;
      }
      return { key, direction: "asc" };
    });
  };

  // Componente de cabeçalho de coluna ordenável
  const SortableHeader = <T,>({
    children,
    sortKey,
    currentSort,
    onSort,
    align = "left",
  }: {
    children: React.ReactNode;
    sortKey: string;
    currentSort: SortConfig<T>;
    onSort: () => void;
    align?: "left" | "right";
  }) => {
    const isActive = currentSort?.key === sortKey;
    const direction = currentSort?.direction;

    return (
      <th
        className={`px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors select-none ${
          align === "right" ? "text-right" : ""
        }`}
        onClick={onSort}
      >
        <div
          className={`flex items-center gap-1 ${
            align === "right" ? "justify-end" : ""
          }`}
        >
          {children}
          {isActive ? (
            direction === "asc" ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )
          ) : (
            <ArrowUpDown className="h-3 w-3 opacity-40" />
          )}
        </div>
      </th>
    );
  };

  // Aplicar ordenação aos dados
  const sortedStats = useMemo(
    () => sortData(stats, statsSortConfig),
    [stats, statsSortConfig]
  );
  const sortedHosts = useMemo(
    () => sortData(hostRankings, hostsSortConfig),
    [hostRankings, hostsSortConfig]
  );
  const sortedTrending = useMemo(
    () => sortData(trendingProperties, trendingSortConfig),
    [trendingProperties, trendingSortConfig]
  );

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto" />
          <p className="mt-4 text-gray-600">Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  // Calcular totais gerais (simula Consulta 8)
  // TODO: Quando backend estiver ativo, chamar api.getOverviewStats() ao invés de calcular localmente
  const totalListings = stats.reduce((sum, s) => sum + s.totalListings, 0);
  const overallAvgPrice = Math.round(
    stats.reduce((sum, s) => sum + s.averagePrice * s.totalListings, 0) /
      totalListings
  );
  const overallAvgRating = (
    stats.reduce((sum, s) => sum + s.averageRating * s.totalListings, 0) /
    totalListings
  ).toFixed(2);

  // Total de usuários seria obtido da Consulta 8 modificada (com JOIN em Usuario)
  // Por enquanto, estimativa baseada em reviews médios
  const estimatedTotalUsers = Math.round(totalListings * 0.6); // Estimativa: 60% das propriedades tem reviews

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Estatísticas Gerais
          </h2>
          <p className="text-sm text-gray-600">
            Análise agregada dos dados de acomodações no Rio de Janeiro
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Home className="h-4 w-4 text-rose-500" />
                Total de Acomodações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {totalListings}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Distribuídas em {stats.length} bairros
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                Usuários Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {estimatedTotalUsers}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Com avaliações registradas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                Preço Médio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                R$ {overallAvgPrice}
              </div>
              <p className="text-xs text-gray-500 mt-1">Por noite</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                Avaliação Média
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {overallAvgRating}
              </div>
              <p className="text-xs text-gray-500 mt-1">De 5.0 estrelas</p>
            </CardContent>
          </Card>
        </div>

        {/* Price Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Preço Médio por Bairro
            </CardTitle>
            <CardDescription>
              Comparação de preços médios entre os principais bairros
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={stats}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="neighborhood"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  label={{ value: "R$", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  formatter={(value: number) => `R$ ${value}`}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="averagePrice"
                  fill="#E11D48"
                  name="Preço Médio (R$)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Rating Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Avaliação Média por Bairro
            </CardTitle>
            <CardDescription>
              Comparação de avaliações médias entre os principais bairros
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={stats}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="neighborhood"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  domain={[0, 5]}
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Estrelas",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  formatter={(value: number) => `${value} ⭐`}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="averageRating"
                  fill="#F59E0B"
                  name="Avaliação Média"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Detailed Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhes por Bairro</CardTitle>
            <CardDescription>
              Visão completa das métricas de cada bairro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 rounded-lg sticky top-0 z-10">
                  <tr>
                    <SortableHeader
                      sortKey="neighborhood"
                      currentSort={statsSortConfig}
                      onSort={() => handleStatsSort("neighborhood")}
                    >
                      Bairro
                    </SortableHeader>
                    <SortableHeader
                      sortKey="totalListings"
                      currentSort={statsSortConfig}
                      onSort={() => handleStatsSort("totalListings")}
                      align="right"
                    >
                      Acomodações
                    </SortableHeader>
                    <SortableHeader
                      sortKey="averagePrice"
                      currentSort={statsSortConfig}
                      onSort={() => handleStatsSort("averagePrice")}
                      align="right"
                    >
                      Preço Médio
                    </SortableHeader>
                    <SortableHeader
                      sortKey="averageRating"
                      currentSort={statsSortConfig}
                      onSort={() => handleStatsSort("averageRating")}
                      align="right"
                    >
                      Avaliação
                    </SortableHeader>
                    <SortableHeader
                      sortKey="averageCapacity"
                      currentSort={statsSortConfig}
                      onSort={() => handleStatsSort("averageCapacity")}
                      align="right"
                    >
                      Capacidade
                    </SortableHeader>
                    <SortableHeader
                      sortKey="averageBedrooms"
                      currentSort={statsSortConfig}
                      onSort={() => handleStatsSort("averageBedrooms")}
                      align="right"
                    >
                      Quartos
                    </SortableHeader>
                    <SortableHeader
                      sortKey="averageBathrooms"
                      currentSort={statsSortConfig}
                      onSort={() => handleStatsSort("averageBathrooms")}
                      align="right"
                    >
                      Banheiros
                    </SortableHeader>
                    <SortableHeader
                      sortKey="averageReviews"
                      currentSort={statsSortConfig}
                      onSort={() => handleStatsSort("averageReviews")}
                      align="right"
                    >
                      Reviews
                    </SortableHeader>
                    <SortableHeader
                      sortKey="superhostCount"
                      currentSort={statsSortConfig}
                      onSort={() => handleStatsSort("superhostCount")}
                      align="right"
                    >
                      Superhosts
                    </SortableHeader>
                    <SortableHeader
                      sortKey="verifiedCount"
                      currentSort={statsSortConfig}
                      onSort={() => handleStatsSort("verifiedCount")}
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
          </CardContent>
        </Card>

        {/* Trending Properties */}
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
          <CardContent>
            <div className="relative overflow-x-auto max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 rounded-lg sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3">Rank</th>
                    <SortableHeader
                      sortKey="propertyName"
                      currentSort={trendingSortConfig}
                      onSort={() => handleTrendingSort("propertyName")}
                    >
                      Propriedade
                    </SortableHeader>
                    <SortableHeader
                      sortKey="neighborhood"
                      currentSort={trendingSortConfig}
                      onSort={() => handleTrendingSort("neighborhood")}
                    >
                      Bairro
                    </SortableHeader>
                    <SortableHeader
                      sortKey="hostName"
                      currentSort={trendingSortConfig}
                      onSort={() => handleTrendingSort("hostName")}
                    >
                      Anfitrião
                    </SortableHeader>
                    <SortableHeader
                      sortKey="recentReviewsCount"
                      currentSort={trendingSortConfig}
                      onSort={() => handleTrendingSort("recentReviewsCount")}
                      align="right"
                    >
                      Reviews (6m)
                    </SortableHeader>
                    <SortableHeader
                      sortKey="uniqueReviewers"
                      currentSort={trendingSortConfig}
                      onSort={() => handleTrendingSort("uniqueReviewers")}
                      align="right"
                    >
                      Reviewers
                    </SortableHeader>
                    <SortableHeader
                      sortKey="rating"
                      currentSort={trendingSortConfig}
                      onSort={() => handleTrendingSort("rating")}
                      align="right"
                    >
                      Avaliação
                    </SortableHeader>
                    <SortableHeader
                      sortKey="price"
                      currentSort={trendingSortConfig}
                      onSort={() => handleTrendingSort("price")}
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
          </CardContent>
        </Card>

        {/* Top Hosts Ranking */}
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
          <CardContent>
            <div className="relative overflow-x-auto max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 rounded-lg sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3">Rank</th>
                    <SortableHeader
                      sortKey="hostName"
                      currentSort={hostsSortConfig}
                      onSort={() => handleHostsSort("hostName")}
                    >
                      Anfitrião
                    </SortableHeader>
                    <SortableHeader
                      sortKey="neighborhood"
                      currentSort={hostsSortConfig}
                      onSort={() => handleHostsSort("neighborhood")}
                    >
                      Bairro
                    </SortableHeader>
                    <SortableHeader
                      sortKey="totalProperties"
                      currentSort={hostsSortConfig}
                      onSort={() => handleHostsSort("totalProperties")}
                      align="right"
                    >
                      Propriedades
                    </SortableHeader>
                    <SortableHeader
                      sortKey="avgRating"
                      currentSort={hostsSortConfig}
                      onSort={() => handleHostsSort("avgRating")}
                      align="right"
                    >
                      Avaliação
                    </SortableHeader>
                    <SortableHeader
                      sortKey="totalReviews"
                      currentSort={hostsSortConfig}
                      onSort={() => handleHostsSort("totalReviews")}
                      align="right"
                    >
                      Total Reviews
                    </SortableHeader>
                    <SortableHeader
                      sortKey="avgPrice"
                      currentSort={hostsSortConfig}
                      onSort={() => handleHostsSort("avgPrice")}
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
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
