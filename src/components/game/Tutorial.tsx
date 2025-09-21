import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TutorialProps {
  showTutorial: boolean;
  onClose: () => void;
}

export const Tutorial: React.FC<TutorialProps> = ({ showTutorial, onClose }) => {
  if (!showTutorial) return null;

  return (
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
        <Button className="w-full mt-4" onClick={onClose}>
          Начать карьеру чиновника! 🚀
        </Button>
      </Card>
    </div>
  );
};