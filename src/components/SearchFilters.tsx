import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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

  const toggleNeighborhood = (neighborhood: string) => {
    const newNeighborhoods = filters.neighborhoods.includes(neighborhood)
      ? filters.neighborhoods.filter((n) => n !== neighborhood)
      : [...filters.neighborhoods, neighborhood];
    updateFilter("neighborhoods", newNeighborhoods);
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
    <Card className="border-0 rounded-none shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtros de Busca
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-rose-500" />
            )}
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-8 text-sm"
              >
                Limpar
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 text-sm"
            >
              {isExpanded ? "Recolher" : "Expandir"}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4 pt-0">
          {/* Preço */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Bairros */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              Bairros
            </label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {availableNeighborhoods.map((neighborhood) => (
                <Badge
                  key={neighborhood}
                  variant={
                    filters.neighborhoods.includes(neighborhood)
                      ? "default"
                      : "outline"
                  }
                  className={`cursor-pointer hover:bg-rose-100 transition-colors ${
                    filters.neighborhoods.includes(neighborhood)
                      ? "bg-rose-500 hover:bg-rose-600"
                      : ""
                  }`}
                  onClick={() => toggleNeighborhood(neighborhood)}
                >
                  {neighborhood}
                  {filters.neighborhoods.includes(neighborhood) && (
                    <X className="h-3 w-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Avaliação Mínima */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Star className="h-4 w-4 text-gray-500" />
              Avaliação Mínima
            </label>
            <div className="flex gap-2">
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
                  className={
                    filters.minRating === rating
                      ? "bg-rose-500 hover:bg-rose-600"
                      : ""
                  }
                >
                  {rating}★
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Capacidade Mínima */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              Capacidade Mínima
            </label>
            <div className="flex gap-2">
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
                  className={
                    filters.minCapacity === capacity
                      ? "bg-rose-500 hover:bg-rose-600"
                      : ""
                  }
                >
                  {capacity}+
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Número Mínimo de Avaliações */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-gray-500" />
              Mínimo de Avaliações
            </label>
            <div className="flex gap-2">
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
                  className={
                    filters.minReviews === reviews
                      ? "bg-rose-500 hover:bg-rose-600"
                      : ""
                  }
                >
                  {reviews}+
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Superhost */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Award className="h-4 w-4 text-gray-500" />
              Superhost
            </label>
            <Button
              variant={filters.superhostOnly ? "default" : "outline"}
              size="sm"
              onClick={() =>
                updateFilter("superhostOnly", !filters.superhostOnly)
              }
              className={`w-full ${
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
