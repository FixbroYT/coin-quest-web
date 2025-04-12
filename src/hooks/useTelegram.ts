
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
      if (window.Telegram && window.Telegram.WebApp) {
        console.log("Telegram WebApp detected");
        
        // Log the entire initDataUnsafe object to see what's available
        if (window.Telegram.WebApp.initDataUnsafe) {
          console.log("initDataUnsafe:", window.Telegram.WebApp.initDataUnsafe);
        } else {
          console.log("initDataUnsafe is not available");
        }
        
        // Try to get the user data
        if (window.Telegram.WebApp.initDataUnsafe?.user) {
          const user = window.Telegram.WebApp.initDataUnsafe.user;
          console.log("Got Telegram user:", user);
          return user.id;
        } else {
          console.log("User data not found in initDataUnsafe");
          
          // Try alternative method if available
          if (window.Telegram.WebApp.initData) {
            console.log("Attempting to parse initData");
            try {
              // In some versions, initData is a URL-encoded string that needs parsing
              const urlParams = new URLSearchParams(window.Telegram.WebApp.initData);
              const userParam = urlParams.get('user');
              if (userParam) {
                const user = JSON.parse(userParam);
                console.log("Parsed user from initData:", user);
                return user.id;
              }
            } catch (e) {
              console.error("Error parsing initData:", e);
            }
          }
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
