"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, MapPin, Users, Ruler, Plus, Search, 
  Edit2, Trash2, Building2, ChevronRight, Activity, 
  TrendingUp, Layers, DoorOpen, X, Camera, Navigation,
  Home
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatNumber } from "@/lib/utils";
import { api } from "@/services/api";

const STATUS_MAP = {
  free: { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", text: "СВОБОДНО" },
  busy: { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", text: "ЗАНЯТО" },
  repair: { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", text: "РЕМОНТ" },
} as const;

export default function ComplexDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  const [complex, setComplex] = useState<any>(null);
  const [apartments, setApartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const loadData = async () => {
    try {
      // Get all complexes and find current one
      const complexes = await api.getComplexes();
      const current = complexes.find((c: any) => c.id === parseInt(params.id as string));
      
      if (current) {
        setComplex(current);
        setEditForm(JSON.parse(JSON.stringify(current)));
        
        // Get all apartments and filter by complex_id
        const allApts = await api.getApartments();
        const filtered = allApts.filter((a: any) => a.complex_id === current.id);
        setApartments(filtered);
      }
    } catch (error) {
      console.error("Failed to load complex details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) loadData();
  }, [params.id]);

  useEffect(() => {
    if (isEditDrawerOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isEditDrawerOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const res = await api.uploadImage(file);
        setEditForm({ ...editForm, image: res.url });
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  const handleSaveComplex = async () => {
    try {
      const payload = {
        name: editForm.name,
        address: editForm.address,
        lat: editForm.lat,
        lng: editForm.lng,
        image: editForm.image
      };
      await api.updateComplex(complex.id, payload);
      setIsEditDrawerOpen(false);
      loadData();
      setNotification({ type: 'success', message: 'ЖК успешно обновлен!' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Failed to update complex:", error);
      setNotification({ type: 'error', message: 'Ошибка при сохранении.' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!complex) return null;

  return (
    <div className="w-full flex flex-col relative font-sans pb-10">
      
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => router.back()} className="group flex items-center gap-2 px-3 h-8 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-none">
          <ArrowLeft className="size-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900">К СПИСКУ ЖК</span>
        </button>
        
        <div className="flex items-center gap-2">
           <button 
             onClick={() => setIsEditDrawerOpen(true)}
             className="h-8 px-3 bg-white border border-slate-100 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 shadow-none flex items-center gap-2"
           >
              <Edit2 className="size-3.5" /> РЕДАКТИРОВАТЬ ЖК
           </button>
           <button className="h-8 px-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-none flex items-center gap-2">
              <Plus className="size-3.5" /> ДОБАВИТЬ КВАРТИРУ
           </button>
        </div>
      </div>

      <div className="admin-card !p-0 overflow-hidden border-slate-100 bg-white mb-6 group shadow-none relative">
        <div className="relative h-[220px] w-full bg-slate-100">
           <img 
             src={complex.image || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80"} 
             className="w-full h-full object-cover" 
             onError={(e) => {
               (e.target as any).src = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80";
             }}
           />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
           
           <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
              <div>
                 <div className="flex items-center gap-2 mb-1.5">
                    <h1 className="text-[28px] font-black text-white tracking-tight leading-none">{complex.name}</h1>
                 </div>
                 <div className="flex items-center gap-1.5 text-slate-300 text-[11px] font-bold uppercase tracking-widest">
                    <MapPin className="size-3.5 text-white" /> {complex.address}
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-slate-50 bg-white">
           <div className="p-4 border-r border-slate-50 flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                 <Layers className="size-3 text-slate-400" />
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">КВАРТИР В ЖК</span>
              </div>
              <span className="text-[16px] font-black tabular-nums tracking-tight">{apartments.length}</span>
           </div>

           <div className="p-4 border-r border-slate-50 flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                 <DoorOpen className="size-3 text-emerald-500" />
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">СВОБОДНО</span>
              </div>
              <div className="flex items-baseline gap-1">
                 <span className="text-[16px] font-black tabular-nums tracking-tight">
                    {apartments.filter(a => a.status === "free").length}
                 </span>
                 <span className="text-[10px] font-black text-slate-400">/ {apartments.length}</span>
              </div>
           </div>

           <div className="p-4 border-r border-slate-50 flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                 <Activity className="size-3 text-blue-500" />
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ЗАГРУЗКА</span>
              </div>
              <span className="text-[16px] font-black tabular-nums tracking-tight">
                 {apartments.length > 0 ? Math.round((apartments.filter(a => a.status === "busy").length / apartments.length) * 100) : 0}%
              </span>
           </div>

           <div className="p-4 flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                 <TrendingUp className="size-3 text-primary" />
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ВЫРУЧКА (ДЕМО)</span>
              </div>
              <span className="text-[16px] font-black tabular-nums tracking-tight">120 000 000</span>
           </div>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2">
         <div className="p-1.5 rounded-xl bg-slate-900 text-white shadow-none">
           <Building2 className="size-4" />
         </div>
         <h2 className="text-[14px] font-black tracking-tight uppercase">Объекты в этом комплексе</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {apartments.map((apt) => {
            const status = STATUS_MAP[apt.status as keyof typeof STATUS_MAP] || STATUS_MAP.free;
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={apt.id}
                className="admin-card !p-0 overflow-hidden group border border-slate-100 bg-white hover:border-primary/20 transition-all cursor-pointer shadow-none"
                onClick={() => router.push(`/apartments/${apt.id}`)}
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <img src={apt.image} alt={apt.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-3 left-3">
                    <div className={cn("px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-none backdrop-blur-md", status.bg, status.color, status.border)}>
                      {status.text}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-[13px] font-black tracking-tight mb-1 group-hover:text-primary transition-colors truncate">{apt.title}</h3>
                  <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                    <MapPin className="size-3" /> {apt.address}
                  </div>
                  <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                       <span className="text-[16px] font-black text-slate-900">{formatNumber(apt.price)}</span>
                       <span className="text-[9px] font-black text-slate-400">СУМ</span>
                    </div>
                    <div className="h-8 px-3 rounded-xl bg-slate-50 text-slate-900 text-[9px] font-black uppercase flex items-center group-hover:bg-slate-900 group-hover:text-white transition-all">ДЕТАЛИ</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── EDIT DRAWER ── */}
      <AnimatePresence>
        {isEditDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditDrawerOpen(false)} className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-[200]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white z-[201] flex flex-col border-l border-slate-100 shadow-none" >
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
                 <h3 className="text-[14px] font-black uppercase tracking-tight">Редактировать ЖК</h3>
                 <button onClick={() => setIsEditDrawerOpen(false)} className="size-8 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors shadow-none"><X className="size-4" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-white relative">
                 {/* Photo Section */}
                 <div className="space-y-2.5 px-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Camera className="size-3" /> ФОТО КОМПЛЕКСА</p>
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-100 group shadow-none bg-slate-50">
                       <img src={editForm.image || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80"} className="size-full object-cover" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                          <Camera className="size-6 text-white" />
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">Сменить фото</span>
                       </div>
                       <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 w-full h-full" />
                       <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                    </div>
                 </div>

                 <div className="space-y-1.5 px-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Название ЖК</label>
                    <input value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none" />
                 </div>
                 <div className="space-y-1.5 px-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Адрес</label>
                    <input value={editForm.address} onChange={(e) => setEditForm({...editForm, address: e.target.value})} className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none" />
                 </div>
              </div>
              <div className="p-5 border-t border-slate-100 bg-white sticky bottom-0 z-20">
                 <button onClick={handleSaveComplex} className="w-full h-11 rounded-xl bg-slate-900 text-white font-black text-[11px] uppercase flex items-center justify-center transition-all">СОХРАНИТЬ</button>
              </div>
            </motion.div>
          </>
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
