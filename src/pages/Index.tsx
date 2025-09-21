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

interface Contractor {
  id: string;
  name: string;
  description: string;
  costModifier: number; // 0.8 = 20% дешевле, 1.2 = 20% дороже
  timeModifier: number; // 0.5 = в 2 раза быстрее, 2.0 = в 2 раза дольше
  qualityModifier: number; // 0.8 = хуже качество, 1.2 = лучше качество
  corruptionModifier: number; // дополнительные откаты
  speciality?: string; // специализация
  icon: string;
  reputation: number; // от 1 до 5 звезд
}

interface CurbConfig {
  material: string;
  basePrice: number;
  extras: {
    lighting?: boolean;
    antiVandal?: boolean;
    heating?: boolean;
    customColor?: string;
  };
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
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const [showContractorDialog, setShowContractorDialog] = useState(false);
  const [showCurbConstructor, setShowCurbConstructor] = useState(false);
  const [curbConfig, setCurbConfig] = useState<CurbConfig>({
    material: 'concrete',
    basePrice: 1000,
    extras: {}
  });

  const contractors: Contractor[] = [
    {
      id: 'rogatie',
      name: '🛞 Рогатые шины',
      description: 'Быстро, дёшево, но качество... ну вы поняли',
      costModifier: 0.7,
      timeModifier: 0.5,
      qualityModifier: 0.6,
      corruptionModifier: 0.1,
      speciality: 'Скорость',
      icon: '🛞',
      reputation: 2
    },
    {
      id: 'elitstroy',
      name: '🏛️ ЭлитСтрой',
      description: 'Премиум качество за премиум цену',
      costModifier: 1.5,
      timeModifier: 1.8,
      qualityModifier: 1.4,
      corruptionModifier: 0.05,
      speciality: 'Качество',
      icon: '🏛️',
      reputation: 5
    },
    {
      id: 'uncle-vanya',
      name: '👷 Дядя Ваня ЧОП',
      description: 'Надёжно, по-русски, без понтов',
      costModifier: 1.0,
      timeModifier: 1.0,
      qualityModifier: 1.0,
      corruptionModifier: 0.25,
      speciality: 'Надёжность',
      icon: '👷',
      reputation: 3
    },
    {
      id: 'mega-stroy',
      name: '🏗️ МегаСтрой',
      description: 'Большие объёмы, хорошие откаты',
      costModifier: 0.9,
      timeModifier: 0.8,
      qualityModifier: 0.9,
      corruptionModifier: 0.4,
      speciality: 'Откаты',
      icon: '🏗️',
      reputation: 3
    }
  ];

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
    }
  };

  const calculateFinalPrice = () => {
    if (!selectedContractor) return curbConfig.basePrice;
    
    let finalPrice = curbConfig.basePrice;
    
    // Добавляем стоимость дополнений
    if (curbConfig.extras.lighting) finalPrice += 2000;
    if (curbConfig.extras.antiVandal) finalPrice += 1500;
    if (curbConfig.extras.heating) finalPrice += 3000;
    if (curbConfig.extras.customColor) finalPrice += 500;
    
    // Применяем модификатор подрядчика
    return Math.floor(finalPrice * selectedContractor.costModifier);
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
      <div className="resource-glow mx-4 mt-4 rounded-xl p-4">
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
        <h1 className="text-6xl font-bold font-['Oswald'] holographic text-transparent bg-clip-text mb-2 neon-glow animate-pulse">
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
        <div className="grid grid-cols-3 gap-4 mb-8 game-grid">
          {curbs.map((curb) => (
            <Dialog key={curb.id}>
              <DialogTrigger asChild>
                <div className="curb-item" onClick={() => setSelectedCurb(curb)}>
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

                    <Button 
                      className="game-button w-full"
                      onClick={() => setShowContractorDialog(true)}
                      disabled={!foundDefects.length}
                    >
                      <Icon name="Users" className="mr-2" />
                      Выбрать подрядчика
                    </Button>
                    
                    {!foundDefects.length && (
                      <p className="text-sm text-muted-foreground text-center">
                        Сначала найдите дефекты для обоснования замены
                      </p>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <Button className="game-button" onClick={() => setShowCurbConstructor(true)}>
            <Icon name="Settings" className="mr-2" />
            Конструктор бордюров
          </Button>
          <Button className="game-button" onClick={() => addNotification('🏆 Система достижений готовится!')}>
            <Icon name="Trophy" className="mr-2" />
            Достижения
          </Button>
        </div>

        {/* Statistics */}
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
        </div>
      </div>

      {/* Contractor Selection Dialog */}
      <Dialog open={showContractorDialog} onOpenChange={setShowContractorDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="Users" />
              Выбор подрядчика
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Выберите подрядчика для замены бордюра. Каждый влияет на цену, качество и откаты.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contractors.map((contractor) => (
                <div
                  key={contractor.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary ${
                    selectedContractor?.id === contractor.id ? 'border-primary bg-primary/10' : 'border-border'
                  }`}
                  onClick={() => setSelectedContractor(contractor)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{contractor.icon}</span>
                    <div>
                      <h3 className="font-semibold">{contractor.name}</h3>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} className={i < contractor.reputation ? 'text-yellow-500' : 'text-gray-300'}>
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{contractor.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="font-semibold">Стоимость:</span>
                      <span className={contractor.costModifier < 1 ? 'text-green-500' : contractor.costModifier > 1 ? 'text-red-500' : 'text-gray-400'}>
                        {contractor.costModifier < 1 ? ' ↓' : contractor.costModifier > 1 ? ' ↑' : ' ='}
                        {Math.abs(1 - contractor.costModifier) * 100}%
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">Качество:</span>
                      <span className={contractor.qualityModifier > 1 ? 'text-green-500' : contractor.qualityModifier < 1 ? 'text-red-500' : 'text-gray-400'}>
                        {contractor.qualityModifier > 1 ? ' ↑' : contractor.qualityModifier < 1 ? ' ↓' : ' ='}
                        {Math.abs(1 - contractor.qualityModifier) * 100}%
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">Откаты:</span>
                      <span className={contractor.corruptionModifier > 0.3 ? 'text-green-500' : 'text-yellow-500'}>
                        {(contractor.corruptionModifier * 100)}%
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">Скорость:</span>
                      <span className={contractor.timeModifier < 1 ? 'text-green-500' : contractor.timeModifier > 1 ? 'text-red-500' : 'text-gray-400'}>
                        {contractor.timeModifier < 1 ? ' ↑' : contractor.timeModifier > 1 ? ' ↓' : ' ='}
                        {Math.abs(1 - contractor.timeModifier) * 100}%
                      </span>
                    </div>
                  </div>
                  
                  {contractor.speciality && (
                    <Badge className="mt-2" variant="secondary">
                      💎 {contractor.speciality}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            
            {selectedContractor && (
              <div className="border-t pt-4">
                <Button 
                  className="w-full game-button"
                  onClick={() => setShowCurbConstructor(true)}
                >
                  <Icon name="ArrowRight" className="mr-2" />
                  Далее: выбор материала и опций
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Curb Constructor Dialog */}
      <Dialog open={showCurbConstructor} onOpenChange={setShowCurbConstructor}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="Settings" />
              Конструктор бордюров
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {selectedContractor && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                <p className="text-sm">
                  <strong>Выбранный подрядчик:</strong> {selectedContractor.name}
                </p>
              </div>
            )}
            
            {/* Material Selection */}
            <div>
              <h3 className="font-semibold mb-3">Выбор материала</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { id: 'concrete', name: 'Бетон', price: 1000, emoji: '🧱' },
                  { id: 'granite', name: 'Гранит', price: 15000, emoji: '🗿' },
                  { id: 'marble', name: 'Мрамор', price: 25000, emoji: '⚪' },
                  { id: 'plastic', name: 'Пластик', price: 500, emoji: '🟡' },
                  { id: 'gold', name: 'Золото', price: 50000, emoji: '🏆' }
                ].map((material) => (
                  <div
                    key={material.id}
                    className={`p-3 border rounded-lg cursor-pointer text-center transition-all hover:border-primary ${
                      curbConfig.material === material.id ? 'border-primary bg-primary/10' : 'border-border'
                    }`}
                    onClick={() => setCurbConfig(prev => ({ ...prev, material: material.id, basePrice: material.price }))}
                  >
                    <div className="text-2xl mb-1">{material.emoji}</div>
                    <div className="font-semibold text-sm">{material.name}</div>
                    <div className="text-xs text-muted-foreground">{material.price.toLocaleString()}₽</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Extras */}
            <div>
              <h3 className="font-semibold mb-3">Дополнительные опции</h3>
              <div className="space-y-3">
                {[
                  { id: 'lighting', name: 'LED подсветка', price: 2000, emoji: '💡' },
                  { id: 'antiVandal', name: 'Антивандальное покрытие', price: 1500, emoji: '🛡️' },
                  { id: 'heating', name: 'Подогрев зимой', price: 3000, emoji: '🔥' }
                ].map((extra) => (
                  <label key={extra.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-primary">
                    <input
                      type="checkbox"
                      checked={!!curbConfig.extras[extra.id as keyof typeof curbConfig.extras]}
                      onChange={(e) => setCurbConfig(prev => ({
                        ...prev,
                        extras: { ...prev.extras, [extra.id]: e.target.checked }
                      }))}
                      className="w-4 h-4"
                    />
                    <span className="text-xl">{extra.emoji}</span>
                    <div className="flex-1">
                      <div className="font-semibold">{extra.name}</div>
                      <div className="text-sm text-muted-foreground">+{extra.price.toLocaleString()}₽</div>
                    </div>
                  </label>
                ))}
                
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-primary">
                  <input
                    type="checkbox"
                    checked={!!curbConfig.extras.customColor}
                    onChange={(e) => setCurbConfig(prev => ({
                      ...prev,
                      extras: { ...prev.extras, customColor: e.target.checked ? '#ff0000' : undefined }
                    }))}
                    className="w-4 h-4"
                  />
                  <span className="text-xl">🎨</span>
                  <div className="flex-1">
                    <div className="font-semibold">Кастомный цвет</div>
                    <div className="text-sm text-muted-foreground">+500₽</div>
                  </div>
                  {curbConfig.extras.customColor && (
                    <input
                      type="color"
                      value={curbConfig.extras.customColor}
                      onChange={(e) => setCurbConfig(prev => ({
                        ...prev,
                        extras: { ...prev.extras, customColor: e.target.value }
                      }))}
                      className="w-8 h-8 rounded border"
                    />
                  )}
                </label>
              </div>
            </div>
            
            {/* Price Summary */}
            {selectedContractor && (
              <div className="border-t pt-4 space-y-3">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Базовая стоимость:</div>
                    <div className="text-right">{curbConfig.basePrice.toLocaleString()}₽</div>
                    
                    {curbConfig.extras.lighting && (
                      <>
                        <div>+ LED подсветка:</div>
                        <div className="text-right">+2,000₽</div>
                      </>
                    )}
                    
                    {curbConfig.extras.antiVandal && (
                      <>
                        <div>+ Антивандальное покрытие:</div>
                        <div className="text-right">+1,500₽</div>
                      </>
                    )}
                    
                    {curbConfig.extras.heating && (
                      <>
                        <div>+ Подогрев:</div>
                        <div className="text-right">+3,000₽</div>
                      </>
                    )}
                    
                    {curbConfig.extras.customColor && (
                      <>
                        <div>+ Кастомный цвет:</div>
                        <div className="text-right">+500₽</div>
                      </>
                    )}
                    
                    <div className="border-t pt-2 font-semibold">
                      Модификатор {selectedContractor.name}:
                    </div>
                    <div className="border-t pt-2 text-right font-semibold">
                      ×{selectedContractor.costModifier}
                    </div>
                    
                    <div className="text-lg font-bold">Итого:</div>
                    <div className="text-lg font-bold text-right">
                      {calculateFinalPrice().toLocaleString()}₽
                    </div>
                    
                    <div className="text-sm text-muted-foreground">Откат:</div>
                    <div className="text-sm text-right text-green-500">
                      +{Math.floor(calculateFinalPrice() * 0.25 * selectedContractor.corruptionModifier).toLocaleString()}₽
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full game-button"
                  onClick={() => {
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
                  }}
                  disabled={!selectedContractor || gameState.budget < calculateFinalPrice()}
                >
                  <Icon name="CheckCircle" className="mr-2" />
                  Заказать бордюр
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CurbMania;