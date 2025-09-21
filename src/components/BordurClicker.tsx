import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BORDUR_TYPES } from '@/constants/gameConfig';
import { formatMoney } from '@/hooks/useGameState';
import { GameState } from '@/types/game.types';

interface BordurClickerProps {
  gameState: GameState;
  onBordurClick: () => void;
  clickValue: number;
}

export const BordurClicker: React.FC<BordurClickerProps> = ({ gameState, onBordurClick, clickValue }) => {
  const [clickAnimations, setClickAnimations] = useState<{ id: number; x: number; y: number; value: number }[]>([]);
  const [isPressed, setIsPressed] = useState(false);
  
  // Определяем активный бордюр (самый дорогой из купленных)
  const activeBordur = Object.entries(gameState.bordurs)
    .filter(([_, b]) => b.owned)
    .map(([id, _]) => BORDUR_TYPES.find(t => t.id === id))
    .filter(Boolean)
    .sort((a, b) => (b?.multiplier || 0) - (a?.multiplier || 0))[0] || BORDUR_TYPES[0];
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Добавляем анимацию клика
    const newAnimation = {
      id: Date.now() + Math.random(),
      x: x + (Math.random() - 0.5) * 50,
      y: y - 50,
      value: clickValue
    };
    
    setClickAnimations(prev => [...prev, newAnimation]);
    
    // Удаляем анимацию через 1 секунду
    setTimeout(() => {
      setClickAnimations(prev => prev.filter(a => a.id !== newAnimation.id));
    }, 1000);
    
    onBordurClick();
  };
  
  // Определяем активный бонус
  const hasActiveBonus = gameState.activeBonus && gameState.activeBonus.endTime > Date.now();
  const bonusType = hasActiveBonus ? gameState.activeBonus?.type : null;
  
  // Цвет свечения в зависимости от бонуса
  const glowColor = bonusType === 'megaclick' ? 'shadow-yellow-500' : 
                    bonusType === 'double' ? 'shadow-green-500' : 
                    bonusType === 'goldenhour' ? 'shadow-orange-500' : 
                    'shadow-blue-500';
  
  return (
    <div className="relative flex flex-col items-center justify-center mb-8">
      {/* Индикатор уровня */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">Уровень</div>
        <div className="text-2xl font-bold">{gameState.level}</div>
      </div>
      
      {/* Основная кнопка-бордюр */}
      <motion.button
        onClick={handleClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        className={`
          relative w-64 h-64 rounded-3xl flex flex-col items-center justify-center
          transition-all duration-100 select-none cursor-pointer
          ${activeBordur.color} ${hasActiveBonus ? 'animate-pulse' : ''}
          shadow-2xl ${glowColor}
        `}
        animate={{
          scale: isPressed ? 0.95 : 1,
          boxShadow: hasActiveBonus 
            ? `0 0 60px 20px ${bonusType === 'megaclick' ? '#EAB308' : bonusType === 'double' ? '#22C55E' : '#F97316'}`
            : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
        whileTap={{ scale: 0.9 }}
      >
        {/* Эмодзи бордюра */}
        <div className="text-8xl mb-2 select-none">
          {activeBordur.emoji}
        </div>
        
        {/* Название бордюра */}
        <div className="text-xl font-bold text-white drop-shadow-lg">
          {activeBordur.name}
        </div>
        
        {/* Доход за клик */}
        <div className="text-lg text-white/90 drop-shadow">
          +{formatMoney(clickValue)}
        </div>
        
        {/* Индикатор бонуса */}
        {hasActiveBonus && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 
                     bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-bold"
          >
            {bonusType === 'megaclick' && '⚡ МЕГАКЛИК ×10'}
            {bonusType === 'double' && '💰 ДВОЙНОЙ ×2'}
            {bonusType === 'goldenhour' && '⏰ ЗОЛОТОЙ ЧАС ×5'}
          </motion.div>
        )}
        
        {/* Круги-волны при клике */}
        {isPressed && (
          <>
            <motion.div
              className="absolute inset-0 rounded-3xl border-4 border-white/30"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className="absolute inset-0 rounded-3xl border-4 border-white/20"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.7 }}
            />
          </>
        )}
      </motion.button>
      
      {/* Анимации чисел при клике */}
      <AnimatePresence>
        {clickAnimations.map(anim => (
          <motion.div
            key={anim.id}
            className="absolute pointer-events-none font-bold text-3xl"
            initial={{ 
              x: anim.x, 
              y: anim.y,
              opacity: 1,
              scale: 0.5
            }}
            animate={{ 
              y: anim.y - 100,
              opacity: 0,
              scale: 1.5
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              color: hasActiveBonus ? '#FBBF24' : '#22C55E',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}
          >
            +{formatMoney(anim.value)}
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Подсказка для новичков */}
      {gameState.stats.totalClicks === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-20 left-1/2 -translate-x-1/2 
                   text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap"
        >
          👆 Кликай по бордюру чтобы заработать!
        </motion.div>
      )}
    </div>
  );
};