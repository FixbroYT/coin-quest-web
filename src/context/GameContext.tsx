
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
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
  createNewUser,
  getUserIncome
} from "@/services/gameService";

const initialGameState: GameState = {
  player: null,
  upgrades: [],
  locations: [],
  isBottomPanelOpen: false,
  activeTab: "upgrades",
  income: 0
};

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { telegramId } = useTelegram();
  
  // Initialize user when telegramId is available
  useEffect(() => {
    if (telegramId && !isInitialized && !isLoading) {
      console.log("Initializing user with telegramId:", telegramId);
      initializeUser(telegramId);
    }
  }, [telegramId, isInitialized, isLoading]);
  
  // Memoized initialization function to prevent re-creation on each render
  const initializeUser = useCallback(async (tgId: number) => {
    if (isLoading || isInitialized) return;
    
    console.log("Starting user initialization for ID:", tgId);
    setIsLoading(true);
    
    try {
      // Try to get user
      let userData = await loadUserData(tgId);
      console.log("Loaded user data:", userData);
      
      // If user doesn't exist, create a new one
      if (!userData) {
        console.log("No user data found, creating new user");
        userData = await createNewUser(tgId);
        if (!userData) {
          console.error("Failed to create new user");
          toast({
            title: "Error",
            description: "Failed to initialize user",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
        console.log("New user created:", userData);
      } else {
        console.log("Existing user found:", userData);
      }
      
      // Load upgrades and locations
      const [upgrades, locations, income] = await Promise.all([
        loadUpgrades(),
        loadLocations(),
        getUserIncome(tgId)
      ]);
      
      console.log("Loaded upgrades:", upgrades);
      console.log("Loaded locations:", locations);
      console.log("Loaded income:", income);
      
      // Update game state
      setGameState({
        player: userData,
        upgrades: upgrades || [],
        locations: locations || [],
        isBottomPanelOpen: false,
        activeTab: "upgrades",
        income: income?.income || 1
      });
      
      setIsInitialized(true);
    } catch (error) {
      console.error("Initialization error:", error);
      toast({
        title: "Error",
        description: "Failed to initialize game data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, isLoading, isInitialized]);
  
  // Get player's current income - only call when necessary
  const getPlayerIncome = useCallback(async (tgId: number) => {
    if (!tgId) return;
    
    const incomeData = await getUserIncome(tgId);
    console.log("Player income:", incomeData);
    
    if (incomeData !== null) {
      setGameState(prevState => ({
        ...prevState,
        income: incomeData?.income || prevState.income
      }));
    }
    
    return incomeData;
  }, []);
  
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
  
  // Purchase an upgrade - only update data when necessary
  const purchaseUpgrade = async (upgradeId: number) => {
    if (!gameState.player || !telegramId) return;
    
    const result = await buyUpgrade(telegramId, upgradeId);
    if (result && result.success) {
      // Update player data with the new coins balance and upgrades
      const [userData, incomeData] = await Promise.all([
        loadUserData(telegramId),
        getUserIncome(telegramId)
      ]);
      
      setGameState(prevState => ({
        ...prevState,
        player: userData,
        income: incomeData?.income || prevState.income
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
  
  // Unlock a location - with optimized data loading
  const unlockLocation = async (locationId: number) => {
    if (!gameState.player || !telegramId) return;
    
    // Check if the location is already owned by the player
    const location = gameState.locations.find(loc => loc.id === locationId);
    const isLocationOwned = location && gameState.player.locations.includes(location.name);
    
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
  
  // Set current location - with optimized data loading
  const setCurrentLocation = async (locationId: number) => {
    if (!gameState.player || !telegramId) return;
    
    const result = await setUserLocation(telegramId, locationId);
    if (result && result.success) {
      // Fetch updated data in parallel
      const [userData, incomeData] = await Promise.all([
        loadUserData(telegramId),
        getUserIncome(telegramId)
      ]);
      
      setGameState(prevState => ({
        ...prevState,
        player: userData,
        income: incomeData?.income || prevState.income
      }));
    }
  };
  
  // Toggle bottom panel - pure UI state, no API calls
  const toggleBottomPanel = () => {
    setGameState(prevState => ({
      ...prevState,
      isBottomPanelOpen: !prevState.isBottomPanelOpen
    }));
  };
  
  // Set active tab - pure UI state, no API calls
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
        initializeUser,
        getPlayerIncome
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
