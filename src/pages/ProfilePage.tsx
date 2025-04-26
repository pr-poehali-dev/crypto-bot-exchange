import { useEffect, useState } from 'react';
import { useGameStore } from '@/lib/store';
import { getTelegramUser } from '@/lib/telegram';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownToLine, Users, RefreshCw, UserCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';

const ProfilePage = () => {
  const { coins, totalEarned, totalCashed, cashOutCoins, resetGame } = useGameStore();
  const [telegramUser, setTelegramUser] = useState<{id: number, first_name: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Получаем информацию о пользователе из Telegram WebApp
    const user = getTelegramUser();
    if (user) {
      setTelegramUser(user);
    }
  }, []);
  
  const handleCashOut = () => {
    if (coins < 1000) {
      toast({
        title: "Недостаточно монет",
        description: "Минимальная сумма для вывода - 1000 монет",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Имитация задержки сети
    setTimeout(() => {
      // Вывод средств (в реальном приложении будет отправка на сервер)
      cashOutCoins(1000);
      
      toast({
        title: "Запрос на вывод отправлен",
        description: "Средства поступят на ваш счет в течение 24 часов",
      });
      
      setIsLoading(false);
    }, 1500);
  };
  
  const handleReset = () => {
    if (window.confirm("Вы уверены, что хотите сбросить весь прогресс игры?")) {
      resetGame();
      toast({
        title: "Игра сброшена",
        description: "Весь прогресс был удален",
      });
    }
  };
  
  return (
    <div className="min-h-screen pb-16">
      <header className="p-4 border-b">
        <h1 className="text-xl font-bold">Профиль</h1>
        {telegramUser && (
          <p className="text-muted-foreground">{telegramUser.first_name} (ID: {telegramUser.id})</p>
        )}
      </header>
      
      <main className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              Статистика
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Текущий баланс:</span>
              <span className="font-medium">{coins.toFixed(0)} монет</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Всего заработано:</span>
              <span className="font-medium">{totalEarned.toFixed(0)} монет</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Выведено:</span>
              <span className="font-medium">{totalCashed.toFixed(0)} монет</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-lg">
              <span>Курс обмена:</span>
              <span className="font-bold">1000 монет = 1 ₽</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowDownToLine className="h-5 w-5" />
              Вывод средств
            </CardTitle>
            <CardDescription>
              Минимальная сумма для вывода - 1000 монет
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Обмен монет на реальные деньги будет осуществлен в течение 24 часов на ваш кошелек ЮMoney, привязанный к аккаунту Telegram.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              disabled={coins < 1000 || isLoading}
              onClick={handleCashOut}
            >
              {isLoading ? "Обработка..." : "Вывести 1000 монет (1 ₽)"}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Пригласить друзей
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Пригласите друзей и получите бонус 500 монет за каждого нового игрока!
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline">
              Поделиться с друзьями
            </Button>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center">
          <Button 
            variant="ghost" 
            className="text-muted-foreground"
            onClick={handleReset}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Сбросить игру
          </Button>
        </div>
      </main>
      
      <Navigation />
    </div>
  );
};

export default ProfilePage;
