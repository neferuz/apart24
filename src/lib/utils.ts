import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge tailwind classes efficiently.
 * Used for dynamic class names and cleaner component code.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
