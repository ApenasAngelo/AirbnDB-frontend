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
import api from "@/services/api";

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
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <CalendarDays className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
            Disponibilidade
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Verifique as datas disponíveis
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8 md:py-12">
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-rose-500" />
            <p className="text-xs md:text-sm text-gray-500">
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
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base md:text-lg flex items-center gap-2">
          <CalendarDays className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
          Disponibilidade em 2025
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          {availableCount}{" "}
          {availableCount === 1 ? "dia disponível" : "dias disponíveis"} • Taxa
          de ocupação: {occupancyRate}%
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center p-3 md:p-6">
        <div className="w-full overflow-x-auto">
          <div className="flex justify-center min-w-fit">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={currentMonth}
              onMonthChange={handleMonthChange}
              disabled={disabledMatcher}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              className="rounded-md border mx-auto scale-[0.85] md:scale-100 origin-center"
              fromDate={new Date(2025, 0, 1)}
              toDate={new Date(2025, 11, 31)}
              defaultMonth={new Date(2025, 0, 1)}
              numberOfMonths={1}
            />
          </div>
        </div>
        <div className="mt-3 md:mt-4 flex items-center gap-3 md:gap-6 text-xs md:text-sm text-gray-600 flex-wrap justify-center">
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-green-100 border border-green-200 shrink-0"></div>
            <span>Disponível</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-gray-100 border border-gray-200 shrink-0"></div>
            <span>Indisponível</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
