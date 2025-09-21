import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Contractor, CurbConfig } from '@/types/game';

interface CurbConstructorDialogProps {
  showCurbConstructor: boolean;
  onClose: () => void;
  selectedContractor: Contractor | null;
  curbConfig: CurbConfig;
  setCurbConfig: React.Dispatch<React.SetStateAction<CurbConfig>>;
  calculateFinalPrice: () => number;
  onReplaceCurb: () => void;
  budget: number;
}

export const CurbConstructorDialog: React.FC<CurbConstructorDialogProps> = ({
  showCurbConstructor,
  onClose,
  selectedContractor,
  curbConfig,
  setCurbConfig,
  calculateFinalPrice,
  onReplaceCurb,
  budget
}) => {
  const materials = [
    { id: 'concrete', name: 'Бетон', price: 1000, emoji: '🧱' },
    { id: 'granite', name: 'Гранит', price: 15000, emoji: '🗿' },
    { id: 'marble', name: 'Мрамор', price: 25000, emoji: '⚪' },
    { id: 'plastic', name: 'Пластик', price: 500, emoji: '🟡' },
    { id: 'gold', name: 'Золото', price: 50000, emoji: '🏆' }
  ];

  const extras = [
    { id: 'lighting', name: 'LED подсветка', price: 2000, emoji: '💡' },
    { id: 'antiVandal', name: 'Антивандальное покрытие', price: 1500, emoji: '🛡️' },
    { id: 'heating', name: 'Подогрев зимой', price: 3000, emoji: '🔥' }
  ];

  return (
    <Dialog open={showCurbConstructor} onOpenChange={onClose}>
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
              {materials.map((material) => (
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
              {extras.map((extra) => (
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
                onClick={onReplaceCurb}
                disabled={!selectedContractor || budget < calculateFinalPrice()}
              >
                <Icon name="CheckCircle" className="mr-2" />
                Заказать бордюр
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};