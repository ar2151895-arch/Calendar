import { PanchangInfo } from '../types';

export const TITHI_NAMES = [
  'Pratipada (1)', 'Dwitiya (2)', 'Tritiya (3)', 'Chaturthi (4)',
  'Panchami (5)', 'Shashti (6)', 'Saptami (7)', 'Ashtami (8)',
  'Navami (9)', 'Dashami (10)', 'Ekadashi (11)', 'Dwadashi (12)',
  'Trayodashi (13)', 'Chaturdashi (14)', 'Purnima (15) / Amavasya (30)'
];

export const HINDU_MONTHS = [
  'Chaitra (चैत्र)',
  'Vaisakha (वैशाख)',
  'Jyeshtha (ज्येष्ठ)',
  'Ashadha (आषाढ़)',
  'Shravana (श्रावण)',
  'Bhadrapada (भाद्रपद)',
  'Ashvina (आश्विन)',
  'Kartika (कार्तिक)',
  'Margashirsha (मार्गशीर्ष)',
  'Pausha (पौष)',
  'Magha (माघ)',
  'Phalguna (फाल्गुन)'
];

export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

/**
 * Calculates approximate daily Panchang with English Time and Tithi information
 */
export function getPanchangForDate(date: Date): PanchangInfo {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();

  // Known new moon reference: Jan 11, 2024 at 11:57 UTC
  const refNewMoon = new Date(Date.UTC(2024, 0, 11, 11, 57)).getTime();
  const synodicMonth = 29.53058867 * 24 * 60 * 60 * 1000; // milliseconds in a lunar month
  
  const currentUtc = Date.UTC(y, m, d, 6, 0); // approx sunrise
  const diff = currentUtc - refNewMoon;
  
  // Phase from 0 to 1
  let phase = (diff % synodicMonth) / synodicMonth;
  if (phase < 0) phase += 1;

  // 30 tithis in a lunar month (15 shukla, 15 krishna)
  const tithiIndex = Math.floor(phase * 30);
  const isShukla = tithiIndex < 15;
  const paksha: 'शुक्ल पक्ष' | 'कृष्ण पक्ष' = isShukla ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष';
  
  let tithiName: string;
  if (isShukla) {
    if (tithiIndex === 14) {
      tithiName = 'Purnima (पूर्णिमा)';
    } else {
      tithiName = `${TITHI_NAMES[tithiIndex] || 'Pratipada'} Shukla`;
    }
  } else {
    const kIndex = tithiIndex - 15;
    if (kIndex === 14) {
      tithiName = 'Amavasya (अमावस्या)';
    } else {
      tithiName = `${TITHI_NAMES[kIndex] || 'Pratipada'} Krishna`;
    }
  }

  // Vikram Samvat is approximately +57 years (or +56 before Chaitra)
  const isPostChaitra = m >= 3;
  const vikramSamvat = y + (isPostChaitra ? 57 : 56);
  const sakaSamvat = y - (isPostChaitra ? 78 : 79);

  // Hindu month mapped approximately with solar calendar
  const hinduMonthIndex = (m + 9) % 12;
  const hinduMonth = HINDU_MONTHS[hinduMonthIndex];

  // Sunrise/sunset approximate calculation in English 12-hour format
  const dayOfYear = Math.floor((date.getTime() - new Date(y, 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const sunDeclination = 23.45 * Math.sin((Math.PI / 180) * (360 / 365) * (dayOfYear - 81));
  const sunriseHour = 6.2 - 0.5 * Math.sin((Math.PI / 180) * sunDeclination);
  const sunsetHour = 18.2 + 0.5 * Math.sin((Math.PI / 180) * sunDeclination);

  const formatEnglishTime = (hourDecimal: number) => {
    const h = Math.floor(hourDecimal);
    const min = Math.floor((hourDecimal - h) * 60);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${String(displayH).padStart(2, '0')}:${String(min).padStart(2, '0')} ${period}`;
  };

  const dayOfWeek = date.getDay(); // 0 is Sunday
  // Rahukaal slots written in English Time format
  const rahuKaalRanges = [
    '04:30 PM to 06:00 PM', // Sun
    '07:30 AM to 09:00 AM', // Mon
    '03:00 PM to 04:30 PM', // Tue
    '12:00 PM to 01:30 PM', // Wed
    '01:30 PM to 03:00 PM', // Thu
    '10:30 AM to 12:00 PM', // Fri
    '09:00 AM to 10:30 AM', // Sat
  ];

  return {
    date: date.toISOString().split('T')[0],
    tithi: tithiName,
    paksha,
    hinduMonth,
    vikramSamvat,
    sakaSamvat,
    sunrise: formatEnglishTime(sunriseHour),
    sunset: formatEnglishTime(sunsetHour),
    auspiciousTime: '11:45 AM to 12:35 PM (Abhijit Muhurat)',
    rahukaal: `${rahuKaalRanges[dayOfWeek]} (Rahu Kaal)`,
  };
}

export function getDaysRemainingText(targetDateStr: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [y, m, d] = targetDateStr.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today (आज)';
  if (diffDays === 1) return 'Tomorrow (कल)';
  if (diffDays === -1) return 'Yesterday (बीत चुका)';
  if (diffDays > 1) return `In ${diffDays} days (${diffDays} दिन बाकी)`;
  return `${Math.abs(diffDays)} days ago`;
}
