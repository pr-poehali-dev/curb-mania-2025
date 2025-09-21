import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, TrendingUp, Clock, MousePointer, Share2, RotateCcw } from 'lucide-react';
import { ACHIEVEMENTS, getLevelRequirement } from '@/constants/gameConfig';
import { formatMoney } from '@/hooks/useGameState';
import { GameState } from '@/types/game.types';
import { useTelegram } from '@/hooks/useTelegram';

interface GameProfileProps {
  gameState: GameState;
  onReset: () => void;
}

export const GameProfile: React.FC<GameProfileProps> = ({ gameState, onReset }) => {
  const { user } = useTelegram();
  const [activeTab, setActiveTab] = React.useState<'stats' | 'achievements'>('stats');
  
  // Расчёт прогресса до следующего уровня
  const currentLevelReq = getLevelRequirement(gameState.level);
  const levelProgress = (gameState.experience / currentLevelReq) * 100;
  
  // Форматирование времени игры
  const formatPlayTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}ч ${minutes}м`;
    return `${minutes}м`;
  };
  
  // Поделиться результатами
  const handleShare = () => {
    const message = `🎮 Бордюр Мания 2025\n\n` +
                   `💰 Заработано: ${formatMoney(gameState.totalEarned)}\n` +
                   `📊 Уровень: ${gameState.level}\n` +
                   `🏆 Достижений: ${gameState.achievements.length}/${ACHIEVEMENTS.length}\n\n` +
                   `Играй тоже! 👉 @bordur_mania_bot`;
    
    window.Telegram?.WebApp.openTelegramLink(
      `https://t.me/share/url?url=t.me/bordur_mania_bot&text=${encodeURIComponent(message)}`
    );
  };
  
  // Подсчёт пассивного дохода
  const passiveIncome = Object.entries(gameState.autoClickers).reduce((sum, [id, data]) => {
    const clicker = gameState.autoClickers[id];
    return sum + (clicker.owned * data.owned);
  }, 0);
  
  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-20">
      {/* Профиль игрока */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user?.photo_url} />
                <AvatarFallback>
                  {user?.first_name?.charAt(0) || '👤'}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  {user?.first_name || 'Игрок'} {user?.last_name || ''}
                </CardTitle>
                <CardDescription>
                  @{user?.username || 'anonymous'}
                </CardDescription>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-green-500">
                {formatMoney(gameState.money)}
              </div>
              <div className="text-sm text-gray-500">Баланс</div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Прогресс уровня */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Уровень {gameState.level}</span>
              <span>Уровень {gameState.level + 1}</span>
            </div>
            <Progress value={levelProgress} className="h-3" />
            <div className="text-center text-xs text-gray-500">
              {formatMoney(gameState.experience)} / {formatMoney(currentLevelReq)}
            </div>
          </div>
          
          {/* Кнопки действий */}
          <div className="flex space-x-2 mt-4">
            <Button onClick={handleShare} variant="outline" className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Поделиться
            </Button>
            <Button onClick={onReset} variant="destructive" className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Сброс
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Табы */}
      <div className="flex space-x-2 mb-4">
        <Button
          variant={activeTab === 'stats' ? 'default' : 'outline'}
          onClick={() => setActiveTab('stats')}
          className="flex-1"
        >
          📊 Статистика
        </Button>
        <Button
          variant={activeTab === 'achievements' ? 'default' : 'outline'}
          onClick={() => setActiveTab('achievements')}
          className="flex-1"
        >
          🏆 Достижения
        </Button>
      </div>
      
      {/* Статистика */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Общий доход
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {formatMoney(gameState.totalEarned)}
              </div>
              <div className="text-sm text-gray-500">
                Пассивный: +{formatMoney(passiveIncome)}/сек
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <MousePointer className="w-4 h-4 mr-2" />
                Клики
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {gameState.stats.totalClicks.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">
                Макс/сек: {gameState.stats.maxClicksPerSecond}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Время в игре
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPlayTime(gameState.stats.playTime)}
              </div>
              <div className="text-sm text-gray-500">
                С {new Date(gameState.stats.lastSave).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Trophy className="w-4 h-4 mr-2" />
                Прогресс
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((gameState.achievements.length / ACHIEVEMENTS.length) * 100)}%
              </div>
              <div className="text-sm text-gray-500">
                {gameState.achievements.length} из {ACHIEVEMENTS.length}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Достижения */}
      {activeTab === 'achievements' && (
        <div className="space-y-4">
          {ACHIEVEMENTS.map((achievement, index) => {
            const isUnlocked = gameState.achievements.includes(achievement.id);
            const canUnlock = achievement.condition(gameState);
            
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`
                  transition-all
                  ${isUnlocked ? 'border-green-500 shadow-green-500/20 shadow-lg' : ''}
                  ${!isUnlocked && canUnlock ? 'border-yellow-500 animate-pulse' : ''}
                  ${!isUnlocked && !canUnlock ? 'opacity-60' : ''}
                `}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <span className="text-2xl mr-2">
                          {isUnlocked ? achievement.emoji : '🔒'}
                        </span>
                        {achievement.name}
                      </CardTitle>
                      {isUnlocked && (
                        <Badge variant="default" className="bg-green-500">
                          ✅ Получено
                        </Badge>
                      )}
                      {!isUnlocked && canUnlock && (
                        <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                          🎯 Почти готово!
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {achievement.description}
                    </p>
                    {achievement.reward && isUnlocked && (
                      <div className="mt-2 text-sm text-green-500 font-medium">
                        Награда: {achievement.reward.type === 'money' 
                          ? `+${formatMoney(achievement.reward.value)}`
                          : `×${achievement.reward.value} к доходу`}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};