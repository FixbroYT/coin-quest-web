
import { useGameContext } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Zap, MousePointerClick, Coins } from "lucide-react";

const UpgradesTab = () => {
  const { gameState, purchaseUpgrade } = useGameContext();
  const { upgrades, player } = gameState;
  
  if (!player) {
    return <div>Loading upgrades...</div>;
  }
  
  const getUpgradeIcon = (upgradeName: string) => {
    if (upgradeName.toLowerCase().includes('double')) {
      return <Zap className="w-4 h-4" />;
    }
    return <MousePointerClick className="w-4 h-4" />;
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Upgrades</h3>
      <p className="text-sm text-muted-foreground">Improve your coin collection efficiency</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {upgrades.map(upgrade => {
          const upgradeLevel = player.upgrades.filter(id => id === upgrade.id).length;
          const canAfford = player.coins >= upgrade.cost;
          
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
                    {upgrade.cost}
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
                    Bonus: x{upgrade.bonus}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  onClick={() => purchaseUpgrade(upgrade.id)} 
                  disabled={!canAfford}
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
