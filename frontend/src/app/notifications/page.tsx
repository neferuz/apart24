"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Bell, 
  CalendarCheck, 
  CreditCard, 
  Info, 
  Sparkles,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react";
import { BottomNav } from "@/components/layout/BottomNav";
import { cn } from "@/lib/utils";
import { useTelegram } from "@/context/TelegramContext";
import { api } from "@/services/api";

export default function NotificationsPage() {
  const router = useRouter();
  const { dbUser } = useTelegram();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!dbUser?.id) return;
      try {
        const [bookings, apartments] = await Promise.all([
          api.getUserBookings(dbUser.id),
          api.getApartments()
        ]);

        const mapped = bookings.map((b: any) => {
          const apt = apartments.find((a: any) => a.id === b.apartment_id);
          const status = b.status?.toLowerCase();
          
          let title = "Уведомление по брони";
          let message = `Ваша бронь в ${apt?.title || 'апартаменты'} #${b.id}`;
          let icon = Bell;
          let color = "text-slate-400";
          let bg = "bg-slate-50";

          if (status === 'pending' || status === 'wait') {
            title = "Заявка в обработке";
            message = `Ваша заявка #${b.id} в ${apt?.title} принята. Ждем подтверждения.`;
            icon = Clock;
            color = "text-amber-500";
            bg = "bg-amber-50";
          } else if (status === 'confirmed' || status === 'active') {
            title = "Бронь подтверждена!";
            message = `Отличные новости! Ваша бронь #${b.id} в ${apt?.title} успешно подтверждена.`;
            icon = CheckCircle2;
            color = "text-emerald-500";
            bg = "bg-emerald-50";
          } else if (status === 'cancelled') {
            title = "Бронирование отменено";
            message = `Бронирование #${b.id} в ${apt?.title} было отменено.`;
            icon = XCircle;
            color = "text-rose-500";
            bg = "bg-rose-50";
          } else if (status === 'done') {
            title = "Поездка завершена";
            message = `Надеемся, вам понравилось в ${apt?.title}! Будем рады видеть вас снова.`;
            icon = Sparkles;
            color = "text-blue-500";
            bg = "bg-blue-50";
          }

          return {
            id: b.id,
            title,
            message,
            time: b.created_at,
            icon,
            color,
            bg,
            isUnread: status === 'confirmed' // Mark confirmed as "new/important"
          };
        });

        setNotifications(mapped.sort((a: any, b: any) => b.id - a.id));
      } catch (error) {
        console.error("Failed to load notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadNotifications();
  }, [dbUser]);

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    const dateStrFixed = dateStr.endsWith('Z') || dateStr.includes('+') ? dateStr : `${dateStr}Z`;
    const date = new Date(dateStrFixed);
    return date.toLocaleString('ru-RU', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'Asia/Tashkent'
    });
  };

  return (
    <main className="min-h-screen bg-[#F5F5F7] flex flex-col font-sans">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md sticky top-0 z-[100] border-b border-slate-100/50 rounded-b-[2.5rem] px-5 py-4 flex items-center justify-between max-w-md mx-auto w-full">
        <button 
          onClick={() => router.back()} 
          className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-800 active:scale-95 transition-transform"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
        </button>
        <h1 className="text-[17px] font-black text-slate-600 tracking-tight">Уведомления</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 max-w-md mx-auto w-full px-4 pt-4 space-y-2 pb-32">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="size-8 border-2 border-slate-200 border-t-[#007AFF] rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {notifications.map((notif, idx) => {
              const Icon = notif.icon;
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "p-3.5 rounded-[1.75rem] border transition-all active:scale-[0.98] cursor-pointer relative overflow-hidden bg-white border-slate-200"
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", notif.bg, notif.color)}>
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex justify-between items-center mb-0.5">
                        <h3 className="text-[13px] font-black text-slate-700 leading-tight">
                          {notif.title}
                        </h3>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
                          {formatTime(notif.time)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium leading-tight">
                        {notif.message}
                      </p>
                    </div>

                    {notif.isUnread && (
                      <div className="h-1.5 w-1.5 rounded-full bg-[#007AFF] shrink-0" />
                    )}
                  </div>
                </motion.div>
              );
            })}

            {notifications.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-20 w-20 rounded-[2.5rem] bg-white border border-slate-100 flex items-center justify-center mb-6">
                  <Bell className="h-8 w-8 text-slate-200" strokeWidth={1} />
                </div>
                <h3 className="text-[16px] font-black text-slate-600 mb-1">Уведомлений нет</h3>
                <p className="text-[13px] text-slate-400 font-medium">Мы сообщим вам, когда появится что-то новое</p>
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
