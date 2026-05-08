"use client";

import { useState, useEffect } from "react";
import { 
  Activity, 
  Users, 
  TrendingUp, 
  Calendar,
  LayoutDashboard,
  Search,
  Plus,
  DoorOpen,
  Layers,
  Star,
  MapPin,
  ArrowUpRight,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { cn } from "@/lib/utils";
import { api } from "@/services/api";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await api.getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: "Выручка (СУМ)", value: stats?.revenue || "0", icon: TrendingUp, color: "text-emerald-500", trend: "+12%", isUp: true },
    { label: "Новые брони", value: stats?.new_bookings || "0", icon: Calendar, color: "text-blue-500", trend: "+5", isUp: true },
    { label: "Загрузка", value: stats?.occupancy || "0%", icon: DoorOpen, color: "text-amber-500", trend: "Normal", isUp: true },
    { label: "Клиенты", value: stats?.clients || "0", icon: Users, color: "text-primary", trend: "+8", isUp: true },
  ];

  return (
    <div className="w-full flex flex-col relative overflow-hidden font-sans pb-10">
      
      {/* ── Toolbar ── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-slate-900 text-white shrink-0">
              <LayoutDashboard className="size-4" />
            </div>
            <span className="text-[14px] font-black tracking-tight whitespace-nowrap uppercase">Дашборд</span>
          </div>
          
          <div className="hidden sm:block w-px h-5 bg-slate-200 mx-1" />
          
          <div className="relative group w-full max-w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              placeholder="БЫСТРЫЙ ПОИСК..."
              className="pl-9 pr-4 h-10 w-full text-[11px] font-bold uppercase bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-400 shadow-none"
            />
          </div>
        </div>
        
        <button className="bg-slate-900 text-white h-10 px-6 rounded-xl flex items-center justify-center gap-2 text-[11px] font-black hover:bg-slate-800 transition-all active:scale-95 shadow-none w-full xl:w-auto">
          <Plus className="size-4" />
          <span>СОЗДАТЬ ОБЪЕКТ</span>
        </button>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="admin-card !p-5 flex flex-col justify-between border-slate-100 bg-white"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("size-10 rounded-2xl flex items-center justify-center shrink-0 bg-slate-50", stat.color)}>
                <stat.icon className="size-5" />
              </div>
              <div className={cn("flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black", stat.isUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500")}>
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">{stat.label}</p>
              <div className="text-[24px] font-black tracking-tight leading-none tabular-nums">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main Analytics Chart ── */}
        <div className="lg:col-span-2 admin-card !p-6 border-slate-100 bg-white min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-[15px] font-black tracking-tight uppercase">Аналитика бронирований</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Активность за последние 7 дней</p>
            </div>
            <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-xl border border-slate-100">
               <button className="px-3 h-7 rounded-lg text-[9px] font-black uppercase bg-white shadow-none text-slate-900 border border-slate-200">Неделя</button>
               <button className="px-3 h-7 rounded-lg text-[9px] font-black uppercase text-slate-400 hover:text-slate-900">Месяц</button>
            </div>
          </div>
          
          <div className="flex-1 w-full mt-auto">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={stats?.chart_data || []}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F172A" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="#0F172A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94A3B8'}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: '1px solid #F1F5F9', 
                    boxShadow: 'none',
                    fontSize: '11px',
                    fontWeight: 900,
                    textTransform: 'uppercase'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#0F172A" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorBookings)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Top Properties ── */}
        <div className="admin-card !p-6 border-slate-100 bg-white">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[15px] font-black tracking-tight uppercase">Топ объектов</h3>
            <div className="flex gap-2">
               <button className="size-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"><ChevronRight className="size-4 rotate-180" /></button>
               <button className="size-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"><ChevronRight className="size-4" /></button>
            </div>
          </div>
          
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
            {stats?.top_properties?.map((prop: any, i: number) => (
              <div key={prop.name} className="group min-w-[220px] bg-slate-50 border border-slate-100 rounded-[2rem] p-3 cursor-pointer snap-start hover:border-primary/20 transition-all">
                <div className="relative h-28 w-full rounded-[1.5rem] overflow-hidden mb-3">
                  <img src={prop.image} alt={prop.name} className="size-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <Star className="size-3 fill-primary text-primary" />
                    <span className="text-[10px] font-black">4.9</span>
                  </div>
                </div>
                <div className="px-1">
                  <h4 className="text-[12px] font-black text-slate-900 truncate uppercase tracking-tight mb-1">{prop.name}</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{prop.bookings} броней</p>
                </div>
              </div>
            ))}
            {!stats?.top_properties?.length && (
               <div className="w-full py-10 text-center text-slate-400 uppercase text-[10px] font-black opacity-20">Нет данных</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
