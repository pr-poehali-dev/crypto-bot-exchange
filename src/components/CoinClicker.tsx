import { useState, useCallback, useEffect, useRef } from 'react';
import { useGameStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface CoinFloatProps {
  position: { x: number; y: number };
  value: number;
  onComplete: () => void;
}

const CoinFloat: React.FC<CoinFloatProps> = ({ position, value, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className="absolute pointer-events-none animate-coin-float z-10 font-bold text-lg"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        color: value > 1 ? 'hsl(var(--gold))' : 'white'
      }}
    >
      +{value}
    </div>
  );
};

const CoinClicker: React.FC = () => {
  const { coins, clickMultiplier, coinsPerSecond, addCoins } = useGameStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const [floatingCoins, setFloatingCoins] = useState<Array<{ id: number; x: number; y: number; value: number }>>([]);
  const nextIdRef = useRef(0);
  
  const handleCoinClick = useCallback((e: React.MouseEvent) => {
    // Начинаем анимацию нажатия
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);
    
    // Добавляем монеты
    addCoins(1);
    
    // Добавляем анимацию плавающих монет
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    setFloatingCoins(prev => [
      ...prev, 
      { 
        id: nextIdRef.current++, 
        x: clickX, 
        y: clickY,
        value: clickMultiplier
      }
    ]);
  }, [addCoins, clickMultiplier]);
  
  const removeFloatingCoin = useCallback((id: number) => {
    setFloatingCoins(prev => prev.filter(coin => coin.id !== id));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-4xl font-bold mb-6 text-center">
        {coins.toFixed(0)}
        <div className="text-lg text-muted-foreground">монет</div>
      </div>
      
      <div className="relative">
        <button
          onClick={handleCoinClick}
          className={cn(
            "w-40 h-40 rounded-full bg-gold-light relative overflow-hidden",
            "shadow-[0_0_30px_rgba(255,215,0,0.3)]",
            "border-4 border-gold",
            "active:shadow-[0_0_10px_rgba(255,215,0,0.3)]",
            "focus:outline-none",
            "coin-shine",
            isAnimating && "animate-coin-tap"
          )}
        >
          <div className="absolute inset-2 rounded-full bg-gold flex items-center justify-center">
            <span className="text-yellow-900 text-opacity-30 text-5xl font-bold">₽</span>
          </div>
        </button>
        
        {floatingCoins.map(coin => (
          <CoinFloat 
            key={coin.id}
            position={{ x: coin.x, y: coin.y }}
            value={coin.value}
            onComplete={() => removeFloatingCoin(coin.id)}
          />
        ))}
      </div>
      
      <div className="mt-6 flex flex-col items-center gap-2">
        {clickMultiplier > 1 && (
          <div className="px-4 py-2 bg-accent/80 text-accent-foreground rounded-full text-sm font-medium animate-pulse">
            Клик: x{clickMultiplier}
          </div>
        )}
        
        {coinsPerSecond > 0 && (
          <div className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
            +{coinsPerSecond} монет/сек
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinClicker;
