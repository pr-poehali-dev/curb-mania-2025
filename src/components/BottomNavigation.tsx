import React from 'react';
import { motion } from 'framer-motion';
import { Home, ShoppingBag, Trophy, User } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'game', label: 'Игра', icon: Home },
    { id: 'shop', label: 'Магазин', icon: ShoppingBag },
    { id: 'achievements', label: 'Цели', icon: Trophy },
    { id: 'profile', label: 'Профиль', icon: User }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="grid grid-cols-4 h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id);
                window.Telegram?.WebApp.HapticFeedback.impactOccurred('light');
              }}
              className={`
                relative flex flex-col items-center justify-center space-y-1
                transition-colors duration-200
                ${isActive ? 'text-primary' : 'text-muted-foreground'}
              `}
              whileTap={{ scale: 0.9 }}
            >
              {/* Индикатор активной вкладки */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-0 right-0 h-0.5 bg-primary"
                  initial={false}
                />
              )}
              
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};