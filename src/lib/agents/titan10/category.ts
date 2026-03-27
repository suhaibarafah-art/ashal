/**
 * TITAN-10 | category detector — shared utility
 * No external imports to avoid circular dependencies.
 */

const KEYWORD_MAP: Array<{ keywords: string[]; category: string }> = [
  { keywords: ['wireless charger', 'wireless charging', 'charger'], category: 'electronics' },
  { keywords: ['led desk lamp', 'desk lamp', 'led lamp', 'lamp', 'light'], category: 'home' },
  { keywords: ['car organizer', 'car', 'auto', 'vehicle'], category: 'automotive' },
  { keywords: ['kitchen gadget', 'kitchen', 'cooking', 'food'], category: 'kitchen' },
  { keywords: ['phone stand', 'phone holder', 'stand', 'holder', 'mount'], category: 'accessories' },
  { keywords: ['bluetooth earbuds', 'earbuds', 'earphones', 'headphones', 'audio', 'bluetooth'], category: 'electronics' },
  { keywords: ['portable fan', 'fan', 'cooling', 'mini fan'], category: 'home' },
  { keywords: ['smart home', 'smart', 'iot', 'wifi', 'remote'], category: 'electronics' },
  { keywords: ['wallet', 'rfid', 'card holder', 'leather wallet'], category: 'accessories' },
  { keywords: ['watch', 'smartwatch', 'band', 'bracelet'], category: 'electronics' },
  { keywords: ['perfume', 'diffuser', 'aroma', 'fragrance', 'scent'], category: 'home' },
  { keywords: ['bag', 'backpack', 'handbag', 'purse', 'tote'], category: 'fashion' },
  { keywords: ['sunglasses', 'glasses', 'eyewear'], category: 'fashion' },
];

export function detectCategory(titleEn: string): string {
  const lower = titleEn.toLowerCase();
  for (const entry of KEYWORD_MAP) {
    if (entry.keywords.some(k => lower.includes(k))) {
      return entry.category;
    }
  }
  return 'general';
}
