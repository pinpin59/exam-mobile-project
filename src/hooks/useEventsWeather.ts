import { useEffect, useState } from "react";

import { useEvents } from "@/contexts/EventsContext";
import { getEventWeather, type Weather } from "@/services/weather";

/**
 * Météo de chaque événement, rangée par id : { e3: { icon, temp }, e4: … }
 * Un événement sans prévision (trop loin, pas de réseau) n'apparaît pas.
 * Usage : const weatherById = useEventsWeather();
 *         <EventCard weather={weatherById[event.id]} … />
 */
export function useEventsWeather() {
  const { events } = useEvents();
  const [weatherById, setWeatherById] = useState<Record<string, Weather>>({});

  useEffect(() => {
    let cancelled = false;

    // Toutes les requêtes en parallèle (le service évite les doublons par lieu)
    Promise.all(
      events.map(async (e) => [e.id, await getEventWeather(e)] as const),
    ).then((results) => {
      if (cancelled) return;
      const map: Record<string, Weather> = {};
      for (const [id, weather] of results) {
        if (weather) map[id] = weather;
      }
      setWeatherById(map);
    });

    return () => {
      cancelled = true;
    };
  }, [events]);

  return weatherById;
}
