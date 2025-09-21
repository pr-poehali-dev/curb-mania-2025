import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface GameState {
  budget: number;
  daysUntilElection: number;
  reputation: number;
  corruption: number;
}

interface Curb {
  id: number;
  type: string;
  condition: 'new' | 'good' | 'old' | 'critical';
  material: string;
  price: number;
  defects?: string[];
}

const CurbMania = () => {
  const [gameState, setGameState] = useState<GameState>({
    budget: 10000000,
    daysUntilElection: 365,
    reputation: 75,
    corruption: 0
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

  const defectsList = [
    "Критическая микротрещина",
    "Нарушение ГОСТа 52289-2004",
    "Неправильный цветовой оттенок",
    "Недостаточная прочность бетона",
    "Нарушение технологии установки",
    "Несоответствие европейским стандартам",
    "Потенциальная угроза безопасности",
    "Неэстетичный внешний вид"
  ];

  const getCurbEmoji = (type: string) => {
    switch (type) {
      case 'concrete': return '🧱';
      case 'granite': return '🗿';
      case 'marble': return '⚪';
      case 'plastic': return '🟡';
      case 'gold': return '🏆';
      default: return '🏗️';
    }
  };

  const getCurbGradient = (type: string) => {
    switch (type) {
      case 'concrete': return 'from-gray-600 to-gray-400';
      case 'granite': return 'from-slate-700 to-slate-500';
      case 'marble': return 'from-white to-gray-200';
      case 'plastic': return 'from-yellow-500 to-orange-400';
      case 'gold': return 'from-yellow-500 to-yellow-300';
      default: return 'from-gray-500 to-gray-300';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'old': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'new': return 'Новый';
      case 'good': return 'Хороший';
      case 'old': return 'Старый';
      case 'critical': return 'Аварийный';
      default: return 'Неизвестно';
    }
  };

  const searchForDefects = () => {
    setIsSearchingDefects(true);
    
    setTimeout(() => {
      const randomDefects = defectsList
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 1);
      
      setFoundDefects(randomDefects);
      setIsSearchingDefects(false);
    }, 2000);
  };

  const replaceCurb = (newMaterial: string, newPrice: number, newType: string) => {
    if (selectedCurb && gameState.budget >= newPrice) {
      const kickback = Math.floor(newPrice * 0.25);
      const actualCost = newPrice - kickback;
      
      setCurbs(prev => prev.map(curb => 
        curb.id === selectedCurb.id 
          ? { ...curb, condition: 'new', material: newMaterial, price: newPrice, type: newType }
          : curb
      ));
      
      setGameState(prev => ({
        ...prev,
        budget: prev.budget - actualCost,
        reputation: Math.min(100, prev.reputation + (foundDefects.length * 2)),
        corruption: prev.corruption + kickback
      }));
      
      setTotalSpent(prev => prev + actualCost);
      
      addNotification(`🎉 Заменили ${selectedCurb.material} на ${newMaterial}! Откат: ${kickback.toLocaleString()}₽`);
      
      setSelectedCurb(null);
      setFoundDefects([]);
    }
  };

  const addNotification = (message: string) => {
    setNotifications(prev => [message, ...prev.slice(0, 2)]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(0, -1));
    }, 5000);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background text-foreground font-['Rubik']">
      {/* Header with resources */}
      <div className="resource-panel mx-4 mt-4">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-2">
            <Icon name="Banknote" className="text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Бюджет</p>
              <p className="text-lg font-bold text-primary">
                {gameState.budget.toLocaleString()}₽
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Icon name="Calendar" className="text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">До выборов</p>
              <p className="text-lg font-bold text-accent">
                {gameState.daysUntilElection} дней
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Icon name="Users" className="text-secondary" />
            <div>
              <p className="text-sm text-muted-foreground">Репутация</p>
              <div className="flex items-center gap-2">
                <Progress value={gameState.reputation} className="w-20" />
                <span className="text-lg font-bold text-secondary">
                  {gameState.reputation}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game title */}
      <div className="text-center py-8">
        <h1 className="text-5xl font-bold font-['Oswald'] holographic text-transparent bg-clip-text mb-2">
          БОРДЮР МАНИЯ 2025
        </h1>
        <p className="text-lg text-muted-foreground">
          Симулятор освоения бюджета на благоустройство
        </p>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification, index) => (
            <div key={index} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg animate-fade-in">
              {notification}
            </div>
          ))}
        </div>
      )}

      {/* Tutorial overlay */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <Card className="max-w-md bg-card p-6">
            <h3 className="text-xl font-bold mb-4">👨‍💼 Добро пожаловать в должность!</h3>
            <div className="space-y-3 text-sm">
              <p>🎯 <strong>Цель:</strong> Освоить бюджет, заменив старые бордюры</p>
              <p>💰 <strong>Бюджет:</strong> 10 млн рублей на год</p>
              <p>🔍 <strong>Как играть:</strong></p>
              <ul className="list-disc ml-4 space-y-1">
                <li>Кликайте на бордюры для проверки</li>
                <li>Ищите дефекты для оправдания замены</li>
                <li>Выбирайте дорогие материалы для больших откатов</li>
                <li>Следите за репутацией и сроками выборов</li>
              </ul>
            </div>
            <Button className="w-full mt-4" onClick={() => setShowTutorial(false)}>
              Начать карьеру чиновника! 🚀
            </Button>
          </Card>
        </div>
      )}

      {/* Game field */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {curbs.map((curb) => (
            <Dialog key={curb.id}>
              <DialogTrigger asChild>
                <Card className={`curb-item bg-gradient-to-br ${getCurbGradient(curb.type)}`} onClick={() => setSelectedCurb(curb)}>
                  <div className="text-center">
                    <div className="text-4xl mb-2">{getCurbEmoji(curb.type)}</div>
                    <Badge className={`${getConditionColor(curb.condition)} text-white mb-2`}>
                      {getConditionText(curb.condition)}
                    </Badge>
                    <p className="font-semibold text-sm text-black">{curb.material}</p>
                    <p className="text-xs text-gray-700">
                      {curb.price.toLocaleString()}₽
                    </p>
                  </div>
                </Card>
              </DialogTrigger>
              
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Icon name="Wrench" />
                    Управление бордюром
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-6xl mb-2">{getCurbEmoji(selectedCurb?.type || 'concrete')}</div>
                    <Badge className={`${getConditionColor(selectedCurb?.condition || 'old')} text-white mb-2`}>
                      {getConditionText(selectedCurb?.condition || 'old')}
                    </Badge>
                    <p className="font-semibold">{selectedCurb?.material} бордюр</p>
                    <p className="text-sm text-muted-foreground">Текущая стоимость: {selectedCurb?.price.toLocaleString()}₽</p>
                  </div>

                  <div className="space-y-2">
                    <Button 
                      className="game-button w-full"
                      onClick={searchForDefects}
                      disabled={isSearchingDefects}
                    >
                      <Icon name="Search" className="mr-2" />
                      {isSearchingDefects ? 'Ищем дефекты...' : 'Найти дефект'}
                    </Button>
                    
                    {foundDefects.length > 0 && (
                      <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-3">
                        <p className="font-semibold text-red-400 mb-2">
                          🚨 Обнаружены критические проблемы:
                        </p>
                        {foundDefects.map((defect, index) => (
                          <p key={index} className="text-sm text-red-300">
                            • {defect}
                          </p>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-2">
                      <Button 
                        className="game-button w-full bg-gradient-to-r from-slate-600 to-slate-400"
                        onClick={() => replaceCurb('Премиум гранитный', 15000, 'granite')}
                        disabled={gameState.budget < 15000}
                      >
                        <Icon name="Hammer" className="mr-2" />
                        🗿 Гранит (15,000₽) | Откат: 3,750₽
                      </Button>
                      
                      <Button 
                        className="game-button w-full bg-gradient-to-r from-white to-gray-200 text-black"
                        onClick={() => replaceCurb('Элитный мраморный', 25000, 'marble')}
                        disabled={gameState.budget < 25000}
                      >
                        <Icon name="Crown" className="mr-2" />
                        ⚪ Мрамор (25,000₽) | Откат: 6,250₽
                      </Button>
                      
                      <Button 
                        className="game-button w-full bg-gradient-to-r from-yellow-500 to-yellow-300 text-black"
                        onClick={() => replaceCurb('Золотой с подогревом', 50000, 'gold')}
                        disabled={gameState.budget < 50000}
                      >
                        <Icon name="Zap" className="mr-2" />
                        🏆 VIP Золото (50,000₽) | Откат: 12,500₽
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <Button className="game-button" onClick={() => addNotification('🔧 Конструктор в разработке!')}>
            <Icon name="Settings" className="mr-2" />
            Конструктор бордюров
          </Button>
          <Button className="game-button" onClick={() => addNotification('👥 Подрядчики скоро будут!')}>
            <Icon name="Users" className="mr-2" />
            Подрядчики
          </Button>
          <Button className="game-button" onClick={() => addNotification('🏆 Система достижений готовится!')}>
            <Icon name="Trophy" className="mr-2" />
            Достижения
          </Button>
        </div>

        {/* Statistics */}
        <Card className="resource-panel">
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
                {gameState.corruption.toLocaleString()}₽
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
        </Card>
      </div>
    </div>
  );
};

export default CurbMania;