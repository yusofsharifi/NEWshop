import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t, dir, language } = useLanguage();

  return (
    <footer className="bg-navy-900 text-white" dir={dir}>
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className={dir === 'rtl' ? 'text-right' : 'text-left'}>
            <div className={`flex items-center mb-4 ${dir === 'rtl' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full opacity-90"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {language === 'fa' ? 'آکواپرو' : 'AquaPro'}
                </h3>
                <p className="text-sm text-gray-300">{t('footer.company')}</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              {t('footer.description')}
            </p>
            <div className={`flex ${dir === 'rtl' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={dir === 'rtl' ? 'text-right' : 'text-left'}>
            <h4 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-300 hover:text-white transition-colors">{t('nav.products')}</Link></li>
              <li><Link to="/category/pumps" className="text-gray-300 hover:text-white transition-colors">{t('nav.pumps')}</Link></li>
              <li><Link to="/category/filters" className="text-gray-300 hover:text-white transition-colors">{t('nav.filters')}</Link></li>
              <li><Link to="/category/heaters" className="text-gray-300 hover:text-white transition-colors">{t('nav.heaters')}</Link></li>
              <li><Link to="/category/chemicals" className="text-gray-300 hover:text-white transition-colors">{t('nav.chemicals')}</Link></li>
              <li><Link to="/bundles" className="text-gray-300 hover:text-white transition-colors">بسته محصولات</Link></li>
              <li><Link to="/best-sellers" className="text-gray-300 hover:text-white transition-colors">پرفروش‌ترین</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className={dir === 'rtl' ? 'text-right' : 'text-left'}>
            <h4 className="text-lg font-semibold mb-4">{t('footer.customerService')}</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">{t('nav.contact')}</Link></li>
              <li><Link to="/consultation" className="text-gray-300 hover:text-white transition-colors">م��اوره رایگان</Link></li>
              <li><Link to="/shipping" className="text-gray-300 hover:text-white transition-colors">اطلاعات ارسال</Link></li>
              <li><Link to="/returns" className="text-gray-300 hover:text-white transition-colors">مرجوعی</Link></li>
              <li><Link to="/warranty" className="text-gray-300 hover:text-white transition-colors">ضمانت</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white transition-colors">سوالات متداول</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-white transition-colors">{t('nav.blog')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={dir === 'rtl' ? 'text-right' : 'text-left'}>
            <h4 className="text-lg font-semibold mb-4">{t('footer.contactInfo')}</h4>
            <div className="space-y-3">
              <div className={`flex items-start ${dir === 'rtl' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                <Phone className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">{t('header.phone')}</p>
                  <p className="text-gray-300 text-sm">
                    {language === 'fa' ? 'دوشنبه-جمعه: ۸ صبح-۸ شب' : 'Mon-Fri: 8AM-8PM EST'}
                  </p>
                </div>
              </div>
              <div className={`flex items-start ${dir === 'rtl' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                <Mail className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white">support@aquapro.com</p>
                  <p className="text-gray-300 text-sm">
                    {language === 'fa' ? 'پشتیبانی ایمیل ۲۴/۷' : '24/7 Email Support'}
                  </p>
                </div>
              </div>
              <div className={`flex items-start ${dir === 'rtl' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                <MapPin className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white">
                    {language === 'fa' ? 'خیابان تجهیزات استخر ۱۲۳' : '123 Pool Equipment Dr'}
                  </p>
                  <p className="text-gray-300 text-sm">
                    {language === 'fa' ? 'میامی، فلوریدا ۳۳۱۰۱' : 'Miami, FL 33101'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              {t('footer.copyright')}
            </p>
            <div className={`flex mt-2 md:mt-0 ${dir === 'rtl' ? 'space-x-reverse space-x-6' : 'space-x-6'}`}>
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                {t('footer.privacy')}
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                {t('footer.terms')}
              </Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-white text-sm transition-colors">
                {t('footer.sitemap')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
