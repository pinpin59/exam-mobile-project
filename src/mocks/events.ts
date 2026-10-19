import type { EventItem } from "@/types";

// Dates sans "Z" : interprétées en heure locale (9:00 reste 9:00)
// Les deux premiers événements sont passés, pour tester l'affichage « terminé »
export const mockEvents: EventItem[] = [
  {
    id: "e1",
    name: "Conférence Green IT",
    description:
      "Comment réduire l'empreinte carbone de nos applications : mesures, bonnes pratiques et retours d'expérience.",
    startsAt: "2026-10-02T18:30:00",
    location: "Lille — EuraTechnologies",
    category: "conference",
    participantIds: ["u1", "u2", "u3"],
  },
  {
    id: "e2",
    name: "Atelier Git & GitHub",
    description:
      "Branches, pull requests et résolution de conflits : un atelier pratique pour bien travailler en équipe.",
    startsAt: "2026-10-14T14:00:00",
    location: "Lille — Campus Saint-Sauveur",
    category: "workshop",
    participantIds: ["u2", "u4"],
  },
  {
    id: "e3",
    name: "Meetup React Native",
    description:
      "Trois talks sur Expo, la navigation et les performances, suivis d'un apéro pour échanger entre développeurs.",
    startsAt: "2026-10-30T09:00:00",
    location: "Lille — Le Tripostal",
    category: "conference",
    participantIds: ["u1", "u3"],
  },
  {
    id: "e4",
    name: "Atelier Figma pour développeurs",
    description:
      "Lire une maquette, exporter des assets et comprendre un design system sans être designer.",
    startsAt: "2026-11-05T10:00:00",
    location: "Roubaix — La Plaine Images",
    category: "workshop",
    participantIds: ["u4"],
  },
  {
    id: "e5",
    name: "Randonnée en baie de Somme",
    description:
      "Journée de marche guidée de 12 km au bord de la baie, avec observation des phoques. Prévoir des chaussures adaptées.",
    startsAt: "2026-11-14T08:30:00",
    location: "Le Crotoy",
    category: "outing",
    participantIds: ["u2", "u3", "u4"],
  },
  {
    id: "e6",
    name: "Conférence IA & accessibilité",
    description:
      "Ce que l'IA change pour rendre les applications accessibles à tous, avec démonstrations en direct.",
    startsAt: "2026-11-21T19:00:00",
    location: "Lille — Grand Palais",
    category: "conference",
    participantIds: [],
  },
  {
    id: "e7",
    name: "Atelier tests avec Jest",
    description:
      "Écrire ses premiers tests unitaires et tests de composants React Native, du setup à l'intégration continue.",
    startsAt: "2026-12-03T13:30:00",
    location: "Villeneuve-d'Ascq — Université de Lille",
    category: "workshop",
    participantIds: ["u1"],
  },
  {
    id: "e8",
    name: "Marché de Noël entre collègues",
    description:
      "Balade dans le marché de Noël de Lille et dégustation de vin chaud. Rendez-vous devant la grande roue.",
    startsAt: "2026-12-12T17:00:00",
    location: "Lille — Place Rihour",
    category: "outing",
    participantIds: ["u1", "u2", "u3", "u4"],
  },
];
