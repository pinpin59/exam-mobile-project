// src/utils/date.ts
const pad = (n: number) => String(n).padStart(2, "0");

// "2026-10-30T09:00:00" → "30/10/2026"
export function formatDate(iso: string) {
  const d = new Date(iso);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

// "2026-10-30T09:00:00" → "9:00"
export function formatTime(iso: string) {
  const d = new Date(iso);
  return `${d.getHours()}:${pad(d.getMinutes())}`;
}

// "2026-10-30T09:00:00" → "30"
export function dayNumber(iso: string) {
  return String(new Date(iso).getDate());
}

// Date → clé "2026-10-30" en heure locale (format attendu par le calendrier)
export function dateKey(date: string | Date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// "2026-10-30" → "Vendredi 30 octobre" (dans la langue demandée)
export function formatDayLong(iso: string, locale = "fr") {
  const label = new Date(iso).toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

// "2026-10-30T09:00:00" → "OCT" (dans la langue demandée : "fr" → "OCT", "en" → "OCT")
export function monthShort(iso: string, locale = "fr") {
  return new Date(iso)
    .toLocaleDateString(locale, { month: "short" })
    .replace(".", "") // "oct." → "oct"
    .toUpperCase();
}
