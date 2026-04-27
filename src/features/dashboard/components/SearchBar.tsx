"use client";

import { Search as SearchIcon } from "lucide-react";

interface SearchBarProps {
  variant?: "default" | "minimal";
}

export const SearchBar = ({ variant = "default" }: SearchBarProps) => {
  return (
    <div className="relative flex items-center w-full">
      <SearchIcon className="absolute left-0 h-4 w-4 text-slate-900" strokeWidth={2.5} />
      <input
        type="text"
        placeholder="Найти апартаменты..."
        className="h-7 w-full bg-transparent pl-6 pr-2 text-[14px] font-extrabold text-slate-900 outline-none placeholder:text-slate-300 placeholder:font-bold"
      />
    </div>
  );
};
