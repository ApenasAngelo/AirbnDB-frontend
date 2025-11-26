import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3 } from "lucide-react";
import Statistics from "@/components/Statistics";

export default function StatisticsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="border-b bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-7 w-7 text-blue-500" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Dashboard de Estatísticas
                  </h1>
                  <p className="text-sm text-gray-500">
                    Análise completa dos dados de acomodações
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => navigate("/map")}
              variant="outline"
              className="hover:bg-gray-100"
            >
              Ir para o Mapa
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Statistics />
      </main>
    </div>
  );
}
