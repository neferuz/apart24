"use client";

import Image from "next/image";
import { Star, MapPin } from "lucide-react";

const featured = [
  { id: 4, title: "Пентхаус Horizon", price: "3 200 $", rating: 5.0, location: "Центр", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80" },
  { id: 5, title: "Модерн Вилла", price: "4 500 $", rating: 4.8, location: "Холмы", img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80" },
  { id: 7, title: "Sky Residence", price: "5 100 $", rating: 4.9, location: "Берег", img: "https://images.unsplash.com/photo-1512915922686-57c11fd9b6b3?w=800&q=80" },
];

export const ApartmentsFeaturedCarousel = () => {
  return (
    <div className="px-4 mt-6 pb-28">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-extrabold text-slate-900 uppercase tracking-tight">Лучшие предложения</h3>
        <button className="text-[11px] font-bold text-red-500">Все</button>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar">
        {featured.map((apt) => (
          <div key={apt.id} className="min-w-[280px] flex-shrink-0 group relative overflow-hidden rounded-[2.5rem] bg-slate-50 border border-slate-100 active:scale-[0.98] transition-transform">
            <div className="relative h-44 w-full">
              <Image 
                src={apt.img} 
                alt={apt.title} 
                fill 
                className="object-cover"
              />
              <div className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 backdrop-blur-md border border-slate-100">
                <span className="text-[8px] font-extrabold text-red-600 uppercase">Премиум</span>
              </div>
              <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-slate-900/80 px-2.5 py-1 backdrop-blur-md">
                <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" strokeWidth={0} />
                <span className="text-[9px] font-bold text-white">{apt.rating}</span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-[15px] font-extrabold text-slate-900">{apt.title}</h4>
                  <div className="flex items-center gap-1 text-slate-400">
                    <MapPin className="h-3 w-3" strokeWidth={1.5} />
                    <span className="text-[10px] font-medium">{apt.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-red-600">{apt.price}</span>
                  <p className="text-[9px] font-bold text-slate-400">/мес</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
