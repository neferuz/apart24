"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/services/api';

interface TelegramUser {
  id: string;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface TelegramContextType {
  user: TelegramUser | null;
  dbUser: any | null;
  isLoading: boolean;
  requestPhone: () => void;
}

const TelegramContext = createContext<TelegramContextType | undefined>(undefined);

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [dbUser, setDbUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Detect Telegram WebApp
    const tg = (window as any).Telegram?.WebApp;
    
    let activeUser: TelegramUser | null = null;

    if (tg?.initDataUnsafe?.user) {
      activeUser = {
        id: tg.initDataUnsafe.user.id.toString(),
        first_name: tg.initDataUnsafe.user.first_name,
        last_name: tg.initDataUnsafe.user.last_name,
        username: tg.initDataUnsafe.user.username,
        photo_url: tg.initDataUnsafe.user.photo_url,
      };

      // Configure Telegram WebApp UI
      tg.setHeaderColor('#007AFF');
      tg.expand();
      tg.enableClosingConfirmation();
      tg.ready();
    } else {
      // 2. Mock User for Local Development
      activeUser = {
        id: "12345678", // Simulated ID
        first_name: "Александр (Dev)",
        username: "alex_dev",
      };
    }

    setUser(activeUser);

    // 3. Sync with Backend
    const syncWithBackend = async () => {
      try {
        const synced = await api.syncUser({
          tg_id: activeUser!.id,
          name: `${activeUser!.first_name} ${activeUser!.last_name || ""}`.trim(),
        });
        setDbUser(synced);
      } catch (error) {
        console.error("Failed to sync user with backend:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (activeUser) {
      syncWithBackend();
    } else {
      setIsLoading(false);
    }
  }, []);

  const requestPhone = () => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.requestContact((shared: boolean) => {
        if (shared) {
          // If shared, we need to fetch the updated user from backend
          // The bot usually receives the contact and updates the DB
          // For now, we'll just re-sync to see if it appeared
          setTimeout(async () => {
             if (user?.id) {
               const synced = await api.syncUser({
                 tg_id: user.id,
                 name: `${user.first_name} ${user.last_name || ""}`.trim(),
               });
               setDbUser(synced);
             }
          }, 2000);
        }
      });
    }
  };

  return (
    <TelegramContext.Provider value={{ user, dbUser, isLoading, requestPhone }}>
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (context === undefined) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
};
