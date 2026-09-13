import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Sparkles, Smartphone, Download, Upload, Share2, 
  Copy, RotateCcw, Heart, Star, BookOpen, HelpCircle
} from 'lucide-react';
import { getMonthMatrix, getTodayInfo } from './utils/lunarCalendar';
import { DayInfo, CalendarDayMark } from './types/calendar';
import { PWAModal } from './components/PWAModal';
import { DivinationModal } from './components/DivinationModal';
import { DayDetailModal } from './components/DayDetailModal';
import { SyncModal } from './components/SyncModal';
import { usePWAInstall } from './hooks/usePWAInstall';

const STORAGE_KEY = 'alice_panda_calendar_marks_v1';

// Supported year list 2026 ~ 2033 (and beyond)
const YEARS = [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033];
const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

export default function App() {
  const today = useMemo(() => getTodayInfo(), []);

  // Initialize with today's year and month
  // If today's year is before 2026, start at 2026 as requested by user scope
  const initialYear = today.year < 2026 ? 2026 : today.year > 2033 ? 2026 : today.year;
  const initialMonth = today.month;

  const [currentYear, setCurrentYear] = useState<number>(initialYear);
  const [currentMonth, setCurrentMonth] = useState<number>(initialMonth);

  // User stamps & notes state
  const [marks, setMarks] = useState<Record<string, CalendarDayMark>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Save to local storage whenever marks change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(marks));
    } catch (e) {
      console.error('Failed to save calendar marks to localStorage', e);
    }
  }, [marks]);

  // Modals state
  const [isPWAModalOpen, setIsPWAModalOpen] = useState(false);
  const [isDivinationModalOpen, setIsDivinationModalOpen] = useState(false);
  const [divinationInitialMode, setDivinationInitialMode] = useState<any>('rainbow');
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayInfo | null>(null);

  // PWA hook
  const { isInstallable, install } = usePWAInstall();

  // 42-cell fixed month matrix
  const daysMatrix = useMemo(() => {
    return getMonthMatrix(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  // Lunar year info for header
  const currentMonthLunarText = useMemo(() => {
    const midDay = daysMatrix.find(d => d.isCurrentMonth && d.day === 15) || daysMatrix[15];
    return `${midDay.lunarYearGanzhi}年【生肖${midDay.lunarAnimal}】`;
  }, [daysMatrix]);

  // Navigation handlers (enlarged for easy tapping)
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      if (currentYear > 2026) {
        setCurrentYear(currentYear - 1);
        setCurrentMonth(12);
      }
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      if (currentYear < 2033) {
        setCurrentYear(currentYear + 1);
        setCurrentMonth(1);
      }
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleGoToday = () => {
    const yr = today.year < 2026 ? 2026 : today.year > 2033 ? 2033 : today.year;
    setCurrentYear(yr);
    setCurrentMonth(today.month);
  };

  // Stamp & Note operations
  const handleSaveDayMark = (dateStr: string, stamps: string[], notes?: string) => {
    setMarks(prev => ({
      ...prev,
      [dateStr]: {
        date: dateStr,
        stamps,
        notes,
      },
    }));
  };

  const handleClearDayMark = (dateStr: string) => {
    setMarks(prev => {
      const copy = { ...prev };
      delete copy[dateStr];
      return copy;
    });
  };

  const handleImportMarks = (imported: Record<string, CalendarDayMark>) => {
    setMarks(prev => ({
      ...prev,
      ...imported,
    }));
  };

  // Open divination with specific sub-feature
  const handleOpenDivination = (mode: string) => {
    setDivinationInitialMode(mode);
    setIsDivinationModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fcf8f5] text-slate-800 flex flex-col selection:bg-rose-200">
      
      {/* ================= FAIRYTALE HEADER ================= */}
      <header className="sticky top-0 z-40 bg-[#fffdfb]/95 backdrop-blur-md border-b border-[#f3dcd5] shadow-xs">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          
          {/* Logo & Fairytale Alice Panda Title */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-100 to-amber-100 border-2 border-rose-300 flex items-center justify-center shadow-xs overflow-hidden">
              <span className="text-2xl filter drop-shadow-xs" role="img" aria-label="Alice Panda">
                🐼
              </span>
              <span className="absolute -bottom-1 -right-1 text-xs">🎀</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-rose-950 tracking-wide font-serif">
                  愛麗絲貓熊童話月曆
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                  2026 ~ 2033
                </span>
              </div>
              <p className="text-[11px] text-rose-700/80 hidden sm:block">
                固定版面月曆 • 正確農曆節氣 • 國定假日標註 • 心靈占卜指引 • PWA安裝
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* PWA & QR Code Download */}
            <button
              onClick={() => setIsPWAModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold shadow-xs hover:shadow-md transition active:scale-95"
              title="手機掃描 QR Code 或安裝 PWA 到桌面"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>手機下載 App</span>
            </button>

            {/* Sync / Export / Import */}
            <button
              onClick={() => setIsSyncModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-700 text-xs font-medium border border-[#f0d0c5] shadow-2xs transition active:scale-95"
              title="匯出手機行事曆 (.ics) 或 Google 日曆同步"
            >
              <Share2 className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden sm:inline">行事曆匯出</span>
            </button>

            {/* Divination Portal Button */}
            <button
              onClick={() => handleOpenDivination('rainbow')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold border border-amber-300 shadow-2xs transition active:scale-95"
              title="彩虹卡、鎮海宮靈籤、浪漫天使與台灣好神卡"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>靈籤占卜</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTAINER ================= */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-2 sm:px-6 py-4 space-y-4">
        
        {/* ================= CALENDAR CONTROLS & NAVIGATION ================= */}
        <div className="bg-white rounded-2xl p-3 sm:p-5 border border-[#f2ded7] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Enlarged Prev Month Button, Year/Month Selectors, Next Month Button */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
            
            {/* ENLARGED PREVIOUS MONTH BUTTON (User explicit request: 上個月按鍵放大好點選) */}
            <button
              onClick={handlePrevMonth}
              disabled={currentYear === 2026 && currentMonth === 1}
              className="h-12 px-4 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-100 hover:from-rose-100 hover:to-pink-200 disabled:opacity-40 disabled:pointer-events-none text-rose-900 font-bold border-2 border-rose-300 shadow-xs flex items-center gap-1.5 transition active:scale-95 min-w-[90px] justify-center"
              aria-label="上個月"
            >
              <ChevronLeft className="w-5 h-5 text-rose-600" />
              <span className="text-sm">上個月</span>
            </button>

            {/* Current Display & Selectors */}
            <div className="flex items-center gap-1.5">
              {/* Year Select */}
              <select
                value={currentYear}
                onChange={e => setCurrentYear(Number(e.target.value))}
                className="h-12 px-3 rounded-2xl bg-rose-50/50 border border-rose-300 text-rose-950 font-bold text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-rose-400 cursor-pointer text-center"
              >
                {YEARS.map(y => (
                  <option key={y} value={y}>
                    西元 {y} 年
                  </option>
                ))}
              </select>

              {/* Month Select */}
              <select
                value={currentMonth}
                onChange={e => setCurrentMonth(Number(e.target.value))}
                className="h-12 px-3 rounded-2xl bg-rose-50/50 border border-rose-300 text-rose-950 font-black text-lg md:text-xl focus:outline-none focus:ring-2 focus:ring-rose-400 cursor-pointer text-center"
              >
                {MONTHS.map(m => (
                  <option key={m} value={m}>
                    {m} 月
                  </option>
                ))}
              </select>
            </div>

            {/* ENLARGED NEXT MONTH BUTTON (User explicit request: 下個月按鍵放大好點選) */}
            <button
              onClick={handleNextMonth}
              disabled={currentYear === 2033 && currentMonth === 12}
              className="h-12 px-4 rounded-2xl bg-gradient-to-r from-pink-100 to-rose-50 hover:from-pink-200 hover:to-rose-100 disabled:opacity-40 disabled:pointer-events-none text-rose-900 font-bold border-2 border-rose-300 shadow-xs flex items-center gap-1.5 transition active:scale-95 min-w-[90px] justify-center"
              aria-label="下個月"
            >
              <span className="text-sm">下個月</span>
              <ChevronRight className="w-5 h-5 text-rose-600" />
            </button>
          </div>

          {/* Right Info: Lunar Year Info & Go To Today */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="text-xs text-slate-600 flex items-center gap-1.5 bg-rose-50/70 px-3 py-2 rounded-xl border border-rose-100">
              <span className="text-rose-500">🎋</span>
              <span className="font-bold text-rose-950">{currentMonthLunarText}</span>
            </div>

            <button
              onClick={handleGoToday}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-rose-100 text-slate-700 hover:text-rose-800 text-xs font-bold border border-stone-300 shadow-2xs transition flex items-center gap-1 active:scale-95 whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>回到今天</span>
            </button>
          </div>
        </div>

        {/* Quick Month Chips (1月 ~ 12月) */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {MONTHS.map(m => (
            <button
              key={m}
              onClick={() => setCurrentMonth(m)}
              className={`flex-1 min-w-[42px] py-1.5 rounded-xl text-xs font-bold transition text-center ${
                currentMonth === m
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-white hover:bg-rose-50 text-slate-600 border border-[#f0d5cc]'
              }`}
            >
              {m}月
            </button>
          ))}
        </div>

        {/* Quick Stamp Bar: Direct 1-tap emoji marking guide */}
        <div className="bg-white/90 px-4 py-2 rounded-xl border border-rose-100 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-rose-900">✨ 點選任一日期直接加入圖示記號：</span>
            <span className="text-base tracking-wide">⭐ 🎂 ☀️ 🍖 🌰 🌱 ❤️ 🌹 ☕️</span>
          </div>
          <span className="text-[11px] text-slate-500">
            點擊日期方格可查看農曆節氣、一鍵複製、清除圖示或紀錄行程
          </span>
        </div>

        {/* ================= FIXED CALENDAR GRID (42 CELLS) ================= */}
        {/* Fixed format size: 6 rows x 7 cols. Fixed cell heights so layout is perfectly stable */}
        <div className="bg-white rounded-2xl border-2 border-[#eed5cb] shadow-md overflow-hidden flex flex-col">
          
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 border-b border-[#eed5cb] bg-[#fffaf6] text-center text-xs font-bold py-2.5 select-none">
            {WEEKDAYS.map((wd, i) => (
              <div
                key={wd}
                className={i === 0 || i === 6 ? 'text-rose-600 font-black' : 'text-slate-700'}
              >
                週{wd}
              </div>
            ))}
          </div>

          {/* 42 Calendar Cells (6 rows x 7 columns) */}
          <div className="grid grid-cols-7 divide-x divide-y divide-[#f5e4dd]">
            {daysMatrix.map((day, idx) => {
              const mark = marks[day.dateStr];
              const isToday =
                day.year === today.year &&
                day.month === today.month &&
                day.day === today.day;

              // Pink background and red text for holidays as requested:
              // "休假日粉紅色底色和紅色字體明顯標註"
              const isHolidayCell = day.isRestDay;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDay(day)}
                  className={`relative flex flex-col justify-between p-1 sm:p-2 cursor-pointer transition-all group select-none
                    h-[92px] sm:h-[105px] md:h-[115px]
                    ${!day.isCurrentMonth ? 'opacity-40 bg-stone-50/50' : ''}
                    ${day.isCurrentMonth && isHolidayCell ? 'bg-[#fff0f3] hover:bg-[#ffe4eb]' : 'hover:bg-rose-50/50'}
                    ${isToday ? 'ring-2 ring-inset ring-rose-500 bg-rose-50/80 font-bold' : ''}
                  `}
                >
                  {/* Cell Top Row: Date Number & Badges */}
                  <div className="flex items-start justify-between gap-0.5">
                    {/* Date Number: Red if holiday */}
                    <span
                      className={`text-sm sm:text-base leading-none font-bold ${
                        isHolidayCell ? 'text-[#e11d48]' : 'text-slate-800'
                      }`}
                    >
                      {day.day}
                    </span>

                    {/* Today Badge or National Holiday Tag */}
                    <div className="flex items-center gap-0.5">
                      {isToday && (
                        <span className="text-[9px] sm:text-[10px] bg-rose-600 text-white font-bold px-1 py-0.2 rounded-sm shadow-2xs">
                          今
                        </span>
                      )}
                      {day.isNationalHoliday && (
                        <span className="text-[9px] sm:text-[10px] bg-rose-500 text-white font-bold px-1 py-0.2 rounded-sm shadow-2xs whitespace-nowrap">
                          國定假
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Cell Middle: Lunar Date, Solar Term, Holiday Name */}
                  <div className="flex flex-col gap-0.5 my-auto overflow-hidden text-[10px] sm:text-[11px] leading-tight">
                    {/* Taiwan Statutory / Folk Holiday */}
                    {day.taiwanHoliday && (
                      <span className="font-bold text-rose-700 truncate block">
                        {day.taiwanHoliday}
                      </span>
                    )}

                    {/* Western Holiday (if no Taiwan holiday or brief) */}
                    {!day.taiwanHoliday && day.westernHoliday && (
                      <span className="font-medium text-blue-700 truncate block">
                        {day.westernHoliday}
                      </span>
                    )}

                    {/* Solar Term */}
                    {day.solarTerm && (
                      <span className="font-bold text-emerald-700 flex items-center gap-0.5 truncate">
                        <span className="text-[9px]">🌱</span> {day.solarTerm}
                      </span>
                    )}

                    {/* Lunar Date (or First Day of Lunar Month) */}
                    <span
                      className={`truncate ${
                        day.lunarDayStr === '初一'
                          ? 'font-bold text-rose-800'
                          : 'text-slate-500'
                      }`}
                    >
                      {day.lunarDayStr}
                    </span>
                  </div>

                  {/* Cell Bottom: Special Emoji Stamps (⭐ 🎂 ☀️ 🍖 🌰 🌱 ❤️ 🌹 ☕️) */}
                  <div className="flex items-center justify-between min-h-[18px]">
                    <div className="flex items-center gap-0.5 overflow-hidden text-xs sm:text-sm">
                      {mark?.stamps?.slice(0, 3).map((st, sidx) => (
                        <span key={sidx} className="filter drop-shadow-2xs">
                          {st}
                        </span>
                      ))}
                      {(mark?.stamps?.length || 0) > 3 && (
                        <span className="text-[9px] text-slate-400 font-bold">
                          +{mark!.stamps.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Note indicator dot */}
                    {mark?.notes && (
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-2xs"
                        title={mark.notes}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= DIVINATION SHORTCUT PANELS ================= */}
        <div className="bg-gradient-to-r from-amber-50 via-rose-50 to-purple-50 rounded-2xl p-4 sm:p-5 border border-[#edd7cd] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              愛麗絲仙境心靈指引館
            </h3>
            <span className="text-xs text-rose-700 font-medium">每日能量與占卜解惑</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
            <button
              onClick={() => handleOpenDivination('rainbow')}
              className="p-2.5 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-left transition shadow-2xs group flex flex-col justify-between h-20"
            >
              <div className="text-xl">🌈</div>
              <div>
                <span className="font-bold text-slate-800 block group-hover:text-rose-700">彩虹卡</span>
                <span className="text-[10px] text-slate-500">七輪245張肯定句</span>
              </div>
            </button>

            <button
              onClick={() => handleOpenDivination('zhenhai')}
              className="p-2.5 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-left transition shadow-2xs group flex flex-col justify-between h-20"
            >
              <div className="text-xl">🎋</div>
              <div>
                <span className="font-bold text-slate-800 block group-hover:text-rose-700">東港鎮海宮</span>
                <span className="text-[10px] text-slate-500">六十甲子靈籤與擲筊</span>
              </div>
            </button>

            <button
              onClick={() => handleOpenDivination('romance')}
              className="p-2.5 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-left transition shadow-2xs group flex flex-col justify-between h-20"
            >
              <div className="text-xl">👼</div>
              <div>
                <span className="font-bold text-slate-800 block group-hover:text-rose-700">浪漫天使</span>
                <span className="text-[10px] text-slate-500">44張愛情神諭指引</span>
              </div>
            </button>

            <button
              onClick={() => handleOpenDivination('goodgod')}
              className="p-2.5 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-left transition shadow-2xs group flex flex-col justify-between h-20"
            >
              <div className="text-xl">🏮</div>
              <div>
                <span className="font-bold text-slate-800 block group-hover:text-rose-700">台灣好神卡</span>
                <span className="text-[10px] text-slate-500">媽祖關公土地公星象</span>
              </div>
            </button>

            <button
              onClick={() => handleOpenDivination('yesno')}
              className="p-2.5 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-left transition shadow-2xs group flex flex-col justify-between h-20"
            >
              <div className="text-xl">💘</div>
              <div>
                <span className="font-bold text-slate-800 block group-hover:text-rose-700">YES / NO</span>
                <span className="text-[10px] text-slate-500">愛情直覺果斷解答</span>
              </div>
            </button>

            <button
              onClick={() => handleOpenDivination('bookofanswers')}
              className="p-2.5 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-left transition shadow-2xs group flex flex-col justify-between h-20"
            >
              <div className="text-xl">📖</div>
              <div>
                <span className="font-bold text-slate-800 block group-hover:text-rose-700">解答之書</span>
                <span className="text-[10px] text-slate-500">翻開愛的命定扉頁</span>
              </div>
            </button>
          </div>
        </div>

        {/* Holiday Legend Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 px-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-xs bg-[#fff0f3] border border-rose-300" /> 休假日 (粉紅底色+紅字)
            </span>
            <span className="flex items-center gap-1">
              <span className="text-rose-600 font-bold">國定假</span> 行政院人事行政總處公告放假
            </span>
            <span className="flex items-center gap-1">
              <span className="text-emerald-700 font-bold">🌱 節氣</span> 二十四節氣精準換算
            </span>
          </div>
          <span>點擊日期即可自由蓋印 ⭐ 🎂 ☀️ 🍖 🌰 記號</span>
        </div>

      </main>

      {/* ================= MODALS ================= */}
      {/* 1. Day Detail, Stamps & Notes Modal */}
      <DayDetailModal
        day={selectedDay}
        mark={selectedDay ? marks[selectedDay.dateStr] : undefined}
        isOpen={!!selectedDay}
        onClose={() => setSelectedDay(null)}
        onSaveMark={handleSaveDayMark}
        onClearMark={handleClearDayMark}
      />

      {/* 2. PWA Installation & QR Code Poster Modal */}
      <PWAModal
        isOpen={isPWAModalOpen}
        onClose={() => setIsPWAModalOpen(false)}
      />

      {/* 3. Divination & Spiritual Portal Modal */}
      <DivinationModal
        isOpen={isDivinationModalOpen}
        onClose={() => setIsDivinationModalOpen(false)}
        initialMode={divinationInitialMode}
      />

      {/* 4. Phone Calendar Sync (iCal / Google / Reminders) Modal */}
      <SyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        year={currentYear}
        month={currentMonth}
        marks={marks}
        days={daysMatrix}
        onImportMarks={handleImportMarks}
      />

    </div>
  );
}
