import type {
  Listing,
  Property,
  Host,
  HostProfile,
  NeighborhoodStats,
  HeatmapPoint,
  Review,
} from "../types";

// Bairros do Rio de Janeiro com coordenadas aproximadas
const neighborhoods = [
  { name: "Copacabana", lat: -22.9711, lng: -43.1822 },
  { name: "Ipanema", lat: -22.9838, lng: -43.2043 },
  { name: "Leblon", lat: -22.9844, lng: -43.2253 },
  { name: "Barra da Tijuca", lat: -23.0045, lng: -43.3647 },
  { name: "Botafogo", lat: -22.9519, lng: -43.1847 },
  { name: "Lapa", lat: -22.9138, lng: -43.1803 },
  { name: "Santa Teresa", lat: -22.9211, lng: -43.1897 },
  { name: "Flamengo", lat: -22.9324, lng: -43.1755 },
  { name: "Lagoa", lat: -22.9711, lng: -43.2055 },
  { name: "Tijuca", lat: -22.9236, lng: -43.2341 },
  { name: "Centro", lat: -22.9068, lng: -43.1729 },
  { name: "Recreio", lat: -23.0275, lng: -43.4502 },
];

const amenitiesList = [
  "Wi-Fi",
  "Ar-condicionado",
  "Cozinha",
  "TV",
  "Máquina de lavar",
  "Estacionamento",
  "Piscina",
  "Academia",
  "Portaria 24h",
  "Vista para o mar",
  "Varanda",
  "Churrasqueira",
  "Elevador",
  "Pets permitidos",
];

const propertyTypes: Array<"apartment" | "house" | "room" | "other"> = [
  "apartment",
  "house",
  "room",
  "other",
];

const firstNames = [
  "João",
  "Maria",
  "Pedro",
  "Ana",
  "Carlos",
  "Juliana",
  "Lucas",
  "Beatriz",
  "Rafael",
  "Camila",
  "Fernando",
  "Patricia",
  "Gustavo",
  "Mariana",
  "Ricardo",
];

const lastNames = [
  "Silva",
  "Santos",
  "Oliveira",
  "Souza",
  "Costa",
  "Ferreira",
  "Rodrigues",
  "Almeida",
  "Nascimento",
  "Lima",
  "Araujo",
  "Fernandes",
  "Carvalho",
  "Gomes",
];

// Função auxiliar para gerar número aleatório
const random = (min: number, max: number) => Math.random() * (max - min) + min;

// Função auxiliar para selecionar item aleatório
const randomItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

// Função auxiliar para selecionar múltiplos itens aleatórios
const randomItems = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Gerar hosts mockados
const generateMockHosts = (count: number): Host[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `host-${i + 1}`,
    name: `${randomItem(firstNames)} ${randomItem(lastNames)}`,
    isSuperhost: Math.random() > 0.7,
    verified: Math.random() > 0.3,
    joinDate: new Date(
      2018 + Math.floor(Math.random() * 6),
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    ).toISOString(),
  }));
};

// Gerar propriedades mockadas
const generateMockProperties = (count: number): Property[] => {
  return Array.from({ length: count }, (_, i) => {
    const neighborhood = randomItem(neighborhoods);
    const type = randomItem(propertyTypes);

    // Adicionar variação nas coordenadas para distribuir as propriedades
    const latOffset = (Math.random() - 0.5) * 0.02;
    const lngOffset = (Math.random() - 0.5) * 0.02;

    const bedrooms = type === "room" ? 1 : Math.floor(random(1, 5));
    const capacity = bedrooms * 2 + Math.floor(random(0, 2));

    return {
      id: `property-${i + 1}`,
      name: `${
        type === "apartment"
          ? "Apartamento"
          : type === "house"
          ? "Casa"
          : type === "room"
          ? "Quarto"
          : "Acomodação"
      } em ${neighborhood.name}`,
      description: `Linda ${
        type === "apartment"
          ? "apartamento"
          : type === "house"
          ? "casa"
          : type === "room"
          ? "quarto"
          : "acomodação"
      } localizada no coração de ${
        neighborhood.name
      }. Perfeita para quem busca conforto e praticidade. Próximo a restaurantes, praias e pontos turísticos.`,
      type,
      capacity,
      bedrooms,
      beds: bedrooms + Math.floor(random(0, 2)),
      bathrooms: Math.max(1, Math.floor(bedrooms / 2)),
      amenities: randomItems(amenitiesList, Math.floor(random(4, 10))),
      neighborhood: neighborhood.name,
      latitude: neighborhood.lat + latOffset,
      longitude: neighborhood.lng + lngOffset,
    };
  });
};

// Gerar listings mockados
const generateMockListings = (
  properties: Property[],
  hosts: Host[]
): Listing[] => {
  return properties.map((property, i) => {
    const host = randomItem(hosts);

    // Preços variam por bairro e tipo
    let basePrice = 150;
    if (["Leblon", "Ipanema"].includes(property.neighborhood)) {
      basePrice = 300;
    } else if (
      ["Copacabana", "Barra da Tijuca"].includes(property.neighborhood)
    ) {
      basePrice = 250;
    } else if (
      ["Botafogo", "Lagoa", "Flamengo"].includes(property.neighborhood)
    ) {
      basePrice = 200;
    }

    if (property.type === "house") {
      basePrice *= 1.5;
    } else if (property.type === "room") {
      basePrice *= 0.5;
    }

    const price = Math.round(basePrice + random(-50, 100));
    const numberOfReviews = Math.floor(random(0, 150));

    return {
      id: `listing-${i + 1}`,
      propertyId: property.id,
      hostId: host.id,
      price,
      url: `https://airbnb.com/rooms/${property.id}`,
      rating: numberOfReviews > 0 ? Number(random(3.5, 5.0).toFixed(2)) : 0,
      numberOfReviews,
      property,
      host,
    };
  });
};

// Gerar dados mockados
const mockHosts = generateMockHosts(30);
const mockProperties = generateMockProperties(80);
const mockListings = generateMockListings(mockProperties, mockHosts);

// API Mock Service
export const api = {
  // CONSULTA UNIFICADA: Buscar listings com filtros opcionais (Consulta 1)
  // Substitui: getListings(), searchListings() e getListingsByBounds()
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
  }): Promise<Listing[]> => {
    // Simular delay de rede (requisição ao backend)
    const delay = params?.north !== undefined ? 200 : 400; // Menor delay para bounds
    await new Promise((resolve) => setTimeout(resolve, delay));

    // TODO: Quando o backend estiver ativo, substituir por:
    // const queryParams = new URLSearchParams();
    // if (params?.minPrice) queryParams.append('min_price', params.minPrice.toString());
    // if (params?.maxPrice) queryParams.append('max_price', params.maxPrice.toString());
    // if (params?.north) queryParams.append('north', params.north.toString());
    // if (params?.south) queryParams.append('south', params.south.toString());
    // if (params?.east) queryParams.append('east', params.east.toString());
    // if (params?.west) queryParams.append('west', params.west.toString());
    // if (params?.zoom) queryParams.append('zoom', params.zoom.toString());
    // if (params?.minRating) queryParams.append('min_rating', params.minRating.toString());
    // if (params?.minCapacity) queryParams.append('min_capacity', params.minCapacity.toString());
    // if (params?.minReviews) queryParams.append('min_reviews', params.minReviews.toString());
    // if (params?.superhostOnly) queryParams.append('superhost_only', params.superhostOnly.toString());
    // if (params?.neighborhoods?.length) {
    //   params.neighborhoods.forEach(n => queryParams.append('neighborhood', n));
    // }
    // const response = await fetch(`http://localhost:8000/api/listings/search?${queryParams}`);
    // return await response.json();

    // Mock: aplicar filtros localmente (simula resposta do backend)
    let results = mockListings;

    // Filtrar por bounds (se fornecidos)
    if (
      params?.north !== undefined &&
      params?.south !== undefined &&
      params?.east !== undefined &&
      params?.west !== undefined
    ) {
      results = results.filter((listing) => {
        const lat = listing.property.latitude;
        const lng = listing.property.longitude;
        return (
          lat <= params.north! &&
          lat >= params.south! &&
          lng <= params.east! &&
          lng >= params.west!
        );
      });
    }

    // Aplicar filtros de busca
    results = results.filter((listing) => {
      if (params?.minPrice && listing.price < params.minPrice) return false;
      if (params?.maxPrice && listing.price > params.maxPrice) return false;
      if (
        params?.neighborhoods &&
        params.neighborhoods.length > 0 &&
        !params.neighborhoods.includes(listing.property.neighborhood)
      )
        return false;
      if (params?.minRating && listing.rating < params.minRating) return false;
      if (params?.minCapacity && listing.property.capacity < params.minCapacity)
        return false;
      if (params?.minReviews && listing.numberOfReviews < params.minReviews)
        return false;
      if (params?.superhostOnly && !listing.host.isSuperhost) return false;

      return true;
    });

    // Simplificação por zoom (se fornecido)
    if (params?.zoom !== undefined && params.zoom !== null) {
      if (params.zoom < 12) {
        // Zoom < 12: Mostrar apenas 20% dos pontos (melhor avaliados)
        results = results
          .sort(
            (a, b) =>
              b.rating - a.rating || b.numberOfReviews - a.numberOfReviews
          )
          .slice(0, Math.ceil(results.length * 0.2));
      } else if (params.zoom < 14) {
        // Zoom 12-14: Mostrar 50% dos pontos
        results = results
          .sort((a, b) => b.rating - a.rating)
          .slice(0, Math.ceil(results.length * 0.5));
      }
      // Zoom >= 14: Mostrar todos
    }

    // Ordenar por relevância (rating e reviews)
    results.sort(
      (a, b) => b.rating - a.rating || b.numberOfReviews - a.numberOfReviews
    );

    return results;
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
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockListings.find((listing) => listing.id === id) || null;
  },

  // Obter estatísticas por bairro
  getNeighborhoodStats: async (): Promise<NeighborhoodStats[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const statsByNeighborhood = new Map<
      string,
      {
        totalPrice: number;
        totalRating: number;
        count: number;
        ratedCount: number;
      }
    >();

    mockListings.forEach((listing) => {
      const neighborhood = listing.property.neighborhood;
      const current = statsByNeighborhood.get(neighborhood) || {
        totalPrice: 0,
        totalRating: 0,
        count: 0,
        ratedCount: 0,
      };

      current.totalPrice += listing.price;
      current.count += 1;

      if (listing.rating > 0) {
        current.totalRating += listing.rating;
        current.ratedCount += 1;
      }

      statsByNeighborhood.set(neighborhood, current);
    });

    return Array.from(statsByNeighborhood.entries())
      .map(([neighborhood, stats]) => ({
        neighborhood,
        averagePrice: Math.round(stats.totalPrice / stats.count),
        averageRating:
          stats.ratedCount > 0
            ? Number((stats.totalRating / stats.ratedCount).toFixed(2))
            : 0,
        totalListings: stats.count,
      }))
      .sort((a, b) => b.totalListings - a.totalListings);
  },

  // Obter dados para heatmap de densidade
  getDensityHeatmap: async (): Promise<HeatmapPoint[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockListings.map((listing) => ({
      lat: listing.property.latitude,
      lng: listing.property.longitude,
      intensity: 1, // Cada ponto tem peso 1 para densidade
    }));
  },

  // Obter dados para heatmap de preço
  getPriceHeatmap: async (): Promise<HeatmapPoint[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const maxPrice = Math.max(...mockListings.map((l) => l.price));
    return mockListings.map((listing) => ({
      lat: listing.property.latitude,
      lng: listing.property.longitude,
      intensity: listing.price / maxPrice, // Normalizar preço entre 0 e 1
    }));
  },

  // CONSULTA 7: Verificar disponibilidade de propriedade
  getPropertyAvailability: async (
    _propertyId: string,
    startDate?: string,
    endDate?: string
  ): Promise<string[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    // TODO: Quando o backend estiver ativo, substituir por:
    // const queryParams = new URLSearchParams();
    // if (startDate) queryParams.append('start_date', startDate);
    // if (endDate) queryParams.append('end_date', endDate);
    // const response = await fetch(`http://localhost:8000/properties/${propertyId}/availability?${queryParams}`);
    // return await response.json();

    // Mock: gerar datas disponíveis aleatoriamente para 2025
    const availableDates: string[] = [];
    const year = 2025;

    // Se não houver range especificado, retornar o ano inteiro
    const start = startDate ? new Date(startDate) : new Date(2025, 0, 1);
    const end = endDate ? new Date(endDate) : new Date(2025, 11, 31);

    // Gerar disponibilidade aleatória (aproximadamente 60% dos dias disponíveis)
    for (
      let date = new Date(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      if (date.getFullYear() === year && Math.random() > 0.4) {
        // 60% de chance de estar disponível
        const dateStr = date.toISOString().split("T")[0];
        availableDates.push(dateStr);
      }
    }

    return availableDates;
  },

  // CONSULTA 8: Obter avaliações de uma propriedade (paginado)
  getPropertyReviews: async (
    propertyId: string,
    offset: number = 0,
    minYear?: number
  ): Promise<Review[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    // TODO: Quando o backend estiver ativo, substituir por:
    // const queryParams = new URLSearchParams();
    // queryParams.append('offset', offset.toString());
    // if (minYear) queryParams.append('min_year', minYear.toString());
    // const response = await fetch(`http://localhost:8000/properties/${propertyId}/reviews?${queryParams}`);
    // return await response.json();

    // Mock: gerar reviews aleatórias
    const userNames = [
      "Ana Silva",
      "Carlos Santos",
      "Maria Oliveira",
      "João Pedro",
      "Juliana Costa",
      "Rafael Lima",
      "Beatriz Almeida",
      "Lucas Ferreira",
      "Camila Rodrigues",
      "Fernando Souza",
      "Patricia Nascimento",
      "Gustavo Carvalho",
      "Mariana Gomes",
      "Ricardo Araujo",
      "Isabela Martins",
    ];

    const comments = [
      "Lugar maravilhoso! A localização é perfeita e o apartamento é exatamente como nas fotos. O anfitrião foi muito atencioso.",
      "Experiência incrível! A vista é de tirar o fôlego e a acomodação tem tudo que você precisa. Recomendo muito!",
      "Ótima estadia! O local é limpo, confortável e bem localizado. Voltarei com certeza.",
      "Adorei a experiência. O apartamento é lindo e o bairro é muito agradável. Perfeito para quem quer conhecer a cidade.",
      "Superou as expectativas! Tudo impecável, desde a limpeza até os detalhes da decoração. Parabéns ao anfitrião!",
      "Lugar aconchegante e bem equipado. A comunicação com o anfitrião foi excelente. Recomendo!",
      "Excelente custo-benefício. O apartamento é confortável e fica perto de tudo. Adoramos!",
      "Muito bom! O espaço é amplo e bem iluminado. Perfeito para uma estadia relaxante.",
      "Adoramos tudo! A acomodação é linda e o anfitrião deixou dicas ótimas sobre a região.",
      "Lugar incrível! Ficamos muito satisfeitos com a limpeza e o conforto. Voltaremos em breve.",
      "Experiência maravilhosa! O apartamento tem uma localização privilegiada e é muito acolhedor.",
      "Tudo perfeito! Desde o check-in até o check-out, tudo transcorreu sem problemas.",
      "Recomendo fortemente! O lugar é lindo, bem decorado e tem tudo que você precisa.",
      "Estadia incrível! O anfitrião foi super prestativo e a acomodação é de primeira.",
      "Lugar encantador! A vista é espetacular e o apartamento é muito confortável.",
    ];

    // Gerar 10 reviews mockadas a partir do offset
    const reviews: Review[] = [];
    const totalReviews = 45; // Total mockado de reviews

    for (let i = 0; i < 10 && offset + i < totalReviews; i++) {
      const reviewIndex = offset + i;
      const daysAgo = reviewIndex * 7; // Uma review a cada 7 dias
      const reviewDate = new Date();
      reviewDate.setDate(reviewDate.getDate() - daysAgo);

      // Filtrar por ano se especificado
      if (minYear && reviewDate.getFullYear() < minYear) {
        continue;
      }

      reviews.push({
        id: `review-${propertyId}-${reviewIndex}`,
        propertyId,
        userId: `user-${(reviewIndex % 15) + 1}`,
        userName: userNames[reviewIndex % userNames.length],
        comment: comments[reviewIndex % comments.length],
        date: reviewDate.toISOString(),
      });
    }

    return reviews;
  },

  // CONSULTA 10: Obter perfil do anfitrião e suas propriedades (paginado)
  getHostProfile: async (hostId: string): Promise<HostProfile> => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    // TODO: Quando o backend estiver ativo, substituir por:
    // const response = await fetch(`http://localhost:8000/hosts/${hostId}/profile`);
    // return await response.json();

    // Mock: encontrar host e calcular estatísticas
    const hostListings = mockListings.filter((l) => l.hostId === hostId);
    const host = hostListings[0]?.host;

    if (!host) {
      throw new Error("Host not found");
    }

    const totalProperties = hostListings.length;
    const totalReviews = hostListings.reduce(
      (sum, l) => sum + l.numberOfReviews,
      0
    );

    // Calcular média ponderada: (nota × qtd_reviews) / total_reviews
    const weightedSum = hostListings.reduce(
      (sum, l) => sum + l.rating * l.numberOfReviews,
      0
    );
    const averageRating = totalReviews > 0 ? weightedSum / totalReviews : 0;

    return {
      ...host,
      description:
        "Anfitrião experiente com anos hospedando viajantes de todo o mundo. Adora compartilhar dicas locais e garantir que seus hóspedes tenham a melhor experiência possível no Rio de Janeiro.",
      location: "Rio de Janeiro, Brasil",
      url: `https://airbnb.com/users/show/${hostId}`,
      totalProperties,
      averageRating: Number(averageRating.toFixed(2)),
      totalReviews,
    };
  },

  getHostProperties: async (
    hostId: string,
    offset: number = 0
  ): Promise<Listing[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    // TODO: Quando o backend estiver ativo, substituir por:
    // const queryParams = new URLSearchParams();
    // queryParams.append('offset', offset.toString());
    // const response = await fetch(`http://localhost:8000/hosts/${hostId}/properties?${queryParams}`);
    // return await response.json();

    // Mock: filtrar propriedades do host e paginar
    const hostListings = mockListings
      .filter((l) => l.hostId === hostId)
      .sort(
        (a, b) => b.rating - a.rating || b.numberOfReviews - a.numberOfReviews
      );

    return hostListings.slice(offset, offset + 5);
  },
};

export default api;
