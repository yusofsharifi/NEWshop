import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Upload, X, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/components/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface Product {
  id: number;
  name_en: string;
  name_fa: string;
  image_url: string;
  price: number;
  category?: {
    name_en: string;
    name_fa: string;
  };
}

interface StorePage {
  id: string;
  title_en: string;
  title_fa: string;
  description_en: string;
  description_fa: string;
  banner_url: string;
  tags: string[];
  selected_product_ids: number[];
  auto_populate: boolean;
  is_active: boolean;
  order_priority: number;
  created_at: string;
}

const AVAILABLE_TAGS = [
  { en: 'Bestsellers', fa: 'پرفروش‌ها', key: 'bestsellers' },
  { en: 'Discounted', fa: 'تخفیف‌دار', key: 'discounted' },
  { en: 'New Arrivals', fa: 'محصولات جدید', key: 'new_arrivals' },
  { en: 'Featured', fa: 'ویژه', key: 'featured' },
  { en: 'Pumps', fa: 'پ��پ‌ها', key: 'pumps' },
  { en: 'Filters', fa: 'فیلترها', key: 'filters' },
  { en: 'Heaters', fa: 'بخاری‌ها', key: 'heaters' },
  { en: 'Lights', fa: 'چراغ‌ها', key: 'lights' },
  { en: 'Chemicals', fa: 'مواد شیمیایی', key: 'chemicals' },
  { en: 'Accessories', fa: 'لوازم جانبی', key: 'accessories' },
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name_en: 'Pentair SuperFlo VS Variable Speed Pump',
    name_fa: 'پمپ متغیر سرعت پنتیر سوپرفلو',
    image_url: '/api/placeholder/200/160',
    price: 849,
    category: { name_en: 'Pumps', name_fa: 'پمپ‌ها' },
  },
  {
    id: 2,
    name_en: 'Hayward SwimClear Cartridge Filter',
    name_fa: 'فیلتر کارتریج هیوارد سوئیم کلیر',
    image_url: '/api/placeholder/200/160',
    price: 379,
    category: { name_en: 'Filters', name_fa: 'فیلترها' },
  },
  {
    id: 3,
    name_en: 'Raypak Digital Gas Heater 266K BTU',
    name_fa: 'بخاری گازی دیجیتال ریپک ۲۶۶ هزار BTU',
    image_url: '/api/placeholder/200/160',
    price: 1299,
    category: { name_en: 'Heaters', name_fa: 'بخاری‌ها' },
  },
  {
    id: 4,
    name_en: 'Jandy Pro Series LED Pool Light',
    name_fa: 'چراغ LED استخر ��ری پرو جندی',
    image_url: '/api/placeholder/200/160',
    price: 299,
    category: { name_en: 'Lights', name_fa: 'چراغ‌ها' },
  },
];

export default function AdminStorePages() {
  const { t, dir, language } = useLanguage();
  const { toast } = useToast();
  const [pages, setPages] = useState<StorePage[]>([
    {
      id: '1',
      title_en: 'Best Sellers',
      title_fa: 'پرفروش‌ها',
      description_en: 'Our most popular products loved by customers',
      description_fa: 'محصولات پرطرفدار ما که مورد علاقه مشتریان است',
      banner_url: '/api/placeholder/1200/300',
      tags: ['bestsellers'],
      selected_product_ids: [1, 2],
      auto_populate: true,
      is_active: true,
      order_priority: 1,
      created_at: new Date().toISOString(),
    },
  ]);

  const [editingPage, setEditingPage] = useState<StorePage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState<Partial<StorePage>>({
    title_en: '',
    title_fa: '',
    description_en: '',
    description_fa: '',
    banner_url: '',
    tags: [],
    selected_product_ids: [],
    auto_populate: true,
    is_active: true,
    order_priority: 0,
  });

  const filteredPages = useMemo(
    () =>
      pages.filter(
        (p) =>
          p.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.title_fa.includes(searchTerm)
      ),
    [pages, searchTerm]
  );

  const handleOpenDialog = (page?: StorePage) => {
    if (page) {
      setEditingPage(page);
      setFormData(page);
    } else {
      setEditingPage(null);
      setFormData({
        title_en: '',
        title_fa: '',
        description_en: '',
        description_fa: '',
        banner_url: '',
        tags: [],
        selected_product_ids: [],
        auto_populate: true,
        is_active: true,
        order_priority: 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSavePage = () => {
    if (!formData.title_en || !formData.title_fa) {
      toast({
        title: language === 'fa' ? 'خطا' : 'Error',
        description: language === 'fa' ? 'لطفا عنوان را پر کنید' : 'Please fill in the title',
        variant: 'destructive',
      });
      return;
    }

    if (editingPage) {
      setPages(
        pages.map((p) =>
          p.id === editingPage.id
            ? { ...editingPage, ...formData, updated_at: new Date().toISOString() }
            : p
        )
      );
      toast({
        title: language === 'fa' ? 'موفق' : 'Success',
        description: language === 'fa' ? 'صفحه بروزرسانی شد' : 'Page updated successfully',
      });
    } else {
      const newPage: StorePage = {
        id: Date.now().toString(),
        ...formData,
        created_at: new Date().toISOString(),
      } as StorePage;
      setPages([...pages, newPage].sort((a, b) => a.order_priority - b.order_priority));
      toast({
        title: language === 'fa' ? 'موفق' : 'Success',
        description: language === 'fa' ? 'صفحه ایجاد شد' : 'Page created successfully',
      });
    }

    setIsDialogOpen(false);
  };

  const handleDeletePage = (id: string) => {
    setPages(pages.filter((p) => p.id !== id));
    toast({
      title: language === 'fa' ? 'موفق' : 'Success',
      description: language === 'fa' ? 'صفحه حذف شد' : 'Page deleted successfully',
    });
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, banner_url: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleExpandPage = (id: string) => {
    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedPages(newExpanded);
  };

  const movePageOrder = (id: string, direction: 'up' | 'down') => {
    const index = pages.findIndex((p) => p.id === id);
    if (
      (direction === 'up' && index > 0) ||
      (direction === 'down' && index < pages.length - 1)
    ) {
      const newPages = [...pages];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      [newPages[index].order_priority, newPages[newIndex].order_priority] = [
        newPages[newIndex].order_priority,
        newPages[index].order_priority,
      ];
      setPages(
        newPages.sort((a, b) => a.order_priority - b.order_priority)
      );
    }
  };

  return (
    <AdminLayout>
      <div className={`space-y-6 ${dir === 'rtl' ? 'rtl' : 'ltr'}`} dir={dir}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {language === 'fa' ? 'صفحات فروشگاه' : 'Store Pages'}
            </h1>
            <p className="text-gray-600 mt-2">
              {language === 'fa'
                ? 'مدیریت بخش‌ها و صفحات فروشگاه برای نمایش محصولات'
                : 'Manage store pages and sections to display products'}
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            {language === 'fa' ? 'افزودن صفحه' : 'Add Page'}
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder={language === 'fa' ? 'جستجوی صفحات...' : 'Search pages...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${dir === 'rtl' ? 'pr-10' : 'pl-10'}`}
          />
        </div>

        {/* Pages List */}
        <div className="space-y-4">
          {filteredPages.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">
                  {language === 'fa' ? 'هیچ صفحه‌ای یافت نشد' : 'No pages found'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredPages.map((page) => (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Page Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {language === 'fa' ? page.title_fa : page.title_en}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {language === 'fa'
                                  ? page.description_fa
                                  : page.description_en}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={page.is_active ? 'default' : 'secondary'}
                            className={
                              page.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }
                          >
                            {page.is_active
                              ? language === 'fa'
                                ? 'فعال'
                                : 'Active'
                              : language === 'fa'
                                ? 'غیرفعال'
                                : 'Inactive'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpandPage(page.id)}
                          >
                            {expandedPages.has(page.id) ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Banner Preview */}
                      {page.banner_url && (
                        <div className="rounded-lg overflow-hidden">
                          <img
                            src={page.banner_url}
                            alt="Banner"
                            className="w-full h-40 object-cover"
                          />
                        </div>
                      )}

                      {/* Expanded Content */}
                      {expandedPages.has(page.id) && (
                        <div className="space-y-4 border-t pt-4">
                          {/* Tags */}
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              {language === 'fa' ? 'برچسب‌ها' : 'Tags'}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {page.tags.map((tag) => {
                                const tagObj = AVAILABLE_TAGS.find((t) => t.key === tag);
                                return (
                                  <Badge key={tag} variant="outline">
                                    {language === 'fa'
                                      ? tagObj?.fa || tag
                                      : tagObj?.en || tag}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>

                          {/* Product Count */}
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              {language === 'fa'
                                ? `محصولات: ${page.selected_product_ids.length}`
                                : `Products: ${page.selected_product_ids.length}`}
                            </p>
                            {page.auto_populate && (
                              <p className="text-xs text-gray-500 mt-1">
                                {language === 'fa'
                                  ? '(خودکار از برچسب‌ها)'
                                  : '(Auto-populated from tags)'}
                              </p>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDialog(page)}
                            >
                              <Edit2 className="w-4 h-4 mr-2" />
                              {language === 'fa' ? 'ویرایش' : 'Edit'}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeletePage(page.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              {language === 'fa' ? 'حذف' : 'Delete'}
                            </Button>
                            <div className="flex gap-1 ml-auto">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => movePageOrder(page.id, 'up')}
                              >
                                <ChevronUp className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => movePageOrder(page.id, 'down')}
                              >
                                <ChevronDown className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Dialog for Create/Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPage
                ? language === 'fa'
                  ? 'ویرایش صفحه'
                  : 'Edit Page'
                : language === 'fa'
                  ? 'ایجاد صفحه جدید'
                  : 'Create New Page'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">
                  {language === 'fa' ? 'اطلاعات اساسی' : 'Basic Info'}
                </TabsTrigger>
                <TabsTrigger value="products">
                  {language === 'fa' ? 'محصولات' : 'Products'}
                </TabsTrigger>
                <TabsTrigger value="settings">
                  {language === 'fa' ? 'تنظیمات' : 'Settings'}
                </TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title_en">
                      {language === 'fa' ? 'عنوان (انگلیسی)' : 'Title (English)'}
                    </Label>
                    <Input
                      id="title_en"
                      value={formData.title_en || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, title_en: e.target.value })
                      }
                      placeholder="e.g., Best Sellers"
                    />
                  </div>
                  <div>
                    <Label htmlFor="title_fa">
                      {language === 'fa' ? 'عنوان (فارسی)' : 'Title (Persian)'}
                    </Label>
                    <Input
                      id="title_fa"
                      value={formData.title_fa || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, title_fa: e.target.value })
                      }
                      placeholder="مثل: پرفروش‌ها"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description_en">
                    {language === 'fa'
                      ? 'توضیحات (انگلیسی)'
                      : 'Description (English)'}
                  </Label>
                  <Textarea
                    id="description_en"
                    value={formData.description_en || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, description_en: e.target.value })
                    }
                    placeholder="Describe this section..."
                  />
                </div>

                <div>
                  <Label htmlFor="description_fa">
                    {language === 'fa'
                      ? 'توضیحات (فارسی)'
                      : 'Description (Persian)'}
                  </Label>
                  <Textarea
                    id="description_fa"
                    value={formData.description_fa || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, description_fa: e.target.value })
                    }
                    placeholder="توضیح این بخش..."
                    dir="rtl"
                  />
                </div>

                {/* Banner Upload */}
                <div>
                  <Label htmlFor="banner">
                    {language === 'fa' ? 'بنر/تصویر' : 'Banner Image'}
                  </Label>
                  <div className="mt-2 space-y-3">
                    {formData.banner_url && (
                      <div className="relative rounded-lg overflow-hidden">
                        <img
                          src={formData.banner_url}
                          alt="Banner preview"
                          className="w-full h-32 object-cover"
                        />
                        <button
                          onClick={() =>
                            setFormData({ ...formData, banner_url: '' })
                          }
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500">
                      <div className="text-center">
                        <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          {language === 'fa'
                            ? 'تصویر را انتخاب کنید یا بکشید'
                            : 'Click or drag image'}
                        </p>
                      </div>
                      <input
                        id="banner"
                        type="file"
                        accept="image/*"
                        onChange={handleBannerUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </TabsContent>

              {/* Products Tab */}
              <TabsContent value="products" className="space-y-4 mt-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label>
                      {language === 'fa'
                        ? 'روش انتخاب م��صولات'
                        : 'Product Selection Method'}
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {language === 'fa' ? 'خودکار' : 'Auto'}
                      </span>
                      <Switch
                        checked={formData.auto_populate || false}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, auto_populate: checked })
                        }
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {formData.auto_populate
                      ? language === 'fa'
                        ? 'محصولات براساس برچسب‌های انتخاب‌شده اضافه می‌شوند'
                        : 'Products will be auto-selected based on tags'
                      : language === 'fa'
                        ? 'محصولات را به صورت دستی انتخاب کنید'
                        : 'Manually select products'}
                  </p>
                </div>

                {/* Tags Selection */}
                <div>
                  <Label>
                    {language === 'fa' ? 'برچسب‌ها' : 'Tags'}
                  </Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {AVAILABLE_TAGS.map((tag) => (
                      <button
                        key={tag.key}
                        onClick={() => {
                          const currentTags = formData.tags || [];
                          if (currentTags.includes(tag.key)) {
                            setFormData({
                              ...formData,
                              tags: currentTags.filter((t) => t !== tag.key),
                            });
                          } else {
                            setFormData({
                              ...formData,
                              tags: [...currentTags, tag.key],
                            });
                          }
                        }}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          (formData.tags || []).includes(tag.key)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="font-medium text-sm">
                          {language === 'fa' ? tag.fa : tag.en}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Manual Product Selection */}
                {!formData.auto_populate && (
                  <div>
                    <Label>
                      {language === 'fa'
                        ? 'انتخاب محصولات'
                        : 'Select Products'}
                    </Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {MOCK_PRODUCTS.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => {
                            const currentIds = formData.selected_product_ids || [];
                            if (currentIds.includes(product.id)) {
                              setFormData({
                                ...formData,
                                selected_product_ids: currentIds.filter(
                                  (id) => id !== product.id
                                ),
                              });
                            } else {
                              setFormData({
                                ...formData,
                                selected_product_ids: [
                                  ...currentIds,
                                  product.id,
                                ],
                              });
                            }
                          }}
                          className={`p-3 rounded-lg border-2 transition-all overflow-hidden ${
                            (formData.selected_product_ids || []).includes(
                              product.id
                            )
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={product.image_url}
                            alt="Product"
                            className="w-full h-20 object-cover rounded mb-2"
                          />
                          <p className="font-medium text-xs line-clamp-2">
                            {language === 'fa'
                              ? product.name_fa
                              : product.name_en}
                          </p>
                          <p className="text-xs text-blue-600 font-semibold mt-1">
                            ${product.price}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-4 mt-4">
                <div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>
                      {language === 'fa' ? 'فعال' : 'Active'}
                    </Label>
                    <Switch
                      checked={formData.is_active || false}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_active: checked })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="order_priority">
                    {language === 'fa' ? 'اولویت نمایش' : 'Display Priority'}
                  </Label>
                  <Input
                    id="order_priority"
                    type="number"
                    value={formData.order_priority || 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order_priority: parseInt(e.target.value),
                      })
                    }
                    placeholder="0 = First"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {language === 'fa'
                      ? 'عدد کوچک‌تر = نمایش قبل‌تر'
                      : 'Lower number = display first'}
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                {language === 'fa' ? 'انصراف' : 'Cancel'}
              </Button>
              <Button onClick={handleSavePage} className="bg-blue-600 hover:bg-blue-700">
                {language === 'fa' ? 'ذخیره' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
