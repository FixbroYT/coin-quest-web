
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
    // Simplified function to get Telegram user ID
    const getTelegramUser = () => {
      // Check if we're in the Telegram WebApp environment
      if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
        const user = window.Telegram.WebApp.initDataUnsafe?.user;
        console.log("Got Telegram user:", user);
        return user.id;
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
