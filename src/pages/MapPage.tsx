import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import InteractiveMap from "@/components/InteractiveMap";
import PropertyDetails from "@/components/PropertyDetails";
import Statistics from "@/components/Statistics";
import api from "@/services/api";
import type { Listing, HeatmapMode, HeatmapPoint } from "@/types";

export default function MapPage() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [heatmapMode, setHeatmapMode] = useState<HeatmapMode>("none");
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [densityHeatmapData, setDensityHeatmapData] = useState<HeatmapPoint[]>(
    []
  );
  const [priceHeatmapData, setPriceHeatmapData] = useState<HeatmapPoint[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingsData, densityData, priceData] = await Promise.all([
          api.getListings(),
          api.getDensityHeatmap(),
          api.getPriceHeatmap(),
        ]);

        setListings(listingsData);
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
                {listings.length} acomodações disponíveis
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
          {/* Map Panel */}
          <ResizablePanel
            defaultSize={isFullWidth ? 100 : 60}
            minSize={30}
            className="relative"
          >
            <InteractiveMap
              listings={listings}
              selectedListing={selectedListing}
              onListingSelect={setSelectedListing}
              heatmapMode={heatmapMode}
              onHeatmapModeChange={setHeatmapMode}
              onFullWidthToggle={handleFullWidthToggle}
              isFullWidth={isFullWidth}
              densityHeatmapData={densityHeatmapData}
              priceHeatmapData={priceHeatmapData}
            />
          </ResizablePanel>

          {/* Resizable Handle */}
          {!isFullWidth && (
            <ResizableHandle className="w-1 bg-gray-200 hover:bg-rose-300 transition-colors" />
          )}

          {/* Details Panel */}
          {!isFullWidth && (
            <ResizablePanel defaultSize={40} minSize={25}>
              <Tabs defaultValue="details" className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-2 m-4 mb-0">
                  <TabsTrigger value="details">Detalhes</TabsTrigger>
                  <TabsTrigger value="statistics">Estatísticas</TabsTrigger>
                </TabsList>

                <TabsContent
                  value="details"
                  className="flex-1 mt-0 overflow-hidden"
                >
                  <PropertyDetails listing={selectedListing} />
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
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
