"use client";

import { Droplets, Wind, ShieldCheck, Wifi, Car, Coffee, Dumbbell, Waves } from "lucide-react";

const services = [
  { icon: Droplets, label: "Уборка" },
  { icon: Coffee, label: "Кофе" },
  { icon: Wifi, label: "Wi-Fi" },
  { icon: Dumbbell, label: "Зал" },
  { icon: Waves, label: "Бассейн" },
  { icon: Wind, label: "Климат" },
  { icon: ShieldCheck, label: "Охрана" },
  { icon: Car, label: "Парковка" },
];

export const QuickServices = () => {
  return (
    <div className="mt-4 px-4">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {services.map((service, i) => (
          <div 
            key={i} 
            className="flex items-center gap-2 bg-white rounded-full pr-3 pl-1.5 py-1.5 shadow-sm border border-slate-100 flex-shrink-0 cursor-pointer active:bg-slate-50 transition-colors"
          >
            <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center">
              <service.icon className="h-3.5 w-3.5 text-slate-700" strokeWidth={2} />
            </div>
            <span className="text-[11px] font-extrabold text-slate-700">{service.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
