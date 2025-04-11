
import { useEffect } from "react";
import { useGameContext } from "@/context/GameContext";
import CoinButton from "./CoinButton";
import GameHeader from "./GameHeader";
import BottomPanel from "./BottomPanel";

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          show: () => void;
          hide: () => void;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
        };
        initDataUnsafe?: {
          user?: {
            id: number;
            username?: string;
            first_name?: string;
            last_name?: string;
          }
        }
      };
    };
  }
}

const Game = () => {
  const { gameState, initializeUser } = useGameContext();
  
  const currentLocationName = gameState.player?.location || "";
  const currentLocation = gameState.locations.find(
    location => location.name === currentLocationName
  );
  
  // Detect if we're running in Telegram WebApp
  useEffect(() => {
    // Check if Telegram WebApp is available
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      // Init Telegram WebApp
      tg.expand();
      tg.ready();
      
      // Log user information
      const initDataUnsafe = tg.initDataUnsafe;
      console.log("Telegram User in Game component:", initDataUnsafe?.user);
      
      // Try to manually initialize if no player data
      if (!gameState.player && initDataUnsafe?.user?.id) {
        console.log("Manual initialization with ID:", initDataUnsafe.user.id);
        initializeUser(initDataUnsafe.user.id);
      } else if (!gameState.player && process.env.NODE_ENV === 'development') {
        console.log("Manual initialization with dev ID in Game component");
        initializeUser(12345); // Development ID
      }
      
      console.log("Telegram WebApp initialized");
    } else {
      console.log("Running outside of Telegram WebApp");
      
      // For development, try manual initialization if no player data
      if (!gameState.player && process.env.NODE_ENV === 'development') {
        console.log("Manual initialization with dev ID in Game component");
        initializeUser(12345); // Development ID
      }
    }
  }, [gameState.player, initializeUser]);
  
  // Get background class based on location name
  const getBackgroundClass = (locationName?: string) => {
    if (!locationName) return "bg-gradient-to-br from-blue-100 to-blue-200";
    
    switch(locationName.toLowerCase()) {
      case 'forest':
        return "bg-gradient-to-br from-green-100 to-green-300";
      case 'city':
        return "bg-gradient-to-br from-blue-300 to-blue-500";
      case 'mountain':
        return "bg-gradient-to-br from-stone-200 to-stone-400";
      default:
        return "bg-gradient-to-br from-blue-100 to-blue-200";
    }
  };
  
  return (
    <main className={`min-h-screen pt-16 pb-20 ${getBackgroundClass(currentLocationName)}`}>
      <GameHeader />
      
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)]">
        <CoinButton />
      </div>
      
      <BottomPanel />
    </main>
  );
};

export default Game;
