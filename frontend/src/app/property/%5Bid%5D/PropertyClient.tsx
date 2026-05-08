"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, ChevronRight, Upload, MapPin, BedDouble, Bath, Square, 
  Wifi, Wind, Car, Waves, Map, Phone, X, Users, CheckCircle2, 
  AlignLeft, Sparkles, Tv, Coffee, Key, Snowflake, Zap, 
  Smartphone, Thermometer, ShieldCheck, Utensils
} from "lucide-react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { BottomNav } from "@/components/layout/BottomNav";
import { useTelegram } from "@/context/TelegramContext";
import { api } from "@/services/api";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, any> = { 
  Wifi, Tv, Wind, Coffee, Bath, Car, Utensils, Key, Snowflake, 
  Zap, Smartphone, Thermometer, ShieldCheck, Sparkles 
};

export function PropertyClient() {
  const params = useParams();
  const router = useRouter();
  const { toggleLike, liked } = useAppContext();
  const { dbUser } = useTelegram();
  
  const [property, setProperty] = useState<any>(null);
  const [complex, setComplex] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const propData = await api.getApartment(params.id as string);
        setProperty(propData);
        
        const complexes = await api.getComplexes();
        const comp = complexes.find((c: any) => c.id === propData.complex_id);
        setComplex(comp);
      } catch (error) {
        console.error("Failed to load property:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) {
      setIsLoading(true);
      loadData();
    }
  }, [params.id]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleScroll = () => {
    if (containerRef.current) setIsScrolled(containerRef.current.scrollTop > 50);
  };

  const handleBook = async () => {
    if (!dbUser || !property) return;
    try {
      const checkIn = new Date();
      checkIn.setDate(checkIn.getDate() + 2);
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + 5);
      await api.createBooking({
        apartment_id: property.id,
        client_id: dbUser.id,
        check_in: checkIn.toISOString(),
        check_out: checkOut.toISOString(),
        total_price: property.price * 3,
        status: "pending",
        payment_method: "Payme"
      });
      setIsBookingSuccess(true);
      setTimeout(() => router.push('/'), 2500);
    } catch (error) {
      console.error("Failed to create booking:", error);
    }
  };

  if (isLoading || !property) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-[20000]">
        <div className="size-8 border-2 border-slate-200 border-t-[#007AFF] rounded-full animate-spin" />
      </div>
    );
  }

  const isLiked = !!liked[property.id];

  // Parse structured amenities - ABSOLUTELY NO MOCK FALLBACKS
  let amenitiesDisplay: any[] = [];
  try {
    const parsed = property.amenities ? JSON.parse(property.amenities) : [];
    if (Array.isArray(parsed)) amenitiesDisplay = parsed;
    else throw new Error();
  } catch (e) {
    amenitiesDisplay = property.amenities && typeof property.amenities === 'string'
      ? property.amenities.split(",").map((s: string, i: number) => ({ id: i, name: s.trim(), icon: "Wifi" })) 
      : [];
  }

  return (
    <div className="fixed inset-0 bg-[#F5F5F7] overflow-hidden flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] cursor-pointer" onClick={() => router.push('/')} />

      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 400, mass: 0.8 }}
        className="relative w-full max-w-md mx-auto h-[88vh] bg-white rounded-t-[3rem] overflow-hidden shadow-none flex flex-col"
      >
        {/* Header */}
        <div className={`absolute top-0 left-0 right-0 z-[10001] px-5 flex items-center justify-between transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md border-b border-slate-100 pt-4 pb-4' : 'bg-transparent pt-10 pb-4'}`}>
          <button onClick={() => router.push('/')} className="h-[40px] w-[40px] rounded-full flex items-center justify-center bg-white border border-slate-100 text-slate-900 shadow-sm"><ChevronLeft className="h-6 w-6 ml-[-2px]" /></button>
          <div className="flex items-center gap-2">
             <button onClick={() => toggleLike(property.id)} className={cn("h-[40px] w-[40px] rounded-full flex items-center justify-center border shadow-sm transition-all", isLiked ? "bg-rose-500 border-rose-500 text-white" : "bg-white border-slate-100 text-slate-900")}>
                <X className={cn("h-5 w-5", isLiked ? "hidden" : "")} /> {/* Temporary icon check */}
                <span className={isLiked ? "block" : "hidden"}>❤️</span>
             </button>
             <button className="h-[40px] w-[40px] rounded-full flex items-center justify-center bg-white border border-slate-100 text-slate-900 shadow-sm"><Upload className="h-5 w-5" /></button>
          </div>
        </div>

        <div ref={containerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto no-scrollbar">
          <div className="relative h-[380px] w-full bg-slate-100 -mt-20">
            <Image src={property.image} alt={property.title} fill className="object-cover" />
          </div>

          <div className="relative -mt-10 bg-white rounded-t-[2.5rem] px-5 pt-10 pb-32">
            <div className="flex justify-between items-start mb-6">
              <div className="pr-3">
                {complex && (
                  <div className="flex items-center gap-1.5 text-[#007AFF] text-[10px] font-black uppercase tracking-widest mb-1.5">
                    <MapPin className="h-3 w-3" /> {complex.name}
                  </div>
                )}
                <h1 className="text-[22px] font-black text-slate-600 leading-tight mb-1.5">{property.title}</h1>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="text-[13px] font-semibold">{property.address}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                 <button className="h-[44px] w-[44px] rounded-full bg-[#F5F5F7] flex items-center justify-center text-slate-900 shadow-sm"><Map className="h-5 w-5" /></button>
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

            <div className="mt-8 pt-8 border-t border-slate-100">
               <h3 className="text-[18px] font-black text-slate-600 mb-4">Локация</h3>
               <div className="relative h-[200px] w-full rounded-[2.5rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-sm">
                  <iframe width="100%" height="100%" frameBorder="0" src={`https://maps.google.com/maps?q=${property.lat || property.address},${property.lng || ""}&t=&z=14&ie=UTF8&iwloc=&output=embed`}></iframe>
               </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-0 right-0 z-[10002] px-6 flex justify-center">
          <div className="w-full max-w-[340px] bg-white h-[64px] rounded-[2rem] px-2 pl-6 pr-2 flex items-center justify-between shadow-2xl border border-slate-100">
            <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Сутки</span>
                <span className="text-[16px] font-black text-slate-600 tracking-tight">{property.price.toLocaleString()} сум</span>
            </div>
            <button 
              onClick={handleBook}
              disabled={isBookingSuccess}
              className={cn(
                "h-[48px] px-8 rounded-[1.5rem] text-[13px] font-black shadow-lg active:scale-95 transition-all flex items-center justify-center",
                isBookingSuccess ? "bg-emerald-500 text-white" : "bg-[#007AFF] text-white shadow-blue-500/20"
              )}
            >
               {isBookingSuccess ? <CheckCircle2 className="size-5" /> : "Забронировать"}
            </button>
          </div>
        </div>
      </motion.div>
      <BottomNav />
    </div>
  );
}
