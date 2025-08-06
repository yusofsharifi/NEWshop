import { useEffect, useState } from 'react';
import { User, Mail, Phone, ShoppingBag, Search, Filter, MoreVertical, Ban, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AdminLayout from '@/components/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'blocked';
  orders_count: number;
  total_spent: number;
  last_order_date?: string;
  registration_date: string;
  location?: string;
}

export default function AdminCustomers() {
  const { t, dir, language } = useLanguage();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      // Simulate API call with mock data
      setTimeout(() => {
        const mockCustomers: Customer[] = [
          {
            id: 1,
            name: 'احمد حسینی',
            email: 'ahmad.hosseini@example.com',
            phone: '+98 912 345 6789',
            status: 'active',
            orders_count: 5,
            total_spent: 2450,
            last_order_date: '2024-01-15T10:30:00Z',
            registration_date: '2023-06-15T09:20:00Z',
            location: 'تهران، ایران'
          },
          {
            id: 2,
            name: 'فاطمه احمدی',
            email: 'fateme.ahmadi@example.com',
            phone: '+98 911 234 5678',
            status: 'active',
            orders_count: 3,
            total_spent: 1890,
            last_order_date: '2024-01-14T15:45:00Z',
            registration_date: '2023-08-22T14:30:00Z',
            location: 'اصفهان، ایران'
          },
          {
            id: 3,
            name: 'علی رضایی',
            email: 'ali.rezaei@example.com',
            phone: '+98 913 456 7890',
            status: 'active',
            orders_count: 1,
            total_spent: 379,
            last_order_date: '2024-01-13T09:20:00Z',
            registration_date: '2024-01-10T11:15:00Z',
            location: 'شیراز، ایران'
          },
          {
            id: 4,
            name: 'مریم نوری',
            email: 'maryam.nouri@example.com',
            phone: '+98 914 567 8901',
            status: 'active',
            orders_count: 8,
            total_spent: 4200,
            last_order_date: '2024-01-12T14:10:00Z',
            registration_date: '2023-03-05T16:45:00Z',
            location: 'مشهد، ایران'
          },
          {
            id: 5,
            name: 'حسن محمدی',
            email: 'hassan.mohammadi@example.com',
            phone: '+98 915 678 9012',
            status: 'inactive',
            orders_count: 0,
            total_spent: 0,
            registration_date: '2023-12-01T10:00:00Z',
            location: 'کرج، ایران'
          },
          {
            id: 6,
            name: 'زهرا کریمی',
            email: 'zahra.karimi@example.com',
            phone: '+98 916 789 0123',
            status: 'blocked',
            orders_count: 2,
            total_spent: 150,
            last_order_date: '2023-11-20T12:30:00Z',
            registration_date: '2023-10-15T08:20:00Z',
            location: 'تبریز، ایران'
          }
        ];
        setCustomers(mockCustomers);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      inactive: { variant: 'secondary' as const, icon: User, color: 'text-gray-600' },
      blocked: { variant: 'destructive' as const, icon: Ban, color: 'text-red-600' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config?.icon || User;

    return (
      <Badge variant={config?.variant || 'secondary'} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {language === 'fa' ? 
          (status === 'active' ? 'فعال' :
           status === 'inactive' ? 'غیرفعال' :
           status === 'blocked' ? 'مسدود' : status) : 
          status.charAt(0).toUpperCase() + status.slice(1)
        }
      </Badge>
    );
  };

  const handleUpdateCustomerStatus = async (customerId: number, newStatus: string) => {
    try {
      // Simulate API call
      setCustomers(prev => prev.map(customer => 
        customer.id === customerId ? { ...customer, status: newStatus as any } : customer
      ));
    } catch (error) {
      console.error('Error updating customer status:', error);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    const words = name.split(' ');
    return words.map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();
  };

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const inactiveCustomers = customers.filter(c => c.status === 'inactive').length;
  const blockedCustomers = customers.filter(c => c.status === 'blocked').length;

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
              {language === 'fa' ? 'مدیریت مشتریان' : 'Customer Management'}
            </h2>
            <p className="text-gray-600">
              {language === 'fa' 
                ? 'مشاهده و مدیریت حساب‌های کاربری مشتریان'
                : 'View and manage customer accounts'
              }
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: language === 'fa' ? 'کل مشتریان' : 'Total Customers', value: totalCustomers, color: 'bg-blue-500' },
            { title: language === 'fa' ? 'فعال' : 'Active', value: activeCustomers, color: 'bg-green-500' },
            { title: language === 'fa' ? 'غیرفعال' : 'Inactive', value: inactiveCustomers, color: 'bg-gray-500' },
            { title: language === 'fa' ? 'مسدود' : 'Blocked', value: blockedCustomers, color: 'bg-red-500' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white font-bold text-lg`}>
                      {stat.value}
                    </div>
                    <div className={`${dir === 'rtl' ? 'mr-4' : 'ml-4'}`}>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4`} />
                  <Input
                    placeholder={language === 'fa' ? 'جستجو مشتریان...' : 'Search customers...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`${dir === 'rtl' ? 'pr-10' : 'pl-10'}`}
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder={language === 'fa' ? 'فیلتر وضعیت' : 'Filter by status'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'fa' ? 'همه وضعیت‌ها' : 'All Statuses'}</SelectItem>
                    <SelectItem value="active">{language === 'fa' ? 'فعال' : 'Active'}</SelectItem>
                    <SelectItem value="inactive">{language === 'fa' ? 'غیرفعال' : 'Inactive'}</SelectItem>
                    <SelectItem value="blocked">{language === 'fa' ? 'مسدود' : 'Blocked'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Customers Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'fa' ? 'مشتریان' : 'Customers'} ({filteredCustomers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">
                    {language === 'fa' ? 'بارگذاری مشتریان...' : 'Loading customers...'}
                  </p>
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    {language === 'fa' ? 'هیچ مشتری یافت نشد' : 'No customers found'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className={`${dir === 'rtl' ? 'text-right' : 'text-left'} py-3 px-4 font-medium text-gray-700`}>
                          {language === 'fa' ? 'مشتری' : 'Customer'}
                        </th>
                        <th className={`${dir === 'rtl' ? 'text-right' : 'text-left'} py-3 px-4 font-medium text-gray-700`}>
                          {language === 'fa' ? 'تماس' : 'Contact'}
                        </th>
                        <th className={`${dir === 'rtl' ? 'text-right' : 'text-left'} py-3 px-4 font-medium text-gray-700`}>
                          {language === 'fa' ? 'سفارشات' : 'Orders'}
                        </th>
                        <th className={`${dir === 'rtl' ? 'text-right' : 'text-left'} py-3 px-4 font-medium text-gray-700`}>
                          {language === 'fa' ? 'مجموع خرید' : 'Total Spent'}
                        </th>
                        <th className={`${dir === 'rtl' ? 'text-right' : 'text-left'} py-3 px-4 font-medium text-gray-700`}>
                          {language === 'fa' ? 'وضعیت' : 'Status'}
                        </th>
                        <th className={`${dir === 'rtl' ? 'text-right' : 'text-left'} py-3 px-4 font-medium text-gray-700`}>
                          {language === 'fa' ? 'تاریخ عضویت' : 'Joined'}
                        </th>
                        <th className={`${dir === 'rtl' ? 'text-right' : 'text-left'} py-3 px-4 font-medium text-gray-700`}>
                          {language === 'fa' ? 'عملیات' : 'Actions'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((customer, index) => (
                        <motion.tr 
                          key={customer.id} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-4 px-4">
                            <div className={`flex items-center ${dir === 'rtl' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                              <Avatar>
                                <AvatarFallback className="bg-blue-100 text-blue-700">
                                  {getInitials(customer.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-gray-900">{customer.name}</div>
                                {customer.location && (
                                  <div className="text-sm text-gray-500">{customer.location}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <div className="flex items-center text-sm text-gray-900">
                                <Mail className="w-4 h-4 mr-1" />
                                {customer.email}
                              </div>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <Phone className="w-4 h-4 mr-1" />
                                {customer.phone}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <ShoppingBag className="w-4 h-4 mr-1 text-gray-400" />
                              <span className="font-medium text-gray-900">{customer.orders_count}</span>
                            </div>
                            {customer.last_order_date && (
                              <div className="text-xs text-gray-500 mt-1">
                                {language === 'fa' ? 'آخرین:' : 'Last:'} {formatDate(customer.last_order_date)}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-medium text-gray-900">${customer.total_spent.toLocaleString()}</span>
                          </td>
                          <td className="py-4 px-4">
                            {getStatusBadge(customer.status)}
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-gray-600">{formatDate(customer.registration_date)}</span>
                          </td>
                          <td className="py-4 px-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleUpdateCustomerStatus(customer.id, 'active')}>
                                  {language === 'fa' ? 'فعال کردن' : 'Activate'}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateCustomerStatus(customer.id, 'inactive')}>
                                  {language === 'fa' ? 'غیرفعال کردن' : 'Deactivate'}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleUpdateCustomerStatus(customer.id, 'blocked')}
                                  className="text-red-600"
                                >
                                  {language === 'fa' ? 'مسدود کردن' : 'Block'}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
