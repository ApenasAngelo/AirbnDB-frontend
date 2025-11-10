import { useState, useEffect } from "react";
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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Avaliações
          </CardTitle>
          <CardDescription>
            {totalReviews} {totalReviews === 1 ? "avaliação" : "avaliações"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
            <p className="text-sm text-gray-500">Carregando avaliações...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!latestReview) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Avaliações
          </CardTitle>
          <CardDescription>Nenhuma avaliação disponível</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Avaliação Mais Recente
          </CardTitle>
          <CardDescription>
            {totalReviews} {totalReviews === 1 ? "avaliação" : "avaliações"} no
            total
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Latest Review */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-rose-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">
                      {latestReview.userName}
                    </p>
                    {latestReview.userTotalReviews &&
                      latestReview.userTotalReviews > 5 && (
                        <span className="flex items-center gap-1 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                          <Award className="h-3 w-3" />
                          {latestReview.userTotalReviews} avaliações
                        </span>
                      )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {formatDate(latestReview.date)}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {latestReview.comment}
            </p>
          </div>

          {totalReviews > 1 && (
            <>
              <Separator />
              <Button
                onClick={() => setShowAllReviews(true)}
                variant="outline"
                className="w-full"
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

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 shrink-0">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              Todas as Avaliações
            </CardTitle>
            <CardDescription>
              {totalReviews} {totalReviews === 1 ? "avaliação" : "avaliações"}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <Separator className="shrink-0" />

        <ScrollArea className="flex-1 overflow-auto">
          <div className="space-y-6 py-6 px-6">
            {reviews.map((review, index) => (
              <div key={review.id}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                        <User className="h-6 w-6 text-rose-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">
                            {review.userName}
                          </p>
                          {review.userTotalReviews &&
                            review.userTotalReviews > 5 && (
                              <span className="flex items-center gap-1 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                                <Award className="h-3 w-3" />
                                {review.userTotalReviews} avaliações
                              </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(review.date)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed pl-15">
                    {review.comment}
                  </p>
                </div>
                {index < reviews.length - 1 && <Separator className="mt-6" />}
              </div>
            ))}

            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
              </div>
            )}
          </div>
        </ScrollArea>

        {hasMore && !loading && (
          <div className="p-6 pt-4 shrink-0 border-t">
            <Button
              onClick={handleLoadMore}
              variant="outline"
              className="w-full"
            >
              Carregar mais avaliações
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
