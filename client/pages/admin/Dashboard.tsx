import { useEffect, useState } from 'react';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  revenue: number;
}

export default function AdminDashboard() {
  const { t, dir } = useLanguage();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading stats - in real app, fetch from API
    setTimeout(() => {
      setStats({
        totalProducts: 156,
        totalOrders: 89,
        totalCustomers: 234,
        revenue: 45680
      });
      setLoading(false);
    }, 1000);
  }, []);

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts.toString(),
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Customers',
      value: stats.totalCustomers.toString(),
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-600">Welcome to your pool equipment store admin panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`w-8 h-8 rounded-full ${card.bgColor} flex items-center justify-center`}>
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : card.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <button className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Add New Product</div>
                <div className="text-sm text-gray-500">Add a new pool equipment item to your catalog</div>
              </button>
              
              <button className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">View Orders</div>
                <div className="text-sm text-gray-500">Check recent orders and update their status</div>
              </button>
              
              <button className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Manage Categories</div>
                <div className="text-sm text-gray-500">Organize your product categories</div>
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="text-sm">
                    <span className="font-medium">New order #1234</span>
                    <span className="text-gray-500"> - 2 minutes ago</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="text-sm">
                    <span className="font-medium">Product added: Pool Pump XL</span>
                    <span className="text-gray-500"> - 15 minutes ago</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="text-sm">
                    <span className="font-medium">Stock alert: Filter cartridges low</span>
                    <span className="text-gray-500"> - 1 hour ago</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="text-sm">
                    <span className="font-medium">Customer inquiry received</span>
                    <span className="text-gray-500"> - 2 hours ago</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
