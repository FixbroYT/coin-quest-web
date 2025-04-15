
import { useState, useRef } from "react";
import { useGameContext } from "@/context/GameContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const CoinButton = () => {
  const { gameState, addCoins } = useGameContext();
  const [clickEffects, setClickEffects] = useState<{ id: number; x: number; y: number }[]>([]);
  const clickTimeoutRef = useRef<boolean>(false);
  const clickDelay = 300; // 0.3 seconds delay between clicks
  
  const handleCoinClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameState.player || clickTimeoutRef.current) return;
    
    // Set click timeout to prevent rapid clicking
    clickTimeoutRef.current = true;
    
    // Get click position relative to the button
    const buttonRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - buttonRect.left;
    const y = e.clientY - buttonRect.top;
    
    // Use the income from the API
    const income = gameState.income || 1;
    
    // Add coins
    addCoins(income);
    
    // Add visual click effect
    const newEffect = {
      id: Date.now(),
      x,
      y
    };
    
    setClickEffects(prev => [...prev, newEffect]);
    
    // Remove effect after animation completes
    setTimeout(() => {
      setClickEffects(prev => prev.filter(effect => effect.id !== newEffect.id));
    }, 1000);
    
    // Reset click timeout after delay
    setTimeout(() => {
      clickTimeoutRef.current = false;
    }, clickDelay);
  };
  
  return (
    <div className="relative flex items-center justify-center h-48 w-48 md:h-56 md:w-56">
      <Button
        onClick={handleCoinClick}
        className={`relative w-36 h-36 md:w-44 md:h-44 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg transition-transform duration-100 active:scale-95 hover:scale-105 ${clickTimeoutRef.current ? 'opacity-90' : ''}`}
        aria-label="Click to earn coins"
        disabled={!gameState.player || clickTimeoutRef.current}
      >
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-yellow-400 flex items-center justify-center border-8 border-yellow-600">
          <span className="text-4xl font-bold text-yellow-800">$</span>
        </div>
      </Button>
      
      {/* Click effects */}
      {clickEffects.map(effect => (
        <div 
          key={effect.id}
          className="absolute pointer-events-none z-10 text-yellow-500 font-bold"
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
            className="text-lg md:text-xl"
          >
            +{gameState.income || 1}
          </motion.div>
        </div>
      ))}
    </div>
  );
};

export default CoinButton;
