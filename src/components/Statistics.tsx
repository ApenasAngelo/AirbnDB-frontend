import { useEffect, useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/services/api";
import type {
  NeighborhoodStats,
  HostRanking,
  TrendingProperty,
  OverviewStats,
} from "@/types";
import StatisticsSkeleton from "@/components/skeletons/StatisticsSkeleton";
import SummaryCards from "@/components/statistics/SummaryCards";
import PriceChart from "@/components/statistics/PriceChart";
import RatingChart from "@/components/statistics/RatingChart";
import NeighborhoodTable from "@/components/statistics/NeighborhoodTable";
import TrendingPropertiesTable from "@/components/statistics/TrendingPropertiesTable";
import TopHostsTable from "@/components/statistics/TopHostsTable";

export default function Statistics() {
  const [stats, setStats] = useState<NeighborhoodStats[]>([]);
  const [overviewStats, setOverviewStats] = useState<OverviewStats | null>(
    null
  );
  const [hostRankings, setHostRankings] = useState<HostRanking[]>([]);
  const [trendingProperties, setTrendingProperties] = useState<
    TrendingProperty[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Ref para prevenir chamadas duplicadas causadas pelo StrictMode
  const dataLoaded = useRef(false);

  useEffect(() => {
    // Prevenir execução duplicada causada pelo StrictMode
    if (dataLoaded.current) {
      return;
    }
    dataLoaded.current = true;

    const fetchStats = async () => {
      try {
        const [statsData, overviewData, hostsData, trendingData] =
          await Promise.all([
            api.getNeighborhoodStats(),
            api.getOverviewStats(),
            api.getHostRanking(),
            api.getTrendingProperties(),
          ]);
        setStats(statsData);
        setOverviewStats(overviewData);

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

  if (loading) {
    return (
      <ScrollArea className="h-full">
        <StatisticsSkeleton />
      </ScrollArea>
    );
  }

  // Verificar se os dados do overview estão disponíveis
  if (!overviewStats) {
    return (
      <ScrollArea className="h-full">
        <StatisticsSkeleton />
      </ScrollArea>
    );
  }

  // Calcular médias ponderadas a partir das estatísticas por bairro
  const totalListings = overviewStats.totalProperties;
  const overallAvgPrice = Math.round(
    stats.reduce((sum, s) => sum + s.averagePrice * s.totalListings, 0) /
      totalListings
  );
  const overallAvgRating = (
    stats.reduce((sum, s) => sum + s.averageRating * s.totalListings, 0) /
    totalListings
  ).toFixed(2);
  const overallAvgCapacity = (
    stats.reduce((sum, s) => sum + s.averageCapacity * s.totalListings, 0) /
    totalListings
  ).toFixed(1);
  const overallAvgBedrooms = (
    stats.reduce((sum, s) => sum + s.averageBedrooms * s.totalListings, 0) /
    totalListings
  ).toFixed(1);
  const overallAvgBathrooms = (
    stats.reduce((sum, s) => sum + s.averageBathrooms * s.totalListings, 0) /
    totalListings
  ).toFixed(1);
  const overallAvgReviews = (
    stats.reduce((sum, s) => sum + s.averageReviews * s.totalListings, 0) /
    totalListings
  ).toFixed(1);

  return (
    <ScrollArea className="h-full">
      <div className="p-4 md:p-6 space-y-6 max-w-full">
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
        <SummaryCards
          totalListings={overviewStats.totalProperties}
          estimatedTotalUsers={overviewStats.totalUsers}
          overallAvgPrice={overallAvgPrice}
          overallAvgRating={overallAvgRating}
          overallAvgCapacity={overallAvgCapacity}
          overallAvgBedrooms={overallAvgBedrooms}
          overallAvgBathrooms={overallAvgBathrooms}
          overallAvgReviews={overallAvgReviews}
          totalHosts={overviewStats.totalHosts}
          totalSuperhosts={overviewStats.totalSuperhosts}
          totalVerified={overviewStats.totalVerifiedHosts}
          totalNeighborhoods={overviewStats.totalNeighborhoods}
        />

        {/* Charts */}
        <PriceChart stats={stats} />
        <RatingChart stats={stats} />

        {/* Tables */}
        <NeighborhoodTable stats={stats} />
        <TrendingPropertiesTable trendingProperties={trendingProperties} />
        <TopHostsTable hostRankings={hostRankings} />
      </div>
    </ScrollArea>
  );
}
