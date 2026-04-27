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
    <div className="mb-8">
      {title && (
        <div className="flex items-center justify-between px-5 mb-4">
          <h2 className="text-[20px] font-black text-slate-600 tracking-tight">{title}</h2>
          <button className="text-[13px] font-bold text-[#007AFF]">Все</button>
        </div>
      )}
      <div className="flex overflow-x-auto px-5 gap-4 no-scrollbar pb-4 snap-x">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            className="min-w-[280px] w-[280px] snap-start"
          >
            <Link href={`/property/${item.id}`} scroll={false} className="block group">
              <div className="relative h-[200px] rounded-[2.5rem] overflow-hidden mb-3 bg-slate-100 border border-slate-100/50">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 z-10">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onToggleLike(item.id);
                    }}
                    className={`h-10 w-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all active:scale-90 ${liked[item.id] ? 'bg-white text-pink-500' : 'bg-black/20 text-white'}`}
                  >
                    <Heart className="h-5 w-5" fill={liked[item.id] ? "currentColor" : "none"} strokeWidth={2} />
                  </button>
                </div>
                <div className="absolute top-4 left-4">
                  <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 border border-white/20">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                    <span className="text-[11px] font-black text-slate-600">{item.rating}</span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4">
                   <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
                      <span className="text-white text-[13px] font-black">{item.price}</span>
                   </div>
                </div>
              </div>
              <div className="px-2">
                <h3 className="text-[16px] font-black text-slate-600 leading-tight mb-1 group-hover:text-[#007AFF] transition-colors">{item.title}</h3>
                <div className="flex items-center gap-1 text-slate-400">
                  <MapPin className="h-3 w-3" strokeWidth={1.5} />
                  <span className="text-[12px] font-bold truncate">{item.location}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
