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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLayout from '@/components/AdminLayout';
import { formatCurrencyIRR } from '@/lib/utils';
import { Plus, Edit2, Trash2, Eye, Send, Download, AlertTriangle, Clock, CheckCircle, XCircle, FileText, TrendingUp } from 'lucide-react';

interface InvoiceLineItem {
  line_number: number;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  line_total: number;
}

interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: number;
  customer_name: string;
  invoice_date: string;
  due_date: string;
  line_items: InvoiceLineItem[];
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  balance_due: number;
  status: 'draft' | 'sent' | 'viewed' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';
  payment_terms: string;
  notes?: string;
  created_date: string;
  sent_date?: string;
}

interface Payment {
  id: string;
  invoice_id: string;
  invoice_number: string;
  payment_date: string;
  amount: number;
  payment_method: 'check' | 'bank_transfer' | 'credit_card' | 'cash' | 'other';
  reference_number?: string;
  notes?: string;
  recorded_date: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  credit_limit: number;
  current_due: number;
  total_invoiced: number;
  status: 'active' | 'inactive' | 'suspended';
}

export default function AccountsReceivable() {
  const { language, dir } = useLanguage();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('invoices');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Invoice Dialog
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [invoiceForm, setInvoiceForm] = useState<Partial<Invoice>>({
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    line_items: [],
    status: 'draft',
    payment_terms: 'Net 30',
  });

  // Payment Dialog
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState<Partial<Payment>>({
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'bank_transfer',
  });
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);

  useEffect(() => {
    const sampleCustomers: Customer[] = [
      { id: 1, name: 'Aqua Solutions Inc', email: 'info@aqua.com', phone: '+1-555-1001', address: '123 Water St', credit_limit: 50000000, current_due: 3500000, total_invoiced: 18000000, status: 'active' },
      { id: 2, name: 'Pool Perfect LLC', email: 'sales@poolperfect.com', phone: '+1-555-1002', address: '456 Pool Ave', credit_limit: 30000000, current_due: 1200000, total_invoiced: 12000000, status: 'active' },
      { id: 3, name: 'Splash Technologies', email: 'contact@splash.com', phone: '+1-555-1003', address: '789 Swim Rd', credit_limit: 40000000, current_due: 2800000, total_invoiced: 15000000, status: 'active' },
    ];
    setCustomers(sampleCustomers);

    const sampleInvoices: Invoice[] = [
      {
        id: 'inv1',
        invoice_number: 'INV-2024-001',
        customer_id: 1,
        customer_name: 'Aqua Solutions Inc',
        invoice_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        line_items: [
          { line_number: 1, description: 'Pool Pump XL', quantity: 5, unit_price: 1200000, tax_rate: 9, line_total: 6540000 },
          { line_number: 2, description: 'Installation Service', quantity: 1, unit_price: 500000, tax_rate: 9, line_total: 545000 },
        ],
        subtotal: 6700000,
        tax_amount: 603000,
        total_amount: 7303000,
        paid_amount: 2000000,
        balance_due: 5303000,
        status: 'partially_paid',
        payment_terms: 'Net 30',
        created_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        sent_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'inv2',
        invoice_number: 'INV-2024-002',
        customer_id: 2,
        customer_name: 'Pool Perfect LLC',
        invoice_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        due_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        line_items: [
          { line_number: 1, description: 'Sand Filter 200', quantity: 3, unit_price: 750000, tax_rate: 9, line_total: 2452500 },
        ],
        subtotal: 2250000,
        tax_amount: 202500,
        total_amount: 2452500,
        paid_amount: 0,
        balance_due: 2452500,
        status: 'overdue',
        payment_terms: 'Net 30',
        created_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        sent_date: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'inv3',
        invoice_number: 'INV-2024-003',
        customer_id: 3,
        customer_name: 'Splash Technologies',
        invoice_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        due_date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        line_items: [
          { line_number: 1, description: 'LED Pool Lights RGB', quantity: 10, unit_price: 500000, tax_rate: 9, line_total: 5450000 },
        ],
        subtotal: 5000000,
        tax_amount: 450000,
        total_amount: 5450000,
        paid_amount: 0,
        balance_due: 5450000,
        status: 'sent',
        payment_terms: 'Net 30',
        created_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        sent_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    setInvoices(sampleInvoices);

    const samplePayments: Payment[] = [
      { id: 'pay1', invoice_id: 'inv1', invoice_number: 'INV-2024-001', payment_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: 2000000, payment_method: 'bank_transfer', reference_number: 'WIRE-001', recorded_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    ];
    setPayments(samplePayments);
  }, [language]);

  const filtered = useMemo(() => {
    let result = invoices;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(i =>
        i.invoice_number.toLowerCase().includes(q) ||
        i.customer_name.toLowerCase().includes(q)
      );
    }
    if (filterStatus !== 'all') {
      result = result.filter(i => i.status === filterStatus);
    }
    return result.sort((a, b) => new Date(b.invoice_date).getTime() - new Date(a.invoice_date).getTime());
  }, [invoices, search, filterStatus]);

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total_amount, 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.paid_amount, 0);
  const totalDue = invoices.reduce((sum, inv) => sum + inv.balance_due, 0);
  const overdue = invoices.filter(i => i.status === 'overdue').reduce((sum, inv) => sum + inv.balance_due, 0);

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-500',
    sent: 'bg-blue-500',
    viewed: 'bg-cyan-500',
    partially_paid: 'bg-yellow-500',
    paid: 'bg-green-500',
    overdue: 'bg-red-500',
    cancelled: 'bg-gray-500',
  };

  const saveInvoice = () => {
    if (!invoiceForm.customer_id || !invoiceForm.line_items?.length) return;
    
    if (editingInvoice) {
      setInvoices(prev => prev.map(i => i.id === editingInvoice.id ? { ...i, ...invoiceForm } as Invoice : i));
    } else {
      const newId = 'inv' + (invoices.length + 1);
      const newNumber = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`;
      setInvoices([{
        id: newId,
        invoice_number: newNumber,
        status: 'draft',
        created_date: new Date().toISOString(),
        ...invoiceForm,
      } as Invoice, ...invoices]);
    }
    setInvoiceDialogOpen(false);
    setEditingInvoice(null);
    setInvoiceForm({
      invoice_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      line_items: [],
      status: 'draft',
      payment_terms: 'Net 30',
    });
  };

  const recordPayment = () => {
    if (!selectedInvoiceForPayment || !paymentForm.amount || paymentForm.amount <= 0) return;
    
    const newPayment: Payment = {
      id: 'pay' + (payments.length + 1),
      invoice_id: selectedInvoiceForPayment.id,
      invoice_number: selectedInvoiceForPayment.invoice_number,
      payment_date: paymentForm.payment_date || new Date().toISOString().split('T')[0],
      amount: paymentForm.amount || 0,
      payment_method: paymentForm.payment_method || 'bank_transfer',
      reference_number: paymentForm.reference_number,
      notes: paymentForm.notes,
      recorded_date: new Date().toISOString(),
    };
    setPayments([newPayment, ...payments]);

    // Update invoice
    setInvoices(prev => prev.map(inv => 
      inv.id === selectedInvoiceForPayment.id 
        ? {
            ...inv,
            paid_amount: inv.paid_amount + (paymentForm.amount || 0),
            balance_due: inv.balance_due - (paymentForm.amount || 0),
            status: inv.balance_due - (paymentForm.amount || 0) === 0 ? 'paid' : 'partially_paid'
          }
        : inv
    ));

    setPaymentDialogOpen(false);
    setSelectedInvoiceForPayment(null);
    setPaymentForm({
      payment_date: new Date().toISOString().split('T')[0],
      payment_method: 'bank_transfer',
    });
  };

  const sendInvoice = (invoiceId: string) => {
    setInvoices(prev => prev.map(i => 
      i.id === invoiceId ? { ...i, status: 'sent', sent_date: new Date().toISOString() } : i
    ));
  };

  return (
    <AdminLayout>
      <div className="space-y-6" dir={dir}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{language === 'fa' ? 'حسابهای دریافتنی' : 'Accounts Receivable'}</h2>
            <p className="text-gray-600">{language === 'fa' ? 'فاکتورها، پرداخت‌ها و ردیابی مشتریان' : 'Invoices, payments, and customer tracking'}</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-blue-50">
            <CardContent className="pt-6">
              <p className="text-xs text-gray-600">{language === 'fa' ? 'کل صادره' : 'Total Invoiced'}</p>
              <p className="text-2xl font-bold mt-2">{formatCurrencyIRR(totalInvoiced)}</p>
            </CardContent>
          </Card>
          <Card className="bg-green-50">
            <CardContent className="pt-6">
              <p className="text-xs text-gray-600">{language === 'fa' ? 'دریافت شده' : 'Total Paid'}</p>
              <p className="text-2xl font-bold mt-2">{formatCurrencyIRR(totalPaid)}</p>
            </CardContent>
          </Card>
          <Card className="bg-orange-50">
            <CardContent className="pt-6">
              <p className="text-xs text-gray-600">{language === 'fa' ? 'مستحق الدفع' : 'Outstanding'}</p>
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
            <TabsTrigger value="invoices">{language === 'fa' ? 'فاکتورها' : 'Invoices'}</TabsTrigger>
            <TabsTrigger value="payments">{language === 'fa' ? 'پرداخت‌ها' : 'Payments'}</TabsTrigger>
            <TabsTrigger value="aging">{language === 'fa' ? 'تحلیل سن' : 'Aging Analysis'}</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> {language === 'fa' ? 'فاکتورها' : 'Invoices'}</CardTitle>
                <Dialog open={invoiceDialogOpen} onOpenChange={setInvoiceDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm"><Plus className="w-4 h-4 mr-2" /> {language === 'fa' ? 'فاکتور جدید' : 'New Invoice'}</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingInvoice ? (language === 'fa' ? 'ویرایش فاکتور' : 'Edit Invoice') : (language === 'fa' ? 'فاکتور جدید' : 'New Invoice')}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm">{language === 'fa' ? 'مشتری' : 'Customer'}</Label>
                          <Select value={String(invoiceForm.customer_id || '')} onValueChange={(v) => {
                            const cust = customers.find(c => c.id === parseInt(v));
                            setInvoiceForm({ ...invoiceForm, customer_id: parseInt(v), customer_name: cust?.name });
                          }}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {customers.map(c => (
                                <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm">{language === 'fa' ? 'شرایط پرداخت' : 'Payment Terms'}</Label>
                          <Input value={invoiceForm.payment_terms || ''} onChange={(e) => setInvoiceForm({ ...invoiceForm, payment_terms: e.target.value })} />
                        </div>
                        <div>
                          <Label className="text-sm">{language === 'fa' ? 'تاریخ فاکتور' : 'Invoice Date'}</Label>
                          <Input type="date" value={invoiceForm.invoice_date || ''} onChange={(e) => setInvoiceForm({ ...invoiceForm, invoice_date: e.target.value })} />
                        </div>
                        <div>
                          <Label className="text-sm">{language === 'fa' ? 'تاریخ سررسید' : 'Due Date'}</Label>
                          <Input type="date" value={invoiceForm.due_date || ''} onChange={(e) => setInvoiceForm({ ...invoiceForm, due_date: e.target.value })} />
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm">{language === 'fa' ? 'توضیحات' : 'Notes'}</Label>
                        <Textarea value={invoiceForm.notes || ''} onChange={(e) => setInvoiceForm({ ...invoiceForm, notes: e.target.value })} />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => { setInvoiceDialogOpen(false); setEditingInvoice(null); }}>{language === 'fa' ? 'انصراف' : 'Cancel'}</Button>
                        <Button onClick={saveInvoice}>{language === 'fa' ? 'ذخیره' : 'Save'}</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Input placeholder={language === 'fa' ? 'جستجو فاکتور یا مشتری' : 'Search invoice or customer'} value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === 'fa' ? 'همه' : 'All'}</SelectItem>
                      <SelectItem value="draft">{language === 'fa' ? 'پیش نویس' : 'Draft'}</SelectItem>
                      <SelectItem value="sent">{language === 'fa' ? 'فرستاده شده' : 'Sent'}</SelectItem>
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
                        <TableHead className="text-xs">{language === 'fa' ? 'شماره' : 'Invoice #'}</TableHead>
                        <TableHead className="text-xs">{language === 'fa' ? 'مشتری' : 'Customer'}</TableHead>
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
                      {filtered.map(inv => (
                        <TableRow key={inv.id}>
                          <TableCell className="text-xs font-mono font-bold">{inv.invoice_number}</TableCell>
                          <TableCell className="text-xs">{inv.customer_name}</TableCell>
                          <TableCell className="text-xs">{new Date(inv.invoice_date).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US')}</TableCell>
                          <TableCell className="text-xs">{new Date(inv.due_date).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US')}</TableCell>
                          <TableCell className="text-xs text-right">{formatCurrencyIRR(inv.total_amount)}</TableCell>
                          <TableCell className="text-xs text-right text-green-700 font-semibold">{formatCurrencyIRR(inv.paid_amount)}</TableCell>
                          <TableCell className="text-xs text-right font-bold">{formatCurrencyIRR(inv.balance_due)}</TableCell>
                          <TableCell className="text-xs">
                            <Badge className={statusColors[inv.status]}>{inv.status}</Badge>
                          </TableCell>
                          <TableCell className="text-xs">
                            <div className="flex gap-1">
                              {inv.status === 'draft' && (
                                <Button size="sm" variant="ghost" className="h-6 px-2" onClick={() => sendInvoice(inv.id)} title={language === 'fa' ? 'فرستادن' : 'Send'}>
                                  <Send className="w-3 h-3" />
                                </Button>
                              )}
                              {inv.status !== 'paid' && inv.status !== 'cancelled' && (
                                <Dialog open={paymentDialogOpen && selectedInvoiceForPayment?.id === inv.id} onOpenChange={(o) => { if (o) { setSelectedInvoiceForPayment(inv); setPaymentDialogOpen(true); } else setPaymentDialogOpen(false); }}>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="ghost" className="h-6 px-2" title={language === 'fa' ? 'ثبت پرداخت' : 'Record Payment'}>
                                      <CheckCircle className="w-3 h-3" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-sm">
                                    <DialogHeader>
                                      <DialogTitle className="text-sm">{language === 'fa' ? 'ثبت پرداخت' : 'Record Payment'}</DialogTitle>
                                      <DialogDescription>{inv.invoice_number}</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <Label className="text-xs">{language === 'fa' ? 'مبلغ' : 'Amount'}</Label>
                                        <Input type="number" value={paymentForm.amount || ''} onChange={(e) => setPaymentForm({ ...paymentForm, amount: parseFloat(e.target.value) })} max={inv.balance_due} />
                                      </div>
                                      <div>
                                        <Label className="text-xs">{language === 'fa' ? 'روش پرداخت' : 'Payment Method'}</Label>
                                        <Select value={paymentForm.payment_method || 'bank_transfer'} onValueChange={(v) => setPaymentForm({ ...paymentForm, payment_method: v as any })}>
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="bank_transfer">{language === 'fa' ? 'انتقال ��انکی' : 'Bank Transfer'}</SelectItem>
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
                                        <Button variant="outline" size="sm" onClick={() => { setPaymentDialogOpen(false); setSelectedInvoiceForPayment(null); }}>{language === 'fa' ? 'انصراف' : 'Cancel'}</Button>
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
                <CardTitle className="text-sm">{language === 'fa' ? 'سابقه پرداخت‌ها' : 'Payment History'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">{language === 'fa' ? 'تاریخ' : 'Date'}</TableHead>
                        <TableHead className="text-xs">{language === 'fa' ? 'فاکتور' : 'Invoice'}</TableHead>
                        <TableHead className="text-xs">{language === 'fa' ? 'مبلغ' : 'Amount'}</TableHead>
                        <TableHead className="text-xs">{language === 'fa' ? 'روش' : 'Method'}</TableHead>
                        <TableHead className="text-xs">{language === 'fa' ? 'مرجع' : 'Reference'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map(pay => (
                        <TableRow key={pay.id}>
                          <TableCell className="text-xs">{new Date(pay.payment_date).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US')}</TableCell>
                          <TableCell className="text-xs font-mono">{pay.invoice_number}</TableCell>
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
                <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5" /> {language === 'fa' ? 'تحلیل سن حسابها' : 'Accounts Receivable Aging'}</CardTitle>
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
                      <TableCell className="text-xs text-right font-bold">{formatCurrencyIRR(invoices.filter(i => new Date(i.due_date) > new Date()).reduce((sum, i) => sum + i.balance_due, 0))}</TableCell>
                      <TableCell className="text-xs text-right">{((invoices.filter(i => new Date(i.due_date) > new Date()).reduce((sum, i) => sum + i.balance_due, 0) / totalDue) * 100).toFixed(1)}%</TableCell>
                    </TableRow>
                    <TableRow className="bg-yellow-50">
                      <TableCell className="text-xs font-medium">{language === 'fa' ? '31-60 روز' : '31-60 days'}</TableCell>
                      <TableCell className="text-xs text-right font-bold">{formatCurrencyIRR(invoices.filter(i => {
                        const days = (new Date().getTime() - new Date(i.due_date).getTime()) / (1000 * 60 * 60 * 24);
                        return days > 30 && days <= 60;
                      }).reduce((sum, i) => sum + i.balance_due, 0))}</TableCell>
                      <TableCell className="text-xs text-right">0%</TableCell>
                    </TableRow>
                    <TableRow className="bg-orange-50">
                      <TableCell className="text-xs font-medium">{language === 'fa' ? '61-90 روز' : '61-90 days'}</TableCell>
                      <TableCell className="text-xs text-right font-bold">0</TableCell>
                      <TableCell className="text-xs text-right">0%</TableCell>
                    </TableRow>
                    <TableRow className="bg-red-50">
                      <TableCell className="text-xs font-medium">{language === 'fa' ? 'بیش از 90 روز' : 'Over 90 days'}</TableCell>
                      <TableCell className="text-xs text-right font-bold">{formatCurrencyIRR(invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.balance_due, 0))}</TableCell>
                      <TableCell className="text-xs text-right">{((invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.balance_due, 0) / totalDue) * 100).toFixed(1)}%</TableCell>
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
