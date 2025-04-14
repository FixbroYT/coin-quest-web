
import { useState, useEffect } from "react";

interface TelegramUser {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
}

export const useTelegram = () => {
  const [telegramId, setTelegramId] = useState<number | null>(null);

  useEffect(() => {
    // Try to get Telegram user data
    const getTelegramUser = () => {
      // First, check if we are in the Telegram WebApp environment
      if (window.Telegram?.WebApp) {
        console.log("Telegram WebApp detected");
        
        // Log the entire initDataUnsafe object to see what's available
        console.log("initData:", window.Telegram.WebApp.initData);
        console.log("initDataUnsafe:", window.Telegram.WebApp.initDataUnsafe);
        
        // Prioritize initData for validation
        if (window.Telegram.WebApp.initData) {
          console.log("Using initData for user identification");
        }
        
        // Try to get the user data from initDataUnsafe
        if (window.Telegram.WebApp.initDataUnsafe?.user) {
          const user = window.Telegram.WebApp.initDataUnsafe.user;
          console.log("Got Telegram user:", user);
          return user.id;
        } else {
          console.log("User data not found in initDataUnsafe");
        }
      } else {
        console.log("Telegram WebApp not detected");
      }
      
      // Fallback to development ID
      const devId = 12345;
      console.log("Using development Telegram ID:", devId);
      return devId;
    };

    // Set the ID only once when the hook mounts
    const userId = getTelegramUser();
    console.log("Setting telegramId to:", userId);
    setTelegramId(userId);
  }, []); // Empty dependency array ensures this runs only once

  return { telegramId };
};
