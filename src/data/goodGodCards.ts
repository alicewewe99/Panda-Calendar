import { GoodGodCard } from '../types/divination';

export const GOOD_GOD_CARDS: GoodGodCard[] = [
  // 媽祖 (天上聖母) - 慈悲渡海、定海神針
  {
    id: 1,
    deityName: '天上聖母 媽祖',
    title: '海納百川 慈航普渡',
    category: 'oracle',
    element: '水',
    guidance: '心如大海般廣闊，能容納所有的波濤與風浪。在人生的航程中，媽祖手持神燈為你指引航向，莫懼眼前的小風暴，心定則海自平。',
    blessing: '聖德參天，風調雨順，出入平安，波瀾化吉。',
  },
  {
    id: 2,
    deityName: '天上聖母 媽祖',
    title: '溫柔守護 柔能克剛',
    category: 'oracle',
    element: '水',
    guidance: '面對剛強的阻礙，不要以硬碰硬。以如水般柔軟的包容力與智慧去轉化，所有的敵意在真誠溫柔面前都將化為善意。',
    blessing: '慈悲無量，柔水穿石，難關漸過，安泰吉祥。',
  },
  {
    id: 3,
    deityName: '天上聖母 媽祖',
    title: '順風千里 貴人顯赫',
    category: 'astrology',
    element: '金',
    guidance: '天體星象顯示順風相送之兆。千里眼看清前路，順風耳聽聞良機。此時宜向外尋求合作與貴人指點，必有順水推舟之助力。',
    blessing: '千里順風，明燈引路，得道多助，前程光明。',
  },

  // 月下老人 - 牽起紅線、善緣圓滿
  {
    id: 4,
    deityName: '月下老人',
    title: '紅線已繫 緣定三生',
    category: 'oracle',
    element: '火',
    guidance: '姻緣簿上已有安排，千里姻緣一線牽。若心中有掛念的人，多給予彼此真誠關懷；若是單身，良緣正在靠近，打開心門靜待花開。',
    blessing: '花好月圓，良緣天成，心心相印，百年和諧。',
  },
  {
    id: 5,
    deityName: '月下老人',
    title: '廣結善緣 人脈豐盈',
    category: 'oracle',
    element: '木',
    guidance: '月老不僅管男女情愛，更管世間一切善緣人脈。對身邊每個人投以善意，一個微笑、一聲問候，都能為你締結未來的福報與貴人。',
    blessing: '善緣日增，人人和睦，門庭迎貴，事事順心。',
  },
  {
    id: 6,
    deityName: '月下老人',
    title: '月相盈虧 順應時序',
    category: 'astrology',
    element: '水',
    guidance: '月有陰晴圓缺，人有悲歡離合。感情中的短暫波折如月之漸虧，莫急躁失落，待得月圓之時，自見甘霖與美滿。',
    blessing: '隨緣自在，心無罣礙，盈縮有時，終歸圓滿。',
  },

  // 關聖帝君 (恩主公) - 正義忠義、斬除小人、商賈財神
  {
    id: 7,
    deityName: '關聖帝君',
    title: '青龍偃月 斬斷迷障',
    category: 'oracle',
    element: '金',
    guidance: '行事以忠義誠信為本，神威護佑，邪念小人不敢近身。拿出你的魄力與浩然正氣，果斷斬斷拖泥帶水的猶豫與不當牽纏！',
    blessing: '浩然正氣，志薄雲霄，逢凶化吉，威震四方。',
  },
  {
    id: 8,
    deityName: '關聖帝君',
    title: '誠信為本 財源自聚',
    category: 'oracle',
    element: '土',
    guidance: '身為武財神之尊，帝君明示：做人老實不欺，言出必行，金字招牌自然屹立不搖，正財厚德滾滾而來。',
    blessing: '一諾千金，義薄雲天，商道亨通，富貴長保。',
  },
  {
    id: 9,
    deityName: '關聖帝君',
    title: '天罡北斗 威光赫濯',
    category: 'astrology',
    element: '火',
    guidance: '北斗天罡星臨照，威嚴而明察。事業上若有合同簽署或重大合約，務必字斟句酌、正大光明，正義會站在你這一邊。',
    blessing: '星宿拱衛，邪不勝正，公道自在，旗開得勝。',
  },

  // 文昌帝君 - 金榜題名、開智明慧
  {
    id: 10,
    deityName: '文昌帝君',
    title: '開卷有益 文思泉湧',
    category: 'oracle',
    element: '木',
    guidance: '智慧如甘霖滋潤心靈。無論是考試、進修、考證照或是學習新技能，此時都是吸納知識的最佳黃金期。專注研讀，必有所成。',
    blessing: '文星高照，金榜題名，智慧通達，才高八斗。',
  },
  {
    id: 11,
    deityName: '文昌帝君',
    title: '心無雜念 筆下生花',
    category: 'oracle',
    element: '水',
    guidance: '靜下心來，排除外在的誘惑與雜訊。當你的心如同止水般澄澈，靈感與好點子將源源不絕湧現，作品將驚豔眾人。',
    blessing: '心明眼亮，下筆有神，靈光閃爍，大展鴻圖。',
  },

  // 福德正神 (土地公) - 聚財納福、護佑家宅、接地厚德
  {
    id: 12,
    deityName: '福德正神 土地公',
    title: '地肥水美 厚德載物',
    category: 'oracle',
    element: '土',
    guidance: '腳踏實地最安心。土地公公微笑提醒你：不用好高騖遠，守好你眼前的責任田，辛勤耕耘的一分一毫，都將化為豐饒的黃金稻穗。',
    blessing: '安土敦仁，家宅清吉，招財納福，平安大吉。',
  },
  {
    id: 13,
    deityName: '福德正神 土地公',
    title: '土地生金 細水長流',
    category: 'oracle',
    element: '金',
    guidance: '小錢積聚成大財，開源節流正是時候。土地公賜予你穩健的財運，一步一腳印，穩紮穩打即可衣食無憂。',
    blessing: '財庫豐滿，進寶招財，福壽雙全，滿堂和氣。',
  },

  // 中壇元帥 (哪吒三太子) - 活力滿分、突破瓶頸、護童保平安
  {
    id: 14,
    deityName: '中壇元帥 三太子',
    title: '風火輪轉 破除障礙',
    category: 'oracle',
    element: '火',
    guidance: '踏上風火輪，揮動乾坤圈！所有的停滯與沉悶都將被你驚人的行動力一掃而空。保持純真無畏的心，大步向前衝刺吧！',
    blessing: '神勇無比，神通廣大，驅邪除障，速戰速決。',
  },
  {
    id: 15,
    deityName: '中壇元帥 三太子',
    title: '赤子純心 樂在當下',
    category: 'oracle',
    element: '木',
    guidance: '不要把自己逼得太緊，找回像小孩子一樣的大笑與好奇心！當你用愛與遊戲的心態面對工作與挑戰，問題自然迎刃而解。',
    blessing: '無憂無慮，童顏常駐，生龍活虎，快樂無邊。',
  },

  // 虎爺將軍 - 鎮煞辟邪、招偏財、旺運護主
  {
    id: 16,
    deityName: '虎爺將軍',
    title: '虎虎生威 咬錢聚寶',
    category: 'oracle',
    element: '金',
    guidance: '虎爺威猛伏案下，口咬金錢送福來。為你驅走暗處的小人是非，帶來意想不到的偏財與驚喜機運。勇氣是你最強大的護身符！',
    blessing: '虎嘯生風，辟邪鎮煞，財源廣進，威嚴無比。',
  },

  // 觀世音菩薩 - 聞聲救苦、慈悲化境、心安吉祥
  {
    id: 17,
    deityName: '觀世音菩薩',
    title: '楊柳甘霖 洗滌心塵',
    category: 'oracle',
    element: '水',
    guidance: '淨瓶楊柳灑甘露，撫平你心中所有的焦慮與苦楚。放下執著與恐懼，默念菩薩聖號，心清自然生出大定與大智慧。',
    blessing: '大慈大悲，千處祈求，苦厄盡除，福慧雙修。',
  },
  {
    id: 18,
    deityName: '觀世音菩薩',
    title: '無罣無礙 究竟涅槃',
    category: 'oracle',
    element: '土',
    guidance: '心經云：「心無罣礙，無罣礙故，無有恐怖。」一切境遇皆為幻相，回到心靈的本來面目，清淨如蓮花出淤泥而不染。',
    blessing: '自在清安，吉祥如意，所願皆成，福壽無量。',
  },

  // 五路財神 - 招財進寶、利市興隆
  {
    id: 19,
    deityName: '五路財神',
    title: '東西南北 財源匯流',
    category: 'oracle',
    element: '金',
    guidance: '五方財神齊降臨，金銀財寶滿堂春。此時利於商業開拓、簽單收成與投資布局，保持慷慨施捨的心態，施比受更有福。',
    blessing: '五路進財，利市仙官，八方來富，大發利市。',
  },

  // 城隍爺 - 明察秋毫、保境安民、是非分明
  {
    id: 20,
    deityName: '城隍尊神',
    title: '大算盤起 善惡昭彰',
    category: 'oracle',
    element: '土',
    guidance: '城隍爺高懸大算盤，人有千算不如天有一算。莫為眼前的委屈憤憤不平，蒼天有眼，善念功德分毫不爽，自會還你公道。',
    blessing: '清明廉正，陰陽皆泰，是非分明，吉慶平安。',
  },
];

export function getRandomGoodGodCard(): GoodGodCard {
  const index = Math.floor(Math.random() * GOOD_GOD_CARDS.length);
  return GOOD_GOD_CARDS[index];
}
