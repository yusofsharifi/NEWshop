import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.sqlite');

export const db = new sqlite3.Database(dbPath);

// Initialize database tables
export function initializeDatabase() {
  return new Promise<void>((resolve, reject) => {
    db.serialize(() => {
      // Categories table
      db.run(`
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name_en TEXT NOT NULL,
          name_fa TEXT NOT NULL,
          description_en TEXT,
          description_fa TEXT,
          slug TEXT UNIQUE NOT NULL,
          icon TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Products table
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name_en TEXT NOT NULL,
          name_fa TEXT NOT NULL,
          description_en TEXT,
          description_fa TEXT,
          specifications_en TEXT,
          specifications_fa TEXT,
          category_id INTEGER,
          price DECIMAL(10,2) NOT NULL,
          original_price DECIMAL(10,2),
          stock_quantity INTEGER DEFAULT 0,
          sku TEXT UNIQUE,
          brand TEXT,
          rating DECIMAL(2,1) DEFAULT 0,
          review_count INTEGER DEFAULT 0,
          image_url TEXT,
          images TEXT, -- JSON array of image URLs
          is_bestseller BOOLEAN DEFAULT 0,
          is_featured BOOLEAN DEFAULT 0,
          is_active BOOLEAN DEFAULT 1,
          meta_title_en TEXT,
          meta_title_fa TEXT,
          meta_description_en TEXT,
          meta_description_fa TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES categories (id)
        )
      `);

      // Admin users table
      db.run(`
        CREATE TABLE IF NOT EXISTS admin_users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT DEFAULT 'admin',
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Orders table
      db.run(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_number TEXT UNIQUE NOT NULL,
          customer_name TEXT,
          customer_email TEXT,
          customer_phone TEXT,
          shipping_address TEXT,
          total_amount DECIMAL(10,2) NOT NULL,
          status TEXT DEFAULT 'pending',
          payment_status TEXT DEFAULT 'pending',
          payment_method TEXT,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Order items table
      db.run(`
        CREATE TABLE IF NOT EXISTS order_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER,
          product_id INTEGER,
          quantity INTEGER NOT NULL,
          unit_price DECIMAL(10,2) NOT NULL,
          total_price DECIMAL(10,2) NOT NULL,
          FOREIGN KEY (order_id) REFERENCES orders (id),
          FOREIGN KEY (product_id) REFERENCES products (id)
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}

// Seed initial data
export function seedDatabase() {
  return new Promise<void>((resolve, reject) => {
    db.serialize(() => {
      // Insert categories
      const categories = [
        {
          name_en: 'Pool Pumps',
          name_fa: 'پمپ‌های استخر',
          description_en: 'Variable speed and single speed pumps for efficient water circulation',
          description_fa: 'پمپ‌های تک سرعته و متغیر برای گردش موثر آب',
          slug: 'pumps',
          icon: 'Zap'
        },
        {
          name_en: 'Filters',
          name_fa: 'فیلترها',
          description_en: 'Sand, cartridge, and DE filters for crystal clear pool water',
          description_fa: 'فیلترهای شنی، کارتریج و DE برای آب شفاف استخر',
          slug: 'filters',
          icon: 'Filter'
        },
        {
          name_en: 'Heaters',
          name_fa: 'بخاری‌ها',
          description_en: 'Gas, electric, and heat pump heaters for year-round swimming',
          description_fa: 'بخاری‌های گازی، برقی و پمپ حرارتی برای شنا در تمام فصول',
          slug: 'heaters',
          icon: 'Thermometer'
        },
        {
          name_en: 'Pool Lights',
          name_fa: 'چراغ‌های استخر',
          description_en: 'LED and fiber optic lighting systems for stunning pool ambiance',
          description_fa: 'سیستم‌های روشنایی LED و فیبر نوری برای فضای زیبای استخر',
          slug: 'lights',
          icon: 'Lightbulb'
        },
        {
          name_en: 'Chemicals',
          name_fa: 'مواد شیمیایی',
          description_en: 'Professional-grade chemicals for perfect water balance',
          description_fa: 'مواد شیمیایی حرفه‌ای برای تعادل کامل آب',
          slug: 'chemicals',
          icon: 'Droplets'
        },
        {
          name_en: 'Accessories',
          name_fa: 'لوازم جانبی',
          description_en: 'Covers, cleaners, and maintenance tools for complete pool care',
          description_fa: 'پوشش‌ها، تمیزکننده‌ها و ابزارهای نگهداری برای مراقبت کامل استخر',
          slug: 'accessories',
          icon: 'Wrench'
        }
      ];

      const insertCategory = db.prepare(`
        INSERT OR IGNORE INTO categories (name_en, name_fa, description_en, description_fa, slug, icon)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      categories.forEach(cat => {
        insertCategory.run(cat.name_en, cat.name_fa, cat.description_en, cat.description_fa, cat.slug, cat.icon);
      });

      insertCategory.finalize();

      // Insert sample products
      const products = [
        {
          name_en: 'Pentair SuperFlo VS Variable Speed Pump',
          name_fa: 'پمپ متغیر سرعت پنتیر سوپرفلو',
          description_en: 'Energy-efficient variable speed pump with advanced flow control technology',
          description_fa: 'پمپ متغیر سرعت با صرفه‌جویی انرژی و تکنولوژی کنترل جریان پیشرفته',
          specifications_en: '• Variable speed technology\n• Energy Star certified\n• Quiet operation\n• Digital display\n• Self-priming design',
          specifications_fa: '• تکنولوژی سرعت متغیر\n• گواهی انرژی استار\n• عملکرد بی‌صدا\n• نمایشگر دیجیتال\n• طراحی خودپرایم',
          category_id: 1,
          price: 849,
          original_price: 999,
          stock_quantity: 25,
          sku: 'PEN-SF-VS-001',
          brand: 'Pentair',
          rating: 4.8,
          review_count: 342,
          image_url: '/api/placeholder/300/250',
          is_bestseller: 1,
          is_featured: 1
        },
        {
          name_en: 'Hayward SwimClear Cartridge Filter',
          name_fa: 'فیلتر کارتریج هیوارد سوئیم کلیر',
          description_en: 'High-performance cartridge filter for superior water clarity',
          description_fa: 'فیلتر کارتریج با کارایی بالا برای شفافیت عالی آب',
          specifications_en: '• Cartridge filter technology\n• Easy maintenance\n• High flow rate\n• Durable construction\n• Energy efficient',
          specifications_fa: '• تکنولوژی فیلتر کارتریج\n• نگهداری آسان\n• نرخ جریان بالا\n• ساخت مقاوم\n• صرفه‌جویی انرژی',
          category_id: 2,
          price: 379,
          original_price: 449,
          stock_quantity: 18,
          sku: 'HAY-SC-CF-002',
          brand: 'Hayward',
          rating: 4.9,
          review_count: 189,
          image_url: '/api/placeholder/300/250',
          is_bestseller: 1
        },
        {
          name_en: 'Raypak Digital Gas Heater 266K BTU',
          name_fa: 'بخاری گازی دیجیتال ریپک ۲۶۶ هزار BTU',
          description_en: 'High-efficiency gas heater with digital controls for precise temperature management',
          description_fa: 'بخاری گازی با راندمان بالا و کنترل دیجیتال برای مدیریت دقیق دما',
          specifications_en: '• 266,000 BTU capacity\n• Digital temperature control\n• Cupro-nickel heat exchanger\n• Low NOx emissions\n• Weather-resistant cabinet',
          specifications_fa: '• ظرفیت ۲۶۶ هزار BTU\n• کنترل دمای دیجیتال\n• مبدل حرارتی مس-نیکل\n• انتشار کم NOx\n• کابینت مقاوم در برابر آب و هوا',
          category_id: 3,
          price: 1299,
          original_price: 1499,
          stock_quantity: 8,
          sku: 'RAY-DG-266-003',
          brand: 'Raypak',
          rating: 4.7,
          review_count: 156,
          image_url: '/api/placeholder/300/250',
          is_bestseller: 1
        },
        {
          name_en: 'Jandy Pro Series LED Pool Light',
          name_fa: 'چراغ LED استخر سری پرو جندی',
          description_en: 'Multi-color LED pool light with smart controls and energy efficiency',
          description_fa: 'چراغ LED چندرنگ استخر با کنترل هوشمند و صرفه‌جویی انرژی',
          specifications_en: '• Multi-color LED technology\n• Smart phone app control\n• Energy efficient\n• Long lifespan\n• Easy installation',
          specifications_fa: '• تکنولوژی LED چندرنگ\n• کنترل از طریق اپلیکیشن موبایل\n• صرفه‌جویی انرژی\n• عمر طولانی\n• نصب آسان',
          category_id: 4,
          price: 299,
          original_price: 399,
          stock_quantity: 35,
          sku: 'JAN-LED-PS-004',
          brand: 'Jandy',
          rating: 4.9,
          review_count: 234,
          image_url: '/api/placeholder/300/250',
          is_bestseller: 1
        }
      ];

      const insertProduct = db.prepare(`
        INSERT OR IGNORE INTO products (
          name_en, name_fa, description_en, description_fa, specifications_en, specifications_fa,
          category_id, price, original_price, stock_quantity, sku, brand, rating, review_count,
          image_url, is_bestseller, is_featured
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      products.forEach(product => {
        insertProduct.run(
          product.name_en, product.name_fa, product.description_en, product.description_fa,
          product.specifications_en, product.specifications_fa, product.category_id,
          product.price, product.original_price, product.stock_quantity, product.sku,
          product.brand, product.rating, product.review_count, product.image_url,
          product.is_bestseller, product.is_featured
        );
      });

      insertProduct.finalize((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}
