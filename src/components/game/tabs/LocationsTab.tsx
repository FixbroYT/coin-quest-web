
import { useGameContext } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, MapPin, Check } from "lucide-react";

const LocationsTab = () => {
  const { gameState, unlockLocation } = useGameContext();
  const { locations, player } = gameState;
  
  if (!player) {
    return <div>Loading locations...</div>;
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Locations</h3>
      <p className="text-sm text-muted-foreground">Discover new places to collect coins</p>
      
      <div className="grid grid-cols-1 gap-4">
        {locations.map(location => {
          const isUnlocked = location.is_unlocked;
          const isCurrent = player.current_location === location.id;
          const canAfford = player.coins >= location.unlock_cost;
          
          return (
            <Card 
              key={location.id} 
              className={`${isUnlocked ? "" : "opacity-70"} overflow-hidden`}
            >
              <div className={`h-20 ${location.background || "bg-gradient-to-br from-blue-100 to-blue-200"}`}></div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {location.name}
                    {isCurrent && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        Current
                      </Badge>
                    )}
                  </CardTitle>
                  {!isUnlocked && (
                    <div className="text-amber-500 font-medium text-sm flex items-center gap-1">
                      <Coins className="w-3 h-3" />
                      {location.unlock_cost}
                    </div>
                  )}
                  {isUnlocked && (
                    <Badge variant="secondary" className="text-xs">
                      <Check className="w-3 h-3 mr-1" />
                      Unlocked
                    </Badge>
                  )}
                </div>
                <CardDescription>{location.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-sm">
                  Coin multiplier: x{location.coin_multiplier}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  onClick={() => unlockLocation(location.id)} 
                  disabled={!canAfford && !isUnlocked}
                  className="w-full"
                  variant={isUnlocked ? (isCurrent ? "secondary" : "outline") : (canAfford ? "default" : "outline")}
                >
                  {isUnlocked 
                    ? (isCurrent ? "Current Location" : "Travel Here") 
                    : (canAfford ? "Unlock" : "Not Enough Coins")}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default LocationsTab;
