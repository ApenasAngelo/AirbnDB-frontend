import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays, Loader2 } from "lucide-react";
import { api } from "@/services/api";

interface AvailabilityCalendarProps {
  propertyId: string;
}

export default function AvailabilityCalendar({
  propertyId,
}: AvailabilityCalendarProps) {
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 0, 1));

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const dates = await api.getPropertyAvailability(propertyId);
        setAvailableDates(dates);
      } catch (error) {
        console.error("Erro ao carregar disponibilidade:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [propertyId]);

  // Função para verificar se uma data está disponível
  const isDateAvailable = (date: Date): boolean => {
    const dateStr = date.toISOString().split("T")[0];
    return availableDates.includes(dateStr);
  };

  // Desabilitar datas indisponíveis e datas fora de 2025
  const disabledMatcher = (date: Date): boolean => {
    const year = date.getFullYear();
    if (year !== 2025) return true;
    return !isDateAvailable(date);
  };

  // Prevenir navegação fora de 2025
  const handleMonthChange = (date: Date) => {
    if (date.getFullYear() === 2025) {
      setCurrentMonth(date);
    }
  };

  // Modificadores para estilizar datas disponíveis
  const modifiers = {
    available: (date: Date) =>
      date.getFullYear() === 2025 && isDateAvailable(date),
    unavailable: (date: Date) =>
      date.getFullYear() === 2025 && !isDateAvailable(date),
  };

  const modifiersClassNames = {
    available: "rounded-md bg-green-100 text-black font-bold",
    unavailable: "line-through !text-gray-400 hover:!bg-gray-50",
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Disponibilidade
          </CardTitle>
          <CardDescription>Verifique as datas disponíveis</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
            <p className="text-sm text-gray-500">
              Carregando disponibilidade...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const availableCount = availableDates.length;
  const totalDays = 365;
  const occupancyRate = Math.round(
    ((totalDays - availableCount) / totalDays) * 100
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Disponibilidade em 2025
        </CardTitle>
        <CardDescription>
          {availableCount}{" "}
          {availableCount === 1 ? "dia disponível" : "dias disponíveis"} • Taxa
          de ocupação: {occupancyRate}%
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="flex gap-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={currentMonth}
            onMonthChange={handleMonthChange}
            disabled={disabledMatcher}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            className="rounded-md border"
            fromDate={new Date(2025, 0, 1)}
            toDate={new Date(2025, 11, 31)}
            defaultMonth={new Date(2025, 0, 1)}
            numberOfMonths={2}
          />
        </div>
        <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 border border-green-200"></div>
            <span>Disponível</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200"></div>
            <span>Indisponível</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
