export interface Booster {
  id: string;
  name: string;
  description: string;
  price: number;
  multiplier: number;
  duration: number; // в секундах
  icon: string;
}

export interface UserStats {
  coins: number;
  clickMultiplier: number;
  activeBooster?: Booster;
  boosterEndTime?: number;
  totalEarned: number;
  totalCashed: number;
}

export interface YoomoneyConfig {
  clientId: string;
  clientSecret: string;
  returnUrl: string;
}
