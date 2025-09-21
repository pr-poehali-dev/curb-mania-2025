import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Contractor } from '@/types/game';

interface ContractorDialogProps {
  showContractorDialog: boolean;
  onClose: () => void;
  contractors: Contractor[];
  selectedContractor: Contractor | null;
  onSelectContractor: (contractor: Contractor) => void;
  onShowCurbConstructor: () => void;
}

export const ContractorDialog: React.FC<ContractorDialogProps> = ({
  showContractorDialog,
  onClose,
  contractors,
  selectedContractor,
  onSelectContractor,
  onShowCurbConstructor
}) => {
  return (
    <Dialog open={showContractorDialog} onOpenChange={onClose}>
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
                onClick={() => onSelectContractor(contractor)}
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
                onClick={onShowCurbConstructor}
              >
                <Icon name="ArrowRight" className="mr-2" />
                Далее: выбор материала и опций
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};