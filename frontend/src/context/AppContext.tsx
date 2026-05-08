"use client";

import React, { createContext, useContext, useState } from "react";

interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  type: string;
  rating: number;
  img: string;
}

import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface AppContextType {
  liked: Record<number, boolean>;
  toggleLike: (id: number) => void;
  selectedProperty: Property | null;
  setSelectedProperty: (p: Property | null) => void;
  adults: number;
  setAdults: (v: number) => void;
  kids: number;
  setKids: (v: number) => void;
  startDate: number | null;
  setStartDate: (v: number | null) => void;
  endDate: number | null;
  setEndDate: (v: number | null) => void;
  showNotification: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [liked, setLiked] = useState<Record<number, boolean>>({ 1: true, 2: true });
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [startDate, setStartDate] = useState<number | null>(null);
  const [endDate, setEndDate] = useState<number | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [lastAction, setLastAction] = useState<'added' | 'removed' | null>(null);

  const toggleLike = (id: number) => {
    const isAdding = !liked[id];
    setLiked(prev => ({ ...prev, [id]: !prev[id] }));
    
    if (isAdding) {
      setLastAction('added');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    }
  };

  return (
    <AppContext.Provider value={{
      liked,
      toggleLike,
      selectedProperty,
      setSelectedProperty,
      adults,
      setAdults,
      kids,
      setKids,
      startDate,
      setStartDate,
      endDate,
      setEndDate,
      showNotification
    }}>
      {children}
      
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ y: -50, opacity: 0, scale: 0.9 }}
            animate={{ y: 20, opacity: 1, scale: 1 }}
            exit={{ y: -50, opacity: 0, scale: 0.9 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-xl"
          >
            <div className="size-6 bg-[#007AFF] rounded-full flex items-center justify-center">
              <Heart className="size-3.5 fill-white text-white" />
            </div>
            <span className="text-[13px] font-semibold tracking-tight whitespace-nowrap">Добавлено в избранное</span>
          </motion.div>
        )}
      </AnimatePresence>
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
