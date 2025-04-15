
import { useState, useEffect } from "react";
import { useGameContext } from "@/context/GameContext";
import { useTelegram } from "@/hooks/useTelegram";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, MapPin, Check } from "lucide-react";
import { getLocationCost } from "@/services/gameService";

const LocationsTab = () => {
  const { gameState, unlockLocation } = useGameContext();
  const { locations, player } = gameState;
  const [locationCosts, setLocationCosts] = useState<{[key: number]: number}>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Load location costs
  useEffect(() => {
    const fetchLocationCosts = async () => {
      if (!locations.length) return;
      
      setIsLoading(true);
      const costs: {[key: number]: number} = {};
      
      for (const location of locations) {
        if (location.id === 1) {
          // First location is always free
          costs[location.id] = 0;
        } else {
          const cost = await getLocationCost(location.id);
          if (cost !== null) {
            costs[location.id] = cost;
          } else {
            costs[location.id] = 100 * location.id; // Fallback calculation
          }
        }
      }
      
      setLocationCosts(costs);
      setIsLoading(false);
    };
    
    fetchLocationCosts();
  }, [locations]);
  
  if (!player) {
    return <div>Loading locations...</div>;
  }
  
  // Helper function to check if a location is unlocked
  const isLocationUnlocked = (locationName: string) => {
    return player.locations.includes(locationName);
  };
  
  // Helper function to get location background
  const getLocationBackground = (locationName: string) => {
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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Locations</h3>
      <p className="text-sm text-muted-foreground">Discover new places to collect coins</p>
      
      <div className="grid grid-cols-1 gap-4">
        {locations.map(location => {
          const isUnlocked = isLocationUnlocked(location.name);
          const isCurrent = player.location === location.name;
          const background = getLocationBackground(location.name);
          const cost = locationCosts[location.id] || 0;
          const canAfford = player.coins >= cost;
          const isFirstLocation = location.id === 1;
          
          return (
            <Card 
              key={location.id} 
              className={`${isUnlocked ? "" : "opacity-70"} overflow-hidden`}
            >
              <div className={`h-20 ${background}`}></div>
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
                  {!isUnlocked && !isFirstLocation && (
                    <div className="text-amber-500 font-medium text-sm flex items-center gap-1">
                      <Coins className="w-3 h-3" />
                      {isLoading ? "..." : cost}
                    </div>
                  )}
                  {isFirstLocation && !isUnlocked && (
                    <Badge variant="secondary" className="text-xs">
                      Free Starter Location
                    </Badge>
                  )}
                  {isUnlocked && (
                    <Badge variant="secondary" className="text-xs">
                      <Check className="w-3 h-3 mr-1" />
                      Unlocked
                    </Badge>
                  )}
                </div>
                <CardDescription>Bonus multiplier: x{location.bonus_multiplier}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-sm">
                  {isFirstLocation 
                    ? "Your starting location. A perfect place for beginners!"
                    : "Explore this location to earn more coins!"}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  onClick={() => unlockLocation(location.id)} 
                  disabled={(!canAfford && !isUnlocked) || isLoading}
                  className="w-full"
                  variant={isUnlocked ? (isCurrent ? "secondary" : "outline") : (canAfford || isFirstLocation ? "default" : "outline")}
                >
                  {isUnlocked 
                    ? (isCurrent ? "Current Location" : "Travel Here") 
                    : (isFirstLocation ? "Unlock (Free)" : (canAfford ? "Unlock" : "Not Enough Coins"))}
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
