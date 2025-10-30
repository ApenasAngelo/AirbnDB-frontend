import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import InteractiveMap from "@/components/InteractiveMap";
import PropertyDetails from "@/components/PropertyDetails";
import PropertyList from "@/components/PropertyList";
import SearchFilters from "@/components/SearchFilters";
import Statistics from "@/components/Statistics";
import api from "@/services/api";
import type { Listing, HeatmapMode, HeatmapPoint } from "@/types";
import type { SearchFiltersState } from "@/types/filters";

export default function MapPage() {
  const navigate = useNavigate();
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [heatmapMode, setHeatmapMode] = useState<HeatmapMode>("none");
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [densityHeatmapData, setDensityHeatmapData] = useState<HeatmapPoint[]>(
    []
  );
  const [priceHeatmapData, setPriceHeatmapData] = useState<HeatmapPoint[]>([]);
  const [filters, setFilters] = useState<SearchFiltersState>({
    minPrice: null,
    maxPrice: null,
    neighborhoods: [],
    minRating: null,
    minCapacity: null,
    minReviews: null,
    superhostOnly: false,
  });

  // useEffect para buscar listings com filtros sempre que mudam
  useEffect(() => {
    const searchWithFilters = async () => {
      // Verificar se algum filtro está ativo
      const hasActiveFilters =
        filters.minPrice ||
        filters.maxPrice ||
        filters.neighborhoods.length > 0 ||
        filters.minRating ||
        filters.minCapacity ||
        filters.minReviews ||
        filters.superhostOnly;

      // Se não há filtros ativos, usar todos os listings
      if (!hasActiveFilters) {
        setFilteredListings(allListings);
        return;
      }

      // Fazer busca com filtros via API
      setSearchLoading(true);
      try {
        const results = await api.searchListings({
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          neighborhoods: filters.neighborhoods,
          minRating: filters.minRating,
          minCapacity: filters.minCapacity,
          minReviews: filters.minReviews,
          superhostOnly: filters.superhostOnly,
        });
        setFilteredListings(results);
      } catch (error) {
        console.error("Erro ao buscar com filtros:", error);
        setFilteredListings([]);
      } finally {
        setSearchLoading(false);
      }
    };

    searchWithFilters();
  }, [allListings, filters]);

  // Extrair bairros únicos para o filtro
  const availableNeighborhoods = useMemo(() => {
    const neighborhoods = Array.from(
      new Set(allListings.map((l) => l.property.neighborhood))
    );
    return neighborhoods.sort();
  }, [allListings]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingsData, densityData, priceData] = await Promise.all([
          api.getListings(),
          api.getDensityHeatmap(),
          api.getPriceHeatmap(),
        ]);

        setAllListings(listingsData);
        setFilteredListings(listingsData);
        setDensityHeatmapData(densityData);
        setPriceHeatmapData(priceData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFullWidthToggle = () => {
    setIsFullWidth(!isFullWidth);
  };

  const handleListingSelect = (listing: Listing | null) => {
    setSelectedListing(listing);
  };

  const handleDeselectListing = () => {
    setSelectedListing(null);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-rose-500 mx-auto" />
          <p className="mt-4 text-lg text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b bg-white shadow-sm z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="hover:bg-gray-100"
            >
              <Home className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Dashboard de Acomodações
              </h1>
              <p className="text-sm text-gray-500">
                {filteredListings.length} de {allListings.length} acomodações
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-600">Rio de Janeiro</p>
            <p className="text-xs text-gray-500">Dados do Airbnb</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Search/Details Panel */}
          {!isFullWidth && (
            <ResizablePanel defaultSize={40} minSize={25}>
              <Tabs defaultValue="search" className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
                  <TabsTrigger value="search">Buscar</TabsTrigger>
                  <TabsTrigger value="statistics">Estatísticas</TabsTrigger>
                </TabsList>

                <TabsContent
                  value="search"
                  className="flex-1 mt-0 overflow-hidden flex flex-col"
                >
                  {/* Botão Voltar quando propriedade selecionada */}
                  {selectedListing && (
                    <div className="px-4 pt-4 pb-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDeselectListing}
                        className="w-full justify-start gap-2 hover:bg-gray-100"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Voltar para resultados
                      </Button>
                    </div>
                  )}

                  {/* Filtros e Lista de Propriedades */}
                  {!selectedListing ? (
                    <div className="flex-1 overflow-hidden flex flex-col">
                      <SearchFilters
                        filters={filters}
                        onFiltersChange={setFilters}
                        availableNeighborhoods={availableNeighborhoods}
                        isLoading={searchLoading}
                      />
                      <div className="flex-1 overflow-hidden">
                        <PropertyList
                          listings={filteredListings}
                          onListingSelect={handleListingSelect}
                          isLoading={searchLoading}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-hidden">
                      <PropertyDetails listing={selectedListing} />
                    </div>
                  )}
                </TabsContent>

                <TabsContent
                  value="statistics"
                  className="flex-1 mt-0 overflow-hidden"
                >
                  <Statistics />
                </TabsContent>
              </Tabs>
            </ResizablePanel>
          )}

          {/* Resizable Handle */}
          {!isFullWidth && (
            <ResizableHandle className="w-1 bg-gray-200 hover:bg-rose-300 transition-colors" />
          )}

          {/* Map Panel */}
          <ResizablePanel
            defaultSize={isFullWidth ? 100 : 60}
            minSize={30}
            className="relative"
          >
            <InteractiveMap
              listings={filteredListings}
              selectedListing={selectedListing}
              onListingSelect={handleListingSelect}
              heatmapMode={heatmapMode}
              onHeatmapModeChange={setHeatmapMode}
              onFullWidthToggle={handleFullWidthToggle}
              isFullWidth={isFullWidth}
              densityHeatmapData={densityHeatmapData}
              priceHeatmapData={priceHeatmapData}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
