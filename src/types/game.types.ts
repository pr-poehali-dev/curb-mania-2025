export interface GameState {
  // Основные ресурсы
  money: number;
  totalEarned: number;
  level: number;
  experience: number;
  clickPower: number;
  
  // Купленные бордюры
  bordurs: {
    [key: string]: {
      owned: boolean;
      purchases: number;
      currentPrice: number;
    };
  };
  
  // Автокликеры
  autoClickers: {
    [key: string]: {
      owned: number;
      currentPrice: number;
    };
  };
  
  // Статистика
  stats: {
    totalClicks: number;
    totalBordurs: number;
    playTime: number;
    maxClicksPerSecond: number;
    lastSave: number;
  };
  
  // Достижения
  achievements: string[];
  
  // Бонусы
  activeBonus: {
    type: 'double' | 'megaclick' | 'goldenhour' | null;
    endTime: number;
  } | null;
}

export interface BordurType {
  id: string;
  name: string;
  emoji: string;
  basePrice: number;
  multiplier: number;
  priceGrowth: number;
  description: string;
  color: string;
}

export interface AutoClicker {
  id: string;
  name: string;
  emoji: string;
  basePrice: number;
  income: number;
  description: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  condition: (state: GameState) => boolean;
  reward?: {
    type: 'money' | 'multiplier';
    value: number;
  };
}

export interface Bonus {
  type: 'double' | 'megaclick' | 'goldenhour';
  duration: number;
  multiplier: number;
  name: string;
  emoji: string;
}