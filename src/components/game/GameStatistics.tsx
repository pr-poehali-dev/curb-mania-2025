import React from 'react';
import Icon from '@/components/ui/icon';
import { Curb } from '@/types/game';

interface GameStatisticsProps {
  totalSpent: number;
  corruption: number;
  curbs: Curb[];
}

export const GameStatistics: React.FC<GameStatisticsProps> = ({ totalSpent, corruption, curbs }) => {
  return (
    <div className="resource-glow rounded-xl p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div>
          <Icon name="TrendingUp" className="mx-auto mb-2 text-primary" />
          <p className="text-sm text-muted-foreground">Потрачено</p>
          <p className="text-xl font-bold">
            {totalSpent.toLocaleString()}₽
          </p>
          <p className="text-xs text-muted-foreground">
            {(totalSpent / 10000000 * 100).toFixed(1)}% от бюджета
          </p>
        </div>
        <div>
          <Icon name="Coins" className="mx-auto mb-2 text-accent" />
          <p className="text-sm text-muted-foreground">Откаты получено</p>
          <p className="text-xl font-bold">
            {corruption.toLocaleString()}₽
          </p>
          <p className="text-xs text-muted-foreground">
            Личная выгода 💰
          </p>
        </div>
        <div>
          <Icon name="Award" className="mx-auto mb-2 text-secondary" />
          <p className="text-sm text-muted-foreground">Бордюров заменено</p>
          <p className="text-xl font-bold">
            {curbs.filter(c => c.condition === 'new').length}/9
          </p>
          <p className="text-xs text-muted-foreground">
            Прогресс работ
          </p>
        </div>
      </div>
    </div>
  );
};