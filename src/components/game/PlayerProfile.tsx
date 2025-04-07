
import { useGameContext } from "@/context/GameContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Coins, Zap, Map, User } from "lucide-react";

const PlayerProfile = () => {
  const { gameState } = useGameContext();
  const { player, locations } = gameState;
  
  if (!player) {
    return (
      <div className="flex flex-col gap-4 py-4">
        <p>Loading player profile...</p>
      </div>
    );
  }
  
  // Calculate progress metrics
  const totalLocations = locations.length;
  const unlockedLocations = locations.filter(l => l.is_unlocked).length;
  const locationsProgress = totalLocations > 0 ? (unlockedLocations / totalLocations) * 100 : 0;
  
  // Find current location
  const currentLocation = locations.find(loc => loc.id === player.current_location);
  
  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Player #{player.tg_id}</h3>
          <p className="text-sm text-muted-foreground">Coin Collector</p>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-yellow-500" />
              <span className="text-sm">Coins</span>
            </div>
            <span className="font-medium">{Math.floor(player.coins).toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="text-sm">Click Power</span>
            </div>
            <span className="font-medium">{player.click_power}</span>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <Map className="w-4 h-4 text-green-500" />
                <span>Locations</span>
              </div>
              <span>{unlockedLocations}/{totalLocations}</span>
            </div>
            <Progress value={locationsProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Current Location</CardTitle>
        </CardHeader>
        <CardContent>
          {currentLocation?.name || "Unknown"}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerProfile;
