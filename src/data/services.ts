import type { ServicePillar } from "./types";

export const services: ServicePillar[] = [
  {
    id: "neufs",
    title: "Véhicules neufs",
    subtitle: "Partenaires uniques par marque",
    description:
      "Commandes officielles, garanties constructeurs, suivi atelier et financement groupé.",
    partners: ["CFAO", "GET Motors", "MIG Motors", "Japan Motors", "Sonam Honda"],
    icon: "car",
  },
  {
    id: "entretien",
    title: "Entretien & garages",
    subtitle: "Réseau atelier certifié",
    description:
      "Inspection 110 points, packs entretien, carrosserie multi-marques avec pièces OEM.",
    partners: ["Auto SP", "Challenge SA", "Kwabo"],
    icon: "tools",
  },
  {
    id: "pieces",
    title: "Pièces détachées",
    subtitle: "Disponibilité express",
    description:
      "Catalogue multi-marques, livraison 24h Cotonou/Porto-Novo, sourcing OEM ou reconditionné.",
    partners: ["La Roche"],
    icon: "warehouse",
  },
  {
    id: "lubrifiants",
    title: "Lubrifiants & consommables",
    subtitle: "Performance & garantie",
    description:
      "Sélection huiles & fluides homologués, kits vidange, additifs, pack atelier.",
    partners: ["Motul"],
    icon: "droplet",
  },
  {
    id: "financement",
    title: "Financement & assurance",
    subtitle: "Solutions flexibles",
    description:
      "Crédit auto, LOA, assurance tout risque, extension garantie pièces main d'œuvre.",
    partners: ["Atlantique Banque", "Assurance AFG"],
    icon: "shield-check",
  },
  {
    id: "location",
    title: "Location & mobilité",
    subtitle: "Short/mid term",
    description:
      "Location event, business ou de transition, flotte chauffeur, options rachat.",
    partners: ["LBM"],
    icon: "steering-wheel",
  },
  {
    id: "logistique",
    title: "Livraison & logistique",
    subtitle: "Dernier kilomètre",
    description:
      "Convoyage sécurisé, inspection à la livraison, option full detailing pré-remise.",
    partners: ["Nexus"],
    icon: "truck",
  },
];
