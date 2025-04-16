
import { useState, useRef } from "react";
import { useGameContext } from "@/context/GameContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";

const CoinButton = () => {
  const { gameState, addCoins } = useGameContext();
  const [clickEffects, setClickEffects] = useState<{ id: number; x: number; y: number }[]>([]);
  const clickTimeoutRef = useRef<boolean>(false);
  const clickDelay = 150; // 0.15 seconds delay between clicks - more responsive but still protects server
  
  const handleCoinClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameState.player || clickTimeoutRef.current) return;
    
    clickTimeoutRef.current = true;
    
    const buttonRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - buttonRect.left;
    const y = e.clientY - buttonRect.top;
    
    const income = gameState.income || 1;
    
    addCoins(income);
    
    const newEffect = {
      id: Date.now(),
      x,
      y
    };
    
    setClickEffects(prev => [...prev, newEffect]);
    
    setTimeout(() => {
      setClickEffects(prev => prev.filter(effect => effect.id !== newEffect.id));
    }, 1000);
    
    setTimeout(() => {
      clickTimeoutRef.current = false;
    }, clickDelay);
  };
  
  return (
    <div className="relative flex items-center justify-center h-48 w-48 md:h-56 md:w-56">
      <Button
        onClick={handleCoinClick}
        className={`relative w-36 h-36 md:w-44 md:h-44 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 hover:scale-105 ${clickTimeoutRef.current ? 'opacity-90' : ''}`}
        aria-label="Click to earn coins"
        disabled={!gameState.player || clickTimeoutRef.current}
      >
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center border-8 border-yellow-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-yellow-400 opacity-30 animate-pulse"></div>
          <span className="text-4xl font-bold text-yellow-800 z-10 flex items-center gap-1">
            <Coins className="w-6 h-6 md:w-8 md:h-8" />
          </span>
        </div>
      </Button>
      
      {clickEffects.map(effect => (
        <div 
          key={effect.id}
          className="absolute pointer-events-none z-10"
          style={{ 
            left: `${effect.x}px`, 
            top: `${effect.y}px`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -50, scale: 1.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-lg md:text-xl font-bold"
          >
            <span className="flex items-center gap-1 text-yellow-600 drop-shadow-md">
              +{gameState.income || 1} <Coins className="w-4 h-4" />
            </span>
          </motion.div>
        </div>
      ))}
    </div>
  );
};

export default CoinButton;
