export interface Player {
  id: number;
  tg_id: number;
  name: string;
  coins: number;
  total_earned: number;
  click_power: number;
  current_location: number;
}

export interface Upgrade {
  id: number;
  name: string;
  description: string;
  base_cost: number;
  current_level: number;
  coin_multiplier: number;
  icon: string;
}

export interface Location {
  id: number;
  name: string;
  description: string;
  unlock_cost: number;
  coin_multiplier: number;
  background: string;
  is_unlocked: boolean;
}

export interface GameState {
  player: Player | null;
  upgrades: Upgrade[];
  locations: Location[];
  isBottomPanelOpen: boolean;
  activeTab: "upgrades" | "locations";
}

export interface GameContextProps {
  gameState: GameState;
  addCoins: (amount: number) => void;
  purchaseUpgrade: (upgradeId: number) => void;
  unlockLocation: (locationId: number) => void;
  setCurrentLocation: (locationId: number) => void;
  toggleBottomPanel: () => void;
  setActiveTab: (tab: "upgrades" | "locations") => void;
  initializeUser: (tgId: number) => Promise<void>;
}
