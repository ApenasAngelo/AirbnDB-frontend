// Tipos para o sistema de filtros de busca

export interface SearchFiltersState {
  minPrice: number | null;
  maxPrice: number | null;
  neighborhoods: string[];
  minRating: number | null;
  minCapacity: number | null;
  minReviews: number | null;
  superhostOnly: boolean;
  checkInDate: string | null; // Data de check-in (YYYY-MM-DD)
  checkOutDate: string | null; // Data de check-out (YYYY-MM-DD)
  minAvailableDays: number | null; // Mínimo de dias disponíveis no período
}
