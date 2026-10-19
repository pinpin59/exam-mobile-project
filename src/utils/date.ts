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
