'use client';

import React, { useState } from 'react';

/**
 * Marketing Kit Panel — Social Media content generator per product
 * كيت التسويق الفيروسي — جاهز للنسخ واللصق على السوشيال ميديا
 */

interface MarketingKit {
  tiktok: string;
  snap: string;
  x: string;
  whatsapp: string;
}

function generateKit(titleAr: string, price: number): MarketingKit {
  return {
    tiktok: `🔥 هذا المنتج غيّر حياتي! "${titleAr}" — بـ SAR ${price} فقط 💎 وصل للسعودية حصرياً! اطلبه الآن قبل ما ينفد 🚀 #فخامة #السعودية #تسوق`,
    snap: `✨ "${titleAr}" وصل للمملكة! 🇸🇦\nسعر لا يُصدق: SAR ${price}\n💛 توصيل سريع لكل مدن المملكة\nاطلب الآن 👇`,
    x: `🧵 لماذا كل الناس تتحدث عن "${titleAr}"؟\n\n1/ المنتج الذي غيّر قواعد اللعبة في السعودية\n2/ جودة عالمية بسعر ${price} ريال\n3/ توصيل سريع لبابك\n\nاشتر الآن قبل نفاد الكمية 🔗`,
    whatsapp: `السلام عليكم 👋\nنبشرك بوصول "${titleAr}" حصرياً! 🎉\n💰 السعر: SAR ${price}\n🚀 توصيل لكل مدن المملكة\n✅ ضمان 7 أيام\nاطلب الآن: [رابط المتجر]`,
  };
}

interface Props {
  products: Array<{ id: string; titleAr: string; finalPrice: number }>;
}

export default function MarketingKitPanel({ products }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<string>(products[0]?.id || '');
  const [copied, setCopied] = useState<string | null>(null);

  const product = products.find(p => p.id === selectedProduct);
  const kit = product ? generateKit(product.titleAr, product.finalPrice) : null;

  const copy = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="mt-12">
      <h5 className="text-[10px] uppercase tracking-[0.4em] text-gray-500 mb-6">SOCIAL MARKETING KITS</h5>

      <div className="flex gap-2 flex-wrap mb-6">
        {products.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedProduct(p.id)}
            className={`text-[9px] px-3 py-1.5 border transition-colors ${
              selectedProduct === p.id
                ? 'border-accent-gold text-accent-gold bg-accent-gold/10'
                : 'border-white/10 text-gray-500 hover:border-white/20'
            }`}
          >
            {p.titleAr}
          </button>
        ))}
      </div>

      {kit && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'tiktok',    icon: '🎵', label: 'TikTok Hook'         },
            { key: 'snap',      icon: '👻', label: 'Snapchat Caption'     },
            { key: 'x',         icon: '𝕏',  label: 'X Thread'            },
            { key: 'whatsapp',  icon: '💬', label: 'WhatsApp Broadcast'  },
          ].map(({ key, icon, label }) => (
            <div key={key} className="border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-widest text-gray-500">
                  {icon} {label}
                </span>
                <button
                  onClick={() => copy(key, kit[key as keyof MarketingKit])}
                  className="text-[9px] px-2 py-1 border border-white/10 text-gray-400 hover:border-accent-gold hover:text-accent-gold transition-colors"
                >
                  {copied === key ? '✓ تم النسخ' : 'نسخ'}
                </button>
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed font-mono whitespace-pre-line dir-rtl text-right">
                {kit[key as keyof MarketingKit]}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
