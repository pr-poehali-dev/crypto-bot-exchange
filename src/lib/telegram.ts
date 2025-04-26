// Типы для интеграции с Telegram WebApp
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
          }
        }
      }
    }
  }
}

export const isTelegramWebApp = (): boolean => {
  return Boolean(window.Telegram?.WebApp);
};

export const getTelegramUser = () => {
  if (isTelegramWebApp()) {
    return window.Telegram.WebApp.initDataUnsafe?.user;
  }
  return null;
};

export const initTelegramWebApp = () => {
  if (isTelegramWebApp()) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
  }
};
