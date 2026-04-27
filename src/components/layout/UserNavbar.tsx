"use client";

import Image from "next/image";
import { Bell, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const UserNavbar = () => {
  const [index, setIndex] = useState(0);
  const greetings = ["Ташкент, Узбекистан", "Apart24", "Добро пожаловать", "Ваш уютный дом"];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % greetings.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [greetings.length]);

  return (
    <div className="flex items-center justify-between px-5 pt-5 pb-3 bg-white">
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <Image
            src="/images/avatar.png"
            alt="Аватар пользователя"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center h-10 relative min-w-[150px]">
          <h2 className="text-[16px] font-black text-slate-600 leading-tight tracking-tight">
            Привет, Feruz
          </h2>
          <div className="h-4 overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -8, opacity: 0 }}
                transition={{ duration: 0.4, ease: "circOut" }}
                className="absolute inset-0 flex items-center"
              >
                <span className="text-[12px] font-bold text-slate-400 leading-none whitespace-nowrap">
                  {greetings[index]}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F5F7] text-slate-800 active:scale-95 transition-transform">
          <MessageSquare className="h-4.5 w-4.5" strokeWidth={1.5} />
        </button>
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F5F7] text-slate-800 active:scale-95 transition-transform">
          <Bell className="h-4.5 w-4.5" strokeWidth={1.5} />
          <span className="absolute top-2.5 right-2.5 h-[6px] w-[6px] rounded-full bg-[#007AFF] border border-[#F5F5F7]" />
        </button>
      </div>
    </div>
  );
};
