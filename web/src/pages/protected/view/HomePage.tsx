import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '@/services/productService';
import type { Product } from '@/types/product.types';
import { Search, Loader2, ShoppingBag } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const formatPrice = (price: number) => {
    return price.toLocaleString('id-ID');
  };

  const getStockStatusColor = (stockStatus?: 'red' | 'yellow' | 'green'): string => {
    switch (stockStatus) {
      case 'red':
        return 'text-red-600';
      case 'yellow':
        return 'text-orange-600';
      case 'green':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const fetchProducts = async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const params = {
        search: searchQuery || undefined,
        sort_by: 'created_at' as const,
        order: 'desc' as const,
        limit: 12,
      };

      const response = await productService.getAll(params, { signal });
      setProducts(response.data);
    } catch (err: any) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        return;
      }
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Initial load
  useEffect(() => {
    const abortController = new AbortController();
    fetchProducts(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [searchQuery]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HERO SECTION */}
      <div className="relative h-96 bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-center text-white px-4">
        <div className="absolute inset-0 bg-black opacity-10"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Katalog Produk</h1>
          <p className="text-orange-50 mb-8 text-lg">
            Temukan produk berkualitas dengan harga terbaik
          </p>

          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              className="w-full h-14 pl-14 pr-6 rounded-full text-gray-900 focus:ring-2 focus:ring-orange-300 focus:outline-none shadow-lg"
              placeholder="Cari produk..."
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && searchInput !== searchQuery && (
              <div className="absolute right-5 top-1/2 -translate-y-1/2">
                <Loader2 size={20} className="animate-spin text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PRODUCTS SECTION */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {searchQuery ? `Hasil pencarian "${searchQuery}"` : 'Semua Produk'}
              </h2>
              <p className="text-gray-600">
                {loading ? 'Memuat...' : `${products.length} produk ditemukan`}
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Memuat produk...</p>
              </div>
            </div>
          ) : products.length > 0 ? (
            /* GRID PRODUCTS */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden border border-gray-200 cursor-pointer hover:scale-[1.02] duration-200"
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                    {true ? (
                      <img
                        src={product.image_url || "https://picsum.photos/seed/book/600/400"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ShoppingBag size={64} className="text-gray-300" />
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded">
                        {product.category?.name || 'Uncategorized'}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                      {product.name}
                    </h3>

                    {product.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Harga</p>
                        <p className="text-xl font-bold text-orange-600">
                          Rp {formatPrice(product.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Stok</p>
                        <p className={`font-semibold ${getStockStatusColor(product.stock_status)}`}>
                          {product.stock} unit
                        </p>
                      </div>
                    </div>

                    {/* Stock Status Badge */}
                    <div className="pt-3 border-t border-gray-100">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        product.stock_status === 'green'
                          ? 'bg-green-100 text-green-700'
                          : product.stock_status === 'yellow'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {product.stock_status === 'green'
                          ? 'Tersedia'
                          : product.stock_status === 'yellow'
                          ? 'Stok Terbatas'
                          : 'Habis'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20">
              <ShoppingBag size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tidak ada produk ditemukan
              </h3>
              <p className="text-gray-600">
                {searchQuery
                  ? `Tidak ada hasil untuk "${searchQuery}"`
                  : 'Belum ada produk yang tersedia'}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
