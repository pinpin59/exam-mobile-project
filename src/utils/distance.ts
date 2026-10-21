type Coordinates = { latitude: number; longitude: number };

const EARTH_RADIUS_KM = 6371;
const toRadians = (deg: number) => (deg * Math.PI) / 180;

// Distance « à vol d'oiseau » entre deux points GPS, en km (formule de Haversine)
// distanceKm({ latitude: 50.63, longitude: 3.06 }, event) → 2.4
export function distanceKm(from: Coordinates, to: Coordinates) {
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) * Math.cos(toRadians(to.latitude)) * Math.sin(dLon / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}
