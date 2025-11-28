import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, User, Calendar, Loader2, X, Award } from "lucide-react";
import { api } from "@/services/api";
import type { Review } from "@/types";

interface PropertyReviewsProps {
  propertyId: string;
  totalReviews: number;
}

export default function PropertyReviews({
  propertyId,
  totalReviews,
}: PropertyReviewsProps) {
  const [latestReview, setLatestReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    const fetchLatestReview = async () => {
      setLoading(true);
      try {
        const reviews = await api.getPropertyReviews(propertyId, 0);
        if (reviews.length > 0) {
          setLatestReview(reviews[0]);
        }
      } catch (error) {
        console.error("Erro ao carregar avaliação:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestReview();
  }, [propertyId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <MessageSquare className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
            Avaliações
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            {totalReviews} {totalReviews === 1 ? "avaliação" : "avaliações"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8 md:py-12">
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-rose-500" />
            <p className="text-xs md:text-sm text-gray-500">
              Carregando avaliações...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!latestReview) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <MessageSquare className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
            Avaliações
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Nenhuma avaliação disponível
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <MessageSquare className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
            Avaliação Mais Recente
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            {totalReviews} {totalReviews === 1 ? "avaliação" : "avaliações"} no
            total
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4">
          {/* Latest Review */}
          <div className="space-y-2 md:space-y-3 min-w-0">
            <div className="flex items-start justify-between gap-2 md:gap-3 min-w-0">
              <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 md:h-5 md:w-5 text-rose-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                    <p className="font-semibold text-sm md:text-base text-gray-900 truncate">
                      {latestReview.userName}
                    </p>
                    {latestReview.userTotalReviews &&
                      latestReview.userTotalReviews > 5 && (
                        <span className="flex items-center gap-1 text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 bg-blue-100 text-blue-700 rounded-full shrink-0">
                          <Award className="h-2.5 w-2.5 md:h-3 md:w-3" />
                          {latestReview.userTotalReviews} avaliações
                        </span>
                      )}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] md:text-xs text-gray-500">
                    <Calendar className="h-2.5 w-2.5 md:h-3 md:w-3 shrink-0" />
                    <span className="truncate">
                      {formatDate(latestReview.date)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs md:text-sm text-gray-700 leading-relaxed wrap-break-word line-clamp-3">
              {latestReview.comment}
            </p>
          </div>

          {totalReviews > 1 && (
            <>
              <Separator />
              <Button
                onClick={() => setShowAllReviews(true)}
                variant="outline"
                className="w-full text-xs md:text-sm"
              >
                Mostrar mais comentários ({totalReviews - 1}{" "}
                {totalReviews - 1 === 1 ? "restante" : "restantes"})
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* All Reviews Modal */}
      {showAllReviews && (
        <AllReviewsModal
          propertyId={propertyId}
          totalReviews={totalReviews}
          onClose={() => setShowAllReviews(false)}
        />
      )}
    </>
  );
}

interface AllReviewsModalProps {
  propertyId: string;
  totalReviews: number;
  onClose: () => void;
}

function AllReviewsModal({
  propertyId,
  totalReviews,
  onClose,
}: AllReviewsModalProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadReviews(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadReviews = async (currentOffset: number) => {
    setLoading(true);
    try {
      const newReviews = await api.getPropertyReviews(
        propertyId,
        currentOffset
      );

      if (currentOffset === 0) {
        setReviews(newReviews);
      } else {
        setReviews((prev) => [...prev, ...newReviews]);
      }

      // Verificar se há mais reviews
      setHasMore(currentOffset + newReviews.length < totalReviews);
      setOffset(currentOffset + 10);
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    loadReviews(offset);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return createPortal(
    <div
      className="fixed inset-0 z-1001 bg-black/50 flex items-center justify-center p-4"
      style={{ height: "100dvh" }}
    >
      <Card className="w-full max-w-3xl h-[80vh] flex flex-col overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 shrink-0">
          <div className="min-w-0 flex-1 mr-2">
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <MessageSquare className="h-5 w-5 md:h-6 md:w-6 shrink-0" />
              <span className="truncate">Todas as Avaliações</span>
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              {totalReviews} {totalReviews === 1 ? "avaliação" : "avaliações"}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <Separator className="shrink-0" />

        <ScrollArea className="flex-1 overflow-auto">
          <div className="space-y-6 py-6 px-4 md:px-6">
            {reviews.map((review, index) => (
              <div key={review.id} className="min-w-0">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3 min-w-0">
                    <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                        <User className="h-5 w-5 md:h-6 md:w-6 text-rose-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                          <p className="font-semibold text-sm md:text-base text-gray-900 truncate">
                            {review.userName}
                          </p>
                          {review.userTotalReviews &&
                            review.userTotalReviews > 5 && (
                              <span className="flex items-center gap-1 text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full shrink-0">
                                <Award className="h-2.5 w-2.5 md:h-3 md:w-3" />
                                {review.userTotalReviews} avaliações
                              </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1 text-xs md:text-sm text-gray-500">
                          <Calendar className="h-3 w-3 md:h-3.5 md:w-3.5 shrink-0" />
                          <span className="truncate">
                            {formatDate(review.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-gray-700 leading-relaxed wrap-break-word line-clamp-3">
                    {review.comment}
                  </p>
                </div>
                {index < reviews.length - 1 && <Separator className="mt-6" />}
              </div>
            ))}

            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-rose-500" />
              </div>
            )}
          </div>
        </ScrollArea>

        {hasMore && !loading && (
          <div className="p-4 md:p-6 pt-4 shrink-0 border-t">
            <Button
              onClick={handleLoadMore}
              variant="outline"
              className="w-full text-xs md:text-sm"
            >
              Carregar mais avaliações
            </Button>
          </div>
        )}
      </Card>
    </div>,
    document.body
  );
}
