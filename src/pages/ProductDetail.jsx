// src/pages/ProductDetail.jsx

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Star,
  Truck,
  Shield,
  Package,
  Clock,
  MapPin,
  ThumbsUp,
  MessageSquare,
  ArrowLeft
} from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { useAuth } from '@/hooks/useAuth'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { formatCurrency } from '@/utils/formatters'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addItem } = useCart()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    loadProduct()
  }, [slug])

  const loadProduct = async () => {
    setLoading(true)
    try {
      // Mock product data - replace with actual API call
      const mockProduct = {
        id: slug,
        slug: slug,
        name: 'Fresh Red Apple',
        description: 'Premium quality fresh red apples, handpicked from the best orchards. Rich in vitamins and perfect for a healthy snack.',
        longDescription: 'Our fresh red apples are carefully selected from premium orchards to ensure the highest quality. Each apple is handpicked at peak ripeness to deliver the perfect balance of sweetness and crunch. Rich in dietary fiber, vitamin C, and various antioxidants, these apples are not only delicious but also incredibly nutritious. Perfect for eating fresh, adding to salads, or baking your favorite apple recipes.',
        category: 'Fruits',
        price: 180,
        comparePrice: 220,
        discount: 18,
        images: [
          'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800',
          'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=800',
          'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800'
        ],
        stock: 50,
        unit: 'kg',
        minOrder: 1,
        maxOrder: 10,
        rating: 4.5,
        reviewCount: 128,
        featured: true,
        tags: ['Fresh', 'Organic', 'Local'],
        nutritionFacts: {
          calories: 52,
          protein: '0.3g',
          carbs: '14g',
          fiber: '2.4g',
          vitaminC: '14%'
        }
      }
      
      setProduct(mockProduct)
      setSelectedImage(0)
    } catch (error) {
      console.error('Error loading product:', error)
      toast.error('Failed to load product details')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
      stock: product.stock,
      unit: product.unit
    })
    
    toast.success(`${quantity} ${product.unit} added to cart!`)
  }

  const handleWishlistToggle = () => {
    if (!user) {
      navigate('/login')
      return
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast.success('Removed from wishlist')
    } else {
      addToWishlist(product)
      toast.success('Added to wishlist')
    }
  }

  const incrementQuantity = () => {
    if (quantity < product.maxOrder) {
      setQuantity(q => q + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > product.minOrder) {
      setQuantity(q => q - 1)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600 font-medium">Loading product...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <div className="text-center">
            <Package className="w-24 h-24 text-neutral-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Product Not Found</h2>
            <p className="text-neutral-600 mb-6">The product you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/shop')} variant="primary">
              Back to Shop
            </Button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-neutral-50">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm mb-6">
            <Link to="/" className="text-neutral-500 hover:text-orange-500 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
            <Link to="/shop" className="text-neutral-500 hover:text-orange-500 transition-colors">
              Shop
            </Link>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
            <Link to={`/category/${product.category}`} className="text-neutral-500 hover:text-orange-500 transition-colors">
              {product.category}
            </Link>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
            <span className="text-neutral-900 font-semibold">{product.name}</span>
          </nav>

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-neutral-600 hover:text-orange-500 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back</span>
          </button>

          {/* Product Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Image Gallery */}
            <div>
              <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100">
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-4 left-4">
                      <Badge variant="error" className="text-sm font-bold">
                        {product.discount}% OFF
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-1 aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? 'border-orange-500 scale-105'
                        : 'border-neutral-200 hover:border-orange-300'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-black text-neutral-900 mb-2">
                      {product.name}
                    </h1>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(product.rating)
                                ? 'fill-orange-500 text-orange-500'
                                : 'text-neutral-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-neutral-600 font-medium">
                        {product.rating} ({product.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleWishlistToggle}
                    className={`p-3 rounded-full transition-all ${
                      isInWishlist(product.id)
                        ? 'bg-orange-100 text-orange-500'
                        : 'bg-neutral-100 text-neutral-400 hover:bg-orange-50 hover:text-orange-500'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-4xl font-black text-orange-500">
                    {formatCurrency(product.price)}
                  </span>
                  {product.comparePrice && (
                    <span className="text-xl text-neutral-400 line-through font-medium">
                      {formatCurrency(product.comparePrice)}
                    </span>
                  )}
                  <span className="text-sm text-neutral-600">/ {product.unit}</span>
                </div>

                {/* Short Description */}
                <p className="text-neutral-600 mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-neutral-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-neutral-200 rounded-xl">
                      <button
                        onClick={decrementQuantity}
                        disabled={quantity <= product.minOrder}
                        className="p-3 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="px-6 font-bold text-lg">{quantity}</span>
                      <button
                        onClick={incrementQuantity}
                        disabled={quantity >= product.maxOrder}
                        className="p-3 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <span className="text-neutral-600">
                      {product.stock > 0 ? `${product.stock} ${product.unit} available` : 'Out of stock'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="h-14 text-lg font-bold"
                    variant="primary"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={() => {
                      handleAddToCart()
                      navigate('/checkout')
                    }}
                    disabled={product.stock === 0}
                    className="h-14 text-lg font-bold"
                    variant="secondary"
                  >
                    Buy Now
                  </Button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Truck className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900 text-sm">1 Hour Delivery</p>
                      <p className="text-xs text-neutral-500">Lightning fast</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Shield className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900 text-sm">Quality Assured</p>
                      <p className="text-xs text-neutral-500">100% Fresh</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm mb-12">
            <div className="flex gap-6 border-b border-neutral-200 mb-6">
              {['description', 'reviews', 'nutrition'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 font-bold capitalize transition-colors relative ${
                    activeTab === tab
                      ? 'text-orange-500'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                    />
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'description' && (
                <motion.div
                  key="description"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <p className="text-neutral-600 leading-relaxed">{product.longDescription}</p>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <p className="text-neutral-500 text-center py-8">No reviews yet. Be the first to review!</p>
                </motion.div>
              )}

              {activeTab === 'nutrition' && (
                <motion.div
                  key="nutrition"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Object.entries(product.nutritionFacts).map(([key, value]) => (
                      <div key={key} className="text-center p-4 bg-neutral-50 rounded-xl">
                        <p className="text-2xl font-black text-orange-500 mb-1">{value}</p>
                        <p className="text-sm font-bold text-neutral-600 capitalize">{key}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}