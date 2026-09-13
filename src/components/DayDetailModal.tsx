import React, { useState } from 'react';
import { 
  X, Copy, Check, Trash2, Calendar as CalendarIcon, 
  Sparkles, Heart, Bell, Star
} from 'lucide-react';
import { DayInfo, CalendarDayMark } from '../types/calendar';

interface DayDetailModalProps {
  day: DayInfo | null;
  mark?: CalendarDayMark;
  isOpen: boolean;
  onClose: () => void;
  onSaveMark: (dateStr: string, stamps: string[], notes?: string) => void;
  onClearMark: (dateStr: string) => void;
}

// User explicitly specified list of emojis plus fairy tale favorites:
// 星星⭐、蛋糕🎂☀️🍖🌰🌱❤️🌹☕️, etc.
const AVAILABLE_STAMPS = [
  '⭐', '🎂', '☀️', '🍖', '🌰', '🌱', '❤️', '🌹', '☕️',
  '🐼', '👑', '🍄', '🎀', '🎉', '✈️', '🍵', '🐾', '🐇'
];

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  day,
  mark,
  isOpen,
  onClose,
  onSaveMark,
  onClearMark,
}) => {
  if (!isOpen || !day) return null;

  const [selectedStamps, setSelectedStamps] = useState<string[]>(mark?.stamps || []);
  const [notes, setNotes] = useState<string>(mark?.notes || '');
  const [copied, setCopied] = useState(false);

  // Toggle stamp selection
  const handleToggleStamp = (stamp: string) => {
    if (selectedStamps.includes(stamp)) {
      setSelectedStamps(selectedStamps.filter(s => s !== stamp));
    } else {
      setSelectedStamps([...selectedStamps, stamp]);
    }
  };

  // Quick save
  const handleSave = () => {
    onSaveMark(day.dateStr, selectedStamps, notes);
    onClose();
  };

  // Clear all
  const handleClear = () => {
    setSelectedStamps([]);
    setNotes('');
    onClearMark(day.dateStr);
    onClose();
  };

  // Copy date text to clipboard
  const handleCopyDateInfo = async () => {
    const text = [
      `【日期】${day.year}年${day.month}月${day.day}日 (星期${['日', '一', '二', '三', '四', '五', '六'][day.dayOfWeek]})`,
      `【農曆】${day.lunarYearGanzhi}年 ${day.lunarMonthStr}${day.lunarDayStr} (${day.lunarAnimal}年)`,
      day.solarTerm ? `【節氣】${day.solarTerm}` : '',
      day.taiwanHoliday ? `【節日】${day.taiwanHoliday} (${day.isNationalHoliday ? '國定假日' : '紀念日'})` : '',
      day.westernHoliday ? `【西洋節日】${day.westernHoliday}` : '',
      mark?.notes ? `【個人行程備忘】${mark.notes}` : '',
      selectedStamps.length > 0 ? `【標記】${selectedStamps.join(' ')}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#fffcf8] border-2 border-rose-200 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header with Holiday theme color */}
        <div className={`px-6 py-4 flex items-center justify-between border-b ${
          day.isRestDay 
            ? 'bg-rose-100 border-rose-200 text-rose-950' 
            : 'bg-stone-100 border-stone-200 text-stone-900'
        }`}>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-rose-600" />
            <div>
              <h3 className="font-bold text-base">
                {day.year} 年 {day.month} 月 {day.day} 日
              </h3>
              <p className="text-xs opacity-80">
                星期{['日', '一', '二', '三', '四', '五', '六'][day.dayOfWeek]}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-black/10 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Large Date & Details Display */}
          <div className="p-4 rounded-xl bg-white border border-rose-100 shadow-xs space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">農曆日期：</span>
              <span className="text-slate-900 font-medium">
                {day.lunarYearGanzhi}年【{day.lunarAnimal}】{day.lunarMonthStr}{day.lunarDayStr}
              </span>
            </div>

            {day.solarTerm && (
              <div className="flex items-center justify-between text-emerald-700 font-medium">
                <span className="font-bold">二十四節氣：</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  🌿 {day.solarTerm}
                </span>
              </div>
            )}

            {day.taiwanHoliday && (
              <div className="flex items-center justify-between text-rose-700">
                <span className="font-bold">台灣節日：</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold">
                  {day.taiwanHoliday} {day.isNationalHoliday && '（國定假）'}
                </span>
              </div>
            )}

            {day.westernHoliday && (
              <div className="flex items-center justify-between text-blue-700">
                <span className="font-bold">西洋節日：</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-medium">
                  {day.westernHoliday}
                </span>
              </div>
            )}

            {day.isRestDay && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-rose-600 font-bold">
                <span>放假狀態：</span>
                <span>🏖️ 休假日 {day.isNationalHoliday ? '（人事行政總處公告放假）' : '（週末休假）'}</span>
              </div>
            )}
          </div>

          {/* Direct Stamp Selection: 星星⭐、蛋糕🎂☀️🍖🌰🌱❤️🌹☕️... */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                直接點選加入特殊 Emoji 標記（免寫標題事項）：
              </label>
              {selectedStamps.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedStamps([])}
                  className="text-[11px] text-rose-600 hover:underline flex items-center gap-0.5"
                >
                  <Trash2 className="w-3 h-3" /> 清除所選圖示
                </button>
              )}
            </div>

            <div className="grid grid-cols-6 gap-2 bg-white p-3 rounded-xl border border-rose-100 shadow-2xs">
              {AVAILABLE_STAMPS.map(stamp => {
                const isSelected = selectedStamps.includes(stamp);
                return (
                  <button
                    key={stamp}
                    type="button"
                    onClick={() => handleToggleStamp(stamp)}
                    className={`h-11 rounded-xl text-xl flex items-center justify-center transition transform active:scale-90 ${
                      isSelected
                        ? 'bg-rose-500 text-white ring-2 ring-rose-400 shadow-xs scale-105'
                        : 'bg-stone-50 hover:bg-rose-100/50 border border-stone-200'
                    }`}
                  >
                    {stamp}
                  </button>
                );
              })}
            </div>

            {selectedStamps.length > 0 && (
              <div className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                <span>已選記號：</span>
                <span className="text-base tracking-wide">{selectedStamps.join(' ')}</span>
              </div>
            )}
          </div>

          {/* Optional Schedule / Reminder Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <Bell className="w-3.5 h-3.5 text-rose-500" /> 行程筆記 / 提醒事項（可選填）：
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="例如：下午3點喝愛麗絲下午茶、朋友生日聚餐、全家出遊..."
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
            />
          </div>

          {/* Quick Copy Date Info Button */}
          <div>
            <button
              type="button"
              onClick={handleCopyDateInfo}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-300 transition flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? '農曆節氣詳細資訊已複製！' : '複製完整日期資訊'}
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-stone-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center">
          <button
            type="button"
            onClick={handleClear}
            className="px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-medium transition flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> 清除此日全部標記
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium transition"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition"
            >
              確認儲存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
