import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  User,
  MapPin,
  Calendar,
  Award,
  CheckCircle2,
  Home,
  Star,
  MessageSquare,
  Loader2,
  ExternalLink,
  Users,
  Bed,
  Bath,
} from "lucide-react";
import { api } from "@/services/api";
import type { HostProfile as HostProfileType, Listing } from "@/types";
import HostProfileSkeleton from "@/components/skeletons/HostProfileSkeleton";

interface HostProfileProps {
  hostId: string;
  onBack: () => void;
  onPropertySelect: (listing: Listing) => void;
}

export default function HostProfile({
  hostId,
  onPropertySelect,
}: HostProfileProps) {
  const [profile, setProfile] = useState<HostProfileType | null>(null);
  const [properties, setProperties] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const profileData = await api.getHostProfile(hostId);
        setProfile(profileData);

        const propertiesData = await api.getHostProperties(hostId, 0);
        setProperties(propertiesData);
        setHasMore(propertiesData.length === 5);
        setOffset(5);
      } catch (error) {
        console.error("Erro ao carregar perfil do anfitrião:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [hostId]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const moreProperties = await api.getHostProperties(hostId, offset);
      setProperties((prev) => [...prev, ...moreProperties]);
      setHasMore(moreProperties.length === 5);
      setOffset((prev) => prev + 5);
    } catch (error) {
      console.error("Erro ao carregar mais propriedades:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <ScrollArea className="h-full">
        <HostProfileSkeleton />
      </ScrollArea>
    );
  }

  if (!profile) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <User className="h-12 w-12 md:h-16 md:w-16 text-gray-300 mx-auto" />
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-700">
              Anfitrião não encontrado
            </h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-3 pb-6">
        {/* Profile Header */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-start gap-2 md:gap-3">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <User className="h-6 w-6 md:h-8 md:w-8 text-rose-600" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base md:text-lg truncate mb-1.5">
                  {profile.name}
                </CardTitle>
                {(profile.isSuperhost || profile.verified) && (
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    {profile.isSuperhost && (
                      <Badge
                        variant="secondary"
                        className="bg-rose-100 text-rose-700 text-[10px] md:text-xs h-4 md:h-5 px-1.5"
                      >
                        <Award className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 shrink-0" />
                        <span className="hidden sm:inline">Superhost</span>
                        <span className="sm:hidden">Super</span>
                      </Badge>
                    )}
                    {profile.verified && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 text-[10px] md:text-xs h-4 md:h-5 px-1.5"
                      >
                        <CheckCircle2 className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 shrink-0" />
                        <span className="hidden sm:inline">Verificado</span>
                        <span className="sm:hidden">✓</span>
                      </Badge>
                    )}
                  </div>
                )}
                <div className="space-y-0.5 text-xs md:text-sm text-gray-600">
                  {profile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 md:h-3.5 md:w-3.5 shrink-0" />
                      <span className="truncate">{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 md:h-3.5 md:w-3.5 shrink-0" />
                    <span className="truncate">
                      Membro desde {formatDate(profile.joinDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          {profile.description && (
            <CardContent className="pt-0">
              <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                {profile.description}
              </p>
            </CardContent>
          )}
        </Card>

        {/* Link to Airbnb Profile */}
        {profile.url && (
          <a
            href={profile.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 md:py-2.5 px-3 md:px-4 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-semibold transition-colors text-xs md:text-sm"
          >
            Ver perfil no Airbnb
            <ExternalLink className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
          </a>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          <Card className="overflow-hidden">
            <CardContent className="pt-3 md:pt-4 pb-3 md:pb-4 text-center px-1">
              <div className="text-lg md:text-2xl font-bold text-gray-900">
                {profile.totalProperties}
              </div>
              <div className="text-[10px] md:text-sm text-gray-600 mt-0.5 md:mt-1 truncate">
                {profile.totalProperties === 1 ? "Propriedade" : "Propriedades"}
              </div>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <CardContent className="pt-3 md:pt-4 pb-3 md:pb-4 text-center px-1">
              <div className="flex items-center justify-center gap-0.5 md:gap-1">
                <Star className="h-4 w-4 md:h-5 md:w-5 fill-yellow-400 text-yellow-400 shrink-0" />
                <span className="text-lg md:text-2xl font-bold text-gray-900">
                  {profile.averageRating.toFixed(1)}
                </span>
              </div>
              <div className="text-[10px] md:text-sm text-gray-600 mt-0.5 md:mt-1 truncate">
                Avaliação
              </div>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <CardContent className="pt-3 md:pt-4 pb-3 md:pb-4 text-center px-1">
              <div className="flex items-center justify-center gap-0.5 md:gap-1">
                <MessageSquare className="h-4 w-4 md:h-5 md:w-5 text-gray-400 shrink-0" />
                <span className="text-lg md:text-2xl font-bold text-gray-900">
                  {profile.totalReviews}
                </span>
              </div>
              <div className="text-[10px] md:text-sm text-gray-600 mt-0.5 md:mt-1 truncate">
                Avaliações
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Properties Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Home className="h-4 w-4 md:h-5 md:w-5 text-gray-700 shrink-0" />
            <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate">
              Propriedades de {profile.name}
            </h3>
          </div>

          {properties.length === 0 ? (
            <Card className="overflow-hidden">
              <CardContent className="py-8 md:py-12 text-center">
                <Home className="h-10 w-10 md:h-12 md:w-12 text-gray-300 mx-auto mb-3 md:mb-4" />
                <p className="text-xs md:text-sm text-gray-600">
                  Nenhuma propriedade disponível no momento
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {properties.map((listing) => {
                const { property, host, price, rating, numberOfReviews } =
                  listing;

                return (
                  <Card
                    key={listing.id}
                    className="cursor-pointer hover:shadow-lg hover:border-rose-300 transition-all duration-200 overflow-hidden"
                    onClick={() => onPropertySelect(listing)}
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
                            <span className="truncate">
                              {property.neighborhood}
                            </span>
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
                            <span className="text-gray-500">
                              ({numberOfReviews})
                            </span>
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

                        {listing.rankingAmongHostProperties &&
                          listing.rankingAmongHostProperties <= 3 && (
                            <Badge
                              variant="secondary"
                              className="bg-yellow-100 text-yellow-700 text-[10px] md:text-xs h-4 md:h-5 px-1.5"
                            >
                              <Award className="h-2.5 w-2.5 mr-0.5 shrink-0" />#
                              {listing.rankingAmongHostProperties}
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
                            {property.amenities
                              .slice(0, 2)
                              .map((amenity, index) => (
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

              {hasMore && (
                <Button
                  onClick={handleLoadMore}
                  variant="outline"
                  className="w-full h-9 md:h-10 text-xs md:text-sm font-medium"
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-3 w-3 md:h-4 md:w-4 mr-2 animate-spin" />
                      Carregando...
                    </>
                  ) : (
                    "Ver mais propriedades"
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
