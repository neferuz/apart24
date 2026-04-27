"use client";

import { motion } from "framer-motion";
import { 
  Info, 
  HelpCircle, 
  Headphones, 
  Home, 
  LayoutGrid, 
  TrendingUp, 
  LogOut, 
  ChevronRight,
  Heart,
  Calendar,
  Sparkles
} from "lucide-react";
import Image from "next/image";
import { BottomNav } from "@/components/layout/BottomNav";

const mainItems = [
  { id: 'about', icon: Info, label: "О проекте Apart24", sub: "Узнайте больше о нас" },
  { id: 'faq', icon: HelpCircle, label: "Часто задаваемые вопросы", sub: "База знаний и ответы" },
  { id: 'support', icon: Headphones, label: "Поддержка", sub: "Поможем в любое время" },
];

const hostItems = [
  { id: 'list', icon: Home, label: "Сдать жилье на Apart24", sub: "Начните зарабатывать с нами", highlight: true },
];

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#F5F5F7] flex flex-col pb-32 select-none font-sans">
      {/* Header */}
      <div className="bg-white rounded-b-[2rem] border-b border-slate-100 h-[70px] flex items-center justify-center sticky top-0 z-10">
        <h1 className="text-[17px] font-black text-slate-600 tracking-tight">Профиль</h1>
      </div>

      <div className="max-w-md mx-auto px-5 pt-6 w-full">
        {/* User Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-6 mb-6 border border-slate-100 flex items-center gap-5"
        >
          <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-slate-50 flex-shrink-0">
            <Image 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" 
              alt="Avatar" 
              fill 
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-[19px] font-black text-slate-600 leading-tight">Feruz Khasanov</h2>
            <p className="text-[14px] font-semibold text-slate-400 mt-0.5">+998 90 123 45 67</p>
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#007AFF] px-3 py-1 rounded-full mt-2">
              <Sparkles className="h-3 w-3" />
              <span className="text-[10px] font-black uppercase tracking-wider">Premium Status</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-white border border-slate-100 p-3.5 rounded-[1.75rem] flex items-center gap-3">
            <div className="h-9 w-9 bg-[#F5F5F7] rounded-xl flex items-center justify-center text-[#007AFF] flex-shrink-0">
              <Calendar className="h-4.5 w-4.5" strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-[16px] font-black text-slate-600 leading-none">12</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">Поездок</div>
            </div>
          </div>
          <div className="bg-white border border-slate-100 p-3.5 rounded-[1.75rem] flex items-center gap-3">
            <div className="h-9 w-9 bg-[#F5F5F7] rounded-xl flex items-center justify-center text-pink-500 flex-shrink-0">
              <Heart className="h-4.5 w-4.5" strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-[16px] font-black text-slate-600 leading-none">48</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">Избранное</div>
            </div>
          </div>
        </div>

        {/* Menu Sections */}
        <div className="space-y-8">
          {/* Main Menu */}
          <div className="space-y-3">
            <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.1em] px-4">Информация</h3>
            <div className="bg-white rounded-[2.5rem] p-2 border border-slate-100">
              {mainItems.map((item, i) => (
                <button 
                  key={item.id}
                  className={`w-full flex items-center gap-4 p-4 rounded-[2rem] active:bg-slate-50 transition-colors group ${i !== mainItems.length - 1 ? 'border-b border-slate-50' : ''}`}
                >
                  <div className="h-10 w-10 bg-[#F5F5F7] rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-white transition-colors">
                    <item.icon className="h-5 w-5" strokeWidth={1.2} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-[15px] font-black text-slate-600 leading-tight">{item.label}</div>
                    <div className="text-[12px] font-medium text-slate-400 mt-0.5">{item.sub}</div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-300" strokeWidth={1.5} />
                </button>
              ))}
            </div>
          </div>

          {/* Host Menu */}
          <div className="space-y-3">
            <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.1em] px-4">Для хозяев</h3>
            <div className="bg-white rounded-[2.5rem] p-2 border border-slate-100">
              {hostItems.map((item, i) => (
                <button 
                  key={item.id}
                  className={`w-full flex items-center gap-4 p-4 rounded-[2rem] active:bg-slate-50 transition-colors group ${i !== hostItems.length - 1 ? 'border-b border-slate-50' : ''}`}
                >
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${item.highlight ? 'bg-blue-50 text-[#007AFF]' : 'bg-[#F5F5F7] text-slate-600 group-hover:bg-white'}`}>
                    <item.icon className="h-5 w-5" strokeWidth={1.2} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className={`text-[15px] font-black leading-tight ${item.highlight ? 'text-[#007AFF]' : 'text-slate-600'}`}>{item.label}</div>
                    <div className="text-[12px] font-medium text-slate-400 mt-0.5">{item.sub}</div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-300" strokeWidth={1.5} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
