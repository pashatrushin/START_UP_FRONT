interface TelegramWebAppUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  allows_write_to_pm?: boolean;
}

interface TelegramWebAppInitDataUnsafe {
  user?: TelegramWebAppUser;
  // ...другие поля, если нужны
}

interface TelegramWebApp {
  initDataUnsafe: TelegramWebAppInitDataUnsafe;
  // ...другие методы и поля, если нужны
}

interface Window {
  Telegram?: {
    WebApp: TelegramWebApp;
  };
}