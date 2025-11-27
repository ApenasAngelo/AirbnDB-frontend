import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  Award,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import type { Listing } from "@/types";
import PropertyListSkeleton from "@/components/skeletons/PropertyListSkeleton";

interface PropertyListProps {
  listings: Listing[];
  onListingSelect: (listing: Listing) => void;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export default function PropertyList({
  listings,
  onListingSelect,
  isLoading = false,
  hasMore = false,
  onLoadMore,
}: PropertyListProps) {
  // Estado de carregamento inicial (sem resultados ainda)
  if (isLoading && listings.length === 0) {
    return (
      <ScrollArea className="h-full">
        <PropertyListSkeleton />
      </ScrollArea>
    );
  }

  // Nenhum resultado
  if (listings.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <MapPin className="h-16 w-16 text-gray-300 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Nenhuma propriedade encontrada
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Tente ajustar os filtros de busca
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-3 pb-6">
        <div className="text-sm text-gray-600 mb-4">
          <span className="font-semibold">{listings.length}</span>{" "}
          {listings.length === 1
            ? "propriedade encontrada"
            : "propriedades encontradas"}
        </div>

        {listings.map((listing) => {
          const { property, host, price, rating, numberOfReviews } = listing;

          return (
            <Card
              key={listing.id}
              className="cursor-pointer hover:shadow-lg hover:border-rose-300 transition-all duration-200 overflow-hidden"
              onClick={() => onListingSelect(listing)}
            >
              <CardContent className="p-2.5 md:p-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm md:text-base text-gray-900 line-clamp-2 leading-tight mb-1">
                      {property.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{property.neighborhood}</span>
                    </div>
                  </div>

                  {/* Preço */}
                  <div className="text-right shrink-0 min-w-[60px]">
                    <div className="text-base md:text-lg font-bold text-rose-600 whitespace-nowrap">
                      R$ {price}
                    </div>
                    <div className="text-[10px] md:text-xs text-gray-500 whitespace-nowrap">
                      / noite
                    </div>
                  </div>
                </div>

                {/* Rating e Host Badges */}
                <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                  {rating > 0 && (
                    <div className="flex items-center gap-0.5 text-xs">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 shrink-0" />
                      <span className="font-semibold">{rating}</span>
                      <span className="text-gray-500">({numberOfReviews})</span>
                    </div>
                  )}

                  {host.isSuperhost && (
                    <Badge
                      variant="secondary"
                      className="bg-rose-100 text-rose-700 text-[10px] md:text-xs h-4 md:h-5 px-1.5"
                    >
                      <Award className="h-2.5 w-2.5 mr-0.5 shrink-0" />
                      <span className="hidden sm:inline">Superhost</span>
                      <span className="sm:hidden">Super</span>
                    </Badge>
                  )}

                  {host.verified && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700 text-[10px] md:text-xs h-4 md:h-5 px-1.5"
                    >
                      <CheckCircle2 className="h-2.5 w-2.5 mr-0.5 shrink-0" />
                      <span className="hidden sm:inline">Verificado</span>
                      <span className="sm:hidden">✓</span>
                    </Badge>
                  )}

                  {listing.neighborhoodRanking &&
                    listing.neighborhoodRanking <= 10 && (
                      <Badge
                        variant="secondary"
                        className="bg-purple-100 text-purple-700 text-[10px] md:text-xs h-4 md:h-5 px-1.5"
                      >
                        <Award className="h-2.5 w-2.5 mr-0.5 shrink-0" />
                        <span className="hidden sm:inline">
                          #{listing.neighborhoodRanking} em{" "}
                          {property.neighborhood}
                        </span>
                        <span className="sm:hidden">
                          #{listing.neighborhoodRanking}
                        </span>
                      </Badge>
                    )}
                </div>

                {/* Property Details */}
                <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-gray-600 flex-wrap">
                  <div className="flex items-center gap-0.5 md:gap-1">
                    <Users className="h-3 w-3 md:h-3.5 md:w-3.5 shrink-0" />
                    <span>{property.capacity}</span>
                  </div>

                  <div className="flex items-center gap-0.5 md:gap-1">
                    <Bed className="h-3 w-3 md:h-3.5 md:w-3.5 shrink-0" />
                    <span className="whitespace-nowrap">
                      {property.bedrooms}{" "}
                      {property.bedrooms === 1 ? "qt" : "qts"}
                    </span>
                  </div>

                  <div className="flex items-center gap-0.5 md:gap-1">
                    <Bath className="h-3 w-3 md:h-3.5 md:w-3.5 shrink-0" />
                    <span className="whitespace-nowrap">
                      {property.bathrooms}{" "}
                      {property.bathrooms === 1 ? "bh." : "bhs."}
                    </span>
                  </div>
                </div>

                {/* Amenities Preview */}
                {property.amenities.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="flex flex-wrap gap-1">
                      {property.amenities.slice(0, 2).map((amenity, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-[10px] md:text-xs h-4 md:h-5 px-1.5 md:px-2 truncate max-w-[100px]"
                        >
                          {amenity}
                        </Badge>
                      ))}
                      {property.amenities.length > 2 && (
                        <Badge
                          variant="outline"
                          className="text-[10px] md:text-xs h-4 md:h-5 px-1.5 md:px-2 text-gray-500"
                        >
                          +{property.amenities.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* Botão Ver Mais */}
        {hasMore && !isLoading && onLoadMore && (
          <div className="pt-4 pb-2">
            <Button
              onClick={onLoadMore}
              variant="outline"
              className="w-full h-10 font-medium"
            >
              Ver mais propriedades
            </Button>
          </div>
        )}

        {/* Loading ao carregar mais */}
        {isLoading && listings.length > 0 && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
