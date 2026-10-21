import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import * as eventsService from "@/services/events";
import type { EventInput, EventItem } from "@/types";

import { useAuth } from "./AuthContext";

type EventsContextValue = {
  events: EventItem[];
  isLoading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  join: (eventId: string) => Promise<void>;
  leave: (eventId: string) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  createEvent: (data: EventInput) => Promise<void>;
  updateEvent: (eventId: string, data: EventInput) => Promise<void>;
};

const EventsContext = createContext<EventsContextValue | null>(null);

export function EventsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    eventsService
      .getEvents()
      .then(setEvents)
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setEvents(await eventsService.getEvents());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Remplace un seul événement dans la liste (pas de modification directe)
  const replaceEvent = (updated: EventItem) => {
    setEvents((list) => list.map((e) => (e.id === updated.id ? updated : e)));
  };

  const join = async (eventId: string) => {
    if (!user) throw new Error("You must be logged in");
    replaceEvent(await eventsService.joinEvent(eventId, user.id));
  };

  const leave = async (eventId: string) => {
    if (!user) throw new Error("You must be logged in");
    replaceEvent(await eventsService.leaveEvent(eventId, user.id));
  };

  const deleteEvent = async (eventId: string) => {
    if (!user) throw new Error("You must be logged in");
    await eventsService.deleteEvent(eventId);
    setEvents((list) => list.filter((e) => e.id !== eventId));
  };

  const createEvent = async (data: EventInput) => {
    if (!user) throw new Error("You must be logged in");
    const created = await eventsService.createEvent(data, user.id);
    setEvents((list) => [...list, created]);
  };

  const updateEvent = async (eventId: string, data: EventInput) => {
    if (!user) throw new Error("You must be logged in");
    replaceEvent(await eventsService.updateEvent(eventId, data));
  };

  return (
    <EventsContext.Provider
      value={{
        events,
        isLoading,
        error,
        fetchEvents,
        join,
        leave,
        deleteEvent,
        createEvent,
        updateEvent,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx)
    throw new Error("useEvents doit être utilisé dans un <EventsProvider>");
  return ctx;
}
