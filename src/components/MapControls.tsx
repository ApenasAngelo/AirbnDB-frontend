import { Button } from "@/components/ui/button";
import {
  Maximize2,
  ZoomIn,
  ZoomOut,
  Flame,
  Users,
  DollarSign,
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
          <Maximize2 className="h-5 w-5" />
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

      {/* Heatmap Controls */}
      <div className="bg-white rounded-lg shadow-md p-2 space-y-1">
        <div className="text-xs font-semibold text-gray-700 px-2 py-1">
          Mapa de Calor
        </div>

        <Button
          variant={heatmapMode === "none" ? "default" : "ghost"}
          size="sm"
          onClick={() => onHeatmapModeChange("none")}
          className="w-full justify-start text-xs h-8"
        >
          <Flame className="h-4 w-4 mr-2" />
          Desligado
        </Button>

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
  );
}
