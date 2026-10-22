import * as Location from "expo-location";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Coordinates = { latitude: number; longitude: number };

// loading : en attente de la réponse de l'utilisateur ou du GPS
// granted : position disponible
// denied : l'utilisateur a refusé
// unavailable : autorisé mais position introuvable (GPS coupé…)
export type LocationStatus = "loading" | "granted" | "denied" | "unavailable";

type LocationContextValue = {
  position: Coordinates | null;
  status: LocationStatus;
  requestPosition: () => Promise<Coordinates | null>;
};

const LocationContext = createContext<LocationContextValue | null>(null);

type PositionResult = { status: LocationStatus; position: Coordinates | null };

// 1. Demande l'autorisation  2. Récupère la position GPS.
// Ne touche pas au state : renvoie juste le résultat
async function fetchPosition(): Promise<PositionResult> {
  try {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== "granted") {
      return { status: "denied", position: null };
    }
    const current = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return {
      status: "granted",
      position: {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      },
    };
  } catch {
    return { status: "unavailable", position: null };
  }
}

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

  // Range le résultat dans le state (partagé avec tous les écrans)
  const save = (result: PositionResult) => {
    setStatus(result.status);
    if (result.position) setPosition(result.position);
    return result.position;
  };

  // Au démarrage (une fois connecté)
  useEffect(() => {
    if (enabled) fetchPosition().then(save);
  }, [enabled]);

  // Bouton « Utiliser ma position » : redemande, renvoie la position ou null
  const requestPosition = () => fetchPosition().then(save);

  return (
    <LocationContext.Provider value={{ position, status, requestPosition }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx)
    throw new Error("useLocation doit être utilisé dans un <LocationProvider>");
  return ctx;
}
