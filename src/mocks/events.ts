import type { EventItem } from "@/types";

// Dates sans "Z" : interprétées en heure locale (9:00 reste 9:00)
// Les deux premiers événements sont passés, pour tester l'affichage « terminé »
export const mockEvents: EventItem[] = [
  {
    id: "e1",
    createdBy: "u2",
    name: "Conférence Green IT",
    description:
      "Comment réduire l'empreinte carbone de nos applications : mesures, bonnes pratiques et retours d'expérience.",
    startsAt: "2026-10-02T18:30:00",
    location: "Lille — EuraTechnologies",
    latitude: 50.6326,
    longitude: 3.0207,
    category: "conference",
    participantIds: ["u1", "u2", "u3"],
  },
  {
    id: "e2",
    createdBy: "u4",
    name: "Atelier Git & GitHub",
    description:
      "Branches, pull requests et résolution de conflits : un atelier pratique pour bien travailler en équipe.",
    startsAt: "2026-10-14T14:00:00",
    location: "Lille — Campus Saint-Sauveur",
    latitude: 50.6295,
    longitude: 3.0718,
    category: "workshop",
    participantIds: ["u2", "u4"],
  },
  {
    id: "e3",
    createdBy: "u1",
    name: "Meetup React Native",
    description:
      "Trois talks sur Expo, la navigation et les performances, suivis d'un apéro pour échanger entre développeurs.",
    startsAt: "2026-10-30T09:00:00",
    location: "Lille — Le Tripostal",
    latitude: 50.6346,
    longitude: 3.07,
    category: "conference",
    participantIds: ["u1", "u3"],
  },
  {
    id: "e4",
    createdBy: "u4",
    name: "Atelier Figma pour développeurs",
    description:
      "Lire une maquette, exporter des assets et comprendre un design system sans être designer.",
    startsAt: "2026-11-05T10:00:00",
    location: "Roubaix — La Plaine Images",
    latitude: 50.7004,
    longitude: 3.1589,
    category: "workshop",
    participantIds: ["u4"],
  },
  {
    id: "e5",
    createdBy: "u2",
    name: "Randonnée en baie de Somme",
    description:
      "Journée de marche guidée de 12 km au bord de la baie, avec observation des phoques. Prévoir des chaussures adaptées.",
    startsAt: "2026-11-14T08:30:00",
    location: "Le Crotoy",
    latitude: 50.2155,
    longitude: 1.625,
    category: "outing",
    participantIds: ["u2", "u3", "u4"],
  },
  {
    id: "e6",
    createdBy: "u1",
    name: "Conférence IA & accessibilité",
    description:
      "Ce que l'IA change pour rendre les applications accessibles à tous, avec démonstrations en direct.",
    startsAt: "2026-11-21T19:00:00",
    location: "Lille — Grand Palais",
    latitude: 50.6304,
    longitude: 3.0767,
    category: "conference",
    participantIds: [],
  },
  {
    id: "e7",
    createdBy: "u1",
    name: "Atelier tests avec Jest",
    description:
      "Écrire ses premiers tests unitaires et tests de composants React Native, du setup à l'intégration continue.",
    startsAt: "2026-12-03T13:30:00",
    location: "Villeneuve-d'Ascq — Université de Lille",
    latitude: 50.609,
    longitude: 3.142,
    category: "workshop",
    participantIds: ["u1"],
  },
  {
    id: "e8",
    createdBy: "u3",
    name: "Marché de Noël entre collègues",
    description:
      "Balade dans le marché de Noël de Lille et dégustation de vin chaud. Rendez-vous devant la grande roue.",
    startsAt: "2026-12-12T17:00:00",
    location: "Lille — Place Rihour",
    latitude: 50.6365,
    longitude: 3.0626,
    category: "outing",
    participantIds: ["u1", "u2", "u3", "u4"],
  },
];
