"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Star, BedDouble, Bath, Square, ChevronRight, Heart, Users } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";

interface Property {
  id: number;
  title: string;
  price: number;
  address: string;
  guests: number;
  size: string;
  image: string;
  status?: string;
}

interface ApartmentListProps {
  title?: string;
  complexId?: number;
  items: Property[];
  onSelect?: (item: Property) => void;
  layout?: "horizontal" | "vertical" | "grid";
}

export const ApartmentList = ({ title, complexId, items, onSelect, layout = "horizontal" }: ApartmentListProps) => {
  const { liked, toggleLike } = useAppContext();
  return (
    <div className={layout === "grid" ? "px-4" : "mt-4"}>
      {title && (
        <div className="flex items-center justify-between px-5 mb-3">
          <h3 className="text-[16px] font-extrabold text-slate-900 tracking-tight">{title}</h3>
          {complexId ? (
            <Link href={`/complex/${complexId}`} className="flex items-center gap-0.5 text-[12px] font-bold text-[#007AFF] hover:text-[#007AFF]/80 transition-colors">
              Все <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            </Link>
          ) : (
            <button className="flex items-center gap-0.5 text-[12px] font-bold text-[#007AFF] hover:text-[#007AFF]/80 transition-colors">
              Все <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
          )}
        </div>
      )}

      <div className={
        layout === "grid" 
          ? "grid grid-cols-2 gap-3 pb-8" 
          : layout === "vertical" 
            ? "flex flex-col gap-4 pb-10 px-3" 
            : "flex gap-3 overflow-x-auto px-5 pb-0 no-scrollbar snap-x snap-mandatory"
      }>
        {items.map((item) => (
          <Link 
            key={item.id} 
            href={`/property/${item.id}`}
            className={`
              ${layout === "grid" ? "w-full" : layout === "vertical" ? "w-full" : "w-[240px] flex-shrink-0 snap-center"} 
              bg-white rounded-[1.75rem] ${layout === "vertical" ? "p-2 pb-3" : "p-1 pb-2"} border border-slate-200/60 cursor-pointer active:scale-[0.98] transition-transform block
            `}
          >
            
            {/* Image Section */}
            <div className={`relative ${layout === "grid" ? "h-[130px]" : layout === "vertical" ? "h-[150px]" : "h-[140px]"} w-full rounded-[1.5rem] overflow-hidden mb-3 group/img`}>
              <Image 
                src={item.image || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80"} 
                alt={item.title} 
                fill 
                className="object-cover transition-transform duration-500" 
                onError={(e) => {
                  (e.target as any).src = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80";
                }}
              />
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleLike(item.id);
                }}
                className="absolute top-2.5 right-2.5 h-[30px] w-[30px] rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/20 transition-all hover:scale-110 active:scale-90 shadow-sm z-10"
              >
                <Heart 
                  className={`h-3.5 w-3.5 transition-colors ${liked[item.id] ? "fill-[#FF453A] text-[#FF453A]" : "text-white"}`} 
                  strokeWidth={2} 
                />
              </button>
            </div>
            
            {/* Content Section */}
            <div className="px-2.5 pb-1">
              <div className="mb-1">
                <h4 className={`${layout === "grid" ? "text-[12px]" : layout === "vertical" ? "text-[16px]" : "text-[14px]"} font-black text-slate-600 tracking-tight leading-tight truncate`}>
                  {item.title}
                </h4>
              </div>
              
              <div className="flex items-center gap-1 mb-2 text-slate-500">
                <MapPin className={`${layout === "vertical" ? "h-3 w-3" : "h-2.5 w-2.5"} text-[#007AFF]`} strokeWidth={2.5} />
                <span className={`${layout === "vertical" ? "text-[11px]" : "text-[9px]"} font-bold truncate`}>{item.address}</span>
              </div>

              <div className={`flex items-center justify-between pt-1.5 border-t border-slate-100 ${layout === "grid" ? "mt-1" : ""}`}>
                {layout !== "grid" && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className={`${layout === "vertical" ? "h-3.5 w-3.5" : "h-2.5 w-2.5"} text-slate-400`} strokeWidth={2} />
                      <span className={`${layout === "vertical" ? "text-[11px]" : "text-[9px]"} font-bold text-slate-700`}>{item.guests}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className={`${layout === "vertical" ? "h-3.5 w-3.5" : "h-2.5 w-2.5"} text-slate-400`} strokeWidth={2} />
                      <span className={`${layout === "vertical" ? "text-[11px]" : "text-[9px]"} font-bold text-slate-700`}>{item.size}</span>
                    </div>
                  </div>
                )}
                <span className={`${layout === "grid" ? "text-[11px]" : layout === "vertical" ? "text-[15px]" : "text-[13px]"} font-black text-slate-600 tracking-tight ml-auto`}>
                  {formatNumber(item.price)} сум
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
