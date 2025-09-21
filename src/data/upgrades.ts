import { Upgrade } from '@/types/game';

export const upgrades: Upgrade[] = [
  // Бесплатные улучшения за откаты
  {
    id: 'better-bribes',
    name: '💰 Лучшие взятки',
    description: 'Каждый клик приносит больше откатов',
    cost: 1000,
    costType: 'corruption',
    effect: { type: 'clickPower', value: 2 },
    icon: '💰',
    currentLevel: 0,
    maxLevel: 10
  },
  {
    id: 'corrupt-network',
    name: '🕸️ Сеть коррупции',
    description: 'Автоматический приток откатов',
    cost: 5000,
    costType: 'corruption',
    effect: { type: 'autoClick', value: 1 },
    icon: '🕸️',
    currentLevel: 0,
    maxLevel: 5
  },
  {
    id: 'offshore-accounts',
    name: '🏝️ Оффшорные счета',
    description: 'Удваивает весь доход',
    cost: 15000,
    costType: 'corruption',
    effect: { type: 'multiplier', value: 2 },
    icon: '🏝️',
    currentLevel: 0,
    maxLevel: 3
  },
  
  // Премиум улучшения за звезды Telegram
  {
    id: 'golden-hammer',
    name: '🔨 Золотой молоток',
    description: 'Мега-усиление кликов (+50 за клик)',
    cost: 10,
    costType: 'premium',
    effect: { type: 'clickPower', value: 50 },
    icon: '🔨',
    currentLevel: 0,
    maxLevel: 1
  },
  {
    id: 'crypto-mining',
    name: '⛏️ Криптоферма',
    description: 'Пассивный доход 100 откатов/сек',
    cost: 25,
    costType: 'premium',
    effect: { type: 'autoClick', value: 100 },
    icon: '⛏️',
    currentLevel: 0,
    maxLevel: 1
  },
  {
    id: 'corruption-empire',
    name: '👑 Империя коррупции',
    description: 'Увеличивает ВСЕ доходы в 10 раз!',
    cost: 50,
    costType: 'premium',
    effect: { type: 'multiplier', value: 10 },
    icon: '👑',
    currentLevel: 0,
    maxLevel: 1
  }
];