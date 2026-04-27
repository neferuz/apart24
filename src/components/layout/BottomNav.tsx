"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Heart as HeartIcon, Briefcase, User } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { icon: Home, id: "/", label: "Главная" }, 
    { icon: HeartIcon, id: "/wishlist", label: "Вишлист" }, 
    { icon: Briefcase, id: "/trips", label: "Поездки" }, 
    { icon: User, id: "/profile", label: "Профиль" }
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      <div className="mx-auto flex items-center justify-around w-full max-w-[320px] h-[62px] bg-white rounded-[2rem] shadow-[0_15px_50px_rgba(0,0,0,0.12)] border border-slate-100 pointer-events-auto px-1 relative">
        {tabs.map((tab) => {
          const isActive = pathname === tab.id;
          const Icon = tab.icon;
          return (
            <div 
              key={tab.id} 
              onClick={() => router.push(tab.id)} 
              className="relative flex flex-1 h-full flex-col items-center justify-center cursor-pointer group"
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTabIndicator" 
                  className="absolute inset-x-1 inset-y-2 rounded-[1.25rem] bg-[#007AFF]/5 z-0" 
                  transition={{ type: "spring", stiffness: 380, damping: 30 }} 
                />
              )}
              <Icon 
                className={`relative z-10 h-[20px] w-[20px] transition-colors duration-300 ${isActive ? "text-[#007AFF]" : "text-slate-400 group-active:text-slate-600"}`} 
                strokeWidth={isActive ? 2 : 1.5} 
              />
              <span className={`relative z-10 text-[10px] font-medium mt-1 transition-colors duration-300 ${isActive ? "text-[#007AFF]" : "text-slate-400"}`}>
                {tab.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
