import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowDownToLine,
  Coins,
  LogOut,
  User as UserIcon,
  AlertCircle,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import TelegramConnect from '@/components/TelegramConnect';
import { useGameStore } from '@/lib/store';
import { getTelegramUser, initTelegramWebApp, closeTelegramWebApp } from '@/lib/telegram';

const ProfilePage = () => {
  const { coins, earnedTotal, withdrawnTotal } = useGameStore();
  
  useEffect(() => {
    initTelegramWebApp();
  }, []);
  
  const telegramUser = getTelegramUser();
  
  return (
    <div className="container max-w-md mx-auto px-4 pb-20 pt-6">
      <h1 className="text-2xl font-bold mb-6">Мой профиль</h1>
      
      <TelegramConnect />
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
              <UserIcon className="w-7 h-7 text-primary" />
            </div>
            <div className="ml-4">
              <h2 className="font-bold text-xl">
                {telegramUser?.first_name || 'Пользователь'}
              </h2>
              {telegramUser?.username && (
                <p className="text-muted-foreground text-sm">@{telegramUser.username}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Баланс</div>
              <div className="font-bold text-2xl flex items-center">
                {coins.toFixed(0)}
                <Coins className="w-4 h-4 ml-1" />
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Всего заработано</div>
              <div className="font-bold text-2xl flex items-center">
                {earnedTotal.toFixed(0)}
                <Coins className="w-4 h-4 ml-1" />
              </div>
            </div>
          </div>
          
          <Link to="/withdraw">
            <Button className="w-full flex items-center justify-center gap-2">
              <ArrowDownToLine className="w-4 h-4" />
              Вывести монеты
            </Button>
          </Link>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Статистика</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Всего заработано</span>
              <span className="font-medium">{earnedTotal.toFixed(0)} монет</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Выведено</span>
              <span className="font-medium">{withdrawnTotal.toFixed(0)} монет</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Текущий баланс</span>
              <span className="font-medium">{coins.toFixed(0)} монет</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <h3 className="font-medium mb-1">Вывод средств</h3>
              <p className="text-sm text-muted-foreground">
                Вы можете обменять накопленные монеты на реальные деньги! 
                1000 монет = 100 рублей. Минимальная сумма вывода: 1000 монет.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {telegramUser && (
        <Button 
          variant="outline" 
          className="w-full text-muted-foreground" 
          onClick={closeTelegramWebApp}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Выйти из приложения
        </Button>
      )}
      
      <Navigation />
    </div>
  );
};

export default ProfilePage;
