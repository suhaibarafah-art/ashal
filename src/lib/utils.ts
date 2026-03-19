import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `AS-${year}-${rand}`;
}
export function formatSAR(amount: number | string | { toNumber: () => number }): string {
  const num = typeof amount === 'object' ? amount.toNumber() : Number(amount);
  return `${num.toLocaleString('ar-SA', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ر.س`;
}
