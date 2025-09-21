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

  const replaceCurb = (newMaterial: string, newPrice: number) => {
    if (selectedCurb && gameState.budget >= newPrice) {
      const kickback = Math.floor(newPrice * 0.25);
      
      setCurbs(prev => prev.map(curb => 
        curb.id === selectedCurb.id 
          ? { ...curb, condition: 'new', material: newMaterial, price: newPrice }
          : curb
      ));
      
      setGameState(prev => ({
        ...prev,
        budget: prev.budget - newPrice + kickback,
        reputation: Math.min(100, prev.reputation + 5),
        corruption: prev.corruption + kickback
      }));
      
      setSelectedCurb(null);
    }
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

      {/* Game field */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {curbs.map((curb) => (
            <Dialog key={curb.id}>
              <DialogTrigger asChild>
                <Card className="curb-item" onClick={() => setSelectedCurb(curb)}>
                  <div className="text-center">
                    <div className="text-4xl mb-2">🏗️</div>
                    <Badge className={`${getConditionColor(curb.condition)} text-white mb-2`}>
                      {getConditionText(curb.condition)}
                    </Badge>
                    <p className="font-semibold text-sm">{curb.material}</p>
                    <p className="text-xs text-muted-foreground">
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
                    <div className="text-6xl mb-2">🏗️</div>
                    <Badge className={`${getConditionColor(curb.condition)} text-white mb-2`}>
                      {getConditionText(curb.condition)}
                    </Badge>
                    <p className="font-semibold">{curb.material} бордюр</p>
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

                    <Button 
                      className="game-button w-full"
                      onClick={() => replaceCurb('Премиум гранитный', 15000)}
                      disabled={gameState.budget < 15000}
                    >
                      <Icon name="Hammer" className="mr-2" />
                      Заменить (15,000₽)
                    </Button>
                    
                    <Button 
                      className="game-button w-full"
                      onClick={() => replaceCurb('Золотой с подогревом', 50000)}
                      disabled={gameState.budget < 50000}
                    >
                      <Icon name="Crown" className="mr-2" />
                      VIP замена (50,000₽)
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <Button className="game-button">
            <Icon name="Settings" className="mr-2" />
            Конструктор бордюров
          </Button>
          <Button className="game-button">
            <Icon name="Users" className="mr-2" />
            Подрядчики
          </Button>
          <Button className="game-button">
            <Icon name="Trophy" className="mr-2" />
            Достижения
          </Button>
        </div>

        {/* Statistics */}
        <Card className="resource-panel">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <Icon name="TrendingUp" className="mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">Освоено бюджета</p>
              <p className="text-xl font-bold">
                {((10000000 - gameState.budget) / 10000000 * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <Icon name="Coins" className="mx-auto mb-2 text-accent" />
              <p className="text-sm text-muted-foreground">Откаты получено</p>
              <p className="text-xl font-bold">
                {gameState.corruption.toLocaleString()}₽
              </p>
            </div>
            <div>
              <Icon name="Award" className="mx-auto mb-2 text-secondary" />
              <p className="text-sm text-muted-foreground">Бордюров заменено</p>
              <p className="text-xl font-bold">
                {curbs.filter(c => c.condition === 'new').length}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CurbMania;