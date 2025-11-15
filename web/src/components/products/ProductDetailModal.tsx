import { Pencil, Check } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import type { Product } from '@/types/product.types';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit: (product: Product) => void;
  onUpdateStock: (product: Product) => void;
}

export const ProductDetailModal = ({
  isOpen,
  onClose,
  product,
  onEdit,
  onUpdateStock,
}: ProductDetailModalProps) => {
  if (!product) return null;

  const formatPrice = (price: number) => {
    return price.toLocaleString('id-ID');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Produk"
      subtitle="Berikut adalah detail dari produk yang dipilih."
      maxWidth="2xl"
    >
      <div className="p-6">
        <div className="flex gap-8">
          {/* Left Side - Product Image */}
          <div className="w-72 flex-shrink-0">
            <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square shadow-sm">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-7xl mb-2">📦</div>
                    <p className="text-sm text-gray-400">No image</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Product Details */}
          <div className="flex-1 min-w-0">
            <div className="space-y-5">
              {/* Nama Produk & Kategori */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                    Nama Produk
                  </label>
                  <p className="text-base font-semibold text-gray-900 leading-tight">
                    {product.name}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                    Kategori Produk
                  </label>
                  <p className="text-base font-semibold text-gray-900 leading-tight">
                    {product.category?.name || '-'}
                  </p>
                </div>
              </div>

              {/* Deskripsi Produk */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                  Deskripsi Produk
                </label>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {product.description || '-'}
                </p>
              </div>

              {/* Harga Satuan & Stok */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                    Harga Satuan
                  </label>
                  <p className="text-2xl font-bold text-gray-900">
                    Rp {formatPrice(product.price)}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                    Stok Saat Ini
                  </label>
                  <div className="flex items-baseline gap-3">
                    <p className="text-2xl font-bold text-gray-900">
                      {product.stock} <span className="text-base font-normal text-gray-500">Unit</span>
                    </p>
                    <button
                      onClick={() => onUpdateStock(product)}
                      className="text-orange-500 hover:text-orange-600 font-semibold text-sm transition-colors underline decoration-2 underline-offset-2"
                    >
                      Perbaharui
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Produk */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Status Produk
                </label>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                  <Check size={16} className="text-green-600" />
                  <span className="text-sm text-green-700 font-medium">Aktif</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Tutup
          </button>
          <button
            onClick={() => onEdit(product)}
            className="px-6 py-2.5 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 font-medium shadow-sm"
          >
            <Pencil size={18} />
            Edit Produk
          </button>
        </div>
      </div>
    </Modal>
  );
};
