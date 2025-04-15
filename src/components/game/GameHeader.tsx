
import { useGameContext } from "@/context/GameContext";
import { Coins, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import PlayerProfile from "./PlayerProfile";
import { useEffect, useState } from "react";

const GameHeader = () => {
  const { gameState, initializeUser } = useGameContext();
  const [balance, setBalance] = useState<number>(0);
  
  // Update balance from state whenever it changes
  useEffect(() => {
    if (gameState.player) {
      setBalance(Math.floor(gameState.player.coins));
    }
  }, [gameState.player]);
  
  // Set up periodic balance refresh
  useEffect(() => {
    // If no player, don't set up interval
    if (!gameState.player) return;
    
    // Function to refresh player data
    const refreshBalance = async () => {
      if (!gameState.player?.tg_id) return;
      
      try {
        await initializeUser(gameState.player.tg_id);
      } catch (error) {
        console.error("Failed to refresh balance:", error);
      }
    };
    
    // Initial refresh
    refreshBalance();
    
    // Set up interval for regular refreshes - every 5 seconds
    const intervalId = setInterval(refreshBalance, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [gameState.player, initializeUser]);
  
  return (
    <div className="fixed top-0 inset-x-0 z-10 bg-gradient-to-b from-background/80 to-background/0 backdrop-blur-sm py-2">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center space-x-2">
          <Coins className="w-5 h-5 text-yellow-500" />
          <div className="font-semibold">
            {balance.toLocaleString()}
          </div>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[85vw] sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Player Profile</SheetTitle>
            </SheetHeader>
            <PlayerProfile />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default GameHeader;
