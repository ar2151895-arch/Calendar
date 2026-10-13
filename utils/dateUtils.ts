export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const MONTHS_HINDI = [
  "जनवरी (January)", "फरवरी (February)", "मार्च (March)", "अप्रैल (April)",
  "मई (May)", "जून (June)", "जुलाई (July)", "अगस्त (August)",
  "सितंबर (September)", "अक्टूबर (October)", "नवंबर (November)", "दिसंबर (December)"
];

export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const DAYS_HINDI = [
  { short: "रवि", full: "रविवार", en: "Sun" },
  { short: "सोम", full: "सोमवार", en: "Mon" },
  { short: "मंगल", full: "मंगलवार", en: "Tue" },
  { short: "बुध", full: "बुधवार", en: "Wed" },
  { short: "गुरु", full: "गुरुवार", en: "Thu" },
  { short: "शुक्र", full: "शुक्रवार", en: "Fri" },
  { short: "शनि", full: "शनिवार", en: "Sat" }
];

export const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (month: number, year: number): number => {
  return new Date(year, month, 1).getDay();
};

export const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const isToday = (day: number, month: number, year: number): boolean => {
  const today = new Date();
  return (
    today.getDate() === day &&
    today.getMonth() === month &&
    today.getFullYear() === year
  );
};

/**
 * Formats standard 24-hr time (e.g. "14:30") or string into English 12-hour time format with AM/PM
 * Example: "14:30" -> "02:30 PM", "09:05" -> "09:05 AM"
 */
export function formatToEnglish12HourTime(timeInput?: string): string {
  if (!timeInput) return '';
  const trimmed = timeInput.trim();
  if (!trimmed) return '';

  // Already contains AM or PM
  if (/(am|pm)/i.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  // Parse HH:mm
  const parts = trimmed.split(':');
  if (parts.length >= 2) {
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1].slice(0, 2).padStart(2, '0');
    if (isNaN(hours)) return trimmed;
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) hours = 12;
    return `${String(hours).padStart(2, '0')}:${minutes} ${period}`;
  }

  return trimmed;
}

export function getCurrentEnglishTime(): string {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

