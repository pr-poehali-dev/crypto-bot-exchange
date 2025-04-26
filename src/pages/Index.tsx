import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import CoinClicker from '@/components/CoinClicker';
import Navigation from '@/components/Navigation';
import TelegramConnect from '@/components/TelegramConnect';
import { initTelegramWebApp } from '@/lib/telegram';
import { useGameStore } from '@/lib/store';

const Index: React.FC = () => {
  const { activeBoosters, boosters } = useGameStore();
  
  // Отфильтруем только активные временные бустеры
  const activeTempBoosters = boosters.filter(
    booster => booster.active && booster.duration > 0
  );
  
  useEffect(() => {
    // Инициализация Telegram WebApp
    initTelegramWebApp();
  }, []);
  
  return (
    <div className="container max-w-md mx-auto px-4 pb-20 pt-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">Тапалка Монет</h1>
        <p className="text-muted-foreground">Тапай и зарабатывай реальные деньги!</p>
      </div>
      
      <TelegramConnect />
      
      <div className="flex flex-col items-center justify-center py-12">
        <CoinClicker />
      </div>
      
      {activeTempBoosters.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Активные бустеры</h2>
          <div className="space-y-2">
            {activeTempBoosters.map(booster => (
              <Card key={booster.id} className="p-3 bg-primary/5 border-primary/20">
                <div className="flex items-center">
                  <span className="text-xl mr-2">{booster.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-sm">{booster.name}</h3>
                      <span className="text-xs text-primary">x{booster.multiplier}</span>
                    </div>
                    <BoosterProgressBar booster={booster} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
        <p className="text-sm text-muted-foreground">
          Приходи ежедневно, чтобы заработать больше монет!
          Купи бустеры в магазине и увеличь свой доход.
        </p>
      </div>
      
      <Navigation />
    </div>
  );
};

// Упрощенная версия прогресс-бара для бустера
const BoosterProgressBar = ({ booster }: { booster: { endsAt?: number; duration: number } }) => {
  if (!booster.endsAt || booster.duration === 0) return null;
  
  const now = Date.now();
  const timeLeft = Math.max(0, (booster.endsAt - now) / 1000);
  const progress = (timeLeft / booster.duration) * 100;
  
  // Форматирование времени
  const minutes = Math.floor(timeLeft / 60);
  const seconds = Math.floor(timeLeft % 60);
  const timeDisplay = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  
  return (
    <div className="w-full mt-1">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">Осталось</span>
        <span>{timeDisplay}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className="bg-primary h-1.5 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default Index;
