export const getCurbEmoji = (type: string): string => {
  const emojiMap: Record<string, string> = {
    concrete: '🧱',
    granite: '🗿',
    marble: '⚪',
    plastic: '🟡',
    gold: '🏆'
  };
  return emojiMap[type] || '🧱';
};

export const getConditionColor = (condition: string): string => {
  const colorMap: Record<string, string> = {
    new: 'bg-green-500',
    good: 'bg-blue-500',
    old: 'bg-yellow-500',
    critical: 'bg-red-500'
  };
  return colorMap[condition] || 'bg-gray-500';
};

export const getConditionText = (condition: string): string => {
  const textMap: Record<string, string> = {
    new: 'Новый',
    good: 'Хороший',
    old: 'Старый',
    critical: 'Критичный'
  };
  return textMap[condition] || 'Неизвестно';
};

export const generateDefects = (): string[] => {
  const defects = [
    'Трещины в основании',
    'Сколы на поверхности',
    'Неровная установка',
    'Отслоение краски',
    'Коррозия металлических элементов',
    'Просадка грунта',
    'Нарушение геометрии',
    'Загрязнение поверхности'
  ];
  
  const count = Math.floor(Math.random() * 3) + 1;
  return defects.sort(() => 0.5 - Math.random()).slice(0, count);
};