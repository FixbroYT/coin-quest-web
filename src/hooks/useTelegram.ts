
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
    // Always use development ID for testing
    const devId = 12345;
    console.log("Using development Telegram ID:", devId);
    setTelegramId(devId);
  }, []);

  return { telegramId };
};
