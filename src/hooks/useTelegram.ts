import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface UseTelegramReturn {
  user: TelegramUser | null;
  isReady: boolean;
  isTelegramWebApp: boolean;
  showAlert: (message: string) => void;
  showConfirm: (message: string, callback: (confirmed: boolean) => void) => void;
  hapticFeedback: () => void;
  shareToChat: (url: string, text?: string) => void;
  mainButton: {
    show: (text: string, callback: () => void) => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
  };
}

export const useTelegram = (): UseTelegramReturn => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      setIsTelegramWebApp(true);
      
      WebApp.ready();
      
      // Настройка внешнего вида
      WebApp.setHeaderColor('#1a1a1a');
      WebApp.setBackgroundColor('#0a0a0a');
      WebApp.expand();
      
      // Получение данных пользователя
      if (WebApp.initDataUnsafe?.user) {
        setUser(WebApp.initDataUnsafe.user as TelegramUser);
      }
      
      setIsReady(true);
    } else {
      // Fallback для разработки вне Telegram
      setIsReady(true);
      setIsTelegramWebApp(false);
    }
  }, []);

  const showAlert = (message: string) => {
    if (isTelegramWebApp) {
      WebApp.showAlert(message);
    } else {
      alert(message);
    }
  };

  const showConfirm = (message: string, callback: (confirmed: boolean) => void) => {
    if (isTelegramWebApp) {
      WebApp.showConfirm(message, callback);
    } else {
      const result = confirm(message);
      callback(result);
    }
  };

  const hapticFeedback = () => {
    if (isTelegramWebApp && WebApp.HapticFeedback) {
      WebApp.HapticFeedback.impactOccurred('medium');
    }
  };

  const shareToChat = (url: string, text?: string) => {
    if (isTelegramWebApp) {
      const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text || '')}`;
      WebApp.openTelegramLink(shareUrl);
    }
  };

  const mainButton = {
    show: (text: string, callback: () => void) => {
      if (isTelegramWebApp) {
        WebApp.MainButton.setText(text);
        WebApp.MainButton.show();
        WebApp.MainButton.onClick(callback);
      }
    },
    hide: () => {
      if (isTelegramWebApp) {
        WebApp.MainButton.hide();
      }
    },
    enable: () => {
      if (isTelegramWebApp) {
        WebApp.MainButton.enable();
      }
    },
    disable: () => {
      if (isTelegramWebApp) {
        WebApp.MainButton.disable();
      }
    }
  };

  return {
    user,
    isReady,
    isTelegramWebApp,
    showAlert,
    showConfirm,
    hapticFeedback,
    shareToChat,
    mainButton
  };
};