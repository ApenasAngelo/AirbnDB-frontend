import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Home,
  DollarSign,
  Users,
  Star,
  Bed,
  Bath,
  ShieldCheck,
  MessageSquare,
  Award,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface SummaryCardsProps {
  totalListings: number;
  estimatedTotalUsers: number;
  overallAvgPrice: number;
  overallAvgRating: string;
  overallAvgCapacity: string;
  overallAvgBedrooms: string;
  overallAvgBathrooms: string;
  overallAvgReviews: string;
  totalHosts: number;
  totalSuperhosts: number;
  totalVerified: number;
  totalNeighborhoods: number;
}

export default function SummaryCards({
  totalListings,
  estimatedTotalUsers,
  overallAvgPrice,
  overallAvgRating,
  overallAvgCapacity,
  overallAvgBedrooms,
  overallAvgBathrooms,
  overallAvgReviews,
  totalHosts,
  totalSuperhosts,
  totalVerified,
  totalNeighborhoods,
}: SummaryCardsProps) {
  const [showAllCards, setShowAllCards] = useState(false);

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Home className="h-4 w-4 text-rose-500" />
                Total de Acomodações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {totalListings}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Distribuídas em {totalNeighborhoods} bairros
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                Usuários Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {estimatedTotalUsers}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Com avaliações registradas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                Preço Médio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                R$ {overallAvgPrice}
              </div>
              <p className="text-xs text-gray-500 mt-1">Por noite</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                Avaliação Média
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {overallAvgRating}
              </div>
              <p className="text-xs text-gray-500 mt-1">De 5.0 estrelas</p>
            </CardContent>
          </Card>
        </div>

        {/* Botão para expandir */}
        {!showAllCards && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setShowAllCards(true);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors active:scale-95"
            >
              <ChevronDown className="h-4 w-4" />
              Mostrar mais
            </button>
          </div>
        )}

        {/* Cards adicionais com animação */}
        {showAllCards && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 [&>*:nth-child(5)]:lg:col-start-2 [&>*:nth-child(6)]:lg:col-start-3 animate-[fadeIn_0.3s_ease-in]">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  Capacidade Média
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {overallAvgCapacity}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Hóspedes por propriedade
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Bed className="h-4 w-4 text-indigo-500" />
                  Quartos Médios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {overallAvgBedrooms}
                </div>
                <p className="text-xs text-gray-500 mt-1">Por propriedade</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Bath className="h-4 w-4 text-cyan-500" />
                  Banheiros Médios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {overallAvgBathrooms}
                </div>
                <p className="text-xs text-gray-500 mt-1">Por propriedade</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-orange-500" />
                  Reviews Médios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {overallAvgReviews}
                </div>
                <p className="text-xs text-gray-500 mt-1">Por propriedade</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Award className="h-4 w-4 text-rose-500" />
                  Superhosts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {totalSuperhosts}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {((totalSuperhosts / totalHosts) * 100).toFixed(1)}% do total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  Verificados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {totalVerified}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {((totalVerified / totalHosts) * 100).toFixed(1)}% do total
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Botão para colapsar */}
        {showAllCards && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setShowAllCards(false);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors active:scale-95"
            >
              <ChevronUp className="h-4 w-4" />
              Mostrar menos
            </button>
          </div>
        )}
      </div>
    </>
  );
}
