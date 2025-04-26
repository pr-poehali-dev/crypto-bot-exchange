import { useEffect } from "react";
import CoinClicker from "@/components/CoinClicker";
import Navigation from "@/components/Navigation";
import BoosterTimer from "@/components/BoosterTimer";
import { useGameStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { initTelegramWebApp, getTelegramUser } from "@/lib/telegram";
import TelegramConnect from "@/components/TelegramConnect";

const Index = () => {
  const { coins, clickMultiplier, coinsPerSecond } = useGameStore();
  
  useEffect(() => {
    // Инициализируем Telegram WebApp
    initTelegramWebApp();
    
    // Проверяем пользователя Telegram
    const user = getTelegramUser();
    if (user) {
      console.log('Telegram user:', user);
    } else {
      console.log('Standalone mode or user not authorized');
    }
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen">
      <div className="flex flex-col items-center justify-center flex-grow gap-8">
        <div className="w-full max-w-lg">
          <TelegramConnect />
        </div>
        
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Монеты: {coins.toFixed(0)}</CardTitle>
            <CardDescription className="text-center">
              {clickMultiplier > 1 && `🔥 Множитель клика: x${clickMultiplier}`}
              {coinsPerSecond > 0 && ` • 🤖 ${coinsPerSecond} монет/сек`}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center p-6">
            <CoinClicker />
          </CardContent>
        </Card>
        
        <BoosterTimer />
      </div>
      
      <Navigation />
    </div>
  );
};

export default Index;
