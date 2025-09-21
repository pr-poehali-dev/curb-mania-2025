export interface GameState {
  budget: number;
  daysUntilElection: number;
  reputation: number;
  corruption: number;
}

export interface Curb {
  id: number;
  type: string;
  condition: 'new' | 'good' | 'old' | 'critical';
  material: string;
  price: number;
  defects?: string[];
}

export interface Contractor {
  id: string;
  name: string;
  description: string;
  costModifier: number; // 0.8 = 20% дешевле, 1.2 = 20% дороже
  timeModifier: number; // 0.5 = в 2 раза быстрее, 2.0 = в 2 раза дольше
  qualityModifier: number; // 0.8 = хуже качество, 1.2 = лучше качество
  corruptionModifier: number; // дополнительные откаты
  speciality?: string; // специализация
  icon: string;
  reputation: number; // от 1 до 5 звезд
}

export interface CurbConfig {
  material: string;
  basePrice: number;
  extras: {
    lighting?: boolean;
    antiVandal?: boolean;
    heating?: boolean;
    customColor?: string;
  };
}