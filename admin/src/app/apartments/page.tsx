"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Home, 
  MapPin, 
  Users, 
  Ruler, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  AlertTriangle,
  Building,
  X,
  CreditCard,
  Camera,
  Navigation,
  Sparkles,
  BedDouble,
  Bath,
  ChevronRight, CheckCircle2,
  Wifi, Tv, Wind, Coffee, Car, Utensils, Key, Snowflake, Zap, Smartphone, Thermometer, ShieldCheck,
  Waves, Dumbbell, Ban, Baby, Laptop, PawPrint, Bell, Lock, Sun, Microwave, Droplets, ArrowUpCircle, Shield
} from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
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

const STATUS_MAP = {
  free: { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
  busy: { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
  repair: { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
} as const;

export default function ApartmentsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [apartments, setApartments] = useState<any[]>([]);
  const [complexes, setComplexes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [selectingIconForId, setSelectingIconForId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newApartment, setNewApartment] = useState({
    title: "",
    complex_id: "",
    address: "",
    price: "",
    guests: "2",
    size: "",
    bedrooms: "",
    bathrooms: "",
    lat: "",
    lng: "",
    images: [] as string[],
    amenities: [] as { id: number; name: string; icon: string }[]
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [aptData, compData] = await Promise.all([
          api.getApartments(),
          api.getComplexes()
        ]);
        setApartments(aptData);
        setComplexes(compData);
        if (compData.length > 0) {
            setNewApartment(prev => ({...prev, complex_id: compData[0].id.toString()}));
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filtered = apartments.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || a.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleDelete = async () => {
    if (itemToDelete) {
      try {
        await api.deleteApartment(itemToDelete.id);
        setApartments(apartments.filter(a => a.id !== itemToDelete.id));
        setItemToDelete(null);
        setNotification({ type: 'success', message: 'Объект успешно удален!' });
        setTimeout(() => setNotification(null), 3000);
      } catch (error) {
        console.error("Failed to delete apartment:", error);
        setNotification({ type: 'error', message: 'Ошибка при удалении объекта.' });
        setTimeout(() => setNotification(null), 3000);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewApartment({ ...newApartment, images: [...newApartment.images, url] });
    }
  };

  const addAmenity = () => {
    const newId = newApartment.amenities.length > 0 ? Math.max(...newApartment.amenities.map(a => a.id)) + 1 : 1;
    setNewApartment({
      ...newApartment,
      amenities: [...newApartment.amenities, { id: newId, name: "Новое удобство", icon: "Wifi" }]
    });
  };

  const removeAmenity = (id: number) => {
    setNewApartment({
      ...newApartment,
      amenities: newApartment.amenities.filter(a => a.id !== id)
    });
  };

  const updateAmenityIcon = (id: number, iconName: string) => {
    setNewApartment({
      ...newApartment,
      amenities: newApartment.amenities.map(a => a.id === id ? { ...a, icon: iconName } : a)
    });
    setSelectingIconForId(null);
  };

  const handleAddApartment = async () => {
    if (!newApartment.title || !newApartment.price || !newApartment.complex_id) return;

    try {
      const payload = {
        title: newApartment.title,
        address: newApartment.address,
        price: parseFloat(newApartment.price.replace(/\s/g, '')),
        guests: parseInt(newApartment.guests),
        size: `${newApartment.size} м²`,
        status: "free",
        image: newApartment.images.length > 0 ? newApartment.images[0] : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
        complex_id: parseInt(newApartment.complex_id)
      };

      const created = await api.createApartment(payload);
      setApartments([created, ...apartments]);
      setNewApartment({
        title: "",
        address: "",
        price: "",
        guests: "2",
        size: "",
        bedrooms: "",
        bathrooms: "",
        lat: "",
        lng: "",
        complex_id: complexes.length > 0 ? complexes[0].id.toString() : "",
        images: [],
        amenities: []
      });
      setNotification({ type: 'success', message: 'Квартира успешно добавлена в базу!' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Failed to create apartment:", error);
      setNotification({ type: 'error', message: 'Ошибка при добавлении в базу.' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="w-full flex flex-col relative overflow-hidden font-sans pb-20">
      
      {/* Tabs & Search */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex items-center p-1 bg-white border border-slate-100 rounded-xl w-fit shadow-none">
            {["all", "free", "busy", "repair"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 h-8 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === tab 
                    ? "bg-slate-900 text-white shadow-none" 
                    : "text-slate-400 hover:text-slate-900"
                )}
              >
                {tab === "all" ? "Все объекты" : tab === "free" ? "Свободны" : tab === "busy" ? "Заняты" : "Ремонт"}
              </button>
            ))}
          </div>

          <div className="relative group w-full sm:w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              placeholder="ПОИСК ОБЪЕКТА..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 h-10 w-full text-[11px] font-bold uppercase bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-400 shadow-none"
            />
          </div>
        </div>

        <button 
          onClick={() => setIsAddDrawerOpen(true)}
          className="bg-slate-900 text-white h-10 px-6 rounded-xl flex items-center justify-center gap-2 text-[11px] font-black hover:bg-slate-800 transition-all active:scale-95 shadow-none"
        >
          <Plus className="size-4" />
          <span>ДОБАВИТЬ ОБЪЕКТ</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="size-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((apt) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={apt.id}
                className="admin-card !p-0 group border border-slate-100 bg-white hover:border-primary/20 transition-all cursor-pointer shadow-none overflow-hidden"
                onClick={() => window.location.href = `/apartments/${apt.id}`}
              >
                <div className="relative h-48 overflow-hidden border-b border-slate-50 bg-slate-50">
                   <img 
                     src={apt.image || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80"} 
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                     onError={(e) => {
                       (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80";
                     }}
                   />
                   <div className="absolute top-3 left-3 flex items-center gap-2">
                      <div className={cn("px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-none", STATUS_MAP[apt.status as keyof typeof STATUS_MAP]?.bg, STATUS_MAP[apt.status as keyof typeof STATUS_MAP]?.color, STATUS_MAP[apt.status as keyof typeof STATUS_MAP]?.border)}>
                         {apt.status === "free" ? "СВОБОДНО" : apt.status === "busy" ? "ЗАНЯТО" : "РЕМОНТ"}
                      </div>
                   </div>
                   <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setItemToDelete(apt); }}
                        className="size-8 rounded-lg bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-none"
                      >
                         <Trash2 className="size-3.5" />
                      </button>
                   </div>
                </div>

                <div className="p-4">
                  <h3 className="text-[14px] font-black tracking-tight mb-1 group-hover:text-primary transition-colors line-clamp-1">{apt.title}</h3>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                     <MapPin className="size-3" /> {apt.address}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-100 shadow-none">
                      <Users className="size-3 text-slate-400" />
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{apt.guests} ГОСТЯ</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-100 shadow-none">
                      <Ruler className="size-3 text-slate-400" />
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{apt.size}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">СУТКИ</span>
                      <div className="flex items-baseline gap-1">
                         <span className="text-[16px] font-black text-slate-900 tabular-nums">{formatNumber(apt.price)}</span>
                         <span className="text-[9px] font-black text-slate-400 uppercase">СУМ</span>
                      </div>
                    </div>
                    <div className="h-8 px-3 rounded-xl bg-slate-50 text-slate-900 text-[9px] font-black uppercase tracking-widest flex items-center gap-1 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-none">
                      ДЕТАЛИ
                      <ChevronRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ── ADD APARTMENT DRAWER ── */}
      <AnimatePresence>
        {isAddDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddDrawerOpen(false)} className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-[200]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed right-0 top-0 h-full w-full sm:w-[460px] bg-white z-[201] flex flex-col border-l border-slate-100 shadow-none" >
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
                 <h3 className="text-[14px] font-black uppercase tracking-tight">Добавить квартиру</h3>
                 <button onClick={() => setIsAddDrawerOpen(false)} className="size-8 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors shadow-none"><X className="size-4" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-white relative">
                 
                 {/* Photos */}
                 <div className="space-y-2.5 px-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Camera className="size-3" /> ФОТОГРАФИИ</p>
                    <div className="grid grid-cols-4 gap-2">
                       {newApartment.images.map((img, i) => (
                          <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 group shadow-none">
                             <img src={img} className="size-full object-cover" />
                             <button onClick={() => setNewApartment({...newApartment, images: newApartment.images.filter((_, idx) => idx !== i)})} className="absolute top-1 right-1 size-5 rounded-md bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-none">
                                <Trash2 className="size-2.5" />
                             </button>
                          </div>
                       ))}
                       <button onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center gap-1 hover:border-primary/20 transition-all text-slate-400 bg-slate-50/50 shadow-none">
                          <Plus className="size-4" />
                       </button>
                       <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                    </div>
                 </div>

                 {/* Basic Info */}
                 <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1.5 px-1">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Тип / Название объекта</label>
                       <input 
                         placeholder="Например: Люкс, Студия..."
                         value={newApartment.title} 
                         onChange={(e) => setNewApartment({...newApartment, title: e.target.value})} 
                         className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none focus:ring-1 focus:ring-primary/20 transition-all shadow-none" 
                       />
                    </div>

                    <div className="space-y-1.5 px-1">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Building className="size-3" /> Жилой комплекс</label>
                       <div className="relative">
                          <select 
                             value={newApartment.complex_id}
                             onChange={(e) => setNewApartment({...newApartment, complex_id: e.target.value})}
                             className="w-full h-10 px-3 pr-8 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none focus:ring-1 focus:ring-primary/20 appearance-none shadow-none cursor-pointer"
                          >
                             {complexes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                          <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 rotate-90 pointer-events-none" />
                       </div>
                    </div>

                    <div className="space-y-1.5 px-1">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><MapPin className="size-3" /> Адрес</label>
                       <input 
                         placeholder="Точный адрес, номер квартиры..."
                         value={newApartment.address} 
                         onChange={(e) => setNewApartment({...newApartment, address: e.target.value})} 
                         className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none focus:ring-1 focus:ring-primary/20 transition-all shadow-none" 
                       />
                    </div>
                    
                    {/* Location Lat Lng */}
                    <div className="grid grid-cols-2 gap-3 px-1 mt-1">
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Navigation className="size-3" /> Широта (LAT)</label>
                          <input type="text" placeholder="41.311081" value={newApartment.lat} onChange={(e) => setNewApartment({...newApartment, lat: e.target.value})} className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none tabular-nums focus:ring-1 focus:ring-primary/20 shadow-none" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Navigation className="size-3" /> Долгота (LNG)</label>
                          <input type="text" placeholder="69.240562" value={newApartment.lng} onChange={(e) => setNewApartment({...newApartment, lng: e.target.value})} className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none tabular-nums focus:ring-1 focus:ring-primary/20 shadow-none" />
                       </div>
                    </div>

                    {/* Rooms & Size */}
                    <div className="grid grid-cols-3 gap-3 px-1 mt-1">
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><BedDouble className="size-3" /> Спальни</label>
                          <input type="number" placeholder="3" value={newApartment.bedrooms} onChange={(e) => setNewApartment({...newApartment, bedrooms: e.target.value})} className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none tabular-nums focus:ring-1 focus:ring-primary/20 shadow-none" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Bath className="size-3" /> Ванные</label>
                          <input type="number" placeholder="2" value={newApartment.bathrooms} onChange={(e) => setNewApartment({...newApartment, bathrooms: e.target.value})} className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none tabular-nums focus:ring-1 focus:ring-primary/20 shadow-none" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Ruler className="size-3" /> Метраж</label>
                          <input type="number" placeholder="120" value={newApartment.size} onChange={(e) => setNewApartment({...newApartment, size: e.target.value})} className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none tabular-nums focus:ring-1 focus:ring-primary/20 shadow-none" />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 px-1 mt-1">
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><CreditCard className="size-3" /> Сутки (СУМ)</label>
                          <input type="number" placeholder="4500000" value={newApartment.price} onChange={(e) => setNewApartment({...newApartment, price: e.target.value})} className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none tabular-nums focus:ring-1 focus:ring-primary/20 shadow-none" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Users className="size-3" /> Гости</label>
                          <input type="number" placeholder="4" value={newApartment.guests} onChange={(e) => setNewApartment({...newApartment, guests: e.target.value})} className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none tabular-nums focus:ring-1 focus:ring-primary/20 shadow-none" />
                       </div>
                    </div>
                 </div>

                 {/* Amenities with Inline Grid */}
                 <div className="space-y-3 px-1 mt-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Sparkles className="size-3" /> УДОБСТВА</p>
                    <div className="space-y-2">
                       {newApartment.amenities.map((item, i) => (
                          <div key={item.id} className="flex flex-col gap-1.5 p-2 bg-slate-50/50 border border-slate-100 rounded-xl shadow-none">
                             <div className="flex items-center gap-1.5">
                                <button onClick={() => setSelectingIconForId(selectingIconForId === item.id ? null : item.id)} className="size-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 hover:bg-slate-100 transition-colors shadow-none">
                                   {(() => { const Icon = ICON_MAP[item.icon] || Wifi; return <Icon className="size-4 text-slate-900" />; })()}
                                </button>
                                <input value={item.name} onChange={(e) => { const newAmen = [...newApartment.amenities]; newAmen[i].name = e.target.value; setNewApartment({...newApartment, amenities: newAmen}); }} className="flex-1 h-9 px-3 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:ring-1 focus:ring-primary/20 shadow-none" />
                                <button onClick={() => removeAmenity(item.id)} className="size-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-none">
                                   <Trash2 className="size-3.5" />
                                </button>
                             </div>
                             
                             <AnimatePresence>
                               {selectingIconForId === item.id && (
                                 <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                    <div className="grid grid-cols-7 gap-1.5 pt-1.5">
                                       {ICON_OPTIONS.map((opt) => (
                                          <button key={opt.name} onClick={() => updateAmenityIcon(item.id, opt.name)} className={cn("size-8 rounded-lg flex items-center justify-center transition-all shadow-none", item.icon === opt.name ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-900")}>
                                             <opt.icon className="size-3.5" />
                                          </button>
                                       ))}
                                    </div>
                                 </motion.div>
                               )}
                             </AnimatePresence>
                          </div>
                       ))}
                       <button onClick={addAmenity} className="w-full h-10 rounded-xl border-2 border-dashed border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:border-primary/30 hover:text-primary transition-all flex items-center justify-center gap-1.5 group bg-slate-50/50 shadow-none">
                          <Plus className="size-3 group-hover:scale-110 transition-transform" /> Добавить удобство
                       </button>
                    </div>
                 </div>

              </div>

              <div className="p-5 border-t border-slate-100 bg-white sticky bottom-0 z-20">
                 <button 
                   onClick={handleAddApartment} 
                   className={cn(
                     "w-full h-11 rounded-xl font-black text-[11px] uppercase tracking-[0.1em] flex items-center justify-center gap-2 transition-all shadow-none",
                     newApartment.title && newApartment.address && newApartment.complex_id
                       ? "bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98]" 
                       : "bg-slate-100 text-slate-400 cursor-not-allowed"
                   )}
                 >
                    <Plus className="size-4" /> ДОБАВИТЬ В БАЗУ
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
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
                  <h3 className="text-[16px] font-black uppercase tracking-tight mb-2">Удалить объект?</h3>
                  <p className="text-[11px] text-slate-500 font-bold mb-8 leading-relaxed">Квартира <span className="text-slate-900">{itemToDelete.title}</span> будет удалена.</p>
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
