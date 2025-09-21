import React from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Curb } from '@/types/game';
import { getCurbEmoji, getConditionColor, getConditionText } from '@/utils/gameUtils';

interface GameGridProps {
  curbs: Curb[];
  onSelectCurb: (curb: Curb) => void;
}

export const GameGrid: React.FC<GameGridProps> = ({ curbs, onSelectCurb }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8 game-grid">
      {curbs.map((curb) => (
        <Dialog key={curb.id}>
          <DialogTrigger asChild>
            <div className="curb-item" onClick={() => onSelectCurb(curb)}>
              <div className="text-center">
                <div className="text-5xl mb-2 animate-float">{getCurbEmoji(curb.type)}</div>
                <Badge className={`${getConditionColor(curb.condition)} text-white mb-2 neon-glow`}>
                  {getConditionText(curb.condition)}
                </Badge>
                <p className="font-semibold text-sm text-white neon-glow">{curb.material}</p>
                <p className="text-xs text-primary font-bold">
                  {curb.price.toLocaleString()}₽
                </p>
              </div>
            </div>
          </DialogTrigger>
        </Dialog>
      ))}
    </div>
  );
};