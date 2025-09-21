import React from 'react';

interface NotificationsProps {
  notifications: string[];
}

export const Notifications: React.FC<NotificationsProps> = ({ notifications }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-30 space-y-2">
      {notifications.map((notification, index) => (
        <div
          key={index}
          className="bg-card border border-primary/40 rounded-lg p-3 shadow-lg animate-in slide-in-from-right-full duration-300 neon-glow"
        >
          {notification}
        </div>
      ))}
    </div>
  );
};