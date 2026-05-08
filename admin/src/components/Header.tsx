"use client";

import { useState, useEffect } from "react";
import { Activity, Download, Calendar, Menu } from "lucide-react";
import { useNavigation } from "@/context/NavigationContext";

export default function Header() {
  const [dateTime, setDateTime] = useState({ time: "", date: "" });
  const { toggleSidebar } = useNavigation();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDateTime({
        time: new Intl.DateTimeFormat('ru-RU', { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit',
          hour12: false 
        }).format(now),
        date: new Intl.DateTimeFormat('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).format(now)
      });
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-4 md:px-6 bg-white border-b border-slate-100 sticky top-0 z-30">
      <div className="flex items-center gap-3 md:gap-6">
        {/* Burger Button for Mobile */}
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 active:scale-95 transition-transform"
        >
          <Menu className="size-5" />
        </button>

        <div className="flex items-center gap-2 pr-3 md:pr-6 border-r border-slate-100">
          <Activity className="size-4 text-primary" />
          <span className="text-[12px] md:text-[13px] font-black tracking-tight uppercase">Центр</span>
          <span className="hidden sm:inline text-[13px] font-black tracking-tight uppercase ml-[-4px]"> управления</span>
        </div>
        
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
          <div className="relative flex items-center justify-center">
            <span className="absolute w-1.5 h-1.5 rounded-full bg-primary animate-ping opacity-40" />
            <span className="relative w-1.5 h-1.5 rounded-full bg-primary" />
          </div>
          <div className="w-px h-3 bg-primary/20 mx-1" />
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-bold text-primary tabular-nums tracking-tight">{dateTime.time}</span>
            <span className="text-[10px] font-bold text-slate-400 tabular-nums uppercase">{dateTime.date}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden xs:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
          <Calendar className="size-3.5 text-slate-400" />
          <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest mt-0.5">Сегодня</span>
        </div>
        <button className="flex items-center gap-2 px-3 md:px-4 h-9 bg-slate-900 text-white rounded-xl text-[10px] font-black hover:bg-slate-800 transition-colors shadow-none uppercase tracking-widest">
          <Download className="size-3.5" />
          <span className="hidden md:inline">Экспорт</span>
        </button>
      </div>
    </header>
  );
}
