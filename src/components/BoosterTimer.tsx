import { useState, useEffect } from 'react';
import { useGameStore, Booster } from '@/lib/store';
import { Progress } from '@/components/ui/progress';

interface BoosterTimerProps {
  booster: Booster;
}

const BoosterTimer: React.FC<BoosterTimerProps> = ({ booster }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(100);
  const deactivateBooster = useGameStore(state => state.deactivateBooster);
  
  useEffect(() => {
    if (!booster.active || !booster.endsAt || booster.duration === 0) return;
    
    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = booster.endsAt! - now;
      
      if (difference <= 0) {
        setTimeLeft(0);
        setProgress(0);
        deactivateBooster(booster.id);
        return;
      }
      
      setTimeLeft(Math.ceil(difference / 1000));
      const progressValue = (difference / (booster.duration * 1000)) * 100;
      setProgress(progressValue);
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [booster, deactivateBooster]);
  
  if (!booster.active || booster.duration === 0) return null;
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };
  
  return (
    <div className="w-full mt-2">
      <div className="flex justify-between text-xs mb-1">
        <span>Осталось</span>
        <span className="font-medium">{formatTime(timeLeft)}</span>
      </div>
      <Progress value={progress} className="h-1.5" />
    </div>
  );
};

export default BoosterTimer;
