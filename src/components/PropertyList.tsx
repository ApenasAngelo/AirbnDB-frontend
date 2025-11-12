import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  Award,
  CheckCircle2,
  Wifi,
  Calendar,
} from "lucide-react";
import type { Listing } from "@/types";

interface PropertyListProps {
  listings: Listing[];
  onListingSelect: (listing: Listing) => void;
  isLoading?: boolean;
}

export default function PropertyList({
  listings,
  onListingSelect,
  isLoading = false,
}: PropertyListProps) {
  // Estado de carregamento
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-rose-500 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Buscando acomodações...
            </h3>
            <p className="text-sm text-gray-500 mt-2">Aplicando filtros</p>
          </div>
        </div>
      </div>
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
      <div className="p-4 space-y-3">
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
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate mb-1">
                      {property.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{property.neighborhood}</span>
                    </div>
                  </div>

                  {/* Preço */}
                  <div className="text-right shrink-0">
                    <div className="text-lg font-bold text-rose-600">
                      R$ {price}
                    </div>
                    <div className="text-xs text-gray-500">/ noite</div>
                  </div>
                </div>

                {/* Rating e Host Badges */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {rating > 0 && (
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{rating}</span>
                      <span className="text-gray-500">({numberOfReviews})</span>
                    </div>
                  )}

                  {host.isSuperhost && (
                    <Badge
                      variant="secondary"
                      className="bg-rose-100 text-rose-700 text-xs h-5"
                    >
                      <Award className="h-2.5 w-2.5 mr-0.5" />
                      Superhost
                    </Badge>
                  )}

                  {host.verified && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700 text-xs h-5"
                    >
                      <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
                      Verificado
                    </Badge>
                  )}

                  {property.totalAmenities !== undefined && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 text-xs h-5"
                    >
                      <Wifi className="h-2.5 w-2.5 mr-0.5" />
                      {property.totalAmenities} comodidades
                    </Badge>
                  )}

                  {property.availableDaysInPeriod !== undefined && (
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 text-purple-700 text-xs h-5"
                    >
                      <Calendar className="h-2.5 w-2.5 mr-0.5" />
                      {property.availableDaysInPeriod} dias
                    </Badge>
                  )}
                </div>

                {/* Property Details */}
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    <span>{property.capacity}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Bed className="h-3.5 w-3.5" />
                    <span>
                      {property.bedrooms}{" "}
                      {property.bedrooms === 1 ? "quarto" : "quartos"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Bath className="h-3.5 w-3.5" />
                    <span>
                      {property.bathrooms}{" "}
                      {property.bathrooms === 1 ? "banh." : "banh."}
                    </span>
                  </div>
                </div>

                {/* Amenities Preview */}
                {property.amenities.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex flex-wrap gap-1">
                      {property.amenities.slice(0, 3).map((amenity, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs h-5 px-2"
                        >
                          {amenity}
                        </Badge>
                      ))}
                      {property.amenities.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-xs h-5 px-2 text-gray-500"
                        >
                          +{property.amenities.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
}
