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
} from "lucide-react";
import type { Listing } from "@/types";

interface PropertyDetailsProps {
  listing: Listing | null;
}

export default function PropertyDetails({ listing }: PropertyDetailsProps) {
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
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {property.name}
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {property.neighborhood}
            </div>
            {rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{rating}</span>
                <span>({numberOfReviews} avaliações)</span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Price */}
        <Card className="bg-rose-50 border-rose-200">
          <CardContent className="pt-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-rose-600">
                R$ {price}
              </span>
              <span className="text-gray-600">/ noite</span>
            </div>
          </CardContent>
        </Card>

        {/* Host Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Home className="h-5 w-5" />
              Anfitrião
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">{host.name}</span>
              <div className="flex gap-2">
                {host.isSuperhost && (
                  <Badge
                    variant="secondary"
                    className="bg-rose-100 text-rose-700"
                  >
                    <Award className="h-3 w-3 mr-1" />
                    Superhost
                  </Badge>
                )}
                {host.verified && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700"
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verificado
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Membro desde{" "}
              {new Date(host.joinDate).toLocaleDateString("pt-BR", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detalhes da Propriedade</CardTitle>
            <CardDescription>
              {propertyTypeLabels[property.type]}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="text-sm font-semibold">
                    {property.capacity} hóspedes
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Bed className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="text-sm font-semibold">
                    {property.bedrooms}{" "}
                    {property.bedrooms === 1 ? "quarto" : "quartos"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Bed className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="text-sm font-semibold">
                    {property.beds} {property.beds === 1 ? "cama" : "camas"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Bath className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="text-sm font-semibold">
                    {property.bathrooms}{" "}
                    {property.bathrooms === 1 ? "banheiro" : "banheiros"}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-2 text-sm">Descrição</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {property.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Comodidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((amenity, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {amenity}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Link */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-semibold transition-colors"
        >
          Ver no Airbnb
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </ScrollArea>
  );
}
