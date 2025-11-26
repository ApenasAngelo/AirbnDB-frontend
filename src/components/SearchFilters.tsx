import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  X,
  DollarSign,
  Star,
  Users,
  MessageSquare,
  Award,
  MapPin,
} from "lucide-react";
import type { SearchFiltersState } from "@/types/filters";

interface SearchFiltersProps {
  filters: SearchFiltersState;
  onFiltersChange: (filters: SearchFiltersState) => void;
  availableNeighborhoods: string[];
  isLoading?: boolean;
}

export default function SearchFilters({
  filters,
  onFiltersChange,
  availableNeighborhoods,
  isLoading = false,
}: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = <K extends keyof SearchFiltersState>(
    key: K,
    value: SearchFiltersState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const addNeighborhood = (neighborhood: string) => {
    if (!filters.neighborhoods.includes(neighborhood)) {
      updateFilter("neighborhoods", [...filters.neighborhoods, neighborhood]);
    }
  };

  const removeNeighborhood = (neighborhood: string) => {
    updateFilter(
      "neighborhoods",
      filters.neighborhoods.filter((n) => n !== neighborhood)
    );
  };

  const clearAllFilters = () => {
    onFiltersChange({
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
  };

  const activeFiltersCount = [
    filters.minPrice,
    filters.maxPrice,
    filters.neighborhoods.length > 0,
    filters.minRating,
    filters.minCapacity,
    filters.minReviews,
    filters.superhostOnly,
  ].filter(Boolean).length;

  return (
    <Card className="border-0 rounded-none shadow-none py-3">
      <CardHeader className="px-3 md:px-6 gap-0">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base md:text-lg flex items-center gap-2 flex-wrap">
            <Search className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
            <span className="shrink-0">Filtros</span>
            {isLoading && (
              <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-rose-500 shrink-0" />
            )}
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs shrink-0">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-1 md:gap-2 shrink-0">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-7 md:h-8 text-xs md:text-sm px-2 md:px-3"
              >
                Limpar
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-7 md:h-8 text-xs md:text-sm px-2 md:px-3"
            >
              {isExpanded ? "Recolher" : "Expandir"}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-3 md:space-y-4 pt-0 px-3 md:px-6">
          {/* Preço */}
          <div className="space-y-2">
            <label className="text-xs md:text-sm font-semibold flex items-center gap-2">
              <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-gray-500" />
              Faixa de Preço (por noite)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  type="number"
                  placeholder="Mínimo"
                  value={filters.minPrice || ""}
                  onChange={(e) =>
                    updateFilter(
                      "minPrice",
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-md text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Máximo"
                  value={filters.maxPrice || ""}
                  onChange={(e) =>
                    updateFilter(
                      "maxPrice",
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-md text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Bairros */}
          <div className="space-y-2">
            <label className="text-xs md:text-sm font-semibold flex items-center gap-2">
              <MapPin className="h-3 w-3 md:h-4 md:w-4 text-gray-500" />
              Bairros
            </label>
            <Select
              value=""
              onValueChange={(value) => {
                if (value) {
                  addNeighborhood(value);
                }
              }}
            >
              <SelectTrigger className="h-8 md:h-10 text-xs md:text-sm">
                <SelectValue placeholder="Selecione um bairro..." />
              </SelectTrigger>
              <SelectContent>
                {availableNeighborhoods
                  .filter((n) => !filters.neighborhoods.includes(n))
                  .map((neighborhood) => (
                    <SelectItem key={neighborhood} value={neighborhood}>
                      {neighborhood}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {filters.neighborhoods.length > 0 && (
              <div className="flex flex-wrap gap-1.5 md:gap-2 max-h-32 overflow-y-auto">
                {filters.neighborhoods.map((neighborhood) => (
                  <Badge
                    key={neighborhood}
                    variant="default"
                    className="cursor-pointer bg-rose-500 hover:bg-rose-600 text-xs"
                    onClick={() => removeNeighborhood(neighborhood)}
                  >
                    <span className="truncate max-w-[120px]">
                      {neighborhood}
                    </span>
                    <X className="h-3 w-3 ml-1 shrink-0" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Avaliação Mínima */}
          <div className="space-y-2">
            <label className="text-xs md:text-sm font-semibold flex items-center gap-2">
              <Star className="h-3 w-3 md:h-4 md:w-4 text-gray-500" />
              Avaliação Mínima
            </label>
            <div className="flex gap-1.5 md:gap-2 flex-wrap">
              {[3, 3.5, 4, 4.5, 5].map((rating) => (
                <Button
                  key={rating}
                  variant={filters.minRating === rating ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    updateFilter(
                      "minRating",
                      filters.minRating === rating ? null : rating
                    )
                  }
                  className={`h-7 md:h-8 px-2 md:px-3 text-xs md:text-sm ${
                    filters.minRating === rating
                      ? "bg-rose-500 hover:bg-rose-600"
                      : ""
                  }`}
                >
                  {rating}★
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Capacidade Mínima */}
          <div className="space-y-2">
            <label className="text-xs md:text-sm font-semibold flex items-center gap-2">
              <Users className="h-3 w-3 md:h-4 md:w-4 text-gray-500" />
              Capacidade Mínima
            </label>
            <div className="flex gap-1.5 md:gap-2 flex-wrap">
              {[1, 2, 4, 6, 8].map((capacity) => (
                <Button
                  key={capacity}
                  variant={
                    filters.minCapacity === capacity ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    updateFilter(
                      "minCapacity",
                      filters.minCapacity === capacity ? null : capacity
                    )
                  }
                  className={`h-7 md:h-8 px-2 md:px-3 text-xs md:text-sm ${
                    filters.minCapacity === capacity
                      ? "bg-rose-500 hover:bg-rose-600"
                      : ""
                  }`}
                >
                  {capacity}+
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Número Mínimo de Avaliações */}
          <div className="space-y-2">
            <label className="text-xs md:text-sm font-semibold flex items-center gap-2">
              <MessageSquare className="h-3 w-3 md:h-4 md:w-4 text-gray-500" />
              Mínimo de Avaliações
            </label>
            <div className="flex gap-1.5 md:gap-2 flex-wrap">
              {[10, 50, 100, 150].map((reviews) => (
                <Button
                  key={reviews}
                  variant={
                    filters.minReviews === reviews ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    updateFilter(
                      "minReviews",
                      filters.minReviews === reviews ? null : reviews
                    )
                  }
                  className={`h-7 md:h-8 px-2 md:px-3 text-xs md:text-sm ${
                    filters.minReviews === reviews
                      ? "bg-rose-500 hover:bg-rose-600"
                      : ""
                  }`}
                >
                  {reviews}+
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Superhost */}
          <div className="space-y-2">
            <label className="text-xs md:text-sm font-semibold flex items-center gap-2">
              <Award className="h-3 w-3 md:h-4 md:w-4 text-gray-500" />
              Superhost
            </label>
            <Button
              variant={filters.superhostOnly ? "default" : "outline"}
              size="sm"
              onClick={() =>
                updateFilter("superhostOnly", !filters.superhostOnly)
              }
              className={`w-full h-7 md:h-8 text-xs md:text-sm ${
                filters.superhostOnly ? "bg-rose-500 hover:bg-rose-600" : ""
              }`}
            >
              {filters.superhostOnly
                ? "Apenas Superhosts"
                : "Incluir todos anfitriões"}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
