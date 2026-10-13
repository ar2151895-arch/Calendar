export type FestivalCategory = 
  | 'all' 
  | 'hindu' 
  | 'national' 
  | 'islamic' 
  | 'sikh_christian' 
  | 'vrat_ekadashi' 
  | 'personal';

export interface Festival {
  id: string;
  name: string; // e.g. 'दिवाली (दीपावली)'
  englishName: string; // e.g. 'Diwali (Deepavali)'
  date: string; // YYYY-MM-DD
  category: 'hindu' | 'national' | 'islamic' | 'sikh_christian' | 'vrat_ekadashi';
  color: string;
  badge: string; // e.g. 'प्रकाशोत्सव', 'रंगोत्सव', 'राष्ट्रीय पर्व'
  tithi: string; // e.g. 'कार्तिक कृष्ण अमावस्या'
  kyaHai: string; // क्या है - विस्तृत विवरण
  kyunManateHain: string; // क्यों मनाया जाता है - धार्मिक व पौराणिक महत्व
  kabHai: string; // कब है - सटीक तारीख, दिन व तिथि
  kabNahin: string; // कब नहीं है - सूतक काल, भद्रा या किस दिन व्रत न रखें
  shubhMuhurat: string; // शुभ मुहूर्त व पूजन समय
  vidhiAndDoDont: string; // पूजा विधि, क्या करें और क्या न करें
  isOfficialHoliday?: boolean;
  icon?: string;
}

export interface UserEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  category: 'function' | 'birthday' | 'anniversary' | 'puja' | 'meeting' | 'other';
  time?: string;
  location?: string;
  description?: string;
  color: string;
}

// Backwards-compatible Event interface for user-added calendar items
export interface Event {
  id: string;
  date: string;
  title: string;
  description?: string;
  color: string;
  category?: string;
  time?: string;
  location?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface PanchangInfo {
  date: string;
  tithi: string;
  paksha: 'शुक्ल पक्ष' | 'कृष्ण पक्ष';
  hinduMonth: string;
  vikramSamvat: number;
  sakaSamvat: number;
  sunrise: string;
  sunset: string;
  auspiciousTime: string;
  rahukaal: string;
}
