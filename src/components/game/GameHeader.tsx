import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { GameState } from '@/types/game';

interface GameHeaderProps {
  gameState: GameState;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ gameState }) => {
  return (
    <div className="resource-glow mx-4 mt-4 rounded-xl p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <Icon name="Coins" className="mx-auto mb-2 text-yellow-500" />
          <p className="text-sm text-muted-foreground">Бюджет</p>
          <p className="text-xl font-bold text-yellow-500 neon-glow">
            {gameState.budget.toLocaleString()}₽
          </p>
          <Progress 
            value={(gameState.budget / 10000000) * 100} 
            className="mt-1 h-2" 
          />
        </div>
        
        <div>
          <Icon name="Clock" className="mx-auto mb-2 text-red-500" />
          <p className="text-sm text-muted-foreground">До выборов</p>
          <p className="text-xl font-bold text-red-500 neon-glow">
            {gameState.daysUntilElection} дней
          </p>
          <Progress 
            value={(gameState.daysUntilElection / 365) * 100} 
            className="mt-1 h-2" 
          />
        </div>
        
        <div>
          <Icon name="Heart" className="mx-auto mb-2 text-pink-500" />
          <p className="text-sm text-muted-foreground">Репутация</p>
          <p className="text-xl font-bold text-pink-500 neon-glow">
            {gameState.reputation}%
          </p>
          <Progress 
            value={gameState.reputation} 
            className="mt-1 h-2" 
          />
        </div>
        
        <div>
          <Icon name="DollarSign" className="mx-auto mb-2 text-green-500" />
          <p className="text-sm text-muted-foreground">Откаты</p>
          <p className="text-xl font-bold text-green-500 neon-glow">
            {gameState.corruption.toLocaleString()}₽
          </p>
          <Badge className="mt-1 bg-green-500/20 text-green-500 hover:bg-green-500/30">
            {gameState.corruption > 0 ? 'Есть доходы' : 'Пока чистый'}
          </Badge>
        </div>
      </div>
    </div>
  );
};