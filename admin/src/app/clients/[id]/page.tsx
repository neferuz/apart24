"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  Calendar, 
  History, 
  CreditCard, 
  MapPin, 
  Star,
  ShieldCheck,
  ChevronRight,
  User,
  Activity,
  MoreHorizontal,
  Trash2,
  Edit2,
  ShoppingBag,
  Clock,
  ArrowUpRight,
  X,
  AlertTriangle,
  Package,
  ExternalLink,
  Moon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { api } from "@/services/api";
import { format, differenceInDays } from "date-fns";
import { ru } from "date-fns/locale";

export default function ClientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("history");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<any | null>(null);
  const [client, setClient] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedHistoryItem || showDeleteConfirm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedHistoryItem, showDeleteConfirm]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const id = params.id as string;
        const [clientData, bookings] = await Promise.all([
          api.getClient(id),
          api.getClientBookings(id)
        ]);

        if (clientData) {
          setClient(clientData);
          
          const mappedHistory = bookings.map((b: any) => {
            const checkIn = new Date(b.check_in);
            const checkOut = new Date(b.check_out);
            const nights = differenceInDays(checkOut, checkIn) || 1;
            
            return {
              id: b.id,
              property: b.apartment?.title || `Объект #${b.apartment_id}`,
              dates: `${format(checkIn, "dd.MM.yy")} - ${format(checkOut, "dd.MM.yy")}`,
              amount: b.total_price.toLocaleString("ru-RU"),
              status: b.status === "paid" ? "Оплачено" : b.status === "cancelled" ? "Отмена" : b.status === "confirmed" ? "Подтверждено" : "Ожидает",
              color: b.status === "paid" || b.status === "confirmed" ? "emerald" : "red",
              guests: b.apartment?.guests || 1,
              checkIn: format(checkIn, "dd.MM.yyyy"),
              checkOut: format(checkOut, "dd.MM.yyyy"),
              nights,
              pricePerNight: (b.total_price / nights).toLocaleString("ru-RU")
            };
          });
          setHistory(mappedHistory);
        }
      } catch (error) {
        console.error("Failed to load client data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <div className="size-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-bold mb-4">Клиент не найден</h2>
        <button onClick={() => router.back()} className="px-4 py-2 bg-slate-900 text-white rounded-xl">Вернуться</button>
      </div>
    );
  }

  const totalSpent = history.reduce((sum, h) => sum + parseInt(h.amount.replace(/\D/g, "")), 0);
  const totalNights = history.reduce((sum, h) => sum + h.nights, 0);
  const avgStay = history.length ? (totalNights / history.length).toFixed(1) : "0";

  return (
    <div className="w-full flex flex-col relative font-sans pb-10">
      
      {/* Header Toolbar - More Compact */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-2 px-3 h-8 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-all active:scale-95"
        >
          <ArrowLeft className="size-3.5 text-slate-400 group-hover:text-slate-900" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900">Назад</span>
        </button>
        
        <div className="flex items-center gap-2">
           <button onClick={() => setShowDeleteConfirm(true)} className="size-8 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-red-400 hover:text-red-500 hover:bg-red-50 transition-colors">
              <Trash2 className="size-3.5" />
           </button>
           <button className="h-8 px-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-none">
              ПРАВИТЬ
           </button>
        </div>
      </div>

      {/* Main Profile Section - More Compact */}
      <div className="admin-card !p-0 overflow-hidden border-slate-100 bg-white mb-6">
        <div className="h-[100px] w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </div>

        <div className="px-6 pb-6">
           <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-10 relative z-10">
              <div className="relative size-24 shrink-0">
                 <img src={client.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(client.name || "Client")}&background=random`} alt={client.name} className="size-full object-cover rounded-[24px] border-4 border-white shadow-lg shadow-black/5" />
                 <div className="absolute -bottom-1 -right-1 size-7 bg-white border border-slate-100 rounded-lg flex items-center justify-center shadow-md">
                    <ShieldCheck className="size-3.5 text-emerald-500" />
                 </div>
              </div>
              <div className="flex-1 pb-1">
                 <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-[20px] font-black tracking-tight leading-none">{client.name}</h1>
                    <span className="px-2 py-0.5 rounded-full bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest border border-primary/10">
                       Постоянный
                    </span>
                 </div>
                 <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                       <Phone className="size-3" />
                       {client.phone || "Не указан"}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                       <Mail className="size-3" />
                       Нет email
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                       <Calendar className="size-3" />
                       В СИСТЕМЕ С {format(new Date(client.created_at || Date.now()), "dd.MM.yyyy")}
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-slate-50">
           {[
             { label: "ПОТРАЧЕНО", value: totalSpent.toLocaleString("ru-RU"), icon: CreditCard, color: "text-emerald-500" },
             { label: "ЗАЕЗДЫ", value: history.length, icon: ShoppingBag, color: "text-blue-500" },
             { label: "СР. СРОК", value: `${avgStay} дня`, icon: Clock, color: "text-amber-500" },
             { label: "РЕЙТИНГ", value: "4.95", icon: Star, color: "text-primary" },
           ].map((s, i) => (
             <div key={i} className={cn("p-4 flex flex-col gap-1", i < 3 && "border-r border-slate-50")}>
                <div className="flex items-center gap-2">
                   <s.icon className={cn("size-3", s.color)} />
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
                </div>
                <span className="text-[15px] font-black tabular-nums">{s.value} {i === 0 ? "сум" : ""}</span>
             </div>
           ))}
        </div>
      </div>

      {/* Tabs & Content - More Compact */}
      <div className="space-y-4">
        <div className="flex items-center gap-1 p-0.5 bg-white border border-slate-100 rounded-full w-fit">
          <button onClick={() => setActiveTab("history")} className={cn("px-4 h-7 rounded-full text-[9px] font-black uppercase tracking-widest transition-all", activeTab === "history" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50")}>ИСТОРИЯ</button>
          <button onClick={() => setActiveTab("settings")} className={cn("px-4 h-7 rounded-full text-[9px] font-black uppercase tracking-widest transition-all", activeTab === "settings" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50")}>НАСТРОЙКИ</button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "history" ? (
            <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="admin-card !p-0 overflow-hidden border-slate-100 bg-white">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="py-3 px-6 text-[9px] font-bold uppercase tracking-widest text-slate-400">ID</th>
                    <th className="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-slate-400">Объект</th>
                    <th className="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-slate-400">Период</th>
                    <th className="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-slate-400 text-right">Сумма</th>
                    <th className="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-slate-400 text-center">Статус</th>
                    <th className="py-3 pr-6 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {history.map((h) => (
                    <tr 
                      key={h.id} 
                      className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedHistoryItem(h)}
                    >
                      <td className="py-2.5 px-6 text-[11px] font-black text-primary tabular-nums">#{h.id}</td>
                      <td className="py-2.5 px-4 text-[12px] font-black uppercase tracking-tight">{h.property}</td>
                      <td className="py-2.5 px-4 text-[11px] font-bold text-slate-400">{h.dates}</td>
                      <td className="py-2.5 px-4 text-[12px] font-black text-right tabular-nums">{h.amount} сум</td>
                      <td className="py-2.5 px-4">
                        <div className="flex justify-center">
                           <span className={cn("px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest", h.color === "emerald" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500")}>{h.status}</span>
                        </div>
                      </td>
                      <td className="py-2.5 pr-6 text-right">
                        <ChevronRight className="size-3.5 text-slate-200 group-hover:text-primary transition-colors inline" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          ) : (
            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="admin-card !p-6 border-slate-100 bg-white">
              <div className="max-w-xl space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Имя Фамилия</label>
                       <input defaultValue={client.name} className="w-full h-9 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none focus:ring-1 focus:ring-primary/20" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Телефон</label>
                       <input defaultValue={client.phone} className="w-full h-9 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none focus:ring-1 focus:ring-primary/20" />
                    </div>
                 </div>
                 <div className="pt-2">
                    <button className="h-9 px-6 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-none hover:bg-slate-800 transition-all active:scale-95">СОХРАНИТЬ</button>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── HISTORY DETAILS DRAWER - MORE COMPACT ── */}
      <AnimatePresence>
        {selectedHistoryItem && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedHistoryItem(null)} className="fixed inset-0 bg-slate-900/10 backdrop-blur-[4px] z-[100]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed right-0 top-0 h-full w-full sm:w-[380px] bg-white z-[101] flex flex-col border-l border-slate-100 shadow-2xl" >
              <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-20">
                <div>
                  <h3 className="text-[16px] font-black tracking-tight uppercase">Бронь #{selectedHistoryItem.id}</h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Детали проживания</p>
                </div>
                <button onClick={() => setSelectedHistoryItem(null)} className="size-8 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <X className="size-4 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">ОБЪЕКТ</p>
                  <div className="p-4 rounded-[24px] border border-slate-100 bg-slate-50/30 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
                         <MapPin className="size-5 text-primary" />
                      </div>
                      <div>
                         <p className="text-[13px] font-black uppercase tracking-tight">{selectedHistoryItem.property}</p>
                         <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Локация объекта</p>
                      </div>
                    </div>
                    <button className="size-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary transition-all">
                       <ExternalLink className="size-3" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">ДАТЫ И СРОК</p>
                  <div className="space-y-2">
                    <div className="p-4 rounded-[24px] bg-slate-900 text-white flex items-center justify-between relative overflow-hidden">
                       <div className="relative z-10">
                          <div className="flex items-center gap-4">
                             <div>
                                <p className="text-[8px] font-bold text-white/40 uppercase mb-0.5">ЗАЕЗД</p>
                                <p className="text-[14px] font-black">{selectedHistoryItem.checkIn}</p>
                             </div>
                             <ChevronRight className="size-4 text-white/20" />
                             <div>
                                <p className="text-[8px] font-bold text-white/40 uppercase mb-0.5">ВЫЕЗД</p>
                                <p className="text-[14px] font-black">{selectedHistoryItem.checkOut}</p>
                             </div>
                          </div>
                       </div>
                       <div className="relative z-10">
                          <div className="size-9 rounded-xl bg-white/10 flex flex-col items-center justify-center border border-white/10">
                             <span className="text-[14px] font-black leading-none">{selectedHistoryItem.nights}</span>
                             <span className="text-[7px] font-black uppercase">нч.</span>
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                       <div className="flex-1 p-3.5 rounded-[20px] border border-slate-100 bg-slate-50 flex items-center gap-3">
                          <Package className="size-4 text-slate-400" />
                          <span className="text-[11px] font-black uppercase">{selectedHistoryItem.guests} ГОСТЯ</span>
                       </div>
                       <div className="flex-1 p-3.5 rounded-[20px] border border-slate-100 bg-slate-50 flex items-center gap-3">
                          <Moon className="size-4 text-slate-400" />
                          <span className="text-[11px] font-black uppercase">{selectedHistoryItem.nights + 1} ДНЯ</span>
                       </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">ОПЛАТА</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100">
                       <div className="flex flex-col">
                          <span className="text-[12px] font-black uppercase tracking-tight">Проживание</span>
                          <span className="text-[10px] font-bold text-slate-400">{selectedHistoryItem.nights} нч x {selectedHistoryItem.pricePerNight} сум</span>
                       </div>
                       <span className="text-[13px] font-black tabular-nums">{selectedHistoryItem.amount} сум</span>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                       <span className="text-[12px] font-black uppercase tracking-widest">ИТОГО</span>
                       <div className="text-right">
                          <span className="text-[22px] font-black text-primary tabular-nums tracking-tighter">{selectedHistoryItem.amount} сум</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-50 bg-white sticky bottom-0">
                <button className="w-full h-11 rounded-xl bg-slate-900 text-white font-black text-[12px] uppercase tracking-widest shadow-none hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                   <CreditCard className="size-4" />
                   СКАЧАТЬ PDF
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal - More Compact */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteConfirm(false)} className="fixed inset-0 bg-slate-900/20 backdrop-blur-md z-[200]" />
            <div className="fixed inset-0 flex items-center justify-center z-[201] p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="w-full max-w-[320px] bg-white rounded-[24px] p-6 pointer-events-auto border border-slate-100 shadow-2xl" >
                <div className="flex flex-col items-center text-center">
                  <div className="size-12 rounded-[18px] bg-red-50 flex items-center justify-center mb-4 border border-red-100">
                    <AlertTriangle className="size-6 text-red-500" />
                  </div>
                  <h3 className="text-[16px] font-black uppercase tracking-tight mb-1">Удалить?</h3>
                  <p className="text-[11px] text-slate-500 font-bold mb-6">{client.name} будет удален.</p>
                  <div className="grid grid-cols-2 gap-3 w-full">
                    <button onClick={() => setShowDeleteConfirm(false)} className="h-10 rounded-xl bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">Отмена</button>
                    <button onClick={() => { router.push("/clients"); }} className="h-10 rounded-xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest">Удалить</button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
