import type { Dealer } from "./types";

export const dealers: Dealer[] = [
  {
    id: "nexus-premium",
    slug: "nexus-premium",
    name: "Nexus Premium Autos",
    city: "Cotonou",
    phone: "+229 62 45 90 12",
    whatsapp: "+22962459012",
    email: "hello@nexuspremium.bj",
    headline: "Sélection prestige avec financement express",
    rating: 4.8,
    ratingCount: 86,
    logo: "/brand/anx-logo.png",
    specialties: ["SUV premium", "Import USA", "Financement"],
    address: "Boulevard de la Marina, Cotonou",
    description:
      "Showroom phare Auto Nexus BJ : véhicules certifiés avec histoire transparente, pack photo complet et garanties partenaires.",
    website: "https://autonexus.bj/nexus-premium",
    social: {
      instagram: "https://instagram.com/nexuspremiumautos",
      facebook: "https://facebook.com/nexuspremiumautos",
    },
    foundedYear: 2018,
    staffCount: 24,
    inventorySize: 48,
    heroImage:
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "cfaomotors",
    slug: "cfaomotors",
    name: "CFAO Motors Bénin",
    city: "Cotonou",
    phone: "+229 21 31 45 00",
    whatsapp: "+22921314500",
    email: "contact@cfaomotors.bj",
    headline: "Concession officielle multi-marques avec service atelier certifié",
    rating: 4.6,
    ratingCount: 134,
    specialties: ["Neufs", "Atelier certifié", "Fleet"],
    address: "PK3 Route de Porto-Novo, Cotonou",
    description:
      "Importateur officiel. Gamme Toyota, Suzuki, Daihatsu, services après-vente premium et solutions corporate.",
    website: "https://www.cfaogroup.com",
    foundedYear: 2005,
    staffCount: 120,
    inventorySize: 72,
    heroImage:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1472586662442-3eec04b9dbda?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "get-motors",
    slug: "get-motors",
    name: "GET Motors",
    city: "Porto-Novo",
    phone: "+229 64 80 32 10",
    whatsapp: "+22964803210",
    headline: "Occasions récentes, focus pick-up & utilitaires",
    rating: 4.4,
    ratingCount: 52,
    specialties: ["Pick-up", "Utilitaires", "Garanties 6 mois"],
    description:
      "Sélection d'utilitaires import UE et Asie, révisés et livrés avec carnet d'entretien digital.",
    foundedYear: 2014,
    staffCount: 18,
    inventorySize: 36,
    heroImage:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "mig-motors",
    slug: "mig-motors",
    name: "MIG Motors",
    city: "Parakou",
    phone: "+229 95 20 11 45",
    whatsapp: "+22995201145",
    headline: "SUV & berlines familiales prêtes à partir",
    rating: 4.7,
    ratingCount: 64,
    specialties: ["SUV urbains", "Berlines", "Location avec option d'achat"],
    description:
      "Spécialiste véhicules familiaux, livraison dans tout le Bénin et pack photo 360° disponible.",
    foundedYear: 2010,
    staffCount: 30,
    inventorySize: 40,
    heroImage:
      "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80",
    ],
  },
];

export function getDealers(): Dealer[] {
  return dealers;
}
