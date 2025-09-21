import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Curb } from '@/types/game';
import { getCurbEmoji, getConditionColor, getConditionText } from '@/utils/gameUtils';

interface CurbDialogProps {
  selectedCurb: Curb | null;
  isSearchingDefects: boolean;
  foundDefects: string[];
  onSearchDefects: () => void;
  onShowContractorDialog: () => void;
}

export const CurbDialog: React.FC<CurbDialogProps> = ({
  selectedCurb,
  isSearchingDefects,
  foundDefects,
  onSearchDefects,
  onShowContractorDialog
}) => {
  return (
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
            onClick={onSearchDefects}
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
            onClick={onShowContractorDialog}
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
  );
};