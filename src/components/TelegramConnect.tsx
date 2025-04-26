import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { getTelegramUser, getWebAppUrl, getBotStartLink, isTelegramWebApp, initTelegramWebApp } from '@/lib/telegram';
import { ExternalLink } from 'lucide-react';

const TelegramConnect = () => {
  const [telegramUser, setTelegramUser] = useState<{
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
  } | null>(null);

  useEffect(() => {
    // Инициализация Telegram WebApp
    initTelegramWebApp();
    
    // Получение данных пользователя
    const user = getTelegramUser();
    setTelegramUser(user || null);
  }, []);

  const isConnected = !!telegramUser;
  const webAppUrl = getWebAppUrl();
  const botStartLink = getBotStartLink();
  const isRunningInTelegram = isTelegramWebApp();

  if (isRunningInTelegram && isConnected) {
    return null; // Если уже в Telegram и подключен, не показываем виджет
  }

  return (
    <Card className="p-4 mb-4 bg-violet-50 border-violet-200">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <img src="/logo-b.svg" alt="Telegram" className="w-6 h-6" />
          <h3 className="font-medium">
            {isConnected 
              ? `Подключено к Telegram: ${telegramUser?.first_name || 'Пользователь'}`
              : 'Подключите Telegram для сохранения прогресса'}
          </h3>
        </div>
        
        {!isConnected && !isRunningInTelegram && (
          <Button 
            variant="outline" 
            className="bg-white hover:bg-gray-50 border-violet-200 text-violet-700 flex items-center gap-2"
            onClick={() => window.open(botStartLink, '_blank')}
          >
            Открыть в Telegram <ExternalLink className="w-4 h-4" />
          </Button>
        )}
        
        {isConnected && (
          <p className="text-sm text-violet-700">
            Ваш аккаунт Telegram успешно подключен. Все награды будут сохраняться автоматически!
          </p>
        )}
      </div>
    </Card>
  );
};

export default TelegramConnect;
