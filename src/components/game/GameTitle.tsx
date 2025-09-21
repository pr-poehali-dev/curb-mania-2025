import React from 'react';

export const GameTitle: React.FC = () => {
  return (
    <div className="text-center py-8">
      <h1 className="text-6xl font-bold font-['Oswald'] holographic text-transparent bg-clip-text mb-2 neon-glow animate-pulse">
        БОРДЮР МАНИЯ 2025
      </h1>
      <p className="text-lg text-muted-foreground">
        Освой бюджет до выборов! Найди дефекты, выбери подрядчика, получи откаты! 🚀
      </p>
    </div>
  );
};