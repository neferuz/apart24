"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface Apartment {
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
  items: Apartment[];
  liked: Record<number, boolean>;
  onToggleLike: (id: number) => void;
  onSelect: (item: Apartment) => void;
}

export const ApartmentList = ({ title, items, liked, onToggleLike }: ApartmentListProps) => {
  return (
    <div className="mb-10">
      {title && (
        <div className="flex items-center justify-between px-6 mb-5">
          <h2 className="text-[22px] font-black text-slate-600 tracking-tight">{title}</h2>
          <button className="text-[14px] font-black text-[#007AFF]">Смотреть все</button>
        </div>
      )}
      <div className="flex overflow-x-auto px-6 gap-5 no-scrollbar pb-6 snap-x">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="min-w-[280px] w-[280px] snap-start"
          >
            <Link href={`/property/${item.id}`} scroll={false} className="block group">
              <div className="relative h-[220px] rounded-[3rem] overflow-hidden mb-4 bg-white border border-slate-100 shadow-none transition-transform duration-500 group-active:scale-[0.98]">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Heart Button */}
                <div className="absolute top-4 right-4 z-10">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onToggleLike(item.id);
                    }}
                    className={`h-11 w-11 rounded-full backdrop-blur-md flex items-center justify-center transition-all active:scale-90 border border-white/20 ${liked[item.id] ? 'bg-white text-pink-500' : 'bg-black/20 text-white'}`}
                  >
                    <Heart className="h-5.5 w-5.5" fill={liked[item.id] ? "currentColor" : "none"} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-4 left-4">
                  <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/20">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-[12px] font-black text-slate-600">{item.rating}</span>
                  </div>
                </div>

                {/* Price Badge */}
                <div className="absolute bottom-5 left-5">
                   <div className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 shadow-sm">
                      <span className="text-slate-600 text-[14px] font-black">{item.price}</span>
                   </div>
                </div>
              </div>

              <div className="px-3">
                <h3 className="text-[18px] font-black text-slate-600 leading-tight mb-1.5 group-hover:text-[#007AFF] transition-colors">{item.title}</h3>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="h-3.5 w-3.5" strokeWidth={1} />
                  <span className="text-[13px] font-bold truncate">{item.location}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
