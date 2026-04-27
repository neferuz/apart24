"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Star, BedDouble, Bath, Square, ChevronRight, Heart } from "lucide-react";

interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  type: string;
  rating: number;
  img: string;
}

interface ApartmentListProps {
  title?: string;
  items: Property[];
  liked: Record<number, boolean>;
  onToggleLike: (id: number) => void;
  onSelect?: (item: Property) => void;
  layout?: "horizontal" | "vertical" | "grid";
}

export const ApartmentList = ({ title, items, liked, onToggleLike, onSelect, layout = "horizontal" }: ApartmentListProps) => {
  return (
    <div className={layout === "grid" ? "px-4" : "mt-4"}>
      {title && (
        <div className="flex items-center justify-between px-5 mb-3">
          <h3 className="text-[16px] font-extrabold text-slate-900 tracking-tight">{title}</h3>
          <button className="flex items-center gap-0.5 text-[12px] font-bold text-[#007AFF] hover:text-[#007AFF]/80 transition-colors">
            Все <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        </div>
      )}

      <div className={
        layout === "grid" 
          ? "grid grid-cols-2 gap-3 pb-8" 
          : layout === "vertical" 
            ? "flex flex-col gap-4 pb-10 px-5" 
            : "flex gap-3 overflow-x-auto px-5 pb-0 no-scrollbar"
      }>
        {items.map((item) => (
          <div 
            key={item.id} 
            onClick={() => onSelect?.(item)}
            className={`
              ${layout === "grid" ? "w-full" : layout === "vertical" ? "w-full" : "w-[240px] flex-shrink-0"} 
              bg-white rounded-[1.75rem] p-1 pb-2 border border-slate-200/60 cursor-pointer active:scale-[0.98] transition-transform
            `}
          >
            
            {/* Image Section */}
            <div className={`relative ${layout === "grid" ? "h-[130px]" : "h-[140px]"} w-full rounded-[1.5rem] overflow-hidden mb-2 group/img`}>
              <Image src={item.img} alt={item.title} fill className="object-cover transition-transform duration-500" />
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLike(item.id);
                }}
                className="absolute top-2.5 right-2.5 h-[30px] w-[30px] rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/20 transition-all hover:scale-110 active:scale-90 shadow-sm"
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
                <h4 className={`${layout === "grid" ? "text-[12px]" : "text-[14px]"} font-black text-slate-600 tracking-tight leading-tight truncate`}>
                  {item.title}
                </h4>
              </div>
              
              <div className="flex items-center gap-1 mb-2 text-slate-500">
                <MapPin className="h-2.5 w-2.5 text-[#007AFF]" strokeWidth={2.5} />
                <span className="text-[9px] font-bold truncate">{item.location}</span>
              </div>

              <div className={`flex items-center justify-between pt-1.5 border-t border-slate-100 ${layout === "grid" ? "mt-1" : ""}`}>
                {layout !== "grid" && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5">
                      <BedDouble className="h-2.5 w-2.5 text-slate-400" strokeWidth={2} />
                      <span className="text-[9px] font-bold text-slate-700">{item.beds}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <Bath className="h-2.5 w-2.5 text-slate-400" strokeWidth={2} />
                      <span className="text-[9px] font-bold text-slate-700">{item.baths}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <Square className="h-2.5 w-2.5 text-slate-400" strokeWidth={2} />
                      <span className="text-[9px] font-bold text-slate-700">{item.sqft}м²</span>
                    </div>
                  </div>
                )}
                <span className={`${layout === "grid" ? "text-[11px]" : "text-[13px]"} font-black text-slate-600 tracking-tight ml-auto`}>
                  {item.price}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
