import { useEffect } from 'react';
import CoinClicker from '@/components/CoinClicker';
import BoosterTimer from '@/components/BoosterTimer';
import Navigation from '@/components/Navigation';
import { initTelegramWebApp } from '@/lib/telegram';
import { useGameStore } from '@/lib/store';

const Index = () => {
  const { coins, clickMultiplier } = useGameStore();
  
  useEffect(() => {
    // Инициализируем Telegram WebApp если он доступен
    initTelegramWebApp();
    
    // Устанавливаем заголовок страницы
    document.title = 'Кликер монет';
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 border-b flex justify-between items-center">
        <h1 className="text-xl font-bold">Монеты: {coins.toFixed(0)}</h1>
        {clickMultiplier > 1 && (
          <div className="bg-accent/20 px-3 py-1 rounded-full text-sm">
            x{clickMultiplier}
          </div>
        )}
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <CoinClicker />
        
        <div className="mt-6 w-full max-w-md">
          <BoosterTimer />
        </div>
      </main>
      
      <Navigation />
    </div>
  );
};

export default Index;
