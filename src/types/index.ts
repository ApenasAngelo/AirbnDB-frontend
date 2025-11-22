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
  neighborhoodRanking?: number; // Ranking da propriedade no bairro
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

export interface HostRanking {
  hostId: number;
  hostName: string;
  isSuperhost: boolean;
  verified: boolean;
  neighborhood: string;
  totalProperties: number;
  avgRating: number;
  totalReviews: number;
  avgPrice: number;
  neighborhoodHostRank: number;
  originalRank?: number; // Ranking original baseado no critério principal
}

export interface TrendingProperty {
  propertyId: number;
  propertyName: string;
  neighborhood: string;
  price: number;
  rating: number;
  hostName: string;
  isSuperhost: boolean;
  recentReviewsCount: number;
  uniqueReviewers: number;
  avgCommentLength: number;
  originalRank?: number; // Ranking original baseado em reviews recentes
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
}

export type HeatmapMode = "none" | "density" | "price";
