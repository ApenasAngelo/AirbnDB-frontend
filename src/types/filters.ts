// Tipos para o sistema de filtros de busca

export interface SearchFiltersState {
  minPrice: number | null;
  maxPrice: number | null;
  neighborhoods: string[];
  minRating: number | null;
  minCapacity: number | null;
  minReviews: number | null;
  superhostOnly: boolean;
}
