import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'fa';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// English translations
const enTranslations = {
  // Header
  'header.phone': '1-800-POOL-PRO',
  'header.freeShipping': 'Free shipping on orders over $500',
  'header.myAccount': 'My Account',
  'header.trackOrder': 'Track Order',
  'header.search': 'Search pool equipment...',
  'header.login': 'Login',
  'header.cart': 'Cart',
  
  // Navigation
  'nav.products': 'Products',
  'nav.pumps': 'Pumps',
  'nav.filters': 'Filters',
  'nav.heaters': 'Heaters',
  'nav.chemicals': 'Chemicals',
  'nav.accessories': 'Accessories',
  'nav.blog': 'Blog',
  'nav.contact': 'Contact',
  
  // Homepage
  'home.hero.title': 'Professional Pool Equipment',
  'home.hero.subtitle': 'You Can Trust',
  'home.hero.description': 'From residential pools to commercial facilities, we provide top-quality pumps, filters, heaters, and accessories. Expert advice and professional installation available.',
  'home.hero.shopButton': 'Shop Equipment',
  'home.hero.consultationButton': 'Free Consultation',
  
  // Features
  'feature.quality.title': 'Professional Quality',
  'feature.quality.description': 'Only the highest quality equipment from trusted manufacturers',
  'feature.shipping.title': 'Free Shipping',
  'feature.shipping.description': 'Free shipping on all orders over $500 - nationwide delivery',
  'feature.support.title': 'Expert Support',
  'feature.support.description': '24/7 technical support from certified pool professionals',
  
  // Categories
  'category.title': 'Shop by Category',
  'category.subtitle': 'Find the perfect equipment for your pool with our comprehensive selection of professional-grade products',
  'category.pumps.name': 'Pool Pumps',
  'category.pumps.description': 'Variable speed and single speed pumps for efficient water circulation',
  'category.filters.name': 'Filters',
  'category.filters.description': 'Sand, cartridge, and DE filters for crystal clear pool water',
  'category.heaters.name': 'Heaters',
  'category.heaters.description': 'Gas, electric, and heat pump heaters for year-round swimming',
  'category.lights.name': 'Pool Lights',
  'category.lights.description': 'LED and fiber optic lighting systems for stunning pool ambiance',
  'category.chemicals.name': 'Chemicals',
  'category.chemicals.description': 'Professional-grade chemicals for perfect water balance',
  'category.accessories.name': 'Accessories',
  'category.accessories.description': 'Covers, cleaners, and maintenance tools for complete pool care',
  'category.shopNow': 'Shop Now',
  
  // Best Sellers
  'bestSellers.title': 'Best Selling Equipment',
  'bestSellers.subtitle': 'Top-rated products trusted by pool professionals nationwide',
  'bestSellers.viewAll': 'View All Best Sellers',
  
  // CTA Section
  'cta.title': 'Need Help Choosing the Right Equipment?',
  'cta.description': 'Our certified pool professionals are here to help you find the perfect solution for your pool. Get a free consultation and personalized recommendations.',
  'cta.consultation': 'Schedule Free Consultation',
  'cta.call': 'Call 1-800-POOL-PRO',
  
  // Footer
  'footer.company': 'Pool Equipment Experts',
  'footer.description': 'Your trusted partner for professional swimming pool equipment. Serving residential and commercial customers with quality products and expert support.',
  'footer.quickLinks': 'Quick Links',
  'footer.customerService': 'Customer Service',
  'footer.contactInfo': 'Contact Info',
  'footer.copyright': '© 2024 AquaPro Pool Equipment. All rights reserved.',
  'footer.privacy': 'Privacy Policy',
  'footer.terms': 'Terms of Service',
  'footer.sitemap': 'Sitemap',
  
  // Common
  'common.backHome': 'Back to Home',
  'common.contactUs': 'Contact Us',
  'common.loading': 'Loading...',
  'common.error': 'Error',
  'common.success': 'Success',
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.edit': 'Edit',
  'common.delete': 'Delete',
  'common.add': 'Add',
  'common.view': 'View',
};

// Persian translations
const faTranslations = {
  // Header
  'header.phone': '۱-۸۰۰-استخر-متخصص',
  'header.freeShipping': 'ارسال رایگان برای سفارشات بالای ۵۰۰ دلار',
  'header.myAccount': 'حساب کاربری',
  'header.trackOrder': 'پیگیری سفارش',
  'header.search': 'جستجوی ��جهیزات استخر...',
  'header.login': 'ورود',
  'header.cart': 'سبد خرید',
  
  // Navigation
  'nav.products': 'محصولات',
  'nav.pumps': 'پمپ‌ها',
  'nav.filters': 'فیلترها',
  'nav.heaters': 'بخاری‌ها',
  'nav.chemicals': 'مواد شیمیایی',
  'nav.accessories': 'لوازم جانبی',
  'nav.blog': 'وبلاگ',
  'nav.contact': 'تماس',
  
  // Homepage
  'home.hero.title': 'تجهیزات حرفه‌ای استخر',
  'home.hero.subtitle': 'قابل اعتماد',
  'home.hero.description': 'از استخرهای مسکونی تا تجاری، ما بهترین پمپ‌ها، فیلترها، بخاری‌ها و لوازم جانبی را ارائه می‌دهیم. مشاوره تخصصی و نصب حرفه‌ای در دسترس است.',
  'home.hero.shopButton': 'خرید تجهیزات',
  'home.hero.consultationButton': 'مشاوره رایگان',
  
  // Features
  'feature.quality.title': 'کیفیت حرفه‌ای',
  'feature.quality.description': 'فقط بالاترین کیفیت تجهیزات از تولیدکنندگان معتبر',
  'feature.shipping.title': 'ارسال رایگان',
  'feature.shipping.description': 'ارسال رایگان برای تمام سفارشات بالای ۵۰۰ دلار - تحو��ل سراسری',
  'feature.support.title': 'پشتیبانی متخصص',
  'feature.support.description': 'پشتیبانی فنی ۲۴/۷ از متخصصان دارای گواهینامه استخر',
  
  // Categories
  'category.title': 'خرید بر اساس دسته‌بندی',
  'category.subtitle': 'تجهیزات مناسب برای استخر خود را با مجموعه جامع محصولات حرفه‌ای ما پیدا کنید',
  'category.pumps.name': 'پمپ‌های استخر',
  'category.pumps.description': 'پمپ‌های تک سرعته و متغیر برای گردش موثر آب',
  'category.filters.name': 'فیلترها',
  'category.filters.description': 'فیلترهای شنی، کارتریج و DE برای آب شفاف استخر',
  'category.heaters.name': 'بخاری‌ها',
  'category.heaters.description': 'بخاری‌های گازی، برقی و پمپ حرارتی برای شنا در تمام فصول',
  'category.lights.name': 'چراغ‌های استخر',
  'category.lights.description': 'سیستم‌های روشنایی LED و فیبر نوری برای فضای زیبای استخر',
  'category.chemicals.name': 'مواد شیمیایی',
  'category.chemicals.description': 'مواد شیمیایی حرفه‌ای برای تعادل کامل آب',
  'category.accessories.name': 'لوازم جانبی',
  'category.accessories.description': 'پوشش‌ها، تمیزکننده‌ها و ابزارهای نگهداری برای مراقبت کامل استخر',
  'category.shopNow': 'خرید کنید',
  
  // Best Sellers
  'bestSellers.title': 'پرفروش‌ترین تجهیزات',
  'bestSellers.subtitle': 'محصولات برتر مورد اعتماد متخصصان استخر در سراسر کشور',
  'bestSellers.viewAll': 'مشاهده همه پرفروش‌ها',
  
  // CTA Section
  'cta.title': 'برای انتخاب تجهیزات مناسب کمک نیاز دارید؟',
  'cta.description': 'متخصصان دارای گواهینامه استخر ما اینجا هستند تا به شما کمک کنند راه حل مناسب برای استخر خود پیدا کنید. مشاوره رایگان و توصیه‌های شخصی‌سازی شده دریافت کنید.',
  'cta.consultation': 'زمان‌بندی مشاوره رایگان',
  'cta.call': 'تماس ۱-۸۰۰-استخر-متخصص',
  
  // Footer
  'footer.company': 'متخصصان تجهیزات استخر',
  'footer.description': 'شریک مورد اعتماد شما برای تجهیزات حرفه‌ای استخر شنا. خدمات رسانی به مشتریان مسکونی و تجاری با محصولات باکیفیت و پشتیبانی متخصص.',
  'footer.quickLinks': 'لینک‌های سریع',
  'footer.customerService': 'خدمات مشتری',
  'footer.contactInfo': 'اطلاعات تماس',
  'footer.copyright': '© ۲۰۲۴ آکواپرو تجهیزات استخر. تمام حقوق محفوظ است.',
  'footer.privacy': 'سیاست حفظ حریم خصوصی',
  'footer.terms': 'شرایط خدمات',
  'footer.sitemap': 'نقشه سایت',
  
  // Common
  'common.backHome': 'بازگشت به خانه',
  'common.contactUs': 'تماس با ما',
  'common.loading': 'در حال بارگذاری...',
  'common.error': 'خطا',
  'common.success': 'موفق',
  'common.save': 'ذخیره',
  'common.cancel': 'لغو',
  'common.edit': 'ویرایش',
  'common.delete': 'حذف',
  'common.add': 'افزودن',
  'common.view': 'مشاهده',

  // Admin Menu
  'admin.dashboard': 'داشبورد',
  'admin.inventory': 'انبار',
  'admin.products': 'محصولات',
  'admin.orders': 'سفارشات',
  'admin.categories': 'دسته‌بندی‌ها',
  'admin.customers': 'مشتریان',
  'admin.menuManagement': 'مدیریت منو',
  'admin.storePages': 'صفحات فروشگاه',
  'admin.seo': 'سئو',
  'admin.accounting': 'حسابداری',
  'admin.journalEntries': 'دفاتر روزنامه',
  'admin.financialReports': 'گزارشات مالی',
  'admin.accountsReceivable': 'حساب‌های دریافتی',
  'admin.accountsPayable': 'حساب‌های پرداختی',
  'admin.bankReconciliation': 'تطبیق بانکی',
  'admin.hrManagement': 'منابع انسانی',
  'admin.salesCRM': 'فروش و CRM',
  'admin.procurement': 'خرید و تدارکات',
  'admin.settings': 'تنظیمات',
  'admin.backToWebsite': 'بازگشت به سایت',
  'admin.logout': 'خروج',

  // Admin Section Headers
  'admin.section.inventory': 'انبار و محصولات',
  'admin.section.sales': 'فروش و مشتریان',
  'admin.section.finance': 'مالی و حسابداری',
  'admin.section.settings': 'تنظیمات و سایر',
};

const translations = {
  en: enTranslations,
  fa: faTranslations,
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && ['en', 'fa'].includes(savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof enTranslations] || key;
  };

  const dir = language === 'fa' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
