import { Button } from "@/components/ui/button";
import {
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Flame,
  Users,
  DollarSign,
  X,
} from "lucide-react";
import type { HeatmapMode } from "@/types";

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFullWidth: () => void;
  heatmapMode: HeatmapMode;
  onHeatmapModeChange: (mode: HeatmapMode) => void;
  isFullWidth: boolean;
}

export default function MapControls({
  onZoomIn,
  onZoomOut,
  onFullWidth,
  heatmapMode,
  onHeatmapModeChange,
  isFullWidth,
}: MapControlsProps) {
  const isHeatmapActive = heatmapMode !== "none";

  return (
    <div className="absolute top-4 right-4 z-1000 flex flex-col items-end gap-2">
      {/* Full Width Button */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={onFullWidth}
          title={isFullWidth ? "Restaurar tamanho" : "Tela cheia"}
        >
          {isFullWidth ? (
            <Minimize2 className="h-5 w-5" />
          ) : (
            <Maximize2 className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Zoom Controls */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
        <Button
          variant="ghost"
          size="icon"
          onClick={onZoomIn}
          className="rounded-none border-b"
          title="Aumentar zoom"
        >
          <ZoomIn className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onZoomOut}
          className="rounded-none"
          title="Diminuir zoom"
        >
          <ZoomOut className="h-5 w-5" />
        </Button>
      </div>

      {/* Heatmap Controls - Compact mode when disabled */}
      {!isHeatmapActive ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onHeatmapModeChange("density")}
            title="Ativar mapa de calor"
          >
            <Flame className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
          {/* Header com botão de fechar */}
          <div className="flex items-center justify-between px-3 py-2 border-b bg-gray-50">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-rose-500" />
              <span className="text-xs font-semibold text-gray-700">
                Mapa de Calor
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onHeatmapModeChange("none")}
              className="h-6 w-6"
              title="Desligar mapa de calor"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {/* Opções */}
          <div className="p-1">
            <Button
              variant={heatmapMode === "density" ? "default" : "ghost"}
              size="sm"
              onClick={() => onHeatmapModeChange("density")}
              className="w-full justify-start text-xs h-8"
            >
              <Users className="h-4 w-4 mr-2" />
              Densidade
            </Button>

            <Button
              variant={heatmapMode === "price" ? "default" : "ghost"}
              size="sm"
              onClick={() => onHeatmapModeChange("price")}
              className="w-full justify-start text-xs h-8"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Preço
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
