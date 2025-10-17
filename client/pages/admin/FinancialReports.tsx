import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLayout from '@/components/AdminLayout';
import { formatCurrencyIRR } from '@/lib/utils';
import { Download, TrendingUp, TrendingDown, Printer, FileText } from 'lucide-react';

interface FinancialData {
  assets: { current: number; fixed: number; other: number };
  liabilities: { current: number; longterm: number; other: number };
  equity: { capital: number; retained: number };
  revenue: { sales: number; services: number; other: number };
  expenses: { cogs: number; operating: number; financing: number; tax: number };
}

export default function FinancialReports() {
  const { language, dir } = useLanguage();
  const [period, setPeriod] = useState('current');
  const [activeTab, setActiveTab] = useState('income-statement');
  const [financialData, setFinancialData] = useState<FinancialData>({
    assets: { current: 17000000, fixed: 13000000, other: 2000000 },
    liabilities: { current: 4000000, longterm: 5000000, other: 500000 },
    equity: { capital: 10000000, retained: 5000000 },
    revenue: { sales: 18000000, services: 2500000, other: 200000 },
    expenses: { cogs: 9000000, operating: 5750000, financing: 250000, tax: 1000000 },
  });

  const totalAssets = financialData.assets.current + financialData.assets.fixed + financialData.assets.other;
  const totalLiabilities = financialData.liabilities.current + financialData.liabilities.longterm + financialData.liabilities.other;
  const totalEquity = financialData.equity.capital + financialData.equity.retained;
  const totalRevenue = financialData.revenue.sales + financialData.revenue.services + financialData.revenue.other;
  const totalExpenses = financialData.expenses.cogs + financialData.expenses.operating + financialData.expenses.financing + financialData.expenses.tax;
  const netIncome = totalRevenue - totalExpenses;

  // Financial Metrics
  const metrics = {
    gross_profit: financialData.revenue.sales - financialData.expenses.cogs,
    operating_profit: (totalRevenue - financialData.expenses.cogs) - financialData.expenses.operating,
    net_profit: netIncome,
    current_ratio: financialData.assets.current / financialData.liabilities.current,
    quick_ratio: (financialData.assets.current - 2000000) / financialData.liabilities.current,
    debt_to_equity: totalLiabilities / totalEquity,
    roe: netIncome / totalEquity,
    roa: netIncome / totalAssets,
    profit_margin: (netIncome / totalRevenue) * 100,
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    const reportName = `financial-report-${new Date().toISOString().split('T')[0]}`;
    alert(`${language === 'fa' ? 'صادر شد: ' : 'Exported: '} ${reportName}.${format}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AdminLayout>
      <div className="space-y-6" dir={dir}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{language === 'fa' ? 'گزارشات مالی' : 'Financial Reports'}</h2>
            <p className="text-gray-600">{language === 'fa' ? 'صورت سود و زیان، ترازنامه و جریان نقد' : 'Income Statement, Balance Sheet, and Cash Flow'}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}><Download className="w-4 h-4 mr-2" /> PDF</Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('excel')}><Download className="w-4 h-4 mr-2" /> Excel</Button>
            <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="w-4 h-4 mr-2" /> {language === 'fa' ? 'چاپ' : 'Print'}</Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">{language === 'fa' ? 'ماه جاری' : 'Current Month'}</SelectItem>
              <SelectItem value="quarter">{language === 'fa' ? 'سه ماهه جاری' : 'Current Quarter'}</SelectItem>
              <SelectItem value="year">{language === 'fa' ? 'سال جاری' : 'Current Year'}</SelectItem>
              <SelectItem value="last_year">{language === 'fa' ? 'سال گذشته' : 'Last Year'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="income-statement">{language === 'fa' ? 'سود و زیان' : 'Income Statement'}</TabsTrigger>
            <TabsTrigger value="balance-sheet">{language === 'fa' ? 'ترازنامه' : 'Balance Sheet'}</TabsTrigger>
            <TabsTrigger value="cash-flow">{language === 'fa' ? 'جریان نقد' : 'Cash Flow'}</TabsTrigger>
            <TabsTrigger value="metrics">{language === 'fa' ? 'شاخص ها' : 'Metrics'}</TabsTrigger>
          </TabsList>

          {/* Income Statement */}
          <TabsContent value="income-statement">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> {language === 'fa' ? 'صورت سود و زیان' : 'Income Statement'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Table>
                    <TableBody>
                      {/* Revenue Section */}
                      <TableRow className="bg-blue-50">
                        <TableCell className="font-bold text-sm">{language === 'fa' ? 'درآمد' : 'REVENUE'}</TableCell>
                        <TableCell className="text-right"></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-8 text-sm">{language === 'fa' ? '  فروش کالا' : '  Sales Revenue'}</TableCell>
                        <TableCell className="text-right text-sm">{formatCurrencyIRR(financialData.revenue.sales)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-8 text-sm">{language === 'fa' ? '  درآمد خدمات' : '  Services Revenue'}</TableCell>
                        <TableCell className="text-right text-sm">{formatCurrencyIRR(financialData.revenue.services)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-8 text-sm">{language === 'fa' ? '  سایر درآمد' : '  Other Income'}</TableCell>
                        <TableCell className="text-right text-sm">{formatCurrencyIRR(financialData.revenue.other)}</TableCell>
                      </TableRow>
                      <TableRow className="bg-blue-100 font-bold">
                        <TableCell className="text-sm">{language === 'fa' ? 'کل درآمد' : 'Total Revenue'}</TableCell>
                        <TableCell className="text-right text-sm">{formatCurrencyIRR(totalRevenue)}</TableCell>
                      </TableRow>

                      {/* COGS Section */}
                      <TableRow className="bg-red-50">
                        <TableCell className="font-bold text-sm">{language === 'fa' ? 'هزینه های فروخته شده' : 'COST OF GOODS SOLD'}</TableCell>
                        <TableCell className="text-right"></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-8 text-sm">{language === 'fa' ? '  بهای تمام شده' : '  COGS'}</TableCell>
                        <TableCell className="text-right text-sm">{formatCurrencyIRR(financialData.expenses.cogs)}</TableCell>
                      </TableRow>
                      <TableRow className="bg-red-100 font-bold">
                        <TableCell className="text-sm">{language === 'fa' ? 'سود ناخالص' : 'Gross Profit'}</TableCell>
                        <TableCell className="text-right text-sm">{formatCurrencyIRR(metrics.gross_profit)}</TableCell>
                      </TableRow>

                      {/* Operating Expenses */}
                      <TableRow className="bg-orange-50">
                        <TableCell className="font-bold text-sm">{language === 'fa' ? 'هزینه های عملیاتی' : 'OPERATING EXPENSES'}</TableCell>
                        <TableCell className="text-right"></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-8 text-sm">{language === 'fa' ? '  حقوق و دستمزد' : '  Salaries & Wages'}</TableCell>
                        <TableCell className="text-right text-sm">{formatCurrencyIRR(3000000)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-8 text-sm">{language === 'fa' ? '  اجاره' : '  Rent'}</TableCell>
                        <TableCell className="text-right text-sm">{formatCurrencyIRR(800000)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-8 text-sm">{language === 'fa' ? '  بازاریابی' : '  Marketing'}</TableCell>
                        <TableCell className="text-right text-sm">{formatCurrencyIRR(700000)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-8 text-sm">{language === 'fa' ? '  سایر هزینه ها' : '  Other Operating'}</TableCell>
                        <TableCell className="text-right text-sm">{formatCurrencyIRR(1250000)}</TableCell>
                      </TableRow>
                      <TableRow className="bg-orange-100 font-bold">
                        <TableCell className="text-sm">{language === 'fa' ? 'کل هزینه های عملیاتی' : 'Total Operating Expenses'}</TableCell>
                        <TableCell className="text-right text-sm">{formatCurrencyIRR(financialData.expenses.operating)}</TableCell>
                      </TableRow>
                      <TableRow className="bg-green-100 font-bold">
                        <TableCell className="text-sm">{language === 'fa' ? 'سود عملیاتی' : 'Operating Profit'}</TableCell>
                        <TableCell className="text-right text-sm">{formatCurrencyIRR(metrics.operating_profit)}</TableCell>
                      </TableRow>

                      {/* Financing & Tax */}
                      <TableRow className="bg-purple-50">
                        <TableCell className="font-bold text-sm">{language === 'fa' ? 'هزینه های مالی و مالیاتی' : 'FINANCING & TAX'}</TableCell>
                        <TableCell className="text-right"></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-8 text-sm">{language === 'fa' ? '  هزینه بهره' : '  Interest Expense'}</TableCell>
                        <TableCell className="text-right text-sm">{formatCurrencyIRR(financialData.expenses.financing)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-8 text-sm">{language === 'fa' ? '  هزینه مالیات' : '  Income Tax'}</TableCell>
                        <TableCell className="text-right text-sm">{formatCurrencyIRR(financialData.expenses.tax)}</TableCell>
                      </TableRow>

                      {/* Net Income */}
                      <TableRow className="bg-green-500 text-white font-bold text-lg">
                        <TableCell className="text-white">{language === 'fa' ? 'سود خالص' : 'NET INCOME'}</TableCell>
                        <TableCell className="text-right text-white">{formatCurrencyIRR(netIncome)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Balance Sheet */}
          <TabsContent value="balance-sheet">
            <div className="grid grid-cols-2 gap-6">
              {/* Assets */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{language === 'fa' ? 'دارایی ها' : 'ASSETS'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow className="bg-blue-50 font-bold">
                        <TableCell className="text-sm">{language === 'fa' ? 'دارایی های جاری' : 'Current Assets'}</TableCell>
                        <TableCell className="text-right"></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-4 text-xs">{language === 'fa' ? 'نقد' : 'Cash'}</TableCell>
                        <TableCell className="text-right text-xs">{formatCurrencyIRR(5000000)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-4 text-xs">{language === 'fa' ? 'حسابهای دریافتنی' : 'Accounts Receivable'}</TableCell>
                        <TableCell className="text-right text-xs">{formatCurrencyIRR(3500000)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-4 text-xs">{language === 'fa' ? 'موجودی' : 'Inventory'}</TableCell>
                        <TableCell className="text-right text-xs">{formatCurrencyIRR(8500000)}</TableCell>
                      </TableRow>
                      <TableRow className="bg-blue-100 font-bold">
                        <TableCell className="text-xs">{language === 'fa' ? 'مجموع جاری' : 'Total Current'}</TableCell>
                        <TableCell className="text-right text-xs">{formatCurrencyIRR(financialData.assets.current)}</TableCell>
                      </TableRow>

                      <TableRow className="bg-blue-50 font-bold">
                        <TableCell className="text-sm">{language === 'fa' ? 'دارایی های ثابت' : 'Fixed Assets'}</TableCell>
                        <TableCell className="text-right"></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-4 text-xs">{language === 'fa' ? 'دارایی ها' : 'Assets'}</TableCell>
                        <TableCell className="text-right text-xs">{formatCurrencyIRR(15000000)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-4 text-xs">{language === 'fa' ? 'منهای استهلاک' : 'Less: Depreciation'}</TableCell>
                        <TableCell className="text-right text-xs">({formatCurrencyIRR(2000000)})</TableCell>
                      </TableRow>
                      <TableRow className="bg-blue-100 font-bold">
                        <TableCell className="text-xs">{language === 'fa' ? 'خالص ثابت' : 'Net Fixed'}</TableCell>
                        <TableCell className="text-right text-xs">{formatCurrencyIRR(financialData.assets.fixed)}</TableCell>
                      </TableRow>

                      <TableRow className="bg-blue-200 font-bold">
                        <TableCell className="text-sm">{language === 'fa' ? 'کل دارایی ها' : 'TOTAL ASSETS'}</TableCell>
                        <TableCell className="text-right text-sm">{formatCurrencyIRR(totalAssets)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Liabilities & Equity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{language === 'fa' ? 'بدهی ها و حقوق' : 'LIABILITIES & EQUITY'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow className="bg-red-50 font-bold">
                        <TableCell className="text-sm">{language === 'fa' ? 'بدهی های جاری' : 'Current Liabilities'}</TableCell>
                        <TableCell className="text-right"></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-4 text-xs">{language === 'fa' ? 'حسابهای پرداختنی' : 'Accounts Payable'}</TableCell>
                        <TableCell className="text-right text-xs">{formatCurrencyIRR(2000000)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-4 text-xs">{language === 'fa' ? 'وام کوتاه مدت' : 'Short-term Loans'}</TableCell>
                        <TableCell className="text-right text-xs">{formatCurrencyIRR(1500000)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-4 text-xs">{language === 'fa' ? 'هزینه تعلق گرفته' : 'Accrued Expenses'}</TableCell>
                        <TableCell className="text-right text-xs">{formatCurrencyIRR(500000)}</TableCell>
                      </TableRow>
                      <TableRow className="bg-red-100 font-bold">
                        <TableCell className="text-xs">{language === 'fa' ? 'مجموع جاری' : 'Total Current'}</TableCell>
                        <TableCell className="text-right text-xs">{formatCurrencyIRR(financialData.liabilities.current)}</TableCell>
                      </TableRow>

                      <TableRow className="bg-red-50 font-bold">
                        <TableCell className="text-sm">{language === 'fa' ? 'بدهی بلند مدت' : 'Long-term Liabilities'}</TableCell>
                        <TableCell className="text-right"></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-4 text-xs">{language === 'fa' ? 'وام بلند مدت' : 'Long-term Loans'}</TableCell>
                        <TableCell className="text-right text-xs">{formatCurrencyIRR(financialData.liabilities.longterm)}</TableCell>
                      </TableRow>
                      <TableRow className="bg-red-100 font-bold">
                        <TableCell className="text-xs">{language === 'fa' ? 'کل بلند مدت' : 'Total Long-term'}</TableCell>
                        <TableCell className="text-right text-xs">{formatCurrencyIRR(financialData.liabilities.longterm)}</TableCell>
                      </TableRow>

                      <TableRow className="bg-green-50 font-bold">
                        <TableCell className="text-sm">{language === 'fa' ? 'حقوق صاحبان' : 'EQUITY'}</TableCell>
                        <TableCell className="text-right"></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-4 text-xs">{language === 'fa' ? 'سرمایه سهام' : 'Share Capital'}</TableCell>
                        <TableCell className="text-right text-xs">{formatCurrencyIRR(financialData.equity.capital)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-4 text-xs">{language === 'fa' ? 'سود انباشته' : 'Retained Earnings'}</TableCell>
                        <TableCell className="text-right text-xs">{formatCurrencyIRR(financialData.equity.retained)}</TableCell>
                      </TableRow>
                      <TableRow className="bg-green-100 font-bold">
                        <TableCell className="text-xs">{language === 'fa' ? 'کل حقوق' : 'Total Equity'}</TableCell>
                        <TableCell className="text-right text-xs">{formatCurrencyIRR(totalEquity)}</TableCell>
                      </TableRow>

                      <TableRow className="bg-gray-200 font-bold">
                        <TableCell className="text-sm">{language === 'fa' ? 'کل بدهی و حقوق' : 'TOTAL LIAB. & EQUITY'}</TableCell>
                        <TableCell className="text-right text-sm">{formatCurrencyIRR(totalLiabilities + totalEquity)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Cash Flow Statement */}
          <TabsContent value="cash-flow">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5" /> {language === 'fa' ? 'جریان نقد' : 'Cash Flow Statement'}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    {/* Operating Activities */}
                    <TableRow className="bg-blue-50 font-bold">
                      <TableCell className="text-sm">{language === 'fa' ? 'جریان عملیاتی' : 'OPERATING ACTIVITIES'}</TableCell>
                      <TableCell className="text-right"></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8 text-sm">{language === 'fa' ? 'سود خالص' : 'Net Income'}</TableCell>
                      <TableCell className="text-right text-sm">{formatCurrencyIRR(netIncome)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8 text-sm">{language === 'fa' ? 'اضافه: استهلاک' : 'Add: Depreciation'}</TableCell>
                      <TableCell className="text-right text-sm">{formatCurrencyIRR(400000)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8 text-sm">{language === 'fa' ? 'تغییر در حسابهای دریافتنی' : 'Change in Receivables'}</TableCell>
                      <TableCell className="text-right text-sm">({formatCurrencyIRR(500000)})</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8 text-sm">{language === 'fa' ? 'تغییر در موجودی' : 'Change in Inventory'}</TableCell>
                      <TableCell className="text-right text-sm">({formatCurrencyIRR(300000)})</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8 text-sm">{language === 'fa' ? 'تغییر در حسابهای پرداختنی' : 'Change in Payables'}</TableCell>
                      <TableCell className="text-right text-sm">{formatCurrencyIRR(200000)}</TableCell>
                    </TableRow>
                    <TableRow className="bg-blue-100 font-bold">
                      <TableCell className="text-sm">{language === 'fa' ? 'نقد از عملیات' : 'Cash from Operations'}</TableCell>
                      <TableCell className="text-right text-sm">{formatCurrencyIRR(4100000)}</TableCell>
                    </TableRow>

                    {/* Investing Activities */}
                    <TableRow className="bg-orange-50 font-bold">
                      <TableCell className="text-sm">{language === 'fa' ? 'جریان سرمایه گذاری' : 'INVESTING ACTIVITIES'}</TableCell>
                      <TableCell className="text-right"></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8 text-sm">{language === 'fa' ? 'خریداری دارایی' : 'Purchase of Assets'}</TableCell>
                      <TableCell className="text-right text-sm">({formatCurrencyIRR(1000000)})</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8 text-sm">{language === 'fa' ? 'فروش دارایی' : 'Sale of Assets'}</TableCell>
                      <TableCell className="text-right text-sm">{formatCurrencyIRR(200000)}</TableCell>
                    </TableRow>
                    <TableRow className="bg-orange-100 font-bold">
                      <TableCell className="text-sm">{language === 'fa' ? 'نقد از سرمایه گذاری' : 'Cash from Investing'}</TableCell>
                      <TableCell className="text-right text-sm">({formatCurrencyIRR(800000)})</TableCell>
                    </TableRow>

                    {/* Financing Activities */}
                    <TableRow className="bg-purple-50 font-bold">
                      <TableCell className="text-sm">{language === 'fa' ? 'جریان تمویل' : 'FINANCING ACTIVITIES'}</TableCell>
                      <TableCell className="text-right"></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8 text-sm">{language === 'fa' ? 'وام دریافتی' : 'Loans Received'}</TableCell>
                      <TableCell className="text-right text-sm">{formatCurrencyIRR(1000000)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8 text-sm">{language === 'fa' ? 'بازپرداخت وام' : 'Loan Repayment'}</TableCell>
                      <TableCell className="text-right text-sm">({formatCurrencyIRR(500000)})</TableCell>
                    </TableRow>
                    <TableRow className="bg-purple-100 font-bold">
                      <TableCell className="text-sm">{language === 'fa' ? 'نقد از تمویل' : 'Cash from Financing'}</TableCell>
                      <TableCell className="text-right text-sm">{formatCurrencyIRR(500000)}</TableCell>
                    </TableRow>

                    {/* Net Change & Ending Balance */}
                    <TableRow className="bg-green-200 font-bold">
                      <TableCell className="text-sm">{language === 'fa' ? 'تغییر خالص نقد' : 'Net Change in Cash'}</TableCell>
                      <TableCell className="text-right text-sm">{formatCurrencyIRR(3800000)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8 text-sm">{language === 'fa' ? 'نقد شروع' : 'Cash Beginning'}</TableCell>
                      <TableCell className="text-right text-sm">{formatCurrencyIRR(1200000)}</TableCell>
                    </TableRow>
                    <TableRow className="bg-green-500 text-white font-bold">
                      <TableCell className="text-white">{language === 'fa' ? 'نقد پایان' : 'ENDING CASH'}</TableCell>
                      <TableCell className="text-right text-white">{formatCurrencyIRR(5000000)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Metrics & Ratios */}
          <TabsContent value="metrics">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Profitability Ratios */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4" /> {language === 'fa' ? 'سودآوری' : 'Profitability'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 border rounded bg-green-50">
                    <p className="text-xs text-gray-600">{language === 'fa' ? 'هامش سود' : 'Profit Margin'}</p>
                    <p className="text-2xl font-bold">{metrics.profit_margin.toFixed(2)}%</p>
                  </div>
                  <div className="p-3 border rounded bg-green-50">
                    <p className="text-xs text-gray-600">{language === 'fa' ? 'بازگشت دارایی' : 'ROA'}</p>
                    <p className="text-2xl font-bold">{(metrics.roa * 100).toFixed(2)}%</p>
                  </div>
                  <div className="p-3 border rounded bg-green-50">
                    <p className="text-xs text-gray-600">{language === 'fa' ? 'بازگشت حقوق' : 'ROE'}</p>
                    <p className="text-2xl font-bold">{(metrics.roe * 100).toFixed(2)}%</p>
                  </div>
                </CardContent>
              </Card>

              {/* Liquidity Ratios */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><FileText className="w-4 h-4" /> {language === 'fa' ? 'نقدینگی' : 'Liquidity'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 border rounded bg-blue-50">
                    <p className="text-xs text-gray-600">{language === 'fa' ? 'نسبت جاری' : 'Current Ratio'}</p>
                    <p className="text-2xl font-bold">{metrics.current_ratio.toFixed(2)}x</p>
                  </div>
                  <div className="p-3 border rounded bg-blue-50">
                    <p className="text-xs text-gray-600">{language === 'fa' ? 'نسبت فوری' : 'Quick Ratio'}</p>
                    <p className="text-2xl font-bold">{metrics.quick_ratio.toFixed(2)}x</p>
                  </div>
                  <div className="p-3 border rounded bg-blue-50">
                    <p className="text-xs text-gray-600">{language === 'fa' ? 'پوشش سریع' : 'Quick Coverage'}</p>
                    <p className="text-2xl font-bold">{(metrics.quick_ratio / metrics.current_ratio).toFixed(2)}x</p>
                  </div>
                </CardContent>
              </Card>

              {/* Solvency Ratios */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><TrendingDown className="w-4 h-4" /> {language === 'fa' ? 'سازما�� دهی' : 'Solvency'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 border rounded bg-purple-50">
                    <p className="text-xs text-gray-600">{language === 'fa' ? 'نسبت بدهی' : 'Debt-to-Equity'}</p>
                    <p className="text-2xl font-bold">{metrics.debt_to_equity.toFixed(2)}x</p>
                  </div>
                  <div className="p-3 border rounded bg-purple-50">
                    <p className="text-xs text-gray-600">{language === 'fa' ? 'سهم دارایی' : 'Asset Coverage'}</p>
                    <p className="text-2xl font-bold">{((totalAssets / totalLiabilities).toFixed(2))}x</p>
                  </div>
                  <div className="p-3 border rounded bg-purple-50">
                    <p className="text-xs text-gray-600">{language === 'fa' ? 'سهم حقوق' : 'Equity Ratio'}</p>
                    <p className="text-2xl font-bold">{((totalEquity / totalAssets) * 100).toFixed(2)}%</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
