
export interface Player {
  tg_id: number;
  coins: number;
  location: string;
  upgrades: number[];
  locations: string[];
}

export interface Upgrade {
  id: number;
  name: string;
  description: string;
  cost: number;
  bonus: number;
}

export interface Location {
  id: number;
  name: string;
  bonus_multiplier: number;
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
