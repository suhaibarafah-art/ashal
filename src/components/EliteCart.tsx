'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCart, removeFromCart, cartTotal, cartCount, type CartItem } from '@/lib/cart';

export default function EliteCart({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Sync with localStorage on open + listen for cart-updated events
  useEffect(() => {
    const sync = () => setItems(getCart());
    sync();
    window.addEventListener('cart-updated', sync);
    return () => window.removeEventListener('cart-updated', sync);
  }, [isOpen]);

  if (!isOpen) return null;

  const total = cartTotal(items);
  const count = cartCount(items);
  const firstId = items[0]?.productId;

  return (
    <div className="fixed inset-0 z-[100] flex justify-start">
      {/* Panel — slides in from right (START side in RTL) */}
      <div
        className="relative w-full max-w-md bg-[#080808] border-e border-white/5 flex flex-col h-full shadow-2xl"
        style={{ animation: 'slideInRight 0.4s cubic-bezier(0.16,1,0.3,1)', padding: '0' }}
      >
        {/* Header */}
        <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em', color: '#b38b4d', marginBottom: '2px' }}>سلة المقتنيات</p>
            {count > 0 && (
              <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{count} منتج</p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontFamily: 'var(--font-montserrat)', fontSize: '11px', letterSpacing: '0.1em' }}
          >
            CLOSE ✕
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 28px' }}>
          {items.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px' }}>
              <p style={{ fontSize: '48px' }}>🛍️</p>
              <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '15px', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                السلة فارغة
              </p>
              <Link href="/collections" onClick={onClose}>
                <button style={{ background: '#b38b4d', color: '#000', border: 'none', borderRadius: '6px', padding: '10px 24px', fontFamily: 'var(--font-cairo)', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                  تصفح المجموعات
                </button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {items.map((item) => (
                <div key={item.productId} style={{ display: 'flex', gap: '14px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'flex-start' }}>
                  {/* Image */}
                  <div style={{ width: '72px', height: '72px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: '#1a1a1a' }}>
                    <img
                      src={item.imageUrl || 'https://picsum.photos/seed/default/200/200'}
                      alt={item.titleAr}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.src = 'https://picsum.photos/seed/default/200/200'; }}
                    />
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.titleAr}
                    </p>
                    <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '13px', fontWeight: 900, color: '#b38b4d', marginBottom: '6px' }}>
                      SAR {(item.finalPrice * item.qty).toLocaleString('en-US')}
                    </p>
                    {item.qty > 1 && (
                      <p style={{ fontFamily: 'var(--font-cairo)', fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '4px' }}>
                        {item.qty} × SAR {item.finalPrice.toLocaleString('en-US')}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link href={`/checkout/${item.productId}`} onClick={onClose}>
                        <button style={{ background: '#FF8C00', color: 'white', border: 'none', borderRadius: '5px', padding: '4px 12px', fontFamily: 'var(--font-cairo)', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                          اطلب
                        </button>
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '5px', padding: '4px 10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-montserrat)', fontSize: '10px', cursor: 'pointer' }}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '20px 28px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
              <span style={{ fontFamily: 'var(--font-cairo)', fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>الإجمالي</span>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '22px', fontWeight: 900, color: '#b38b4d' }}>
                SAR {total.toLocaleString('en-US')}
              </span>
            </div>

            <Link href={firstId ? `/checkout/${firstId}` : '/collections'} onClick={onClose} className="block w-full">
              <button style={{ width: '100%', background: '#b38b4d', color: '#000', border: 'none', borderRadius: '6px', padding: '16px', fontFamily: 'var(--font-cairo)', fontWeight: 900, fontSize: '15px', cursor: 'pointer', letterSpacing: '0.02em' }}>
                إتمام الطلب
              </button>
            </Link>

            <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '9px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', marginTop: '10px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              ZATCA COMPLIANT • SECURE CHECKOUT
            </p>
          </div>
        )}
      </div>

      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm -z-10" onClick={onClose} />

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
