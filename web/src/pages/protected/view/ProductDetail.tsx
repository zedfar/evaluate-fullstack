import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star, Minus, Plus, ArrowLeft, Loader2 } from 'lucide-react';
import { productService } from '@/services/productService'; // Sesuaikan dengan path API Anda

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getById(id!);
        setProduct(data);
      } catch (err: any) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID').format(price);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleBuyProduct = () => {
    console.log('Buying product:', { productId: id, quantity });
    // Implement buy logic - misalnya redirect ke checkout
    // navigate(`/checkout?productId=${id}&quantity=${quantity}`);
  };

  const calculateDiscount = (originalPrice: number, currentPrice: number) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-[60px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-[60px]">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900 mb-2">
            {error || 'Product not found'}
          </p>
          <button
            onClick={() => navigate('/home')}
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            ← Kembali ke Katalog
          </button>
        </div>
      </div>
    );
  }

  // Product images - gunakan image dari API atau fallback
  const productImages = product.images || [
    product.image,
    product.image,
    product.image,
    product.image,
  ].filter(Boolean);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-20 pt-[80px] pb-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Kembali</span>
        </button>

        {/* Product Section */}
        <div className="flex flex-col lg:flex-row gap-5 mb-10">
          {/* Image Gallery */}
          <div className="flex flex-col gap-5 w-full lg:w-[414px]">
            {/* Main Image */}
            <div className="relative w-full aspect-[414/378] rounded-xl overflow-hidden bg-gray-100">
              <img
                src={product.image_url || 'https://picsum.photos/seed/book/600/400'}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-product.png';
                }}
              />
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="flex gap-3">
                {productImages.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-1 aspect-[94.5/86] rounded-xl overflow-hidden bg-gray-100 transition-all ${
                      selectedImage === index
                        ? 'ring-2 ring-orange-500'
                        : 'hover:opacity-80'
                    }`}
                  >
                    <img
                      src={image || '/placeholder-product.png'}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-product.png';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex flex-col gap-10">
              {/* Product Details */}
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-5">
                  {/* Title & Rating */}
                  <div className="flex flex-col gap-3">
                    <h1 className="text-2xl font-medium text-black leading-[1.5]">
                      {product.name}
                    </h1>
                    
                    <div className="flex items-center gap-2">
                      {/* Rating */}
                      {product.rating && (
                        <>
                          <div className="flex items-center gap-1">
                            <span className="text-base font-normal text-gray-900">
                              {product.rating}
                            </span>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={`${
                                  i < Math.floor(product.rating)
                                    ? 'fill-gray-900 text-gray-900'
                                    : i < product.rating
                                    ? 'fill-gray-900 text-gray-900'
                                    : 'fill-none text-gray-900'
                                }`}
                              />
                            ))}
                          </div>
                          
                          <div className="w-1 h-1 rounded-full bg-gray-200" />
                        </>
                      )}
                      
                      {product.sold && (
                        <span className="text-base font-normal text-gray-900">
                          {product.sold} Terjual
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-[32px] font-semibold text-orange-500 leading-[1.5]">
                      Rp {formatPrice(product.price)}
                    </span>
                    
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="flex items-center">
                        <div className="bg-orange-100 px-1.5 py-0.5 rounded-l flex items-center">
                          <span className="text-sm font-medium text-orange-500">
                            -{calculateDiscount(product.originalPrice, product.price)}%
                          </span>
                        </div>
                        <div className="w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-l-[8px] border-l-orange-100" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Category */}
                {product.category && (
                  <div className="flex gap-5">
                    <span className="text-base font-normal text-gray-900 w-40">
                      Kategori
                    </span>
                    <span className="text-base font-medium text-gray-900">
                      {product.category.name || product.category}
                    </span>
                  </div>
                )}

                {/* Quantity */}
                <div className="flex gap-5">
                  <span className="text-base font-normal text-gray-900 w-40">
                    Kuantitas
                  </span>
                  <div className="flex items-center gap-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center border-r border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus size={20} />
                      </button>
                      
                      <div className="w-15 h-10 flex items-center justify-center border-r border-gray-200 px-3">
                        <span className="text-base font-normal text-gray-900">
                          {quantity}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock}
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus size={20} />
                      </button>
                    </div>

                    {/* Stock Badge */}
                    {product.stock > 0 ? (
                      <div className="bg-green-50 px-2 py-1 rounded-lg">
                        <span className="text-sm font-medium text-green-600">
                          Tersedia ({product.stock} stok)
                        </span>
                      </div>
                    ) : (
                      <div className="bg-red-50 px-2 py-1 rounded-lg">
                        <span className="text-sm font-medium text-red-600">
                          Stok Habis
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Buy Button */}
              <button
                onClick={handleBuyProduct}
                disabled={product.stock <= 0}
                className="w-full h-10 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {product.stock > 0 ? 'Beli Produk' : 'Stok Habis'}
              </button>
            </div>
          </div>
        </div>

        {/* Description Section */}
        {product.description && (
          <div className="flex flex-col">
            {/* Header */}
            <div className="bg-gray-50 px-4 py-2 rounded-xl">
              <h2 className="text-xl font-semibold text-black leading-[1.5]">
                Deskripsi Produk
              </h2>
            </div>

            {/* Content */}
            <div className="px-4 pt-4 pb-3">
              <div className="text-base font-normal text-black">
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};