"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Info, 
  HelpCircle, 
  Headphones, 
  Home, 
  ChevronRight,
  Heart,
  Calendar,
  Sparkles,
  X,
  Phone
} from "lucide-react";
import Image from "next/image";
import { BottomNav } from "@/components/layout/BottomNav";
import { useTelegram } from "@/context/TelegramContext";
import { useAppContext } from "@/context/AppContext";
import { useState, useEffect } from "react";
import { api } from "@/services/api";

const mainItems = [
  { id: 'about', icon: Info, label: "О проекте Apart24", sub: "Узнайте больше о нас" },
  { id: 'faq', icon: HelpCircle, label: "Часто задаваемые вопросы", sub: "База знаний и ответы" },
  { id: 'support', icon: Headphones, label: "Поддержка", sub: "Поможем в любое время" },
];

const hostItems = [
  { id: 'list', icon: Home, label: "Сдать жилье на Apart24", sub: "Начните зарабатывать с нами", highlight: true },
];

export default function ProfilePage() {
  const { user, dbUser, requestPhone } = useTelegram();
  const { liked } = useAppContext();
  const [tripsCount, setTripsCount] = useState(0);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isHostOpen, setIsHostOpen] = useState(false);

  useEffect(() => {
    if (isAboutOpen || isFaqOpen || isSupportOpen || isHostOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAboutOpen, isFaqOpen, isSupportOpen, isHostOpen]);

  useEffect(() => {
    const loadStats = async () => {
      if (!dbUser?.id) return;
      try {
        const bookings = await api.getUserBookings(dbUser.id);
        setTripsCount(bookings.length);
      } catch (error) {
        console.error("Failed to load profile stats:", error);
      }
    };
    loadStats();
    
    // Also listen for changes in dbUser to ensure we fetch when it arrives
  }, [dbUser?.id]);

  const favoritesCount = Object.values(liked).filter(Boolean).length;

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
          <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-slate-50 flex-shrink-0 bg-slate-100 flex items-center justify-center">
            {user?.photo_url ? (
                <Image 
                  src={user.photo_url} 
                  alt="Avatar" 
                  fill 
                  className="object-cover"
                />
            ) : user?.first_name ? (
                <span className="text-[24px] font-black text-slate-400">{user.first_name[0]}</span>
            ) : (
                <Image 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" 
                  alt="Avatar" 
                  fill 
                  className="object-cover"
                />
            )}
          </div>
          <div>
            <h2 className="text-[19px] font-black text-slate-600 leading-tight">{user?.first_name || "Загрузка..."} {user?.last_name || ""}</h2>
            <div className="flex flex-col gap-1.5 mt-1.5">
              {dbUser?.phone ? (
                <p className="text-[14px] font-bold text-[#007AFF]">{dbUser.phone}</p>
              ) : (
                <button 
                  onClick={requestPhone}
                  className="inline-flex items-center gap-1.5 bg-blue-50 text-[#007AFF] px-3 py-1 rounded-full w-fit active:scale-95 transition-transform"
                >
                  <Phone className="h-3 w-3" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Подтвердить телефон</span>
                </button>
              )}
              <p className="text-[12px] font-semibold text-slate-400">@{user?.username || "user"}</p>
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
              <div className="text-[16px] font-black text-slate-600 leading-none">{tripsCount}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">Поездок</div>
            </div>
          </div>
          <div className="bg-white border border-slate-100 p-3.5 rounded-[1.75rem] flex items-center gap-3">
            <div className="h-9 w-9 bg-[#F5F5F7] rounded-xl flex items-center justify-center text-pink-500 flex-shrink-0">
              <Heart className="h-4.5 w-4.5" strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-[16px] font-black text-slate-600 leading-none">{favoritesCount}</div>
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
                  onClick={() => {
                    if (item.id === 'about') setIsAboutOpen(true);
                    if (item.id === 'faq') setIsFaqOpen(true);
                    if (item.id === 'support') setIsSupportOpen(true);
                  }}
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
                  onClick={() => {
                    if (item.id === 'list') setIsHostOpen(true);
                  }}
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

      {/* --- MODALS --- */}
      <AnimatePresence>
        {isAboutOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsAboutOpen(false)} 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" 
            />
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }} 
              transition={{ type: "spring", damping: 30, stiffness: 300 }} 
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[2rem] z-[101] border-t border-x border-slate-100 overflow-hidden" 
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                     <div className="size-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                        <Sparkles className="size-5 text-slate-900" strokeWidth={1.5} />
                     </div>
                     <div>
                        <h3 className="text-[16px] font-black text-slate-900 leading-tight">Apart24</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Premium Service</p>
                     </div>
                  </div>
                  <button onClick={() => setIsAboutOpen(false)} className="h-9 w-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 active:scale-90 transition-transform">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-6">
                  <p className="text-[14px] text-slate-500 font-medium leading-relaxed px-1">
                    Apart24 — премиальный сервис аренды апартаментов в Ташкенте. Мы создаем пространство, где современный комфорт встречается с безупречным стилем.
                  </p>

                  <div className="space-y-2">
                    {[
                      { icon: Sparkles, title: "Дизайнерский интерьер", desc: "Только эксклюзивные объекты." },
                      { icon: Heart, title: "Забота 24/7", desc: "Поддержка на каждом этапе." },
                      { icon: Info, title: "Прозрачность", desc: "Никаких скрытых платежей." }
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 bg-[#F5F5F7]/50 rounded-[1.25rem] border border-slate-100/50">
                        <div className="size-8 bg-white rounded-lg border border-slate-100 flex items-center justify-center shrink-0">
                          <feature.icon className="size-4 text-slate-800" strokeWidth={1.5} />
                        </div>
                        <div>
                          <h5 className="text-[13px] font-black text-slate-800">{feature.title}</h5>
                          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button 
                      onClick={() => setIsAboutOpen(false)}
                      className="w-full h-13 bg-slate-900 text-white rounded-[1.15rem] text-[13px] font-black uppercase tracking-widest active:scale-[0.98] transition-transform"
                    >
                      Закрыть
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isFaqOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsFaqOpen(false)} 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" 
            />
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }} 
              transition={{ type: "spring", damping: 30, stiffness: 300 }} 
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[2rem] z-[101] border-t border-x border-slate-100 overflow-hidden" 
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                     <div className="size-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                        <HelpCircle className="size-5 text-slate-900" strokeWidth={1.5} />
                     </div>
                     <div>
                        <h3 className="text-[16px] font-black text-slate-900 leading-tight">Вопросы и ответы</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">База знаний</p>
                     </div>
                  </div>
                  <button onClick={() => setIsFaqOpen(false)} className="h-9 w-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 active:scale-90 transition-transform">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                  {[
                    { q: "Как забронировать?", a: "Выберите даты, апартаменты и нажмите кнопку «Забронировать». Администратор свяжется с вами для подтверждения." },
                    { q: "Время заезда и выезда?", a: "Стандартное время заезда — 14:00, выезда — 12:00. Ранний заезд возможен по согласованию." },
                    { q: "Как производится оплата?", a: "Оплата производится при заселении наличными или картой. Данные карты в приложении не требуются." },
                    { q: "Как отменить бронь?", a: "Отменить бронирование можно в разделе «Поездки» или написав в нашу службу поддержки." }
                  ].map((faq, i) => (
                    <div key={i} className="p-4 bg-[#F5F5F7]/50 rounded-[1.5rem] border border-slate-100/50">
                      <h5 className="text-[13px] font-black text-slate-800 mb-2 flex items-center gap-2">
                        <div className="size-1.5 rounded-full bg-[#007AFF]" />
                        {faq.q}
                      </h5>
                      <p className="text-[12px] text-slate-500 font-medium leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-6">
                  <button 
                    onClick={() => setIsFaqOpen(false)}
                    className="w-full h-13 bg-slate-900 text-white rounded-[1.15rem] text-[13px] font-black uppercase tracking-widest active:scale-[0.98] transition-transform"
                  >
                    Понятно
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isSupportOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsSupportOpen(false)} 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" 
            />
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }} 
              transition={{ type: "spring", damping: 30, stiffness: 300 }} 
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[2rem] z-[101] border-t border-x border-slate-100 overflow-hidden" 
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                     <div className="size-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                        <Headphones className="size-5 text-slate-900" strokeWidth={1.5} />
                     </div>
                     <div>
                        <h3 className="text-[16px] font-black text-slate-900 leading-tight">Поддержка</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Мы на связи</p>
                     </div>
                  </div>
                  <button onClick={() => setIsSupportOpen(false)} className="h-9 w-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 active:scale-90 transition-transform">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-[14px] text-slate-500 font-medium leading-relaxed px-1">
                    Выберите удобный способ связи. Наши операторы ответят вам в течение нескольких минут.
                  </p>

                  <div className="grid grid-cols-1 gap-3">
                    <a 
                      href="https://t.me/apart24support" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-[#0088cc]/5 border border-[#0088cc]/10 rounded-[1.5rem] active:scale-[0.98] transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="size-10 bg-[#0088cc] rounded-xl flex items-center justify-center text-white">
                           <Headphones className="size-5" />
                        </div>
                        <div>
                          <h5 className="text-[14px] font-black text-slate-800">Написать в Telegram</h5>
                          <p className="text-[11px] font-bold text-[#0088cc] uppercase tracking-tight">Самый быстрый ответ</p>
                        </div>
                      </div>
                      <ChevronRight className="size-5 text-slate-300" />
                    </a>

                    <a 
                      href="tel:+998935653801" 
                      className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] active:scale-[0.98] transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="size-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                           <Phone className="size-5" />
                        </div>
                        <div>
                          <h5 className="text-[14px] font-black text-slate-800">Позвонить нам</h5>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">+998 93 565 38 01</p>
                        </div>
                      </div>
                      <ChevronRight className="size-5 text-slate-300" />
                    </a>
                  </div>
                </div>

                <div className="pt-8">
                  <button 
                    onClick={() => setIsSupportOpen(false)}
                    className="w-full h-13 bg-slate-100 text-slate-600 rounded-[1.15rem] text-[13px] font-black uppercase tracking-widest active:scale-[0.98] transition-transform border border-slate-200/50"
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isHostOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsHostOpen(false)} 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" 
            />
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }} 
              transition={{ type: "spring", damping: 30, stiffness: 300 }} 
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[2rem] z-[101] border-t border-x border-slate-100 overflow-hidden" 
            >
              <div className="p-5 pb-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                     <div className="size-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                        <Home className="size-5 text-[#007AFF]" strokeWidth={1.5} />
                     </div>
                     <div>
                        <h3 className="text-[16px] font-black text-slate-900 leading-tight">Сдать жилье</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Сотрудничество</p>
                     </div>
                  </div>
                  <button onClick={() => setIsHostOpen(false)} className="h-9 w-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 active:scale-90 transition-transform">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-5">
                  <p className="text-[14px] text-slate-500 font-medium leading-relaxed px-1">
                    Хотите сдать квартиру через Apart24? Свяжитесь с нашей администрацией для обсуждения условий сотрудничества.
                  </p>

                  <div className="pt-1">
                    <a 
                      href="https://t.me/apart24support" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full h-12 bg-slate-900 text-white rounded-[1.15rem] text-[13px] font-black uppercase tracking-widest active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
                    >
                      <Headphones className="size-4" />
                      Написать в Telegram
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
