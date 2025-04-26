import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Booster {
  id: string;
  name: string;
  description: string;
  multiplier: number;
  duration: number; // в секундах, 0 = постоянный
  price: number; // в монетах
  realPrice?: number; // в рублях (если можно купить за реальные деньги)
  icon: string;
  active: boolean;
  endsAt?: number; // время окончания действия бустера
}

interface GameState {
  coins: number;
  clickMultiplier: number;
  coinsPerSecond: number;
  earnedTotal: number;
  withdrawnTotal: number;
  boosters: Booster[];
  activeBoosters: string[];
  // Действия с монетами
  addCoins: (amount: number) => void;
  withdrawCoins: (amount: number) => void;
  // Действия с бустерами
  buyBooster: (boosterId: string) => boolean;
  activateBooster: (boosterId: string) => void;
  deactivateBooster: (boosterId: string) => void;
  checkBoosterStatus: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      coins: 0,
      clickMultiplier: 1,
      coinsPerSecond: 0,
      earnedTotal: 0,
      withdrawnTotal: 0,
      boosters: [
        {
          id: 'click-multiplier-2x',
          name: 'Удвоение клика',
          description: 'Удваивает монеты за каждый клик на 10 минут',
          multiplier: 2,
          duration: 600, // 10 минут
          price: 100,
          realPrice: 50,
          icon: '✌️',
          active: false
        },
        {
          id: 'click-multiplier-5x',
          name: 'Множитель клика x5',
          description: 'Увеличивает получение монет в 5 раз на 5 минут',
          multiplier: 5,
          duration: 300, // 5 минут
          price: 500,
          realPrice: 100,
          icon: '🖐️',
          active: false
        },
        {
          id: 'auto-clicker-1',
          name: 'Автоматический сборщик',
          description: 'Приносит 1 монету в секунду постоянно',
          multiplier: 1,
          duration: 0, // постоянный
          price: 1000,
          realPrice: 200,
          icon: '🤖',
          active: false
        },
        {
          id: 'auto-clicker-5',
          name: 'Продвинутый автосборщик',
          description: 'Приносит 5 монет в секунду постоянно',
          multiplier: 5,
          duration: 0, // постоянный
          price: 3000,
          realPrice: 500,
          icon: '⚡',
          active: false
        },
        {
          id: 'click-multiplier-10x',
          name: 'Множитель клика x10',
          description: 'Увеличивает получение монет в 10 раз на 2 минуты',
          multiplier: 10,
          duration: 120, // 2 минуты
          price: 2000,
          realPrice: 300,
          icon: '🔟',
          active: false
        }
      ],
      activeBoosters: [],

      addCoins: (amount) => {
        const { clickMultiplier } = get();
        const adjustedAmount = amount * clickMultiplier;
        set((state) => ({ 
          coins: state.coins + adjustedAmount,
          earnedTotal: state.earnedTotal + adjustedAmount
        }));
      },

      withdrawCoins: (amount) => {
        set((state) => {
          if (state.coins >= amount) {
            return { 
              coins: state.coins - amount,
              withdrawnTotal: state.withdrawnTotal + amount
            };
          }
          return state;
        });
      },

      buyBooster: (boosterId) => {
        const { boosters, coins } = get();
        const booster = boosters.find(b => b.id === boosterId);
        
        if (!booster || booster.price > coins) return false;
        
        set((state) => ({
          coins: state.coins - booster.price,
          boosters: state.boosters.map(b => 
            b.id === boosterId 
              ? { ...b, active: true, endsAt: b.duration > 0 ? Date.now() + b.duration * 1000 : undefined } 
              : b
          ),
          activeBoosters: [...state.activeBoosters, boosterId]
        }));
        
        return true;
      },

      activateBooster: (boosterId) => {
        const { boosters } = get();
        const booster = boosters.find(b => b.id === boosterId);
        
        if (!booster) return;
        
        let newClickMultiplier = get().clickMultiplier;
        let newCoinsPerSecond = get().coinsPerSecond;
        
        // Обработка разных типов бустеров
        if (boosterId.includes('click-multiplier')) {
          newClickMultiplier = booster.multiplier;
        } else if (boosterId.includes('auto-clicker')) {
          newCoinsPerSecond += booster.multiplier;
        }
        
        set((state) => ({
          clickMultiplier: newClickMultiplier,
          coinsPerSecond: newCoinsPerSecond,
          boosters: state.boosters.map(b => 
            b.id === boosterId 
              ? { ...b, active: true, endsAt: b.duration > 0 ? Date.now() + b.duration * 1000 : undefined } 
              : b
          ),
          activeBoosters: [...state.activeBoosters, boosterId]
        }));
      },

      deactivateBooster: (boosterId) => {
        const { boosters } = get();
        const booster = boosters.find(b => b.id === boosterId);
        
        if (!booster) return;
        
        let newClickMultiplier = 1; // Сбрасываем к базовому
        let newCoinsPerSecond = get().coinsPerSecond;
        
        // Обработка разных типов бустеров
        if (boosterId.includes('click-multiplier')) {
          newClickMultiplier = 1;
        } else if (boosterId.includes('auto-clicker')) {
          newCoinsPerSecond -= booster.multiplier;
        }
        
        set((state) => ({
          clickMultiplier: newClickMultiplier,
          coinsPerSecond: newCoinsPerSecond,
          boosters: state.boosters.map(b => 
            b.id === boosterId ? { ...b, active: false, endsAt: undefined } : b
          ),
          activeBoosters: state.activeBoosters.filter(id => id !== boosterId)
        }));
      },

      checkBoosterStatus: () => {
        const { boosters, activeBoosters } = get();
        const now = Date.now();
        
        // Проверяем каждый активный бустер
        for (const boosterId of activeBoosters) {
          const booster = boosters.find(b => b.id === boosterId);
          if (booster && booster.duration > 0 && booster.endsAt && booster.endsAt <= now) {
            get().deactivateBooster(boosterId);
          }
        }
      }
    }),
    {
      name: 'game-storage',
    }
  )
);

// Функция для запуска пассивного заработка
export const startPassiveEarning = () => {
  const interval = setInterval(() => {
    const { coinsPerSecond, addCoins, checkBoosterStatus } = useGameStore.getState();
    
    // Проверяем статус всех бустеров
    checkBoosterStatus();
    
    // Если есть пассивный доход, добавляем его
    if (coinsPerSecond > 0) {
      addCoins(coinsPerSecond);
    }
  }, 1000);
  
  return interval;
};
