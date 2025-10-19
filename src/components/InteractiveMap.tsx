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
  onListingSelect: (listing: Listing) => void;
  heatmapMode: HeatmapMode;
  onHeatmapModeChange: (mode: HeatmapMode) => void;
  onFullWidthToggle: () => void;
  isFullWidth: boolean;
  densityHeatmapData: HeatmapPoint[];
  priceHeatmapData: HeatmapPoint[];
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
      const heatData: [number, number, number][] = data.map((point) => [
        point.lat,
        point.lng,
        point.intensity,
      ]);

      // Criar e adicionar camada de calor
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const heatLayer = (L as any).heatLayer(heatData, {
        radius: 25,
        blur: 35,
        maxZoom: 17,
        max: 1.0,
        gradient:
          heatmapMode === "price"
            ? { 0.0: "blue", 0.5: "yellow", 1.0: "red" }
            : { 0.0: "blue", 0.5: "lime", 1.0: "red" },
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
    const handleResize = () => {
      map.invalidateSize();
    };

    // Adicionar listener para evento de resize
    window.addEventListener("resize", handleResize);

    // Trigger inicial
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
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
    // onListingSelect(null); // Comentado para manter seleção
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[-22.9519, -43.2105]}
        zoom={12}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marcadores de listagens - mostrar apenas se heatmap estiver desligado ou no modo none */}
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
