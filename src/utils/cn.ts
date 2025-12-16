import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function untuk menggabungkan class Tailwind CSS
 * Menghindari konflik class dan merge dengan benar
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
