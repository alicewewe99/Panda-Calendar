import React, { useRef, useState } from 'react';
import { 
  X, Download, Upload, Calendar, FileText, 
  Check, Smartphone, Globe, Share2, HelpCircle 
} from 'lucide-react';
import { exportToICS, parseICS, downloadFile } from '../utils/calendarSync';
import { CalendarDayMark, DayInfo } from '../types/calendar';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
  month: number;
  marks: Record<string, CalendarDayMark>;
  days: DayInfo[];
  onImportMarks: (imported: Record<string, CalendarDayMark>) => void;
}

export const SyncModal: React.FC<SyncModalProps> = ({
  isOpen,
  onClose,
  year,
  month,
  marks,
  days,
  onImportMarks,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const jsonInputRef = useRef<HTMLInputElement | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [importCount, setImportCount] = useState<number | null>(null);

  if (!isOpen) return null;

  // 1. Export iCal (.ics) file
  const handleExportICS = () => {
    const icsContent = exportToICS(year, marks, days);
    const filename = `愛麗絲貓熊月曆-${year}年${month}月.ics`;
    downloadFile(filename, icsContent, 'text/calendar;charset=utf-8');
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  // 2. Import iCal (.ics) file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const parsed = parseICS(content);
        const count = Object.keys(parsed).length;
        if (count > 0) {
          onImportMarks(parsed);
          setImportCount(count);
          setTimeout(() => setImportCount(null), 4000);
        } else {
          alert('未能在此 .ics 檔案中找到有效事件，請確認檔案格式。');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // 3. Export JSON backup
  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(marks, null, 2);
    downloadFile(`alice-panda-calendar-backup-${year}.json`, jsonStr, 'application/json');
  };

  // 4. Import JSON backup
  const handleJSONChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (typeof parsed === 'object' && parsed !== null) {
          onImportMarks(parsed);
          setImportCount(Object.keys(parsed).length);
          setTimeout(() => setImportCount(null), 4000);
        }
      } catch (err) {
        alert('JSON 備份檔案解析失敗，請確認檔案正確。');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#fffcf8] border-2 border-rose-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-100 via-amber-50 to-pink-100 px-6 py-4 border-b border-[#f0cfc5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-rose-600" />
            <div>
              <h3 className="font-bold text-rose-950 text-base">手機行事曆匯出與匯入同步</h3>
              <p className="text-xs text-rose-700">支援 iPhone 提醒事項、Apple Calendar、Google 日曆</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-rose-200/60 flex items-center justify-center text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Notification Badges */}
          {exportSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              已成功匯出 .ics 行事曆檔案！手機點開即可「加入全部行程」！
            </div>
          )}

          {importCount !== null && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-indigo-600" />
              成功匯入 {importCount} 筆行程標記！
            </div>
          )}

          {/* Feature 1: Export to .ics for iPhone & Google Calendar */}
          <div className="bg-white p-5 rounded-xl border border-rose-100 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-rose-500" />
                匯出手機行事曆檔案 (.ics)
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                標準 iCalendar 格式
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              將你在愛麗絲貓熊月曆上記錄的標記（星星、蛋糕、Emoji）、備忘事項，以及行政院人事行政總處公告之國定假日，匯出為通用行事曆檔案。
            </p>
            <div className="pt-1 flex flex-wrap gap-2">
              <button
                onClick={handleExportICS}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> 立即匯出 {year} 年 {month} 月行事曆 (.ics)
              </button>
            </div>
            <div className="text-[11px] text-slate-500 bg-stone-50 p-2.5 rounded-lg border border-stone-200 space-y-1">
              <p>📱 <b>iPhone 用戶使用方式：</b> 下載後在手機上點擊檔案，系統會自動彈出「將所有日程加入 iPhone 行事曆」。</p>
              <p>🌐 <b>Google 日曆 / Android 用戶：</b> 開啟 Google 日曆 ➔ 設定 ➔ 匯入與匯出 ➔ 選取此 .ics 檔案即完成同步！</p>
            </div>
          </div>

          {/* Feature 2: Import from .ics */}
          <div className="bg-white p-5 rounded-xl border border-rose-100 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-indigo-500" />
                匯入手機行事曆檔案 (.ics)
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                同步現有日程
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              從手機、Mac 或 Google 日曆匯出的 .ics 檔案，可直接上傳匯入，自動轉化為本月曆上的星號標記與備忘。
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".ics,text/calendar"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" /> 選擇並匯入 .ics 檔案
            </button>
          </div>

          {/* Feature 3: Full JSON Backup & Restore */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-500" />
              個人備份與還原 (JSON 檔案)
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              備份你在本應用程式的所有自訂 Emoji、生日蛋糕標記、心情記號與筆記，換手機或清空快取時可隨時一鍵還原。
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExportJSON}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-300 transition flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> 匯出 JSON 完整備份
              </button>
              <input
                type="file"
                ref={jsonInputRef}
                onChange={handleJSONChange}
                accept=".json,application/json"
                className="hidden"
              />
              <button
                onClick={() => jsonInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-300 transition flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" /> 還原 JSON 備份
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-medium transition"
          >
            完成並關閉
          </button>
        </div>
      </div>
    </div>
  );
};
