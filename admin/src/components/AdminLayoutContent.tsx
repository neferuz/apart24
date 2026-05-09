"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <main className="flex-1 w-full">{children}</main>;
  }

  return (
    <>
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden lg:pl-[240px]">
        <Header />
        <main className="flex-1 p-3 md:p-5 lg:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </>
  );
}
