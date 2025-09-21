import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, formatMoney } from '@/hooks/useGameState';
import { useTelegram } from '@/hooks/useTelegram';
import { AUTO_CLICKERS, ACHIEVEMENTS, BORDUR_TYPES } from '@/constants/gameConfig';

// Компоненты игры
import { BordurClicker } from '@/components/BordurClicker';
import { BordurShop } from '@/components/BordurShop';
import { BonusSystem } from '@/components/BonusSystem';
import { GameProfile } from '@/components/GameProfile';
import { GameHeader } from '@/components/GameHeader';
import { BottomNavigation } from '@/components/BottomNavigation';

export default function Game() {
  const [activeTab, setActiveTab] = useState('game');
  const [showWelcome, setShowWelcome] = useState(true);
  const { user, isReady } = useTelegram();
  const { 
    gameState, 
    handleClick, 
    buyBordur, 
    buyAutoClicker, 
    activateBonus,
    resetGame 
  } = useGameState();
  
  // Расчёт значения клика
  const getClickValue = () => {
    let value = gameState.clickPower;
    
    // Множитель от активного бордюра
    const activeBordur = Object.entries(gameState.bordurs)
      .filter(([_, b]) => b.owned)
      .map(([id, _]) => BORDUR_TYPES.find(t => t.id === id))
      .filter(Boolean)
      .sort((a, b) => (b?.multiplier || 0) - (a?.multiplier || 0))[0];
    
    if (activeBordur) {
      value *= activeBordur.multiplier;
    }
    
    // Бонусы
    if (gameState.activeBonus && gameState.activeBonus.endTime > Date.now()) {
      if (gameState.activeBonus.type === 'megaclick') value *= 10;
      if (gameState.activeBonus.type === 'double') value *= 2;
      if (gameState.activeBonus.type === 'goldenhour') value *= 5;
    }
    
    return Math.floor(value);
  };
  
  // Расчёт пассивного дохода
  const getPassiveIncome = () => {
    let income = 0;
    
    Object.entries(gameState.autoClickers).forEach(([id, data]) => {
      if (data.owned > 0) {
        const clicker = AUTO_CLICKERS.find(c => c.id === id);
        if (clicker) {
          income += clicker.income * data.owned;
        }
      }
    });
    
    // Бонусы
    if (gameState.activeBonus && gameState.activeBonus.endTime > Date.now()) {
      if (gameState.activeBonus.type === 'goldenhour') income *= 5;
      if (gameState.activeBonus.type === 'double') income *= 2;
    }
    
    return income;
  };
  
  // Проверка достижений
  useEffect(() => {
    ACHIEVEMENTS.forEach(achievement => {
      if (!gameState.achievements.includes(achievement.id) && achievement.condition(gameState)) {
        // Новое достижение!
        window.Telegram?.WebApp.showPopup({
          title: '🎉 Новое достижение!',
          message: `${achievement.emoji} ${achievement.name}\n${achievement.description}`,
          buttons: [{ text: 'Отлично!' }]
        });
        
        // Здесь бы добавить достижение в state, но это потребует изменения хука
      }
    });
  }, [gameState]);
  
  // Приветственный экран
  useEffect(() => {
    if (gameState.stats.totalClicks > 0 || !isReady) {
      setShowWelcome(false);
    }
  }, [gameState.stats.totalClicks, isReady]);
  
  // Таймер игрового времени
  useEffect(() => {
    const interval = setInterval(() => {
      // Обновляем время в игре (нужно добавить в хук)
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl animate-pulse">Загрузка...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Шапка с основной информацией */}
      <GameHeader gameState={gameState} passiveIncome={getPassiveIncome()} />
      
      {/* Система бонусов */}
      <BonusSystem gameState={gameState} onActivateBonus={activateBonus} />
      
      {/* Приветственный экран */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background flex items-center justify-center p-8"
          >
            <div className="text-center max-w-md">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-8xl mb-6"
              >
                🧱
              </motion.div>
              
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-bold mb-4"
              >
                Бордюр Мания 2025
              </motion.h1>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-lg text-gray-500 dark:text-gray-400 mb-8"
              >
                Стань королём бордюров! Кликай, развивайся и освой весь городской бюджет!
              </motion.p>
              
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                onClick={() => setShowWelcome(false)}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-bold text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Начать игру!
              </motion.button>
              
              {user && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-4 text-sm text-gray-500"
                >
                  Привет, {user.first_name}! 👋
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Основной контент */}
      <div className="container max-w-4xl mx-auto px-4 pt-4">
        {/* Игровой экран */}
        {activeTab === 'game' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]"
          >
            <BordurClicker
              gameState={gameState}
              onBordurClick={handleClick}
              clickValue={getClickValue()}
            />
            
            {/* Быстрые статы */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-8">
              <div className="text-center p-4 bg-card rounded-lg">
                <div className="text-sm text-muted-foreground">За клик</div>
                <div className="text-xl font-bold text-green-500">
                  +{formatMoney(getClickValue())}
                </div>
              </div>
              <div className="text-center p-4 bg-card rounded-lg">
                <div className="text-sm text-muted-foreground">В секунду</div>
                <div className="text-xl font-bold text-blue-500">
                  +{formatMoney(getPassiveIncome())}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Магазин */}
        {activeTab === 'shop' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <BordurShop
              gameState={gameState}
              onBuyBordur={buyBordur}
              onBuyAutoClicker={buyAutoClicker}
            />
          </motion.div>
        )}
        
        {/* Достижения (часть профиля) */}
        {activeTab === 'achievements' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <GameProfile gameState={gameState} onReset={resetGame} />
          </motion.div>
        )}
        
        {/* Профиль */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <GameProfile gameState={gameState} onReset={resetGame} />
          </motion.div>
        )}
      </div>
      
      {/* Нижняя навигация */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}