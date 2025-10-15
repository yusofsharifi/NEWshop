import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLayout from '@/components/AdminLayout';
import { Package, Plus, Minus, AlertTriangle, RefreshCcw, ClipboardList } from 'lucide-react';

interface InventoryItem {
  id: number;
  sku: string;
  name_en: string;
  name_fa: string;
  stock: number;
  reserved: number;
  reorder_level: number;
  incoming: number;
  location?: string;
  category?: string;
}

interface StockMovement {
  id: string;
  sku: string;
  productId: number;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  note?: string;
  createdAt: string;
}

export default function AdminInventory() {
  const { language, dir } = useLanguage();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [search, setSearch] = useState('');
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [adjustNote, setAdjustNote] = useState('');

  useEffect(() => {
    const seed: InventoryItem[] = [
      { id: 1, sku: 'PUMP-XL-001', name_en: 'Pool Pump XL', name_fa: 'پمپ استخر XL', stock: 32, reserved: 3, reorder_level: 10, incoming: 20, location: 'A-01', category: 'pumps' },
      { id: 2, sku: 'FLT-SAND-200', name_en: 'Sand Filter 200', name_fa: 'فیلتر شنی ۲۰۰', stock: 8, reserved: 1, reorder_level: 12, incoming: 0, location: 'B-04', category: 'filters' },
      { id: 3, sku: 'LED-LIGHT-RGB', name_en: 'LED Pool Light RGB', name_fa: 'چراغ LED استخر RGB', stock: 54, reserved: 5, reorder_level: 15, incoming: 40, location: 'C-02', category: 'lights' },
      { id: 4, sku: 'CHEM-CL-10', name_en: 'Chlorine 10kg', name_fa: 'کلر ۱۰ کیلو', stock: 5, reserved: 0, reorder_level: 20, incoming: 50, location: 'D-07', category: 'chemicals' },
    ];
    setItems(seed);
    setMovements([
      { id: 'm1', sku: 'PUMP-XL-001', productId: 1, type: 'out', quantity: 2, note: 'Order #1001', createdAt: new Date().toISOString() },
      { id: 'm2', sku: 'FLT-SAND-200', productId: 2, type: 'adjustment', quantity: -1, note: language === 'fa' ? 'شکستگی' : 'Damaged', createdAt: new Date().toISOString() },
      { id: 'm3', sku: 'LED-LIGHT-RGB', productId: 3, type: 'in', quantity: 40, note: language === 'fa' ? 'ورود محموله' : 'Incoming shipment', createdAt: new Date().toISOString() },
    ]);
  }, [language]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(i =>
      i.sku.toLowerCase().includes(q) ||
      i.name_en.toLowerCase().includes(q) ||
      i.name_fa.toLowerCase().includes(q)
    );
  }, [items, search]);

  const lowStock = (it: InventoryItem) => it.stock <= it.reorder_level;
  const available = (it: InventoryItem) => Math.max(0, it.stock - it.reserved);

  const applyAdjustment = () => {
    if (!adjustItem || !Number.isFinite(adjustQty) || adjustQty === 0) return;
    setItems(prev => prev.map(it => it.id === adjustItem.id ? { ...it, stock: Math.max(0, it.stock + adjustQty) } : it));
    setMovements(prev => [{
      id: 'm' + (prev.length + 1),
      sku: adjustItem.sku,
      productId: adjustItem.id,
      type: adjustQty > 0 ? 'in' : 'adjustment',
      quantity: adjustQty,
      note: adjustNote || (language === 'fa' ? 'اصلاح موجودی' : 'Stock adjustment'),
      createdAt: new Date().toISOString()
    }, ...prev]);
    setAdjustQty(0);
    setAdjustNote('');
    setAdjustItem(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6" dir={dir}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{language === 'fa' ? 'مدیریت انبار' : 'Inventory Management'}</h2>
            <p className="text-gray-600">{language === 'fa' ? 'کنترل موجودی، هشدار کمبود و ثبت ورود/خروج کالا' : 'Control stock, low-stock alerts, and stock movements'}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <RefreshCcw className="w-4 h-4 mr-2" /> {language === 'fa' ? 'نوسا��ی' : 'Refresh'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">{language === 'fa' ? 'نمای کلی' : 'Overview'}</TabsTrigger>
            <TabsTrigger value="movements">{language === 'fa' ? 'ورود/خروج' : 'Movements'}</TabsTrigger>
            <TabsTrigger value="alerts">{language === 'fa' ? 'هشدارها' : 'Alerts'}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{language === 'fa' ? 'موجودی کالا' : 'Stock Levels'}</CardTitle>
                <div className="flex items-center gap-3">
                  <Input placeholder={language === 'fa' ? 'جستجو بر اساس نام یا کد' : 'Search by name or SKU'} value={search} onChange={e => setSearch(e.target.value)} className="w-64" />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>{language === 'fa' ? 'محصول' : 'Product'}</TableHead>
                      <TableHead>{language === 'fa' ? 'موجودی' : 'Stock'}</TableHead>
                      <TableHead>{language === 'fa' ? 'رزرو' : 'Reserved'}</TableHead>
                      <TableHead>{language === 'fa' ? 'قابل فروش' : 'Available'}</TableHead>
                      <TableHead>{language === 'fa' ? 'حد سفارش' : 'Reorder'}</TableHead>
                      <TableHead>{language === 'fa' ? 'ورودی' : 'Incoming'}</TableHead>
                      <TableHead>{language === 'fa' ? 'عملیات' : 'Actions'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(it => (
                      <TableRow key={it.id}>
                        <TableCell className="font-mono text-xs">{it.sku}</TableCell>
                        <TableCell>{language === 'fa' ? it.name_fa : it.name_en}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{it.stock}</span>
                            {lowStock(it) && (
                              <Badge variant="destructive" className="flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> {language === 'fa' ? 'کمبود' : 'Low'}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{it.reserved}</TableCell>
                        <TableCell>{available(it)}</TableCell>
                        <TableCell>{it.reorder_level}</TableCell>
                        <TableCell>{it.incoming}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="secondary" onClick={() => { setAdjustItem(it); setAdjustQty(1); }}>
                              <Plus className="w-4 h-4 mr-1" /> {language === 'fa' ? 'افزایش' : 'Add'}
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => { setAdjustItem(it); setAdjustQty(-1); }}>
                              <Minus className="w-4 h-4 mr-1" /> {language === 'fa' ? 'کاهش' : 'Reduce'}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Dialog open={!!adjustItem} onOpenChange={(o) => { if (!o) { setAdjustItem(null); setAdjustQty(0); setAdjustNote(''); } }}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{language === 'fa' ? 'اصلاح موجودی' : 'Adjust Stock'}</DialogTitle>
                  <DialogDescription>
                    {adjustItem ? (language === 'fa' ? `محصول: ${adjustItem.name_fa} (${adjustItem.sku})` : `Product: ${adjustItem.name_en} (${adjustItem.sku})`) : ''}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>{language === 'fa' ? 'تعداد' : 'Quantity'}</Label>
                    <Input type="number" value={adjustQty} onChange={(e) => setAdjustQty(parseInt(e.target.value || '0', 10))} />
                  </div>
                  <div>
                    <Label>{language === 'fa' ? 'توضیحات' : 'Note'}</Label>
                    <Input value={adjustNote} onChange={(e) => setAdjustNote(e.target.value)} placeholder={language === 'fa' ? 'دلیل اصلاح موجودی' : 'Reason for adjustment'} />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => { setAdjustItem(null); setAdjustQty(0); setAdjustNote(''); }}>
                      {language === 'fa' ? 'انصراف' : 'Cancel'}
                    </Button>
                    <Button onClick={applyAdjustment}>{language === 'fa' ? 'ثبت' : 'Apply'}</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="movements">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2"><ClipboardList className="w-4 h-4" /> {language === 'fa' ? 'سوابق موجودی' : 'Stock Movements'}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>{language === 'fa' ? 'نوع' : 'Type'}</TableHead>
                      <TableHead>{language === 'fa' ? 'تعداد' : 'Qty'}</TableHead>
                      <TableHead>{language === 'fa' ? 'توضیح' : 'Note'}</TableHead>
                      <TableHead>{language === 'fa' ? 'تاریخ' : 'Date'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movements.map(m => (
                      <TableRow key={m.id}>
                        <TableCell className="font-mono text-xs">{m.sku}</TableCell>
                        <TableCell>
                          {m.type === 'in' ? (language === 'fa' ? 'ورود' : 'In') : m.type === 'out' ? (language === 'fa' ? 'خروج' : 'Out') : (language === 'fa' ? 'اصلاح' : 'Adjust')}
                        </TableCell>
                        <TableCell className={m.quantity < 0 ? 'text-red-600' : 'text-green-700'}>{m.quantity}</TableCell>
                        <TableCell>{m.note || '-'}</TableCell>
                        <TableCell>{new Date(m.createdAt).toLocaleString(language === 'fa' ? 'fa-IR' : 'en-US')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> {language === 'fa' ? 'هشدار کمبود موجودی' : 'Low Stock Alerts'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.filter(lowStock).length === 0 ? (
                  <div className="text-gray-600">{language === 'fa' ? 'هشداری وجود ندارد.' : 'No alerts.'}</div>
                ) : (
                  <div className="space-y-3">
                    {items.filter(lowStock).map(it => (
                      <div key={it.id} className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50">
                        <div className="flex items-center gap-3">
                          <Package className="w-5 h-5 text-yellow-700" />
                          <div>
                            <div className="font-medium">{language === 'fa' ? it.name_fa : it.name_en} <span className="text-xs text-gray-500">({it.sku})</span></div>
                            <div className="text-sm text-gray-600">{language === 'fa' ? `موجودی ${it.stock} | حد سفارش ${it.reorder_level}` : `Stock ${it.stock} | Reorder ${it.reorder_level}`}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="secondary">{language === 'fa' ? 'افزایش موجودی' : 'Restock'}</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{language === 'fa' ? 'ثبت ورود کالا' : 'Add Stock'}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>{language === 'fa' ? 'تعداد' : 'Quantity'}</Label>
                                  <Input type="number" defaultValue={10} onChange={(e)=>{}} />
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline">{language === 'fa' ? 'انصراف' : 'Cancel'}</Button>
                                  <Button>{language === 'fa' ? 'ثبت' : 'Add'}</Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
