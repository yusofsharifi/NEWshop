import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  User,
  Globe,
  Settings,
  LogOut,
  Shield,
  ChevronDown
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';

interface MenuItem {
  id: number;
  name_en: string;
  name_fa: string;
  url: string;
  target: '_self' | '_blank';
  icon?: string;
  parent_id?: number;
  order: number;
  is_active: boolean;
  is_dropdown: boolean;
  children?: MenuItem[];
}

export default function HeaderNew() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [hoveredMenu, setHoveredMenu] = useState<number | null>(null);
  const { language, setLanguage, t, dir } = useLanguage();
  const { setIsOpen, itemCount } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    const mockData: MenuItem[] = [
      {
        id: 1,
        name_en: 'New Arrivals',
        name_fa: 'محصولات جدید',
        url: '/search?sort=newest',
        target: '_self',
        order: 1,
        is_active: true,
        is_dropdown: false
      },
      {
        id: 2,
        name_en: 'Best Sellers',
        name_fa: 'پر فروش‌ترین‌ها',
        url: '/search?sort=bestseller',
        target: '_self',
        order: 2,
        is_active: true,
        is_dropdown: false
      },
      {
        id: 3,
        name_en: 'Collections',
        name_fa: 'کلکشن‌ها',
        url: '/search',
        target: '_self',
        order: 3,
        is_active: true,
        is_dropdown: false
      },
      {
        id: 4,
        name_en: 'About',
        name_fa: 'درباره ما',
        url: '/about',
        target: '_self',
        order: 4,
        is_active: true,
        is_dropdown: false
      }
    ];
    setMenuItems(mockData);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50" dir={dir}>
      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 md:py-5">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className={`flex items-center ${dir === 'rtl' ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
              <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
                <div className="w-5 h-5 bg-white rounded-sm opacity-80"></div>
              </div>
              <div className={`hidden sm:block ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                <h1 className="text-lg md:text-xl font-bold text-black tracking-tight">
                  {language === 'fa' ? 'لاکچری' : 'LUXURY'}
                </h1>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className={`hidden lg:flex items-center ${dir === 'rtl' ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
            {menuItems
              .filter(item => item.is_active)
              .sort((a, b) => a.order - b.order)
              .map(item => (
                <Link
                  key={item.id}
                  to={item.url}
                  target={item.target}
                  className="text-sm text-gray-700 hover:text-black transition-colors duration-200 font-medium"
                >
                  {language === 'fa' ? item.name_fa : item.name_en}
                </Link>
              ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-xs mx-6 lg:mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder={t('header.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${dir === 'rtl' ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 w-full text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent transition-all`}
                dir={dir}
              />
              <button
                type="submit"
                className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors`}
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right side actions */}
          <div className={`flex items-center ${dir === 'rtl' ? 'space-x-reverse space-x-3 md:space-x-reverse md:space-x-4' : 'space-x-3 md:space-x-4'}`}>
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 md:h-9 md:w-auto md:px-2 text-gray-700 hover:text-black"
                >
                  <Globe className="w-4 h-4" />
                  <span className="hidden md:inline text-xs ml-2">{language === 'fa' ? 'FA' : 'EN'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={dir === 'rtl' ? 'start' : 'end'} className="w-40">
                <DropdownMenuItem onClick={() => setLanguage('en')} className="cursor-pointer">
                  <span className="text-sm">🇺🇸 English</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('fa')} className="cursor-pointer">
                  <span className="text-sm">🇮🇷 فارسی</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden md:flex items-center text-gray-700 hover:text-black transition-colors"
                  >
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-semibold text-gray-700">
                      {user?.username.charAt(0).toUpperCase()}
                    </div>
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={dir === 'rtl' ? 'start' : 'end'} className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-xs font-medium text-gray-600">{user?.username}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="cursor-pointer text-sm">
                      <User className="w-4 h-4 mr-2" />
                      {language === 'fa' ? 'حساب کاربری' : 'My Account'}
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer text-sm">
                        <Shield className="w-4 h-4 mr-2" />
                        {language === 'fa' ? 'مدیریت' : 'Admin'}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="cursor-pointer text-red-600 focus:text-red-600 text-sm"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {language === 'fa' ? 'خروج' : 'Sign Out'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden md:flex h-8 text-xs text-gray-700 hover:text-black"
                  >
                    <User className="w-4 h-4 mr-1" />
                    <span>{language === 'fa' ? 'ورود' : 'Login'}</span>
                  </Button>
                </motion.div>
              </Link>
            )}

            {/* Shopping Cart */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="relative flex items-center text-gray-700 hover:text-black transition-colors"
            >
              <ShoppingCart className="w-5 h-5 md:w-5 md:h-5" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key="cart-badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`absolute -top-2 ${dir === 'rtl' ? '-left-2' : '-right-2'} bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold`}
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden h-8 w-8 p-0"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder={t('header.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${dir === 'rtl' ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 w-full text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent`}
              dir={dir}
            />
            <button
              type="submit"
              className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600`}
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-t border-gray-100"
          >
            <nav className="px-4 py-4 space-y-3 max-w-7xl mx-auto">
              {menuItems
                .filter(item => item.is_active)
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                  <Link
                    key={item.id}
                    to={item.url}
                    target={item.target}
                    className="block py-2 text-gray-700 hover:text-black font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {language === 'fa' ? item.name_fa : item.name_en}
                  </Link>
                ))}

              <div className="pt-4 border-t border-gray-100">
                {isAuthenticated ? (
                  <>
                    <div className="px-2 py-2 mb-2">
                      <p className="text-xs font-medium text-gray-600">{user?.username}</p>
                    </div>
                    <Link
                      to="/account"
                      className="block py-2 text-gray-700 hover:text-black text-sm transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {language === 'fa' ? 'حساب کاربری' : 'My Account'}
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block py-2 text-gray-700 hover:text-black text-sm transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {language === 'fa' ? 'مدیریت' : 'Admin'}
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        navigate('/');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left py-2 text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                    >
                      {language === 'fa' ? 'خروج' : 'Sign Out'}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block py-2 text-gray-700 hover:text-black font-medium transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {language === 'fa' ? 'ورود' : 'Login'}
                    </Link>
                    <Link
                      to="/register"
                      className="block py-2 text-gray-700 hover:text-black font-medium transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {language === 'fa' ? 'ثبت نام' : 'Register'}
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
