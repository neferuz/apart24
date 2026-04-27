"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Calendar, MapPin, ChevronRight, Clock, CheckCircle2, History, X, Phone, MessageSquare, Map, QrCode, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { BottomNav } from "@/components/layout/BottomNav";

const mockTrips = [
  {
    id: 1,
    title: "Moonsoon Villa",
    location: "Юнусабадский р-н, Ташкент",
    dates: "12 мая — 18 мая",
    checkIn: "12 мая, 14:00",
    checkOut: "18 мая, 12:00",
    price: "5 100 000 сум",
    status: "waiting",
    statusText: "Ожидает одобрения",
    img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80"
  },
  {
    id: 2,
    title: "Skyline Loft",
    location: "Яккасарайский р-н, Ташкент",
    dates: "2 июня — 5 июня",
    checkIn: "2 июня, 14:00",
    checkOut: "5 июня, 12:00",
    price: "3 600 000 сум",
    status: "confirmed",
    statusText: "Подтверждено",
    img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"
  },
  {
    id: 3,
    title: "Urban Studio",
    location: "Чиланзарский р-н, Ташкент",
    dates: "10 апреля — 12 апреля",
    checkIn: "10 апреля, 14:00",
    checkOut: "12 апреля, 12:00",
    price: "900 000 сум",
    status: "completed",
    statusText: "Завершено",
    img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80"
  }
];

const StatusBadge = ({ status, text }: { status: string, text: string }) => {
  const configs: Record<string, { bg: string, text: string, icon: any }> = {
    waiting: { bg: "bg-amber-50", text: "text-amber-600", icon: Clock },
    confirmed: { bg: "bg-emerald-50", text: "text-emerald-600", icon: CheckCircle2 },
    completed: { bg: "bg-slate-100", text: "text-slate-500", icon: History }
  };
  const config = configs[status];
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.bg} ${config.text} w-fit`}>
      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      <span className="text-[10px] font-black uppercase tracking-wider">{text}</span>
    </div>
  );
};

export default function TripsPage() {
  const [selectedTrip, setSelectedTrip] = useState<typeof mockTrips[0] | null>(null);

  // Fix background when modal is open
  useEffect(() => {
    if (selectedTrip) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedTrip]);

  return (
    <main className="min-h-screen bg-[#F5F5F7] flex flex-col pb-32 overflow-x-hidden">
      {/* Header */}
      <div className="bg-white rounded-b-[2rem] border-b border-slate-100 h-[70px] flex items-center justify-center sticky top-0 z-10">
        <h1 className="text-[17px] font-black text-slate-600 tracking-tight">Мои поездки</h1>
      </div>

      <div className="px-5 pt-6 space-y-4">
        {mockTrips.map((trip, idx) => (
          <motion.div 
            key={trip.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => setSelectedTrip(trip)}
            className="bg-white rounded-[2.25rem] p-4 border border-slate-100 active:scale-[0.98] transition-transform cursor-pointer"
          >
            <div className="flex gap-4">
              <div className="relative h-20 w-20 rounded-[1.5rem] overflow-hidden flex-shrink-0">
                <Image src={trip.img} alt={trip.title} fill className="object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between py-0.5">
                <div>
                  <h3 className="text-[14px] font-black text-slate-600 leading-tight mb-1">{trip.title}</h3>
                  <div className="flex items-center gap-1 text-slate-400 mb-2">
                    <MapPin className="h-3 w-3" strokeWidth={1.5} />
                    <span className="text-[10px] font-bold truncate max-w-[150px]">{trip.location}</span>
                  </div>
                </div>
                <StatusBadge status={trip.status} text={trip.statusText} />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Даты</span>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 text-[#007AFF]" strokeWidth={2} />
                    <span className="text-[11px] font-black text-slate-600">{trip.dates}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Итого</span>
                  <span className="text-[11px] font-black text-[#007AFF]">{trip.price}</span>
                </div>
              </div>
              <div className="h-8 w-8 rounded-full bg-[#F5F5F7] flex items-center justify-center text-slate-400">
                <ChevronRight className="h-4 w-4" strokeWidth={2} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedTrip && (
          <div className="fixed inset-0 z-[100] flex flex-col justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTrip(null)}
              className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 35, stiffness: 400 }}
              className="relative bg-white rounded-t-[3rem] h-[82vh] overflow-y-auto no-scrollbar border-t border-slate-100"
            >
              <div className="sticky top-0 z-20 flex justify-between items-center px-6 pt-5 pb-3 bg-white/90 backdrop-blur-md">
                <h2 className="text-[16px] font-black text-slate-600">Детали поездки</h2>
                <button 
                  onClick={() => setSelectedTrip(null)}
                  className="h-9 w-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 active:scale-90 transition-transform"
                >
                  <X className="h-5 w-5" strokeWidth={2} />
                </button>
              </div>

              <div className="px-6 pb-24">
                <div className="relative h-56 w-full rounded-[2.5rem] overflow-hidden mb-6 mt-2">
                  <Image src={selectedTrip.img} alt={selectedTrip.title} fill className="object-cover" />
                  <div className="absolute top-4 left-4">
                    <StatusBadge status={selectedTrip.status} text={selectedTrip.statusText} />
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-[22px] font-black text-slate-600 mb-1.5">{selectedTrip.title}</h2>
                  <div className="flex items-center gap-1.5 text-slate-400 mb-6">
                    <MapPin className="h-4 w-4" strokeWidth={1.5} />
                    <span className="text-[13px] font-bold">{selectedTrip.location}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-[#F8F9FB] p-4 rounded-[1.75rem] border border-slate-50">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Заезд</span>
                      <span className="text-[13px] font-black text-slate-600">{selectedTrip.checkIn}</span>
                    </div>
                    <div className="bg-[#F8F9FB] p-4 rounded-[1.75rem] border border-slate-50">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Выезд</span>
                      <span className="text-[13px] font-black text-slate-600">{selectedTrip.checkOut}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 h-14 bg-[#F8F9FB] rounded-2xl border border-slate-50 flex items-center justify-center gap-2 text-slate-600 text-[14px] font-black active:scale-95 transition-transform">
                      <Phone className="h-4.5 w-4.5 text-[#007AFF]" strokeWidth={1.5} /> Позвонить
                    </button>
                    <button className="h-14 w-14 bg-[#F8F9FB] rounded-2xl border border-slate-50 flex items-center justify-center text-slate-600 active:scale-95 transition-transform">
                      <Map className="h-5 w-5 text-[#007AFF]" strokeWidth={1.5} />
                    </button>
                    <button className="h-14 w-14 bg-[#F8F9FB] rounded-2xl border border-slate-50 flex items-center justify-center text-slate-600 active:scale-95 transition-transform">
                      <ArrowUpRight className="h-5 w-5 text-[#007AFF]" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>

                <div className="bg-[#F8F9FB] rounded-[2.25rem] p-6 mb-6 border border-slate-50">
                  <h3 className="text-[14px] font-black text-slate-500 uppercase tracking-wider mb-4">Оплата</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[13px] font-bold text-slate-400">
                      <span>Стоимость</span>
                      <span className="text-slate-600">{selectedTrip.price}</span>
                    </div>
                    <div className="pt-3 border-t border-slate-200/30 flex justify-between text-[15px] font-black text-slate-600">
                      <span>Итого оплачено</span>
                      <span className="text-[#007AFF]">{selectedTrip.price}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[2.25rem] p-6 flex items-center gap-5">
                  <div className="bg-white p-2 rounded-2xl">
                    <QrCode className="h-12 w-12 text-slate-900" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-black text-white mb-0.5">Ключ доступа</h4>
                    <p className="text-[11px] text-white/50 font-medium">Покажите при заселении</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <BottomNav />
    </main>
  );
}
