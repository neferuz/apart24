import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number | string): string {
  const value = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(value)) return "0";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
