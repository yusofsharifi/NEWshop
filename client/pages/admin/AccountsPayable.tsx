import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLayout from '@/components/AdminLayout';
import { formatCurrencyIRR } from '@/lib/utils';
import { Plus, Edit2, Trash2, Eye, CheckCircle, Download, AlertTriangle, Clock, FileText, TrendingUp } from 'lucide-react';

interface BillLineItem {
  line_number: number;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  line_total: number;
}

interface Bill {
  id: string;
  bill_number: string;
  vendor_id: number;
  vendor_name: string;
  bill_date: string;
  due_date: string;
  po_number?: string;
  line_items: BillLineItem[];
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  balance_due: number;
  status: 'draft' | 'received' | 'approved' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';
  payment_terms: string;
  notes?: string;
  created_date: string;
}

interface BillPayment {
  id: string;
  bill_id: string;
  bill_number: string;
  payment_date: string;
  amount: number;
  payment_method: 'check' | 'bank_transfer' | 'credit_card' | 'cash' | 'other';
  reference_number?: string;
  notes?: string;
  recorded_date: string;
}

interface Vendor {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  payment_terms: string;
  tax_id?: string;
  current_due: number;
  total_purchased: number;
  status: 'active' | 'inactive' | 'suspended';
}

export default function AccountsPayable() {
  const { language, dir } = useLanguage();
  const [bills, setBills] = useState<Bill[]>([]);
  const [billPayments, setBillPayments] = useState<BillPayment[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('bills');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Bill Dialog
  const [billDialogOpen, setBillDialogOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [billForm, setBillForm] = useState<Partial<Bill>>({
    bill_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    line_items: [],
    status: 'draft',
    payment_terms: 'Net 30',
  });

  // Payment Dialog
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState<Partial<BillPayment>>({
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'bank_transfer',
  });
  const [selectedBillForPayment, setSelectedBillForPayment] = useState<Bill | null>(null);

  useEffect(() => {
    const sampleVendors: Vendor[] = [
      { id: 1, name: 'Global Pool Systems', email: 'sales@globalpools.com', phone: '+1-555-2001', address: '123 Supply St', payment_terms: 'Net 30', tax_id: 'TAX-001', current_due: 2500000, total_purchased: 12000000, status: 'active' },
      { id: 2, name: 'AquaTech Supplies', email: 'orders@aquatech.com', phone: '+1-555-2002', address: '456 Parts Ave', payment_terms: 'Net 45', tax_id: 'TAX-002', current_due: 1800000, total_purchased: 8000000, status: 'active' },
      { id: 3, name: 'Chemical Solutions Inc', email: 'info@chemsol.com', phone: '+1-555-2003', address: '789 Chem Rd', payment_terms: 'Net 15', tax_id: 'TAX-003', current_due: 0, total_purchased: 5500000, status: 'active' },
    ];
    setVendors(sampleVendors);

    const sampleBills: Bill[] = [
      {
        id: 'bill1',
        bill_number: 'BILL-2024-001',
        vendor_id: 1,
        vendor_name: 'Global Pool Systems',
        bill_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        po_number: 'PO-2024-050',
        line_items: [
          { line_number: 1, description: 'Pool Pump XL', quantity: 10, unit_price: 500000, tax_rate: 0, line_total: 5000000 },
        ],
        subtotal: 5000000,
        tax_amount: 0,
        total_amount: 5000000,
        paid_amount: 2000000,
        balance_due: 3000000,
        status: 'partially_paid',
        payment_terms: 'Net 30',
        created_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'bill2',
        bill_number: 'BILL-2024-002',
        vendor_id: 2,
        vendor_name: 'AquaTech Supplies',
        bill_date: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        due_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        po_number: 'PO-2024-051',
        line_items: [
          { line_number: 1, description: 'Filter Equipment', quantity: 8, unit_price: 300000, tax_rate: 0, line_total: 2400000 },
        ],
        subtotal: 2400000,
        tax_amount: 0,
        total_amount: 2400000,
        paid_amount: 0,
        balance_due: 2400000,
        status: 'overdue',
        payment_terms: 'Net 45',
        created_date: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'bill3',
        bill_number: 'BILL-2024-003',
        vendor_id: 3,
        vendor_name: 'Chemical Solutions Inc',
        bill_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        po_number: 'PO-2024-052',
        line_items: [
          { line_number: 1, description: 'Chlorine Chemicals', quantity: 50, unit_price: 150000, tax_rate: 0, line_total: 7500000 },
        ],
        subtotal: 7500000,
        tax_amount: 0,
        total_amount: 7500000,
        paid_amount: 0,
        balance_due: 7500000,
        status: 'approved',
        payment_terms: 'Net 15',
        created_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    setBills(sampleBills);

    const samplePayments: BillPayment[] = [
      { id: 'pay1', bill_id: 'bill1', bill_number: 'BILL-2024-001', payment_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 2000000, payment_method: 'bank_transfer', reference_number: 'WIRE-P001', recorded_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
    ];
    setBillPayments(samplePayments);
  }, [language]);

  const filtered = useMemo(() => {
    let result = bills;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(b =>
        b.bill_number.toLowerCase().includes(q) ||
        b.vendor_name.toLowerCase().includes(q)
      );
    }
    if (filterStatus !== 'all') {
      result = result.filter(b => b.status === filterStatus);
    }
    return result.sort((a, b) => new Date(b.bill_date).getTime() - new Date(a.bill_date).getTime());
  }, [bills, search, filterStatus]);

  const totalBilled = bills.reduce((sum, bill) => sum + bill.total_amount, 0);
  const totalPaid = bills.reduce((sum, bill) => sum + bill.paid_amount, 0);
  const totalDue = bills.reduce((sum, bill) => sum + bill.balance_due, 0);
  const overdue = bills.filter(b => b.status === 'overdue').reduce((sum, bill) => sum + bill.balance_due, 0);

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-500',
    received: 'bg-blue-500',
    approved: 'bg-cyan-500',
    partially_paid: 'bg-yellow-500',
    paid: 'bg-green-500',
    overdue: 'bg-red-500',
    cancelled: 'bg-gray-500',
  };

  const saveBill = () => {
    if (!billForm.vendor_id) return;
    
    if (editingBill) {
      setBills(prev => prev.map(b => b.id === editingBill.id ? { ...b, ...billForm } as Bill : b));
    } else {
      const newId = 'bill' + (bills.length + 1);
      const newNumber = `BILL-${new Date().getFullYear()}-${String(bills.length + 1).padStart(3, '0')}`;
      setBills([{
        id: newId,
        bill_number: newNumber,
        status: 'draft',
        created_date: new Date().toISOString(),
        line_items: [],
        subtotal: 0,
        tax_amount: 0,
        ...billForm,
      } as Bill, ...bills]);
    }
    setBillDialogOpen(false);
    setEditingBill(null);
    setBillForm({
      bill_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      line_items: [],
      status: 'draft',
      payment_terms: 'Net 30',
    });
  };

  const recordPayment = () => {
    if (!selectedBillForPayment || !paymentForm.amount || paymentForm.amount <= 0) return;
    
    const newPayment: BillPayment = {
      id: 'pay' + (billPayments.length + 1),
      bill_id: selectedBillForPayment.id,
      bill_number: selectedBillForPayment.bill_number,
      payment_date: paymentForm.payment_date || new Date().toISOString().split('T')[0],
      amount: paymentForm.amount || 0,
      payment_method: paymentForm.payment_method || 'bank_transfer',
      reference_number: paymentForm.reference_number,
      notes: paymentForm.notes,
      recorded_date: new Date().toISOString(),
    };
    setBillPayments([newPayment, ...billPayments]);

    // Update bill
    setBills(prev => prev.map(bill => 
      bill.id === selectedBillForPayment.id 
        ? {
            ...bill,
            paid_amount: bill.paid_amount + (paymentForm.amount || 0),
            balance_due: bill.balance_due - (paymentForm.amount || 0),
            status: bill.balance_due - (paymentForm.amount || 0) === 0 ? 'paid' : 'partially_paid'
          }
        : bill
    ));

    setPaymentDialogOpen(false);
    setSelectedBillForPayment(null);
    setPaymentForm({
      payment_date: new Date().toISOString().split('T')[0],
      payment_method: 'bank_transfer',
    });
  };

  const approveBill = (billId: string) => {
    setBills(prev => prev.map(b => 
      b.id === billId ? { ...b, status: 'approved' } : b
    ));
  };

  return (
    <AdminLayout>
      <div className="space-y-6" dir={dir}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{language === 'fa' ? 'حسابهای پرداختنی' : 'Accounts Payable'}</h2>
            <p className="text-gray-600">{language === 'fa' ? 'فاکتورهای فروشندگان، پرداخت‌ها و مدیریت بدهی' : 'Vendor bills, payments, and debt management'}</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-blue-50">
            <CardContent className="pt-6">
              <p className="text-xs text-gray-600">{language === 'fa' ? 'کل خریداری' : 'Total Purchases'}</p>
              <p className="text-2xl font-bold mt-2">{formatCurrencyIRR(totalBilled)}</p>
            </CardContent>
          </Card>
          <Card className="bg-green-50">
            <CardContent className="pt-6">
              <p className="text-xs text-gray-600">{language === 'fa' ? 'پرداخت شده' : 'Total Paid'}</p>
              <p className="text-2xl font-bold mt-2">{formatCurrencyIRR(totalPaid)}</p>
            </CardContent>
          </Card>
          <Card className="bg-orange-50">
            <CardContent className="pt-6">
              <p className="text-xs text-gray-600">{language === 'fa' ? 'مستحق پرداخت' : 'Outstanding'}</p>
              <p className="text-2xl font-bold mt-2">{formatCurrencyIRR(totalDue)}</p>
            </CardContent>
          </Card>
          <Card className="bg-red-50">
            <CardContent className="pt-6">
              <p className="text-xs text-gray-600">{language === 'fa' ? 'سررسید' : 'Overdue'}</p>
              <p className="text-2xl font-bold mt-2">{formatCurrencyIRR(overdue)}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bills">{language === 'fa' ? 'فاکتورها' : 'Bills'}</TabsTrigger>
            <TabsTrigger value="payments">{language === 'fa' ? 'پرداخت‌ها' : 'Payments'}</TabsTrigger>
            <TabsTrigger value="aging">{language === 'fa' ? 'تحلیل سن' : 'Aging Analysis'}</TabsTrigger>
          </TabsList>

          <TabsContent value="bills" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> {language === 'fa' ? 'فاکتورهای فروشندگان' : 'Vendor Bills'}</CardTitle>
                <Dialog open={billDialogOpen} onOpenChange={setBillDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm"><Plus className="w-4 h-4 mr-2" /> {language === 'fa' ? 'فاکتور جدید' : 'New Bill'}</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingBill ? (language === 'fa' ? 'ویرایش فاکتور' : 'Edit Bill') : (language === 'fa' ? 'فاکتور جدید' : 'New Bill')}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm">{language === 'fa' ? 'فروشندگان' : 'Vendor'}</Label>
                          <Select value={String(billForm.vendor_id || '')} onValueChange={(v) => {
                            const vendor = vendors.find(vnd => vnd.id === parseInt(v));
                            setBillForm({ ...billForm, vendor_id: parseInt(v), vendor_name: vendor?.name });
                          }}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {vendors.map(v => (
                                <SelectItem key={v.id} value={String(v.id)}>{v.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm">{language === 'fa' ? 'شماره سفارش' : 'PO Number'}</Label>
                          <Input value={billForm.po_number || ''} onChange={(e) => setBillForm({ ...billForm, po_number: e.target.value })} />
                        </div>
                        <div>
                          <Label className="text-sm">{language === 'fa' ? 'تاریخ فاکتور' : 'Bill Date'}</Label>
                          <Input type="date" value={billForm.bill_date || ''} onChange={(e) => setBillForm({ ...billForm, bill_date: e.target.value })} />
                        </div>
                        <div>
                          <Label className="text-sm">{language === 'fa' ? 'تاریخ سررسید' : 'Due Date'}</Label>
                          <Input type="date" value={billForm.due_date || ''} onChange={(e) => setBillForm({ ...billForm, due_date: e.target.value })} />
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm">{language === 'fa' ? 'توضیحات' : 'Notes'}</Label>
                        <Textarea value={billForm.notes || ''} onChange={(e) => setBillForm({ ...billForm, notes: e.target.value })} />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => { setBillDialogOpen(false); setEditingBill(null); }}>{language === 'fa' ? 'انصراف' : 'Cancel'}</Button>
                        <Button onClick={saveBill}>{language === 'fa' ? 'ذخیره' : 'Save'}</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Input placeholder={language === 'fa' ? 'جستجو فاکتور یا فروشندگان' : 'Search bill or vendor'} value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === 'fa' ? 'همه' : 'All'}</SelectItem>
                      <SelectItem value="draft">{language === 'fa' ? 'پیش نویس' : 'Draft'}</SelectItem>
                      <SelectItem value="approved">{language === 'fa' ? 'تایید شده' : 'Approved'}</SelectItem>
                      <SelectItem value="partially_paid">{language === 'fa' ? 'جزئی پرداخت' : 'Partial'}</SelectItem>
                      <SelectItem value="paid">{language === 'fa' ? 'پرداخت شده' : 'Paid'}</SelectItem>
                      <SelectItem value="overdue">{language === 'fa' ? 'سررسید' : 'Overdue'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">{language === 'fa' ? 'شماره' : 'Bill #'}</TableHead>
                        <TableHead className="text-xs">{language === 'fa' ? 'فروشندگان' : 'Vendor'}</TableHead>
                        <TableHead className="text-xs">{language === 'fa' ? 'تاریخ' : 'Date'}</TableHead>
                        <TableHead className="text-xs">{language === 'fa' ? 'سررسید' : 'Due'}</TableHead>
                        <TableHead className="text-xs text-right">{language === 'fa' ? 'کل' : 'Total'}</TableHead>
                        <TableHead className="text-xs text-right">{language === 'fa' ? 'پرداخت' : 'Paid'}</TableHead>
                        <TableHead className="text-xs text-right">{language === 'fa' ? 'باقی' : 'Balance'}</TableHead>
                        <TableHead className="text-xs">{language === 'fa' ? 'وضعیت' : 'Status'}</TableHead>
                        <TableHead className="text-xs">{language === 'fa' ? 'عملیات' : 'Actions'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map(bill => (
                        <TableRow key={bill.id}>
                          <TableCell className="text-xs font-mono font-bold">{bill.bill_number}</TableCell>
                          <TableCell className="text-xs">{bill.vendor_name}</TableCell>
                          <TableCell className="text-xs">{new Date(bill.bill_date).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US')}</TableCell>
                          <TableCell className="text-xs">{new Date(bill.due_date).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US')}</TableCell>
                          <TableCell className="text-xs text-right">{formatCurrencyIRR(bill.total_amount)}</TableCell>
                          <TableCell className="text-xs text-right text-green-700 font-semibold">{formatCurrencyIRR(bill.paid_amount)}</TableCell>
                          <TableCell className="text-xs text-right font-bold">{formatCurrencyIRR(bill.balance_due)}</TableCell>
                          <TableCell className="text-xs">
                            <Badge className={statusColors[bill.status]}>{bill.status}</Badge>
                          </TableCell>
                          <TableCell className="text-xs">
                            <div className="flex gap-1">
                              {bill.status === 'draft' && (
                                <Button size="sm" variant="ghost" className="h-6 px-2" onClick={() => approveBill(bill.id)} title={language === 'fa' ? 'تایید' : 'Approve'}>
                                  <CheckCircle className="w-3 h-3 text-blue-600" />
                                </Button>
                              )}
                              {bill.status !== 'paid' && bill.status !== 'cancelled' && (
                                <Dialog open={paymentDialogOpen && selectedBillForPayment?.id === bill.id} onOpenChange={(o) => { if (o) { setSelectedBillForPayment(bill); setPaymentDialogOpen(true); } else setPaymentDialogOpen(false); }}>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="ghost" className="h-6 px-2" title={language === 'fa' ? 'ثبت پرداخت' : 'Record Payment'}>
                                      <CheckCircle className="w-3 h-3" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-sm">
                                    <DialogHeader>
                                      <DialogTitle className="text-sm">{language === 'fa' ? 'ثبت پرداخت' : 'Record Payment'}</DialogTitle>
                                      <DialogDescription>{bill.bill_number}</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <Label className="text-xs">{language === 'fa' ? 'مبلغ' : 'Amount'}</Label>
                                        <Input type="number" value={paymentForm.amount || ''} onChange={(e) => setPaymentForm({ ...paymentForm, amount: parseFloat(e.target.value) })} max={bill.balance_due} />
                                      </div>
                                      <div>
                                        <Label className="text-xs">{language === 'fa' ? 'روش پرداخت' : 'Payment Method'}</Label>
                                        <Select value={paymentForm.payment_method || 'bank_transfer'} onValueChange={(v) => setPaymentForm({ ...paymentForm, payment_method: v as any })}>
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="bank_transfer">{language === 'fa' ? 'انتقال بانکی' : 'Bank Transfer'}</SelectItem>
                                            <SelectItem value="check">{language === 'fa' ? 'چک' : 'Check'}</SelectItem>
                                            <SelectItem value="credit_card">{language === 'fa' ? 'کارت اعتباری' : 'Credit Card'}</SelectItem>
                                            <SelectItem value="cash">{language === 'fa' ? 'نقد' : 'Cash'}</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label className="text-xs">{language === 'fa' ? 'شماره مرجع' : 'Reference #'}</Label>
                                        <Input value={paymentForm.reference_number || ''} onChange={(e) => setPaymentForm({ ...paymentForm, reference_number: e.target.value })} />
                                      </div>
                                      <div className="flex justify-end gap-2">
                                        <Button variant="outline" size="sm" onClick={() => { setPaymentDialogOpen(false); setSelectedBillForPayment(null); }}>{language === 'fa' ? 'انصراف' : 'Cancel'}</Button>
                                        <Button size="sm" onClick={recordPayment}>{language === 'fa' ? 'ثبت' : 'Record'}</Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{language === 'fa' ? 'سابقه پرداخت' : 'Payment History'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">{language === 'fa' ? 'تاریخ' : 'Date'}</TableHead>
                        <TableHead className="text-xs">{language === 'fa' ? 'فاکتور' : 'Bill'}</TableHead>
                        <TableHead className="text-xs">{language === 'fa' ? 'مبلغ' : 'Amount'}</TableHead>
                        <TableHead className="text-xs">{language === 'fa' ? 'روش' : 'Method'}</TableHead>
                        <TableHead className="text-xs">{language === 'fa' ? 'مرجع' : 'Reference'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {billPayments.map(pay => (
                        <TableRow key={pay.id}>
                          <TableCell className="text-xs">{new Date(pay.payment_date).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US')}</TableCell>
                          <TableCell className="text-xs font-mono">{pay.bill_number}</TableCell>
                          <TableCell className="text-xs font-bold text-green-700">{formatCurrencyIRR(pay.amount)}</TableCell>
                          <TableCell className="text-xs">{pay.payment_method}</TableCell>
                          <TableCell className="text-xs">{pay.reference_number || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="aging">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5" /> {language === 'fa' ? 'تحلیل سن حسابها' : 'Accounts Payable Aging'}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">{language === 'fa' ? 'دسته سن' : 'Aging Period'}</TableHead>
                      <TableHead className="text-xs text-right">{language === 'fa' ? 'مبلغ' : 'Amount'}</TableHead>
                      <TableHead className="text-xs text-right">{language === 'fa' ? 'درصد' : 'Percent'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-green-50">
                      <TableCell className="text-xs font-medium">{language === 'fa' ? 'جاری (0-30 روز)' : 'Current (0-30 days)'}</TableCell>
                      <TableCell className="text-xs text-right font-bold">{formatCurrencyIRR(bills.filter(b => new Date(b.due_date) > new Date()).reduce((sum, b) => sum + b.balance_due, 0))}</TableCell>
                      <TableCell className="text-xs text-right">{((bills.filter(b => new Date(b.due_date) > new Date()).reduce((sum, b) => sum + b.balance_due, 0) / totalDue) * 100 || 0).toFixed(1)}%</TableCell>
                    </TableRow>
                    <TableRow className="bg-red-50">
                      <TableCell className="text-xs font-medium">{language === 'fa' ? 'بیش از 30 روز' : 'Over 30 days'}</TableCell>
                      <TableCell className="text-xs text-right font-bold">{formatCurrencyIRR(bills.filter(b => b.status === 'overdue').reduce((sum, b) => sum + b.balance_due, 0))}</TableCell>
                      <TableCell className="text-xs text-right">{((bills.filter(b => b.status === 'overdue').reduce((sum, b) => sum + b.balance_due, 0) / totalDue) * 100 || 0).toFixed(1)}%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
