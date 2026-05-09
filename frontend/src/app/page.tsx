"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, ChevronLeft, ChevronRight, Plus, Minus, Users } from "lucide-react";
import { UserNavbar } from "@/components/layout/UserNavbar";
import { BookingFilter } from "@/features/dashboard/components/BookingFilter";
import { ApartmentList } from "@/features/dashboard/components/ApartmentList";
import { useAppContext } from "@/context/AppContext";
import { BottomNav } from "@/components/layout/BottomNav";
import { api } from "@/services/api";
import { cn } from "@/lib/utils";

const MONTHS = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

export default function Home() {
  const router = useRouter();
  const { 
    liked, toggleLike, adults, setAdults, kids, setKids,
    startDate, setStartDate, endDate, setEndDate 
  } = useAppContext();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [apartments, setApartments] = useState<any[]>([]);
  const [complexes, setComplexes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  
  const [selectingPhase, setSelectingPhase] = useState<'start' | 'end'>('start');

  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const daysInMonth = currentMonthIndex === 1 ? 28 : (currentMonthIndex % 2 === 0 ? 31 : 30);
  const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [aptData, compData] = await Promise.all([
          api.getApartments(),
          api.getComplexes()
        ]);
        setApartments(aptData);
        setComplexes(compData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (isDateOpen || isGuestOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDateOpen, isGuestOpen]);

  const filteredApartments = useMemo(() => {
    if (!searchQuery.trim()) return apartments;
    const q = searchQuery.toLowerCase();
    return apartments.filter(a => 
      a.title.toLowerCase().includes(q) || 
      a.address.toLowerCase().includes(q)
    );
  }, [apartments, searchQuery]);

  const groupedApartments = useMemo(() => {
    return complexes.map(complex => {
      const apts = filteredApartments.filter(a => a.complex_id === complex.id);
      return { ...complex, apartments: apts };
    }).filter(c => c.apartments.length > 0);
  }, [filteredApartments, complexes]);

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
    <main className="min-h-screen bg-[#F5F5F7] select-none font-sans relative">
      <div className="mx-auto max-w-md bg-[#F5F5F7] min-h-screen relative flex flex-col pb-24">
        
        <div className="bg-white/90 backdrop-blur-md sticky top-0 z-[100] border-b border-slate-100/50 rounded-b-[2rem]">
          <UserNavbar />
        </div>

        <div className="bg-white rounded-b-[2.5rem] border-b border-slate-100 pb-4 relative z-10">
          <div className="px-5 pt-1">
            <div className="w-full flex items-center h-12 bg-[#F5F5F7] rounded-[1.25rem] px-4 cursor-text border border-slate-100/50 transition-transform">
              <Search className="h-5 w-5 text-slate-800 mr-2.5" strokeWidth={1.5} />
              <input 
                type="text" 
                placeholder="Поиск адреса, улицы..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none w-full text-[14px] font-normal text-slate-900 placeholder:text-slate-500" 
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="size-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 ml-1">
                  <X className="size-3.5" />
                </button>
              )}
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
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="size-6 border-2 border-slate-200 border-t-[#007AFF] rounded-full animate-spin" />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pt-2">
              {groupedApartments.length > 0 ? (
                groupedApartments.map((group) => (
                  <div key={group.id} className="mb-6">
                    <ApartmentList 
                      title={group.name} 
                      complexId={group.id}
                      items={group.apartments} 
                      onSelect={(item) => router.push(`/property/${item.id}`)} 
                    />
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-24 px-10 text-center">
                  <div className="size-20 rounded-[2rem] bg-white flex items-center justify-center mb-6 shadow-sm border border-slate-50">
                    <Search className="size-8 text-slate-300" strokeWidth={1} />
                  </div>
                  <h3 className="text-[18px] font-black text-slate-700 mb-2">Ничего не найдено</h3>
                  <p className="text-[13px] text-slate-400 font-medium leading-relaxed">
                    К сожалению, по вашему запросу «<span className="text-slate-600 font-bold">{searchQuery}</span>» ничего не нашлось. Попробуйте изменить параметры поиска.
                  </p>
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="mt-8 px-6 h-11 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all"
                  >
                    Сбросить поиск
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <BottomNav />

        {/* --- MODALS --- */}
        <AnimatePresence>
          {isDateOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDateOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" />
              <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[2.5rem] z-[101] p-6 pb-10" >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[18px] font-black text-slate-900">Выберите даты</h3>
                  <button onClick={() => setIsDateOpen(false)} className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 active:scale-90 transition-transform"><X className="h-4 w-4" /></button>
                </div>
                
                <div className="flex items-center justify-between mb-4 px-2">
                  <button onClick={handlePrevMonth} className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 active:scale-90 transition-all"><ChevronLeft className="h-4.5 w-4.5 text-slate-600" /></button>
                  <span className="text-[13px] font-black uppercase tracking-widest text-slate-800">{MONTHS[currentMonthIndex]} 2026</span>
                  <button onClick={handleNextMonth} className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 active:scale-90 transition-all"><ChevronRight className="h-4.5 w-4.5 text-slate-600" /></button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-8">
                  {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map(d => <div key={d} className="text-center text-[10px] font-bold text-slate-400 py-2">{d}</div>)}
                  {dates.map(day => (
                    <button 
                      key={day} 
                      onClick={() => handleDateClick(day)}
                      className={cn(
                        "h-11 w-full rounded-xl text-[13px] font-black transition-all relative",
                        isSelected(day) 
                          ? "bg-[#007AFF] text-white shadow-none" 
                          : isRange(day) 
                            ? "bg-[#007AFF]/5 text-[#007AFF]" 
                            : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                <button onClick={() => setIsDateOpen(false)} className="w-full h-14 bg-slate-900 text-white rounded-[1.25rem] text-[14px] font-black uppercase tracking-widest active:scale-[0.98] transition-transform">Применить</button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isGuestOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsGuestOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" />
              <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[2.5rem] z-[101] p-6 pb-10" >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[18px] font-black text-slate-900">Количество гостей</h3>
                  <button onClick={() => setIsGuestOpen(false)} className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 active:scale-90 transition-transform"><X className="h-4 w-4" /></button>
                </div>
                
                <div className="space-y-6 mb-10">
                   {/* Adults */}
                   <div className="flex items-center justify-between">
                      <div>
                         <h4 className="text-[15px] font-black text-slate-800">Взрослые</h4>
                         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">От 13 лет</p>
                      </div>
                      <div className="flex items-center gap-4">
                         <button onClick={() => setAdults(Math.max(1, adults - 1))} className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 active:scale-90 transition-all"><Minus className="h-4 w-4" /></button>
                         <span className="text-[16px] font-black text-slate-900 w-4 text-center">{adults}</span>
                         <button onClick={() => setAdults(adults + 1)} className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 active:scale-90 transition-all"><Plus className="h-4 w-4" /></button>
                      </div>
                   </div>

                   {/* Kids */}
                   <div className="flex items-center justify-between">
                      <div>
                         <h4 className="text-[15px] font-black text-slate-800">Дети</h4>
                         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">До 12 лет</p>
                      </div>
                      <div className="flex items-center gap-4">
                         <button onClick={() => setKids(Math.max(0, kids - 1))} className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 active:scale-90 transition-all"><Minus className="h-4 w-4" /></button>
                         <span className="text-[16px] font-black text-slate-900 w-4 text-center">{kids}</span>
                         <button onClick={() => setKids(kids + 1)} className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 active:scale-90 transition-all"><Plus className="h-4 w-4" /></button>
                      </div>
                   </div>
                </div>

                <button onClick={() => setIsGuestOpen(false)} className="w-full h-14 bg-slate-900 text-white rounded-[1.25rem] text-[15px] font-black uppercase tracking-widest">Готово</button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
