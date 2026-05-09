"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, ChevronRight, Upload, MapPin, BedDouble, Bath, Square, 
  Wifi, Wind, Car, Waves, Map, Phone, X, Users, CheckCircle2, 
  AlignLeft, Sparkles, Tv, Coffee, Key, Snowflake, Zap, 
  Smartphone, Thermometer, ShieldCheck, Utensils, Home, Star, Heart, ArrowLeft,
  Minus, Plus
} from "lucide-react";
import Link from "next/link";
import { ApartmentList } from "@/features/dashboard/components/ApartmentList";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { api } from "@/services/api";
import { cn, formatNumber } from "@/lib/utils";
import { useTelegram } from "@/context/TelegramContext";

const ICON_MAP: Record<string, any> = { 
  Wifi, Tv, Wind, Coffee, Bath, Car, Utensils, Key, Snowflake, 
  Zap, Smartphone, Thermometer, ShieldCheck, Sparkles 
};

export function PropertyModalClient() {
  const params = useParams();
  const router = useRouter();
  const { 
    liked, toggleLike, 
    startDate, endDate, adults, kids, 
    setStartDate, setEndDate, setAdults, setKids, 
  } = useAppContext();
  const { dbUser, isLoading: isUserLoading } = useTelegram();
  
  const [property, setProperty] = useState<any>(null);
  const [complex, setComplex] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const [imagesList, setImagesList] = useState<string[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [isLocalDateOpen, setIsLocalDateOpen] = useState(false);
  const [isLocalGuestOpen, setIsLocalGuestOpen] = useState(false);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const [selectingPhase, setSelectingPhase] = useState<'start' | 'end'>('start');
  const [relatedApartments, setRelatedApartments] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [datePickerMessage, setDatePickerMessage] = useState<string | null>(null);

  const nights = useMemo(() => {
    if (!startDate || !endDate) return 1;
    return Math.max(1, Number(endDate) - Number(startDate));
  }, [startDate, endDate]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setProperty(null);
      setComplex(null);
      try {
        const propData = await api.getApartment(params.id as string);
        setProperty(propData);
        
        let parsedImages = [];
        try {
          parsedImages = propData.images ? JSON.parse(propData.images) : [propData.image];
        } catch (e) {
          parsedImages = [propData.image];
        }
        setImagesList(parsedImages);
        
        const complexes = await api.getComplexes();
        const comp = complexes.find((c: any) => String(c.id) === String(propData.complex_id));
        setComplex(comp);

        const allApts = await api.getApartments();
        setRelatedApartments(allApts.filter((a: any) => String(a.complex_id) === String(propData.complex_id) && a.id !== propData.id));
      } catch (error) {
        console.error("Failed to load property:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) loadData();
  }, [params.id]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleScroll = () => {
    if (containerRef.current) setIsScrolled(containerRef.current.scrollTop > 50);
  };

  const handleGalleryScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const width = e.currentTarget.offsetWidth;
    const scroll = e.currentTarget.scrollLeft;
    setCurrentImg(Math.round(scroll / width));
  };

  if (isLoading || !property) {
    return (
      <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="size-8 border-2 border-slate-200 border-t-[#007AFF] rounded-full animate-spin" />
      </div>
    );
  }

  const MONTHS = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  const daysInMonth = currentMonthIndex === 1 ? 28 : (currentMonthIndex % 2 === 0 ? 31 : 30);
  const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleNextMonth = () => setCurrentMonthIndex((prev) => (prev + 1) % 12);
  const handlePrevMonth = () => setCurrentMonthIndex((prev) => (prev === 0 ? 11 : prev - 1));

  const handleDateClick = (day: number) => {
    if (selectingPhase === 'start') {
      setStartDate(day);
      setEndDate(null);
      setSelectingPhase('end');
      setDatePickerMessage("Теперь выберите дату выезда");
    } else {
      if (startDate && day < startDate) {
        setStartDate(day);
        setEndDate(null);
        setSelectingPhase('end');
        setDatePickerMessage("Теперь выберите дату выезда");
      } else {
        setEndDate(day);
        setSelectingPhase('start');
        setDatePickerMessage(null);
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

  const handleBook = async () => {
    if (!startDate) {
      setDatePickerMessage("Выберите дату заезда");
      setIsLocalDateOpen(true);
      return;
    }
    if (!endDate) {
      setDatePickerMessage("Выберите дату выезда");
      setIsLocalDateOpen(true);
      return;
    }
    setIsConfirmOpen(true);
  };

  const confirmBooking = async () => {
    if (isUserLoading) return;
    if (!dbUser || !property || !startDate || !endDate) {
      if (!dbUser) alert("Ошибка авторизации. Перезапустите приложение.");
      return;
    }
    setIsBookingLoading(true);
    try {
      const checkIn = new Date(2026, 4, Number(startDate));
      const checkOut = new Date(2026, 4, Number(endDate));
      
      const totalGuests = (Number(adults) || 2) + (Number(kids) || 0);
      
      await api.createBooking({
        apartment_id: property.id,
        client_id: dbUser.id,
        check_in: checkIn.toISOString(),
        check_out: checkOut.toISOString(),
        total_price: property.price * nights,
        status: "pending",
        guests: totalGuests,
        guests_count: totalGuests,
        adults: Number(adults) || 2,
        kids: Number(kids) || 0,
        payment_method: "Tashkent"
      });
      setIsBookingSuccess(true);
    } catch (error) {
      console.error("Failed to create booking:", error);
      alert("Ошибка при создании бронирования. Попробуйте еще раз.");
    } finally {
      setIsBookingLoading(false);
    }
  };

  let amenitiesDisplay: any[] = [];
  try {
    const parsed = property.amenities ? JSON.parse(property.amenities) : [];
    if (Array.isArray(parsed)) amenitiesDisplay = parsed;
  } catch (e) {
    amenitiesDisplay = property.amenities && typeof property.amenities === 'string'
      ? property.amenities.split(",").map((s: string, i: number) => ({ id: i, name: s.trim(), icon: "Wifi" })) 
      : [];
  }

  return (
    <div className="fixed inset-0 z-[10000] flex flex-col justify-end">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => router.back()} className="absolute inset-0 bg-black/40 backdrop-blur-[2px] cursor-pointer" />

      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 400, mass: 0.8 }}
        className="relative w-full max-w-md mx-auto h-[88vh] bg-white rounded-t-[3rem] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className={`absolute top-0 left-0 right-0 z-[10001] px-5 flex items-center justify-between transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md border-b border-slate-100 pt-4 pb-4' : 'bg-transparent pt-10 pb-4'}`}>
          <button onClick={() => router.back()} className="h-[40px] w-[40px] rounded-full flex items-center justify-center bg-white border border-slate-100 text-slate-900 shadow-sm active:scale-95 transition-transform">
            <ChevronLeft className="h-6 w-6 ml-[-2px]" strokeWidth={1} />
          </button>
          <div className="flex items-center gap-2">
             <button className="h-[40px] w-[40px] rounded-full flex items-center justify-center bg-white border border-slate-100 text-slate-900 shadow-sm">
               <Upload className="h-5 w-5" strokeWidth={1.5} />
             </button>
             <button 
              onClick={() => toggleLike(property.id)} 
              className="h-[40px] w-[40px] rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm"
             >
                <Heart className={cn("h-5 w-5", liked[property.id] ? "fill-rose-500 text-rose-500" : "text-slate-900")} strokeWidth={1.5} />
             </button>
          </div>
        </div>

        <div ref={containerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto no-scrollbar">
          <div 
             onClick={() => setIsGalleryOpen(true)}
             className="relative h-[380px] w-full bg-slate-100 -mt-20 overflow-hidden cursor-pointer"
          >
            <div 
               onScroll={handleGalleryScroll}
               className="flex w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
            >
               {imagesList.map((img, idx) => (
                  <div key={idx} className="w-full h-full shrink-0 snap-center relative">
                     <Image src={img} alt={`${property.title} - ${idx + 1}`} fill className="object-cover" />
                  </div>
               ))}
            </div>
            
            {imagesList.length > 1 && (
               <div className="absolute bottom-16 left-0 right-0 z-20">
                  <div className="flex gap-2 px-5 py-2 overflow-x-auto snap-x snap-mandatory no-scrollbar w-full justify-center">
                     {imagesList.map((img, idx) => (
                        <button 
                           key={idx}
                           onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImg(idx);
                              const container = containerRef.current?.querySelector('.snap-x');
                              if (container) {
                                 const width = (container as HTMLElement).offsetWidth;
                                 container.scrollTo({ left: idx * width, behavior: 'smooth' });
                              }
                           }}
                           className={cn(
                              "relative size-14 rounded-2xl overflow-hidden shrink-0 transition-all duration-300 border-2 snap-center",
                              currentImg === idx ? "border-white scale-110 shadow-lg" : "border-transparent opacity-60"
                           )}
                        >
                           <Image src={img} alt="preview" fill className="object-cover" />
                        </button>
                     ))}
                  </div>
               </div>
            )}
            
            {imagesList.length > 1 && (
               <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-1.5 z-10">
                  {imagesList.map((_, idx) => (
                     <div 
                        key={idx} 
                        className={cn(
                           "h-1.5 rounded-full transition-all duration-300",
                           currentImg === idx ? "w-4 bg-white" : "w-1.5 bg-white/40"
                        )} 
                     />
                  ))}
               </div>
            )}
          </div>

          <div className="relative -mt-10 bg-white rounded-t-[2.5rem] px-5 pt-10 pb-32 min-h-full">
            <div className="flex justify-between items-start mb-6">
              <div className="pr-3">
                {complex && (
                  <Link href={`/complex/${complex.id}`} className="flex items-center gap-1.5 text-[#007AFF] text-[10px] font-black uppercase tracking-widest mb-1.5 active:opacity-60 transition-opacity">
                    <Star className="h-3 w-3 fill-current" /> {complex.name}
                  </Link>
                )}
                <h1 className="text-[24px] font-black text-slate-800 leading-tight mb-1.5">{property.title}</h1>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="text-[13px] font-semibold">{property.address}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                 <button className="h-[44px] w-[44px] rounded-full bg-[#F5F5F7] flex items-center justify-center text-slate-900 border border-slate-100 active:scale-95 transition-transform">
                   <Phone className="h-5 w-5" strokeWidth={1.5} />
                 </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-8">
              {[
                { icon: Users, label: "Гости", val: property.guests },
                { icon: BedDouble, label: "Спальни", val: property.bedrooms || 1 },
                { icon: Bath, label: "Ванные", val: property.bathrooms || 1 },
                { icon: Square, label: "Площадь", val: property.size }
              ].map((s, i) => (
                <div key={i} className="bg-[#F8F9FB] border border-slate-50 py-3 rounded-2xl flex flex-col items-center justify-center">
                  <s.icon className="h-4 w-4 text-[#007AFF] mb-1.5" />
                  <span className="text-[13px] font-black text-slate-600 leading-none">{s.val}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="mb-8">
               <h3 className="text-[18px] font-black text-slate-600 mb-3 flex items-center gap-2">
                 <AlignLeft className="size-4.5 text-[#007AFF]" /> Описание
               </h3>
               <p className="text-[14px] text-slate-500 leading-relaxed font-medium">
                 {property.description || ""}
               </p>
            </div>

            {amenitiesDisplay.length > 0 && (
              <div className="mb-10">
                <h3 className="text-[18px] font-black text-slate-600 mb-5 flex items-center gap-2">
                  <Sparkles className="size-4.5 text-[#007AFF]" /> Удобства
                </h3>
                <div className="flex flex-col gap-3">
                  {amenitiesDisplay.map((a, i) => {
                    const Icon = ICON_MAP[a.icon] || Wifi;
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-[#F5F5F7] border border-slate-100 flex items-center justify-center text-slate-900 shrink-0"><Icon className="h-4.5 w-4.5" /></div>
                        <div className="flex-1 border-b border-slate-50 pb-3 last:border-0 last:pb-0"><span className="text-[14px] font-semibold text-slate-600 leading-tight">{a.name}</span></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {relatedApartments.length > 0 && (
              <div className="mt-8 pt-8 border-t border-slate-100">
                 <ApartmentList title="Другие в этом ЖК" items={relatedApartments} />
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-6 left-0 right-0 z-[10002] px-6 flex justify-center pointer-events-none">
          <div className="w-full max-w-[340px] bg-white h-[64px] rounded-[2rem] px-2 pl-6 pr-2 flex items-center justify-between border border-slate-100 pointer-events-auto shadow-2xl shadow-slate-200/50">
            <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Сутки</span>
                <span className="text-[16px] font-black text-slate-800 tracking-tight">{formatNumber(property.price)} сум</span>
            </div>
            <button 
              onClick={handleBook}
              disabled={isBookingSuccess}
              className={cn(
                "h-[48px] px-8 rounded-[1.5rem] text-[13px] font-black active:scale-95 transition-all flex items-center justify-center shadow-lg",
                isBookingSuccess ? "bg-emerald-500 text-white shadow-emerald-200" : "bg-[#007AFF] text-white shadow-blue-200"
              )}
            >
              {isBookingSuccess ? <CheckCircle2 className="size-5" /> : "Забронировать"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Fullscreen Gallery Overlay */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[20000] bg-black flex flex-col items-center justify-center"
          >
             <div className="absolute top-12 left-5 right-5 flex justify-between items-center z-20">
                <div>
                   <h4 className="text-white font-black text-[15px] uppercase tracking-tight">{property.title}</h4>
                   <p className="text-white/50 font-bold text-[10px] uppercase tracking-widest">{currentImg + 1} / {imagesList.length}</p>
                </div>
                <button onClick={() => setIsGalleryOpen(false)} className="h-11 w-11 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center text-white border border-white/10 active:scale-90 transition-transform">
                   <X className="h-6 w-6" strokeWidth={1} />
                </button>
             </div>

             <div className="relative w-full h-full flex items-center justify-center px-2">
                <button 
                   onClick={() => setCurrentImg((prev) => (prev > 0 ? prev - 1 : imagesList.length - 1))} 
                   className="absolute left-4 z-20 h-12 w-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform border border-white/10"
                >
                   <ChevronLeft className="h-6 w-6" strokeWidth={1} />
                </button>

                <AnimatePresence mode="wait">
                   <motion.div 
                      key={currentImg} 
                      initial={{ opacity: 0, scale: 0.95 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      exit={{ opacity: 0, scale: 1.05 }} 
                      transition={{ duration: 0.3, ease: "easeOut" }} 
                      className="relative w-full h-[65vh]"
                   >
                      <Image src={imagesList[currentImg]} alt="Full Gallery" fill className="object-contain" />
                   </motion.div>
                </AnimatePresence>

                <button 
                   onClick={() => setCurrentImg((prev) => (prev < imagesList.length - 1 ? prev + 1 : 0))} 
                   className="absolute right-4 z-20 h-12 w-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform border border-white/10"
                >
                   <ChevronRight className="h-6 w-6" strokeWidth={1} />
                </button>
             </div>

             <div className="absolute bottom-10 left-0 right-0 px-6 overflow-x-auto no-scrollbar z-20 py-4">
                <div className="flex gap-4 justify-center items-center h-20">
                   {imagesList.map((img, idx) => (
                     <button 
                        key={idx} 
                        onClick={(e) => { e.stopPropagation(); setCurrentImg(idx); }} 
                        className={cn(
                           "relative h-14 w-14 rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-300 border-2",
                           currentImg === idx ? 'border-[#007AFF] scale-110 shadow-[0_0_20px_rgba(0,122,255,0.4)]' : 'border-transparent opacity-40'
                        )}
                     >
                        <Image src={img} alt="thumb" fill className="object-cover" />
                     </button>
                   ))}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Confirmation Modal */}
      <AnimatePresence>
        {isConfirmOpen && startDate && endDate && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsConfirmOpen(false)} 
              className="fixed inset-0 z-[30000] bg-black/60 backdrop-blur-md pointer-events-auto" 
            />
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }} 
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[30001] max-w-md mx-auto bg-white rounded-t-[2.5rem] p-6 pb-12 border-t border-slate-100 pointer-events-auto shadow-2xl"
            >
              {!isBookingSuccess ? (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[20px] font-black text-slate-900">Подтверждение</h3>
                    <button onClick={() => setIsConfirmOpen(false)} className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 active:scale-90 transition-transform">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="p-4 bg-slate-50 rounded-[1.75rem] border border-slate-100">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Объект</span>
                        <span className="text-[15px] font-black text-slate-800 truncate">{property.title}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-slate-50 rounded-[1.75rem] border border-slate-100 flex flex-col justify-between">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Даты</span>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[13px] font-black text-slate-800">{startDate}{endDate ? ` - ${endDate}` : ""} мая</span>
                          <button onClick={() => { setIsConfirmOpen(false); setIsLocalDateOpen(true); }} className="text-[9px] font-black text-[#007AFF] uppercase underline">Изм.</button>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-[1.75rem] border border-slate-100 flex flex-col justify-between">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Гости</span>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[13px] font-black text-slate-800">{adults + kids} чел.</span>
                          <button onClick={() => { setIsConfirmOpen(false); setIsLocalGuestOpen(true); }} className="text-[9px] font-black text-[#007AFF] uppercase underline">Изм.</button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-[1.75rem] border border-slate-100 flex items-center justify-between">
                       <span className="text-[14px] font-black text-slate-900">Итого за {nights} ночи</span>
                       <span className="text-[16px] font-black text-[#007AFF] tracking-tight">{formatNumber(property.price * nights)} сум</span>
                    </div>
                  </div>

                  <button 
                    onClick={confirmBooking}
                    disabled={isBookingLoading}
                    className="w-full h-14 bg-[#007AFF] text-white rounded-[1.25rem] text-[15px] font-black uppercase tracking-widest active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-50 shadow-lg shadow-blue-500/30"
                  >
                    {isBookingLoading ? (
                      <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Забронировать"
                    )}
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center py-6 text-center">
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ type: "spring", damping: 15, stiffness: 200 }}
                    className="size-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4"
                  >
                    <CheckCircle2 className="size-8" />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h3 className="text-[20px] font-black text-slate-900 mb-1">Заявка принята!</h3>
                    <p className="text-[13px] font-medium text-slate-400 mb-6">
                      Наш админ свяжется с вами в течение 5 минут.
                    </p>
                  </motion.div>

                  <motion.button 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => {
                      router.back();
                      setTimeout(() => {
                        router.push('/trips');
                      }, 100);
                    }}
                    className="w-full h-14 bg-slate-900 text-white rounded-[1.25rem] text-[15px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-slate-900/10"
                  >
                    Готово
                  </motion.button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Date Picker Modal */}
      <AnimatePresence>
        {isLocalDateOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setIsLocalDateOpen(false); setDatePickerMessage(null); }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[40000] pointer-events-auto" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[2.5rem] z-[40001] p-6 pb-10 shadow-2xl pointer-events-auto" >
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col">
                  <h3 className="text-[18px] font-black text-slate-900">Выберите даты</h3>
                  {datePickerMessage && (
                    <span className="text-[12px] font-bold text-[#007AFF] animate-pulse">{datePickerMessage}</span>
                  )}
                </div>
                <button onClick={() => { setIsLocalDateOpen(false); setDatePickerMessage(null); }} className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><X className="h-4 w-4" /></button>
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
                        ? "bg-[#007AFF] text-white" 
                        : isRange(day) 
                          ? "bg-[#007AFF]/5 text-[#007AFF]" 
                          : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>

              <button onClick={() => { 
                if (!startDate) {
                  setDatePickerMessage("Пожалуйста, выберите дату заезда");
                  return;
                }
                if (!endDate) {
                  setDatePickerMessage("Пожалуйста, выберите дату выезда");
                  return;
                }
                setIsLocalDateOpen(false); 
                setDatePickerMessage(null);
                setIsConfirmOpen(true); 
              }} className="w-full h-14 bg-slate-900 text-white rounded-[1.25rem] text-[14px] font-black uppercase tracking-widest">Готово</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Guest Picker Modal */}
      <AnimatePresence>
        {isLocalGuestOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsLocalGuestOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[40000] pointer-events-auto" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[2.5rem] z-[40001] p-6 pb-10 shadow-2xl pointer-events-auto" >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[18px] font-black text-slate-900">Количество гостей</h3>
                <button onClick={() => setIsLocalGuestOpen(false)} className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><X className="h-4 w-4" /></button>
              </div>
              
              <div className="space-y-6 mb-10">
                 <div className="flex items-center justify-between">
                    <div>
                       <h4 className="text-[15px] font-black text-slate-800">Взрослые</h4>
                       <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">От 13 лет</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <button onClick={() => setAdults(Math.max(1, adults - 1))} className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600"><Minus className="h-4 w-4" /></button>
                       <span className="text-[16px] font-black text-slate-900 w-4 text-center">{adults}</span>
                       <button onClick={() => setAdults(adults + 1)} className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600"><Plus className="h-4 w-4" /></button>
                    </div>
                 </div>
                 <div className="flex items-center justify-between">
                    <div>
                       <h4 className="text-[15px] font-black text-slate-800">Дети</h4>
                       <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">До 12 лет</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <button onClick={() => setKids(Math.max(0, kids - 1))} className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600"><Minus className="h-4 w-4" /></button>
                       <span className="text-[16px] font-black text-slate-900 w-4 text-center">{kids}</span>
                       <button onClick={() => setKids(kids + 1)} className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600"><Plus className="h-4 w-4" /></button>
                    </div>
                 </div>
              </div>

              <button onClick={() => { setIsLocalGuestOpen(false); setIsConfirmOpen(true); }} className="w-full h-14 bg-slate-900 text-white rounded-[1.25rem] text-[15px] font-black uppercase tracking-widest">Готово</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
