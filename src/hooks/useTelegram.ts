
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
      
      // Get user data
      const user = tg.initDataUnsafe?.user;
      if (user && user.id) {
        setTelegramId(user.id);
      }
      
      console.log("Telegram WebApp initialized");
    } else {
      console.log("Running outside of Telegram WebApp");
      // For testing purposes, use a mock ID
      const mockId = 12345;
      setTelegramId(mockId);
    }
  }, []);

  return { telegramId };
};
