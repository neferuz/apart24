"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, Calendar, Users, MapPin, Clock, CheckCircle2, 
  XCircle, Building2, ChevronRight, X, Phone, Map, Info
} from "lucide-react";
import { api } from "@/services/api";
import { useTelegram } from "@/context/TelegramContext";
import { BottomNav } from "@/components/layout/BottomNav";
import { formatNumber, cn } from "@/lib/utils";
import Image from "next/image";

export default function TripsPage() {
  const router = useRouter();
  const { dbUser } = useTelegram();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<any | null>(null);

  useEffect(() => {
    if (selectedTrip) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedTrip]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!dbUser) return;
      try {
        // Add cache-busting timestamp
        const data = await api.getUserBookings(dbUser.id);
        // Sort by ID descending (newest first)
        const sorted = [...data].sort((a, b) => b.id - a.id);
        setBookings(sorted);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, [dbUser]);

  const getStatusDisplay = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "pending":
      case "wait":
      case "ожидание":
        return {
          label: "Ожидание",
          color: "text-amber-600 bg-amber-50 border-amber-100",
          icon: <Clock className="h-3 w-3" />
        };
      case "confirmed":
      case "подтверждено":
      case "active":
        return {
          label: "Подтверждено",
          color: "text-emerald-600 bg-emerald-50 border-emerald-100",
          icon: <CheckCircle2 className="h-3 w-3" />
        };
      case "cancelled":
      case "отменено":
        return {
          label: "Отменено",
          color: "text-rose-600 bg-rose-50 border-rose-100",
          icon: <XCircle className="h-3 w-3" />
        };
      case "done":
      case "завершено":
        return {
          label: "Завершено",
          color: "text-slate-600 bg-slate-50 border-slate-100",
          icon: <CheckCircle2 className="h-3 w-3" />
        };
      default:
        return {
          label: "Ожидание",
          color: "text-amber-600 bg-amber-50 border-amber-100",
          icon: <Clock className="h-3 w-3" />
        };
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F5F7] flex flex-col relative font-sans max-w-md mx-auto border-x border-slate-100">
      {/* Header */}
      <div className="bg-white rounded-b-[2rem] border-b border-slate-100 h-[70px] flex items-center justify-center sticky top-0 z-10">
        <h1 className="text-[17px] font-black text-slate-600 tracking-tight">Мои поездки</h1>
      </div>

      <div className="flex-1 px-5 pt-4 pb-32">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="size-8 border-2 border-slate-100 border-t-[#007AFF] rounded-full animate-spin" />
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-3">
            {bookings.map((booking) => {
              const status = getStatusDisplay(booking.status);
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={booking.id}
                  onClick={() => setSelectedTrip(booking)}
                  className="bg-white rounded-[2rem] p-2.5 border border-slate-100 active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <div className="flex gap-3.5">
                    <div className="relative h-[86px] w-[86px] rounded-[1.5rem] overflow-hidden bg-slate-50 flex-shrink-0">
                      <Image 
                        src={booking.apartment_image || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&q=80"} 
                        alt="Property" 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col min-w-0 py-0.5 justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-[14px] font-black text-slate-800 leading-[1.2] line-clamp-2 pr-4">{booking.apartment_title}</h3>
                          <ChevronRight className="size-4 text-slate-300 mt-0.5 shrink-0" />
                        </div>
                        <div className="flex items-center gap-1 text-slate-400">
                          <MapPin className="h-2.5 w-2.5 text-[#007AFF]/60" />
                          <span className="text-[9px] font-bold truncate tracking-tight">{booking.apartment_address}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex flex-col gap-1">
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border w-fit ${status.color}`}>
                             {status.icon}
                             <span className="text-[8px] font-black uppercase tracking-widest">{status.label}</span>
                          </div>
                          {booking.created_at && (
                            <span className="text-[8px] font-bold text-slate-300 ml-1">
                              Бронь от {(() => {
                                const dateStr = booking.created_at.endsWith('Z') || booking.created_at.includes('+') 
                                  ? booking.created_at 
                                  : `${booking.created_at}Z`;
                                return new Date(dateStr).toLocaleString('ru-RU', { 
                                  day: 'numeric', 
                                  month: 'short', 
                                  hour: '2-digit', 
                                  minute: '2-digit',
                                  timeZone: 'Asia/Tashkent'
                                });
                              })()}
                            </span>
                          )}
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <span className="text-[13px] font-black text-slate-900 tracking-tight whitespace-nowrap">{formatNumber(booking.total_price)} сум</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-20 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-6 border border-slate-100">
              <Building2 className="size-8 text-slate-300" />
            </div>
            <h3 className="text-[18px] font-black text-slate-800 mb-2">Пусто</h3>
            <p className="text-[14px] text-slate-400 font-medium max-w-[200px]">Вы еще ничего не забронировали</p>
            <button 
              onClick={() => router.push('/')}
              className="mt-8 px-10 h-14 bg-[#007AFF] text-white rounded-[1.25rem] text-[13px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-blue-500/20"
            >
              Найти жилье
            </button>
          </div>
        )}
      </div>

      <BottomNav />

      {/* Trip Detail Modal */}
      <AnimatePresence>
        {selectedTrip && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedTrip(null)} 
              className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }} 
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className="fixed bottom-0 left-0 right-0 z-[10001] max-w-md mx-auto bg-white rounded-t-[2rem] p-5 pb-10 border-t border-slate-100 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 bg-[#007AFF]/5 text-[#007AFF] rounded-full flex items-center justify-center">
                    <Info className="size-4" />
                  </div>
                  <h3 className="text-[17px] font-black text-slate-900">Детали поездки</h3>
                </div>
                <button onClick={() => setSelectedTrip(null)} className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 active:scale-90 transition-transform">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <div className="relative h-32 w-full rounded-[1.5rem] overflow-hidden border border-slate-100">
                   <Image src={selectedTrip.apartment_image || ""} alt="Trip" fill className="object-cover" />
                </div>
                
                <div className="p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                   <h4 className="text-[15px] font-black text-slate-900 mb-0.5">{selectedTrip.apartment_title}</h4>
                   <div className="flex items-center gap-1 text-slate-400 text-[11px] font-bold mb-3">
                      <MapPin className="size-3 text-[#007AFF]/60" />
                      <span className="truncate">{selectedTrip.apartment_address}</span>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/60">
                      <div>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Заезд</span>
                        <span className="text-[12px] font-black text-slate-800">{new Date(selectedTrip.check_in).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Выезд</span>
                        <span className="text-[12px] font-black text-slate-800">{new Date(selectedTrip.check_out).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
                      </div>
                   </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Гости</span>
                        <div className="flex flex-col">
                          <span className="text-[12px] font-black text-slate-800">
                            {Number(selectedTrip.guests || selectedTrip.guests_count || (Number(selectedTrip.adults || 0) + Number(selectedTrip.kids || 0))) || 2} чел.
                          </span>
                        </div>
                      </div>
                      <div className="w-px h-6 bg-slate-200" />
                      <div>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Статус</span>
                        <div className={`flex items-center gap-1`}>
                           <span className={cn("text-[10px] font-black uppercase tracking-tight", getStatusDisplay(selectedTrip.status).color.split(' ')[0])}>{getStatusDisplay(selectedTrip.status).label}</span>
                        </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Итого</span>
                      <span className="text-[15px] font-black text-[#007AFF] tracking-tight">{formatNumber(selectedTrip.total_price)} сум</span>
                   </div>
                </div>
              </div>

              <div className="flex gap-2">
                 <button className="flex-1 h-12 bg-slate-900 text-white rounded-xl text-[12px] font-black uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2">
                    <Phone className="size-3.5" /> Позвонить администратору
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
