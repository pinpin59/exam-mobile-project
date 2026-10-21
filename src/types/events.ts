export interface EventItem {
  id: string;
  name: string;
  description: string;
  startsAt: string; // ex : "2026-10-30T09:00:00"
  category: EventCategory;
  participantIds: string[];
  location: string;
  latitude: number;
  longitude: number;
}

export type EventCategory = "conference" | "workshop" | "outing";
