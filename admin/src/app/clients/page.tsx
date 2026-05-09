"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Phone, 
  ChevronRight, 
  User,
  Star,
  History,
  MoreVertical,
  Users,
  Activity,
  Trash2,
  Edit2,
  Eye,
  Plus,
  ChevronLeft
} from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { api } from "@/services/api";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [clientToDelete, setClientToDelete] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await api.getClients();
        setClients(data);
      } catch (error) {
        console.error("Failed to load clients:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadClients();
  }, []);

  const filtered = clients.filter((c) => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone?.includes(searchQuery)
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = () => {
    // Logic for delete would go here
    setClientToDelete(null);
  };

  return (
    <div className="w-full flex flex-col relative overflow-hidden font-sans">
      
      {/* Toolbar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              <Users className="size-4" />
            </div>
            <span className="text-[14px] font-bold tracking-tight whitespace-nowrap uppercase">База клиентов</span>
            <div className="h-5 px-2 flex items-center justify-center text-[10px] font-bold bg-white border border-slate-100 rounded-full text-slate-500 ml-1">
              {filtered.length}
            </div>
          </div>
          
          <div className="hidden sm:block w-px h-5 bg-slate-200 mx-1" />
          
          <div className="relative group w-full max-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              placeholder="ПОИСК..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-9 pr-4 h-9 w-full text-[11px] font-bold uppercase bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="size-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
            { label: "Всего клиентов", value: "1,248", icon: Users, color: "text-blue-500", trend: "+12%", isUp: true },
            { label: "Повторные", value: "64%", icon: History, color: "text-amber-500", trend: "+5%", isUp: true },
            { label: "Активные", value: "412", icon: Activity, color: "text-emerald-500", trend: "+8", isUp: true },
            { label: "Ср. рейтинг", value: "4.85", icon: Star, color: "text-primary", trend: "+0.1", isUp: true },
          ].map((s) => (
            <div key={s.label} className="admin-card !p-4 flex flex-col justify-between border-slate-100 bg-white">
              <div className="flex items-center justify-between mb-3">
                <div className={cn("size-8 rounded-xl flex items-center justify-center shrink-0 bg-slate-50", s.color)}>
                  <s.icon className="size-4" />
                </div>
                <div className={cn("flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold", s.isUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500")}>{s.trend}</div>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{s.label}</p>
                <div className="text-[20px] font-black tracking-tight leading-none tabular-nums">{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Unified Table */}
        <div className="admin-card !p-0 overflow-hidden border-slate-100 bg-white">
          <table className="w-full text-left border-collapse">
            <thead className="border-b border-slate-50 bg-slate-50/20">
              <tr>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Клиент</th>
                <th className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Телефон</th>
                <th className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Заезды</th>
                <th className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Сумма</th>
                <th className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Регистрация</th>
                <th className="py-4 pr-6 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedClients.map((client) => (
                <tr key={client.id} className="group cursor-pointer hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-6" onClick={() => window.location.href = `/clients/${client.id}`}>
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center shrink-0">
                         <img src={client.photo_url || `https://i.pravatar.cc/150?u=${client.id}`} alt={client.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div>
                        <p className="text-[13px] font-black leading-none mb-1">{client.name}</p>
                        <p className="text-[9px] font-black uppercase text-primary tracking-widest">Постоянный</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4" onClick={() => window.location.href = `/clients/${client.id}`}>
                    <div className="flex items-center gap-2 text-[12px] font-bold text-slate-600">
                      <Phone className="size-3 text-slate-400" />
                      {client.phone}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center" onClick={() => window.location.href = `/clients/${client.id}`}>
                    <div className="flex flex-col items-center">
                      <span className="text-[13px] font-black tabular-nums">{client.bookings || 0}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">всего</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right" onClick={() => window.location.href = `/clients/${client.id}`}>
                    <div className="flex flex-col items-end">
                      <span className="text-[13px] font-black tabular-nums">{formatNumber(client.spent || 0)} сум</span>
                      <span className="text-[9px] font-bold text-emerald-500 uppercase">Оплачено</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center" onClick={() => window.location.href = `/clients/${client.id}`}>
                    <div className="flex flex-col items-center">
                      <span className="text-[12px] font-black">{format(new Date(client.created_at || Date.now()), "dd MMM", { locale: ru })}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">{format(new Date(client.created_at || Date.now()), "yyyy")}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-6 text-right relative">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === client.id ? null : client.id); }}
                      className="size-9 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-all active:scale-90 border border-transparent hover:border-slate-200"
                    >
                      <MoreVertical className="size-4 text-slate-900" />
                    </button>
                    {/* ... (Active Menu Logic Same as Before) */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Bar */}
          <div className="px-6 py-4 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
             <p className="text-[11px] font-bold text-slate-400 uppercase">
                Показано <span className="text-slate-900">{startIndex + 1}-{Math.min(startIndex + itemsPerPage, filtered.length)}</span> из <span className="text-slate-900">{filtered.length}</span> клиентов
             </p>
             <div className="flex items-center gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="size-9 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
                >
                   <ChevronLeft className="size-4" />
                </button>
                <div className="flex items-center gap-1">
                   {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                     <button
                       key={page}
                       onClick={() => setCurrentPage(page)}
                       className={cn(
                         "size-9 rounded-xl text-[11px] font-black transition-all active:scale-90",
                         currentPage === page 
                          ? "bg-slate-900 text-white shadow-lg shadow-black/5" 
                          : "bg-white border border-slate-100 text-slate-400 hover:text-slate-900"
                       )}
                     >
                        {page}
                     </button>
                   ))}
                </div>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="size-9 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
                >
                   <ChevronRight className="size-4" />
                </button>
             </div>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}
