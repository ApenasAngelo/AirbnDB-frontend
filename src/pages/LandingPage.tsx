import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Database, TrendingUp } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 via-white to-pink-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-8 w-8 text-rose-500" />
            <h1 className="text-2xl font-bold text-gray-900">AirbnDB</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Title */}
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Explore Acomodações do
              <span className="block text-rose-500 mt-2">Rio de Janeiro</span>
            </h2>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Projeto acadêmico de Banco de Dados - Visualização interativa de
              dados de acomodações Airbnb da nossa cidade em 2025
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 pt-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <MapPin className="h-12 w-12 text-rose-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Mapa Interativo</h3>
              <p className="text-gray-600 text-sm">
                Visualize todas as acomodações em um mapa com controles
                avançados e mapas de calor
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <Database className="h-12 w-12 text-rose-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Dados Completos</h3>
              <p className="text-gray-600 text-sm">
                Acesse informações detalhadas sobre cada propriedade, host e
                avaliações
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <TrendingUp className="h-12 w-12 text-rose-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Estatísticas</h3>
              <p className="text-gray-600 text-sm">
                Analise médias de preços, avaliações e distribuição por bairro
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => navigate("/map")}
              size="lg"
              className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <MapPin className="h-5 w-5 mr-2" />
              Mapa Interativo
            </Button>
            <Button
              onClick={() => navigate("/statistics")}
              size="lg"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Dashboard de Estatísticas
            </Button>
          </div>

          {/* Info Footer */}
          <div className="pt-12 text-sm text-gray-500 space-y-2">
            <p>📚 Trabalho da disciplina de Banco de Dados</p>
            <p>
              🗃️ Dataset: <span></span>
              <a href="https://insideairbnb.com/" target="_blank">
                Inside Airbnb - Rio de Janeiro, Rio de Janeiro, Brazil
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full py-6 text-center text-sm text-gray-500 border-t bg-white/50">
        <p>
          2025 - Projeto Acadêmico | Dados obtidos via <span></span>
          <a href="https://insideairbnb.com/" target="_blank">
            insideairbnb.com
          </a>
        </p>
      </footer>
    </div>
  );
}
