export interface EventItem {
  id: string;
  name: string;
  description: string;
  startsAt: string; // ex : "2026-10-30T09:00:00"
  location: string;
  category: EventCategory;
  participantIds: string[];
}

export type EventCategory = "conference" | "workshop" | "outing";
