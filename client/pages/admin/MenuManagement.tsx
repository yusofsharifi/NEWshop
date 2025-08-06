import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Move, 
  ChevronDown, 
  ChevronRight,
  Menu as MenuIcon,
  Eye,
  EyeOff,
  Link as LinkIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/components/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

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

interface MenuForm {
  name_en: string;
  name_fa: string;
  url: string;
  target: '_self' | '_blank';
  icon: string;
  parent_id: number | null;
  is_active: boolean;
  is_dropdown: boolean;
}

export default function MenuManagement() {
  const { language, dir } = useLanguage();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState<MenuForm>({
    name_en: '',
    name_fa: '',
    url: '',
    target: '_self',
    icon: '',
    parent_id: null,
    is_active: true,
    is_dropdown: false
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    // Mock data - در پروژه واقعی از API دریافت می‌شود
    const mockData: MenuItem[] = [
      {
        id: 1,
        name_en: 'Products',
        name_fa: 'محصولات',
        url: '/products',
        target: '_self',
        icon: 'Package',
        order: 1,
        is_active: true,
        is_dropdown: true,
        children: [
          {
            id: 2,
            name_en: 'Pool Pumps',
            name_fa: 'پمپ‌های استخر',
            url: '/category/pumps',
            target: '_self',
            parent_id: 1,
            order: 1,
            is_active: true,
            is_dropdown: false
          },
          {
            id: 3,
            name_en: 'Filters',
            name_fa: 'فیلترها',
            url: '/category/filters',
            target: '_self',
            parent_id: 1,
            order: 2,
            is_active: true,
            is_dropdown: false
          },
          {
            id: 4,
            name_en: 'Heaters',
            name_fa: 'بخاری‌ها',
            url: '/category/heaters',
            target: '_self',
            parent_id: 1,
            order: 3,
            is_active: true,
            is_dropdown: false
          }
        ]
      },
      {
        id: 5,
        name_en: 'Blog',
        name_fa: 'وبلاگ',
        url: '/blog',
        target: '_self',
        icon: 'FileText',
        order: 2,
        is_active: true,
        is_dropdown: false
      },
      {
        id: 6,
        name_en: 'Contact',
        name_fa: 'تماس با ما',
        url: '/contact',
        target: '_self',
        icon: 'Phone',
        order: 3,
        is_active: true,
        is_dropdown: false
      }
    ];
    setMenuItems(mockData);
  };

  const handleSaveMenuItem = () => {
    if (editingItem) {
      // Update existing item
      setMenuItems(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData, id: editingItem.id }
          : item
      ));
    } else {
      // Create new item
      const newItem: MenuItem = {
        ...formData,
        id: Date.now(),
        order: menuItems.length + 1,
        children: []
      };
      setMenuItems(prev => [...prev, newItem]);
    }
    
    resetForm();
  };

  const handleDeleteMenuItem = (id: number) => {
    if (confirm(language === 'fa' ? 'آیا از حذف این منو مطمئن هستید؟' : 'Are you sure you want to delete this menu item?')) {
      setMenuItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      name_en: '',
      name_fa: '',
      url: '',
      target: '_self',
      icon: '',
      parent_id: null,
      is_active: true,
      is_dropdown: false
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name_en: item.name_en,
      name_fa: item.name_fa,
      url: item.url,
      target: item.target,
      icon: item.icon || '',
      parent_id: item.parent_id || null,
      is_active: item.is_active,
      is_dropdown: item.is_dropdown
    });
    setIsDialogOpen(true);
  };

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleItemStatus = (id: number) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, is_active: !item.is_active } : item
    ));
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`${level > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''} mb-2`}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {item.children && item.children.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(item.id)}
                  className="p-1"
                >
                  {expandedItems.has(item.id) ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                  }
                </Button>
              )}
              
              <div className="flex items-center space-x-2">
                <MenuIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <h4 className="font-medium text-gray-900">
                    {language === 'fa' ? item.name_fa : item.name_en}
                  </h4>
                  <p className="text-sm text-gray-500">{item.url}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {item.is_dropdown && (
                  <Badge variant="outline" className="text-blue-600">
                    {language === 'fa' ? 'کشویی' : 'Dropdown'}
                  </Badge>
                )}
                <Badge variant={item.is_active ? 'default' : 'secondary'}>
                  {item.is_active ? 
                    (language === 'fa' ? 'فعال' : 'Active') : 
                    (language === 'fa' ? 'غیرفعال' : 'Inactive')
                  }
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleItemStatus(item.id)}
                title={language === 'fa' ? 'تغییر وضعیت' : 'Toggle status'}
              >
                {item.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openEditDialog(item)}
                title={language === 'fa' ? 'ویرایش' : 'Edit'}
              >
                <Edit className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteMenuItem(item.id)}
                className="text-red-600 hover:text-red-700"
                title={language === 'fa' ? 'حذف' : 'Delete'}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {expandedItems.has(item.id) && item.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2"
          >
            {item.children.map(child => renderMenuItem(child, level + 1))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

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
              {language === 'fa' ? 'مدیریت منو' : 'Menu Management'}
            </h2>
            <p className="text-gray-600">
              {language === 'fa' 
                ? 'مدیریت منوهای سایت و تنظیم ساختار آن‌ها'
                : 'Manage website menus and configure their structure'
              }
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-blue-600 hover:bg-blue-700" 
                onClick={() => { resetForm(); setIsDialogOpen(true); }}
              >
                <Plus className="w-4 h-4 mr-2" />
                {language === 'fa' ? 'افزودن منو' : 'Add Menu Item'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingItem 
                    ? (language === 'fa' ? 'ویرایش منو' : 'Edit Menu Item')
                    : (language === 'fa' ? 'افزودن منو جدید' : 'Add New Menu Item')
                  }
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name_en">{language === 'fa' ? 'نام (انگلیسی)' : 'Name (English)'}</Label>
                    <Input
                      id="name_en"
                      value={formData.name_en}
                      onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
                      placeholder="Products"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name_fa">{language === 'fa' ? 'نام (فارسی)' : 'Name (Persian)'}</Label>
                    <Input
                      id="name_fa"
                      value={formData.name_fa}
                      onChange={(e) => setFormData(prev => ({ ...prev, name_fa: e.target.value }))}
                      placeholder="محصولات"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="url">{language === 'fa' ? 'آدرس لینک' : 'URL'}</Label>
                    <Input
                      id="url"
                      value={formData.url}
                      onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="/products"
                    />
                  </div>
                  <div>
                    <Label htmlFor="target">{language === 'fa' ? 'نحوه باز شدن' : 'Target'}</Label>
                    <Select value={formData.target} onValueChange={(value: '_self' | '_blank') => setFormData(prev => ({ ...prev, target: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_self">
                          {language === 'fa' ? 'همین صفحه' : 'Same Window'}
                        </SelectItem>
                        <SelectItem value="_blank">
                          {language === 'fa' ? 'پنجره جدید' : 'New Window'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="icon">{language === 'fa' ? 'آیکون (اختیاری)' : 'Icon (Optional)'}</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="Package"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{language === 'fa' ? 'منوی فعال' : 'Active Menu'}</Label>
                      <p className="text-sm text-gray-500">
                        {language === 'fa' ? 'منو در سایت نمایش داده می‌شود' : 'Menu will be visible on the website'}
                      </p>
                    </div>
                    <Switch 
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{language === 'fa' ? 'منوی کشویی' : 'Dropdown Menu'}</Label>
                      <p className="text-sm text-gray-500">
                        {language === 'fa' ? 'منو دارای زیرمجموعه است' : 'Menu has sub-items'}
                      </p>
                    </div>
                    <Switch 
                      checked={formData.is_dropdown}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_dropdown: checked }))}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    {language === 'fa' ? 'لغو' : 'Cancel'}
                  </Button>
                  <Button onClick={handleSaveMenuItem}>
                    {language === 'fa' ? 'ذخیره' : 'Save'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MenuIcon className="w-5 h-5 mr-2" />
                {language === 'fa' ? 'آیتم‌های منو' : 'Menu Items'} ({menuItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {menuItems.length === 0 ? (
                <div className="text-center py-8">
                  <MenuIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {language === 'fa' ? 'هیچ منویی ایجاد نشده است' : 'No menu items created yet'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {menuItems.map(item => renderMenuItem(item))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Preview Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'fa' ? 'پیش‌نمایش منو' : 'Menu Preview'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-6">
                  {menuItems
                    .filter(item => item.is_active)
                    .map(item => (
                      <div key={item.id} className="relative group">
                        <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                          <span>{language === 'fa' ? item.name_fa : item.name_en}</span>
                          {item.is_dropdown && <ChevronDown className="w-4 h-4" />}
                        </button>
                        
                        {item.is_dropdown && item.children && (
                          <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                            {item.children.map(child => (
                              <a 
                                key={child.id}
                                href={child.url}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                {language === 'fa' ? child.name_fa : child.name_en}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
