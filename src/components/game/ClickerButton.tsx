import React from 'react';
import { Button } from '@/components/ui/button';

interface ClickerButtonProps {
  onClick: () => void;
  clickPower: number;
  disabled?: boolean;
}

export const ClickerButton: React.FC<ClickerButtonProps> = ({ 
  onClick, 
  clickPower, 
  disabled = false 
}) => {
  return (
    <div className="text-center mb-8">
      <div className="mb-4">
        <p className="text-lg font-semibold text-primary">
          Откаты за клик: <span className="text-accent">+{clickPower}₽</span>
        </p>
      </div>
      
      <Button
        className="w-32 h-32 sm:w-40 sm:h-40 rounded-full text-6xl sm:text-7xl 
                   bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 
                   hover:from-yellow-300 hover:via-orange-400 hover:to-red-500
                   border-4 border-yellow-300 shadow-2xl transform transition-all duration-200
                   hover:scale-110 active:scale-95 neon-glow animate-pulse"
        onClick={onClick}
        disabled={disabled}
      >
        💰
      </Button>
      
      <p className="text-sm text-muted-foreground mt-4">
        Кликай для получения откатов!
      </p>
    </div>
  );
};