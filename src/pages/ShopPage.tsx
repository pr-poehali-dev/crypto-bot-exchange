import { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { Booster } from '@/types';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Clock, ShoppingCart } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Временные данные о бустерах
const BOOSTERS: Booster[] = [
  {
    id: 'boost-1',
    name: 'Ускоритель x2',
    description: 'Удваивает количество монет за клик',
    price: 100,
    multiplier: 2,
    duration: 60, // 1 минута
    icon: '⚡'
  },
  {
    id: 'boost-2',
    name: 'Супер-ускоритель x3',
    description: 'Утраивает количество монет за клик',
    price: 250,
    multiplier: 3,
    duration: 60, // 1 минута
    icon: '🔥'
  },
  {
    id: 'boost-3',
    name: 'Мега-ускоритель x5',
    description: 'Увеличивает количество монет за клик в 5 раз',
    price: 500,
    multiplier: 5,
    duration: 30, // 30 секунд
    icon: '💎'
  }
];

// Заглушка для функции покупки за реальные деньги
const initiateYoomoneyPayment = (boosterId: string, amount: number) => {
  // В реальном приложении здесь будет редирект на страницу оплаты Юмани
  console.log(`Initiating Yoomoney payment for booster ${boosterId}, amount: ${amount} RUB`);
  return new Promise<boolean>((resolve) => {
    setTimeout(() => resolve(true), 1000);
  });
};

const ShopPage = () => {
  const { coins, activateBooster } = useGameStore();
  const [loading, setLoading] = useState<string | null>(null);
  
  const handleBuyWithCoins = (booster: Booster) => {
    if (coins < booster.price) {
      toast({
        title: "Недостаточно монет",
        description: `Нужно еще ${booster.price - coins} монет для покупки`,
        variant: "destructive",
      });
      return;
    }
    
    setLoading(booster.id);
    
    // Имитация задержки сети
    setTimeout(() => {
      // Активируем бустер
      activateBooster(booster);
      
      toast({
        title: "Бустер активирован!",
        description: `${booster.name} будет действовать ${booster.duration} секунд`,
      });
      
      setLoading(null);
    }, 500);
  };
  
  const handleBuyWithMoney = async (booster: Booster) => {
    setLoading(booster.id);
    
    try {
      const success = await initiateYoomoneyPayment(booster.id, booster.price / 10); // Примерный курс обмена
      
      if (success) {
        toast({
          title: "Переход к оплате",
          description: "Вы будете перенаправлены на страницу оплаты ЮMoney",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка оплаты",
        description: "Не удалось инициировать платеж",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };
  
  return (
    <div className="min-h-screen pb-16">
      <header className="p-4 border-b">
        <h1 className="text-xl font-bold">Магазин бустеров</h1>
        <p className="text-muted-foreground">У вас {coins.toFixed(0)} монет</p>
      </header>
      
      <main className="p-4 grid gap-4">
        {BOOSTERS.map(booster => (
          <Card key={booster.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{booster.icon}</span>
                  {booster.name}
                </CardTitle>
                <span className="bg-primary/20 px-3 py-1 rounded-full text-sm font-semibold">
                  x{booster.multiplier}
                </span>
              </div>
              <CardDescription>{booster.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4" />
                <span>Множитель: x{booster.multiplier}</span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-1">
                <Clock className="w-4 h-4" />
                <span>Длительность: {booster.duration} сек.</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button 
                className="w-full"
                variant={coins >= booster.price ? "default" : "outline"}
                disabled={loading === booster.id || coins < booster.price}
                onClick={() => handleBuyWithCoins(booster)}
              >
                Купить за {booster.price} монет
              </Button>
              <Button 
                className="w-full"
                variant="outline"
                disabled={loading === booster.id}
                onClick={() => handleBuyWithMoney(booster)}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Купить за {(booster.price / 10).toFixed(0)} ₽
              </Button>
            </CardFooter>
          </Card>
        ))}
      </main>
      
      <Navigation />
    </div>
  );
};

export default ShopPage;
