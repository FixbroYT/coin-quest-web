
import { useState, useEffect } from "react";
import { useGameContext } from "@/context/GameContext";
import { useTelegram } from "@/hooks/useTelegram";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Zap, MousePointerClick, Coins } from "lucide-react";
import { getUpgradeCost } from "@/services/gameService";

const UpgradesTab = () => {
  const { gameState, purchaseUpgrade } = useGameContext();
  const { telegramId } = useTelegram();
  const { upgrades, player } = gameState;
  const [upgradeCosts, setUpgradeCosts] = useState<{[key: number]: number}>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Fetch upgrade costs when the tab is shown and after each upgrade purchase
  useEffect(() => {
    const fetchUpgradeCosts = async () => {
      if (!telegramId || !upgrades.length) return;
      
      setIsLoading(true);
      const costs: {[key: number]: number} = {};
      
      for (const upgrade of upgrades) {
        const cost = await getUpgradeCost(telegramId, upgrade.id);
        if (cost !== null) {
          costs[upgrade.id] = cost;
        } else {
          costs[upgrade.id] = upgrade.cost; // Use default cost if API fails
        }
      }
      
      setUpgradeCosts(costs);
      setIsLoading(false);
    };
    
    fetchUpgradeCosts();
  }, [telegramId, upgrades, player?.upgrades]);
  
  if (!player) {
    return <div>Loading upgrades...</div>;
  }
  
  const getUpgradeIcon = (upgradeName: string) => {
    if (upgradeName.toLowerCase().includes('double') || upgradeName.toLowerCase().includes('income')) {
      return <Zap className="w-4 h-4" />;
    }
    return <MousePointerClick className="w-4 h-4" />;
  };
  
  const getUpgradeCostForDisplay = (upgradeId: number) => {
    return upgradeCosts[upgradeId] || 0;
  };
  
  const handlePurchaseUpgrade = async (upgradeId: number) => {
    await purchaseUpgrade(upgradeId);
    // Costs will be updated automatically by the useEffect
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Upgrades</h3>
      <p className="text-sm text-muted-foreground">Improve your coin collection efficiency</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {upgrades.map(upgrade => {
          // Find player's upgrade level (count) for this upgrade
          const playerUpgrade = player.upgrades.find(u => u.id === upgrade.id);
          const upgradeLevel = playerUpgrade ? playerUpgrade.count : 0;
          const upgradeCost = getUpgradeCostForDisplay(upgrade.id);
          const canAfford = player.coins >= upgradeCost;
          
          return (
            <Card key={upgrade.id} className={`${canAfford ? "" : "opacity-70"}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base flex items-center gap-2">
                    {getUpgradeIcon(upgrade.name)}
                    {upgrade.name}
                  </CardTitle>
                  <div className="text-amber-500 font-medium text-sm flex items-center gap-1">
                    <Coins className="w-3 h-3" />
                    {isLoading ? "..." : upgradeCost}
                  </div>
                </div>
                <CardDescription>{upgrade.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Level</span>
                    <span>{upgradeLevel || 0}</span>
                  </div>
                  <Progress value={upgradeLevel % 10 * 10} className="h-2" />
                  <div className="text-sm text-muted-foreground mt-2">
                    Bonus: +{upgrade.bonus}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  onClick={() => handlePurchaseUpgrade(upgrade.id)} 
                  disabled={!canAfford || isLoading}
                  className="w-full"
                  variant={canAfford ? "default" : "outline"}
                >
                  {upgradeLevel === 0 ? "Purchase" : "Upgrade"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default UpgradesTab;
