import { useEffect, useState } from 'react';
import { useGameStore } from '@/lib/store';
import { Progress } from '@/components/ui/progress';

const BoosterTimer = () => {
  const { activeBooster, boosterEndTime, boosterExpired } = useGameStore();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!activeBooster || !boosterEndTime) {
      setTimeLeft(null);
      return;
    }

    const totalDuration = activeBooster.duration * 1000;
    
    const updateTimer = () => {
      const now = Date.now();
      const remaining = boosterEndTime - now;
      
      if (remaining <= 0) {
        setTimeLeft(0);
        boosterExpired();
        return;
      }
      
      setTimeLeft(Math.ceil(remaining / 1000));
      setProgress((remaining / totalDuration) * 100);
    };

    // Обновить сразу
    updateTimer();
    
    // Установить интервал обновления
    const timerId = setInterval(updateTimer, 1000);
    
    return () => clearInterval(timerId);
  }, [activeBooster, boosterEndTime, boosterExpired]);

  if (!activeBooster || !timeLeft) return null;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md p-4 bg-muted rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="font-medium">
          {activeBooster.name}
        </div>
        <div className="text-sm">
          {formatTime(timeLeft)}
        </div>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default BoosterTimer;
