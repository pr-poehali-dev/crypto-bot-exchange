import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserStats, Booster } from '@/types';

interface GameState extends UserStats {
  addCoins: (amount: number) => void;
  activateBooster: (booster: Booster) => void;
  boosterExpired: () => void;
  cashOutCoins: (amount: number) => void;
  resetGame: () => void;
}

// Начальное состояние
const initialState: UserStats = {
  coins: 0,
  clickMultiplier: 1,
  totalEarned: 0,
  totalCashed: 0,
};

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      ...initialState,
      
      addCoins: (amount) => set((state) => {
        const earnedCoins = amount * state.clickMultiplier;
        return {
          coins: state.coins + earnedCoins,
          totalEarned: state.totalEarned + earnedCoins
        };
      }),
      
      activateBooster: (booster) => set((state) => {
        const now = Date.now();
        return {
          activeBooster: booster,
          clickMultiplier: booster.multiplier,
          boosterEndTime: now + (booster.duration * 1000)
        };
      }),
      
      boosterExpired: () => set((state) => ({
        activeBooster: undefined,
        boosterEndTime: undefined,
        clickMultiplier: 1
      })),
      
      cashOutCoins: (amount) => set((state) => ({
        coins: state.coins - amount,
        totalCashed: state.totalCashed + amount
      })),
      
      resetGame: () => set(initialState)
    }),
    {
      name: 'coin-clicker-storage'
    }
  )
);
