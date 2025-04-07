
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
