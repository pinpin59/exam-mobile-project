import * as Location from "expo-location";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Coordinates = { latitude: number; longitude: number };

// loading : en attente de la réponse de l'utilisateur ou du GPS
// granted : position disponible
// denied : l'utilisateur a refusé
// unavailable : autorisé mais position introuvable (GPS coupé…)
export type LocationStatus = "loading" | "granted" | "denied" | "unavailable";

type LocationContextValue = {
  position: Coordinates | null;
  status: LocationStatus;
};

const LocationContext = createContext<LocationContextValue | null>(null);

// Demande la position UNE fois, puis la partage avec tous les écrans.
// enabled = false : on attend (ex : pas encore connecté) avant de demander l'autorisation
export function LocationProvider({
  children,
  enabled = true,
}: {
  children: ReactNode;
  enabled?: boolean;
}) {
  const [position, setPosition] = useState<Coordinates | null>(null);
  const [status, setStatus] = useState<LocationStatus>("loading");

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false; // évite de modifier le state si l'écran a disparu entre-temps

    const load = async () => {
      try {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (cancelled) return;
        if (permission.status !== "granted") {
          setStatus("denied");
          return;
        }

        // 1. Dernière position connue : instantanée, pour afficher vite les distances
        const last = await Location.getLastKnownPositionAsync({ maxAge: 60_000 });
        if (cancelled) return;
        if (last) {
          setPosition({ latitude: last.coords.latitude, longitude: last.coords.longitude });
          setStatus("granted");
        }

        // 2. Position actuelle : plus lente mais précise, remplace la précédente
        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (cancelled) return;
        setPosition({ latitude: current.coords.latitude, longitude: current.coords.longitude });
        setStatus("granted");
      } catch {
        // GPS désactivé, simulateur sans position… : on continue sans distance
        if (!cancelled) setStatus("unavailable");
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return (
    <LocationContext.Provider value={{ position, status }}>{children}</LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation doit être utilisé dans un <LocationProvider>");
  return ctx;
}
