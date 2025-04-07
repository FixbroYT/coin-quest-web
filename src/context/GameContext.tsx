
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Coins, Map } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/apiService";

// Types
interface Player {
  id: number;
  tg_id: number;
  name: string;
  coins: number;
  total_earned: number;
  click_power: number;
  current_location: number;
}

interface Upgrade {
  id: number;
  name: string;
  description: string;
  base_cost: number;
  current_level: number;
  coin_multiplier: number;
  icon: string;
}

interface Location {
  id: number;
  name: string;
  description: string;
  unlock_cost: number;
  coin_multiplier: number;
  background: string;
  is_unlocked: boolean;
}

interface GameState {
  player: Player | null;
  upgrades: Upgrade[];
  locations: Location[];
  isBottomPanelOpen: boolean;
  activeTab: "upgrades" | "locations";
}

interface GameContextProps {
  gameState: GameState;
  addCoins: (amount: number) => void;
  purchaseUpgrade: (upgradeId: number) => void;
  unlockLocation: (locationId: number) => void;
  setCurrentLocation: (locationId: number) => void;
  toggleBottomPanel: () => void;
  setActiveTab: (tab: "upgrades" | "locations") => void;
  initializeUser: (tgId: number) => Promise<void>;
}

const initialGameState: GameState = {
  player: null,
  upgrades: [],
  locations: [],
  isBottomPanelOpen: false,
  activeTab: "upgrades"
};

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const { toast } = useToast();
  const [telegramId, setTelegramId] = useState<number | null>(null);
  
  // Initialize the game with user data from Telegram WebApp
  useEffect(() => {
    // Check if Telegram WebApp is available
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      // Init Telegram WebApp
      tg.expand();
      tg.ready();
      
      // Get user data
      const user = tg.initDataUnsafe?.user;
      if (user && user.id) {
        setTelegramId(user.id);
        initializeUser(user.id);
      }
      
      console.log("Telegram WebApp initialized");
    } else {
      console.log("Running outside of Telegram WebApp");
      // For testing purposes, use a mock ID
      const mockId = 12345;
      setTelegramId(mockId);
      initializeUser(mockId);
    }
  }, []);
  
  // Load game data
  const initializeUser = async (tgId: number) => {
    // Try to get user
    let userData = await apiService.getUserData(tgId);
    
    // If user doesn't exist, create a new one
    if (!userData) {
      await apiService.createUser(tgId);
      userData = await apiService.getUserData(tgId);
      if (!userData) {
        toast({
          title: "Error",
          description: "Failed to initialize user",
          variant: "destructive"
        });
        return;
      }
    }
    
    // Load upgrades and locations
    const upgrades = await apiService.getUpgrades();
    const locations = await apiService.getLocations();
    
    // Update game state
    setGameState({
      ...gameState,
      player: userData,
      upgrades: upgrades || [],
      locations: locations || []
    });
  };
  
  // Add coins to user balance
  const addCoins = async (amount: number) => {
    if (!gameState.player || !telegramId) return;
    
    const response = await apiService.addBalance(telegramId, amount);
    if (response) {
      setGameState(prevState => ({
        ...prevState,
        player: {
          ...prevState.player!,
          coins: response.new_balance
        }
      }));
    }
  };
  
  // Purchase an upgrade
  const purchaseUpgrade = async (upgradeId: number) => {
    if (!gameState.player || !telegramId) return;
    
    const response = await apiService.buyUpgrade(telegramId, upgradeId);
    if (response) {
      // Refresh user data and upgrades
      const userData = await apiService.getUserData(telegramId);
      const upgrades = await apiService.getUpgrades();
      
      setGameState(prevState => ({
        ...prevState,
        player: userData,
        upgrades: upgrades || prevState.upgrades
      }));
      
      toast({
        title: "Upgrade Purchased!",
        description: `You've upgraded to the next level.`
      });
    } else {
      toast({
        title: "Not enough coins",
        description: "You don't have enough coins to purchase this upgrade.",
        variant: "destructive"
      });
    }
  };
  
  // Unlock a location
  const unlockLocation = async (locationId: number) => {
    if (!gameState.player || !telegramId) return;
    
    const location = gameState.locations.find(l => l.id === locationId);
    
    if (location?.is_unlocked) {
      // If already unlocked, just set it as current
      setCurrentLocation(locationId);
      return;
    }
    
    const response = await apiService.buyLocation(telegramId, locationId);
    if (response) {
      // Refresh user data and locations
      const userData = await apiService.getUserData(telegramId);
      const locations = await apiService.getLocations();
      
      setGameState(prevState => ({
        ...prevState,
        player: userData,
        locations: locations || prevState.locations
      }));
      
      toast({
        title: "New Location Unlocked!",
        description: `You've unlocked a new location. Enjoy the new scenery!`
      });
    } else {
      toast({
        title: "Not enough coins",
        description: "You don't have enough coins to unlock this location.",
        variant: "destructive"
      });
    }
  };
  
  // Set current location
  const setCurrentLocation = async (locationId: number) => {
    if (!gameState.player || !telegramId) return;
    
    const response = await apiService.setLocation(telegramId, locationId);
    if (response) {
      // Refresh user data
      const userData = await apiService.getUserData(telegramId);
      
      setGameState(prevState => ({
        ...prevState,
        player: userData
      }));
    }
  };
  
  // Toggle bottom panel
  const toggleBottomPanel = () => {
    setGameState(prevState => ({
      ...prevState,
      isBottomPanelOpen: !prevState.isBottomPanelOpen
    }));
  };
  
  // Set active tab
  const setActiveTab = (tab: "upgrades" | "locations") => {
    setGameState(prevState => ({
      ...prevState,
      activeTab: tab
    }));
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        addCoins,
        purchaseUpgrade,
        unlockLocation,
        setCurrentLocation,
        toggleBottomPanel,
        setActiveTab,
        initializeUser
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
