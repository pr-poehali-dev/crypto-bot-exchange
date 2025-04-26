// YooMoney API integration
// Client credentials
export const YOOMONEY_CLIENT_ID = "F91ACF4211B9B5CEF6588EB9143C24583CF449D1BAD64133904689860FAD0D82";
export const YOOMONEY_CLIENT_SECRET = "B3D0E2415CE9E5D2A387AE66EA149C0FCED1CC2F1B559D917EFC2E6956632483A15A3240A3796EBB068381F1744C727BC73D3E0999E6ACE9645CF6C6BC7D2286";

// Базовый URL для API YooMoney
const YOOMONEY_API_URL = "https://yoomoney.ru/api";

// Интерфейс для данных платежа
interface PaymentData {
  amount: number;
  comment: string;
  returnUrl: string;
  label?: string;
}

/**
 * Создает платежную форму YooMoney
 * Примечание: в реальном приложении эта логика должна быть на сервере для безопасности
 */
export const createYooMoneyPaymentForm = (payment: PaymentData): string => {
  // В реальном приложении токен нужно получать через OAuth 2.0 на сервере
  const formUrl = new URL("https://yoomoney.ru/quickpay/confirm.xml");
  
  formUrl.searchParams.append("receiver", YOOMONEY_CLIENT_ID);
  formUrl.searchParams.append("quickpay-form", "shop");
  formUrl.searchParams.append("sum", payment.amount.toString());
  formUrl.searchParams.append("targets", payment.comment);
  formUrl.searchParams.append("paymentType", "AC"); // Оплата банковской картой
  formUrl.searchParams.append("successURL", payment.returnUrl);
  
  if (payment.label) {
    formUrl.searchParams.append("label", payment.label);
  }
  
  return formUrl.toString();
};

/**
 * Открывает платежную форму YooMoney в новом окне
 */
export const openYooMoneyPayment = (payment: PaymentData): void => {
  const paymentUrl = createYooMoneyPaymentForm(payment);
  window.open(paymentUrl, "_blank", "width=800,height=600");
};

/**
 * Функция для покупки бустера за реальные деньги
 */
export const buyBoosterWithRealMoney = (
  boosterId: string,
  boosterName: string,
  amount: number,
  userId: string | number
): void => {
  const payment: PaymentData = {
    amount,
    comment: `Покупка бустера "${boosterName}"`,
    returnUrl: window.location.origin + "/shop?success=true",
    label: `boost_${boosterId}_user_${userId}`
  };
  
  openYooMoneyPayment(payment);
};

/**
 * Функция для вывода денег пользователю
 * В реальной реализации это должно происходить через серверную часть
 */
export const withdrawMoney = (
  amount: number,
  userId: string | number
): void => {
  alert(`Для вывода ${amount} рублей необходимо связаться с администратором бота. Ваш ID: ${userId}`);
  
  // В реальном приложении здесь была бы отправка запроса на сервер
  // для обработки вывода средств
};
