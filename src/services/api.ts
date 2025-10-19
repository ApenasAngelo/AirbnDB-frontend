import type {
  Listing,
  Property,
  Host,
  NeighborhoodStats,
  HeatmapPoint,
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
  // Obter todos os listings
  getListings: async (): Promise<Listing[]> => {
    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockListings;
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
};

export default api;
