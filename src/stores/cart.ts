'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  imageUrl: string;
  price: number;
  quantity: number;
  codEnabled: boolean;
}

interface CartStore {
  items: CartItem[];
  couponCode: string | null;
  discount: number;
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  subtotal: () => number;
  total: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      discount: 0,
      isOpen: false,
      addItem: (item) => set((s) => {
        const existing = s.items.find(i => i.id === item.id);
        if (existing) {
          return { items: s.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity ?? 1) } : i) };
        }
        return { items: [...s.items, { ...item, quantity: item.quantity ?? 1 }], isOpen: true };
      }),
      removeItem: (id) => set((s) => ({ items: s.items.filter(i => i.id !== id) })),
      updateQty: (id, qty) => set((s) => {
        if (qty <= 0) return { items: s.items.filter(i => i.id !== id) };
        return { items: s.items.map(i => i.id === id ? { ...i, quantity: qty } : i) };
      }),
      clear: () => set({ items: [], couponCode: null, discount: 0 }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      applyCoupon: (code, discount) => set({ couponCode: code, discount }),
      removeCoupon: () => set({ couponCode: null, discount: 0 }),
      subtotal: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
      total: () => {
        const s = get();
        const sub = s.subtotal();
        const ship = sub >= 200 ? 0 : 25;
        return sub + ship - s.discount;
      },
      totalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    {
      name: 'ashal-cart',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      )
    }
  )
);
