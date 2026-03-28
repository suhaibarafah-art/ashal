/**
 * Cart — localStorage-based single-page cart
 * Supports multi-item (but checkout routes per-product)
 */

export interface CartItem {
  productId: string;
  titleAr: string;
  imageUrl: string;
  finalPrice: number;
  qty: number;
}

const KEY = 'saudilux_cart';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as CartItem[];
  } catch {
    return [];
  }
}

export function addToCart(item: Omit<CartItem, 'qty'>): void {
  const cart = getCart();
  const idx  = cart.findIndex(c => c.productId === item.productId);
  if (idx >= 0) {
    cart[idx].qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  localStorage.setItem(KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
}

export function removeFromCart(productId: string): void {
  const cart = getCart().filter(c => c.productId !== productId);
  localStorage.setItem(KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
}

export function clearCart(): void {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event('cart-updated'));
}

export function cartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, c) => sum + c.finalPrice * c.qty, 0);
}

export function cartCount(cart: CartItem[]): number {
  return cart.reduce((sum, c) => sum + c.qty, 0);
}
