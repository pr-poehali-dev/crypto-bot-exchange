// Конфигурация ЮMoney API
export const YOOMONEY_CLIENT_ID = 'F91ACF4211B9B5CEF6588EB9143C24583CF449D1BAD64133904689860FAD0D82';
export const YOOMONEY_SECRET = 'B3D0E2415CE9E5D2A387AE66EA149C0FCED1CC2F1B559D917EFC2E6956632483A15A3240A3796EBB068381F1744C727BC73D3E0999E6ACE9645CF6C6BC7D2286';

// Базовый URL для API ЮMoney
const API_URL = 'https://yoomoney.ru/api';

// URL для авторизации
export const getAuthUrl = (redirectUri: string, scope: string = 'account-info operation-history') => {
  return `https://yoomoney.ru/oauth/authorize?client_id=${YOOMONEY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
};

// Формирование URL для быстрой оплаты (форма на стороне ЮMoney)
export const getQuickPayUrl = (params: {
  receiver: string;
  quickPayForm: 'shop' | 'donate' | 'small';
  targets: string;
  paymentType: 'PC' | 'AC' | 'MC';
  sum: number;
  formComment?: string;
  shortDest?: string;
  label?: string;
  successURL?: string;
}) => {
  const baseUrl = 'https://yoomoney.ru/checkout/payment/';
  
  // Формируем параметры URL
  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      urlParams.append(key, value.toString());
    }
  });
  
  return `${baseUrl}?${urlParams.toString()}`;
};

// Создаем платёжную форму для оплаты бустера
export const createBoosterPayment = (
  boosterId: string,
  boosterName: string,
  price: number,
  userId: number,
  successUrl: string = window.location.origin + '/shop?success=true'
) => {
  // В реальном проекте receiver должен быть вашим номером кошелька ЮMoney
  const receiver = '4100116602566111'; // Замените на реальный номер кошелька
  
  const params = {
    receiver,
    quickPayForm: 'shop' as const,
    targets: `Покупка бустера "${boosterName}"`,
    paymentType: 'AC' as const, // Оплата с банковской карты
    sum: price,
    formComment: `Покупка бустера для пользователя ${userId}`,
    label: `booster_${boosterId}_user_${userId}`,
    successURL: successUrl
  };
  
  return getQuickPayUrl(params);
};

// Создаем платёжную форму для пополнения баланса
export const createDepositPayment = (
  amount: number,
  userId: number,
  successUrl: string = window.location.origin + '/profile?success=true'
) => {
  // В реальном проекте receiver должен быть вашим номером кошелька ЮMoney
  const receiver = '4100116602566111'; // Замените на реальный номер кошелька
  
  const params = {
    receiver,
    quickPayForm: 'shop' as const,
    targets: `Пополнение баланса`,
    paymentType: 'AC' as const, // Оплата с банковской карты
    sum: amount,
    formComment: `Пополнение баланса для пользователя ${userId}`,
    label: `deposit_${userId}_${Date.now()}`,
    successURL: successUrl
  };
  
  return getQuickPayUrl(params);
};
