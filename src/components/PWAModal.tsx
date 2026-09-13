import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, QrCode, Smartphone, Laptop, Check, Copy, X, Share2, HelpCircle } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAModal: React.FC<PWAModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [appUrl, setAppUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'qrcode' | 'ios' | 'android' | 'desktop'>('qrcode');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Determine most accurate public URL
      // If the app is served via preview or direct URL
      let url = window.location.href;
      // Strip hash and dev query params if any
      try {
        const u = new URL(url);
        url = `${u.origin}${u.pathname}`;
      } catch (e) {
        url = window.location.href;
      }
      setAppUrl(url);

      // Generate high-resolution QR code
      QRCode.toDataURL(url, {
        width: 320,
        margin: 2,
        color: {
          dark: '#2c2420',
          light: '#fffaf5',
        },
        errorCorrectionLevel: 'H',
      })
        .then(dataUrl => setQrDataUrl(dataUrl))
        .catch(err => console.error('QR code generation error:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Download high-res framed poster QR code image
  const handleDownloadQRImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 760;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 760);
    grad.addColorStop(0, '#fff8f2');
    grad.addColorStop(1, '#fdeee7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 760);

    // Fairytale border
    ctx.strokeStyle = '#e7a99f';
    ctx.lineWidth = 6;
    ctx.strokeRect(20, 20, 560, 720);

    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.strokeRect(28, 28, 544, 704);
    ctx.setLineDash([]);

    // Title
    ctx.font = 'bold 32px "Noto Sans TC", sans-serif';
    ctx.fillStyle = '#881337';
    ctx.textAlign = 'center';
    ctx.fillText('🐾 愛麗絲貓熊童話月曆 🐾', 300, 80);

    ctx.font = '18px "Noto Sans TC", sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('手機掃描 QR Code 立即開啟與下載安裝 PWA App', 300, 115);

    // Draw QR code image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // White box around QR code
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(136, 19, 55, 0.15)';
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 8;
      ctx.beginPath();
      ctx.roundRect(140, 150, 320, 320, 20);
      ctx.fill();
      ctx.shadowColor = 'transparent';

      ctx.drawImage(img, 150, 160, 300, 300);

      // Footers
      ctx.font = 'bold 18px "Noto Sans TC", sans-serif';
      ctx.fillStyle = '#e11d48';
      ctx.fillText('✨ 支援 iPhone / Android 手機桌面安裝 ✨', 300, 520);

      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText('iOS Safari: 點選分享 ➔ 加入主畫面', 300, 560);
      ctx.fillText('Android Chrome: 點選選單 ➔ 安裝應用程式', 300, 590);
      ctx.fillText('固定格式月曆 • 精準農曆節氣 • 國定假日連假 • 靈籤指引', 300, 630);

      ctx.font = '12px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(appUrl, 300, 680);

      // Trigger download
      const link = document.createElement('a');
      link.download = '愛麗絲貓熊月曆-手機下載QR碼.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = qrDataUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#fffdfa] border border-[#f0cfc5] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Fairy Tale Header */}
        <div className="bg-gradient-to-r from-rose-100 via-amber-50 to-pink-100 px-6 py-4 border-b border-[#f0cfc5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center border border-rose-200 text-xl">
              🐼
            </div>
            <div>
              <h3 className="font-bold text-rose-950 text-base">PWA 手機下載與安裝</h3>
              <p className="text-xs text-rose-700">下載到 iPhone / Android / 電腦桌面 App</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-rose-200/60 flex items-center justify-center text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-rose-100 bg-rose-50/50 text-xs font-medium">
          <button
            onClick={() => setActiveTab('qrcode')}
            className={`flex-1 py-2.5 text-center transition flex items-center justify-center gap-1 ${
              activeTab === 'qrcode'
                ? 'border-b-2 border-rose-500 text-rose-800 font-bold bg-white'
                : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" /> 掃描 QR Code
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-2.5 text-center transition flex items-center justify-center gap-1 ${
              activeTab === 'ios'
                ? 'border-b-2 border-rose-500 text-rose-800 font-bold bg-white'
                : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> iPhone 教學
          </button>
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-2.5 text-center transition flex items-center justify-center gap-1 ${
              activeTab === 'android'
                ? 'border-b-2 border-rose-500 text-rose-800 font-bold bg-white'
                : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Android 教學
          </button>
          <button
            onClick={() => setActiveTab('desktop')}
            className={`flex-1 py-2.5 text-center transition flex items-center justify-center gap-1 ${
              activeTab === 'desktop'
                ? 'border-b-2 border-rose-500 text-rose-800 font-bold bg-white'
                : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" /> 電腦桌面
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'qrcode' && (
            <div className="flex flex-col items-center text-center">
              <div className="relative p-4 bg-white rounded-2xl border-2 border-rose-200 shadow-md">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="App QR Code"
                    className="w-52 h-52 object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-52 h-52 flex items-center justify-center text-slate-400">
                    載入 QR Code 中...
                  </div>
                )}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                  掃碼立即開啟
                </div>
              </div>

              <p className="mt-5 text-sm text-slate-700 font-medium">
                拿起手機相機對準 QR Code 即可直接開啟！
              </p>
              <p className="text-xs text-slate-500 mt-1">
                已修正網址路徑，確保 iPhone 與 Android 手機能精準讀取
              </p>

              {/* Action Buttons */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center w-full">
                <button
                  onClick={handleDownloadQRImage}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition"
                >
                  <Download className="w-4 h-4" /> 下載 QR Code 圖片
                </button>
                <button
                  onClick={handleCopyUrl}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-300 transition"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  {copied ? '網址已複製！' : '複製網址連結'}
                </button>
              </div>

              {/* URL Display */}
              <div className="mt-3 w-full bg-slate-50 p-2 rounded-lg border border-slate-200 text-[11px] text-slate-500 font-mono truncate select-all">
                {appUrl}
              </div>
            </div>
          )}

          {activeTab === 'ios' && (
            <div className="space-y-4 text-slate-700 text-xs leading-relaxed">
              <div className="bg-rose-50/80 p-3.5 rounded-xl border border-rose-200 text-rose-900 font-medium">
                🍎 iPhone / iPad Safari 安裝教學：
              </div>
              <ol className="space-y-3 list-decimal list-inside">
                <li className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="font-bold text-slate-900">使用 Safari 瀏覽器</span> 開啟本月曆網址。
                </li>
                <li className="p-2.5 rounded-lg bg-white border border-slate-200">
                  點擊 Safari 底部工具列中間的 <span className="font-bold text-blue-600">「分享」圖示（帶箭頭的方框）</span>。
                </li>
                <li className="p-2.5 rounded-lg bg-white border border-slate-200">
                  在分享選單中往下滑動，找到並點選 <span className="font-bold text-rose-700">「加入主畫面」 (Add to Home Screen)</span>。
                </li>
                <li className="p-2.5 rounded-lg bg-white border border-slate-200">
                  確認名稱為「愛麗絲貓熊童話月曆」，點選右上角 <span className="font-bold text-blue-600">「新增」</span>。
                </li>
              </ol>
              <div className="text-emerald-700 font-medium bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                🎉 完成後手機桌面上就會出現可愛的手繪貓熊日曆 App 圖示，點開就像原生應用程式一樣全螢幕使用，離線也能查看！
              </div>
            </div>
          )}

          {activeTab === 'android' && (
            <div className="space-y-4 text-slate-700 text-xs leading-relaxed">
              <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200 text-amber-900 font-medium">
                🤖 Android 手機 (Chrome 瀏覽器) 安裝教學：
              </div>
              <ol className="space-y-3 list-decimal list-inside">
                <li className="p-2.5 rounded-lg bg-white border border-slate-200">
                  在 Android 手機上使用 <span className="font-bold text-slate-900">Chrome 瀏覽器</span> 開啟本月曆。
                </li>
                <li className="p-2.5 rounded-lg bg-white border border-slate-200">
                  點選右上角的三個點點選單 <span className="font-bold">「⋮」</span>。
                </li>
                <li className="p-2.5 rounded-lg bg-white border border-slate-200">
                  點選 <span className="font-bold text-rose-700">「安裝應用程式」</span> 或 <span className="font-bold text-rose-700">「加到主畫面」</span>。
                </li>
                <li className="p-2.5 rounded-lg bg-white border border-slate-200">
                  點擊彈出的「安裝」確認鈕即可。
                </li>
              </ol>
              {isInstallable && (
                <button
                  onClick={install}
                  className="w-full mt-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md transition"
                >
                  🚀 立即安裝到 Android 桌面
                </button>
              )}
            </div>
          )}

          {activeTab === 'desktop' && (
            <div className="space-y-4 text-slate-700 text-xs leading-relaxed">
              <div className="bg-blue-50/80 p-3.5 rounded-xl border border-blue-200 text-blue-900 font-medium">
                💻 電腦桌面 (Chrome / Edge) 安裝教學：
              </div>
              <p>
                在電腦瀏覽器網址列最右側，通常會顯示一個「電腦與向下箭頭」的安裝按鈕。點選即可將本月曆安裝為獨立視窗的桌面軟體，隨時在電腦工作列快速開啟！
              </p>
              {isInstallable && (
                <button
                  onClick={install}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md transition"
                >
                  🖥️ 立即在電腦上安裝 App
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-stone-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-medium transition"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
