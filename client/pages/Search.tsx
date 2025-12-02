import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search as SearchIcon,
  X,
  Star,
  Heart,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: number;
  name_en: string;
  name_fa: string;
  price: number;
  original_price?: number;
  rating: number;
  review_count: number;
  image_url: string;
  is_bestseller: boolean;
  brand: string;
  category_name_en?: string;
  category_name_fa?: string;
  available_colors?: string[];
  available_sizes?: string[];
  material?: string;
}

export default function Search() {
  const { language, dir } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [liked, setLiked] = useState<Set<number>>(new Set());

  // Filters
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set());
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set());
  const [selectedMaterials, setSelectedMaterials] = useState<Set<string>>(new Set());
  const [bestsellerOnly, setBestsellerOnly] = useState(false);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = [
    { name: language === 'fa' ? 'سیاه' : 'Black', hex: '#000000' },
    { name: language === 'fa' ? 'سفید' : 'White', hex: '#FFFFFF' },
    { name: language === 'fa' ? 'خاکستری' : 'Gray', hex: '#9CA3AF' },
    { name: language === 'fa' ? 'نیلی' : 'Navy', hex: '#001F3F' },
    { name: language === 'fa' ? 'قرمز' : 'Red', hex: '#EF4444' },
    { name: language === 'fa' ? 'آبی' : 'Blue', hex: '#3B82F6' }
  ];
  const materials = [
    language === 'fa' ? 'پنبه ۱۰۰%' : '100% Cotton',
    language === 'fa' ? 'پلی استر' : 'Polyester',
    language === 'fa' ? 'سوت' : 'Linen',
    language === 'fa' ? 'چرم' : 'Leather'
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?limit=20');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const nameMatch = query === '' ||
      p.name_en.toLowerCase().includes(query.toLowerCase()) ||
      p.name_fa.includes(query);
    const priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1];
    const bestsellerMatch = !bestsellerOnly || p.is_bestseller;
    return nameMatch && priceMatch && bestsellerMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
      default:
        return 0;
    }
  });

  const handleLike = (id: number) => {
    const newLiked = new Set(liked);
    if (newLiked.has(id)) {
      newLiked.delete(id);
    } else {
      newLiked.add(id);
    }
    setLiked(newLiked);
  };

  const toggleSize = (size: string) => {
    const newSizes = new Set(selectedSizes);
    if (newSizes.has(size)) {
      newSizes.delete(size);
    } else {
      newSizes.add(size);
    }
    setSelectedSizes(newSizes);
  };

  const toggleColor = (colorName: string) => {
    const newColors = new Set(selectedColors);
    if (newColors.has(colorName)) {
      newColors.delete(colorName);
    } else {
      newColors.add(colorName);
    }
    setSelectedColors(newColors);
  };

  const toggleMaterial = (material: string) => {
    const newMaterials = new Set(selectedMaterials);
    if (newMaterials.has(material)) {
      newMaterials.delete(material);
    } else {
      newMaterials.add(material);
    }
    setSelectedMaterials(newMaterials);
  };

  const hasActiveFilters = selectedSizes.size > 0 || selectedColors.size > 0 || selectedMaterials.size > 0 || bestsellerOnly;

  return (
    <div className="min-h-screen bg-white" dir={dir}>
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-h2 text-gray-900 mb-6">{language === 'fa' ? 'جستجو' : 'Search'}</h1>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <SearchIcon className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`} />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={language === 'fa' ? 'جستجو در محصولات...' : 'Search products...'}
              className={`${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 border-2 border-gray-200 focus:border-gray-900 rounded-lg`}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className={`absolute ${dir === 'rtl' ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600`}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {(isFilterOpen || window.innerWidth >= 1024) && (
              <motion.div
                initial={{ opacity: 0, x: dir === 'rtl' ? 300 : -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir === 'rtl' ? 300 : -300 }}
                className={`${isFilterOpen ? 'fixed inset-0 z-50 bg-black/50 lg:relative lg:bg-transparent' : 'hidden lg:block'}`}
              >
                {isFilterOpen && (
                  <div className="absolute inset-0 lg:hidden" onClick={() => setIsFilterOpen(false)} />
                )}
                <div className={`${isFilterOpen ? 'absolute right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto' : ''} lg:relative lg:shadow-none lg:w-80`}>
                  <div className="p-6 space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-h3 text-gray-900 flex items-center gap-2">
                        <SlidersHorizontal className="w-5 h-5" />
                        {language === 'fa' ? 'فیلترها' : 'Filters'}
                      </h3>
                      {isFilterOpen && (
                        <button
                          onClick={() => setIsFilterOpen(false)}
                          className="lg:hidden"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    {/* Price Range */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">{language === 'fa' ? 'قیمت' : 'Price'}</h4>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        min={0}
                        max={1000}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>

                    {/* Size Filter */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">{language === 'fa' ? 'اندازه' : 'Size'}</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {sizes.map((size) => (
                          <motion.button
                            key={size}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => toggleSize(size)}
                            className={`py-2 px-3 rounded-lg border-2 font-medium transition-all text-sm ${
                              selectedSizes.has(size)
                                ? 'border-gray-900 bg-gray-900 text-white'
                                : 'border-gray-300 text-gray-900 hover:border-gray-600'
                            }`}
                          >
                            {size}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Color Filter */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">{language === 'fa' ? 'رنگ' : 'Color'}</h4>
                      <div className="space-y-2">
                        {colors.map((color) => (
                          <motion.button
                            key={color.hex}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => toggleColor(color.name)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                              selectedColors.has(color.name)
                                ? 'border-gray-900 bg-gray-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div
                              className="w-6 h-6 rounded-full border-2 border-gray-300"
                              style={{ backgroundColor: color.hex }}
                            />
                            <span className="text-sm text-gray-900">{color.name}</span>
                            {selectedColors.has(color.name) && (
                              <span className="ml-auto text-gray-600">✓</span>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Material Filter */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">{language === 'fa' ? 'پارچه' : 'Material'}</h4>
                      <div className="space-y-2">
                        {materials.map((material) => (
                          <label key={material} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <Checkbox
                              checked={selectedMaterials.has(material)}
                              onCheckedChange={() => toggleMaterial(material)}
                            />
                            <span className="text-sm text-gray-900">{material}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Bestsellers */}
                    <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer border-t border-gray-200 pt-6">
                      <Checkbox
                        checked={bestsellerOnly}
                        onCheckedChange={(checked) => setBestsellerOnly(!!checked)}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {language === 'fa' ? 'فقط پرفروش‌ها' : 'Bestsellers Only'}
                      </span>
                    </label>

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        className="w-full border-gray-900 text-gray-900 hover:bg-gray-100"
                        onClick={() => {
                          setSelectedSizes(new Set());
                          setSelectedColors(new Set());
                          setSelectedMaterials(new Set());
                          setBestsellerOnly(false);
                        }}
                      >
                        {language === 'fa' ? 'پاک کردن فیلترها' : 'Clear Filters'}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center mb-8 flex-wrap gap-4"
            >
              <p className="text-gray-600">
                {loading
                  ? language === 'fa' ? 'در حال بارگذاری...' : 'Loading...'
                  : language === 'fa'
                    ? `${sortedProducts.length} محصول یافت شد`
                    : `${sortedProducts.length} products found`}
              </p>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">
                      {language === 'fa' ? 'جدیدترین' : 'Newest'}
                    </SelectItem>
                    <SelectItem value="price-low">
                      {language === 'fa' ? 'قیمت: کم به زیاد' : 'Price: Low to High'}
                    </SelectItem>
                    <SelectItem value="price-high">
                      {language === 'fa' ? 'قیمت: زیاد به کم' : 'Price: High to Low'}
                    </SelectItem>
                    <SelectItem value="rating">
                      {language === 'fa' ? 'بیشترین امتیاز' : 'Highest Rated'}
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Mobile Filter Button */}
                <Button
                  variant="outline"
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden border-gray-900 text-gray-900 hover:bg-gray-100"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {language === 'fa' ? 'نتیجه‌ای یافت نشد' : 'No results found'}
                </h3>
                <p className="text-gray-600">
                  {language === 'fa'
                    ? 'لطفاً فیلترها یا جستجوی خود را تغییر دهید'
                    : 'Try adjusting your filters or search'}
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
              >
                {sortedProducts.map((product, index) => {
                  const productName = language === 'fa' ? product.name_fa : product.name_en;
                  const discount = product.original_price
                    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
                    : 0;

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link to={`/product/${product.id}`} className="block group">
                        <div className="relative mb-3 bg-gray-100 rounded-lg aspect-[3/4] overflow-hidden">
                          <motion.img
                            whileHover={{ scale: 1.05 }}
                            src={product.image_url}
                            alt={productName}
                            className="w-full h-full object-cover transition-transform duration-300"
                          />

                          {/* Badges */}
                          {(product.is_bestseller || discount > 0) && (
                            <div className="absolute top-2 left-2 flex gap-2">
                              {product.is_bestseller && (
                                <Badge className="bg-green-500 text-white text-xs">
                                  {language === 'fa' ? 'پرفروش' : 'Best'}
                                </Badge>
                              )}
                              {discount > 0 && (
                                <Badge className="bg-red-500 text-white text-xs">
                                  -{discount}%
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Like Button */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.preventDefault();
                              handleLike(product.id);
                            }}
                            className="absolute top-2 right-2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                          >
                            <Heart
                              className={`w-5 h-5 ${
                                liked.has(product.id)
                                  ? 'fill-red-500 text-red-500'
                                  : 'text-gray-600'
                              }`}
                            />
                          </motion.button>
                        </div>
                      </Link>

                      <div className="space-y-2">
                        {/* Product Name */}
                        <Link to={`/product/${product.id}`}>
                          <h3 className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors line-clamp-2">
                            {productName}
                          </h3>
                        </Link>

                        {/* Rating */}
                        <div className="flex items-center gap-1">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(product.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">({product.review_count})</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-gray-900">${product.price}</span>
                          {product.original_price && (
                            <span className="text-xs text-gray-500 line-through">
                              ${product.original_price}
                            </span>
                          )}
                        </div>

                        {/* Available Colors */}
                        {product.available_colors && product.available_colors.length > 0 && (
                          <div className="flex gap-1 pt-1">
                            {product.available_colors.slice(0, 3).map((color, i) => (
                              <div
                                key={i}
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                            {product.available_colors.length > 3 && (
                              <span className="text-xs text-gray-500">+{product.available_colors.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
