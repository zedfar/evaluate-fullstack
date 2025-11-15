import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Image } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import type { CreateProductData, Product } from '@/types/product.types';
import type { Category } from '@/types/category.types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product | null; // Optional: for edit mode
}

const initialFormData: CreateProductData = {
  name: '',
  description: '',
  price: 0,
  stock: 0,
  low_stock_threshold: 10,
  image_url: '',
  category_id: '',
};

export const ProductFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  product = null,
}: ProductFormModalProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<CreateProductData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = !!product;

  useEffect(() => {
    if (!isOpen) return;

    const abortController = new AbortController();

    const loadCategories = async () => {
      try {
        const response = await categoryService.getAll(undefined, {
          signal: abortController.signal,
        });
        setCategories(response);
      } catch (err: any) {
        if (err.name === 'CanceledError' || err.name === 'AbortError') {
          return;
        }
        console.error('Error fetching categories:', err);
      }
    };

    loadCategories();

    // Populate form data if editing
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        low_stock_threshold: product.low_stock_threshold,
        image_url: product.image_url || '',
        category_id: product.category_id,
      });
    } else {
      setFormData(initialFormData);
    }

    return () => {
      abortController.abort();
    };
  }, [isOpen, product]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Nama produk wajib diisi';
    }
    if (!formData.category_id) {
      errors.category_id = 'Kategori wajib dipilih';
    }
    if (formData.price <= 0) {
      errors.price = 'Harga harus lebih dari 0';
    }
    if (formData.stock < 0) {
      errors.stock = 'Stok tidak boleh negatif';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      if (isEditMode && product) {
        // Update existing product
        await productService.update(product.id, formData);
      } else {
        // Create new product
        await productService.create(formData);
      }

      // Reset form
      setFormData(initialFormData);
      setFormErrors({});

      // Close modal and trigger success
      onClose();
      onSuccess();
    } catch (err: any) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} product:`, err);
      setFormErrors({ submit: err.message || `Gagal ${isEditMode ? 'mengupdate' : 'menambahkan'} produk` });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['price', 'stock', 'low_stock_threshold'].includes(name)
        ? Number(value)
        : value,
    }));

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setFormErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Produk" : "Tambah Produk"}
      subtitle={isEditMode ? "Perbarui detail produk di bawah ini." : "Masukkan detail produk untuk menambahkannya ke inventaris."}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="p-6">
        {/* Error Message */}
        {formErrors.submit && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 mb-6">
            <AlertCircle size={18} />
            <p className="text-sm font-medium">{formErrors.submit}</p>
          </div>
        )}

        <div className="flex gap-6">
          {/* Left Side - Image Upload */}
          <div className="w-56 flex-shrink-0">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Gambar Produk
            </label>
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg h-56 flex items-center justify-center mb-3 overflow-hidden">
              {formData.image_url ? (
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <Image size={48} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">No image</p>
                </div>
              )}
            </div>
            <input
              type="text"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              placeholder="Image URL (opsional)"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            />
            <p className="mt-1.5 text-xs text-gray-500">Masukkan URL gambar produk</p>
          </div>

          {/* Right Side - Form Fields */}
          <div className="flex-1 space-y-5">
            {/* Nama Produk & Kategori */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Contoh: Laptop Gaming ASUS ROG"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                    formErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {formErrors.name && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-900 mb-2">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                    formErrors.category_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Pilih kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {formErrors.category_id && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {formErrors.category_id}
                  </p>
                )}
              </div>
            </div>

            {/* Deskripsi Produk */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
                Deskripsi Produk
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Deskripsi lengkap tentang produk..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-none"
              />
            </div>

            {/* Harga & Stok */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-900 mb-2">
                  Harga Satuan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    Rp
                  </span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price || ''}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="0"
                    className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                      formErrors.price ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                {formErrors.price && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {formErrors.price}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-900 mb-2">
                  Stok Awal <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock || ''}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="0"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                    formErrors.stock ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {formErrors.stock && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {formErrors.stock}
                  </p>
                )}
              </div>
            </div>

            {/* Low Stock Threshold */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <label htmlFor="low_stock_threshold" className="block text-sm font-medium text-gray-900 mb-1">
                    Batas Stok Minimum
                  </label>
                  <p className="text-xs text-gray-600 mb-3">
                    Sistem akan memberi peringatan "Stok Menipis" jika stok di bawah nilai ini
                  </p>
                  <input
                    type="number"
                    id="low_stock_threshold"
                    name="low_stock_threshold"
                    value={formData.low_stock_threshold || ''}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="10"
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all bg-white"
                  />
                  <span className="ml-2 text-sm text-gray-600">unit</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {isEditMode ? 'Mengupdate...' : 'Menyimpan...'}
              </>
            ) : (
              isEditMode ? 'Update Produk' : 'Tambah Produk'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
