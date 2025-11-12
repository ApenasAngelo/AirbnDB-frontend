// Tipos baseados no modelo ER fornecido

export interface Host {
  id: string;
  name: string;
  isSuperhost: boolean;
  verified: boolean;
  joinDate: string;
  url?: string;
  description?: string;
  location?: string;
}

export interface HostProfile extends Host {
  totalProperties: number;
  averageRating: number;
  totalReviews: number;
}

export interface Property {
  id: string;
  name: string;
  description: string;
  type: "apartment" | "house" | "room" | "other";
  capacity: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  neighborhood: string;
  latitude: number;
  longitude: number;
  totalAmenities?: number; // Contagem de amenidades (Consulta 1)
  availableDaysInPeriod?: number; // Dias disponíveis no período (Consulta 1)
}

export interface Listing {
  id: string;
  propertyId: string;
  hostId: string;
  price: number;
  url: string;
  rating: number;
  numberOfReviews: number;
  property: Property;
  host: Host;
  rankingAmongHostProperties?: number; // Ranking da propriedade entre as do anfitrião
}

export interface Calendar {
  id: string;
  propertyId: string;
  date: string;
  available: boolean;
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  comment: string;
  date: string;
  userTotalReviews?: number; // Total de avaliações feitas pelo usuário
}

// Tipos auxiliares para estatísticas
export interface NeighborhoodStats {
  neighborhood: string;
  totalListings: number;
  averagePrice: number;
  averageRating: number;
  averageCapacity: number;
  averageBedrooms: number;
  averageBathrooms: number;
  averageReviews: number;
  superhostCount: number;
  verifiedCount: number;
}

export interface OverviewStats {
  totalProperties: number;
  totalHosts: number;
  totalNeighborhoods: number;
  totalUsers: number;
  overallAvgPrice: number;
  overallAvgRating: number;
  totalSuperhosts: number;
  totalVerifiedHosts: number;
  totalReviews: number;
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
}

export type HeatmapMode = "none" | "density" | "price";
