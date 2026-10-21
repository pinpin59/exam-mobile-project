export interface EventItem {
  id: string;
  name: string;
  description: string;
  startsAt: string; // ex : "2026-10-30T09:00:00"
  category: EventCategory;
  participantIds: string[];
  createdBy: string; // id de l'utilisateur qui a créé l'événement
  location: string;
  latitude: number;
  longitude: number;
}

export type EventCategory = "conference" | "workshop" | "outing";

// Ce que l'utilisateur remplit dans le formulaire (id, participants et créateur sont gérés par le service)
export type EventInput = Omit<EventItem, "id" | "participantIds" | "createdBy">;
