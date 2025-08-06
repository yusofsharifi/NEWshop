import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Zap, 
  Shield, 
  Truck, 
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Check,
  Eye,
  MessageCircle,
  ThumbsUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: number;
  name_en: string;
  name_fa: string;
  description_en: string;
  description_fa: string;
  specifications_en: string;
  specifications_fa: string;
  price: number;
  original_price?: number;
  stock_quantity: number;
  sku: string;
  brand: string;
  rating: number;
  review_count: number;
  image_url: string;
  images?: string;
  is_bestseller: boolean;
  is_featured: boolean;
  category?: {
    name_en: string;
    name_fa: string;
    slug: string;
  };
}

interface Review {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export default function ProductDetail() {
  const { id } = useParams();
  const { t, dir, language } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isLiked, setIsLiked] = useState(false);
  const [showFullSpecs, setShowFullSpecs] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        setProduct(data);
        
        // Mock reviews data
        setReviews([
          {
            id: 1,
            user_name: language === 'fa' ? 'احمد حسینی' : 'Ahmad Hosseini',
            rating: 5,
            comment: language === 'fa' 
              ? 'محصول فوق‌العاده‌ای است. کیفیت عالی و قیمت مناسب.' 
              : 'Excellent product! Great quality and reasonable price.',
            date: '2024-01-15',
            verified: true
          },
          {
            id: 2,
            user_name: language === 'fa' ? 'مریم کریمی' : 'Maryam Karimi',
            rating: 4,
            comment: language === 'fa' 
              ? 'خیلی راضی هستم. نصب هم آسان بود.' 
              : 'Very satisfied. Installation was easy too.',
            date: '2024-01-10',
            verified: true
          },
          {
            id: 3,
            user_name: language === 'fa' ? 'علی محمدی' : 'Ali Mohammadi',
            rating: 5,
            comment: language === 'fa' 
              ? 'بهترین خرید امسالم. توصیه می‌کنم.' 
              : 'Best purchase this year. Highly recommend.',
            date: '2024-01-05',
            verified: false
          }
        ]);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, language]);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const imageVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">{t('common.loading')}</p>
        </motion.div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const productName = language === 'fa' ? product.name_fa : product.name_en;
  const productDescription = language === 'fa' ? product.description_fa : product.description_en;
  const productSpecs = language === 'fa' ? product.specifications_fa : product.specifications_en;
  const categoryName = language === 'fa' ? product.category?.name_fa : product.category?.name_en;

  const discount = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50" dir={dir}>
      {/* Floating particles background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-20"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 100
            }}
            animate={{
              y: -100,
              x: Math.random() * window.innerWidth
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        {/* Breadcrumb */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-3 text-sm">
              <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">
                {language === 'fa' ? 'خانه' : 'Home'}
              </Link>
              <span className="text-gray-400">/</span>
              <Link to="/products" className="text-blue-600 hover:text-blue-800 transition-colors">
                {t('nav.products')}
              </Link>
              <span className="text-gray-400">/</span>
              <Link to={`/category/${product.category?.slug}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                {categoryName}
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600 truncate">{productName}</span>
            </nav>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="relative group">
                <motion.div
                  variants={imageVariants}
                  whileHover="hover"
                  className="relative overflow-hidden rounded-2xl bg-white shadow-2xl"
                >
                  <img
                    src={product.image_url}
                    alt={productName}
                    className="w-full h-96 object-cover"
                  />
                  
                  {/* Floating badges */}
                  <div className="absolute top-4 left-4 space-y-2">
                    {product.is_bestseller && (
                      <motion.div
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.5, type: "spring" }}
                      >
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
                          {language === 'fa' ? 'پرفروش' : 'Bestseller'}
                        </Badge>
                      </motion.div>
                    )}
                    {discount > 0 && (
                      <motion.div
                        initial={{ scale: 0, rotate: 10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.7, type: "spring" }}
                      >
                        <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg">
                          {discount}% {language === 'fa' ? 'تخفیف' : 'OFF'}
                        </Badge>
                      </motion.div>
                    )}
                  </div>

                  {/* Floating action buttons */}
                  <div className="absolute top-4 right-4 space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsLiked(!isLiked)}
                      className={`w-12 h-12 rounded-full backdrop-blur-md shadow-lg flex items-center justify-center transition-all ${
                        isLiked 
                          ? 'bg-red-500 text-white' 
                          : 'bg-white/80 text-gray-600 hover:bg-white'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center text-gray-600 hover:bg-white transition-all"
                    >
                      <Share2 className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {/* Glass morphism overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>

                {/* Thumbnail images */}
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {[product.image_url, product.image_url, product.image_url, product.image_url].map((img, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImage(index)}
                      className={`relative overflow-hidden rounded-lg aspect-square ${
                        selectedImage === index 
                          ? 'ring-2 ring-blue-500 ring-offset-2' 
                          : 'hover:ring-2 hover:ring-blue-300 hover:ring-offset-2'
                      } transition-all`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div variants={itemVariants} className="space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    {product.brand}
                  </Badge>
                  <Badge variant="outline">
                    SKU: {product.sku}
                  </Badge>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {productName}
                </h1>

                {/* Rating */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center space-x-4"
                >
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
                      >
                        <Star 
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      </motion.div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.review_count} {language === 'fa' ? 'نظر' : 'reviews'})
                  </span>
                </motion.div>

                {/* Price */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center space-x-4"
                >
                  <span className="text-4xl font-bold text-gray-900">
                    ${product.price}
                  </span>
                  {product.original_price && (
                    <span className="text-xl text-gray-500 line-through">
                      ${product.original_price}
                    </span>
                  )}
                  {discount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7, type: "spring" }}
                      className="text-lg font-semibold text-green-600"
                    >
                      {language === 'fa' ? `${discount}% صرفه‌جویی` : `Save ${discount}%`}
                    </motion.span>
                  )}
                </motion.div>

                {/* Stock status */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center space-x-2"
                >
                  <div className={`w-3 h-3 rounded-full ${
                    product.stock_quantity > 10 ? 'bg-green-500' : 
                    product.stock_quantity > 0 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <span className={`font-medium ${
                    product.stock_quantity > 10 ? 'text-green-600' : 
                    product.stock_quantity > 0 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {product.stock_quantity > 10 
                      ? (language === 'fa' ? 'موجود در انبار' : 'In Stock') 
                      : product.stock_quantity > 0 
                        ? (language === 'fa' ? `فقط ${product.stock_quantity} عدد باقی مانده` : `Only ${product.stock_quantity} left`)
                        : (language === 'fa' ? 'ناموجود' : 'Out of Stock')
                    }
                  </span>
                </motion.div>
              </div>

              {/* Quick description */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100"
              >
                <p className="text-gray-700 leading-relaxed">
                  {productDescription}
                </p>
              </motion.div>

              {/* Quantity and Add to Cart */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-700">
                    {language === 'fa' ? 'تعداد:' : 'Quantity:'}
                  </span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </motion.button>
                    <span className="px-4 py-2 min-w-[3rem] text-center font-semibold">
                      {quantity}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      onClick={handleAddToCart}
                      disabled={product.stock_quantity === 0}
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
                    >
                      <AnimatePresence mode="wait">
                        {addedToCart ? (
                          <motion.div
                            key="added"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="flex items-center space-x-2"
                          >
                            <Check className="w-5 h-5" />
                            <span>{language === 'fa' ? 'افزوده شد!' : 'Added!'}</span>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="add"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center space-x-2"
                          >
                            <ShoppingCart className="w-5 h-5" />
                            <span>{language === 'fa' ? 'افزودن به سبد' : 'Add to Cart'}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      className="h-14 px-8 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all"
                    >
                      {language === 'fa' ? 'خرید سریع' : 'Buy Now'}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>

              {/* Features */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                {[
                  {
                    icon: Truck,
                    title: language === 'fa' ? 'ارسال رایگان' : 'Free Shipping',
                    desc: language === 'fa' ? 'برای سفارشات بالای $500' : 'On orders over $500'
                  },
                  {
                    icon: Shield,
                    title: language === 'fa' ? 'ضمانت کیفیت' : 'Quality Guarantee',
                    desc: language === 'fa' ? 'ضمانت 2 ساله' : '2 year warranty'
                  },
                  {
                    icon: Zap,
                    title: language === 'fa' ? 'نصب سریع' : 'Quick Install',
                    desc: language === 'fa' ? 'راهنمای آسان' : 'Easy setup guide'
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm"
                  >
                    <feature.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Tabs Section */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-16"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-14 bg-white rounded-xl shadow-lg">
                <TabsTrigger 
                  value="description" 
                  className="text-lg font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all"
                >
                  {language === 'fa' ? 'توضیحات' : 'Description'}
                </TabsTrigger>
                <TabsTrigger 
                  value="specifications"
                  className="text-lg font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all"
                >
                  {language === 'fa' ? 'مشخصات فنی' : 'Specifications'}
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews"
                  className="text-lg font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all"
                >
                  {language === 'fa' ? 'نظرات' : 'Reviews'} ({reviews.length})
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mt-8"
                >
                  <TabsContent value="description" className="space-y-6">
                    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                          {language === 'fa' ? 'درباره این محصول' : 'About This Product'}
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-lg">
                          {productDescription}
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="specifications" className="space-y-6">
                    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">
                          {language === 'fa' ? 'مشخصات فنی' : 'Technical Specifications'}
                        </h3>
                        <div className="space-y-4">
                          {productSpecs.split('\n').slice(0, showFullSpecs ? undefined : 3).map((spec, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                            >
                              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{spec}</span>
                            </motion.div>
                          ))}
                          
                          {productSpecs.split('\n').length > 3 && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setShowFullSpecs(!showFullSpecs)}
                              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                            >
                              <span>
                                {showFullSpecs 
                                  ? (language === 'fa' ? 'نمایش کمتر' : 'Show Less')
                                  : (language === 'fa' ? 'نمایش بیشتر' : 'Show More')
                                }
                              </span>
                              {showFullSpecs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </motion.button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="reviews" className="space-y-6">
                    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-8">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-2xl font-bold text-gray-900">
                            {language === 'fa' ? 'نظرات کاربران' : 'Customer Reviews'}
                          </h3>
                          <Button variant="outline">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            {language === 'fa' ? 'افزودن نظر' : 'Add Review'}
                          </Button>
                        </div>

                        <div className="space-y-6">
                          {reviews.map((review, index) => (
                            <motion.div
                              key={review.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-6 bg-gray-50 rounded-xl"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    {review.user_name.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <h4 className="font-semibold text-gray-900">{review.user_name}</h4>
                                      {review.verified && (
                                        <Badge variant="outline" className="text-green-600 border-green-600">
                                          <Check className="w-3 h-3 mr-1" />
                                          {language === 'fa' ? 'تایید شده' : 'Verified'}
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-1 mt-1">
                                      {[...Array(5)].map((_, i) => (
                                        <Star 
                                          key={i}
                                          className={`w-4 h-4 ${
                                            i < review.rating 
                                              ? 'text-yellow-400 fill-current' 
                                              : 'text-gray-300'
                                          }`} 
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <span className="text-sm text-gray-500">{review.date}</span>
                              </div>
                              <p className="text-gray-700 mb-3">{review.comment}</p>
                              <div className="flex items-center space-x-4">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors"
                                >
                                  <ThumbsUp className="w-4 h-4" />
                                  <span className="text-sm">
                                    {language === 'fa' ? 'مفید' : 'Helpful'}
                                  </span>
                                </motion.button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
