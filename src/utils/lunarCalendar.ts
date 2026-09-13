import { Solar, Lunar } from 'lunar-typescript';
import { DayInfo } from '../types/calendar';

// Taiwan 2026 Holiday Schedule (DGPA 行政院人事行政總處核定 115 年日曆表，放假 120 天)
const TAIWAN_HOLIDAYS_2026: Record<string, { name: string; isHoliday: boolean; isWorkDay?: boolean; badge?: string }> = {
  // 元旦 (1/1 放假)
  '2026-01-01': { name: '中華民國開國紀念日/元旦', isHoliday: true, badge: '國定假' },
  
  // 春節連休 9 天 (2/14 - 2/22)
  '2026-02-14': { name: '農曆春節假期(首日)', isHoliday: true, badge: '連假' },
  '2026-02-15': { name: '農曆春節假期(小年夜)', isHoliday: true, badge: '連假' },
  '2026-02-16': { name: '農曆除夕', isHoliday: true, badge: '國定假' },
  '2026-02-17': { name: '春節(大年初一)', isHoliday: true, badge: '國定假' },
  '2026-02-18': { name: '春節(大年初二)', isHoliday: true, badge: '國定假' },
  '2026-02-19': { name: '春節(大年初三)', isHoliday: true, badge: '國定假' },
  '2026-02-20': { name: '春節補假(大年初四)', isHoliday: true, badge: '連假' },
  '2026-02-21': { name: '春節(大年初五)', isHoliday: true, badge: '連假' },
  '2026-02-22': { name: '春節(大年初六收假)', isHoliday: true, badge: '連假' },

  // 和平紀念日連休 3 天 (2/27 - 3/1)
  '2026-02-27': { name: '和平紀念日連假(彈性放假)', isHoliday: true, badge: '連假' },
  '2026-02-28': { name: '和平紀念日(228)', isHoliday: true, badge: '國定假' },
  '2026-03-01': { name: '和平紀念日連假', isHoliday: true, badge: '連假' },

  // 兒童及清明節連休 4 天 (4/3 - 4/6)
  '2026-04-03': { name: '兒童節彈性補假', isHoliday: true, badge: '連假' },
  '2026-04-04': { name: '兒童節', isHoliday: true, badge: '國定假' },
  '2026-04-05': { name: '清明節', isHoliday: true, badge: '國定假' },
  '2026-04-06': { name: '清明節連假補假', isHoliday: true, badge: '連假' },

  // 勞動節連休 3 天 (5/1 - 5/3)
  '2026-05-01': { name: '勞動節', isHoliday: true, badge: '國定假' },
  '2026-05-02': { name: '勞動節連休', isHoliday: true, badge: '連假' },
  '2026-05-03': { name: '勞動節連休', isHoliday: true, badge: '連假' },

  // 端午節連休 3 天 (6/19 - 6/21)
  '2026-06-19': { name: '端午節', isHoliday: true, badge: '國定假' },
  '2026-06-20': { name: '端午節連休', isHoliday: true, badge: '連假' },
  '2026-06-21': { name: '端午節連休', isHoliday: true, badge: '連假' },

  // 中秋節及孔子誕辰紀念日／教師節連休 4 天 (9/25 - 9/28)
  '2026-09-25': { name: '中秋節', isHoliday: true, badge: '國定假' },
  '2026-09-26': { name: '中秋節連休', isHoliday: true, badge: '連假' },
  '2026-09-27': { name: '中秋節連休', isHoliday: true, badge: '連假' },
  '2026-09-28': { name: '孔子誕辰紀念日/教師節', isHoliday: true, badge: '國定假' },

  // 國慶日連休 3 天 (10/9 - 10/11)
  '2026-10-09': { name: '國慶日彈性放假', isHoliday: true, badge: '連假' },
  '2026-10-10': { name: '中華民國國慶日', isHoliday: true, badge: '國定假' },
  '2026-10-11': { name: '國慶連休', isHoliday: true, badge: '連假' },

  // 臺灣光復暨金門古寧頭大捷紀念日連休 3 天 (10/24 - 10/26)
  '2026-10-24': { name: '臺灣光復連休', isHoliday: true, badge: '連假' },
  '2026-10-25': { name: '臺灣光復暨金門古寧頭大捷紀念日', isHoliday: true, badge: '國定假' },
  '2026-10-26': { name: '臺灣光復補假', isHoliday: true, badge: '連假' },

  // 行憲紀念日連休 3 天 (12/25 - 12/27)
  '2026-12-25': { name: '行憲紀念日', isHoliday: true, badge: '國定假' },
  '2026-12-26': { name: '行憲紀念日連休', isHoliday: true, badge: '連假' },
  '2026-12-27': { name: '行憲紀念日連休', isHoliday: true, badge: '連假' },
};

// Taiwan 2027 Holiday Schedule (9個3天以上連假)
const TAIWAN_HOLIDAYS_2027: Record<string, { name: string; isHoliday: boolean; badge?: string }> = {
  // 2027元旦 3天 (1/1 - 1/3)
  '2027-01-01': { name: '中華民國開國紀念日/元旦', isHoliday: true, badge: '國定假' },
  '2027-01-02': { name: '元旦連休', isHoliday: true, badge: '連假' },
  '2027-01-03': { name: '元旦連休', isHoliday: true, badge: '連假' },

  // 過年春節 7天 (2/4 - 2/10)
  '2027-02-04': { name: '春節除夕前一日(小年夜)', isHoliday: true, badge: '連假' },
  '2027-02-05': { name: '農曆除夕', isHoliday: true, badge: '國定假' },
  '2027-02-06': { name: '春節(大年初一)', isHoliday: true, badge: '國定假' },
  '2027-02-07': { name: '春節(大年初二)', isHoliday: true, badge: '國定假' },
  '2027-02-08': { name: '春節(大年初三)', isHoliday: true, badge: '國定假' },
  '2027-02-09': { name: '春節補假(大年初四)', isHoliday: true, badge: '連假' },
  '2027-02-10': { name: '春節補假(大年初五)', isHoliday: true, badge: '連假' },

  // 228紀念日 3天 (2/27 - 3/1)
  '2027-02-27': { name: '228和平紀念日連休', isHoliday: true, badge: '連假' },
  '2027-02-28': { name: '和平紀念日(228)', isHoliday: true, badge: '國定假' },
  '2027-03-01': { name: '和平紀念日補假', isHoliday: true, badge: '連假' },

  // 清明節 4天 (4/3 - 4/6)
  '2027-04-03': { name: '兒童節連休', isHoliday: true, badge: '連假' },
  '2027-04-04': { name: '兒童節', isHoliday: true, badge: '國定假' },
  '2027-04-05': { name: '清明節', isHoliday: true, badge: '國定假' },
  '2027-04-06': { name: '清明節連休補假', isHoliday: true, badge: '連假' },

  // 勞動節 3天 (4/30 - 5/2)
  '2027-04-30': { name: '勞動節補假', isHoliday: true, badge: '連假' },
  '2027-05-01': { name: '勞動節', isHoliday: true, badge: '國定假' },
  '2027-05-02': { name: '勞動節連休', isHoliday: true, badge: '連假' },

  // 雙十國慶 3天 (10/9 - 10/11)
  '2027-10-09': { name: '國慶連休', isHoliday: true, badge: '連假' },
  '2027-10-10': { name: '中華民國國慶日', isHoliday: true, badge: '國定假' },
  '2027-10-11': { name: '國慶補假', isHoliday: true, badge: '連假' },

  // 台灣光復節 3天 (10/23 - 10/25)
  '2027-10-23': { name: '臺灣光復連休', isHoliday: true, badge: '連假' },
  '2027-10-24': { name: '臺灣光復連休', isHoliday: true, badge: '連假' },
  '2027-10-25': { name: '臺灣光復暨金門古寧頭大捷紀念日', isHoliday: true, badge: '國定假' },

  // 行憲紀念日 3天 (12/24 - 12/26)
  '2027-12-24': { name: '行憲紀念日彈性放假', isHoliday: true, badge: '連假' },
  '2027-12-25': { name: '行憲紀念日', isHoliday: true, badge: '國定假' },
  '2027-12-26': { name: '行憲紀念日連休', isHoliday: true, badge: '連假' },

  // 2028跨年 3天 (12/31 - 1/2)
  '2027-12-31': { name: '跨年連假(元旦彈性放假)', isHoliday: true, badge: '連假' },
};

// Commemorative Days in Taiwan (依最新法規與使用者指示)
const COMMEMORATIVE_DAYS: Record<string, string> = {
  '01-01': '中華民國開國紀念日',
  '02-28': '和平紀念日',
  '03-12': '國父逝世紀念日',
  '03-14': '反侵略日',
  '03-21': '民族平等紀念日',
  '03-29': '革命先烈紀念日',
  '04-07': '言論自由日',
  '06-26': '原住民族抵抗日',
  '07-15': '解嚴紀念日',
  '08-01': '原住民族日',
  '08-15': '終戰紀念日',
  '08-23': '八二三紀念日',
  '09-21': '國家防災日',
  '09-28': '孔子誕辰紀念日',
  '10-10': '國慶日',
  '10-24': '臺灣聯合國日',
  '10-25': '臺灣光復暨金門古寧頭大捷紀念日',
  '11-12': '國父誕辰紀念日',
  '12-25': '行憲紀念日',
  '12-28': '全國客家日',
};

// Western & Common Festivals
const WESTERN_FESTIVALS: Record<string, string> = {
  '01-01': '元旦 (New Year)',
  '02-14': '西洋情人節 (Valentine)',
  '03-08': '國際婦女節',
  '04-01': '愚人節 (April Fools)',
  '08-08': '父親節 (88節)',
  '10-31': '萬聖夜 (Halloween)',
  '12-24': '平安夜 (Christmas Eve)',
  '12-25': '聖誕節 (Christmas)',
};

/**
 * Checks if a given date is a statutory Taiwan holiday for years 2028-2033
 */
function getStatutoryTaiwanHoliday(solar: Solar, lunar: Lunar): { name: string; isHoliday: boolean; badge?: string } | null {
  const mmdd = `${String(solar.getMonth()).padStart(2, '0')}-${String(solar.getDay()).padStart(2, '0')}`;
  const lunarMonth = lunar.getMonth();
  const lunarDay = lunar.getDay();

  // 1/1 開國紀念日
  if (mmdd === '01-01') return { name: '中華民國開國紀念日/元旦', isHoliday: true, badge: '國定假' };
  
  // 2/28 和平紀念日
  if (mmdd === '02-28') return { name: '和平紀念日(228)', isHoliday: true, badge: '國定假' };

  // 4/4 兒童節
  if (mmdd === '04-04') return { name: '兒童節', isHoliday: true, badge: '國定假' };

  // 5/1 勞動節
  if (mmdd === '05-01') return { name: '勞動節', isHoliday: true, badge: '國定假' };

  // 9/28 孔子誕辰紀念日
  if (mmdd === '09-28') return { name: '孔子誕辰紀念日/教師節', isHoliday: true, badge: '國定假' };

  // 10/10 國慶日
  if (mmdd === '10-10') return { name: '中華民國國慶日', isHoliday: true, badge: '國定假' };

  // 10/25 臺灣光復節
  if (mmdd === '10-25') return { name: '臺灣光復暨金門古寧頭大捷紀念日', isHoliday: true, badge: '國定假' };

  // 12/25 行憲紀念日
  if (mmdd === '12-25') return { name: '行憲紀念日', isHoliday: true, badge: '國定假' };

  // Lunar holidays:
  // 春節: 除夕 (十二月最後一天)
  // Check if today is last day of lunar year
  const nextSolar = solar.next(1);
  const nextLunar = nextSolar.getLunar();
  if (nextLunar.getMonth() === 1 && nextLunar.getDay() === 1) {
    return { name: '農曆除夕', isHoliday: true, badge: '國定假' };
  }

  // 大年初一 ~ 大年初三
  if (lunarMonth === 1 && lunarDay === 1) return { name: '春節(大年初一)', isHoliday: true, badge: '國定假' };
  if (lunarMonth === 1 && lunarDay === 2) return { name: '春節(大年初二)', isHoliday: true, badge: '國定假' };
  if (lunarMonth === 1 && lunarDay === 3) return { name: '春節(大年初三)', isHoliday: true, badge: '國定假' };

  // 端午節: 五月初五
  if (lunarMonth === 5 && lunarDay === 5) return { name: '端午節', isHoliday: true, badge: '國定假' };

  // 中秋節: 八月十五
  if (lunarMonth === 8 && lunarDay === 15) return { name: '中秋節', isHoliday: true, badge: '國定假' };

  // 清明節
  const jieQi = lunar.getJieQi();
  if (jieQi === '清明') {
    return { name: '清明節', isHoliday: true, badge: '國定假' };
  }

  return null;
}

/**
 * Gets Folk festivals according to Article 5
 */
function getFolkFestival(lunar: Lunar, solar: Solar): string | undefined {
  const lunarMonth = lunar.getMonth();
  const lunarDay = lunar.getDay();

  if (lunarMonth === 1 && lunarDay === 15) return '元宵節';
  if (lunarMonth === 5 && lunarDay === 5) return '端午節';
  if (lunarMonth === 7 && lunarDay === 15) return '中元節';
  if (lunarMonth === 8 && lunarDay === 15) return '中秋節';
  if (lunarMonth === 9 && lunarDay === 9) return '重陽節';

  const nextSolar = solar.next(1);
  const nextLunar = nextSolar.getLunar();
  if (nextLunar.getMonth() === 1 && nextLunar.getDay() === 1) {
    return '除夕';
  }

  if (lunar.getJieQi() === '清明') {
    return '清明節';
  }

  return undefined;
}

/**
 * Compute DayInfo for a given Gregorian date
 */
export function getDayInfo(year: number, month: number, day: number, isCurrentMonth = true): DayInfo {
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();

  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const mmdd = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const dayOfWeek = solar.getWeek(); // 0 is Sunday, 6 is Saturday

  // Today check
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const isToday = dateStr === todayStr;

  // Lunar representations
  const lunarMonthStr = lunar.getMonthInChinese() + '月';
  const lunarDayStr = lunar.getDayInChinese();
  const lunarYearGanzhi = lunar.getYearInGanZhi();
  const lunarAnimal = lunar.getYearShengXiao();

  // Solar Term
  const solarTerm = lunar.getJieQi() || undefined;

  // Western holiday
  let westernHoliday = WESTERN_FESTIVALS[mmdd];
  // Mother's day: Second Sunday of May
  if (month === 5 && dayOfWeek === 0 && day >= 8 && day <= 14) {
    westernHoliday = westernHoliday ? `${westernHoliday} / 母親節` : '母親節 (Mother\'s Day)';
  }

  // Taiwan statutory & DGPA holidays
  let taiwanHoliday: string | undefined;
  let isNationalHoliday = false;
  let isHolidayFlag = false;
  let holidayBadge: string | undefined;

  if (year === 2026 && TAIWAN_HOLIDAYS_2026[dateStr]) {
    const h = TAIWAN_HOLIDAYS_2026[dateStr];
    taiwanHoliday = h.name;
    isNationalHoliday = h.badge === '國定假';
    isHolidayFlag = h.isHoliday;
    holidayBadge = h.badge;
  } else if (year === 2027 && TAIWAN_HOLIDAYS_2027[dateStr]) {
    const h = TAIWAN_HOLIDAYS_2027[dateStr];
    taiwanHoliday = h.name;
    isNationalHoliday = h.badge === '國定假';
    isHolidayFlag = h.isHoliday;
    holidayBadge = h.badge;
  } else {
    // Statutory calculation for 2028-2033
    const stat = getStatutoryTaiwanHoliday(solar, lunar);
    if (stat) {
      taiwanHoliday = stat.name;
      isNationalHoliday = stat.badge === '國定假';
      isHolidayFlag = stat.isHoliday;
      holidayBadge = stat.badge;
    }
  }

  // Commemorative Day
  const commemorativeDay = COMMEMORATIVE_DAYS[mmdd];

  // Folk Festival
  const folkFestival = getFolkFestival(lunar, solar);

  // Weekend is a rest day (Saturday = 6, Sunday = 0)
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isRestDay = isHolidayFlag || isWeekend;

  return {
    dateStr,
    year,
    month,
    day,
    dayOfWeek,
    isCurrentMonth,
    isToday,
    lunarMonthStr,
    lunarDayStr,
    lunarYearGanzhi,
    lunarAnimal,
    solarTerm,
    westernHoliday,
    taiwanHoliday,
    isNationalHoliday,
    isRestDay,
    holidayDescription: holidayBadge,
    commemorativeDay,
    folkFestival,
  };
}

/**
 * Generate a strict 42-cell (6 rows x 7 cols) grid for any Year/Month
 * Ensuring the calendar format has a fixed uniform height across all months!
 */
export function getMonthMatrix(year: number, month: number): DayInfo[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0 = Sunday
  
  const cells: DayInfo[] = [];

  // Previous month trailing days
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const daysInPrevMonth = new Date(prevYear, prevMonth, 0).getDate();

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    cells.push(getDayInfo(prevYear, prevMonth, d, false));
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(getDayInfo(year, month, d, true));
  }

  // Next month leading days up to exactly 42 cells (6 rows * 7 columns)
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  let nextDay = 1;

  while (cells.length < 42) {
    cells.push(getDayInfo(nextYear, nextMonth, nextDay, false));
    nextDay++;
  }

  return cells;
}

/**
 * Get DayInfo for today
 */
export function getTodayInfo(): DayInfo {
  const now = new Date();
  return getDayInfo(now.getFullYear(), now.getMonth() + 1, now.getDate(), true);
}

/**
 * Format string for copying today's date:
 * Format: 年月日農曆日期星期
 * Example: 2026年9月13日 農曆八月初三 星期日
 */
export function formatCopyDateString(dayInfo: DayInfo): string {
  const weekDayNames = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const weekDayStr = weekDayNames[dayInfo.dayOfWeek];
  
  // Format: 年月日農曆日期星期
  return `${dayInfo.year}年${dayInfo.month}月${dayInfo.day}日 農曆${dayInfo.lunarMonthStr}${dayInfo.lunarDayStr} ${weekDayStr}`;
}
