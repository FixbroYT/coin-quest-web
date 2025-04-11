
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
  const currentLocation = gameState.locations && Array.isArray(gameState.locations) ? 
    gameState.locations.find(location => location.name === currentLocationName) : null;
  
  // Initialize user only once when component mounts
  useEffect(() => {
    console.log("Game component mounted, initializing user");
    
    // Initialize with dev ID only once
    initializeUser(12345);
  }, []); // Empty dependency array ensures this runs only once
  
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
      case 'farm':
        return "bg-gradient-to-br from-amber-100 to-amber-300";
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
