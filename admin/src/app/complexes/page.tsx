"use client";

import { useState, useRef } from "react";
import { 
  Building2, 
  MapPin, 
  Home, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  AlertTriangle,
  X,
  CreditCard,
  Camera,
  Navigation,
  Layers,
  ChevronRight,
  TrendingUp,
  Activity,
  DoorOpen,
  ArrowUpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { api } from "@/services/api";

const INITIAL_COMPLEXES = [
  { id: 1, name: "ЖК Лазурный", address: "Ул. Приморская, 45", units: 12, occupied: 10, revenue: "124,000,000", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80" },
  { id: 2, name: "ЖК Океан", address: "Пр-кт Мира, 102", units: 8, occupied: 8, revenue: "85,500,000", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80" },
  { id: 3, name: "ЖК Парк Авеню", address: "Парковая зона, 12", units: 15, occupied: 12, revenue: "160,200,000", image: "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=600&q=80" },
  { id: 4, name: "ЖК Триумф", address: "Деловой центр, 1", units: 5, occupied: 2, revenue: "42,000,000", image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=600&q=80" },
  { id: 5, name: "ЖК Центральный", address: "Пр-кт Ленина, 88", units: 20, occupied: 18, revenue: "210,000,000", image: "https://images.unsplash.com/photo-1430285561322-7808604715df?w=600&q=80" },
];

export default function ComplexesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [complexes, setComplexes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadComplexes = async () => {
      try {
        const data = await api.getComplexes();
        setComplexes(data);
      } catch (error) {
        console.error("Failed to load complexes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadComplexes();
  }, []);

  // Add Drawer State
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [newComplex, setNewComplex] = useState({
    name: "",
    address: "",
    lat: "",
    lng: "",
    sort_order: "0",
    images: [] as string[]
  });

  const filtered = complexes.filter(c => {
    return c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.address.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleDelete = async () => {
    if (itemToDelete) {
      try {
        await api.deleteComplex(itemToDelete.id);
        setComplexes(complexes.filter(c => c.id !== itemToDelete.id));
        setItemToDelete(null);
      } catch (error) {
        console.error("Failed to delete complex:", error);
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const res = await api.uploadImage(file);
        setNewComplex({ ...newComplex, images: [...newComplex.images, res.url] });
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  const handleAddComplex = async () => {
    if (!newComplex.name || !newComplex.address) return;
    
    try {
      const payload = {
        name: newComplex.name,
        address: newComplex.address,
        lat: newComplex.lat,
        lng: newComplex.lng,
        sort_order: parseInt(newComplex.sort_order || "0"),
        image: newComplex.images.length > 0 ? newComplex.images[0] : "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80"
      };

      const created = await api.createComplex(payload);
      setComplexes([created, ...complexes]);
      setIsAddDrawerOpen(false);
      setNewComplex({ name: "", address: "", lat: "", lng: "", sort_order: "0", images: [] });
    } catch (error) {
      console.error("Failed to create complex:", error);
    }
  };

  return (
    <div className="w-full flex flex-col relative overflow-hidden font-sans pb-20">
      
      {/* Toolbar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0 shadow-none">
              <Building2 className="size-4" />
            </div>
            <span className="text-[14px] font-bold tracking-tight whitespace-nowrap uppercase">Жилые Комплексы</span>
            <div className="h-5 px-2 flex items-center justify-center text-[10px] font-bold bg-white border border-slate-100 rounded-full text-slate-500 ml-1 shadow-none">
              {filtered.length}
            </div>
          </div>
          
          <div className="hidden sm:block w-px h-5 bg-slate-200 mx-1" />
          
          <div className="relative group w-full max-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              placeholder="ПОИСК ЖК..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 h-9 w-full text-[11px] font-bold uppercase bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-400 shadow-none"
            />
          </div>
        </div>
        
        <button 
          onClick={() => setIsAddDrawerOpen(true)}
          className="bg-slate-900 text-white h-9 px-6 rounded-xl flex items-center justify-center gap-2 text-[11px] font-black hover:bg-slate-800 transition-all active:scale-95 shadow-none w-full xl:w-auto"
        >
          <Plus className="size-4" />
          <span>ДОБАВИТЬ КОМПЛЕКС</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((complex) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              key={complex.id}
              className="admin-card !p-0 overflow-hidden group border border-slate-100 bg-white hover:border-primary/20 transition-all cursor-pointer shadow-none flex flex-col md:flex-row md:h-[144px]"
              onClick={() => window.location.href = `/complexes/${complex.id}`}
            >
              {/* Image Block */}
              <div className="relative h-48 md:h-full md:w-[280px] shrink-0 overflow-hidden border-b md:border-b-0 md:border-r border-slate-100">
                 <img 
                   src={complex.image} 
                   alt={complex.name}
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent md:hidden" />
                 
                 <div className="absolute bottom-3 left-3 md:hidden">
                    <h3 className="text-[16px] font-black text-white tracking-tight leading-none mb-1">{complex.name}</h3>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-white/80 uppercase tracking-widest">
                      <MapPin className="size-3" /> {complex.address}
                    </div>
                 </div>
              </div>
              
              {/* Content Block */}
              <div className="flex-1 px-6 py-4 flex flex-col justify-between overflow-hidden">
                
                <div className="flex items-start justify-between">
                  <div className="hidden md:block">
                    <h3 className="text-[18px] font-black tracking-tight mb-1 group-hover:text-primary transition-colors">{complex.name}</h3>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      <MapPin className="size-3.5" /> {complex.address}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                     <button className="size-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors border border-slate-100 shadow-none">
                        <Edit2 className="size-3.5" />
                     </button>
                     <button 
                       onClick={(e) => { e.stopPropagation(); setItemToDelete(complex); }}
                       className="size-8 rounded-xl bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors border border-red-100 shadow-none"
                     >
                        <Trash2 className="size-3.5" />
                     </button>
                  </div>
                </div>

                {/* 4-Column Stats Grid (Row layout) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x divide-slate-100 mt-auto pt-3 border-t border-slate-50">
                  
                  <div className="flex flex-col gap-1 md:px-4 md:first:pl-0">
                     <div className="flex items-center gap-1.5">
                        <Layers className="size-3 text-slate-400" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">КВАРТИР</span>
                     </div>
                     <span className="text-[18px] font-black tabular-nums tracking-tight">{complex.units}</span>
                  </div>

                  <div className="flex flex-col gap-1 md:px-4">
                     <div className="flex items-center gap-1.5">
                        <DoorOpen className="size-3 text-emerald-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ЗАСЕЛЕНО</span>
                     </div>
                     <div className="flex items-baseline gap-1">
                        <span className="text-[18px] font-black tabular-nums tracking-tight">{complex.occupied}</span>
                        <span className="text-[10px] font-black text-slate-400">/ {complex.units}</span>
                     </div>
                  </div>

                  <div className="flex flex-col gap-1 md:px-4">
                     <div className="flex items-center gap-1.5">
                        <Activity className="size-3 text-blue-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ЗАГРУЗКА</span>
                     </div>
                     <span className="text-[18px] font-black tabular-nums tracking-tight">
                        {complex.units > 0 ? Math.round((complex.occupied / complex.units) * 100) : 0}%
                     </span>
                  </div>

                  <div className="flex flex-col gap-1 md:px-4">
                     <div className="flex items-center gap-1.5">
                        <TrendingUp className="size-3 text-primary" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ВЫРУЧКА (СУМ)</span>
                     </div>
                     <span className="text-[18px] font-black tabular-nums tracking-tight">{complex.revenue}</span>
                  </div>

                </div>

              </div>
              
              {/* Quick Arrow (Mobile and Desktop) */}
              <div className="hidden md:flex items-center justify-center px-6 border-l border-slate-100 bg-slate-50/50 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                 <ChevronRight className="size-5" />
              </div>

            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── ADD COMPLEX DRAWER ── */}
      <AnimatePresence>
        {isAddDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddDrawerOpen(false)} className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-[200]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white z-[201] flex flex-col border-l border-slate-100 shadow-none" >
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
                 <h3 className="text-[14px] font-black uppercase tracking-tight">Новый ЖК</h3>
                 <button onClick={() => setIsAddDrawerOpen(false)} className="size-8 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors shadow-none"><X className="size-4" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-white relative">
                 
                 {/* Photos */}
                 <div className="space-y-2.5 px-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Camera className="size-3" /> ФОТО КОМПЛЕКСА</p>
                    <div className="grid grid-cols-3 gap-2">
                       {newComplex.images.map((img, i) => (
                          <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 group shadow-none">
                             <img src={img} className="size-full object-cover" />
                             <button onClick={() => setNewComplex({...newComplex, images: newComplex.images.filter((_, idx) => idx !== i)})} className="absolute top-1 right-1 size-5 rounded-md bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-none">
                                <Trash2 className="size-2.5" />
                             </button>
                          </div>
                       ))}
                       <button onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center gap-1 hover:border-primary/20 transition-all text-slate-400 bg-slate-50/50 shadow-none">
                          <Plus className="size-4" />
                          <span className="text-[8px] font-black uppercase tracking-widest">Загрузить</span>
                       </button>
                       <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                    </div>
                 </div>

                 {/* Basic Info */}
                 <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1.5 px-1">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Building2 className="size-3" /> Название ЖК</label>
                       <input 
                         placeholder="Например: ЖК Лазурный..."
                         value={newComplex.name} 
                         onChange={(e) => setNewComplex({...newComplex, name: e.target.value})} 
                         className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none focus:ring-1 focus:ring-primary/20 transition-all shadow-none" 
                       />
                    </div>

                    <div className="space-y-1.5 px-1">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><MapPin className="size-3" /> Адрес</label>
                       <input 
                         placeholder="Район, улица..."
                         value={newComplex.address} 
                         onChange={(e) => setNewComplex({...newComplex, address: e.target.value})} 
                         className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none focus:ring-1 focus:ring-primary/20 transition-all shadow-none" 
                       />
                    </div>
                    
                    {/* Location Lat Lng & Order */}
                    <div className="grid grid-cols-3 gap-3 px-1 mt-1">
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Navigation className="size-3" /> LAT</label>
                          <input type="text" placeholder="41.3110" value={newComplex.lat} onChange={(e) => setNewComplex({...newComplex, lat: e.target.value})} className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none tabular-nums focus:ring-1 focus:ring-primary/20 shadow-none" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Navigation className="size-3" /> LNG</label>
                          <input type="text" placeholder="69.2405" value={newComplex.lng} onChange={(e) => setNewComplex({...newComplex, lng: e.target.value})} className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none tabular-nums focus:ring-1 focus:ring-primary/20 shadow-none" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><ArrowUpCircle className="size-3" /> ПОРЯДОК</label>
                          <input type="number" placeholder="0" value={newComplex.sort_order} onChange={(e) => setNewComplex({...newComplex, sort_order: e.target.value})} className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none tabular-nums focus:ring-1 focus:ring-primary/20 shadow-none" />
                       </div>
                    </div>
                 </div>

              </div>

              <div className="p-5 border-t border-slate-100 bg-white sticky bottom-0 z-20">
                 <button 
                   onClick={handleAddComplex} 
                   className={cn(
                     "w-full h-11 rounded-xl font-black text-[11px] uppercase tracking-[0.1em] flex items-center justify-center gap-2 transition-all shadow-none",
                     newComplex.name && newComplex.address 
                       ? "bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98]" 
                       : "bg-slate-100 text-slate-400 cursor-not-allowed"
                   )}
                 >
                    <Plus className="size-4" /> СОХРАНИТЬ ЖИЛОЙ КОМПЛЕКС
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal (Compact & Shadow-free) */}
      <AnimatePresence>
        {itemToDelete && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setItemToDelete(null)} className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-[200]" />
            <div className="fixed inset-0 flex items-center justify-center z-[201] p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 10 }} className="w-full max-w-[320px] bg-white rounded-2xl p-6 pointer-events-auto border border-slate-100 shadow-none" >
                <div className="flex flex-col items-center text-center">
                  <div className="size-14 rounded-xl bg-red-50 flex items-center justify-center mb-5 border border-red-100 shadow-none">
                    <AlertTriangle className="size-6 text-red-500" />
                  </div>
                  <h3 className="text-[16px] font-black uppercase tracking-tight mb-2">Удалить ЖК?</h3>
                  <p className="text-[11px] text-slate-500 font-bold mb-8 leading-relaxed">Комплекс <span className="text-slate-900">{itemToDelete.name}</span> будет удален.</p>
                  <div className="grid grid-cols-2 gap-3 w-full">
                    <button onClick={() => setItemToDelete(null)} className="h-10 rounded-xl bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest shadow-none">Отмена</button>
                    <button onClick={handleDelete} className="h-10 rounded-xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest shadow-none">Удалить</button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
