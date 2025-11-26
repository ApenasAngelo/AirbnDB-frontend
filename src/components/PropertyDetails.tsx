import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  Home,
  CheckCircle2,
  ExternalLink,
  Award,
  Loader2,
} from "lucide-react";
import type { Listing } from "@/types";
import api from "@/services/api";
import AvailabilityCalendar from "./AvailabilityCalendar";
import PropertyReviews from "./PropertyReviews";

interface PropertyDetailsProps {
  listing: Listing | null;
  onHostClick?: (hostId: string) => void;
}

export default function PropertyDetails({
  listing,
  onHostClick,
}: PropertyDetailsProps) {
  const [amenities, setAmenities] = useState<string[]>([]);
  const [loadingAmenities, setLoadingAmenities] = useState(false);

  // Extrair propertyId para usar como dependência
  const propertyId = listing?.propertyId;

  // Carregar amenidades quando a propriedade mudar
  useEffect(() => {
    if (!listing || !propertyId) {
      setAmenities([]);
      return;
    }

    const fetchAmenities = async () => {
      setLoadingAmenities(true);
      try {
        const data = await api.getPropertyAmenities(propertyId);
        setAmenities(data);
      } catch (error) {
        console.error("Erro ao carregar amenidades:", error);
        // Fallback para amenidades da propriedade se a API falhar
        setAmenities(listing.property.amenities);
      } finally {
        setLoadingAmenities(false);
      }
    };

    fetchAmenities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  if (!listing) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <MapPin className="h-16 w-16 text-gray-300 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Selecione uma acomodação
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Clique em um pin no mapa para ver os detalhes
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { property, host, price, rating, numberOfReviews, url } = listing;

  const propertyTypeLabels = {
    apartment: "Apartamento",
    house: "Casa",
    room: "Quarto",
    other: "Outro",
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-3 pb-6">
        {/* Header */}
        <div className="min-w-0">
          <h2 className="text-base md:text-lg font-bold text-gray-900 mb-1.5 line-clamp-2 leading-tight">
            {property.name}
          </h2>
          <div className="flex items-center gap-2 text-xs text-gray-600 flex-wrap">
            <div className="flex items-center gap-1 min-w-0">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{property.neighborhood}</span>
            </div>
            {rating > 0 && (
              <div className="flex items-center gap-1 shrink-0">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 shrink-0" />
                <span className="font-semibold">{rating}</span>
                <span>({numberOfReviews})</span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Price */}
        <Card className="bg-rose-50 border-rose-200 overflow-hidden">
          <CardContent className="pt-3 pb-3">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-xl md:text-2xl font-bold text-rose-600 whitespace-nowrap">
                R$ {price}
              </span>
              <span className="text-sm text-gray-600 whitespace-nowrap">
                / noite
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Host Information */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <Home className="h-4 w-4 shrink-0" />
              Anfitrião
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between gap-2 min-w-0">
              <button
                onClick={() => onHostClick?.(host.id)}
                className="font-semibold text-sm md:text-base text-gray-900 hover:text-rose-600 transition-colors cursor-pointer truncate min-w-0"
              >
                {host.name}
              </button>
              <div className="flex gap-1.5 shrink-0 flex-wrap">
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
              </div>
            </div>
            <p className="text-xs md:text-sm text-gray-600 truncate">
              Membro desde{" "}
              {new Date(host.joinDate).toLocaleDateString("pt-BR", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg">
              Detalhes da Propriedade
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              {propertyTypeLabels[property.type]}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <Users className="h-4 w-4 text-gray-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs md:text-sm font-semibold truncate">
                    {property.capacity}{" "}
                    {property.capacity === 1 ? "hóspede" : "hóspedes"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 min-w-0">
                <Bed className="h-4 w-4 text-gray-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs md:text-sm font-semibold truncate">
                    {property.bedrooms}{" "}
                    {property.bedrooms === 1 ? "quarto" : "quartos"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 min-w-0">
                <Bed className="h-4 w-4 text-gray-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs md:text-sm font-semibold truncate">
                    {property.beds} {property.beds === 1 ? "cama" : "camas"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 min-w-0">
                <Bath className="h-4 w-4 text-gray-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs md:text-sm font-semibold truncate">
                    {property.bathrooms}{" "}
                    {property.bathrooms === 1 ? "banheiro" : "banheiros"}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="min-w-0">
              <h4 className="font-semibold mb-1.5 text-xs md:text-sm">
                Descrição
              </h4>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                {property.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg">Comodidades</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingAmenities ? (
              <div className="flex items-center justify-center py-6">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-rose-500" />
                  <p className="text-xs md:text-sm text-gray-500">
                    Carregando comodidades...
                  </p>
                </div>
              </div>
            ) : amenities.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {amenities.map((amenity, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-[10px] md:text-xs h-4 md:h-5 px-1.5 md:px-2 truncate max-w-[150px]"
                  >
                    {amenity}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs md:text-sm text-gray-500">
                Nenhuma comodidade informada
              </p>
            )}
          </CardContent>
        </Card>

        {/* Availability Calendar */}
        <AvailabilityCalendar propertyId={property.id} />

        {/* Reviews Section */}
        {numberOfReviews > 0 && (
          <PropertyReviews
            propertyId={property.id}
            totalReviews={numberOfReviews}
          />
        )}

        {/* Link */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-semibold transition-colors text-sm"
        >
          Ver no Airbnb
          <ExternalLink className="h-4 w-4 shrink-0" />
        </a>
      </div>
    </ScrollArea>
  );
}
