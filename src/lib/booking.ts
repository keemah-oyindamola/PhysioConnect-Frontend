export const CLINIC_TZ = "Africa/Lagos";
// Lagos is UTC+1 all year (no daylight saving), so a fixed offset is safe.
const CLINIC_OFFSET = "+01:00";

// One-hour sessions starting 9:00 to 16:00, Monday to Friday.
export const SLOT_HOURS = [9, 10, 11, 12, 13, 14, 15, 16];
export const MAX_DAYS_AHEAD = 60;

export function isValidDateString(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const d = new Date(`${date}T12:00:00${CLINIC_OFFSET}`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === date;
}

export function slotDateTime(date: string, hour: number): Date {
  return new Date(`${date}T${String(hour).padStart(2, "0")}:00:00${CLINIC_OFFSET}`);
}

export function isWeekday(date: string): boolean {
  const day = new Date(`${date}T12:00:00${CLINIC_OFFSET}`).getUTCDay();
  return day >= 1 && day <= 5;
}

export function todayInClinic(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: CLINIC_TZ }).format(new Date());
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00${CLINIC_OFFSET}`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function dateProblem(date: string): string | null {
  if (!isValidDateString(date)) return "Please choose a valid date.";
  if (!isWeekday(date)) return "The clinic is closed at weekends.";
  const today = todayInClinic();
  if (date < today) return "That date has already passed.";
  if (date > addDays(today, MAX_DAYS_AHEAD)) {
    return `Appointments can be booked up to ${MAX_DAYS_AHEAD} days ahead.`;
  }
  return null;
}

export function makeSlotKey(therapistId: string, when: Date): string {
  return `${therapistId}|${when.toISOString()}`;
}

export function formatHour(hour: number): string {
  const suffix = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h}:00 ${suffix}`;
}

export function formatDateTime(when: Date): string {
  return when.toLocaleString("en-GB", {
    timeZone: CLINIC_TZ,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}