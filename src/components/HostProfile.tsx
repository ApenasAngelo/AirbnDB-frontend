import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  ArrowLeft,
  Loader2,
  ExternalLink,
  Medal,
} from "lucide-react";
import { api } from "@/services/api";
import type { HostProfile as HostProfileType, Listing } from "@/types";

interface HostProfileProps {
  hostId: string;
  onBack: () => void;
  onPropertySelect: (listing: Listing) => void;
}

export default function HostProfile({
  hostId,
  onBack,
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
      <div className="h-full flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
          <p className="text-sm text-gray-500">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <User className="h-16 w-16 text-gray-300 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Anfitrião não encontrado
            </h3>
            <Button onClick={onBack} variant="outline" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Back Button */}
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <User className="h-10 w-10 text-rose-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-2xl">{profile.name}</CardTitle>
                  {profile.isSuperhost && (
                    <Badge
                      variant="secondary"
                      className="bg-rose-100 text-rose-700"
                    >
                      <Award className="h-3 w-3 mr-1" />
                      Superhost
                    </Badge>
                  )}
                  {profile.verified && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verificado
                    </Badge>
                  )}
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  {profile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Membro desde {formatDate(profile.joinDate)}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          {profile.description && (
            <CardContent>
              <p className="text-sm text-gray-700 leading-relaxed">
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
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-semibold transition-colors"
          >
            Ver perfil no Airbnb
            <ExternalLink className="h-4 w-4" />
          </a>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {profile.totalProperties}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {profile.totalProperties === 1 ? "Propriedade" : "Propriedades"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold text-gray-900">
                  {profile.averageRating.toFixed(1)}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-1">Avaliação média</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="flex items-center justify-center gap-1">
                <MessageSquare className="h-5 w-5 text-gray-400" />
                <span className="text-2xl font-bold text-gray-900">
                  {profile.totalReviews}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-1">Avaliações</div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Properties Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Home className="h-5 w-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">
              Propriedades de {profile.name}
            </h3>
          </div>

          {properties.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Home className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">
                  Nenhuma propriedade disponível no momento
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {properties.map((listing) => (
                <Card
                  key={listing.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onPropertySelect(listing)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base flex items-center gap-2">
                          {listing.property.name}
                          {listing.rankingAmongHostProperties &&
                            listing.rankingAmongHostProperties <= 3 && (
                              <span className="flex items-center gap-1 text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-normal">
                                <Medal className="h-3 w-3" />#
                                {listing.rankingAmongHostProperties}
                              </span>
                            )}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {listing.property.neighborhood}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span>
                            {listing.property.capacity}{" "}
                            {listing.property.capacity === 1
                              ? "hóspede"
                              : "hóspedes"}
                          </span>
                          <span>•</span>
                          <span>
                            {listing.property.bedrooms}{" "}
                            {listing.property.bedrooms === 1
                              ? "quarto"
                              : "quartos"}
                          </span>
                          <span>•</span>
                          <span>
                            {listing.property.bathrooms}{" "}
                            {listing.property.bathrooms === 1
                              ? "banheiro"
                              : "banheiros"}
                          </span>
                        </div>
                        {listing.rating > 0 && (
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">
                              {listing.rating}
                            </span>
                            <span className="text-gray-600">
                              ({listing.numberOfReviews})
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          R$ {listing.price}
                        </div>
                        <div className="text-sm text-gray-600">/ noite</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {hasMore && (
                <Button
                  onClick={handleLoadMore}
                  variant="outline"
                  className="w-full"
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
