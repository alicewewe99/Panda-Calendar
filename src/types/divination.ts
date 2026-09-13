// 7 Chakra Colors for Rainbow Cards
export type ChakraColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'indigo' | 'violet';

export interface RainbowCard {
  id: number;
  chakra: ChakraColor;
  colorName: string;
  chakraName: string;
  theme: string;
  colorHex: string;
  cardAffirmation: string; // 肯定話語
  healingText: string; // 療癒說明
}

export interface ZhenhaiFortune {
  number: number;
  ganzhi: string; // 甲子、乙丑...
  level: string; // 上上、大吉、上吉、中平...
  title: string;
  poem: string[]; // 4-line poem
  interpretation: string; // 聖意解說
  story: string; // 典故
  details: {
    marriage: string; // 婚姻
    career: string; // 事業
    wealth: string; // 求財
    health: string; // 疾病
    family: string; // 家運
    lost: string; // 尋人/失物
    travel: string; // 出行
  };
}

export interface RomanceAngelCard {
  id: number;
  nameZh: string;
  nameEn: string;
  keywords: string[];
  guidance: string; // 詳細解說手冊內容
  actionAdvice: string; // 愛情行動建議
}

export interface GoodGodCard {
  id: number;
  deityName: string; // 神明名稱 (媽祖、關公、月老等)
  title: string; // 卡牌主題
  category: 'oracle' | 'astrology'; // 神諭卡 / 星象卡
  element: string; // 金木水火土
  guidance: string; // 神明指引
  blessing: string; // 祈福籤詩或祝願
}

export interface LoveAnswer {
  id: number;
  answer: string;
  subtext: string;
  romanticQuote: string;
  advice: string;
}

export interface YesNoLoveAnswer {
  result: 'YES' | 'NO' | 'WAIT';
  headline: string;
  detailedMessage: string;
  angelAdvice: string;
}
