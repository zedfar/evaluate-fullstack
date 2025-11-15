import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Loader2, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import type { Product } from '@/types/product.types';
import type { Category } from '@/types/category.types';

export const ProductPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [showFilterMobile, setShowFilterMobile] = useState(false);

  // Filter states
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRangeInput, setPriceRangeInput] = useState<{ min: string; max: string }>({ min: '', max: '' });
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: '', max: '' });
  const [selectedStockStatus, setSelectedStockStatus] = useState<string>('');
  const [sortBy, setSortBy] = useState<'created_at' | 'price' | 'name' | 'satus'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 12;

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAll();
        setCategories(response);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Debounce price range
  useEffect(() => {
    const timer = setTimeout(() => {
      setPriceRange(priceRangeInput);
      setCurrentPage(1); // Reset to first page on price filter change
    }, 800); // Slightly longer delay for price input

    return () => clearTimeout(timer);
  }, [priceRangeInput]);

  // Fetch products
  const fetchProducts = async (signal?: AbortSignal) => {
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setFilterLoading(true);
    }

    try {
      const params: any = {
        search: searchQuery || undefined,
        category_id: selectedCategory || undefined,
        stock_status: selectedStockStatus || undefined,
        sort_by: sortBy,
        order: sortOrder,
        skip: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage,
      };

      // Add price range if set
      if (priceRange.min) params.min_price = parseInt(priceRange.min);
      if (priceRange.max) params.max_price = parseInt(priceRange.max);

      const response = await productService.getAll(params, { signal });
      setProducts(response.data);
      setTotalProducts(response.metadata.total);
      setTotalPages(response.metadata.total_pages);

      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    } catch (err: any) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        return;
      }
      console.error('Error fetching products:', err);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      } else {
        setFilterLoading(false);
      }
    }
  };

  // Fetch products when filters change
  useEffect(() => {
    const abortController = new AbortController();
    fetchProducts(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [searchQuery, selectedCategory, priceRange, selectedStockStatus, sortBy, sortOrder, currentPage]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchInput('');
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRangeInput({ min: '', max: '' });
    setPriceRange({ min: '', max: '' });
    setSelectedStockStatus('');
    setSortBy('created_at');
    setSortOrder('desc');
    setCurrentPage(1);
  };

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

  const hasActiveFilters = selectedCategory || priceRange.min || priceRange.max || selectedStockStatus || searchQuery;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section - Search Header with Background Image */}
      <div className="relative h-[300px] md:h-[350px]">
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
        <div className="relative pt-[60px] h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 w-full">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Jelajahi Semua Produk
              </h1>
              <p className="text-white text-opacity-80 mb-6">
                Temukan produk berkualitas dengan harga terbaik
              </p>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  className="w-full h-12 md:h-14 pl-14 pr-6 rounded-full text-gray-900 focus:ring-2 focus:ring-orange-300 focus:outline-none shadow-lg"
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
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-8">
        <div className="flex gap-6">
          {/* Filter Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filter</h2>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="text-sm text-orange-500 hover:text-orange-600 font-medium"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Kategori
                </label>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                      className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Semua Kategori</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category.id}
                        onChange={() => setSelectedCategory(category.id)}
                        className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Rentang Harga
                </label>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Harga minimum"
                    value={priceRangeInput.min}
                    onChange={(e) => setPriceRangeInput({ ...priceRangeInput, min: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Harga maksimum"
                    value={priceRangeInput.max}
                    onChange={(e) => setPriceRangeInput({ ...priceRangeInput, max: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Stock Status Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Ketersediaan Stok
                </label>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="stock"
                      checked={selectedStockStatus === ''}
                      onChange={() => setSelectedStockStatus('')}
                      className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Semua</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="stock"
                      checked={selectedStockStatus === 'green'}
                      onChange={() => setSelectedStockStatus('green')}
                      className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Tersedia</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="stock"
                      checked={selectedStockStatus === 'yellow'}
                      onChange={() => setSelectedStockStatus('yellow')}
                      className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Terbatas</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="stock"
                      checked={selectedStockStatus === 'red'}
                      onChange={() => setSelectedStockStatus('red')}
                      className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Habis</span>
                  </label>
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Urutkan
                </label>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field as 'created_at' | 'price' | 'name');
                    setSortOrder(order as 'asc' | 'desc');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="created_at-desc">Terbaru</option>
                  <option value="created_at-asc">Terlama</option>
                  <option value="price-asc">Harga Terendah</option>
                  <option value="price-desc">Harga Tertinggi</option>
                  <option value="name-asc">Nama A-Z</option>
                  <option value="name-desc">Nama Z-A</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilterMobile(!showFilterMobile)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <SlidersHorizontal size={18} />
                Filter & Urutkan
              </button>
            </div>

            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                    {searchQuery ? `Hasil pencarian "${searchQuery}"` : 'Semua Produk'}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {filterLoading || loading ? 'Memuat...' : `Menampilkan ${products.length} dari ${totalProducts} produk`}
                  </p>
                </div>
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
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden border border-gray-200 cursor-pointer hover:scale-[1.02] duration-200"
                    >
                      {/* Product Image */}
                      <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                        {product.image_url ? (
                          <img
                            src={product.image_url || 'https://picsum.photos/seed/book/600/400'}
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
                            <p className="font-semibold text-gray-700">
                              {product.stock} unit
                            </p>
                          </div>
                        </div>

                        {/* Stock Status Badge */}
                        <div className="pt-3 border-t border-gray-100">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStockStatusColor(product.stock_status)}`}>
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-200">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Menampilkan <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> sampai{' '}
                          <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalProducts)}</span> dari{' '}
                          <span className="font-medium">{totalProducts}</span> produk
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNumber;
                            if (totalPages <= 5) {
                              pageNumber = i + 1;
                            } else if (currentPage <= 3) {
                              pageNumber = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNumber = totalPages - 4 + i;
                            } else {
                              pageNumber = currentPage - 2 + i;
                            }
                            return (
                              <button
                                key={i}
                                onClick={() => setCurrentPage(pageNumber)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  currentPage === pageNumber
                                    ? 'z-10 bg-orange-50 border-orange-500 text-orange-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          })}
                          <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-20">
                <ShoppingBag size={64} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Tidak ada produk ditemukan
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery
                    ? `Tidak ada hasil untuk "${searchQuery}"`
                    : 'Belum ada produk yang tersedia'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="text-orange-500 hover:text-orange-600 font-medium"
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showFilterMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filter & Urutkan</h2>
                <button
                  onClick={() => setShowFilterMobile(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Same filter content as desktop sidebar */}
              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Kategori
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category-mobile"
                        checked={selectedCategory === ''}
                        onChange={() => setSelectedCategory('')}
                        className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Semua Kategori</span>
                    </label>
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="category-mobile"
                          checked={selectedCategory === category.id}
                          onChange={() => setSelectedCategory(category.id)}
                          className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Rentang Harga
                  </label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Harga minimum"
                      value={priceRangeInput.min}
                      onChange={(e) => setPriceRangeInput({ ...priceRangeInput, min: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Harga maksimum"
                      value={priceRangeInput.max}
                      onChange={(e) => setPriceRangeInput({ ...priceRangeInput, max: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Stock Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Ketersediaan Stok
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="stock-mobile"
                        checked={selectedStockStatus === ''}
                        onChange={() => setSelectedStockStatus('')}
                        className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Semua</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="stock-mobile"
                        checked={selectedStockStatus === 'green'}
                        onChange={() => setSelectedStockStatus('green')}
                        className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Tersedia</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="stock-mobile"
                        checked={selectedStockStatus === 'yellow'}
                        onChange={() => setSelectedStockStatus('yellow')}
                        className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Terbatas</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="stock-mobile"
                        checked={selectedStockStatus === 'red'}
                        onChange={() => setSelectedStockStatus('red')}
                        className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Habis</span>
                    </label>
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Urutkan
                  </label>
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-');
                      setSortBy(field as 'created_at' | 'price' | 'name');
                      setSortOrder(order as 'asc' | 'desc');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="created_at-desc">Terbaru</option>
                    <option value="created_at-asc">Terlama</option>
                    <option value="price-asc">Harga Terendah</option>
                    <option value="price-desc">Harga Tertinggi</option>
                    <option value="name-asc">Nama A-Z</option>
                    <option value="name-desc">Nama Z-A</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleResetFilters}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowFilterMobile(false)}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600"
                >
                  Terapkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
