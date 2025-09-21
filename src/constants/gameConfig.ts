import { BordurType, AutoClicker, Achievement, Bonus } from '@/types/game.types';

// Типы бордюров с прогрессивными ценами
export const BORDUR_TYPES: BordurType[] = [
  {
    id: 'concrete',
    name: 'Бетонный',
    emoji: '🧱',
    basePrice: 100,
    multiplier: 1,
    priceGrowth: 0.1, // +10% за каждую покупку
    description: 'Классика жанра',
    color: 'bg-gray-500'
  },
  {
    id: 'plastic',
    name: 'Пластиковый',
    emoji: '🟧',
    basePrice: 500,
    multiplier: 2,
    priceGrowth: 0.15,
    description: 'Модный и экологичный',
    color: 'bg-orange-500'
  },
  {
    id: 'granite',
    name: 'Гранитный',
    emoji: '🗿',
    basePrice: 2500,
    multiplier: 5,
    priceGrowth: 0.2,
    description: 'Солидно и надёжно',
    color: 'bg-stone-600'
  },
  {
    id: 'marble',
    name: 'Мраморный',
    emoji: '⚪',
    basePrice: 10000,
    multiplier: 10,
    priceGrowth: 0.25,
    description: 'Для элитных районов',
    color: 'bg-zinc-300'
  },
  {
    id: 'led',
    name: 'LED-бордюр',
    emoji: '💡',
    basePrice: 50000,
    multiplier: 25,
    priceGrowth: 0.3,
    description: 'С подсветкой как в Европе!',
    color: 'bg-cyan-500'
  },
  {
    id: 'smart',
    name: 'Умный бордюр',
    emoji: '🤖',
    basePrice: 250000,
    multiplier: 50,
    priceGrowth: 0.35,
    description: 'С Wi-Fi и камерами',
    color: 'bg-purple-600'
  },
  {
    id: 'gold',
    name: 'Золотой',
    emoji: '🏆',
    basePrice: 1000000,
    multiplier: 100,
    priceGrowth: 0.4,
    description: 'Статус превыше всего',
    color: 'bg-yellow-500'
  },
  {
    id: 'space',
    name: 'Космический',
    emoji: '🚀',
    basePrice: 10000000,
    multiplier: 500,
    priceGrowth: 0.5,
    description: 'Из метеоритов с Марса',
    color: 'bg-indigo-600'
  }
];

// Автокликеры для пассивного дохода
export const AUTO_CLICKERS: AutoClicker[] = [
  {
    id: 'student',
    name: 'Студент-практикант',
    emoji: '👨‍🎓',
    basePrice: 1000,
    income: 1,
    description: '+1₽/сек'
  },
  {
    id: 'brigadir',
    name: 'Бригадир',
    emoji: '👷',
    basePrice: 10000,
    income: 10,
    description: '+10₽/сек'
  },
  {
    id: 'contractor',
    name: 'Подрядчик',
    emoji: '🏗️',
    basePrice: 100000,
    income: 100,
    description: '+100₽/сек'
  },
  {
    id: 'megacorp',
    name: 'Мегакорпорация',
    emoji: '🏢',
    basePrice: 1000000,
    income: 1000,
    description: '+1000₽/сек'
  }
];

// Достижения в игре
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_million',
    name: 'Первый миллион',
    description: 'Освоить 1,000,000₽',
    emoji: '💰',
    condition: (state) => state.totalEarned >= 1000000,
    reward: { type: 'money', value: 10000 }
  },
  {
    id: 'bordur_magnate',
    name: 'Бордюрный магнат',
    description: 'Купить все типы бордюров',
    emoji: '👑',
    condition: (state) => Object.values(state.bordurs).filter(b => b.owned).length === BORDUR_TYPES.length
  },
  {
    id: 'speed_clicker',
    name: 'Скорость света',
    description: '100 кликов за 10 секунд',
    emoji: '⚡',
    condition: (state) => state.stats.maxClicksPerSecond >= 10
  },
  {
    id: 'space_scale',
    name: 'Космический масштаб',
    description: 'Установить космический бордюр',
    emoji: '🌌',
    condition: (state) => state.bordurs['space']?.owned === true
  },
  {
    id: 'city_legend',
    name: 'Легенда города',
    description: 'Достичь 100 уровня',
    emoji: '🏆',
    condition: (state) => state.level >= 100,
    reward: { type: 'multiplier', value: 2 }
  }
];

// Временные бонусы
export const BONUS_TYPES: Bonus[] = [
  {
    type: 'double',
    duration: 30,
    multiplier: 2,
    name: 'Двойной бюджет',
    emoji: '💰'
  },
  {
    type: 'megaclick',
    duration: 10,
    multiplier: 10,
    name: 'Мегаклик',
    emoji: '⚡'
  },
  {
    type: 'goldenhour',
    duration: 3600,
    multiplier: 5,
    name: 'Золотой час',
    emoji: '⏰'
  }
];

// Формулы прогрессии
export const getLevelRequirement = (level: number): number => {
  return Math.floor(1000 * Math.pow(1.5, level - 1));
};

export const getClickPower = (level: number): number => {
  if (level === 1) return 1;
  if (level === 2) return 2;
  if (level === 3) return 5;
  if (level < 10) return level * 10;
  if (level < 50) return level * 100;
  return level * 1000;
};

// Начальное состояние игры
export const DEFAULT_GAME_STATE = {
  money: 0,
  totalEarned: 0,
  level: 1,
  experience: 0,
  clickPower: 1,
  bordurs: Object.fromEntries(
    BORDUR_TYPES.map(b => [b.id, { owned: false, purchases: 0, currentPrice: b.basePrice }])
  ),
  autoClickers: Object.fromEntries(
    AUTO_CLICKERS.map(a => [a.id, { owned: 0, currentPrice: a.basePrice }])
  ),
  stats: {
    totalClicks: 0,
    totalBordurs: 0,
    playTime: 0,
    maxClicksPerSecond: 0,
    lastSave: Date.now()
  },
  achievements: [],
  activeBonus: null
};