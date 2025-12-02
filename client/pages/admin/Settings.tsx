import { useState } from 'react';
import { Save, Globe, ShoppingCart, Mail, Bell, Shield, Database, Palette, CreditCard, MessageSquare, Trash2, Plus, Eye, EyeOff, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/components/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface StoreSettings {
  storeName: string;
  storeDescription: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  timezone: string;
  language: string;
  enableNotifications: boolean;
  enableInventoryAlerts: boolean;
  lowStockThreshold: number;
  enableEmailMarketing: boolean;
  enableSms: boolean;
  taxRate: number;
  shippingRate: number;
  freeShippingThreshold: number;
  enableReviews: boolean;
  enableWishlist: boolean;
  maintenanceMode: boolean;
}

interface PaymentGateway {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  credentials: {
    apiKey?: string;
    secretKey?: string;
    merchantId?: string;
    username?: string;
    password?: string;
  };
}

interface CRMSettings {
  enableSMS: boolean;
  smsProvider: string;
  smsApiKey: string;
  enableWhatsApp: boolean;
  whatsAppProvider: string;
  whatsAppApiKey: string;
  enableTelegram: boolean;
  telegramBotToken: string;
  enableEmail: boolean;
  emailProvider: string;
}

interface BrandingSettings {
  brandName: string;
  logoUrl: string;
  logoFile: File | null;
}

interface ColorPalette {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
  };
  suitableFor: string;
}

export default function AdminSettings() {
  const { t, dir, language } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: 'Pool Equipment Pro',
    storeDescription: 'Professional swimming pool equipment and supplies for residential and commercial pools.',
    storeEmail: 'info@poolequipmentpro.com',
    storePhone: '+1 (555) 123-4567',
    storeAddress: '123 Pool Street, Water City, WC 12345',
    currency: 'USD',
    timezone: 'America/New_York',
    language: 'en',
    enableNotifications: true,
    enableInventoryAlerts: true,
    lowStockThreshold: 10,
    enableEmailMarketing: false,
    enableSms: false,
    taxRate: 8.5,
    shippingRate: 15,
    freeShippingThreshold: 100,
    enableReviews: true,
    enableWishlist: true,
    maintenanceMode: false
  });

  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([
    {
      id: '1',
      name: 'Stripe',
      type: 'stripe',
      isActive: true,
      credentials: { apiKey: '', secretKey: '' }
    },
    {
      id: '2',
      name: 'PayPal',
      type: 'paypal',
      isActive: false,
      credentials: { clientId: '', secret: '' }
    }
  ]);

  const [crmSettings, setCrmSettings] = useState<CRMSettings>({
    enableSMS: false,
    smsProvider: 'twilio',
    smsApiKey: '',
    enableWhatsApp: false,
    whatsAppProvider: 'twilio',
    whatsAppApiKey: '',
    enableTelegram: false,
    telegramBotToken: '',
    enableEmail: true,
    emailProvider: 'sendgrid'
  });

  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [newGateway, setNewGateway] = useState<Partial<PaymentGateway> | null>(null);

  const [branding, setBranding] = useState<BrandingSettings>({
    brandName: 'Fashion Store',
    logoUrl: '',
    logoFile: null
  });

  const [selectedPaletteId, setSelectedPaletteId] = useState<string>('1');

  const colorPalettes: ColorPalette[] = [
    {
      id: '1',
      name: language === 'fa' ? 'لوکس حداقل' : 'Minimal Luxury',
      description: language === 'fa' ? 'سیاه + سفید + طلای نرم' : 'Black + White + Soft Gold',
      colors: {
        primary: '#0C0C0C',
        secondary: '#FFFFFF',
        accent: '#C6A667',
        neutral: '#E5E5E5'
      },
      suitableFor: language === 'fa' ? 'لباس شب، کیف‌ها و کفش‌ها، پالتو، برندهای برتر' : 'Evening dresses, bags and shoes, coats, Premium brands'
    },
    {
      id: '2',
      name: language === 'fa' ? 'مدرن و تمیز' : 'Modern & Clean',
      description: language === 'fa' ? 'کرم + سیاه + زیتون سبز' : 'Cream + Black + Olive Green',
      colors: {
        primary: '#111111',
        secondary: '#F7F3EF',
        accent: '#6C6F57',
        neutral: '#F1EFEB'
      },
      suitableFor: language === 'fa' ? 'مد طبیعی، محصولات حداقل، کفش‌های چرمی، لباس روزمره' : 'Nature fashion, minimal products, leather shoes, everyday wear'
    },
    {
      id: '3',
      name: language === 'fa' ? 'ورزشی / خیابانی' : 'Sport / Street',
      description: language === 'fa' ? 'سفید + سیاه + نارنجی انرژی‌بخش + خاکستری' : 'White + Black + Energetic Orange + Gray',
      colors: {
        primary: '#000000',
        secondary: '#FFFFFF',
        accent: '#FF6A00',
        neutral: '#B6B6B6'
      },
      suitableFor: language === 'fa' ? 'کتان، تی‌شرت‌ها، هودی، لباس جوانان' : 'Linen, T-shirts, hoodies, youth clothing'
    }
  ];

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: language === 'fa' ? 'تنظیمات ذخیره شد' : 'Settings saved',
        description: language === 'fa' ? 'تنظیمات با موفقیت به‌روزرسانی شد' : 'Your settings have been updated successfully'
      });
    } catch (error) {
      toast({
        title: language === 'fa' ? 'خطا' : 'Error',
        description: language === 'fa' ? 'خطا در ذخیره تنظیمات' : 'Failed to save settings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: keyof StoreSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleGatewayStatus = (id: string) => {
    setPaymentGateways(prev =>
      prev.map(gw => gw.id === id ? { ...gw, isActive: !gw.isActive } : gw)
    );
  };

  const updateGatewayCredential = (id: string, key: string, value: string) => {
    setPaymentGateways(prev =>
      prev.map(gw =>
        gw.id === id
          ? { ...gw, credentials: { ...gw.credentials, [key]: value } }
          : gw
      )
    );
  };

  const deleteGateway = (id: string) => {
    setPaymentGateways(prev => prev.filter(gw => gw.id !== id));
    toast({
      title: language === 'fa' ? 'موفق' : 'Success',
      description: language === 'fa' ? 'درگاه حذف شد' : 'Gateway deleted successfully'
    });
  };

  const updateCrmSetting = (key: keyof CRMSettings, value: any) => {
    setCrmSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBranding(prev => ({
          ...prev,
          logoUrl: reader.result as string,
          logoFile: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setBranding(prev => ({
      ...prev,
      logoUrl: '',
      logoFile: null
    }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {language === 'fa' ? 'تنظیمات فروشگاه' : 'Store Settings'}
            </h2>
            <p className="text-gray-600">
              {language === 'fa' 
                ? 'پیکربندی تنظیمات عمومی فروشگاه'
                : 'Configure your store preferences and settings'
              }
            </p>
          </div>
          <Button onClick={handleSaveSettings} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 
              (language === 'fa' ? 'در حال ذخیره...' : 'Saving...') :
              (language === 'fa' ? 'ذخیره تنظیمات' : 'Save Settings')
            }
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-9 overflow-x-auto">
              <TabsTrigger value="branding">
                <Globe className="w-4 h-4 mr-2" />
                {language === 'fa' ? 'برند' : 'Branding'}
              </TabsTrigger>
              <TabsTrigger value="general">
                <Globe className="w-4 h-4 mr-2" />
                {language === 'fa' ? 'عمومی' : 'General'}
              </TabsTrigger>
              <TabsTrigger value="commerce">
                <ShoppingCart className="w-4 h-4 mr-2" />
                {language === 'fa' ? 'تجارت' : 'Commerce'}
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="w-4 h-4 mr-2" />
                {language === 'fa' ? 'اعلانات' : 'Notifications'}
              </TabsTrigger>
              <TabsTrigger value="payment">
                <CreditCard className="w-4 h-4 mr-2" />
                {language === 'fa' ? 'پرداخت' : 'Payment'}
              </TabsTrigger>
              <TabsTrigger value="crm">
                <MessageSquare className="w-4 h-4 mr-2" />
                {language === 'fa' ? 'CRM' : 'CRM'}
              </TabsTrigger>
              <TabsTrigger value="design">
                <Palette className="w-4 h-4 mr-2" />
                {language === 'fa' ? 'رنگ‌ها' : 'Design'}
              </TabsTrigger>
              <TabsTrigger value="features">
                <Palette className="w-4 h-4 mr-2" />
                {language === 'fa' ? 'ویژگی‌ها' : 'Features'}
              </TabsTrigger>
              <TabsTrigger value="system">
                <Shield className="w-4 h-4 mr-2" />
                {language === 'fa' ? 'سیستم' : 'System'}
              </TabsTrigger>
            </TabsList>

            {/* Branding Settings */}
            <TabsContent value="branding">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    {language === 'fa' ? 'تنظیمات برند' : 'Branding Settings'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="brandName">{language === 'fa' ? 'نام برند' : 'Brand Name'}</Label>
                    <Input
                      id="brandName"
                      value={branding.brandName}
                      onChange={(e) => setBranding(prev => ({ ...prev, brandName: e.target.value }))}
                      placeholder={language === 'fa' ? 'نام برند خود را وارد کنید' : 'Enter your brand name'}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      {language === 'fa' ? 'نام برند در بالای هدر نمایش داده خواهد شد' : 'This will be displayed above the header'}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <Label>{language === 'fa' ? 'لوگوی فروشگاه' : 'Store Logo'}</Label>
                    <p className="text-sm text-gray-600 mb-4">
                      {language === 'fa' ? 'لوگوی خود را بارگذاری کنید. فرمت‌های توصیه‌شده: PNG, SVG, JPG' : 'Recommended formats: PNG, SVG, JPG'}
                    </p>

                    {branding.logoUrl ? (
                      <div className="relative inline-block">
                        <img
                          src={branding.logoUrl}
                          alt="Logo preview"
                          className="h-32 w-auto rounded-lg border border-gray-300 object-cover"
                        />
                        <button
                          onClick={removeLogo}
                          className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transform translate-x-2 -translate-y-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">
                            {language === 'fa' ? 'برای انتخاب فایل کلیک کنید یا بکشید' : 'Click or drag to upload'}
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleLogoUpload}
                        />
                      </label>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* General Settings */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    {language === 'fa' ? 'تنظیمات عمومی' : 'General Settings'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="storeName">{language === 'fa' ? 'نام فروشگاه' : 'Store Name'}</Label>
                      <Input
                        id="storeName"
                        value={settings.storeName}
                        onChange={(e) => updateSetting('storeName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="storeEmail">{language === 'fa' ? 'ایمیل فروشگاه' : 'Store Email'}</Label>
                      <Input
                        id="storeEmail"
                        type="email"
                        value={settings.storeEmail}
                        onChange={(e) => updateSetting('storeEmail', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="storeDescription">{language === 'fa' ? 'توضیحات فروشگاه' : 'Store Description'}</Label>
                    <Textarea
                      id="storeDescription"
                      value={settings.storeDescription}
                      onChange={(e) => updateSetting('storeDescription', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="storePhone">{language === 'fa' ? 'تلفن فروشگاه' : 'Store Phone'}</Label>
                      <Input
                        id="storePhone"
                        value={settings.storePhone}
                        onChange={(e) => updateSetting('storePhone', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency">{language === 'fa' ? 'واحد پول' : 'Currency'}</Label>
                      <Select value={settings.currency} onValueChange={(value) => updateSetting('currency', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="IRR">IRR - Iranian Rial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="storeAddress">{language === 'fa' ? 'آدرس فروشگاه' : 'Store Address'}</Label>
                    <Textarea
                      id="storeAddress"
                      value={settings.storeAddress}
                      onChange={(e) => updateSetting('storeAddress', e.target.value)}
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Commerce Settings */}
            <TabsContent value="commerce">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {language === 'fa' ? 'تنظیمات تجاری' : 'Commerce Settings'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="taxRate">{language === 'fa' ? 'نرخ مالیات (%)' : 'Tax Rate (%)'}</Label>
                      <Input
                        id="taxRate"
                        type="number"
                        step="0.1"
                        value={settings.taxRate}
                        onChange={(e) => updateSetting('taxRate', parseFloat(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="shippingRate">{language === 'fa' ? 'هزینه ا��سال ($)' : 'Shipping Rate ($)'}</Label>
                      <Input
                        id="shippingRate"
                        type="number"
                        value={settings.shippingRate}
                        onChange={(e) => updateSetting('shippingRate', parseFloat(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="freeShippingThreshold">{language === 'fa' ? 'حد ارسال رایگان ($)' : 'Free Shipping Threshold ($)'}</Label>
                      <Input
                        id="freeShippingThreshold"
                        type="number"
                        value={settings.freeShippingThreshold}
                        onChange={(e) => updateSetting('freeShippingThreshold', parseFloat(e.target.value))}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label htmlFor="lowStockThreshold">{language === 'fa' ? 'آستانه موجودی کم' : 'Low Stock Threshold'}</Label>
                    <Input
                      id="lowStockThreshold"
                      type="number"
                      value={settings.lowStockThreshold}
                      onChange={(e) => updateSetting('lowStockThreshold', parseInt(e.target.value))}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {language === 'fa' ? 'هشدار زمانی که موجودی زیر این مقدار برسد' : 'Alert when inventory falls below this number'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    {language === 'fa' ? 'تنظیمات اعلانات' : 'Notification Settings'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>{language === 'fa' ? 'فعال‌سازی اعلانات' : 'Enable Notifications'}</Label>
                        <p className="text-sm text-gray-500">
                          {language === 'fa' ? 'دریافت اعلانات مهم سیستم' : 'Receive important system notifications'}
                        </p>
                      </div>
                      <Switch 
                        checked={settings.enableNotifications}
                        onCheckedChange={(checked) => updateSetting('enableNotifications', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>{language === 'fa' ? 'هشدارهای موجودی' : 'Inventory Alerts'}</Label>
                        <p className="text-sm text-gray-500">
                          {language === 'fa' ? 'هشدار زمانی که موجودی کم می‌شود' : 'Get alerts when inventory is low'}
                        </p>
                      </div>
                      <Switch 
                        checked={settings.enableInventoryAlerts}
                        onCheckedChange={(checked) => updateSetting('enableInventoryAlerts', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>{language === 'fa' ? 'ایمیل مارکتینگ' : 'Email Marketing'}</Label>
                        <p className="text-sm text-gray-500">
                          {language === 'fa' ? 'ارسال ایمیل‌های تبلیغاتی به مشتری��ن' : 'Send promotional emails to customers'}
                        </p>
                      </div>
                      <Switch 
                        checked={settings.enableEmailMarketing}
                        onCheckedChange={(checked) => updateSetting('enableEmailMarketing', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>{language === 'fa' ? 'پیامک' : 'SMS Notifications'}</Label>
                        <p className="text-sm text-gray-500">
                          {language === 'fa' ? 'ارسال پیامک برای سفارشات مهم' : 'Send SMS for important order updates'}
                        </p>
                      </div>
                      <Switch 
                        checked={settings.enableSms}
                        onCheckedChange={(checked) => updateSetting('enableSms', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Gateway Settings */}
            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    {language === 'fa' ? 'درگاه‌های پرداخت' : 'Payment Gateways'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {paymentGateways.map((gateway) => (
                    <div key={gateway.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-lg">{gateway.name}</h4>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={gateway.isActive}
                            onCheckedChange={() => toggleGatewayStatus(gateway.id)}
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteGateway(gateway.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(gateway.credentials).map(([key, value]) => (
                          <div key={key}>
                            <Label htmlFor={`${gateway.id}-${key}`}>
                              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                            </Label>
                            <div className="relative">
                              <Input
                                id={`${gateway.id}-${key}`}
                                type={showPasswords[`${gateway.id}-${key}`] ? 'text' : 'password'}
                                value={value || ''}
                                onChange={(e) =>
                                  updateGatewayCredential(gateway.id, key, e.target.value)
                                }
                                placeholder={`Enter ${key}`}
                              />
                              <button
                                onClick={() =>
                                  setShowPasswords((prev) => ({
                                    ...prev,
                                    [`${gateway.id}-${key}`]:
                                      !prev[`${gateway.id}-${key}`],
                                  }))
                                }
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              >
                                {showPasswords[`${gateway.id}-${key}`] ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <Button className="w-full" onClick={() => setNewGateway({})}>
                    <Plus className="w-4 h-4 mr-2" />
                    {language === 'fa' ? 'افزودن درگاه جدید' : 'Add New Gateway'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* CRM Communication Settings */}
            <TabsContent value="crm">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    {language === 'fa' ? 'تنظیمات ارتباطات CRM' : 'CRM Communication Settings'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* SMS Settings */}
                  <div className="border-b pb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-lg">
                        {language === 'fa' ? 'پیامک (SMS)' : 'SMS'}
                      </h4>
                      <Switch
                        checked={crmSettings.enableSMS}
                        onCheckedChange={(checked) =>
                          updateCrmSetting('enableSMS', checked)
                        }
                      />
                    </div>

                    {crmSettings.enableSMS && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="smsProvider">
                            {language === 'fa' ? 'فراهم‌کننده' : 'Provider'}
                          </Label>
                          <Select
                            value={crmSettings.smsProvider}
                            onValueChange={(value) =>
                              updateCrmSetting('smsProvider', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="twilio">Twilio</SelectItem>
                              <SelectItem value="kavenegar">Kavenegar</SelectItem>
                              <SelectItem value="faraz">Faraz</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="smsApiKey">
                            {language === 'fa' ? 'کلید API' : 'API Key'}
                          </Label>
                          <div className="relative">
                            <Input
                              id="smsApiKey"
                              type={showPasswords['smsApiKey'] ? 'text' : 'password'}
                              value={crmSettings.smsApiKey}
                              onChange={(e) =>
                                updateCrmSetting('smsApiKey', e.target.value)
                              }
                              placeholder="Enter API Key"
                            />
                            <button
                              onClick={() =>
                                setShowPasswords((prev) => ({
                                  ...prev,
                                  smsApiKey: !prev.smsApiKey,
                                }))
                              }
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showPasswords['smsApiKey'] ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* WhatsApp Settings */}
                  <div className="border-b pb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-lg">WhatsApp</h4>
                      <Switch
                        checked={crmSettings.enableWhatsApp}
                        onCheckedChange={(checked) =>
                          updateCrmSetting('enableWhatsApp', checked)
                        }
                      />
                    </div>

                    {crmSettings.enableWhatsApp && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="whatsappProvider">
                            {language === 'fa' ? 'فراهم‌کننده' : 'Provider'}
                          </Label>
                          <Select
                            value={crmSettings.whatsAppProvider}
                            onValueChange={(value) =>
                              updateCrmSetting('whatsAppProvider', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="twilio">Twilio</SelectItem>
                              <SelectItem value="messagebird">MessageBird</SelectItem>
                              <SelectItem value="gupshup">Gupshup</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="whatsappApiKey">
                            {language === 'fa' ? 'کلید API' : 'API Key'}
                          </Label>
                          <div className="relative">
                            <Input
                              id="whatsappApiKey"
                              type={showPasswords['whatsappApiKey'] ? 'text' : 'password'}
                              value={crmSettings.whatsAppApiKey}
                              onChange={(e) =>
                                updateCrmSetting('whatsAppApiKey', e.target.value)
                              }
                              placeholder="Enter API Key"
                            />
                            <button
                              onClick={() =>
                                setShowPasswords((prev) => ({
                                  ...prev,
                                  whatsappApiKey: !prev.whatsappApiKey,
                                }))
                              }
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showPasswords['whatsappApiKey'] ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Telegram Settings */}
                  <div className="border-b pb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-lg">Telegram</h4>
                      <Switch
                        checked={crmSettings.enableTelegram}
                        onCheckedChange={(checked) =>
                          updateCrmSetting('enableTelegram', checked)
                        }
                      />
                    </div>

                    {crmSettings.enableTelegram && (
                      <div>
                        <Label htmlFor="telegramBotToken">
                          {language === 'fa' ? 'توکن ربات' : 'Bot Token'}
                        </Label>
                        <div className="relative">
                          <Input
                            id="telegramBotToken"
                            type={showPasswords['telegramBotToken'] ? 'text' : 'password'}
                            value={crmSettings.telegramBotToken}
                            onChange={(e) =>
                              updateCrmSetting('telegramBotToken', e.target.value)
                            }
                            placeholder="Enter Telegram Bot Token"
                          />
                          <button
                            onClick={() =>
                              setShowPasswords((prev) => ({
                                ...prev,
                                telegramBotToken: !prev.telegramBotToken,
                              }))
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPasswords['telegramBotToken'] ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Email Settings */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-lg">
                        {language === 'fa' ? 'ایمیل' : 'Email'}
                      </h4>
                      <Switch
                        checked={crmSettings.enableEmail}
                        onCheckedChange={(checked) =>
                          updateCrmSetting('enableEmail', checked)
                        }
                      />
                    </div>

                    {crmSettings.enableEmail && (
                      <div>
                        <Label htmlFor="emailProvider">
                          {language === 'fa' ? 'فراهم‌کننده' : 'Provider'}
                        </Label>
                        <Select
                          value={crmSettings.emailProvider}
                          onValueChange={(value) =>
                            updateCrmSetting('emailProvider', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sendgrid">SendGrid</SelectItem>
                            <SelectItem value="mailgun">Mailgun</SelectItem>
                            <SelectItem value="aws">AWS SES</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Design / Color Palette Settings */}
            <TabsContent value="design">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    {language === 'fa' ? 'طرح‌های رنگی' : 'Color Palettes'}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-2">
                    {language === 'fa' ? 'طرح‌های رنگی مختلف را برای فروشگاه خود انتخاب کنید' : 'Choose a color palette for your store'}
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {colorPalettes.map((palette) => (
                      <motion.div
                        key={palette.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedPaletteId(palette.id)}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          selectedPaletteId === palette.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <h4 className="font-semibold text-lg mb-2">{palette.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{palette.description}</p>

                        <div className="flex gap-2 mb-3">
                          {Object.entries(palette.colors).map(([key, color]) => (
                            <div
                              key={key}
                              className="flex-1 h-12 rounded-lg border border-gray-300 hover:shadow-md transition"
                              style={{ backgroundColor: color }}
                              title={`${key}: ${color}`}
                            />
                          ))}
                        </div>

                        <p className="text-xs text-gray-500 border-t pt-2">
                          <strong>{language === 'fa' ? 'مناسب برای:' : 'Suitable for:'}</strong> {palette.suitableFor}
                        </p>

                        {selectedPaletteId === palette.id && (
                          <div className="mt-3 flex items-center justify-center text-green-600">
                            <span className="text-sm font-semibold">✓ {language === 'fa' ? 'انتخاب‌شده' : 'Selected'}</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <Separator />

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      {language === 'fa'
                        ? '💡 طرح‌های رنگی فوق‌الذکر برای تست و مقایسه در پنل مدیریت استفاده می‌شوند. در نسخه‌ی نهایی، این تنظیمات برای تمام مشتریان اعمال خواهد شد.'
                        : '💡 These color palettes are for testing and comparison. In production, selected palette will be applied store-wide.'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Features Settings */}
            <TabsContent value="features">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    {language === 'fa' ? 'ویژگی‌های فروشگاه' : 'Store Features'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>{language === 'fa' ? 'سیستم نظرات' : 'Customer Reviews'}</Label>
                        <p className="text-sm text-gray-500">
                          {language === 'fa' ? 'امکان ثبت نظر برای مشتریان' : 'Allow customers to leave product reviews'}
                        </p>
                      </div>
                      <Switch 
                        checked={settings.enableReviews}
                        onCheckedChange={(checked) => updateSetting('enableReviews', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>{language === 'fa' ? 'لیست علاقه‌مندی‌ها' : 'Wishlist'}</Label>
                        <p className="text-sm text-gray-500">
                          {language === 'fa' ? 'امکان اضافه کردن محصولات به لیست علاقه‌مندی‌ها' : 'Allow customers to save products to wishlist'}
                        </p>
                      </div>
                      <Switch 
                        checked={settings.enableWishlist}
                        onCheckedChange={(checked) => updateSetting('enableWishlist', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Settings */}
            <TabsContent value="system">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    {language === 'fa' ? 'تنظیمات سیستم' : 'System Settings'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="defaultLanguage">{language === 'fa' ? 'زبان پیش‌فرض' : 'Default Language'}</Label>
                      <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fa">فارسی</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="timezone">{language === 'fa' ? 'منطقه زمانی' : 'Timezone'}</Label>
                      <Select value={settings.timezone} onValueChange={(value) => updateSetting('timezone', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                          <SelectItem value="America/Chicago">Central Time</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          <SelectItem value="Asia/Tehran">Tehran Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-yellow-800">{language === 'fa' ? 'حالت تعمیرات' : 'Maintenance Mode'}</Label>
                        <p className="text-sm text-yellow-700">
                          {language === 'fa' ? 'فروشگاه را موقتاً غیرفعال کنید' : 'Temporarily disable the store for maintenance'}
                        </p>
                      </div>
                      <Switch 
                        checked={settings.maintenanceMode}
                        onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">
                      <Database className="w-4 h-4 inline mr-2" />
                      {language === 'fa' ? 'پشتیبان‌گیری پایگاه داده' : 'Database Backup'}
                    </h4>
                    <p className="text-sm text-blue-700 mb-3">
                      {language === 'fa' 
                        ? 'آخرین پشتیبان‌گیری: ۱۵ دی ۱۴۰۲'
                        : 'Last backup: January 15, 2024'
                      }
                    </p>
                    <Button variant="outline" size="sm">
                      {language === 'fa' ? 'ایجاد پشتیبان' : 'Create Backup'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
