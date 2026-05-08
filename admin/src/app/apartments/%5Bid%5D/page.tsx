"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, MapPin, Users, Ruler, CreditCard, Calendar, ChevronRight, 
  Edit2, Trash2, Wifi, Tv, Wind, Coffee, ShieldCheck, CheckCircle2, 
  Clock, History, MoreVertical, Camera, Layers, Sparkles, Activity, 
  ChevronLeft, Navigation, Globe, Home, ArrowUpRight, X, Plus, 
  Image as ImageIcon, Save, Map as MapIcon, Car, Bath, Utensils,
  Key, Snowflake, Zap, Smartphone, Thermometer, Star, TrendingUp, Maximize2,
  AlignLeft, BedDouble
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { api } from "@/services/api";

const ICON_OPTIONS = [
  { name: "Wifi", icon: Wifi }, { name: "Tv", icon: Tv }, { name: "Wind", icon: Wind },
  { name: "Coffee", icon: Coffee }, { name: "Bath", icon: Bath }, { name: "Car", icon: Car },
  { name: "Utensils", icon: Utensils }, { name: "Key", icon: Key }, { name: "Snowflake", icon: Snowflake },
  { name: "Zap", icon: Zap }, { name: "Smartphone", icon: Smartphone }, { name: "Thermometer", icon: Thermometer },
  { name: "ShieldCheck", icon: ShieldCheck }, { name: "Sparkles", icon: Sparkles }
];

const ICON_MAP: Record<string, any> = ICON_OPTIONS.reduce((acc, curr) => ({...acc, [curr.name]: curr.icon}), {});

const formatPrice = (num: number | string) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export default function ApartmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  const [apt, setApt] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadApt = async () => {
    try {
      const data = await api.getApartments(); 
      const item = data.find((a: any) => a.id === parseInt(params.id as string));
      if (item) {
        setApt(item);
        setEditData(item);
      }
    } catch (error) {
      console.error("Failed to load apartment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) loadApt();
  }, [params.id]);

  useEffect(() => {
    if (isEditOpen || isFullscreenOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isEditOpen, isFullscreenOpen]);

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    const len = (apt?.images?.length || (apt?.image ? 1 : 0)) || 1;
    setCurrentImg((prev) => (prev + 1) % len);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    const len = (apt?.images?.length || (apt?.image ? 1 : 0)) || 1;
    setCurrentImg((prev) => (prev - 1 + len) % len);
  };

  const saveChanges = async () => {
    try {
      const updated = await api.updateApartment(apt.id, {
        title: editData.title,
        description: editData.description,
        price: editData.price,
        size: editData.size,
        address: editData.address,
        guests: editData.guests,
        bedrooms: editData.bedrooms,
        bathrooms: editData.bathrooms,
        lat: editData.lat,
        lng: editData.lng,
      });
      setApt(updated);
      setIsEditOpen(false);
      loadApt(); // Refresh
    } catch (error) {
      console.error("Failed to update apartment:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!apt) {
    return (
      <div className="text-center py-20">
        <h3 className="text-[14px] font-black uppercase tracking-widest">Объект не найден</h3>
        <button onClick={() => router.back()} className="mt-4 text-primary text-[11px] font-black uppercase tracking-widest">Вернуться назад</button>
      </div>
    );
  }

  const images = apt.images && apt.images.length > 0 ? apt.images : [apt.image];

  return (
    <div className="w-full flex flex-col relative font-sans pb-10">
      
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => router.back()} className="group flex items-center gap-2 px-3 h-8 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-none">
          <ArrowLeft className="size-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900">К списку</span>
        </button>
        
        <div className="flex items-center gap-2">
           <button onClick={() => { setIsEditOpen(true); setEditData(apt); }} className="h-8 px-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-none">
              НАСТРОЙКИ
           </button>
        </div>
      </div>

      {/* ── Top Cover & Info ── */}
      <div className="admin-card !p-0 overflow-hidden border-slate-100 bg-white mb-6 group shadow-none">
        <div 
           className="relative h-[260px] w-full cursor-pointer"
           onClick={() => setIsFullscreenOpen(true)}
        >
           <AnimatePresence mode="wait">
             <motion.img 
               key={currentImg} 
               src={images[currentImg]} 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }} 
               className="w-full h-full object-cover" 
             />
           </AnimatePresence>
           
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
           
           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="size-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                 <Maximize2 className="size-5" />
              </div>
           </div>
           
           {images.length > 1 && (
             <>
               <button onClick={prevImg} className="absolute left-4 top-1/2 -translate-y-1/2 size-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100 shadow-none">
                 <ChevronLeft className="size-5" />
               </button>
               <button onClick={nextImg} className="absolute right-4 top-1/2 -translate-y-1/2 size-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100 shadow-none">
                 <ChevronRight className="size-5" />
               </button>
             </>
           )}

           <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest border border-white/20 shadow-none">
                 {apt.status === "free" ? "СВОБОДНО" : apt.status === "busy" ? "ЗАНЯТО" : "РЕМОНТ"}
              </span>
           </div>

           <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
              <div>
                 <div className="flex items-center gap-2 mb-1.5">
                    <h1 className="text-[24px] font-black text-white tracking-tight leading-none">{apt.title}</h1>
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-1.5 py-0.5 rounded-md text-white text-[10px] font-black border border-white/20 shadow-none">
                       <Star className="size-2.5 text-amber-400 fill-amber-400" />
                       4.95
                    </div>
                 </div>
                 <div className="flex items-center gap-1.5 text-slate-300 text-[11px] font-bold uppercase tracking-widest">
                    <MapPin className="size-3.5 text-white" /> {apt.address}
                 </div>
              </div>
              
              {images.length > 1 && (
                <div className="flex gap-1.5 p-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10 shadow-none" onClick={(e) => e.stopPropagation()}>
                   {images.map((_, i) => (
                      <div key={i} onClick={() => setCurrentImg(i)} className={cn("h-1 rounded-full transition-all cursor-pointer shadow-none", currentImg === i ? "w-6 bg-white" : "w-2 bg-white/40")} />
                   ))}
                </div>
              )}
           </div>
        </div>

        {/* 4-Column Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-slate-50 bg-white">
           {[
             { label: "ЦЕНА ЗА СУТКИ", value: formatPrice(apt.price), suffix: " сум", icon: CreditCard, color: "text-emerald-500" },
             { label: "ВМЕСТИМОСТЬ", value: apt.guests, suffix: " гостя", icon: Users, color: "text-blue-500" },
             { label: "ПЛОЩАДЬ", value: apt.size, suffix: "", icon: Ruler, color: "text-amber-500" },
             { label: "ЗАГРУЗКА", value: "85", suffix: "%", icon: Activity, color: "text-primary" },
           ].map((s, i) => (
              <div key={i} className={cn("p-4 flex flex-col gap-1", i < 3 && "border-r border-slate-50")}>
                 <div className="flex items-center gap-1.5">
                    <s.icon className={cn("size-3", s.color)} />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
                 </div>
                 <div className="flex items-baseline gap-1">
                    <span className="text-[16px] font-black tabular-nums tracking-tight">{s.value}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase">{s.suffix}</span>
                 </div>
              </div>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 space-y-6">
            
            <div className="admin-card !p-5 border-slate-100 bg-white shadow-none">
               <h2 className="text-[11px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-400">
                  <AlignLeft className="size-3.5 text-primary" /> ОПИСАНИЕ ОБЪЕКТА
               </h2>
               <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
                  {apt.description || "Описание не заполнено. Добавьте информацию через настройки."}
               </p>
            </div>

            <div className="admin-card !p-5 border-slate-100 bg-white shadow-none">
               <h2 className="text-[11px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-400">
                  <Sparkles className="size-3.5 text-primary" /> СПИСОК УДОБСТВ
               </h2>
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(apt.amenities?.split(",") || ["Wi-Fi", "Кондиционер", "Smart TV"]).map((item: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors group shadow-none">
                        <div className="size-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-slate-900 transition-all shadow-none">
                          <Wifi className="size-4" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-tight text-slate-700">{item}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="admin-card !p-5 border-slate-100 bg-white shadow-none">
               <h2 className="text-[11px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-400">
                  <Navigation className="size-3.5 text-primary" /> КООРДИНАТЫ И ЛОКАЦИЯ
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                     <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between shadow-none">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ШИРОТА (LAT)</span>
                        <span className="text-[12px] font-black tabular-nums">{apt.lat || "41.311081"}</span>
                     </div>
                     <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between shadow-none">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ДОЛГОТА (LNG)</span>
                        <span className="text-[12px] font-black tabular-nums">{apt.lng || "69.240562"}</span>
                     </div>
                  </div>
                  <div className="h-[140px] rounded-xl overflow-hidden relative border border-slate-100 shadow-none">
                     <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                        <MapIcon className="size-8 text-slate-300" />
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="admin-card !p-5 border-slate-100 bg-white shadow-none">
               <h2 className="text-[10px] font-black uppercase tracking-widest mb-4 text-slate-400">Параметры комнат</h2>
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="size-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shadow-none">
                           <BedDouble className="size-4" />
                        </div>
                        <span className="text-[12px] font-bold text-slate-600">Спальни</span>
                     </div>
                     <span className="text-[14px] font-black tabular-nums">{apt.bedrooms || 1}</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="size-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-none">
                           <Bath className="size-4" />
                        </div>
                        <span className="text-[12px] font-bold text-slate-600">Ванные</span>
                     </div>
                     <span className="text-[14px] font-black tabular-nums">{apt.bathrooms || 1}</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* ── SETTINGS DRAWER ── */}
      <AnimatePresence>
        {isEditOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditOpen(false)} className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-[200]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white z-[201] flex flex-col border-l border-slate-100 shadow-none" >
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
                 <h3 className="text-[14px] font-black uppercase tracking-tight">Настройки</h3>
                 <button onClick={() => setIsEditOpen(false)} className="size-8 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors shadow-none"><X className="size-4" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-white relative">
                 <div className="grid grid-cols-1 gap-5">
                    <div className="space-y-1.5 px-1">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Название</label>
                       <input value={editData.title} onChange={(e) => setEditData({...editData, title: e.target.value})} className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none focus:ring-1 focus:ring-primary/20 transition-all shadow-none" />
                    </div>

                    <div className="space-y-1.5 px-1">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Описание</label>
                       <textarea rows={4} value={editData.description} onChange={(e) => setEditData({...editData, description: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-medium outline-none focus:ring-1 focus:ring-primary/20 transition-all shadow-none resize-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 px-1">
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Сутки (СУМ)</label>
                          <input type="number" value={editData.price} onChange={(e) => setEditData({...editData, price: parseInt(e.target.value) || 0})} className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none tabular-nums focus:ring-1 focus:ring-primary/20 shadow-none" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Метраж</label>
                          <input value={editData.size} onChange={(e) => setEditData({...editData, size: e.target.value})} className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none focus:ring-1 focus:ring-primary/20 shadow-none" />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 px-1">
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Спальни</label>
                          <input type="number" value={editData.bedrooms} onChange={(e) => setEditData({...editData, bedrooms: parseInt(e.target.value) || 1})} className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none tabular-nums focus:ring-1 focus:ring-primary/20 shadow-none" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ванные</label>
                          <input type="number" value={editData.bathrooms} onChange={(e) => setEditData({...editData, bathrooms: parseInt(e.target.value) || 1})} className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none tabular-nums focus:ring-1 focus:ring-primary/20 shadow-none" />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 px-1">
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Широта (LAT)</label>
                          <input value={editData.lat} onChange={(e) => setEditData({...editData, lat: e.target.value})} className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none tabular-nums focus:ring-1 focus:ring-primary/20 shadow-none" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Долгота (LNG)</label>
                          <input value={editData.lng} onChange={(e) => setEditData({...editData, lng: e.target.value})} className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none tabular-nums focus:ring-1 focus:ring-primary/20 shadow-none" />
                       </div>
                    </div>

                    <div className="space-y-1.5 px-1">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Адрес</label>
                       <input value={editData.address} onChange={(e) => setEditData({...editData, address: e.target.value})} className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none focus:ring-1 focus:ring-primary/20 transition-all shadow-none" />
                    </div>
                 </div>
              </div>

              <div className="p-5 border-t border-slate-100 bg-white sticky bottom-0 z-20">
                 <button onClick={saveChanges} className="w-full h-11 rounded-xl bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.1em] flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98] shadow-none">
                    <Save className="size-4" /> СОХРАНИТЬ
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
