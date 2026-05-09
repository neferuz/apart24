"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Calendar, 
  Clock, 
  CreditCard, 
  MapPin, 
  User, 
  ChevronRight, 
  Package, 
  X, 
  ArrowUpRight, 
  CalendarCheck,
  ChevronDown,
  CalendarDays,
  Phone,
  MessageSquare
} from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { api } from "@/services/api";

const STATUS_MAP = {
  pending: { label: "Ожидание", dot: "bg-amber-500", bg: "bg-amber-500/10 text-amber-600" },
  wait: { label: "Ожидание", dot: "bg-amber-500", bg: "bg-amber-500/10 text-amber-600" },
  active: { label: "Активно", dot: "bg-blue-500", bg: "bg-blue-500/10 text-blue-600" },
  confirmed: { label: "Подтверждено", dot: "bg-emerald-500", bg: "bg-emerald-500/10 text-emerald-600" },
  done: { label: "Завершено", dot: "bg-slate-500", bg: "bg-slate-500/10 text-slate-500" },
  cancelled: { label: "Отменено", dot: "bg-red-500", bg: "bg-red-500/10 text-red-500" },
} as const;

export default function BookingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [messageText, setMessageText] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await api.getBookings();
        setBookings(data.sort((a: any, b: any) => b.id - a.id));
      } catch (error) {
        console.error("Failed to load bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadBookings();
  }, []);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.updateBookingStatus(id, status);
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
      if (selectedBooking?.id === id) {
        setSelectedBooking({ ...selectedBooking, status });
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const filtered = bookings.filter(b => {
    const matchesSearch = 
      b.client?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.apartment?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toString().includes(searchQuery);
    const matchesTab = activeTab === "all" || b.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const formatDate = (dateStr: string, withTime = false) => {
    if (!dateStr) return "-";
    // Ensure the date is treated as UTC if no timezone is provided
    const normalizedDateStr = dateStr.endsWith('Z') || dateStr.includes('+') ? dateStr : `${dateStr}Z`;
    const date = parseISO(normalizedDateStr);
    
    const timeStr = new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Tashkent'
    }).format(date);

    const datePart = new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      timeZone: 'Asia/Tashkent'
    }).format(date);

    let displayDate = datePart;
    if (isToday(date)) displayDate = "Сегодня";
    else if (isYesterday(date)) displayDate = "Вчера";
    
    return withTime ? `${displayDate}, ${timeStr}` : displayDate;
  };

  return (
    <div className="w-full flex flex-col relative overflow-hidden font-sans pb-20">
      
      {/* Tabs & Search */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex items-center p-1 bg-white border border-slate-100 rounded-xl w-fit shadow-none">
            {["all", "pending", "confirmed", "cancelled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 h-8 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === tab 
                    ? "bg-slate-900 text-white" 
                    : "text-slate-400 hover:text-slate-900"
                )}
              >
                {tab === "all" ? "Все заказы" : tab === "pending" ? "Ожидают" : tab === "confirmed" ? "Оплачены" : "Отмена"}
              </button>
            ))}
          </div>

          <div className="relative group w-full sm:w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              placeholder="ПОИСК ПО ИМЕНИ ИЛИ ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 h-10 w-full text-[11px] font-bold uppercase bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-400 shadow-none"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="size-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="admin-card !p-0 overflow-hidden border-slate-100 bg-white">
          <table className="w-full text-left border-collapse">
            <thead className="border-b border-slate-50 bg-slate-50/20">
              <tr>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">ID / Дата</th>
                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Клиент</th>
                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Объект</th>
                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Сроки</th>
                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Статус</th>
                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Итого</th>
                <th className="py-4 pr-6 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((booking) => (
                <tr 
                  key={booking.id} 
                  className="group cursor-pointer hover:bg-slate-50/50 transition-colors"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <td className="py-4 px-6">
                    <p className="text-[12px] font-black text-slate-900 mb-0.5">#{booking.id}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{formatDate(booking.created_at, true)}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-100">
                        {booking.client?.photo_url ? (
                          <img src={booking.client.photo_url} className="size-full object-cover" />
                        ) : (
                          <span className="text-[10px] font-bold text-slate-600">{booking.client?.name?.[0]}</span>
                        )}
                      </div>
                      <p className="text-[12px] font-black text-slate-900">{booking.client?.name}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-[12px] font-black text-slate-900 line-clamp-1">{booking.apartment?.title}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                       <MapPin className="size-3 text-slate-300" />
                       <p className="text-[10px] font-bold text-slate-400 uppercase truncate max-w-[120px]">{booking.apartment?.address}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-[11px] font-black text-slate-700">
                       <span>{formatDate(booking.check_in)}</span>
                       <div className="w-1.5 h-px bg-slate-300" />
                       <span>{formatDate(booking.check_out)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest", STATUS_MAP[booking.status as keyof typeof STATUS_MAP]?.bg)}>
                       <div className={cn("size-1 rounded-full", STATUS_MAP[booking.status as keyof typeof STATUS_MAP]?.dot)} />
                       {STATUS_MAP[booking.status as keyof typeof STATUS_MAP]?.label}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <p className="text-[13px] font-black text-slate-900 tabular-nums">{formatNumber(booking.total_price)} сум</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{booking.payment_method || "Не оплачено"}</p>
                  </td>
                  <td className="py-4 pr-6 text-right">
                    <div className="size-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all ml-auto">
                       <ChevronRight className="size-4" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
               <Package className="size-10 mb-4 opacity-20" />
               <p className="text-[11px] font-black uppercase tracking-widest">Заказов не найдено</p>
            </div>
          )}
        </div>
      )}

      {/* ── BOOKING DETAILS DRAWER ── */}
      <AnimatePresence>
        {selectedBooking && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedBooking(null)} 
              className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-[200]" 
            />
            <motion.div 
              initial={{ x: "100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "100%" }} 
              transition={{ type: "spring", damping: 30, stiffness: 300 }} 
              className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white z-[201] flex flex-col border-l border-slate-100 shadow-none" 
            >
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                 <div>
                    <h3 className="text-[14px] font-black uppercase tracking-tight">Бронь #{selectedBooking.id}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                       <div className={cn("size-1.5 rounded-full", STATUS_MAP[selectedBooking.status as keyof typeof STATUS_MAP]?.dot)} />
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{STATUS_MAP[selectedBooking.status as keyof typeof STATUS_MAP]?.label}</span>
                    </div>
                 </div>
                 <button onClick={() => setSelectedBooking(null)} className="size-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <X className="size-4" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                 
                 {/* Property Info */}
                 <div className="space-y-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Объект размещения</p>
                    <div className="flex gap-4">
                       <div className="size-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                          <img src={selectedBooking.apartment?.image} className="size-full object-cover" />
                       </div>
                       <div className="flex flex-col justify-center">
                          <h4 className="text-[14px] font-black text-slate-900 mb-1">{selectedBooking.apartment?.title}</h4>
                          <div className="flex items-center gap-1.5 text-slate-400">
                             <MapPin className="size-3.5" />
                             <span className="text-[11px] font-bold">{selectedBooking.apartment?.address}</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Dates Grid */}
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Заезд</p>
                       <div className="flex items-center gap-2">
                          <CalendarCheck className="size-4 text-slate-900" />
                          <span className="text-[13px] font-black">{format(parseISO(selectedBooking.check_in), "d MMMM", { locale: ru })}</span>
                       </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Выезд</p>
                       <div className="flex items-center gap-2">
                          <ArrowUpRight className="size-4 text-slate-900" />
                          <span className="text-[13px] font-black">{format(parseISO(selectedBooking.check_out), "d MMMM", { locale: ru })}</span>
                       </div>
                    </div>
                 </div>

                  {/* Client Info */}
                  <div className="space-y-4">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Информация о госте</p>
                     <div className="p-5 rounded-2xl border border-slate-100 bg-white">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="size-12 rounded-full bg-slate-900 flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm">
                              {selectedBooking.client?.photo_url ? (
                                <img src={selectedBooking.client.photo_url} className="size-full object-cover" />
                              ) : (
                                <span className="text-white text-[14px] font-black">{selectedBooking.client?.name?.[0]}</span>
                              )}
                           </div>
                           <div className="flex-1">
                              <div className="flex items-center justify-between">
                                 <h4 className="text-[15px] font-black text-slate-900">{selectedBooking.client?.name}</h4>
                                 <button 
                                   onClick={() => router.push(`/clients/${selectedBooking.client.id}`)}
                                   className="text-[10px] font-black text-[#007AFF] uppercase tracking-widest hover:underline"
                                 >
                                    Профиль
                                 </button>
                              </div>
                              <p className="text-[11px] font-bold text-primary uppercase tracking-tight">Постоянный гость</p>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                           <div className="flex items-center gap-2.5">
                              <Phone className="size-4 text-slate-400" />
                              <span className="text-[12px] font-black tabular-nums">{selectedBooking.client?.phone || "Не указан"}</span>
                           </div>
                           <div className="flex items-center gap-2.5">
                              <User className="size-4 text-slate-400" />
                              <span className="text-[12px] font-black uppercase tracking-widest">TG: {selectedBooking.client?.tg_id}</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Quick Message */}
                  <div className="space-y-4">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Быстрое сообщение (TG)</p>
                     <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50 space-y-3">
                        <textarea 
                          placeholder="Введите сообщение пользователю..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-[12px] font-medium min-h-[80px] outline-none focus:ring-1 focus:ring-slate-900/10 transition-all resize-none"
                        />
                        <button 
                          onClick={async () => {
                            if (!messageText.trim() || !selectedBooking.client?.tg_id) return;
                            setIsSendingMessage(true);
                            try {
                              await api.sendMessage(selectedBooking.client.tg_id, messageText);
                              setMessageText("");
                              alert("Сообщение отправлено!");
                            } catch (e) {
                              console.error(e);
                            } finally {
                              setIsSendingMessage(false);
                            }
                          }}
                          disabled={isSendingMessage || !messageText.trim()}
                          className="w-full h-10 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                          {isSendingMessage ? (
                             <div className="size-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          ) : (
                             <>
                               <MessageSquare className="size-3.5" />
                               Отправить сообщение
                             </>
                          )}
                        </button>
                     </div>
                  </div>

                 {/* Financials */}
                 <div className="space-y-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Финансовые детали</p>
                    <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-none">
                       <div className="flex justify-between items-center mb-4 opacity-60">
                          <span className="text-[11px] font-bold uppercase tracking-widest">Всего к оплате</span>
                          <CreditCard className="size-4" />
                       </div>
                       <div className="text-[28px] font-black tracking-tight mb-4 tabular-nums">
                          {formatNumber(selectedBooking.total_price)} <span className="text-[14px] uppercase opacity-40 ml-1">сум</span>
                       </div>
                       <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 w-fit">
                          <Clock className="size-3.5" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{selectedBooking.payment_method || "Ожидание оплаты"}</span>
                       </div>
                    </div>
                 </div>

              </div>

              {/* Actions */}
              <div className="p-6 border-t border-slate-100 bg-white grid grid-cols-2 gap-4 sticky bottom-0">
                 {(selectedBooking.status === "pending" || selectedBooking.status === "wait") ? (
                   <>
                      <button 
                        onClick={() => handleUpdateStatus(selectedBooking.id, "cancelled")}
                        className="h-12 rounded-2xl bg-red-50 text-red-500 text-[11px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-none"
                      >
                         Отменить
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(selectedBooking.id, "confirmed")}
                        className="h-12 rounded-2xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-none"
                      >
                         Подтвердить
                      </button>
                   </>
                 ) : (selectedBooking.status === "confirmed" || selectedBooking.status === "active") ? (
                    <button 
                      onClick={() => handleUpdateStatus(selectedBooking.id, "done")}
                      className="col-span-2 h-12 rounded-2xl bg-emerald-500 text-white text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-none"
                    >
                       Завершить бронь
                    </button>
                 ) : (
                    <button 
                      disabled
                      className="col-span-2 h-12 rounded-2xl bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-widest cursor-not-allowed"
                    >
                       Статус: {STATUS_MAP[selectedBooking.status as keyof typeof STATUS_MAP]?.label || selectedBooking.status}
                    </button>
                 )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
