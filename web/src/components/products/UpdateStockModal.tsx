import { useState } from 'react';
import { Check, AlertCircle, Loader2, X } from 'lucide-react';
import { productService } from '@/services/productService';
import type { Product } from '@/types/product.types';

interface UpdateStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSuccess: () => void;
}

export const UpdateStockModal = ({
  isOpen,
  onClose,
  product,
  onSuccess,
}: UpdateStockModalProps) => {
  const [stockChange, setStockChange] = useState<number>(0);
  const [stockType, setStockType] = useState<'add' | 'subtract'>('add');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  if (!isOpen || !product) return null;

  const formatPrice = (price: number) => {
    return price.toLocaleString('id-ID');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (stockChange <= 0) {
      setError('Jumlah stok harus lebih dari 0');
      return;
    }

    const newStock = stockType === 'add'
      ? product.stock + stockChange
      : product.stock - stockChange;

    if (newStock < 0) {
      setError('Stok tidak boleh negatif');
      return;
    }

    setSubmitting(true);
    try {
      await productService.update(product.id, {
        stock: newStock,
      });

      // Reset and close
      setStockChange(0);
      setStockType('add');
      setError('');
      onClose();
      onSuccess();
    } catch (err: any) {
      console.error('Error updating stock:', err);
      setError(err.message || 'Gagal mengupdate stok');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setStockChange(0);
    setStockType('add');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Detail Produk</h2>
              <p className="text-sm text-gray-500 mt-1">
                Berikut adalah detail dari produk yang dipilih.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex gap-8">
            {/* Left Side - Product Image */}
            <div className="w-64 flex-shrink-0">
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
                      <div className="text-6xl mb-2">📦</div>
                      <p className="text-xs text-gray-400">No image</p>
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
                    <p className="text-xl font-bold text-gray-900">
                      Rp {formatPrice(product.price)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                      Stok Saat Ini
                    </label>
                    <p className="text-xl font-bold text-gray-900">
                      {product.stock} <span className="text-base font-normal text-gray-500">Unit</span>
                    </p>
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

                {/* Update Stock Section */}
                <form onSubmit={handleSubmit} className="bg-orange-50 border-2 border-orange-200 rounded-xl p-5 mt-6">
                  <label className="block text-sm font-bold text-gray-900 mb-1">
                    Update Stok <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-600 mb-4">
                    Tambah atau kurangi jumlah stok produk
                  </p>

                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-300 rounded-lg text-red-700 mb-4">
                      <AlertCircle size={16} />
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-3 mb-4">
                    {/* Stock Input */}
                    <input
                      type="number"
                      value={stockChange || ''}
                      onChange={(e) => setStockChange(Number(e.target.value))}
                      min="0"
                      placeholder="20"
                      className="w-32 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-lg font-semibold text-center bg-white"
                    />

                    {/* Type Tabs */}
                    <div className="flex flex-1 bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setStockType('add')}
                        className={`flex-1 px-5 py-3 font-semibold text-sm transition-all ${
                          stockType === 'add'
                            ? 'bg-orange-500 text-white'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        Penambahan
                      </button>
                      <button
                        type="button"
                        onClick={() => setStockType('subtract')}
                        className={`flex-1 px-5 py-3 font-semibold text-sm transition-all border-l-2 border-gray-300 ${
                          stockType === 'subtract'
                            ? 'bg-orange-500 text-white'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        Pengurangan
                      </button>
                    </div>
                  </div>

                  {/* Preview */}
                  {stockChange > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 border-2 border-blue-300 rounded-lg">
                      <p className="text-sm text-blue-900 font-medium">
                        Stok baru: <span className="font-bold text-base">
                          {stockType === 'add' ? product.stock + stockChange : product.stock - stockChange} Unit
                        </span>
                        <span className="text-blue-700 ml-1">
                          ({stockType === 'add' ? '+' : '-'}{stockChange})
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
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
                      disabled={submitting || stockChange <= 0}
                      className="flex-1 px-6 py-2.5 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:bg-gray-400 flex items-center justify-center gap-2 font-semibold shadow-sm"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Mengupdate...
                        </>
                      ) : (
                        <>
                          <Check size={18} />
                          Update
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
