import React, { useState } from 'react';
import { 
  X, Sparkles, Heart, Compass, BookOpen, Flame, 
  HelpCircle, RefreshCw, CheckCircle2, AlertCircle, RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  CHAKRA_INFO, RAINBOW_CARDS, getRandomRainbowCard 
} from '../data/rainbowCards';
import { 
  ZHENHAI_FORTUNES, getRandomZhenhaiFortune 
} from '../data/zhenhaiFortunes';
import { 
  ROMANCE_ANGEL_CARDS, getRandomRomanceAngelCard 
} from '../data/romanceAngelCards';
import { 
  GOOD_GOD_CARDS, getRandomGoodGodCard 
} from '../data/goodGodCards';
import { 
  YES_NO_LOVE_ANSWERS, BOOK_OF_LOVE_ANSWERS, getRandomYesNoLove, getRandomLoveAnswer 
} from '../data/loveAnswers';
import { 
  ChakraColor, RainbowCard, ZhenhaiFortune, 
  RomanceAngelCard, GoodGodCard, YesNoLoveAnswer, LoveAnswer 
} from '../types/divination';

type DivinationMode = 
  | 'rainbow' 
  | 'zhenhai' 
  | 'romance' 
  | 'goodgod' 
  | 'yesno' 
  | 'bookofanswers';

interface DivinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: DivinationMode;
}

export const DivinationModal: React.FC<DivinationModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'rainbow'
}) => {
  const [activeMode, setActiveMode] = useState<DivinationMode>(initialMode);

  // Rainbow Card State
  const [selectedChakra, setSelectedChakra] = useState<ChakraColor | 'all'>('all');
  const [currentRainbow, setCurrentRainbow] = useState<RainbowCard | null>(() => getRandomRainbowCard());
  const [isRainbowFlipped, setIsRainbowFlipped] = useState(true);

  // Zhenhai Temple State
  // Steps: 1 = 誠心祈求, 2 = 抽籤中, 3 = 擲筊請示, 4 = 解籤結果
  const [zhenhaiStep, setZhenhaiStep] = useState<1 | 2 | 3 | 4>(1);
  const [zhenhaiQuestion, setZhenhaiQuestion] = useState('');
  const [currentFortune, setCurrentFortune] = useState<ZhenhaiFortune | null>(null);
  const [tossResult, setTossResult] = useState<'sheng' | 'xiao' | 'yin' | null>(null);
  const [tossMsg, setTossMsg] = useState('');

  // Romance Angels State
  const [currentAngel, setCurrentAngel] = useState<RomanceAngelCard | null>(() => getRandomRomanceAngelCard());

  // Good Gods State
  const [currentGoodGod, setCurrentGoodGod] = useState<GoodGodCard | null>(() => getRandomGoodGodCard());

  // Yes/No Love State
  const [yesNoQuestion, setYesNoQuestion] = useState('');
  const [currentYesNo, setCurrentYesNo] = useState<YesNoLoveAnswer | null>(null);

  // Book of Love Answers State
  const [loveBookAnswer, setLoveBookAnswer] = useState<LoveAnswer | null>(null);
  const [isBookFlipping, setIsBookFlipping] = useState(false);

  if (!isOpen) return null;

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // safe fallback
    }
  };

  // --- Rainbow card handler ---
  const handleDrawRainbow = () => {
    setIsRainbowFlipped(false);
    setTimeout(() => {
      const card = getRandomRainbowCard(selectedChakra === 'all' ? undefined : selectedChakra);
      setCurrentRainbow(card);
      setIsRainbowFlipped(true);
      triggerConfetti();
    }, 250);
  };

  // --- Zhenhai Temple handlers ---
  const handleStartDrawZhenhai = () => {
    if (!zhenhaiQuestion.trim()) {
      setZhenhaiQuestion('祈求前途、平安與貴人相助');
    }
    setZhenhaiStep(2);
    setTimeout(() => {
      const fortune = getRandomZhenhaiFortune();
      setCurrentFortune(fortune);
      setZhenhaiStep(3); // Go to 擲筊
      setTossResult(null);
      setTossMsg('');
    }, 800);
  };

  const handleTossBwaBwei = () => {
    // 擲筊: 聖筊 (70% probability for pleasant experience, or random), 笑筊, 陰筊
    const outcomes: Array<'sheng' | 'xiao' | 'yin'> = ['sheng', 'sheng', 'sheng', 'xiao', 'yin'];
    const pick = outcomes[Math.floor(Math.random() * outcomes.length)];
    setTossResult(pick);

    if (pick === 'sheng') {
      setTossMsg('【聖筊】神明應允，此籤正是為你指點迷津！');
      triggerConfetti();
      setTimeout(() => {
        setZhenhaiStep(4);
      }, 1000);
    } else if (pick === 'xiao') {
      setTossMsg('【笑筊】神明微笑，所問之事心意尚不明確，或心中早已有數。請再擲一次！');
    } else {
      setTossMsg('【陰筊】神明示意機緣尚未成熟，或此籤非相應之籤，請誠心再抽一籤或重擲！');
    }
  };

  // --- Romance Angels handler ---
  const handleDrawRomanceAngel = () => {
    const card = getRandomRomanceAngelCard();
    setCurrentAngel(card);
    triggerConfetti();
  };

  // --- Good Gods handler ---
  const handleDrawGoodGod = () => {
    const card = getRandomGoodGodCard();
    setCurrentGoodGod(card);
    triggerConfetti();
  };

  // --- Yes/No handler ---
  const handleAskYesNo = () => {
    const ans = getRandomYesNoLove();
    setCurrentYesNo(ans);
    triggerConfetti();
  };

  // --- Book of Love Answers handler ---
  const handleFlipBook = () => {
    setIsBookFlipping(true);
    setTimeout(() => {
      const ans = getRandomLoveAnswer();
      setLoveBookAnswer(ans);
      setIsBookFlipping(false);
      triggerConfetti();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#fffdfa] border-2 border-[#eed5cb] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        
        {/* Fairytale Header */}
        <div className="bg-gradient-to-r from-rose-100 via-amber-50 to-pink-100 px-6 py-4 border-b border-[#f0cfc5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">✨</span>
            <div>
              <h2 className="text-lg font-bold text-rose-950 flex items-center gap-2">
                心靈能量與占卜指引
                <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-rose-200/70 text-rose-900">
                  愛麗絲仙境靈籤閣
                </span>
              </h2>
              <p className="text-xs text-rose-700">彩虹卡 • 東港鎮海宮靈籤 • 浪漫天使 • 台灣好神卡 • 愛情解答之書</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-rose-200/60 flex items-center justify-center text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 6 Nav Tabs */}
        <div className="flex overflow-x-auto border-b border-rose-100 bg-rose-50/40 text-xs font-medium scrollbar-none">
          <button
            onClick={() => setActiveMode('rainbow')}
            className={`px-4 py-3 whitespace-nowrap transition flex items-center gap-1.5 border-b-2 ${
              activeMode === 'rainbow'
                ? 'border-rose-500 text-rose-900 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-rose-700'
            }`}
          >
            🌈 彩虹卡 (七輪能量)
          </button>
          <button
            onClick={() => setActiveMode('zhenhai')}
            className={`px-4 py-3 whitespace-nowrap transition flex items-center gap-1.5 border-b-2 ${
              activeMode === 'zhenhai'
                ? 'border-rose-500 text-rose-900 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-rose-700'
            }`}
          >
            🎋 東港鎮海宮靈籤
          </button>
          <button
            onClick={() => setActiveMode('romance')}
            className={`px-4 py-3 whitespace-nowrap transition flex items-center gap-1.5 border-b-2 ${
              activeMode === 'romance'
                ? 'border-rose-500 text-rose-900 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-rose-700'
            }`}
          >
            👼 浪漫天使指引卡
          </button>
          <button
            onClick={() => setActiveMode('goodgod')}
            className={`px-4 py-3 whitespace-nowrap transition flex items-center gap-1.5 border-b-2 ${
              activeMode === 'goodgod'
                ? 'border-rose-500 text-rose-900 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-rose-700'
            }`}
          >
            🏮 台灣好神卡
          </button>
          <button
            onClick={() => setActiveMode('yesno')}
            className={`px-4 py-3 whitespace-nowrap transition flex items-center gap-1.5 border-b-2 ${
              activeMode === 'yesno'
                ? 'border-rose-500 text-rose-900 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-rose-700'
            }`}
          >
            💘 YES / NO 愛情
          </button>
          <button
            onClick={() => setActiveMode('bookofanswers')}
            className={`px-4 py-3 whitespace-nowrap transition flex items-center gap-1.5 border-b-2 ${
              activeMode === 'bookofanswers'
                ? 'border-rose-500 text-rose-900 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-rose-700'
            }`}
          >
            📖 愛情解答之書
          </button>
        </div>

        {/* Modal Main Scroll Area */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-6">

          {/* ================= 1. RAINBOW CARDS ================= */}
          {activeMode === 'rainbow' && (
            <div className="space-y-5">
              <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/80 text-xs text-amber-950 leading-relaxed">
                <p className="font-bold text-amber-900 mb-1">
                  🌈 彩虹卡（Rainbow Cards）：
                </p>
                由藝術治療師 Doris Wenzel 創作、彭瑛瑛老師翻譯，一套 7 個顏色對應人體七大脈輪，共 245 張智慧與肯定小卡。可作為每日心靈能量提醒，加強自我覺察、療癒心靈。
              </div>

              {/* Chakra Selector Chips */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedChakra('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    selectedChakra === 'all'
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  全部脈輪隨機
                </button>
                {(Object.keys(CHAKRA_INFO) as ChakraColor[]).map(c => {
                  const info = CHAKRA_INFO[c];
                  const isSelected = selectedChakra === c;
                  return (
                    <button
                      key={c}
                      onClick={() => setSelectedChakra(c)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1 border ${
                        isSelected
                          ? 'ring-2 ring-offset-1 text-white shadow-xs font-bold'
                          : 'bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                      style={{
                        backgroundColor: isSelected ? info.colorHex : '#ffffff',
                        borderColor: info.colorHex,
                      }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: info.colorHex }} />
                      {info.colorName} ({info.nameZh})
                    </button>
                  );
                })}
              </div>

              {/* Rainbow Card Display */}
              {currentRainbow && (
                <div className="flex flex-col items-center">
                  <div
                    className="w-full max-w-md rounded-2xl p-6 md:p-8 text-white shadow-xl transition-all duration-300 relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${CHAKRA_INFO[currentRainbow.chakra].colorHex}, #1e293b)`,
                    }}
                  >
                    {/* Decorative Fairytale Watermark */}
                    <div className="absolute top-2 right-3 text-white/20 text-5xl select-none font-serif">
                      ♠
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs">
                        {currentRainbow.colorName} • {currentRainbow.chakraName}
                      </span>
                      <span className="text-xs text-white/80">
                        {CHAKRA_INFO[currentRainbow.chakra].chakraLocation}
                      </span>
                    </div>

                    {/* Affirmation Quote */}
                    <blockquote className="my-6 text-center text-lg md:text-xl font-bold leading-relaxed tracking-wide text-white drop-shadow-xs">
                      「{currentRainbow.cardAffirmation}」
                    </blockquote>

                    {/* Chakra Wisdom */}
                    <div className="mt-4 pt-4 border-t border-white/20 text-xs text-white/90 leading-relaxed bg-black/15 p-3.5 rounded-xl">
                      <p className="font-semibold mb-1 text-amber-200">
                        ✨ 脈輪療癒引導：
                      </p>
                      <p>{currentRainbow.healingText}</p>
                      <p className="mt-2 text-white/70 text-[11px]">
                        對應特質：{CHAKRA_INFO[currentRainbow.chakra].description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleDrawRainbow}
                    className="mt-5 px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" /> 抽取今日彩虹能量卡
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= 2. ZHENHAI TEMPLE FORTUNES ================= */}
          {activeMode === 'zhenhai' && (
            <div className="space-y-5">
              <div className="bg-rose-50/80 p-4 rounded-xl border border-rose-200 text-xs text-rose-950 leading-relaxed">
                <p className="font-bold text-rose-900 mb-1">
                  🎋 屏東東港鎮海宮六十甲子靈籤：
                </p>
                源自古老天干地支六十甲子循環，藉由神明指引協助信眾指點迷津、趨吉避凶。包含完整傳統求籤禮儀：誠心祈求 ➔ 搖籤筒 ➔ 擲筊請示神明（需得聖筊確認） ➔ 解籤明理！
              </div>

              {/* Step 1: Input Wish/Question */}
              {zhenhaiStep === 1 && (
                <div className="bg-white p-6 rounded-2xl border border-rose-200 shadow-xs space-y-4 text-center max-w-lg mx-auto">
                  <div className="text-4xl">🪔</div>
                  <h3 className="font-bold text-slate-800 text-base">向東港鎮海宮神明虔誠稟報</h3>
                  <p className="text-xs text-slate-500">
                    請閉目凝神，在心中默念姓名、現居地址與所求問之具體事項（事業、姻緣、家運、財運或健康）：
                  </p>
                  <input
                    type="text"
                    value={zhenhaiQuestion}
                    onChange={e => setZhenhaiQuestion(e.target.value)}
                    placeholder="例如：請示近期事業轉換與工作發展方向"
                    className="w-full px-4 py-2.5 rounded-xl border border-rose-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-rose-50/30"
                  />
                  <button
                    onClick={handleStartDrawZhenhai}
                    className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md transition text-sm flex items-center justify-center gap-2"
                  >
                    🎋 誠心搖籤筒求籤
                  </button>
                </div>
              )}

              {/* Step 2: Drawing in progress */}
              {zhenhaiStep === 2 && (
                <div className="py-12 text-center space-y-3">
                  <div className="inline-block animate-bounce text-5xl">🎋</div>
                  <p className="text-sm font-bold text-rose-900">籤筒搖晃中... 尋覓相應籤支...</p>
                </div>
              )}

              {/* Step 3: 擲筊 (Bwa Bwei) Confirmation */}
              {zhenhaiStep === 3 && currentFortune && (
                <div className="bg-white p-6 rounded-2xl border border-rose-200 shadow-sm max-w-lg mx-auto text-center space-y-5">
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 font-bold text-sm">
                    抽得：第 {currentFortune.number} 籤 【{currentFortune.ganzhi}】
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    傳統古法：抽得籤支後，需向神明「擲筊」請示此籤是否正是神明指點之籤。需得「聖筊」方為定數！
                  </p>

                  {/* Toss Result Badge */}
                  {tossMsg && (
                    <div className={`p-3 rounded-xl text-xs font-bold ${
                      tossResult === 'sheng' 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
                        : 'bg-amber-50 text-amber-800 border border-amber-300'
                    }`}>
                      {tossMsg}
                    </div>
                  )}

                  <div className="flex justify-center gap-4 py-2">
                    <div className="w-16 h-12 bg-rose-600 rounded-t-full shadow-md transform -rotate-12 flex items-center justify-center text-white text-xs font-bold">
                      筊杯
                    </div>
                    <div className="w-16 h-12 bg-rose-600 rounded-b-full shadow-md transform rotate-12 flex items-center justify-center text-white text-xs font-bold">
                      筊杯
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleTossBwaBwei}
                      className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition"
                    >
                      🎲 擲筊請示神明
                    </button>
                    <button
                      onClick={() => setZhenhaiStep(4)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition"
                    >
                      直接看解籤
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Final Fortune Poetry and Explanations */}
              {zhenhaiStep === 4 && currentFortune && (
                <div className="bg-[#fffcf7] p-6 rounded-2xl border-2 border-rose-300 shadow-md space-y-6">
                  {/* Fortune Header */}
                  <div className="text-center pb-4 border-b border-rose-200">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-800">
                      東港鎮海宮 六十甲子靈籤
                    </span>
                    <h3 className="mt-2 text-xl font-black text-rose-950">
                      第 {currentFortune.number} 籤 【{currentFortune.ganzhi}】 {currentFortune.level}
                    </h3>
                    <p className="text-xs text-rose-700 mt-1">典故：{currentFortune.title}</p>
                  </div>

                  {/* 4-Line Poem in Traditional Box */}
                  <div className="bg-rose-50/60 p-5 rounded-xl border border-rose-200 text-center">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-base md:text-lg font-serif font-bold text-slate-900 tracking-wider">
                      {currentFortune.poem.map((line, idx) => (
                        <div key={idx} className="bg-white/80 py-2 px-1 rounded-lg shadow-xs border border-rose-100">
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sacred Interpretation */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-rose-600" /> 【聖意解說】
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                      {currentFortune.interpretation}
                    </p>
                  </div>

                  {/* Historical Story */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-amber-600" /> 【歷史典故】
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                      {currentFortune.story}
                    </p>
                  </div>

                  {/* Detailed Divination Categories */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-rose-900">【分項吉凶】</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-rose-100">
                        <span className="font-bold text-rose-800">💍 婚姻姻緣：</span>
                        <p className="text-slate-600 mt-0.5">{currentFortune.details.marriage}</p>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-rose-100">
                        <span className="font-bold text-amber-800">💼 事業功名：</span>
                        <p className="text-slate-600 mt-0.5">{currentFortune.details.career}</p>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-rose-100">
                        <span className="font-bold text-emerald-800">💰 求財理財：</span>
                        <p className="text-slate-600 mt-0.5">{currentFortune.details.wealth}</p>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-rose-100">
                        <span className="font-bold text-blue-800">🏥 身體健康：</span>
                        <p className="text-slate-600 mt-0.5">{currentFortune.details.health}</p>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-rose-100">
                        <span className="font-bold text-purple-800">🏡 家運平安：</span>
                        <p className="text-slate-600 mt-0.5">{currentFortune.details.family}</p>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-rose-100">
                        <span className="font-bold text-slate-800">🧭 出行遠行：</span>
                        <p className="text-slate-600 mt-0.5">{currentFortune.details.travel}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-center">
                    <button
                      onClick={() => setZhenhaiStep(1)}
                      className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition"
                    >
                      重新誠心求籤
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 3. ROMANCE ANGELS ================= */}
          {activeMode === 'romance' && (
            <div className="space-y-5">
              <div className="bg-pink-50/80 p-4 rounded-xl border border-pink-200 text-xs text-pink-950 leading-relaxed">
                <p className="font-bold text-pink-900 mb-1">
                  👼 浪漫天使指引卡（The Romance Angels Oracle Cards）：
                </p>
                由天使療法權威朵琳．芙秋（Doreen Virtue）博士設計，共 44 張針對愛情與親密關係的精美神諭卡。為單身尋覓真愛、戀愛升溫或情感抉擇提供清晰指引。
              </div>

              {currentAngel && (
                <div className="flex flex-col items-center">
                  <div className="w-full max-w-md rounded-2xl bg-gradient-to-b from-rose-50 via-white to-pink-50 border-2 border-rose-300 p-6 md:p-8 shadow-xl text-center space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-center text-xs text-rose-500 font-serif">
                      <span>No. {currentAngel.id}</span>
                      <span>The Romance Angels</span>
                    </div>

                    <div className="py-2">
                      <h3 className="text-2xl font-black text-rose-950 font-serif">
                        {currentAngel.nameZh}
                      </h3>
                      <p className="text-xs uppercase tracking-widest text-rose-700 font-semibold mt-0.5">
                        {currentAngel.nameEn}
                      </p>
                    </div>

                    {/* Keywords Chips */}
                    <div className="flex flex-wrap justify-center gap-1.5 py-1">
                      {currentAngel.keywords.map((kw, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-full bg-rose-100/80 text-rose-800 text-[11px] font-medium">
                          #{kw}
                        </span>
                      ))}
                    </div>

                    {/* Handbook Guidance */}
                    <div className="text-xs text-slate-700 text-left leading-relaxed bg-white/90 p-4 rounded-xl border border-rose-100 shadow-xs">
                      <p className="font-bold text-rose-900 mb-1.5 flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> 天使指引解說手冊：
                      </p>
                      <p>{currentAngel.guidance}</p>
                    </div>

                    {/* Action Advice */}
                    <div className="text-xs text-slate-700 text-left leading-relaxed bg-rose-100/40 p-3.5 rounded-xl border border-rose-200">
                      <p className="font-bold text-rose-900 mb-1">
                        💡 浪漫行動建議：
                      </p>
                      <p>{currentAngel.actionAdvice}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleDrawRomanceAngel}
                    className="mt-5 px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" /> 抽取浪漫天使牌卡
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= 4. GOOD GODS CARDS ================= */}
          {activeMode === 'goodgod' && (
            <div className="space-y-5">
              <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200 text-xs text-amber-950 leading-relaxed">
                <p className="font-bold text-amber-900 mb-1">
                  🏮 台灣好神卡《點亮你的人生方向》：
                </p>
                內含 44 張台灣好神卡，融合東方神明特質、廟宇籤詩文化、五行生剋與傳統占卜美學。每位神明具神諭卡與星象卡，助你化解日常生活、事業、財富與人際困境。
              </div>

              {currentGoodGod && (
                <div className="flex flex-col items-center">
                  <div className="w-full max-w-md rounded-2xl bg-gradient-to-br from-amber-50 via-white to-orange-50 border-2 border-amber-300 p-6 md:p-8 shadow-xl text-center space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                        五行屬性：{currentGoodGod.element}
                      </span>
                      <span className="text-amber-700 text-[11px] font-medium">
                        {currentGoodGod.category === 'oracle' ? '神明神諭卡' : '星象引導卡'}
                      </span>
                    </div>

                    <div className="py-2">
                      <div className="text-3xl mb-1">🙏</div>
                      <h3 className="text-xl font-black text-amber-950">
                        {currentGoodGod.deityName}
                      </h3>
                      <p className="text-sm font-bold text-amber-800 mt-1">
                        【{currentGoodGod.title}】
                      </p>
                    </div>

                    {/* Guidance */}
                    <div className="text-xs text-slate-700 text-left leading-relaxed bg-white p-4 rounded-xl border border-amber-100 shadow-xs">
                      <p className="font-bold text-amber-900 mb-1">
                        🌟 神明慈悲指引：
                      </p>
                      <p>{currentGoodGod.guidance}</p>
                    </div>

                    {/* Blessing */}
                    <div className="text-xs text-amber-950 bg-amber-100/60 p-3.5 rounded-xl border border-amber-200 text-center font-serif font-bold">
                      「{currentGoodGod.blessing}」
                    </div>
                  </div>

                  <button
                    onClick={handleDrawGoodGod}
                    className="mt-5 px-6 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" /> 抽取台灣好神指引卡
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= 5. YES / NO LOVE ================= */}
          {activeMode === 'yesno' && (
            <div className="space-y-5">
              <div className="bg-rose-50/80 p-4 rounded-xl border border-rose-200 text-xs text-rose-950 leading-relaxed">
                <p className="font-bold text-rose-900 mb-1">
                  💘 YES / NO 愛情直覺指引：
                </p>
                為曖昧、告白、復合或關係下一步提供最直接了當的直覺方向（YES、NO 或 WAITING 靜待時機），附帶溫柔的解說與行動建議。
              </div>

              <div className="bg-white p-6 rounded-2xl border border-rose-200 shadow-xs max-w-lg mx-auto text-center space-y-4">
                <input
                  type="text"
                  value={yesNoQuestion}
                  onChange={e => setYesNoQuestion(e.target.value)}
                  placeholder="在心中默想你的愛情疑問（例如：我該主動聯絡他嗎？）"
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400 bg-rose-50/30"
                />

                <button
                  onClick={handleAskYesNo}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold shadow-md transition text-sm flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-white" /> 揭曉 YES / NO 愛情解答
                </button>
              </div>

              {currentYesNo && (
                <div className="max-w-md mx-auto rounded-2xl bg-white border-2 border-rose-300 p-6 shadow-xl text-center space-y-4 animate-in zoom-in-95 duration-200">
                  <div className={`text-4xl font-black ${
                    currentYesNo.result === 'YES' 
                      ? 'text-emerald-600' 
                      : currentYesNo.result === 'NO' 
                        ? 'text-rose-600' 
                        : 'text-amber-600'
                  }`}>
                    {currentYesNo.result}
                  </div>

                  <h3 className="text-base font-bold text-slate-800">
                    {currentYesNo.headline}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    {currentYesNo.detailedMessage}
                  </p>

                  <div className="text-xs text-rose-900 bg-rose-50 p-3 rounded-xl border border-rose-200 text-left">
                    <span className="font-bold">✨ 天使行動小語：</span>
                    {currentYesNo.angelAdvice}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 6. BOOK OF LOVE ANSWERS ================= */}
          {activeMode === 'bookofanswers' && (
            <div className="space-y-5">
              <div className="bg-purple-50/80 p-4 rounded-xl border border-purple-200 text-xs text-purple-950 leading-relaxed">
                <p className="font-bold text-purple-900 mb-1">
                  📖 愛情解答之書（The Book of Love Answers）：
                </p>
                專門為戀愛與人際關係打造的互動占卜書。閉上雙眼，在心中專注思索你的愛情難題 3 至 5 秒，深吸一口氣，點擊「翻開解答之書」，宇宙將為你翻開命定的一頁！
              </div>

              <div className="flex flex-col items-center">
                {/* Book Visual Mockup */}
                <div 
                  onClick={handleFlipBook}
                  className="w-full max-w-md cursor-pointer rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-8 shadow-2xl border-4 border-amber-400 relative overflow-hidden transition transform hover:scale-[1.02] active:scale-95"
                >
                  {/* Book Spine Accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-4 bg-amber-400/80" />

                  <div className="text-center space-y-4">
                    <div className="text-amber-300 text-3xl font-serif">❦</div>
                    <h3 className="text-xl md:text-2xl font-black font-serif text-amber-200 tracking-wider">
                      愛 的 解 答 之 書
                    </h3>
                    <p className="text-xs uppercase tracking-widest text-indigo-300">
                      The Book of Love Answers
                    </p>

                    <div className="py-4">
                      {isBookFlipping ? (
                        <div className="animate-pulse text-amber-300 text-sm font-bold">
                          📖 書頁翻動中... 尋覓你的命定之語...
                        </div>
                      ) : loveBookAnswer ? (
                        <div className="space-y-3 bg-white/10 p-4 rounded-xl backdrop-blur-xs border border-white/20">
                          <blockquote className="text-lg md:text-xl font-bold font-serif text-amber-200">
                            「{loveBookAnswer.answer}」
                          </blockquote>
                          <p className="text-xs text-indigo-200 italic font-serif">
                            {loveBookAnswer.romanticQuote}
                          </p>
                          <p className="text-xs text-white/80 pt-2 border-t border-white/20 leading-relaxed">
                            {loveBookAnswer.advice}
                          </p>
                        </div>
                      ) : (
                        <div className="text-xs text-indigo-200">
                          默想心中的問題，點擊書封開啟解答
                        </div>
                      )}
                    </div>

                    <div className="text-[11px] text-amber-300/80 flex items-center justify-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> 點擊翻開新的一頁
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleFlipBook}
                  className="mt-5 px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" /> 翻開解答之書
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-stone-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>🐼 愛麗絲貓熊童話月曆陪伴你的每一天</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-medium transition"
          >
            返回月曆
          </button>
        </div>
      </div>
    </div>
  );
};
