import { Contractor } from '@/types/game';

export const contractors: Contractor[] = [
  {
    id: 'rogatie',
    name: '🛞 Рогатые шины',
    description: 'Быстро, дёшево, но качество... ну вы поняли',
    costModifier: 0.7,
    timeModifier: 0.5,
    qualityModifier: 0.6,
    corruptionModifier: 0.1,
    speciality: 'Скорость',
    icon: '🛞',
    reputation: 2
  },
  {
    id: 'elitstroy',
    name: '🏛️ ЭлитСтрой',
    description: 'Премиум качество за премиум цену',
    costModifier: 1.5,
    timeModifier: 1.8,
    qualityModifier: 1.4,
    corruptionModifier: 0.05,
    speciality: 'Качество',
    icon: '🏛️',
    reputation: 5
  },
  {
    id: 'uncle-vanya',
    name: '👷 Дядя Ваня ЧОП',
    description: 'Надёжно, по-русски, без понтов',
    costModifier: 1.0,
    timeModifier: 1.0,
    qualityModifier: 1.0,
    corruptionModifier: 0.25,
    speciality: 'Надёжность',
    icon: '👷',
    reputation: 3
  },
  {
    id: 'mega-stroy',
    name: '🏗️ МегаСтрой',
    description: 'Большие объёмы, хорошие откаты',
    costModifier: 0.9,
    timeModifier: 0.8,
    qualityModifier: 0.9,
    corruptionModifier: 0.4,
    speciality: 'Откаты',
    icon: '🏗️',
    reputation: 3
  }
];