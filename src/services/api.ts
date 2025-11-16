import type {
  Listing,
  Property,
  Host,
  HostProfile,
  NeighborhoodStats,
  HeatmapPoint,
  Review,
} from "../types";

// Configuração da API
const API_BASE_URL = "http://localhost:8000/api";

/**
 * Interface para dados do backend
 */
interface BackendListingData {
  property_id: number;
  property_name: string;
  property_description?: string;
  property_type: string;
  capacity: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  neighborhood: string;
  latitude: number;
  longitude: number;
  room_type?: string;
  price: number;
  listing_url: string;
  rating: number;
  number_of_reviews: number;
  host_id: number;
  host_name: string;
  is_superhost: boolean;
  verified: boolean;
  host_join_date?: string;
  total_amenities?: number;
  available_days_in_period?: number;
  ranking_among_host_properties?: number;
}

interface BackendAmenityData {
  amenity_name: string;
}

interface BackendNeighborhoodStatsData {
  neighborhood: string;
  total_listings: number;
  average_price: number;
  average_rating: number;
  average_capacity: number;
  average_bedrooms: number;
  average_bathrooms: number;
  average_reviews: number;
  superhost_count: number;
  verified_count: number;
}

interface BackendHeatmapData {
  lat: number;
  lng: number;
  intensity: number;
  price?: number;
}

interface BackendAvailabilityData {
  date: string;
}

interface BackendReviewData {
  review_id: number;
  user_id: number;
  user_name: string;
  comment?: string;
  review_date: string;
  user_total_reviews?: number;
}

interface BackendHostProfileData {
  host_id: number;
  host_name: string;
  host_url?: string;
  host_join_date?: string;
  host_description?: string;
  is_superhost: boolean;
  verified: boolean;
  host_location?: string;
  total_properties: number;
  average_rating: number;
  total_reviews: number;
}

interface BackendHostPropertyData {
  property_id: number;
  property_name: string;
  property_type: string;
  neighborhood: string;
  price: number;
  rating: number;
  number_of_reviews: number;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  ranking_among_host_properties: number;
}

/**
 * Converte os dados do backend para o formato esperado pelo frontend
 */
const transformBackendListing = (backendData: BackendListingData): Listing => {
  const property: Property = {
    id: backendData.property_id.toString(),
    name: backendData.property_name,
    description: backendData.property_description || "",
    type: backendData.property_type as "apartment" | "house" | "room" | "other",
    capacity: backendData.capacity,
    bedrooms: backendData.bedrooms,
    beds: backendData.beds,
    bathrooms: backendData.bathrooms,
    amenities: [], // Será carregado separadamente se necessário
    neighborhood: backendData.neighborhood,
    latitude: backendData.latitude,
    longitude: backendData.longitude,
  };

  const host: Host = {
    id: backendData.host_id.toString(),
    name: backendData.host_name,
    isSuperhost: backendData.is_superhost,
    verified: backendData.verified,
    joinDate: backendData.host_join_date || "",
  };

  return {
    id: backendData.property_id.toString(),
    propertyId: backendData.property_id.toString(),
    hostId: backendData.host_id.toString(),
    price: backendData.price,
    url: backendData.listing_url,
    rating: backendData.rating,
    numberOfReviews: backendData.number_of_reviews,
    property,
    host,
    rankingAmongHostProperties: backendData.ranking_among_host_properties,
  };
};

// API Mock Service
export const api = {
  // CONSULTA 1 UNIFICADA: Buscar listings com filtros opcionais
  searchListings: async (params?: {
    // Filtros de área (bounds) - para lazy loading
    north?: number | null;
    south?: number | null;
    east?: number | null;
    west?: number | null;
    zoom?: number | null;

    // Filtros de busca avançada
    minPrice?: number | null;
    maxPrice?: number | null;
    neighborhoods?: string[];
    minRating?: number | null;
    minCapacity?: number | null;
    minReviews?: number | null;
    superhostOnly?: boolean;

    // Filtros de disponibilidade
    checkInDate?: string | null;
    checkOutDate?: string | null;
    minAvailableDays?: number | null;
  }): Promise<Listing[]> => {
    const queryParams = new URLSearchParams();

    // Adicionar parâmetros de bounds
    if (params?.south !== undefined && params.south !== null)
      queryParams.append("south", params.south.toString());
    if (params?.north !== undefined && params.north !== null)
      queryParams.append("north", params.north.toString());
    if (params?.west !== undefined && params.west !== null)
      queryParams.append("west", params.west.toString());
    if (params?.east !== undefined && params.east !== null)
      queryParams.append("east", params.east.toString());

    // Adicionar filtros de preço
    if (params?.minPrice)
      queryParams.append("min_price", params.minPrice.toString());
    if (params?.maxPrice)
      queryParams.append("max_price", params.maxPrice.toString());

    // Adicionar filtros de qualidade
    if (params?.minRating)
      queryParams.append("min_rating", params.minRating.toString());
    if (params?.minCapacity)
      queryParams.append("min_capacity", params.minCapacity.toString());
    if (params?.minReviews)
      queryParams.append("min_reviews", params.minReviews.toString());

    // Adicionar filtro de superhost
    if (params?.superhostOnly !== undefined)
      queryParams.append("superhost_only", params.superhostOnly.toString());

    // Adicionar filtros de disponibilidade
    if (params?.checkInDate) queryParams.append("check_in", params.checkInDate);
    if (params?.checkOutDate)
      queryParams.append("check_out", params.checkOutDate);
    if (params?.minAvailableDays)
      queryParams.append(
        "min_available_days",
        params.minAvailableDays.toString()
      );

    // Adicionar bairros (multi-seleção)
    if (params?.neighborhoods?.length) {
      queryParams.append("neighborhoods", params.neighborhoods.join(","));
    }

    // Adicionar limit baseado no zoom
    if (params?.zoom !== undefined && params?.zoom !== null) {
      if (params.zoom < 12) {
        queryParams.append("limit", "500");
      } else if (params.zoom < 14) {
        queryParams.append("limit", "2000");
      }
      // Zoom >= 14: sem limite (retorna todos os resultados filtrados)
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/listings/search?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.map(transformBackendListing);
    } catch (error) {
      console.error("Erro ao buscar listings:", error);
      throw error;
    }
  },

  // Alias para manter compatibilidade (sem filtros = listar todas)
  getListings: async (): Promise<Listing[]> => {
    return api.searchListings();
  },

  // Alias para manter compatibilidade (com bounds)
  getListingsByBounds: async (params: {
    north: number;
    south: number;
    east: number;
    west: number;
    zoom: number;
    filters?: {
      minPrice?: number | null;
      maxPrice?: number | null;
      neighborhoods?: string[];
      minRating?: number | null;
      minCapacity?: number | null;
      minReviews?: number | null;
      superhostOnly?: boolean;
    };
  }): Promise<Listing[]> => {
    return api.searchListings({
      north: params.north,
      south: params.south,
      east: params.east,
      west: params.west,
      zoom: params.zoom,
      ...params.filters,
    });
  },

  // Obter listing por ID
  getListingById: async (id: string): Promise<Listing | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/listings/${id}`);

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return transformBackendListing(data);
    } catch (error) {
      console.error("Erro ao buscar listing por ID:", error);
      return null;
    }
  },

  // CONSULTA 2: Obter amenidades de uma propriedade específica
  getPropertyAmenities: async (propertyId: string): Promise<string[]> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/properties/${propertyId}/amenities`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BackendAmenityData[] = await response.json();
      return data.map((item) => item.amenity_name);
    } catch (error) {
      console.error("Erro ao buscar amenidades:", error);
      return [];
    }
  },

  // CONSULTA 3: Obter estatísticas agregadas por bairro
  getNeighborhoodStats: async (): Promise<NeighborhoodStats[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/neighborhoods/stats`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BackendNeighborhoodStatsData[] = await response.json();
      return data.map((item) => ({
        neighborhood: item.neighborhood,
        totalListings: item.total_listings,
        averagePrice: item.average_price,
        averageRating: item.average_rating,
        averageCapacity: item.average_capacity,
        averageBedrooms: item.average_bedrooms,
        averageBathrooms: item.average_bathrooms,
        averageReviews: item.average_reviews,
        superhostCount: item.superhost_count,
        verifiedCount: item.verified_count,
      }));
    } catch (error) {
      console.error("Erro ao buscar estatísticas por bairro:", error);
      return [];
    }
  },

  // CONSULTA 4: Obter dados para heatmap de densidade
  getDensityHeatmap: async (): Promise<HeatmapPoint[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/heatmap/density`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BackendHeatmapData[] = await response.json();
      return data.map((item) => ({
        lat: item.lat,
        lng: item.lng,
        intensity: item.intensity,
      }));
    } catch (error) {
      console.error("Erro ao buscar heatmap de densidade:", error);
      return [];
    }
  },

  // CONSULTA 5: Obter dados para heatmap de preço
  getPriceHeatmap: async (): Promise<HeatmapPoint[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/heatmap/price`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BackendHeatmapData[] = await response.json();
      return data.map((item) => ({
        lat: item.lat,
        lng: item.lng,
        intensity: item.intensity,
        price: item.price,
      }));
    } catch (error) {
      console.error("Erro ao buscar heatmap de preços:", error);
      return [];
    }
  },

  // CONSULTA 6: Verificar disponibilidade de propriedade
  getPropertyAvailability: async (propertyId: string): Promise<string[]> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/properties/${propertyId}/availability`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BackendAvailabilityData[] = await response.json();
      return data.map((item) => item.date);
    } catch (error) {
      console.error("Erro ao buscar disponibilidade:", error);
      return [];
    }
  },

  // CONSULTA 7: Obter avaliações de uma propriedade (paginado)
  getPropertyReviews: async (
    propertyId: string,
    offset: number = 0,
    minYear?: number
  ): Promise<Review[]> => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("offset", offset.toString());
      if (minYear) queryParams.append("min_year", minYear.toString());

      const response = await fetch(
        `${API_BASE_URL}/properties/${propertyId}/reviews?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BackendReviewData[] = await response.json();
      return data.map((item) => ({
        id: item.review_id.toString(),
        propertyId: propertyId,
        userId: item.user_id.toString(),
        userName: item.user_name,
        comment: item.comment || "",
        date: item.review_date,
        userTotalReviews: item.user_total_reviews || 0,
      }));
    } catch (error) {
      console.error("Erro ao buscar reviews:", error);
      return [];
    }
  },

  // CONSULTA 9a: Obter perfil do anfitrião
  getHostProfile: async (hostId: string): Promise<HostProfile> => {
    try {
      const response = await fetch(`${API_BASE_URL}/hosts/${hostId}/profile`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BackendHostProfileData = await response.json();
      return {
        id: data.host_id.toString(),
        name: data.host_name,
        url: data.host_url,
        joinDate: data.host_join_date || "",
        description: data.host_description,
        isSuperhost: data.is_superhost,
        verified: data.verified,
        location: data.host_location,
        totalProperties: data.total_properties,
        averageRating: data.average_rating,
        totalReviews: data.total_reviews,
      };
    } catch (error) {
      console.error("Erro ao buscar perfil do host:", error);
      throw error;
    }
  },

  // CONSULTA 9b: Obter propriedades do anfitrião (paginado)
  getHostProperties: async (
    hostId: string,
    offset: number = 0
  ): Promise<Listing[]> => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("offset", offset.toString());

      const response = await fetch(
        `${API_BASE_URL}/hosts/${hostId}/properties?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BackendHostPropertyData[] = await response.json();
      return data.map((item) => {
        const property: Property = {
          id: item.property_id.toString(),
          name: item.property_name,
          description: "",
          type: item.property_type as "apartment" | "house" | "room" | "other",
          capacity: item.capacity,
          bedrooms: item.bedrooms,
          beds: 0,
          bathrooms: item.bathrooms,
          amenities: [],
          neighborhood: item.neighborhood,
          latitude: 0,
          longitude: 0,
        };

        const host: Host = {
          id: hostId,
          name: "",
          isSuperhost: false,
          verified: false,
          joinDate: "",
        };

        return {
          id: item.property_id.toString(),
          propertyId: item.property_id.toString(),
          hostId: hostId,
          price: item.price,
          url: "",
          rating: item.rating,
          numberOfReviews: item.number_of_reviews,
          property,
          host,
          rankingAmongHostProperties: item.ranking_among_host_properties,
        };
      });
    } catch (error) {
      console.error("Erro ao buscar propriedades do host:", error);
      return [];
    }
  },
};

export default api;
