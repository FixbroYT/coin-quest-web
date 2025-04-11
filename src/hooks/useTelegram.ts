
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
    // Set the ID only once when the hook mounts
    const devId = 12345;
    console.log("Using development Telegram ID:", devId);
    setTelegramId(devId);
  }, []); // Empty dependency array ensures this runs only once

  return { telegramId };
};
