import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { getBotStartLink, checkTelegramWebApp, initTelegramWebApp } from '@/lib/telegram';
import { Loader2, ExternalLink } from 'lucide-react';

interface TelegramStatus {
  status: 'ok' | 'standalone' | 'initializing' | 'error';
  user: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
  } | null;
  platform: 'telegram' | 'browser';
}

const TelegramConnect: React.FC = () => {
  const [telegramStatus, setTelegramStatus] = useState<TelegramStatus>({
    status: 'initializing',
    user: null,
    platform: 'browser'
  });

  useEffect(() => {
    // Инициализируем Telegram WebApp при монтировании компонента
    const initTelegram = async () => {
      try {
        // Пытаемся инициализировать WebApp
        const initialized = initTelegramWebApp();
        
        // Проверяем статус и получаем данные пользователя
        const status = checkTelegramWebApp();
        
        setTelegramStatus({
          ...status,
          status: initialized ? 'ok' : status.status
        });

        console.log('Telegram WebApp status:', status);
      } catch (error) {
        console.error('Error initializing Telegram WebApp:', error);
        setTelegramStatus({
          status: 'error',
          user: null,
          platform: 'browser'
        });
      }
    };

    initTelegram();
  }, []);

  if (telegramStatus.status === 'initializing') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 flex items-center justify-center">
          <CardTitle className="text-xl text-center">Подключение к Telegram</CardTitle>
          <CardDescription className="text-center">
            Подождите, выполняется подключение...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (telegramStatus.status === 'error') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl text-center">Ошибка подключения</CardTitle>
          <CardDescription className="text-center">
            Не удалось подключиться к Telegram
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 p-6">
          <p className="text-center text-sm text-muted-foreground">
            Произошла ошибка при подключении к Telegram WebApp. Попробуйте открыть приложение через бота.
          </p>
          <Button asChild>
            <a href={getBotStartLink()} target="_blank" rel="noreferrer">
              Открыть бота <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (telegramStatus.status === 'standalone') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl text-center">Режим браузера</CardTitle>
          <CardDescription className="text-center">
            Приложение запущено в автономном режиме
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 p-6">
          <p className="text-center text-sm text-muted-foreground">
            Для полной функциональности рекомендуется открыть приложение через Telegram бота.
          </p>
          <Button asChild>
            <a href={getBotStartLink()} target="_blank" rel="noreferrer">
              Открыть в Telegram <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl text-center text-green-500">✅ Подключено к Telegram</CardTitle>
        <CardDescription className="text-center">
          {telegramStatus.user ? `Привет, ${telegramStatus.user.first_name}!` : 'Пользователь авторизован'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {telegramStatus.user && (
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm font-medium">ID пользователя: {telegramStatus.user.id}</p>
            {telegramStatus.user.username && (
              <p className="text-sm text-muted-foreground">@{telegramStatus.user.username}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TelegramConnect;
