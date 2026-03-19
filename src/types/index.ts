export interface ProductWithImages {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  shortDescAr: string | null;
  shortDescEn: string | null;
  descAr: string | null;
  descEn: string | null;
  bulletsAr: string[];
  bulletsEn: string[];
  sellingPrice: number | { toNumber: () => number };
  comparePrice: number | { toNumber: () => number } | null;
  costPrice: number | { toNumber: () => number } | null;
  stock: number;
  sku: string | null;
  categoryId: string | null;
  isActive: boolean;
  isFeatured: boolean;
  codEnabled: boolean;
  tabbyEnabled: boolean;
  tamaraEnabled: boolean;
  leadTimeDays: number | null;
  createdAt: Date;
  updatedAt: Date;
  images: {
    id: string;
    url: string;
    altAr: string | null;
    altEn: string | null;
    isPrimary: boolean;
    sortOrder: number;
  }[];
  category: {
    id: string;
    slug: string;
    nameAr: string;
    nameEn: string;
  } | null;
}

export interface CategoryWithCount {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descAr: string | null;
  descEn: string | null;
  imageUrl: string | null;
  sortOrder: number;
  _count?: { products: number };
}

export interface OrderWithItems {
  id: string;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  subtotal: number | { toNumber: () => number };
  shippingFee: number | { toNumber: () => number };
  discount: number | { toNumber: () => number };
  total: number | { toNumber: () => number };
  createdAt: Date;
  guestEmail: string | null;
  guestName: string | null;
  addressSnapshot: Record<string, unknown>;
  items: {
    id: string;
    titleAr: string;
    titleEn: string;
    imageUrl: string | null;
    quantity: number;
    unitPrice: number | { toNumber: () => number };
    totalPrice: number | { toNumber: () => number };
  }[];
  user: { name: string | null; email: string } | null;
}
