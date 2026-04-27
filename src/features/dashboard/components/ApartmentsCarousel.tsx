"use client";

import Image from "next/image";
import { Star } from "lucide-react";

const apartments = [
  { id: 1, title: "Люкс Skyline", price: "2 400 $", rating: 4.9, img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80" },
  { id: 2, title: "Лофт Garden", price: "1 850 $", rating: 4.7, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80" },
  { id: 3, title: "Студия Urban", price: "1 200 $", rating: 4.5, img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80" },
  { id: 6, title: "Уютный угол", price: "1 450 $", rating: 4.6, img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80" },
];

export const ApartmentsCarousel = () => {
  return (
    <div className="px-4 mt-5 bg-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] font-bold text-slate-900">Популярное</h3>
        <button className="text-[11px] font-bold text-slate-400">Все</button>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar">
        {apartments.map((apt) => (
          <div key={apt.id} className="min-w-[180px] flex-shrink-0 group cursor-pointer">
            <div className="relative h-28 w-full overflow-hidden rounded-[1.25rem] border border-slate-100">
              <Image 
                src={apt.img} 
                alt={apt.title} 
                fill 
                className="object-cover"
              />
              <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 backdrop-blur-md border border-slate-100">
                <Star className="h-2 w-2 fill-yellow-400 text-yellow-400" />
                <span className="text-[9px] font-bold text-slate-900">{apt.rating}</span>
              </div>
            </div>
            <div className="mt-2 px-0.5">
              <h4 className="text-[13px] font-bold text-slate-900 truncate leading-tight">{apt.title}</h4>
              <p className="text-[11px] font-bold text-red-600">{apt.price}<span className="text-slate-400 font-medium text-[9px]">/мес</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
