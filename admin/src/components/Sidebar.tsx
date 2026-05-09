"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  Home, 
  Building2, 
  LogOut,
  ChevronRight,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigation } from "@/context/NavigationContext";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
  { icon: LayoutDashboard, label: "Дашборд", href: "/" },
  { icon: CalendarDays, label: "Брони", href: "/bookings" },
  { icon: Users, label: "Клиенты", href: "/clients" },
  { icon: Home, label: "Квартиры", href: "/apartments" },
  { icon: Building2, label: "ЖК", href: "/complexes" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, closeSidebar } = useNavigation();
  const { logout } = useAuth();

  const SidebarContent = (
    <aside className={cn(
      "w-[240px] bg-white border-r border-slate-100 flex flex-col h-screen font-sans shadow-none z-[50]",
      "lg:fixed lg:top-0 lg:left-0 transition-transform duration-300",
      isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      "fixed top-0 left-0"
    )}>
      {/* ── Logo Area ── */}
      <div className="h-16 px-6 flex items-center border-b border-slate-100 shrink-0 justify-between">
        <h1 className="text-[16px] font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
          Apart24
          <span className="text-[8px] bg-slate-900 text-white px-2 py-0.5 rounded-md uppercase tracking-widest shadow-none">
            Admin
          </span>
        </h1>
        <button onClick={closeSidebar} className="lg:hidden p-2 rounded-xl bg-slate-50 text-slate-400">
          <X className="size-4" />
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <p className="px-2 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 mt-2">Меню управления</p>
        
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeSidebar}
              className={cn(
                "relative group flex items-center h-10 px-3 gap-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-none outline-none",
                isActive 
                  ? "bg-slate-900 text-white" 
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("size-4", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900")} />
              <span className="flex-1 mt-0.5">{item.label}</span>
              
              {!isActive && (
                <ChevronRight className="size-3.5 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-slate-300" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom Actions ── */}
      <div className="p-4 mt-auto border-t border-slate-100 shrink-0">
        <button 
          onClick={logout}
          className="w-full flex items-center h-10 px-3 gap-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 hover:text-red-600 transition-all shadow-none"
        >
          <LogOut className="size-4" />
          <span className="mt-0.5">Выйти</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[45] lg:hidden"
          />
        )}
      </AnimatePresence>
      {SidebarContent}
    </>
  );
}
