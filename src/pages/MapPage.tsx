import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import InteractiveMap from "@/components/InteractiveMap";
import PropertyDetails from "@/components/PropertyDetails";
import PropertyList from "@/components/PropertyList";
import SearchFilters from "@/components/SearchFilters";
import HostProfile from "@/components/HostProfile";
import api from "@/services/api";
import type { Listing, HeatmapMode, HeatmapPoint } from "@/types";
import type { SearchFiltersState } from "@/types/filters";

type ViewMode = "search" | "property" | "hostProfile";

export default function MapPage() {
  const navigate = useNavigate();
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [selectedHostId, setSelectedHostId] = useState<string | null>(null);
  const [previousListing, setPreviousListing] = useState<Listing | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("search");
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
    checkInDate: null,
    checkOutDate: null,
    minAvailableDays: null,
  });

  // Estados para paginação
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 100;

  // Refs para prevenir chamadas duplicadas causadas pelo StrictMode
  const initialDataLoaded = useRef(false);
  const filtersInitialized = useRef(false);

  // useEffect para buscar listings com filtros sempre que mudam
  // IMPORTANTE: Não incluir allListings nas dependências para evitar chamadas duplicadas!
  useEffect(() => {
    // Prevenir execução na primeira montagem (aguardar dados estáticos carregarem)
    if (!filtersInitialized.current) {
      filtersInitialized.current = true;
      return;
    }

    const searchWithFilters = async () => {
      // Verificar se algum filtro está ativo
      const hasActiveFilters =
        filters.minPrice ||
        filters.maxPrice ||
        filters.neighborhoods.length > 0 ||
        filters.minRating ||
        filters.minCapacity ||
        filters.minReviews ||
        filters.superhostOnly ||
        filters.checkInDate ||
        filters.checkOutDate;

      // Resetar offset quando filtros mudam
      setOffset(0);

      // Se não há filtros ativos, usar busca padrão com paginação
      if (!hasActiveFilters) {
        setSearchLoading(true);
        try {
          const results = await api.searchListings({
            limit: PAGE_SIZE,
            offset: 0,
          });
          setFilteredListings(results);
          setHasMore(results.length === PAGE_SIZE);
        } catch (error) {
          console.error("Erro ao buscar listings:", error);
          setFilteredListings([]);
          setHasMore(false);
        } finally {
          setSearchLoading(false);
        }
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
          checkInDate: filters.checkInDate,
          checkOutDate: filters.checkOutDate,
          minAvailableDays: filters.minAvailableDays,
          limit: PAGE_SIZE,
          offset: 0,
        });
        setFilteredListings(results);
        setHasMore(results.length === PAGE_SIZE);
      } catch (error) {
        console.error("Erro ao buscar com filtros:", error);
        setFilteredListings([]);
        setHasMore(false);
      } finally {
        setSearchLoading(false);
      }
    };

    searchWithFilters();
  }, [filters]);

  // Função para carregar mais resultados
  const handleLoadMore = async () => {
    const newOffset = offset + PAGE_SIZE;
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
        checkInDate: filters.checkInDate,
        checkOutDate: filters.checkOutDate,
        minAvailableDays: filters.minAvailableDays,
        limit: PAGE_SIZE,
        offset: newOffset,
      });

      // Adicionar novos resultados aos existentes
      setFilteredListings((prev) => [...prev, ...results]);
      setOffset(newOffset);
      setHasMore(results.length === PAGE_SIZE);
    } catch (error) {
      console.error("Erro ao carregar mais resultados:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  // Estado para armazenar todos os bairros disponíveis
  const [availableNeighborhoods, setAvailableNeighborhoods] = useState<
    string[]
  >([]);

  useEffect(() => {
    // Prevenir execução duplicada causada pelo StrictMode
    if (initialDataLoaded.current) {
      return;
    }
    initialDataLoaded.current = true;

    const fetchData = async () => {
      try {
        // Carregar apenas dados estáticos (heatmaps e bairros)
        // Os listings serão carregados pelo useEffect de filtros
        const [densityData, priceData, neighborhoodStats] = await Promise.all([
          api.getDensityHeatmap(),
          api.getPriceHeatmap(),
          api.getNeighborhoodStats(),
        ]);

        setDensityHeatmapData(densityData);

        // Extrair todos os bairros das estatísticas
        const neighborhoods = neighborhoodStats
          .map((stat) => stat.neighborhood)
          .sort();
        setAvailableNeighborhoods(neighborhoods);
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
    if (listing) {
      setViewMode("property");
    } else {
      setViewMode("search");
    }
  };

  const handleDeselectListing = () => {
    setSelectedListing(null);
    setViewMode("search");
  };

  const handleHostClick = (hostId: string) => {
    setPreviousListing(selectedListing);
    setSelectedHostId(hostId);
    setViewMode("hostProfile");
  };

  const handleHostProfileBack = () => {
    setSelectedHostId(null);
    if (previousListing) {
      setSelectedListing(previousListing);
      setViewMode("property");
      setPreviousListing(null);
    } else {
      setViewMode("search");
    }
  };

  const handleHostPropertySelect = (listing: Listing) => {
    // Quando seleciona propriedade do host, abre a propriedade
    // mas quando voltar, deve ir direto para search (não para o perfil do host)
    setSelectedListing(listing);
    setViewMode("property");
    // Limpa o host selecionado para que o "Voltar" vá para search
    setSelectedHostId(null);
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
                {filteredListings.length} de 43.608 acomodações
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Search/Details Panel */}
          {!isFullWidth && (
            <ResizablePanel defaultSize={30} minSize={27} maxSize={40}>
              <div className="h-full flex flex-col bg-white">
                {/* Botão Voltar quando propriedade selecionada */}
                {viewMode === "property" && (
                  <div className="px-3 md:px-4 pt-3 md:pt-4 pb-2 border-b">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDeselectListing}
                      className="text-xs md:text-sm h-7 md:h-8"
                    >
                      <ArrowLeft className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                      Voltar
                    </Button>
                  </div>
                )}

                {/* Botão Voltar quando perfil do host selecionado */}
                {viewMode === "hostProfile" && (
                  <div className="px-3 md:px-4 pt-3 md:pt-4 pb-2 border-b">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleHostProfileBack}
                      className="text-xs md:text-sm h-7 md:h-8"
                    >
                      <ArrowLeft className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                      Voltar para propriedade
                    </Button>
                  </div>
                )}

                {/* Vista de Busca */}
                {viewMode === "search" && (
                  <div className="flex-1 overflow-hidden flex flex-col">
                    <div className="bg-white shadow-md border-b sticky top-0 z-10">
                      <SearchFilters
                        filters={filters}
                        onFiltersChange={setFilters}
                        availableNeighborhoods={availableNeighborhoods}
                        isLoading={searchLoading}
                      />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <PropertyList
                        listings={filteredListings}
                        onListingSelect={handleListingSelect}
                        isLoading={searchLoading}
                        hasMore={hasMore}
                        onLoadMore={handleLoadMore}
                      />
                    </div>
                  </div>
                )}

                {/* Vista de Detalhes da Propriedade */}
                {viewMode === "property" && selectedListing && (
                  <div className="flex-1 overflow-hidden">
                    <PropertyDetails
                      key={selectedListing.id}
                      listing={selectedListing}
                      onHostClick={handleHostClick}
                    />
                  </div>
                )}

                {/* Vista de Perfil do Host */}
                {viewMode === "hostProfile" && selectedHostId && (
                  <div className="flex-1 overflow-hidden">
                    <HostProfile
                      hostId={selectedHostId}
                      onBack={handleHostProfileBack}
                      onPropertySelect={handleHostPropertySelect}
                    />
                  </div>
                )}
              </div>
            </ResizablePanel>
          )}

          {/* Resizable Handle */}
          {!isFullWidth && (
            <ResizableHandle className="w-1 bg-gray-200 hover:bg-rose-300 transition-colors" />
          )}

          {/* Map Panel */}
          <ResizablePanel
            defaultSize={isFullWidth ? 100 : 75}
            minSize={60}
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
