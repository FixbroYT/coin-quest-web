
import { useEffect, useState } from "react";

interface TelegramUser {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
}

export const useTelegram = () => {
  const [telegramId, setTelegramId] = useState<number | null>(null);

  useEffect(() => {
    // Check if Telegram WebApp is available
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      // Init Telegram WebApp
      tg.expand();
      tg.ready();
      
      // Get user data from initDataUnsafe
      const initDataUnsafe = tg.initDataUnsafe;
      console.log("Telegram User:", initDataUnsafe?.user); // Log user data
      
      const userId = initDataUnsafe?.user?.id;
      if (userId) {
        setTelegramId(userId);
        console.log("Setting Telegram ID:", userId);
      } else {
        console.log("No Telegram user ID found in initDataUnsafe");
        // For development/testing purposes only
        if (process.env.NODE_ENV === 'development') {
          const devId = 12345;
          console.log("Using development Telegram ID:", devId);
          setTelegramId(devId);
        }
      }
    } else {
      console.log("Running outside of Telegram WebApp");
      // For development/testing purposes only
      if (process.env.NODE_ENV === 'development') {
        const devId = 12345;
        console.log("Using development Telegram ID:", devId);
        setTelegramId(devId);
      }
    }
  }, []);

  return { telegramId };
};
