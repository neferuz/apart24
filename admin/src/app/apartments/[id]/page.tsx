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
  AlignLeft, BedDouble, Waves, Dumbbell, Ban, Baby, Laptop, PawPrint,
  Bell, Lock, Sun, Microwave, Droplets, ArrowUpCircle, Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { api } from "@/services/api";

const ICON_OPTIONS = [
  { name: "Wifi", icon: Wifi }, { name: "Tv", icon: Tv }, { name: "Wind", icon: Wind },
  { name: "Coffee", icon: Coffee }, { name: "Bath", icon: Bath }, { name: "Car", icon: Car },
  { name: "Utensils", icon: Utensils }, { name: "Key", icon: Key }, { name: "Snowflake", icon: Snowflake },
  { name: "Zap", icon: Zap }, { name: "Smartphone", icon: Smartphone }, { name: "Thermometer", icon: Thermometer },
  { name: "ShieldCheck", icon: ShieldCheck }, { name: "Sparkles", icon: Sparkles },
  { name: "Waves", icon: Waves }, { name: "Dumbbell", icon: Dumbbell }, { name: "Ban", icon: Ban },
  { name: "Baby", icon: Baby }, { name: "Laptop", icon: Laptop }, { name: "PawPrint", icon: PawPrint },
  { name: "Bell", icon: Bell }, { name: "Lock", icon: Lock }, { name: "Sun", icon: Sun },
  { name: "Microwave", icon: Microwave }, { name: "Droplets", icon: Droplets }, 
  { name: "ArrowUpCircle", icon: ArrowUpCircle }, { name: "Shield", icon: Shield }
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
  const [complexes, setComplexes] = useState<any[]>([]);
  const [selectingIconForId, setSelectingIconForId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadApt = async () => {
    try {
      const data = await api.getApartments(); 
      const item = data.find((a: any) => a.id === parseInt(params.id as string));
      if (item) {
        // Parse amenities from JSON string if possible
        let parsedAmenities = [];
        try {
          parsedAmenities = item.amenities ? JSON.parse(item.amenities) : [];
        } catch (e) {
          // Fallback for old comma-separated strings
          parsedAmenities = item.amenities ? item.amenities.split(",").map((name: string, i: number) => ({ id: i, name: name.trim(), icon: "Wifi" })) : [];
        }
        
        let parsedImages = [];
        try {
          parsedImages = item.images ? JSON.parse(item.images) : [item.image];
        } catch (e) {
          parsedImages = [item.image];
        }
        
        const prepared = { ...item, amenitiesList: parsedAmenities, imagesList: parsedImages };
        setApt(prepared);
        setEditData(JSON.parse(JSON.stringify(prepared)));

        const comps = await api.getComplexes();
        setComplexes(comps);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const res = await api.uploadImage(file);
        setEditData((prev: any) => ({
          ...prev,
          imagesList: [...(prev.imagesList || []), res.url]
        }));
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  const removeImage = (url: string) => {
    setEditData((prev: any) => ({
      ...prev,
      imagesList: prev.imagesList.filter((u: string) => u !== url)
    }));
  };

  const saveChanges = async () => {
    try {
      const payload = {
        title: editData.title,
        description: editData.description,
        address: editData.address,
        price: parseFloat(editData.price),
        guests: parseInt(editData.guests),
        bedrooms: parseInt(editData.bedrooms),
        bathrooms: parseInt(editData.bathrooms),
        size: editData.size,
        lat: editData.lat,
        lng: editData.lng,
        status: editData.status,
        image: editData.imagesList[0] || editData.image,
        images: JSON.stringify(editData.imagesList),
        complex_id: editData.complex_id,
        amenities: JSON.stringify(editData.amenitiesList)
      };

      await api.updateApartment(apt.id, payload);
      setIsEditOpen(false);
      loadApt();
      setNotification({ type: 'success', message: 'Изменения успешно сохранены!' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Failed to update apartment:", error);
      setNotification({ type: 'error', message: 'Ошибка при сохранении данных.' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const addAmenity = () => {
    const newId = editData.amenitiesList.length > 0 ? Math.max(...editData.amenitiesList.map((a: any) => a.id)) + 1 : 1;
    setEditData({
      ...editData,
      amenitiesList: [...editData.amenitiesList, { id: newId, name: "Новое", icon: "Wifi" }]
    });
  };

  const removeAmenity = (id: number) => {
    setEditData({
      ...editData,
      amenitiesList: editData.amenitiesList.filter((a: any) => a.id !== id)
    });
  };

  const updateAmenityIcon = (id: number, iconName: string) => {
    setEditData({
      ...editData,
      amenitiesList: editData.amenitiesList.map((a: any) => a.id === id ? { ...a, icon: iconName } : a)
    });
    setSelectingIconForId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!apt) return null;

  return (
    <div className="w-full flex flex-col relative font-sans pb-10">
      
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => router.back()} className="group flex items-center gap-2 px-3 h-8 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-none">
          <ArrowLeft className="size-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900">К списку</span>
        </button>
        
        <div className="flex items-center gap-2">
           <button onClick={() => { setIsEditOpen(true); setEditData(JSON.parse(JSON.stringify(apt))); }} className="h-8 px-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-none">
              НАСТРОЙКИ
           </button>
        </div>
      </div>

      <div className="admin-card !p-0 overflow-hidden border-slate-100 bg-white mb-6 group shadow-none">
        <div className="relative h-[300px] w-full cursor-pointer bg-slate-900 overflow-hidden" onClick={() => setIsFullscreenOpen(true)}>
           <AnimatePresence mode="wait">
              <motion.img 
                 key={currentImg}
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 exit={{ opacity: 0 }}
                 src={apt.imagesList?.[currentImg] || apt.image} 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
           </AnimatePresence>
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
           
           {/* Gallery Controls */}
           {apt.imagesList?.length > 1 && (
              <div className="absolute bottom-6 right-6 flex items-center gap-2 z-10">
                 <button 
                    onClick={(e) => { e.stopPropagation(); setCurrentImg((prev) => (prev > 0 ? prev - 1 : apt.imagesList.length - 1)); }}
                    className="size-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90"
                 >
                    <ChevronLeft className="size-5" />
                 </button>
                 <button 
                    onClick={(e) => { e.stopPropagation(); setCurrentImg((prev) => (prev < apt.imagesList.length - 1 ? prev + 1 : 0)); }}
                    className="size-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90"
                 >
                    <ChevronRight className="size-5" />
                 </button>
              </div>
           )}
           <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest border border-white/20 shadow-none">
                 {apt.status === "free" ? "СВОБОДНО" : apt.status === "busy" ? "ЗАНЯТО" : "РЕМОНТ"}
              </span>
           </div>
           <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
              <div>
                 <div className="flex items-center gap-2 mb-1">
                    {(() => {
                       const comp = complexes.find(c => c.id === apt.complex_id);
                       return comp ? (
                          <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest border border-white/10">
                             {comp.name}
                          </span>
                       ) : null;
                    })()}
                 </div>
                 <div className="flex items-center gap-2 mb-1.5">
                    <h1 className="text-[24px] font-black text-white tracking-tight leading-none">{apt.title}</h1>
                 </div>
                 <div className="flex items-center gap-1.5 text-slate-300 text-[11px] font-bold uppercase tracking-widest">
                    <MapPin className="size-3.5 text-white" /> {apt.address}
                 </div>
              </div>
           </div>
        </div>

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
                  {apt.description || "Описание не заполнено."}
               </p>
            </div>

            <div className="admin-card !p-5 border-slate-100 bg-white shadow-none">
               <h2 className="text-[11px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-400">
                  <Sparkles className="size-3.5 text-primary" /> СПИСОК УДОБСТВ
               </h2>
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {apt.amenitiesList?.length > 0 ? apt.amenitiesList.map((item: any) => {
                    const Icon = ICON_MAP[item.icon] || Wifi;
                    return (
                      <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors group shadow-none">
                          <div className="size-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-slate-900 transition-all shadow-none">
                            <Icon className="size-4" />
                          </div>
                          <span className="text-[11px] font-black uppercase tracking-tight text-slate-700">{item.name}</span>
                      </div>
                    );
                  }) : <p className="text-[11px] text-slate-400 uppercase font-black">Удобства не указаны</p>}
               </div>
            </div>
         </div>

         <div className="space-y-6">
            {/* Complex Info Card */}
            {(() => {
               const comp = complexes.find(c => c.id === apt.complex_id);
               if (!comp) return null;
               return (
                  <div className="admin-card !p-5 border-slate-100 bg-white shadow-none">
                     <h2 className="text-[10px] font-black uppercase tracking-widest mb-4 text-slate-400">Жилой комплекс</h2>
                     <div className="flex items-start gap-4">
                        <div className="size-14 rounded-2xl overflow-hidden border border-slate-100 shrink-0 bg-slate-50">
                           <img src={comp.image || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&q=80"} className="size-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                           <h3 className="text-[14px] font-black uppercase tracking-tight truncate mb-1">{comp.name}</h3>
                           <div className="flex items-center gap-1.5 text-slate-400">
                              <MapPin className="size-3" />
                              <span className="text-[10px] font-bold truncate uppercase">{comp.address}</span>
                           </div>
                        </div>
                     </div>
                     <button 
                        onClick={() => router.push(`/complexes/${comp.id}`)}
                        className="w-full mt-4 h-9 rounded-xl border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-none flex items-center justify-center gap-2"
                     >
                        ПЕРЕЙТИ В ЖК <ArrowUpRight className="size-3" />
                     </button>
                  </div>
               );
            })()}

            <div className="admin-card !p-5 border-slate-100 bg-white shadow-none">
               <h2 className="text-[10px] font-black uppercase tracking-widest mb-4 text-slate-400">Характеристики</h2>
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="size-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shadow-none"><BedDouble className="size-4" /></div>
                        <span className="text-[12px] font-bold text-slate-600">Спальни</span>
                     </div>
                     <span className="text-[14px] font-black">{apt.bedrooms || 1}</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="size-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-none"><Bath className="size-4" /></div>
                        <span className="text-[12px] font-bold text-slate-600">Ванные</span>
                     </div>
                     <span className="text-[14px] font-black">{apt.bathrooms || 1}</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <AnimatePresence>
        {isEditOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditOpen(false)} className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-[200]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white z-[201] flex flex-col border-l border-slate-100 shadow-none" >
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
                 <h3 className="text-[14px] font-black uppercase tracking-tight">Редактировать</h3>
                 <button onClick={() => setIsEditOpen(false)} className="size-8 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors shadow-none"><X className="size-4" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-8 bg-white relative">
                 {/* Photos Management */}
                 <div className="space-y-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Фотогалерея</p>
                    <div className="grid grid-cols-2 gap-3">
                       {editData.imagesList?.map((url: string, idx: number) => (
                          <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden border border-slate-100 group">
                             <img src={url} className="size-full object-cover" />
                             <button 
                                onClick={() => removeImage(url)}
                                className="absolute top-2 right-2 size-7 rounded-xl bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                             >
                                <Trash2 className="size-3.5" />
                             </button>
                          </div>
                       ))}
                       <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-video rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-primary/30 hover:text-primary transition-all group"
                       >
                          <Camera className="size-6 group-hover:scale-110 transition-transform" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Добавить фото</span>
                       </button>
                       <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                    </div>
                 </div>

                  <div className="space-y-4">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Жилой комплекс</p>
                     <div className="relative px-1 group">
                        <select 
                          value={editData.complex_id} 
                          onChange={(e) => setEditData({...editData, complex_id: parseInt(e.target.value)})}
                          className="w-full h-11 pl-4 pr-10 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-black uppercase tracking-tight outline-none appearance-none focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
                        >
                           {complexes.map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                           ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-slate-900 transition-colors">
                           <ChevronRight className="size-4 rotate-90" />
                        </div>
                     </div>
                  </div>

                 <div className="space-y-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Основные данные</p>
                    <div className="space-y-1.5 px-1">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Название</label>
                       <input value={editData.title} onChange={(e) => setEditData({...editData, title: e.target.value})} className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none" />
                    </div>
                    <div className="space-y-1.5 px-1">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Описание</label>
                       <textarea rows={4} value={editData.description} onChange={(e) => setEditData({...editData, description: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-medium outline-none resize-none" />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Удобства с иконками</p>
                    <div className="space-y-3">
                       {editData.amenitiesList.map((item: any, i: number) => (
                          <div key={item.id} className="flex flex-col gap-2 p-3 bg-slate-50/50 border border-slate-100 rounded-2xl">
                             <div className="flex items-center gap-3">
                                <button onClick={() => setSelectingIconForId(selectingIconForId === item.id ? null : item.id)} className="size-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 hover:bg-slate-100 transition-colors">
                                   {(() => { const Icon = ICON_MAP[item.icon] || Wifi; return <Icon className="size-4.5 text-slate-900" />; })()}
                                </button>
                                <input value={item.name} onChange={(e) => { const newList = [...editData.amenitiesList]; newList[i].name = e.target.value; setEditData({...editData, amenitiesList: newList}); }} className="flex-1 h-10 px-3 bg-white border border-slate-200 rounded-xl text-[12px] font-bold outline-none" />
                                <button onClick={() => removeAmenity(item.id)} className="size-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                                   <Trash2 className="size-4" />
                                </button>
                             </div>
                             
                             <AnimatePresence>
                               {selectingIconForId === item.id && (
                                 <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                    <div className="grid grid-cols-5 gap-2 pt-2">
                                       {ICON_OPTIONS.map((opt) => (
                                          <button key={opt.name} onClick={() => updateAmenityIcon(item.id, opt.name)} className={cn("size-9 rounded-xl flex items-center justify-center transition-all", item.icon === opt.name ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-400 hover:bg-slate-100")}>
                                             <opt.icon className="size-4" />
                                          </button>
                                       ))}
                                    </div>
                                 </motion.div>
                               )}
                             </AnimatePresence>
                          </div>
                       ))}
                       <button onClick={addAmenity} className="w-full h-11 rounded-2xl border-2 border-dashed border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-primary/30 hover:text-primary transition-all flex items-center justify-center gap-2 group">
                          <Plus className="size-4 group-hover:scale-110 transition-transform" /> Добавить удобство
                       </button>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 px-1 pb-4">
                    <div className="space-y-1.5">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Цена</label>
                       <input type="number" value={editData.price} onChange={(e) => setEditData({...editData, price: e.target.value})} className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Метраж</label>
                       <input value={editData.size} onChange={(e) => setEditData({...editData, size: e.target.value})} className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold" />
                    </div>
                 </div>
              </div>

              <div className="p-5 border-t border-slate-100 bg-white sticky bottom-0 z-20">
                 <button onClick={saveChanges} className="w-full h-11 rounded-xl bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.1em] flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98] shadow-none">
                    <Save className="size-4" /> СОХРАНИТЬ ВСЁ
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Fullscreen Gallery Overlay */}
      <AnimatePresence>
        {isFullscreenOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950 z-[500] flex flex-col"
          >
            <div className="p-6 flex items-center justify-between text-white border-b border-white/10">
               <div>
                  <h4 className="text-[14px] font-black uppercase tracking-tight">{apt.title}</h4>
                  <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Галерея ({currentImg + 1} / {apt.imagesList?.length || 1})</p>
               </div>
               <button onClick={() => setIsFullscreenOpen(false)} className="size-10 rounded-2xl bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center">
                  <X className="size-5" />
               </button>
            </div>

            <div className="flex-1 min-h-0 relative flex items-center justify-center p-2 sm:p-6">
               <button 
                  onClick={() => setCurrentImg((prev) => (prev > 0 ? prev - 1 : (apt.imagesList?.length || 1) - 1))}
                  className="absolute left-4 sm:left-10 size-14 rounded-full bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center text-white z-10 backdrop-blur-sm border border-white/10"
               >
                  <ChevronLeft className="size-8" />
               </button>

               <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  <AnimatePresence mode="wait">
                     <motion.img 
                        key={currentImg}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        src={apt.imagesList?.[currentImg] || apt.image} 
                        className="max-w-full max-h-full object-contain shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-2xl" 
                     />
                  </AnimatePresence>
               </div>

               <button 
                  onClick={() => setCurrentImg((prev) => (prev < (apt.imagesList?.length || 1) - 1 ? prev + 1 : 0))}
                  className="absolute right-4 sm:right-10 size-14 rounded-full bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center text-white z-10 backdrop-blur-sm border border-white/10"
               >
                  <ChevronRight className="size-8" />
               </button>
            </div>

            <div className="p-6 shrink-0 flex justify-center gap-2 overflow-x-auto no-scrollbar bg-slate-950/50 backdrop-blur-md border-t border-white/5">
               {apt.imagesList?.map((url: string, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => setCurrentImg(idx)}
                    className={cn(
                      "size-16 rounded-xl overflow-hidden border-2 transition-all shrink-0",
                      currentImg === idx ? "border-primary scale-110 shadow-lg" : "border-white/10 opacity-50 hover:opacity-100"
                    )}
                  >
                    <img src={url} className="size-full object-cover" />
                  </button>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 border"
            style={{ 
              backgroundColor: notification.type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
              borderColor: 'rgba(255, 255, 255, 0.2)'
            }}
          >
            {notification.type === 'success' ? <CheckCircle2 className="size-5 text-white" /> : <X className="size-5 text-white" />}
            <span className="text-white text-[13px] font-black uppercase tracking-tight">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
