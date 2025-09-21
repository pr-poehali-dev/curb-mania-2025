import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Lock, TrendingUp } from 'lucide-react';
import { BORDUR_TYPES, AUTO_CLICKERS } from '@/constants/gameConfig';
import { formatMoney } from '@/hooks/useGameState';
import { GameState } from '@/types/game.types';

interface BordurShopProps {
  gameState: GameState;
  onBuyBordur: (bordurId: string) => void;
  onBuyAutoClicker: (clickerId: string) => void;
}

export const BordurShop: React.FC<BordurShopProps> = ({ gameState, onBuyBordur, onBuyAutoClicker }) => {
  const [activeTab, setActiveTab] = React.useState<'bordurs' | 'auto'>('bordurs');
  
  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-20">
      {/* Табы */}
      <div className="flex space-x-2 mb-6">
        <Button
          variant={activeTab === 'bordurs' ? 'default' : 'outline'}
          onClick={() => setActiveTab('bordurs')}
          className="flex-1"
        >
          🧱 Бордюры
        </Button>
        <Button
          variant={activeTab === 'auto' ? 'default' : 'outline'}
          onClick={() => setActiveTab('auto')}
          className="flex-1"
        >
          🤖 Автоматизация
        </Button>
      </div>
      
      {/* Магазин бордюров */}
      {activeTab === 'bordurs' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BORDUR_TYPES.map((bordur) => {
            const state = gameState.bordurs[bordur.id];
            const canAfford = gameState.money >= state.currentPrice;
            const isLocked = !state.owned && BORDUR_TYPES.indexOf(bordur) > 0 && 
                           !gameState.bordurs[BORDUR_TYPES[BORDUR_TYPES.indexOf(bordur) - 1].id].owned;
            
            return (
              <motion.div
                key={bordur.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: BORDUR_TYPES.indexOf(bordur) * 0.1 }}
              >
                <Card className={`
                  relative overflow-hidden transition-all
                  ${state.owned ? 'border-green-500 shadow-green-500/20 shadow-lg' : ''}
                  ${!canAfford || isLocked ? 'opacity-60' : ''}
                `}>
                  {/* Индикатор покупок */}
                  {state.purchases > 0 && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      ×{state.purchases}
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <span className="text-3xl">{bordur.emoji}</span>
                        <span>{bordur.name}</span>
                      </span>
                      {isLocked && <Lock className="w-5 h-5 text-gray-400" />}
                    </CardTitle>
                    <CardDescription>{bordur.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Множитель */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Множитель:</span>
                      <span className="font-bold text-green-500">×{bordur.multiplier}</span>
                    </div>
                    
                    {/* Рост цены */}
                    {state.purchases > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Рост цены:</span>
                        <span className="flex items-center text-orange-500">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +{Math.round(bordur.priceGrowth * 100)}%
                        </span>
                      </div>
                    )}
                    
                    {/* Кнопка покупки */}
                    <Button
                      onClick={() => onBuyBordur(bordur.id)}
                      disabled={!canAfford || isLocked}
                      className="w-full"
                      variant={state.owned ? 'outline' : 'default'}
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <span>{state.owned ? 'Улучшить' : 'Купить'}</span>
                        <span className="font-bold">{formatMoney(state.currentPrice)}</span>
                      </span>
                    </Button>
                    
                    {/* Подсказка для заблокированных */}
                    {isLocked && (
                      <p className="text-xs text-center text-gray-500">
                        Сначала купите предыдущий бордюр
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
      
      {/* Магазин автокликеров */}
      {activeTab === 'auto' && (
        <div className="space-y-4">
          {/* Общий пассивный доход */}
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <CardHeader>
              <CardTitle>Пассивный доход</CardTitle>
              <CardDescription>
                Автоматический заработок каждую секунду
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">
                +{formatMoney(calculateAutoIncome(gameState))}/сек
              </div>
            </CardContent>
          </Card>
          
          {/* Список автокликеров */}
          {AUTO_CLICKERS.map((clicker, index) => {
            const state = gameState.autoClickers[clicker.id];
            const canAfford = gameState.money >= state.currentPrice;
            
            return (
              <motion.div
                key={clicker.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`
                  transition-all
                  ${state.owned > 0 ? 'border-blue-500 shadow-blue-500/20 shadow-lg' : ''}
                  ${!canAfford ? 'opacity-60' : ''}
                `}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <span className="text-2xl">{clicker.emoji}</span>
                        <span>{clicker.name}</span>
                        {state.owned > 0 && (
                          <span className="text-sm bg-blue-500 text-white px-2 py-1 rounded-full">
                            ×{state.owned}
                          </span>
                        )}
                      </span>
                    </CardTitle>
                    <CardDescription>{clicker.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Текущий доход */}
                    {state.owned > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Текущий доход:</span>
                        <span className="font-bold text-green-500">
                          +{formatMoney(clicker.income * state.owned)}/сек
                        </span>
                      </div>
                    )}
                    
                    {/* Прогресс до следующего уровня цены */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Цена:</span>
                        <span className="font-bold">{formatMoney(state.currentPrice)}</span>
                      </div>
                      <Progress 
                        value={(gameState.money / state.currentPrice) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    {/* Кнопка покупки */}
                    <Button
                      onClick={() => onBuyAutoClicker(clicker.id)}
                      disabled={!canAfford}
                      className="w-full"
                      variant={state.owned > 0 ? 'outline' : 'default'}
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <span>{state.owned > 0 ? 'Нанять ещё' : 'Нанять'}</span>
                        <span className="font-bold">{formatMoney(state.currentPrice)}</span>
                      </span>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
          
          {/* Подсказка про офлайн доход */}
          <div className="text-center text-sm text-gray-500 mt-6">
            💡 Автокликеры работают даже когда игра закрыта (макс. 1 час)
          </div>
        </div>
      )}
    </div>
  );
};

// Вспомогательная функция для расчёта пассивного дохода
const calculateAutoIncome = (state: GameState): number => {
  let income = 0;
  
  Object.entries(state.autoClickers).forEach(([id, data]) => {
    if (data.owned > 0) {
      const clicker = AUTO_CLICKERS.find(c => c.id === id);
      if (clicker) {
        income += clicker.income * data.owned;
      }
    }
  });
  
  return income;
};