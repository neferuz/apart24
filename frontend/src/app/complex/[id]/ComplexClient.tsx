"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, MapPin, Star, Building2, Search, Filter } from "lucide-react";
import Image from "next/image";
import { ApartmentList } from "@/features/dashboard/components/ApartmentList";
import { BottomNav } from "@/components/layout/BottomNav";
import { api } from "@/services/api";
import { useAppContext } from "@/context/AppContext";
import { cn } from "@/lib/utils";

export function ComplexClient() {
  const params = useParams();
  const router = useRouter();
  const { liked, toggleLike } = useAppContext();
  
  const [complex, setComplex] = useState<any>(null);
  const [apartments, setApartments] = useState<any[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!params.id) return;
      try {
        const targetId = String(params.id);
        const complexes = await api.getComplexes();
        const comp = complexes.find((c: any) => String(c.id) === targetId);
        console.log("Current Complex Fixed:", comp);
        setComplex(comp);
        
        const apts = await api.getApartments();
        const filtered = apts.filter((a: any) => String(a.complex_id) === targetId);
        setApartments(filtered);
      } catch (error) {
        console.error("Failed to load complex data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []); // Only run once on mount

  if (isLoading || !complex) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-[20000]">
        <div className="size-8 border-2 border-slate-200 border-t-[#007AFF] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F5F7] flex flex-col pb-24 relative font-sans max-w-md mx-auto border-x border-slate-100 shadow-sm">
      {/* Sticky Header */}
      <div className={cn(
        "fixed top-0 left-0 right-0 z-[100] max-w-md mx-auto px-5 py-3 flex items-center justify-between transition-all duration-300",
        isScrolled ? "bg-white/90 backdrop-blur-md border-b border-slate-100 opacity-100" : "bg-transparent opacity-0 pointer-events-none"
      )}>
        <button 
          onClick={() => router.back()} 
          className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 active:scale-95 transition-transform"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
        </button>
        <span className="text-[14px] font-black text-slate-800 truncate px-4">{complex.name}</span>
        <div className="w-9" />
      </div>

      {/* Static Header Button (Initial state) */}
      {!isScrolled && (
        <div className="absolute top-8 left-5 right-5 z-[50] flex justify-between items-center">
          <button 
            onClick={() => router.back()} 
            className="h-9 w-9 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
      )}

      {/* Header Image Section - Balanced size */}
      <div className="relative h-[240px] w-full bg-slate-200">
        <Image 
          src={complex.image || complex.img || "https://images.unsplash.com/photo-1545324418-f1d3c5b5a291?w=800&q=80"} 
          alt={complex.name} 
          fill 
          className="object-cover"
          onError={(e) => {
            (e.target as any).src = "https://images.unsplash.com/photo-1545324418-f1d3c5b5a291?w=800&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-[11]" />

        <div className="absolute bottom-16 left-5 right-5 z-20">
          <div className="flex items-center gap-3 mb-1.5">
            <div className="flex items-center gap-1.5 text-white/90 text-[9px] font-black uppercase tracking-widest bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
              <Star className="h-2.5 w-2.5 fill-white text-white" /> Жилой комплекс
            </div>
            <div className="flex items-center gap-1 text-white text-[9px] font-black uppercase tracking-widest bg-emerald-500/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/30">
              Premium
            </div>
          </div>
          <h1 className="text-[26px] font-black text-white leading-tight">{complex.name}</h1>
        </div>
      </div>

      {/* Info Section - Tighter spacing */}
      <div className="relative -mt-10 bg-[#F5F5F7] rounded-t-[1.75rem] px-1 pt-5 flex-1 z-30">
        <div className="flex items-center gap-1.5 mb-6 text-slate-500 px-4">
          <MapPin className="h-3.5 w-3.5 text-[#007AFF]" />
          <span className="text-[12px] font-bold">{complex.address || "Ташкент, Узбекистан"}</span>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 px-4">
             <h3 className="text-[16px] font-black text-slate-900 tracking-tight">Варианты проживания</h3>
             <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{apartments.length} объекта</span>
          </div>
          
          <ApartmentList 
            items={apartments} 
            liked={liked} 
            onToggleLike={toggleLike} 
            onSelect={(item) => router.push(`/property/${item.id}`)}
            layout="vertical"
          />
        </div>

        {apartments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-16 rounded-3xl bg-white border border-slate-100 flex items-center justify-center mb-4">
              <Building2 className="size-8 text-slate-200" />
            </div>
            <p className="text-[14px] text-slate-400 font-medium">В этом комплексе пока нет свободных апартаментов</p>
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
