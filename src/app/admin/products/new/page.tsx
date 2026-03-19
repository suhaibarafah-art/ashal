import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div className="p-6" dir="rtl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">إضافة منتج جديد</h1>
        <p className="text-sm text-ink-4 mt-1">أدخل تفاصيل المنتج باللغتين العربية والإنجليزية</p>
      </div>
      <ProductForm />
    </div>
  );
}
