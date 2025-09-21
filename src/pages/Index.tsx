import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useTelegram } from '@/hooks/useTelegram';

import { GameState, Curb, Contractor, CurbConfig, Upgrade } from '@/types/game';
import { contractors } from '@/data/contractors';
import { upgrades } from '@/data/upgrades';
import { generateDefects } from '@/utils/gameUtils';

import { GameHeader } from '@/components/game/GameHeader';
import { GameTitle } from '@/components/game/GameTitle';
import { Notifications } from '@/components/game/Notifications';
import { Tutorial } from '@/components/game/Tutorial';
import { GameGrid } from '@/components/game/GameGrid';
import { CurbDialog } from '@/components/game/CurbDialog';
import { ContractorDialog } from '@/components/game/ContractorDialog';
import { CurbConstructorDialog } from '@/components/game/CurbConstructorDialog';
import { GameStatistics } from '@/components/game/GameStatistics';
import { ClickerButton } from '@/components/game/ClickerButton';
import { UpgradeShop } from '@/components/game/UpgradeShop';

const CurbMania = () => {
  const { user, isTelegramWebApp, hapticFeedback, showAlert, shareToChat } = useTelegram();
  
  const [gameState, setGameState] = useState<GameState>({
    budget: 10000000,
    daysUntilElection: 365,
    reputation: 75,
    corruption: 0,
    clickPower: 10,
    autoClickRate: 0,
    totalClicks: 0,
    premiumCurrency: 0
  });

  const [curbs, setCurbs] = useState<Curb[]>([
    { id: 1, type: 'concrete', condition: 'old', material: 'Бетонный', price: 1000 },
    { id: 2, type: 'granite', condition: 'good', material: 'Гранитный', price: 4000 },
    { id: 3, type: 'marble', condition: 'new', material: 'Мраморный', price: 6000 },
    { id: 4, type: 'plastic', condition: 'critical', material: 'Пластиковый', price: 500 },
    { id: 5, type: 'concrete', condition: 'old', material: 'Бетонный', price: 1000 },
    { id: 6, type: 'gold', condition: 'new', material: 'Золотой', price: 21000 },
    { id: 7, type: 'granite', condition: 'good', material: 'Гранитный', price: 4000 },
    { id: 8, type: 'concrete', condition: 'critical', material: 'Бетонный', price: 1000 },
    { id: 9, type: 'marble', condition: 'old', material: 'Мраморный', price: 6000 }
  ]);

  const [selectedCurb, setSelectedCurb] = useState<Curb | null>(null);
  const [isSearchingDefects, setIsSearchingDefects] = useState(false);
  const [foundDefects, setFoundDefects] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const [showContractorDialog, setShowContractorDialog] = useState(false);
  const [showCurbConstructor, setShowCurbConstructor] = useState(false);
  const [curbConfig, setCurbConfig] = useState<CurbConfig>({
    material: 'concrete',
    basePrice: 1000,
    extras: {}
  });
  const [playerUpgrades, setPlayerUpgrades] = useState<Upgrade[]>(
    upgrades.map(u => ({ ...u, currentLevel: 0 }))
  );
  const [showUpgradeShop, setShowUpgradeShop] = useState(false);

  const searchForDefects = () => {
    setIsSearchingDefects(true);
    hapticFeedback();
    
    setTimeout(() => {
      const defects = generateDefects();
      setFoundDefects(defects);
      setIsSearchingDefects(false);
      addNotification(`🔍 Найдено дефектов: ${defects.length}`);
      hapticFeedback();
    }, 2000);
  };

  const replaceCurb = (newMaterial: string, newPrice: number, newType: string) => {
    if (selectedCurb && selectedContractor && gameState.budget >= newPrice) {
      const baseKickback = Math.floor(newPrice * 0.25);
      const contractorKickback = Math.floor(baseKickback * selectedContractor.corruptionModifier);
      const modifiedPrice = Math.floor(newPrice * selectedContractor.costModifier);
      const actualCost = modifiedPrice - contractorKickback;
      
      setCurbs(prev => prev.map(curb => 
        curb.id === selectedCurb.id 
          ? { ...curb, condition: 'new', material: newMaterial, price: modifiedPrice, type: newType }
          : curb
      ));
      
      setGameState(prev => ({
        ...prev,
        budget: prev.budget - actualCost,
        reputation: Math.min(100, prev.reputation + (foundDefects.length * 2) + Math.floor(selectedContractor.qualityModifier * 5)),
        corruption: prev.corruption + contractorKickback
      }));
      
      setTotalSpent(prev => prev + actualCost);
      
      addNotification(`🎉 ${selectedContractor.name} заменил ${selectedCurb.material} на ${newMaterial}! Откат: ${contractorKickback.toLocaleString()}₽`);
      
      setSelectedCurb(null);
      setSelectedContractor(null);
      setFoundDefects([]);
      setShowContractorDialog(false);
      setShowCurbConstructor(false);
    }
  };

  const calculateFinalPrice = () => {
    if (!selectedContractor) return curbConfig.basePrice;
    
    let finalPrice = curbConfig.basePrice;
    
    if (curbConfig.extras.lighting) finalPrice += 2000;
    if (curbConfig.extras.antiVandal) finalPrice += 1500;
    if (curbConfig.extras.heating) finalPrice += 3000;
    if (curbConfig.extras.customColor) finalPrice += 500;
    
    return Math.floor(finalPrice * selectedContractor.costModifier);
  };

  const addNotification = (message: string) => {
    setNotifications(prev => [message, ...prev.slice(0, 2)]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(0, -1));
    }, 5000);
  };

  const handleReplaceCurb = () => {
    const materialName = ['concrete', 'granite', 'marble', 'plastic', 'gold'][['concrete', 'granite', 'marble', 'plastic', 'gold'].indexOf(curbConfig.material)];
    const materialDisplay = ['Бетонный', 'Гранитный', 'Мраморный', 'Пластиковый', 'Золотой'][['concrete', 'granite', 'marble', 'plastic', 'gold'].indexOf(curbConfig.material)];
    
    let extrasText = '';
    if (curbConfig.extras.lighting) extrasText += ' с подсветкой';
    if (curbConfig.extras.antiVandal) extrasText += ' антивандальный';
    if (curbConfig.extras.heating) extrasText += ' с подогревом';
    if (curbConfig.extras.customColor) extrasText += ' кастомный';
    
    replaceCurb(
      materialDisplay + extrasText,
      calculateFinalPrice(),
      materialName || 'concrete'
    );
  };

  // Кликер функции
  const handleClick = () => {
    hapticFeedback();
    const multiplier = getMultiplier();
    const income = gameState.clickPower * multiplier;
    
    setGameState(prev => ({
      ...prev,
      corruption: prev.corruption + income,
      totalClicks: prev.totalClicks + 1
    }));
    
    addNotification(`💰 +${income.toLocaleString()}₽`);
  };

  const getMultiplier = () => {
    return playerUpgrades
      .filter(u => u.effect.type === 'multiplier' && u.currentLevel > 0)
      .reduce((acc, u) => acc * Math.pow(u.effect.value, u.currentLevel), 1);
  };

  const buyUpgrade = (upgradeId: string) => {
    const upgrade = playerUpgrades.find(u => u.id === upgradeId);
    if (!upgrade) return;

    const canAfford = upgrade.costType === 'corruption' 
      ? gameState.corruption >= upgrade.cost 
      : gameState.premiumCurrency >= upgrade.cost;

    if (!canAfford || (upgrade.maxLevel && upgrade.currentLevel >= upgrade.maxLevel)) {
      return;
    }

    hapticFeedback();

    // Обновляем состояние игры
    setGameState(prev => ({
      ...prev,
      corruption: upgrade.costType === 'corruption' 
        ? prev.corruption - upgrade.cost 
        : prev.corruption,
      premiumCurrency: upgrade.costType === 'premium' 
        ? prev.premiumCurrency - upgrade.cost 
        : prev.premiumCurrency,
      clickPower: upgrade.effect.type === 'clickPower' 
        ? prev.clickPower + upgrade.effect.value 
        : prev.clickPower,
      autoClickRate: upgrade.effect.type === 'autoClick' 
        ? prev.autoClickRate + upgrade.effect.value 
        : prev.autoClickRate
    }));

    // Обновляем улучшения
    setPlayerUpgrades(prev => 
      prev.map(u => 
        u.id === upgradeId 
          ? { ...u, currentLevel: u.currentLevel + 1, cost: Math.floor(u.cost * 1.5) }
          : u
      )
    );

    addNotification(`✅ Куплено: ${upgrade.name}!`);
  };

  const buyPremium = () => {
    if (isTelegramWebApp) {
      // Интеграция с Telegram Stars
      window.Telegram?.WebApp.showAlert(
        'Покупка звезд пока недоступна в демо-версии. В полной версии здесь будет интеграция с Telegram Stars!'
      );
    } else {
      // Для демо - даем бесплатно
      setGameState(prev => ({
        ...prev,
        premiumCurrency: prev.premiumCurrency + 100
      }));
      addNotification('🎁 Получено 100 звезд (демо режим)!');
    }
  };

  // Автокликер
  useEffect(() => {
    if (gameState.autoClickRate > 0) {
      const autoClicker = setInterval(() => {
        const multiplier = getMultiplier();
        const income = gameState.autoClickRate * multiplier;
        
        setGameState(prev => ({
          ...prev,
          corruption: prev.corruption + income
        }));
      }, 1000);

      return () => clearInterval(autoClicker);
    }
  }, [gameState.autoClickRate, playerUpgrades]);

  useEffect(() => {
    const timer = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        daysUntilElection: Math.max(0, prev.daysUntilElection - 1)
      }));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-muted to-background text-foreground font-['Rubik'] ${isTelegramWebApp ? 'telegram-webapp' : ''}`}>
      <GameHeader gameState={gameState} />
      
      <Notifications notifications={notifications} />
      
      <Tutorial 
        showTutorial={showTutorial}
        onClose={() => setShowTutorial(false)}
      />

      <GameTitle />

      <div className="max-w-4xl mx-auto px-2 sm:px-4">
        {/* Кликер секция */}
        <ClickerButton 
          onClick={handleClick}
          clickPower={gameState.clickPower * getMultiplier()}
        />

        <GameGrid 
          curbs={curbs}
          onSelectCurb={setSelectedCurb}
        />

        <Dialog>
          <CurbDialog
            selectedCurb={selectedCurb}
            isSearchingDefects={isSearchingDefects}
            foundDefects={foundDefects}
            onSearchDefects={searchForDefects}
            onShowContractorDialog={() => setShowContractorDialog(true)}
          />
        </Dialog>

        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 px-2">
          <Button className="game-button" onClick={() => setShowUpgradeShop(true)}>
            <Icon name="ShoppingCart" className="mr-2" />
            Магазин улучшений
          </Button>
          <Button className="game-button" onClick={() => setShowCurbConstructor(true)}>
            <Icon name="Settings" className="mr-2" />
            Конструктор бордюров
          </Button>
          <Button className="game-button" onClick={() => addNotification('🏆 Система достижений готовится!')}>
            <Icon name="Trophy" className="mr-2" />
            Достижения
          </Button>
          {isTelegramWebApp && user && (
            <Button 
              className="game-button" 
              onClick={() => {
                const score = gameState.corruption + (gameState.reputation * 100);
                shareToChat(
                  window.location.href,
                  `🏆 Мой результат в "Бордюр Мания 2025": ${score.toLocaleString()} очков! Откатов: ${gameState.corruption.toLocaleString()}₽`
                );
              }}
            >
              <Icon name="Share" className="mr-2" />
              Поделиться
            </Button>
          )}
        </div>

        <GameStatistics 
          totalSpent={totalSpent}
          corruption={gameState.corruption}
          curbs={curbs}
        />
      </div>

      <ContractorDialog
        showContractorDialog={showContractorDialog}
        onClose={() => setShowContractorDialog(false)}
        contractors={contractors}
        selectedContractor={selectedContractor}
        onSelectContractor={setSelectedContractor}
        onShowCurbConstructor={() => setShowCurbConstructor(true)}
      />

      <CurbConstructorDialog
        showCurbConstructor={showCurbConstructor}
        onClose={() => setShowCurbConstructor(false)}
        selectedContractor={selectedContractor}
        curbConfig={curbConfig}
        setCurbConfig={setCurbConfig}
        calculateFinalPrice={calculateFinalPrice}
        onReplaceCurb={handleReplaceCurb}
        budget={gameState.budget}
      />

      <UpgradeShop
        showUpgradeShop={showUpgradeShop}
        onClose={() => setShowUpgradeShop(false)}
        upgrades={playerUpgrades}
        corruption={gameState.corruption}
        premiumCurrency={gameState.premiumCurrency}
        onBuyUpgrade={buyUpgrade}
        onBuyPremium={buyPremium}
      />
    </div>
  );
};

export default CurbMania;