
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTelegram } from "@/hooks/useTelegram";
import { GameState, GameContextProps } from "@/types/game";
import {
  loadUserData,
  loadUpgrades,
  loadLocations,
  addCoinsToBalance,
  buyUpgrade,
  buyLocation,
  setUserLocation,
  createNewUser
} from "@/services/gameService";

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
  const { telegramId } = useTelegram();
  
  // Initialize user when telegramId is available
  useEffect(() => {
    if (telegramId) {
      initializeUser(telegramId);
    }
  }, [telegramId]);
  
  // Load game data
  const initializeUser = async (tgId: number) => {
    // Try to get user
    let userData = await loadUserData(tgId);
    
    // If user doesn't exist, create a new one
    if (!userData) {
      userData = await createNewUser(tgId);
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
    const upgrades = await loadUpgrades();
    const locations = await loadLocations();
    
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
    
    const newBalance = await addCoinsToBalance(telegramId, amount);
    if (newBalance !== null) {
      setGameState(prevState => ({
        ...prevState,
        player: {
          ...prevState.player!,
          coins: newBalance
        }
      }));
    }
  };
  
  // Purchase an upgrade
  const purchaseUpgrade = async (upgradeId: number) => {
    if (!gameState.player || !telegramId) return;
    
    const result = await buyUpgrade(telegramId, upgradeId);
    if (result && result.success) {
      // Update player data with the new coins balance and upgrades
      const userData = await loadUserData(telegramId);
      
      setGameState(prevState => ({
        ...prevState,
        player: userData
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
    
    // Check if the location is already owned by the player
    const isLocationOwned = gameState.player.locations.some(
      loc => {
        // Find location name from ID
        const location = gameState.locations.find(l => l.id === locationId);
        return location && gameState.player?.locations.includes(location.name);
      }
    );
    
    if (isLocationOwned) {
      // If already unlocked, just set it as current
      setCurrentLocation(locationId);
      return;
    }
    
    const result = await buyLocation(telegramId, locationId);
    if (result && result.success) {
      // Refresh user data
      const userData = await loadUserData(telegramId);
      
      setGameState(prevState => ({
        ...prevState,
        player: userData
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
    
    const result = await setUserLocation(telegramId, locationId);
    if (result && result.success) {
      // Refresh user data
      const userData = await loadUserData(telegramId);
      
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
