"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, ArrowRight, AlertCircle, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Small artificial delay for premium feel
    await new Promise((resolve) => setTimeout(resolve, 800));

    const success = login(email, password);
    if (!success) {
      setError("Неверная почта или пароль");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8F9FA] p-4 relative overflow-hidden font-sans">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-slate-900/5 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="bg-white rounded-[32px] p-8 md:p-10 border border-slate-100 shadow-[0_8px_32px_-4px_rgba(0,0,0,0.02)]">
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-10">
            <div className="size-16 rounded-2xl bg-slate-900 flex items-center justify-center mb-6 shadow-xl shadow-slate-900/10">
              <Building2 className="size-8 text-white" />
            </div>
            <h1 className="text-[24px] font-black tracking-tight text-slate-900 mb-2 uppercase">Apart24 Admin</h1>
            <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Панель управления</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Электронная почта</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] font-bold outline-none focus:bg-white focus:border-slate-900/10 focus:ring-4 focus:ring-slate-900/5 transition-all placeholder:text-slate-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Пароль</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] font-bold outline-none focus:bg-white focus:border-slate-900/10 focus:ring-4 focus:ring-slate-900/5 transition-all placeholder:text-slate-300"
                  required
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-xl border border-red-100"
                >
                  <AlertCircle className="size-4 shrink-0" />
                  <span className="text-[11px] font-black uppercase tracking-tight leading-none">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-slate-900 text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-xl shadow-slate-900/10"
            >
              {isLoading ? (
                <div className="size-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Войти в систему
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50 text-center">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">© 2024 Apart24 Management System</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
