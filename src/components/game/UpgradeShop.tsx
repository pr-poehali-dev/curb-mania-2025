import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Upgrade } from '@/types/game';

interface UpgradeShopProps {
  showUpgradeShop: boolean;
  onClose: () => void;
  upgrades: Upgrade[];
  corruption: number;
  premiumCurrency: number;
  onBuyUpgrade: (upgradeId: string) => void;
  onBuyPremium: () => void;
}

export const UpgradeShop: React.FC<UpgradeShopProps> = ({
  showUpgradeShop,
  onClose,
  upgrades,
  corruption,
  premiumCurrency,
  onBuyUpgrade,
  onBuyPremium
}) => {
  const freeUpgrades = upgrades.filter(u => u.costType === 'corruption');
  const premiumUpgrades = upgrades.filter(u => u.costType === 'premium');

  const canAfford = (upgrade: Upgrade) => {
    if (upgrade.costType === 'corruption') {
      return corruption >= upgrade.cost;
    }
    return premiumCurrency >= upgrade.cost;
  };

  const isMaxLevel = (upgrade: Upgrade) => {
    return upgrade.maxLevel && upgrade.currentLevel >= upgrade.maxLevel;
  };

  return (
    <Dialog open={showUpgradeShop} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Icon name="ShoppingCart" />
            Магазин улучшений
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Premium Currency Section */}
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/40 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-yellow-400">⭐ Звезды Telegram</h3>
                <p className="text-sm text-muted-foreground">
                  Премиум валюта для мощных улучшений
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-yellow-400">
                  {premiumCurrency} ⭐
                </p>
                <Button 
                  className="mt-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500"
                  onClick={onBuyPremium}
                >
                  <Icon name="CreditCard" className="mr-2" />
                  Купить звезды
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {premiumUpgrades.map((upgrade) => (
                <div
                  key={upgrade.id}
                  className={`p-3 border rounded-lg transition-all ${
                    isMaxLevel(upgrade) 
                      ? 'border-green-500/40 bg-green-500/10' 
                      : canAfford(upgrade) 
                        ? 'border-yellow-500/40 bg-yellow-500/10 hover:border-yellow-400' 
                        : 'border-gray-500/40 bg-gray-500/10'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{upgrade.icon}</span>
                      <div>
                        <h4 className="font-semibold">{upgrade.name}</h4>
                        {upgrade.currentLevel > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            Уровень {upgrade.currentLevel}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-yellow-400">
                        {upgrade.cost} ⭐
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {upgrade.description}
                  </p>
                  
                  <Button
                    className="w-full"
                    onClick={() => onBuyUpgrade(upgrade.id)}
                    disabled={!canAfford(upgrade) || isMaxLevel(upgrade)}
                    variant={isMaxLevel(upgrade) ? "secondary" : "default"}
                  >
                    {isMaxLevel(upgrade) 
                      ? '✅ Куплено' 
                      : canAfford(upgrade) 
                        ? 'Купить' 
                        : 'Недостаточно звезд'
                    }
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Free Upgrades Section */}
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/40 rounded-lg p-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-green-400">💰 Улучшения за откаты</h3>
              <p className="text-sm text-muted-foreground">
                Тратьте свои откаты на улучшения
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {freeUpgrades.map((upgrade) => (
                <div
                  key={upgrade.id}
                  className={`p-3 border rounded-lg transition-all ${
                    isMaxLevel(upgrade) 
                      ? 'border-green-500/40 bg-green-500/10' 
                      : canAfford(upgrade) 
                        ? 'border-green-500/40 bg-green-500/10 hover:border-green-400' 
                        : 'border-gray-500/40 bg-gray-500/10'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{upgrade.icon}</span>
                      <div>
                        <h4 className="font-semibold text-sm">{upgrade.name}</h4>
                        {upgrade.currentLevel > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            Ур. {upgrade.currentLevel}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-3">
                    {upgrade.description}
                  </p>
                  
                  <div className="text-center mb-3">
                    <p className="text-sm font-bold text-green-400">
                      {upgrade.cost.toLocaleString()}₽
                    </p>
                  </div>
                  
                  <Button
                    className="w-full"
                    size="sm"
                    onClick={() => onBuyUpgrade(upgrade.id)}
                    disabled={!canAfford(upgrade) || isMaxLevel(upgrade)}
                    variant={isMaxLevel(upgrade) ? "secondary" : "default"}
                  >
                    {isMaxLevel(upgrade) 
                      ? '✅ Макс' 
                      : canAfford(upgrade) 
                        ? 'Купить' 
                        : 'Мало откатов'
                    }
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};