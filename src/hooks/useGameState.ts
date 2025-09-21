import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState } from '@/types/game.types';
import { DEFAULT_GAME_STATE, AUTO_CLICKERS, getClickPower, getLevelRequirement } from '@/constants/gameConfig';
import { useTelegram } from '@/hooks/useTelegram';

// Генерация контрольной суммы для защиты от взлома
const generateChecksum = (data: GameState): string => {
  const important = `${data.money}_${data.level}_${data.totalEarned}_${data.stats.totalClicks}`;
  let hash = 0;
  for (let i = 0; i < important.length; i++) {
    const char = important.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

// Валидация данных при загрузке
const validateGameState = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false;
  if (data.money < 0 || data.level < 1) return false;
  if (!data.checksum || !data.timestamp) return false;
  
  const expectedChecksum = generateChecksum(data);
  if (data.checksum !== expectedChecksum) return false;
  
  // Проверка на слишком быстрый прогресс
  const timeDiff = Date.now() - data.timestamp;
  const moneyRate = data.totalEarned / (timeDiff / 1000);
  if (moneyRate > 1000000) return false; // Больше 1M в секунду = читы
  
  return true;
};

export const useGameState = () => {
  const { user } = useTelegram();
  const [gameState, setGameState] = useState<GameState>(DEFAULT_GAME_STATE);
  const [clicksThisSecond, setClicksThisSecond] = useState(0);
  const clickTimerRef = useRef<NodeJS.Timeout>();
  const autoSaveRef = useRef<NodeJS.Timeout>();
  
  const storageKey = `bordur_game_${user?.id || 'guest'}`;
  
  // Загрузка игры при старте
  useEffect(() => {
    const loadGame = () => {
      try {
        const saved = localStorage.getItem(storageKey);
        if (!saved) return;
        
        const decoded = JSON.parse(atob(saved));
        if (validateGameState(decoded)) {
          // Вычисляем офлайн прогресс (автокликеры)
          const offlineTime = Math.min(Date.now() - decoded.timestamp, 3600000); // Макс 1 час
          const offlineEarnings = calculateOfflineEarnings(decoded, offlineTime / 1000);
          
          setGameState({
            ...decoded,
            money: decoded.money + offlineEarnings,
            totalEarned: decoded.totalEarned + offlineEarnings,
            activeBonus: null // Сбрасываем временные бонусы
          });
          
          if (offlineEarnings > 0) {
            // Показать уведомление об офлайн доходе
            window.Telegram?.WebApp.showPopup({
              title: 'С возвращением!',
              message: `Пока тебя не было, ты заработал ${formatMoney(offlineEarnings)}!`,
              buttons: [{ text: 'Отлично!' }]
            });
          }
        }
      } catch (e) {
        console.error('Failed to load game:', e);
      }
    };
    
    loadGame();
  }, [storageKey]);
  
  // Автосохранение каждые 10 секунд
  useEffect(() => {
    const saveGame = () => {
      const dataToSave = {
        ...gameState,
        checksum: generateChecksum(gameState),
        timestamp: Date.now()
      };
      
      const encoded = btoa(JSON.stringify(dataToSave));
      localStorage.setItem(storageKey, encoded);
    };
    
    autoSaveRef.current = setInterval(saveGame, 10000);
    
    return () => {
      if (autoSaveRef.current) clearInterval(autoSaveRef.current);
      saveGame(); // Сохранить при выходе
    };
  }, [gameState, storageKey]);
  
  // Сброс счётчика кликов каждую секунду
  useEffect(() => {
    clickTimerRef.current = setInterval(() => {
      setClicksThisSecond(0);
    }, 1000);
    
    return () => {
      if (clickTimerRef.current) clearInterval(clickTimerRef.current);
    };
  }, []);
  
  // Автокликеры (пассивный доход)
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        const income = calculateAutoIncome(prev);
        if (income === 0) return prev;
        
        return {
          ...prev,
          money: prev.money + income,
          totalEarned: prev.totalEarned + income
        };
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Обработчик клика по бордюру
  const handleClick = useCallback(() => {
    // Защита от автокликеров (макс 20 кликов в секунду)
    if (clicksThisSecond >= 20) {
      window.Telegram?.WebApp.HapticFeedback.notificationOccurred('error');
      return;
    }
    
    setClicksThisSecond(prev => prev + 1);
    
    setGameState(prev => {
      const clickValue = calculateClickValue(prev);
      const newMoney = prev.money + clickValue;
      const newTotalEarned = prev.totalEarned + clickValue;
      const newTotalClicks = prev.stats.totalClicks + 1;
      
      // Проверка уровня
      let newLevel = prev.level;
      let newExperience = prev.experience + clickValue;
      const requirement = getLevelRequirement(newLevel);
      
      if (newExperience >= requirement) {
        newLevel++;
        newExperience = newExperience - requirement;
        
        // Уведомление о новом уровне
        window.Telegram?.WebApp.HapticFeedback.notificationOccurred('success');
        window.Telegram?.WebApp.showPopup({
          title: 'Новый уровень!',
          message: `Поздравляем! Ты достиг ${newLevel} уровня!`,
          buttons: [{ text: 'Круто!' }]
        });
      }
      
      // Обновление максимальной скорости кликов
      const maxCPS = Math.max(prev.stats.maxClicksPerSecond, clicksThisSecond + 1);
      
      return {
        ...prev,
        money: newMoney,
        totalEarned: newTotalEarned,
        level: newLevel,
        experience: newExperience,
        clickPower: getClickPower(newLevel),
        stats: {
          ...prev.stats,
          totalClicks: newTotalClicks,
          maxClicksPerSecond: maxCPS
        }
      };
    });
    
    // Тактильный отклик
    window.Telegram?.WebApp.HapticFeedback.impactOccurred('light');
  }, [clicksThisSecond]);
  
  // Покупка бордюра
  const buyBordur = useCallback((bordurId: string) => {
    setGameState(prev => {
      const bordur = prev.bordurs[bordurId];
      if (!bordur || prev.money < bordur.currentPrice) {
        window.Telegram?.WebApp.HapticFeedback.notificationOccurred('error');
        return prev;
      }
      
      const newPrice = Math.floor(bordur.currentPrice * 1.1); // +10% и т.д.
      
      window.Telegram?.WebApp.HapticFeedback.notificationOccurred('success');
      
      return {
        ...prev,
        money: prev.money - bordur.currentPrice,
        bordurs: {
          ...prev.bordurs,
          [bordurId]: {
            owned: true,
            purchases: bordur.purchases + 1,
            currentPrice: newPrice
          }
        },
        stats: {
          ...prev.stats,
          totalBordurs: prev.stats.totalBordurs + 1
        }
      };
    });
  }, []);
  
  // Покупка автокликера
  const buyAutoClicker = useCallback((clickerId: string) => {
    setGameState(prev => {
      const clicker = prev.autoClickers[clickerId];
      if (!clicker || prev.money < clicker.currentPrice) {
        window.Telegram?.WebApp.HapticFeedback.notificationOccurred('error');
        return prev;
      }
      
      const newPrice = Math.floor(clicker.currentPrice * 1.5); // +50% за каждый
      
      window.Telegram?.WebApp.HapticFeedback.notificationOccurred('success');
      
      return {
        ...prev,
        money: prev.money - clicker.currentPrice,
        autoClickers: {
          ...prev.autoClickers,
          [clickerId]: {
            owned: clicker.owned + 1,
            currentPrice: newPrice
          }
        }
      };
    });
  }, []);
  
  // Активация бонуса
  const activateBonus = useCallback((type: 'double' | 'megaclick' | 'goldenhour') => {
    setGameState(prev => ({
      ...prev,
      activeBonus: {
        type,
        endTime: Date.now() + (type === 'goldenhour' ? 3600000 : type === 'double' ? 30000 : 10000)
      }
    }));
    
    window.Telegram?.WebApp.HapticFeedback.notificationOccurred('success');
  }, []);
  
  // Сброс игры (для тестирования)
  const resetGame = useCallback(() => {
    localStorage.removeItem(storageKey);
    setGameState(DEFAULT_GAME_STATE);
    window.location.reload();
  }, [storageKey]);
  
  return {
    gameState,
    handleClick,
    buyBordur,
    buyAutoClicker,
    activateBonus,
    resetGame
  };
};

// Вспомогательные функции
const calculateClickValue = (state: GameState): number => {
  let value = state.clickPower;
  
  // Применяем множитель от текущего бордюра
  const activeBordur = Object.entries(state.bordurs)
    .filter(([_, b]) => b.owned)
    .sort((a, b) => b[1].purchases - a[1].purchases)[0];
  
  if (activeBordur) {
    const bordurType = AUTO_CLICKERS.find(b => b.id === activeBordur[0]);
    if (bordurType) value *= bordurType.income;
  }
  
  // Применяем активный бонус
  if (state.activeBonus && state.activeBonus.endTime > Date.now()) {
    if (state.activeBonus.type === 'megaclick') value *= 10;
    if (state.activeBonus.type === 'double') value *= 2;
    if (state.activeBonus.type === 'goldenhour') value *= 5;
  }
  
  return Math.floor(value);
};

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
  
  // Применяем бонусы
  if (state.activeBonus && state.activeBonus.endTime > Date.now()) {
    if (state.activeBonus.type === 'goldenhour') income *= 5;
    if (state.activeBonus.type === 'double') income *= 2;
  }
  
  return income;
};

const calculateOfflineEarnings = (state: GameState, seconds: number): number => {
  let income = 0;
  
  Object.entries(state.autoClickers).forEach(([id, data]) => {
    if (data.owned > 0) {
      const clicker = AUTO_CLICKERS.find(c => c.id === id);
      if (clicker) {
        income += clicker.income * data.owned * seconds;
      }
    }
  });
  
  return Math.floor(income);
};

export const formatMoney = (amount: number): string => {
  if (amount >= 1e9) return `${(amount / 1e9).toFixed(1)}B₽`;
  if (amount >= 1e6) return `${(amount / 1e6).toFixed(1)}M₽`;
  if (amount >= 1e3) return `${(amount / 1e3).toFixed(1)}K₽`;
  return `${amount}₽`;
};