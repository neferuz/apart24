"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Heart as HeartIcon, Plus } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { ApartmentList } from "@/features/dashboard/components/ApartmentList";
import { BottomNav } from "@/components/layout/BottomNav";

const popularData = [
  { id: 1, title: "Moonsoon Villa", price: "850 000 сум", location: "Юнусабадский р-н, Ташкент", beds: 3, baths: 2, sqft: 120, type: "В аренду", rating: 4.8, img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80" },
  { id: 2, title: "Navana House", price: "600 000 сум", location: "Мирзо-Улугбекский р-н, Ташкент", beds: 2, baths: 1, sqft: 85, type: "В аренду", rating: 4.9, img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80" },
  { id: 3, title: "Skyline Loft", price: "1 200 000 сум", location: "Яккасарайский р-н, Ташкент", beds: 4, baths: 3, sqft: 200, type: "В аренду", rating: 5.0, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80" },
  { id: 4, title: "Urban Studio", price: "450 000 сум", location: "Чиланзарский р-н, Ташкент", beds: 1, baths: 1, sqft: 45, type: "В аренду", rating: 4.7, img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80" },
];

const nearbyData = [
  { id: 5, title: "Forest Cabin", price: "500 000 сум", location: "Бектемирский р-н, Ташкент", beds: 1, baths: 1, sqft: 50, type: "В аренду", rating: 4.5, img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80" },
  { id: 6, title: "Ocean View", price: "950 000 сум", location: "Мирабадский р-н, Ташкент", beds: 3, baths: 2, sqft: 140, type: "В аренду", rating: 4.9, img: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80" },
  { id: 7, title: "Metro Flat", price: "350 000 сум", location: "Алмазарский р-н, Ташкент", beds: 1, baths: 1, sqft: 35, type: "В аренду", rating: 4.6, img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80" },
  { id: 8, title: "Elite Estate", price: "1 500 000 сум", location: "Шайхантахурский р-н", beds: 5, baths: 4, sqft: 300, type: "Продажа", rating: 5.0, img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80" },
];

export default function WishlistPage() {
  const router = useRouter();
  const { liked, toggleLike } = useAppContext();

  const allProperties = [...popularData, ...nearbyData];
  const likedItems = allProperties.filter(item => liked[item.id]);

  const groupedLikedItems = useMemo(() => {
    const groups: Record<string, typeof likedItems> = {};
    likedItems.forEach(item => {
      const date = item.id <= 4 ? "Сегодня" : "Вчера";
      if (!groups[date]) groups[date] = [];
      groups[date].push(item);
    });
    return Object.entries(groups).sort((a, b) => (a[0] === "Сегодня" ? -1 : 1));
  }, [likedItems]);

  return (
    <main className="min-h-screen bg-[#F5F5F7] select-none font-sans overflow-x-hidden relative">
      <div className="mx-auto max-w-md bg-[#F5F5F7] min-h-screen relative flex flex-col pb-24">
        
        {/* HEADER */}
        <div className="bg-white rounded-b-[2rem] border-b border-slate-100 h-[70px] flex items-center justify-center sticky top-0 z-10 shadow-none mb-4">
          <h1 className="text-[17px] font-black text-slate-600 tracking-tight">Вишлист</h1>
        </div>

        {/* CONTENT */}
        <div className="flex-1">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {likedItems.length > 0 ? (
              <div className="space-y-6">
                {groupedLikedItems.map(([date, items]) => (
                  <div key={date}>
                    <div className="px-5 mb-3">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{date}</span>
                    </div>
                    <ApartmentList 
                      items={items} 
                      liked={liked} 
                      onToggleLike={toggleLike} 
                      onSelect={(item) => router.push(`/property/${item.id}`)} 
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center mt-24 px-8 text-center">
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
              </div>
            )}
          </div>
        </div>

        <BottomNav />
      </div>
    </main>
  );
}
