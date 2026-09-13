export type EmojiStampType = 
  | '⭐' | '🎂' | '☀️' | '🍖' | '🌰' | '🌱' | '❤️' | '🌹' | '☕️'
  | '🐇' | '🎩' | '🗝️' | '🫖' | '🍄' | '⏰' | '🃏';

export interface CalendarDayMark {
  date: string; // YYYY-MM-DD
  stamps: EmojiStampType[];
  notes?: string;
  reminderTime?: string;
}

export interface DayInfo {
  dateStr: string; // YYYY-MM-DD
  year: number;
  month: number; // 1-12
  day: number;
  dayOfWeek: number; // 0 (Sun) - 6 (Sat)
  isCurrentMonth: boolean;
  isToday: boolean;
  
  // Lunar info
  lunarMonthStr: string;
  lunarDayStr: string;
  lunarYearGanzhi: string;
  lunarAnimal: string;
  
  // Solar terms & Festivals
  solarTerm?: string;
  westernHoliday?: string;
  taiwanHoliday?: string;
  isNationalHoliday: boolean; // 國定假日
  isRestDay: boolean; // 休假日 (週末或國定假日/連假)
  holidayDescription?: string;
  commemorativeDay?: string; // 紀念日
  folkFestival?: string; // 民俗節日
}

export interface CalendarSettings {
  showLunar: boolean;
  showSolarTerms: boolean;
  showCommemorative: boolean;
}
