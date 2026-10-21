import { mockEvents } from "@/mocks";
import type { EventItem } from "@/types";

import { delay } from "./api";

// « Base de données » en mémoire, remise à zéro au redémarrage de l'app.
// Règle : on ne modifie jamais un événement, on le remplace par une nouvelle version.
const eventItems: EventItem[] = [...mockEvents];

// Les fonctions renvoient des copies ({ ...e }) pour que les écrans
// ne puissent pas modifier la base sans passer par le service.

export async function getEvents(): Promise<EventItem[]> {
  await delay();
  return eventItems.map((e) => ({ ...e }));
}

// Événements pas encore passés, du plus proche au plus lointain
export async function getUpcomingEvents(): Promise<EventItem[]> {
  await delay();
  return eventItems
    .filter((e) => new Date(e.startsAt) > new Date())
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .map((e) => ({ ...e }));
}

export async function getEvent(id: string): Promise<EventItem> {
  await delay();
  const event = eventItems.find((e) => e.id === id);
  if (!event) throw new Error("Event does not exist");

  return { ...event };
}

// Événements auxquels l'utilisateur participe (liste vide si aucun)
export async function getUserEvents(userId: string): Promise<EventItem[]> {
  await delay();
  return eventItems
    .filter((e) => e.participantIds.includes(userId))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .map((e) => ({ ...e }));
}

export async function joinEvent(
  eventId: string,
  userId: string,
): Promise<EventItem> {
  await delay();

  const index = eventItems.findIndex((e) => e.id === eventId);
  if (index === -1) throw new Error("Event does not exist");

  const event = eventItems[index];
  if (event.participantIds.includes(userId)) {
    throw new Error("User already joined the event");
  }

  // Nouveau tableau avec le participant en plus (pas de push)
  const updated = {
    ...event,
    participantIds: [...event.participantIds, userId],
  };
  eventItems[index] = updated;

  return { ...updated };
}

export async function leaveEvent(
  eventId: string,
  userId: string,
): Promise<EventItem> {
  await delay();

  const index = eventItems.findIndex((e) => e.id === eventId);
  if (index === -1) throw new Error("Event does not exist");

  const event = eventItems[index];
  if (!event.participantIds.includes(userId)) {
    throw new Error("User is not in the event");
  }

  // Nouveau tableau sans le participant
  const updated = {
    ...event,
    participantIds: event.participantIds.filter((id) => id !== userId),
  };
  eventItems[index] = updated;

  return { ...updated };
}

export async function deleteEvent(eventId: string): Promise<void> {
  await delay();

  const index = eventItems.findIndex((e) => e.id === eventId);
  if (index === -1) throw new Error("Event does not exist");

  eventItems.splice(index, 1);
}
