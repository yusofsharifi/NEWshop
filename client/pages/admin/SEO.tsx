import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';

interface MetaTemplate {
  title: string;
  description: string;
  keywords: string;
}

interface RedirectRule {
  from: string;
  to: string;
  code: 301 | 302;
}

export default function AdminSEO() {
  const { language, dir } = useLanguage();
  const [homeMeta, setHomeMeta] = useState<MetaTemplate>({ title: '', description: '', keywords: '' });
  const [productMeta, setProductMeta] = useState<MetaTemplate>({ title: '', description: '', keywords: '' });
  const [blogMeta, setBlogMeta] = useState<MetaTemplate>({ title: '', description: '', keywords: '' });
  const [enableSitemap, setEnableSitemap] = useState(true);
  const [enableRobots, setEnableRobots] = useState(true);
  const [canonicalHost, setCanonicalHost] = useState('');
  const [hreflang, setHreflang] = useState(true);
  const [ogDefaultImage, setOgDefaultImage] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [redirects, setRedirects] = useState<RedirectRule[]>([{ from: '/old-url', to: '/new-url', code: 301 }]);

  const addRedirect = () => setRedirects(prev => [...prev, { from: '', to: '', code: 301 }]);
  const removeRedirect = (idx: number) => setRedirects(prev => prev.filter((_, i) => i !== idx));

  return (
    <AdminLayout>
      <div className="space-y-6" dir={dir}>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{language === 'fa' ? 'مدیریت سئو' : 'SEO Management'}</h2>
          <p className="text-gray-600">{language === 'fa' ? 'قالب‌های متا، نقشه‌سایت و تنظیمات robots/redirect/OG' : 'Meta templates, sitemap, robots/redirects/OG settings'}</p>
        </div>

        <Tabs defaultValue="meta">
          <TabsList>
            <TabsTrigger value="meta">{language === 'fa' ? 'متا' : 'Meta'}</TabsTrigger>
            <TabsTrigger value="indexing">{language === 'fa' ? 'ایندکس' : 'Indexing'}</TabsTrigger>
            <TabsTrigger value="social">{language === 'fa' ? 'شبکه‌های اجتماعی' : 'Social'}</TabsTrigger>
            <TabsTrigger value="redirects">{language === 'fa' ? 'ریدایرکت‌ها' : 'Redirects'}</TabsTrigger>
          </TabsList>

          <TabsContent value="meta" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>{language === 'fa' ? 'صفحه اصلی' : 'Home Page'}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input value={homeMeta.title} onChange={e => setHomeMeta({ ...homeMeta, title: e.target.value })} />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={homeMeta.description} onChange={e => setHomeMeta({ ...homeMeta, description: e.target.value })} />
                </div>
                <div>
                  <Label>Keywords (comma-separated)</Label>
                  <Input value={homeMeta.keywords} onChange={e => setHomeMeta({ ...homeMeta, keywords: e.target.value })} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>{language === 'fa' ? 'صفحه ��حصول' : 'Product Page'}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input value={productMeta.title} onChange={e => setProductMeta({ ...productMeta, title: e.target.value })} placeholder="{{name}} | Brand {{brand}} | Best Price" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={productMeta.description} onChange={e => setProductMeta({ ...productMeta, description: e.target.value })} placeholder="{{name}} - {{category}} - Free shipping - Warranty" />
                </div>
                <div>
                  <Label>Keywords</Label>
                  <Input value={productMeta.keywords} onChange={e => setProductMeta({ ...productMeta, keywords: e.target.value })} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>{language === 'fa' ? 'صفحه وبلاگ' : 'Blog Post'}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input value={blogMeta.title} onChange={e => setBlogMeta({ ...blogMeta, title: e.target.value })} placeholder="{{title}} | Blog" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={blogMeta.description} onChange={e => setBlogMeta({ ...blogMeta, description: e.target.value })} />
                </div>
                <div>
                  <Label>Keywords</Label>
                  <Input value={blogMeta.keywords} onChange={e => setBlogMeta({ ...blogMeta, keywords: e.target.value })} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="indexing" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>{language === 'fa' ? 'نقشه‌سایت و Robots' : 'Sitemap & Robots'}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{language === 'fa' ? 'فعالسازی نقشه‌سایت' : 'Enable Sitemap'}</div>
                    <div className="text-sm text-gray-600">/sitemap.xml</div>
                  </div>
                  <Switch checked={enableSitemap} onCheckedChange={setEnableSitemap} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{language === 'fa' ? 'فعال بودن ایندکس' : 'Allow Index'}</div>
                    <div className="text-sm text-gray-600">robots.txt</div>
                  </div>
                  <Switch checked={enableRobots} onCheckedChange={setEnableRobots} />
                </div>
                <Separator />
                <div>
                  <Label>{language === 'fa' ? 'دامنه canonical' : 'Canonical Host'}</Label>
                  <Input value={canonicalHost} onChange={e => setCanonicalHost(e.target.value)} placeholder="https://example.com" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">Hreflang</div>
                  <Switch checked={hreflang} onCheckedChange={setHreflang} />
                </div>
                <div className="flex justify-end">
                  <Button>{language === 'fa' ? 'بازسازی sitemap' : 'Regenerate Sitemap'}</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Open Graph / Twitter</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Default OG Image URL</Label>
                  <Input value={ogDefaultImage} onChange={e => setOgDefaultImage(e.target.value)} placeholder="https://.../og.jpg" />
                </div>
                <div>
                  <Label>Twitter Handle</Label>
                  <Input value={twitterHandle} onChange={e => setTwitterHandle(e.target.value)} placeholder="@yourbrand" />
                </div>
                <div className="flex justify-end">
                  <Button>{language === 'fa' ? 'ذخیره' : 'Save'}</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="redirects" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{language === 'fa' ? 'قوانین ریدایرکت' : 'Redirect Rules'}</CardTitle>
                <Button onClick={addRedirect}>{language === 'fa' ? 'افزودن' : 'Add'}</Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {redirects.map((r, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                    <div className="md:col-span-2">
                      <Label>From</Label>
                      <Input value={r.from} onChange={e => setRedirects(prev => prev.map((x,i)=> i===idx?{...x, from: e.target.value}:x))} placeholder="/old-path" />
                    </div>
                    <div className="md:col-span-2">
                      <Label>To</Label>
                      <Input value={r.to} onChange={e => setRedirects(prev => prev.map((x,i)=> i===idx?{...x, to: e.target.value}:x))} placeholder="/new-path" />
                    </div>
                    <div>
                      <Label>Code</Label>
                      <select className="h-10 px-3 border rounded-md w-full" value={r.code} onChange={e => setRedirects(prev => prev.map((x,i)=> i===idx?{...x, code: Number(e.target.value) as 301|302 }:x))}>
                        <option value={301}>301</option>
                        <option value={302}>302</option>
                      </select>
                    </div>
                    <div className="md:col-span-5 flex justify-end">
                      <Button variant="destructive" onClick={() => removeRedirect(idx)}>{language === 'fa' ? 'حذف' : 'Remove'}</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
