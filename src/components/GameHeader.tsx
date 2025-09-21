import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { formatMoney } from '@/hooks/useGameState';
import { GameState } from '@/types/game.types';
import { getLevelRequirement } from '@/constants/gameConfig';

interface GameHeaderProps {
  gameState: GameState;
  passiveIncome: number;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ gameState, passiveIncome }) => {
  const levelProgress = (gameState.experience / getLevelRequirement(gameState.level)) * 100;
  
  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b">
      <div className="container max-w-4xl mx-auto px-4 py-3">
        {/* Основная информация */}
        <div className="grid grid-cols-3 gap-4 mb-3">
          {/* Баланс */}
          <div className="text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400">Баланс</div>
            <motion.div 
              className="text-xl font-bold text-green-500"
              key={gameState.money}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {formatMoney(gameState.money)}
            </motion.div>
          </div>
          
          {/* Уровень */}
          <div className="text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400">Уровень</div>
            <div className="text-xl font-bold">{gameState.level}</div>
          </div>
          
          {/* Пассивный доход */}
          <div className="text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400">Доход/сек</div>
            <div className="text-xl font-bold text-blue-500">
              +{formatMoney(passiveIncome)}
            </div>
          </div>
        </div>
        
        {/* Прогресс уровня */}
        <div className="space-y-1">
          <Progress value={levelProgress} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatMoney(gameState.experience)}</span>
            <span>{formatMoney(getLevelRequirement(gameState.level))}</span>
          </div>
        </div>
      </div>
    </div>
  );
};