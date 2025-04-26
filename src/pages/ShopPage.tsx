import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import Navigation from '@/components/Navigation';
import BoosterTimer from '@/components/BoosterTimer';
import { useGameStore, Booster } from '@/lib/store';
import { Coins, AlertCircle } from 'lucide-react';
import { buyBoosterWithRealMoney } from '@/lib/yoomoney';
import { getTelegramUser, initTelegramWebApp, notifyBoosterPurchase } from '@/lib/telegram';

const ShopPage = () => {
  const [activeTab, setActiveTab] = useState<string>('coins');
  const location = useLocation();
  const { toast } = useToast();
  const { coins, boosters, buyBooster, activateBooster } = useGameStore();
  
  // Разделим бустеры по типам
  const coinBoosters = boosters.filter(b => b.id.includes('click-multiplier'));
  const autoBoosters = boosters.filter(b => b.id.includes('auto-clicker'));
  
  useEffect(() => {
    // Инициализация Telegram WebApp
    initTelegramWebApp();
    
    // Проверяем успешную покупку по URL
    const searchParams = new URLSearchParams(location.search);
    const success = searchParams.get('success');
    const boosterId = searchParams.get('booster');
    
    if (success === 'true' && boosterId) {
      const booster = boosters.find(b => b.id === boosterId);
      if (booster) {
        activateBooster(boosterId);
        
        toast({
          title: "Бустер активирован!",
          description: `${booster.name} успешно приобретен и активирован.`,
        });
      }
    }
  }, [location, toast, boosters, activateBooster]);
  
  // Обработчик покупки бустера за монеты
  const handleBuyBooster = (booster: Booster) => {
    if (coins >= booster.price) {
      const success = buyBooster(booster.id);
      
      if (success) {
        toast({
          title: "Бустер приобретен!",
          description: `${booster.name} успешно активирован.`,
        });
      }
    } else {
      toast({
        title: "Недостаточно монет",
        description: `Для покупки бустера не хватает ${booster.price - coins} монет.`,
        variant: "destructive",
      });
    }
  };
  
  // Обработчик покупки бустера за реальные деньги
  const handleBuyWithRealMoney = (booster: Booster) => {
    const user = getTelegramUser();
    
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Для покупки за реальные деньги необходимо подключить Telegram",
        variant: "destructive",
      });
      return;
    }
    
    if (booster.realPrice) {
      // Отправка уведомления о покупке
      notifyBoosterPurchase(user.id, booster.name, booster.realPrice);
      
      // Открытие платежной формы
      buyBoosterWithRealMoney(
        booster.id,
        booster.name,
        booster.realPrice,
        user.id
      );
    }
  };
  
  return (
    <div className="container max-w-md mx-auto px-4 pb-20 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Магазин бустеров</h1>
        <div className="flex items-center bg-muted/50 px-3 py-1.5 rounded-full">
          <Coins className="text-amber-500 w-4 h-4 mr-1.5" />
          <span className="font-medium">{coins.toFixed(0)}</span>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="coins">Множители клика</TabsTrigger>
          <TabsTrigger value="auto">Автосборщики</TabsTrigger>
        </TabsList>
        
        <TabsContent value="coins" className="space-y-4">
          {coinBoosters.map((booster) => (
            <BoosterCard
              key={booster.id}
              booster={booster}
              onBuyWithCoins={() => handleBuyBooster(booster)}
              onBuyWithRealMoney={() => handleBuyWithRealMoney(booster)}
              userCoins={coins}
            />
          ))}
        </TabsContent>
        
        <TabsContent value="auto" className="space-y-4">
          {autoBoosters.map((booster) => (
            <BoosterCard
              key={booster.id}
              booster={booster}
              onBuyWithCoins={() => handleBuyBooster(booster)}
              onBuyWithRealMoney={() => handleBuyWithRealMoney(booster)}
              userCoins={coins}
            />
          ))}
        </TabsContent>
      </Tabs>
      
      <Card className="mt-6">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">Что дают бустеры?</p>
            <ul className="list-disc list-inside text-muted-foreground mt-1 ml-1">
              <li>Множители увеличивают количество монет за клик</li>
              <li>Автосборщики приносят монеты даже когда вы не играете</li>
              <li>Временные бустеры дешевле постоянных</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <Navigation />
    </div>
  );
};

interface BoosterCardProps {
  booster: Booster;
  onBuyWithCoins: () => void;
  onBuyWithRealMoney: () => void;
  userCoins: number;
}

const BoosterCard: React.FC<BoosterCardProps> = ({ 
  booster, 
  onBuyWithCoins, 
  onBuyWithRealMoney,
  userCoins
}) => {
  const timeDisplay = booster.duration 
    ? booster.duration < 60 
      ? `${booster.duration} сек` 
      : `${Math.floor(booster.duration / 60)} мин`
    : 'Постоянно';
  
  return (
    <Card className={booster.active ? "border-primary" : ""}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <span className="text-2xl mr-2">{booster.icon}</span>
            <div>
              <h3 className="font-medium">{booster.name}</h3>
              <p className="text-xs text-muted-foreground">{timeDisplay}</p>
            </div>
          </div>
          {booster.active && (
            <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
              Активен
            </div>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">
          {booster.description}
        </p>
        
        {booster.active ? (
          <BoosterTimer booster={booster} />
        ) : (
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={onBuyWithCoins}
              disabled={userCoins < booster.price}
            >
              <Coins className="w-4 h-4 mr-1.5 text-amber-500" />
              {booster.price}
            </Button>
            
            {booster.realPrice && (
              <Button 
                variant="default" 
                size="sm" 
                className="flex-1"
                onClick={onBuyWithRealMoney}
              >
                {booster.realPrice} ₽
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShopPage;
