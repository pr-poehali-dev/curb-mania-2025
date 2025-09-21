import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BONUS_TYPES } from '@/constants/gameConfig';
import { GameState } from '@/types/game.types';

interface BonusSystemProps {
  gameState: GameState;
  onActivateBonus: (type: 'double' | 'megaclick' | 'goldenhour') => void;
}

export const BonusSystem: React.FC<BonusSystemProps> = ({ gameState, onActivateBonus }) => {
  const [availableBonus, setAvailableBonus] = useState<typeof BONUS_TYPES[0] | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState(120); // 2 минуты до первого бонуса
  const [bonusPosition, setBonusPosition] = useState({ x: 0, y: 0 });
  
  // Таймер до следующего бонуса
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUntilNext(prev => {
        if (prev <= 1) {
          // Время вышло - показываем случайный бонус
          const randomBonus = BONUS_TYPES.filter(b => b.type !== 'goldenhour')[
            Math.floor(Math.random() * (BONUS_TYPES.length - 1))
          ];
          setAvailableBonus(randomBonus);
          
          // Случайная позиция на экране
          setBonusPosition({
            x: Math.random() * (window.innerWidth - 200),
            y: Math.random() * (window.innerHeight - 400) + 100
          });
          
          // Сброс таймера (2-5 минут до следующего)
          return 120 + Math.floor(Math.random() * 180);
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Автоскрытие бонуса через 10 секунд
  useEffect(() => {
    if (availableBonus) {
      const timeout = setTimeout(() => {
        setAvailableBonus(null);
      }, 10000);
      
      return () => clearTimeout(timeout);
    }
  }, [availableBonus]);
  
  // Обработчик клика по бонусу
  const handleBonusClick = () => {
    if (availableBonus) {
      onActivateBonus(availableBonus.type as 'double' | 'megaclick' | 'goldenhour');
      setAvailableBonus(null);
      
      // Уведомление
      window.Telegram?.WebApp.showPopup({
        title: 'Бонус активирован!',
        message: `${availableBonus.emoji} ${availableBonus.name} на ${availableBonus.duration} секунд!`,
        buttons: [{ text: 'Супер!' }]
      });
    }
  };
  
  // Расчёт оставшегося времени активного бонуса
  const activeBonusTime = gameState.activeBonus ? 
    Math.max(0, Math.ceil((gameState.activeBonus.endTime - Date.now()) / 1000)) : 0;
  
  return (
    <>
      {/* Индикатор активного бонуса */}
      {gameState.activeBonus && activeBonusTime > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50
                   bg-gradient-to-r from-yellow-500 to-orange-500 
                   text-white px-6 py-3 rounded-full shadow-2xl"
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl animate-pulse">
              {gameState.activeBonus.type === 'megaclick' && '⚡'}
              {gameState.activeBonus.type === 'double' && '💰'}
              {gameState.activeBonus.type === 'goldenhour' && '⏰'}
            </span>
            <div>
              <div className="font-bold">
                {gameState.activeBonus.type === 'megaclick' && 'Мегаклик ×10'}
                {gameState.activeBonus.type === 'double' && 'Двойной доход ×2'}
                {gameState.activeBonus.type === 'goldenhour' && 'Золотой час ×5'}
              </div>
              <div className="text-sm">
                Осталось: {formatTime(activeBonusTime)}
              </div>
            </div>
          </div>
          
          {/* Прогресс-бар */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ 
                duration: gameState.activeBonus.type === 'goldenhour' ? 3600 : 
                         gameState.activeBonus.type === 'double' ? 30 : 10,
                ease: 'linear'
              }}
            />
          </div>
        </motion.div>
      )}
      
      {/* Летающий бонус */}
      <AnimatePresence>
        {availableBonus && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: 1, 
              rotate: 0,
              y: [0, -10, 0]
            }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{
              y: {
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut"
              }
            }}
            style={{
              position: 'fixed',
              left: bonusPosition.x,
              top: bonusPosition.y,
              zIndex: 100
            }}
          >
            <Button
              onClick={handleBonusClick}
              className="relative bg-gradient-to-r from-yellow-400 to-orange-500 
                       hover:from-yellow-500 hover:to-orange-600
                       text-white shadow-2xl transform hover:scale-110 
                       transition-all duration-300 p-6"
            >
              {/* Пульсирующие круги */}
              <motion.div
                className="absolute inset-0 rounded-lg"
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(251, 191, 36, 0.7)',
                    '0 0 0 20px rgba(251, 191, 36, 0)',
                  ]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
              
              <div className="relative flex flex-col items-center">
                <span className="text-4xl mb-1">{availableBonus.emoji}</span>
                <span className="font-bold text-sm">{availableBonus.name}</span>
                <span className="text-xs opacity-90">×{availableBonus.multiplier}</span>
              </div>
              
              {/* Таймер исчезновения */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 
                            bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                Исчезнет через 10 сек!
              </div>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Индикатор следующего бонуса */}
      {!availableBonus && (
        <div className="fixed bottom-4 left-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <span>🎁</span>
            <span>Следующий бонус через {formatTime(timeUntilNext)}</span>
          </div>
        </div>
      )}
    </>
  );
};

// Форматирование времени
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};