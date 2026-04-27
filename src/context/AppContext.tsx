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

interface AppContextType {
  liked: Record<number, boolean>;
  toggleLike: (id: number) => void;
  selectedProperty: Property | null;
  setSelectedProperty: (p: Property | null) => void;
  adults: number;
  setAdults: (v: number) => void;
  kids: number;
  setKids: (v: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [liked, setLiked] = useState<Record<number, boolean>>({ 1: true, 2: true });
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);

  const toggleLike = (id: number) => {
    setLiked(prev => ({ ...prev, [id]: !prev[id] }));
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
      setKids
    }}>
      {children}
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
