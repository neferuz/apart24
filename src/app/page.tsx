"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, ChevronLeft, ChevronRight, Plus, Minus, User, Baby } from "lucide-react";
import { UserNavbar } from "@/components/layout/UserNavbar";
import { BookingFilter } from "@/features/dashboard/components/BookingFilter";
import { ApartmentList } from "@/features/dashboard/components/ApartmentList";
import { useAppContext } from "@/context/AppContext";
import { BottomNav } from "@/components/layout/BottomNav";

const popularData = [
  { id: 1, title: "Moonsoon Villa", price: "850 000 сум", location: "Юнусабадский р-н, Ташкент", beds: 3, baths: 2, sqft: 120, type: "В аренду", rating: 4.8, img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80" },
  { id: 2, title: "Navana House", price: "600 000 сум", location: "Мирзо-Улугбекский р-н, Ташкент", beds: 2, baths: 1, sqft: 85, type: "В аренду", rating: 4.9, img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80" },
  { id: 3, title: "Skyline Loft", price: "1 200 000 сум", location: "Яккасарайский р-н, Ташкент", beds: 4, baths: 3, sqft: 200, type: "В аренду", rating: 5.0, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80" },
  { id: 4, title: "Urban Studio", price: "450 000 сум", location: "Чиланзарский р-н, Ташкент", beds: 1, baths: 1, sqft: 45, type: "В аренду", rating: 4.7, img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80" },
];

const nearbyData = [
  { id: 5, title: "Forest Cabin", price: "500 000 сум", location: "Бектемирский р-н, Ташкент", beds: 1, baths: 1, sqft: 50, type: "В аренду", rating: 4.5, img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80" },
  { id: 6, title: "Ocean View", price: "950 000 сум", location: "Мирабадский р-н, Ташкент", beds: 3, baths: 2, sqft: 140, type: "В аренду", rating: 4.9, img: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80" },
  { id: 7, title: "Metro Flat", price: "350 000 сум", location: "Алмазарский р-н, Ташкент", beds: 1, baths: 1, sqft: 35, type: "В аренду", rating: 4.6, img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80" },
  { id: 8, title: "Elite Estate", price: "1 500 000 сум", location: "Шайхантахурский р-н", beds: 5, baths: 4, sqft: 300, type: "Продажа", rating: 5.0, img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80" },
];

const MONTHS = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

export default function Home() {
  const router = useRouter();
  const { liked, toggleLike, adults, setAdults, kids, setKids } = useAppContext();
  
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  
  const [startDate, setStartDate] = useState<number | null>(12);
  const [endDate, setEndDate] = useState<number | null>(18);
  const [selectingPhase, setSelectingPhase] = useState<'start' | 'end'>('start');

  const [currentMonthIndex, setCurrentMonthIndex] = useState(4);
  const daysInMonth = currentMonthIndex === 1 ? 28 : (currentMonthIndex % 2 === 0 ? 31 : 30);
  const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleNextMonth = () => setCurrentMonthIndex((prev) => (prev + 1) % 12);
  const handlePrevMonth = () => setCurrentMonthIndex((prev) => (prev === 0 ? 11 : prev - 1));

  const handleDateClick = (day: number) => {
    if (selectingPhase === 'start') {
      setStartDate(day);
      setEndDate(null);
      setSelectingPhase('end');
    } else {
      if (startDate && day < startDate) {
        setStartDate(day);
        setEndDate(null);
        setSelectingPhase('end');
      } else {
        setEndDate(day);
        setSelectingPhase('start');
      }
    }
  };

  const isSelected = (day: number) => {
    if (startDate && !endDate) return day === startDate;
    if (startDate && endDate) return day >= startDate && day <= endDate;
    return false;
  };

  const isRange = (day: number) => {
    return startDate && endDate && day > startDate && day < endDate;
  };

  return (
    <main className="min-h-screen bg-[#F5F5F7] select-none font-sans overflow-x-hidden relative">
      <div className="mx-auto max-w-md bg-[#F5F5F7] min-h-screen relative flex flex-col pb-24">
        
        <div className="bg-white rounded-b-[2.5rem] border-b border-slate-100 pb-4 z-10 relative">
          <UserNavbar />
          <div className="px-5 pt-1">
            <div className="w-full flex items-center h-12 bg-[#F5F5F7] rounded-[1.25rem] px-4 cursor-text border border-slate-100/50 transition-transform">
              <Search className="h-5 w-5 text-slate-800 mr-2.5" strokeWidth={1.5} />
              <input type="text" placeholder="Поиск адреса, улицы..." className="bg-transparent outline-none w-full text-[14px] font-normal text-slate-900 placeholder:text-slate-500" />
            </div>
            <BookingFilter 
              onDateClick={() => setIsDateOpen(true)} 
              onGuestClick={() => setIsGuestOpen(true)} 
              startDate={startDate}
              endDate={endDate}
              adults={adults} 
              kids={kids} 
            />
          </div>
        </div>

        <div className="flex-1">
          <ApartmentList title="Лучшие предложения" items={popularData} liked={liked} onToggleLike={toggleLike} onSelect={(item) => router.push(`/property/${item.id}`)} />
          <ApartmentList title="Рядом с вами" items={nearbyData} liked={liked} onToggleLike={toggleLike} onSelect={(item) => router.push(`/property/${item.id}`)} />
        </div>

        <BottomNav />
      </div>

      <AnimatePresence>
        {isDateOpen && (
          <div className="fixed inset-0 z-[9999] flex flex-col justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDateOpen(false)} className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="relative bg-white rounded-t-[2rem] p-5 pt-3 pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pointer-events-auto">
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-black text-slate-600">Даты</h3>
                <button onClick={() => setIsDateOpen(false)} className="h-7 w-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 active:scale-90"><X className="h-4 w-4" strokeWidth={2} /></button>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-4">
                   <span className="text-[15px] font-black text-slate-600">{MONTHS[currentMonthIndex]} 2026</span>
                   <div className="flex items-center gap-2">
                     <button onClick={handlePrevMonth} className="h-7 w-7 rounded-full border border-slate-100 flex items-center justify-center text-slate-600 active:bg-slate-50"><ChevronLeft className="h-4 w-4" strokeWidth={1.5} /></button>
                     <button onClick={handleNextMonth} className="h-7 w-7 rounded-full border border-slate-100 flex items-center justify-center text-slate-600 active:bg-slate-50"><ChevronRight className="h-4 w-4" strokeWidth={1.5} /></button>
                   </div>
                </div>
                <div className="grid grid-cols-7 gap-y-1">
                  {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map(d => <div key={d} className="text-center text-[10px] font-black text-slate-400 uppercase mb-1">{d}</div>)}
                  {dates.map(d => {
                    const selected = isSelected(d);
                    const range = isRange(d);
                    const isStart = d === startDate;
                    const isEnd = d === endDate;

                    return (
                      <div key={d} className={`flex justify-center relative py-0.5 ${range ? 'bg-blue-50/50' : ''} ${isStart && endDate ? 'bg-gradient-to-r from-transparent to-blue-50/50 rounded-l-full' : ''} ${isEnd && startDate ? 'bg-gradient-to-l from-transparent to-blue-50/50 rounded-r-full' : ''}`}>
                        <button 
                          onClick={() => handleDateClick(d)} 
                          className={`h-9 w-9 flex items-center justify-center rounded-full text-[13px] font-black transition-all relative z-10 ${selected ? "bg-[#007AFF] text-white" : "text-slate-600 hover:bg-slate-50"}`}
                        >
                          {d}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-5 px-1 bg-[#F8F9FB] p-3 rounded-2xl border border-slate-50">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Заезд</span>
                  <span className="text-[13px] font-black text-slate-600">{startDate ? `${startDate} ${MONTHS[currentMonthIndex].slice(0, 3)}` : '—'}</span>
                </div>
                <div className="h-px w-6 bg-slate-200" />
                <div className="flex flex-col text-right">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Выезд</span>
                  <span className="text-[13px] font-black text-slate-600">{endDate ? `${endDate} ${MONTHS[currentMonthIndex].slice(0, 3)}` : '—'}</span>
                </div>
              </div>

              <button onClick={() => setIsDateOpen(false)} className="w-full h-14 bg-[#007AFF] text-white rounded-[1.25rem] text-[15px] font-black active:scale-95 transition-transform">
                Подтвердить выбор
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isGuestOpen && (
          <div className="fixed inset-0 z-[9999] flex flex-col justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsGuestOpen(false)} className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="relative bg-white rounded-t-[2rem] p-5 pt-3 pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pointer-events-auto">
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[16px] font-black text-slate-600">Гости</h3>
                <button onClick={() => setIsGuestOpen(false)} className="h-7 w-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 active:scale-90"><X className="h-4 w-4" strokeWidth={2} /></button>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-[#F5F5F7] rounded-xl flex items-center justify-center text-slate-600">
                      <User className="h-5 w-5" strokeWidth={1} />
                    </div>
                    <div>
                      <div className="text-[15px] font-black text-slate-600">Взрослые</div>
                      <div className="text-[11px] font-medium text-slate-400">От 13 лет</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="h-8 w-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-600 active:bg-slate-50 disabled:opacity-30"
                      disabled={adults <= 1}
                    >
                      <Minus className="h-3 w-3" strokeWidth={3} />
                    </button>
                    <span className="text-[16px] font-black text-slate-600 w-4 text-center">{adults}</span>
                    <button 
                      onClick={() => setAdults(adults + 1)}
                      className="h-8 w-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-600 active:bg-slate-50"
                    >
                      <Plus className="h-3 w-3" strokeWidth={3} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-[#F5F5F7] rounded-xl flex items-center justify-center text-slate-600">
                      <Baby className="h-5 w-5" strokeWidth={1} />
                    </div>
                    <div>
                      <div className="text-[15px] font-black text-slate-600">Дети</div>
                      <div className="text-[11px] font-medium text-slate-400">До 12 лет</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setKids(Math.max(0, kids - 1))}
                      className="h-8 w-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-600 active:bg-slate-50 disabled:opacity-30"
                      disabled={kids <= 0}
                    >
                      <Minus className="h-3 w-3" strokeWidth={3} />
                    </button>
                    <span className="text-[16px] font-black text-slate-600 w-4 text-center">{kids}</span>
                    <button 
                      onClick={() => setKids(kids + 1)}
                      className="h-8 w-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-600 active:bg-slate-50"
                    >
                      <Plus className="h-3 w-3" strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>

              <button onClick={() => setIsGuestOpen(false)} className="w-full h-14 bg-[#007AFF] text-white rounded-[1.25rem] text-[15px] font-black active:scale-95 transition-transform">
                Готово
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
