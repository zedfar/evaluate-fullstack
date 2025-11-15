import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, ShoppingBag } from 'lucide-react';
import { productService } from '@/services/productService';
import type { Product } from '@/types/product.types';

export const HomePageProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch products when search query changes
  useEffect(() => {
    const abortController = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          search: searchQuery || undefined,
          sort_by: 'created_at' as const,
          order: 'desc' as const,
          limit: 8,
        };
        const response = await productService.getAll(params, { signal: abortController.signal });
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

    fetchProducts();

    return () => {
      abortController.abort();
    };
  }, [searchQuery]);

  const handleViewAllProducts = () => {
    navigate('/products');
  };

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section with Background */}
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[460px]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-end justify-center pb-8 md:pb-12 lg:pb-[60px] px-4 md:px-8 lg:px-20 pt-[80px]">
          <div className="w-full max-w-[846px] flex flex-col items-center gap-6 md:gap-8">
            {/* Text */}
            <div className="w-full text-center flex flex-col gap-2">
              <h1 className="text-xl md:text-2xl font-semibold text-white">
                Cari Furnitur Impian
              </h1>
              <p className="text-xs md:text-sm font-normal text-white text-opacity-80">
                Cari furnitur mulai dari meja, lemari, hingga rak disini
              </p>
            </div>

            {/* Search Bar */}
            <div className="w-full flex gap-2 md:gap-3">
              <div className="flex-1 h-12 md:h-[52px] bg-white border border-gray-200 rounded-full flex items-center px-4 md:px-5 pr-3 md:pr-4">
                <input
                  type="text"
                  placeholder="Cari produk"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="flex-1 outline-none text-sm text-gray-900 placeholder-gray-500"
                />
                {searchInput && searchInput !== searchQuery && (
                  <Loader2 size={18} className="animate-spin text-gray-400 ml-2" />
                )}
              </div>
              <button
                disabled={!searchInput.trim()}
                className="w-12 h-12 md:w-[52px] md:h-[52px] bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
              >
                <Search size={20} className="text-white md:w-6 md:h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-6 md:py-8 lg:py-10">
        <div className="flex flex-col gap-5 md:gap-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl md:text-[25px] font-semibold text-gray-900">
                {searchQuery ? `Hasil Pencarian "${searchQuery}"` : 'Rekomendasi'}
              </h2>
              <p className="text-sm font-normal text-gray-600">
                {searchQuery
                  ? `Menampilkan ${products.length} produk`
                  : 'Produk - produk pilihan terbaik dari kami'}
              </p>
            </div>
            {!searchQuery && (
              <button
                onClick={handleViewAllProducts}
                className="h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors w-full sm:w-auto"
              >
                Lihat Semua Produk
              </button>
            )}
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Loading products...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
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
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => handleProductClick(product.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Product Card Component
interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID').format(price);
  };

  const getStockStatusColor = (stockStatus?: 'red' | 'yellow' | 'green'): string => {
    switch (stockStatus) {
      case 'red':
        return 'bg-red-100 text-red-700';
      case 'yellow':
        return 'bg-orange-100 text-orange-700';
      case 'green':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div
      onClick={onClick}
      className="border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
    >
      {/* Product Image */}
      <div className="w-full aspect-[304/180] bg-gray-100 flex items-center justify-center">
        {product.image_url ? (
          <img
            src={product.image_url || 'https://picsum.photos/seed/book/600/400'}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/book/600/400';
            }}
          />
        ) : (
          <ShoppingBag size={48} className="text-gray-300" />
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col justify-between min-h-[163px] p-4 md:p-5">
        {/* Category Badge */}
        <div className="mb-2">
          <span className="inline-block px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded">
            {product.category?.name || 'Uncategorized'}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="text-base font-medium text-black leading-[1.5] line-clamp-2 mb-3">
          {product.name}
        </h3>

        {/* Price & Stock Section */}
        <div className="flex flex-col gap-3">
          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-lg md:text-xl font-semibold text-orange-500">
              Rp {formatPrice(product.price)}
            </span>

            {/* Stock Badge */}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStockStatusColor(product.stock_status)}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              {product.stock_status === 'green'
                ? 'Tersedia'
                : product.stock_status === 'yellow'
                ? 'Terbatas'
                : 'Habis'}
            </span>
          </div>

          {/* Stock Count */}
          <div className="text-sm text-gray-600">
            Stok: <span className="font-medium">{product.stock} unit</span>
          </div>
        </div>
      </div>
    </div>
  );
};