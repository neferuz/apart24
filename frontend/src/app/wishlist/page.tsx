"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart as HeartIcon, Plus } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { ApartmentList } from "@/features/dashboard/components/ApartmentList";
import { BottomNav } from "@/components/layout/BottomNav";
import { api } from "@/services/api";

export default function WishlistPage() {
  const router = useRouter();
  const { liked, toggleLike } = useAppContext();
  const [apartments, setApartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadApartments = async () => {
      try {
        const data = await api.getApartments();
        setApartments(data);
      } catch (error) {
        console.error("Failed to load apartments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadApartments();
  }, []);

  const likedItems = useMemo(() => {
    return apartments.filter(item => liked[item.id]);
  }, [apartments, liked]);

  return (
    <main className="min-h-screen bg-[#F5F5F7] select-none font-sans overflow-x-hidden relative">
      <div className="mx-auto max-w-md bg-[#F5F5F7] min-h-screen relative flex flex-col pb-24">
        
        {/* HEADER (Fixed) */}
        <div className="fixed top-0 left-0 right-0 z-[100] max-w-md mx-auto">
          <div className="bg-white/90 backdrop-blur-md rounded-b-[2rem] border-b border-slate-100 h-[70px] flex items-center justify-center shadow-sm">
            <h1 className="text-[17px] font-black text-slate-600 tracking-tight">Вишлист</h1>
          </div>
        </div>

        {/* Spacer for fixed header */}
        <div className="h-[70px] mb-4" />

        {/* CONTENT */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="size-6 border-2 border-slate-200 border-t-[#007AFF] rounded-full animate-spin" />
            </div>
          ) : likedItems.length > 0 ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="px-5 mb-3">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Сохраненные</span>
               </div>
               <ApartmentList 
                  layout="grid"
                  items={likedItems} 
                  onSelect={(item) => router.push(`/property/${item.id}`)} 
               />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-24 px-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="relative mb-8">
                <div className="h-24 w-24 bg-white rounded-[2rem] flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100/50 rotate-12">
                  <HeartIcon className="h-10 w-10 text-slate-200" strokeWidth={1.5} />
                </div>
                <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-[#007AFF] rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white animate-bounce">
                  <Plus className="h-5 w-5" strokeWidth={3} />
                </div>
              </div>
              <h3 className="text-[20px] font-black text-slate-900 mb-2 tracking-tight">Ваш список пуст</h3>
              <p className="text-[14px] text-slate-500 font-medium leading-relaxed mb-8">Начните сохранять жилье, которое вам понравилось, нажав на иконку сердца.</p>
              <button onClick={() => router.push('/')} className="h-14 px-10 bg-slate-900 text-white rounded-2xl text-[14px] font-black uppercase tracking-widest active:scale-95 transition-transform">Перейти в каталог</button>
            </div>
          )}
        </div>

        <BottomNav />
      </div>
    </main>
  );
}
