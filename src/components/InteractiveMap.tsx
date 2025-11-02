import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import { createCustomMarkerIcon } from "./CustomMarker";
import MapControls from "./MapControls";
import type { Listing, HeatmapMode, HeatmapPoint } from "@/types";

interface InteractiveMapProps {
  listings: Listing[];
  selectedListing: Listing | null;
  onListingSelect: (listing: Listing | null) => void;
  heatmapMode: HeatmapMode;
  onHeatmapModeChange: (mode: HeatmapMode) => void;
  onFullWidthToggle: () => void;
  isFullWidth: boolean;
  densityHeatmapData: HeatmapPoint[];
  priceHeatmapData: HeatmapPoint[];
  onMapMove?: (bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
    zoom: number;
  }) => void;
}

// Componente para controlar o mapa
function MapController({
  heatmapMode,
  densityHeatmapData,
  priceHeatmapData,
}: {
  heatmapMode: HeatmapMode;
  densityHeatmapData: HeatmapPoint[];
  priceHeatmapData: HeatmapPoint[];
}) {
  const map = useMap();
  const heatLayerRef = useRef<L.HeatLayer | null>(null);

  useEffect(() => {
    // Remover camada de calor anterior se existir
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    // Adicionar nova camada de calor se necessário
    if (heatmapMode !== "none") {
      const data =
        heatmapMode === "density" ? densityHeatmapData : priceHeatmapData;

      // Normalizar os dados para melhor visualização
      const intensities = data.map((point) => point.intensity);
      const minIntensity = Math.min(...intensities);
      const maxIntensity = Math.max(...intensities);

      // Criar dados normalizados entre 0 e 1
      const heatData: [number, number, number][] = data.map((point) => {
        // Normalizar para escala 0-1
        const normalizedIntensity =
          maxIntensity > minIntensity
            ? (point.intensity - minIntensity) / (maxIntensity - minIntensity)
            : 0.5;

        return [point.lat, point.lng, normalizedIntensity];
      });

      // Criar e adicionar camada de calor
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const heatLayer = (L as any).heatLayer(heatData, {
        radius: 30,
        blur: 25,
        maxZoom: 17,
        max: 0.8, // Reduzir para aumentar intensidade das cores
        minOpacity: 0.4, // Aumentar opacidade mínima
        gradient:
          heatmapMode === "price"
            ? {
                0.0: "blue",
                0.3: "cyan",
                0.5: "yellow",
                0.7: "orange",
                1.0: "red",
              }
            : {
                0.0: "blue",
                0.3: "cyan",
                0.5: "lime",
                0.7: "yellow",
                1.0: "red",
              },
      });

      heatLayer.addTo(map);
      heatLayerRef.current = heatLayer;
    }

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
    };
  }, [heatmapMode, densityHeatmapData, priceHeatmapData, map]);

  return null;
}

// Componente para invalidar o tamanho do mapa quando o painel é redimensionado
function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();

    // Usar ResizeObserver para detectar mudanças de tamanho no container
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });

    if (container) {
      resizeObserver.observe(container);
    }

    // Trigger inicial
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
      resizeObserver.disconnect();
    };
  }, [map]);

  return null;
}

// Componente para adicionar listener de clique no mapa
function MapClickHandler({ onMapClick }: { onMapClick: () => void }) {
  useMapEvents({
    click: () => {
      onMapClick();
    },
  });

  return null;
}

// Componente para detectar movimento do mapa (lazy loading)
function MapMoveHandler({
  onMapMove,
}: {
  onMapMove?: (bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
    zoom: number;
  }) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!onMapMove) return;

    const handleMoveEnd = () => {
      const bounds = map.getBounds();
      const zoom = map.getZoom();

      onMapMove({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
        zoom,
      });
    };

    // Trigger inicial
    handleMoveEnd();

    // Eventos do mapa
    map.on("moveend", handleMoveEnd);
    map.on("zoomend", handleMoveEnd);

    return () => {
      map.off("moveend", handleMoveEnd);
      map.off("zoomend", handleMoveEnd);
    };
  }, [map, onMapMove]);

  return null;
}

export default function InteractiveMap({
  listings,
  selectedListing,
  onListingSelect,
  heatmapMode,
  onHeatmapModeChange,
  onFullWidthToggle,
  isFullWidth,
  densityHeatmapData,
  priceHeatmapData,
  onMapMove,
}: InteractiveMapProps) {
  const mapRef = useRef<L.Map | null>(null);

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  const handleMapClick = () => {
    // Desselecionar quando clicar no mapa (fora dos marcadores)
    onListingSelect(null);
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[-22.9519, -43.2105]}
        zoom={12}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full z-0"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={20}
        />

        {/* Marcadores de listagens - mostrar apenas se heatmap estiver desligado */}
        {heatmapMode === "none" &&
          listings.map((listing) => (
            <Marker
              key={listing.id}
              position={[listing.property.latitude, listing.property.longitude]}
              icon={createCustomMarkerIcon({
                price: listing.price,
                isSelected: selectedListing?.id === listing.id,
              })}
              eventHandlers={{
                click: () => {
                  onListingSelect(listing);
                },
              }}
            />
          ))}

        <MapController
          heatmapMode={heatmapMode}
          densityHeatmapData={densityHeatmapData}
          priceHeatmapData={priceHeatmapData}
        />

        <MapResizeHandler />
        <MapClickHandler onMapClick={handleMapClick} />
        <MapMoveHandler onMapMove={onMapMove} />
      </MapContainer>

      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFullWidth={onFullWidthToggle}
        heatmapMode={heatmapMode}
        onHeatmapModeChange={onHeatmapModeChange}
        isFullWidth={isFullWidth}
      />
    </div>
  );
}
