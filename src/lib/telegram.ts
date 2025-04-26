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
        };
        sendData: (data: string) => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          show: () => void;
          hide: () => void;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          enable: () => void;
          disable: () => void;
        };
        BackButton: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
      }
    }
  }
}

// Токен бота: 8006898941:AAGBhIKsY2VE2LrJbMrfJoUT_ZRJQZQNAXE
export const BOT_TOKEN = "8006898941:AAGBhIKsY2VE2LrJbMrfJoUT_ZRJQZQNAXE";
export const BOT_USERNAME = "tapcoins_bot"; // Используем предоставленное имя бота

// API URL для отправки сообщений через бота
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

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
    
    // Добавляем обработчик на кнопку "назад" в WebApp
    window.Telegram.WebApp.BackButton.onClick(() => {
      window.history.back();
    });
    
    console.log('Telegram WebApp initialized successfully');
    return true;
  } else {
    console.warn('Telegram WebApp not available. Running in standalone mode.');
    return false;
  }
};

export const showTelegramMainButton = (text: string, onClick: () => void) => {
  if (isTelegramWebApp()) {
    const { MainButton } = window.Telegram.WebApp;
    MainButton.setText(text);
    MainButton.onClick(onClick);
    MainButton.show();
    return true;
  }
  return false;
};

export const hideTelegramMainButton = () => {
  if (isTelegramWebApp()) {
    window.Telegram.WebApp.MainButton.hide();
    return true;
  }
  return false;
};

export const sendDataToTelegramBot = (data: any) => {
  if (isTelegramWebApp()) {
    window.Telegram.WebApp.sendData(JSON.stringify(data));
    return true;
  }
  return false;
};

export const closeTelegramWebApp = () => {
  if (isTelegramWebApp()) {
    window.Telegram.WebApp.close();
    return true;
  }
  return false;
};

// Получить ссылку для открытия WebApp из бота
export const getWebAppUrl = () => {
  return `https://t.me/${BOT_USERNAME}/app`;
};

// Функция для создания ссылки на бота с открытием WebApp
export const getBotStartLink = () => {
  return `https://t.me/${BOT_USERNAME}?start=webapp`;
};

// Функция для отправки сообщения пользователю через бота
export const sendMessageToUser = async (chatId: number, message: string) => {
  try {
    const response = await fetch(`${API_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error);
    return null;
  }
};

// Отправка запроса на вывод средств
export const requestWithdrawal = async (userId: number, amount: number) => {
  const user = getTelegramUser();
  if (!user) return false;
  
  const message = `🔄 <b>Запрос на вывод средств</b>\n\n` +
    `👤 ID пользователя: <code>${userId}</code>\n` +
    `💰 Сумма: <b>${amount} ₽</b>\n\n` +
    `Для подтверждения вывода средств свяжитесь с администратором.`;
  
  try {
    await sendMessageToUser(userId, message);
    return true;
  } catch (error) {
    console.error('Ошибка при запросе вывода:', error);
    return false;
  }
};

// Отправка уведомления о покупке бустера
export const notifyBoosterPurchase = async (userId: number, boosterName: string, price: number) => {
  const message = `✅ <b>Успешная покупка!</b>\n\n` +
    `🚀 Бустер: <b>${boosterName}</b>\n` +
    `💰 Стоимость: <b>${price} ₽</b>\n\n` +
    `Бустер уже активирован в вашем аккаунте!`;
  
  try {
    await sendMessageToUser(userId, message);
    return true;
  } catch (error) {
    console.error('Ошибка при отправке уведомления:', error);
    return false;
  }
};

// Проверка, запущено ли приложение в Telegram WebApp
export const checkTelegramWebApp = () => {
  if (isTelegramWebApp()) {
    return {
      status: 'ok',
      user: getTelegramUser(),
      platform: 'telegram'
    };
  } else {
    return {
      status: 'standalone',
      user: null,
      platform: 'browser'
    };
  }
};
