"use client";

import { Calendar, Users } from "lucide-react";

interface BookingFilterProps {
  onDateClick: () => void;
  onGuestClick: () => void;
  startDate: number | null;
  endDate: number | null;
  adults: number;
  kids: number;
}

export const BookingFilter = ({ onDateClick, onGuestClick, startDate, endDate, adults, kids }: BookingFilterProps) => {
  const formatDates = () => {
    if (!startDate) return "Выберите даты";
    if (!endDate) return `${startDate} мая`;
    return `${startDate}-${endDate} мая`;
  };

  return (
    <div className="flex items-center w-full mt-4 bg-white rounded-[1.75rem] border border-slate-100 p-3">
      <div 
        onClick={onDateClick}
        className="flex-1 flex flex-col justify-center border-r border-slate-100 pr-4 pl-2 cursor-pointer active:opacity-60 transition-opacity"
      >
        <div className="flex items-center gap-1.5 mb-0.5">
          <Calendar className="h-3.5 w-3.5 text-slate-400" strokeWidth={2.5} />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Даты</span>
        </div>
        <span className="text-[14px] font-black text-slate-600">{formatDates()}</span>
      </div>

      <div 
        onClick={onGuestClick}
        className="flex-1 flex flex-col justify-center pl-4 cursor-pointer active:opacity-60 transition-opacity"
      >
        <div className="flex items-center gap-1.5 mb-0.5">
          <Users className="h-3.5 w-3.5 text-slate-400" strokeWidth={2.5} />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Гости</span>
        </div>
        <span className="text-[14px] font-black text-slate-600">{adults + kids} чел.</span>
      </div>
    </div>
  );
};
