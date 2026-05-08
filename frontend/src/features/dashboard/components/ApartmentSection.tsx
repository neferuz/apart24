"use client";

import Image from "next/image";
import { Star } from "lucide-react";

interface Apartment {
  id: number;
  title: string;
  price: string;
  rating: number;
  img: string;
}

interface ApartmentSectionProps {
  title: string;
  items: Apartment[];
}

export const ApartmentSection = ({ title, items }: ApartmentSectionProps) => {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between px-4 mb-3">
        <h3 className="text-[15px] font-extrabold text-slate-900">{title}</h3>
        <button className="text-[11px] font-bold text-slate-500 bg-white shadow-sm border border-slate-200 px-3 py-1 rounded-full active:scale-95 transition-transform">
          Все
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">
        {items.map((item) => (
          <div key={item.id} className="min-w-[150px] w-[150px] bg-white rounded-[1.5rem] p-2 shadow-sm border border-slate-100 flex-shrink-0 cursor-pointer active:scale-95 transition-transform">
            <div className="relative h-28 w-full rounded-[1rem] overflow-hidden mb-2 bg-slate-100">
              <Image 
                src={item.img} 
                alt={item.title} 
                fill 
                className="object-cover"
              />
              <div className="absolute top-1.5 right-1.5 flex items-center gap-1 rounded-full bg-white/90 px-1.5 py-0.5 backdrop-blur-md shadow-sm">
                <Star className="h-2 w-2 fill-slate-900 text-slate-900" strokeWidth={0} />
                <span className="text-[9px] font-extrabold text-slate-900">{item.rating}</span>
              </div>
            </div>
            <div className="px-1 pb-1">
              <h4 className="text-[12px] font-extrabold text-slate-900 truncate mb-0.5">{item.title}</h4>
              <p className="text-[12px] font-black text-slate-500 tracking-tight">{item.price}<span className="text-slate-400 font-bold text-[9px] ml-0.5">/мес</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
