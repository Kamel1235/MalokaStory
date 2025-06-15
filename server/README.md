# 🏪 خادم متجر أناقة الستانلس

خادم خلفي متكامل لمتجر الإكسسوارات مع بوت تلجرام

## 🚀 المميزات

- **قاعدة بيانات SQLite** لتخزين المنتجات والطلبات
- **بوت تلجرام** للتفاعل مع العملاء
- **API RESTful** للواجهة الأمامية
- **إشعارات فورية** للطلبات الجديدة
- **إدارة شاملة** للمنتجات والطلبات

## 📋 المتطلبات

- Node.js 18+ 
- npm أو yarn
- حساب تلجرام بوت (اختياري)

## ⚙️ التثبيت

1. **تثبيت التبعيات:**
```bash
cd server
npm install
```

2. **إعداد متغيرات البيئة:**
```bash
cp .env.example .env
```

3. **تحرير ملف `.env`:**
```env
# إعدادات قاعدة البيانات
DATABASE_PATH=./database/store.db

# إعدادات بوت تلجرام (اختياري)
TELEGRAM_BOT_TOKEN=your_bot_token_here
ADMIN_CHAT_ID=your_chat_id_here

# إعدادات الخادم
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## 🤖 إعداد بوت تلجرام

### 1. إنشاء البوت:
1. ابحث عن `@BotFather` في تلجرام
2. أرسل `/newbot`
3. اتبع التعليمات لإنشاء البوت
4. احفظ الـ Token

### 2. الحصول على Chat ID:
1. ابحث عن `@userinfobot` في تلجرام
2. أرسل `/start` للحصول على Chat ID الخاص بك
3. استخدم هذا الرقم كـ `ADMIN_CHAT_ID`

### 3. تحديث ملف `.env`:
```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
ADMIN_CHAT_ID=123456789
```

## 🏃‍♂️ التشغيل

### تطوير:
```bash
npm run dev
```

### إنتاج:
```bash
npm start
```

### تشغيل البوت فقط:
```bash
npm run bot
```

## 📡 نقاط النهاية (API Endpoints)

### المنتجات:
- `GET /api/products` - جميع المنتجات
- `GET /api/products/:id` - منتج محدد
- `GET /api/products/category/:category` - منتجات فئة
- `GET /api/products/search/:query` - البحث
- `GET /api/products/offers/list` - العروض
- `POST /api/products` - إنشاء منتج (مدير)
- `PUT /api/products/:id` - تحديث منتج (مدير)
- `DELETE /api/products/:id` - حذف منتج (مدير)

### الطلبات:
- `GET /api/orders` - جميع الطلبات (مدير)
- `GET /api/orders/:id` - طلب محدد
- `GET /api/orders/status/:status` - طلبات حسب الحالة
- `GET /api/orders/search/:query` - البحث في الطلبات
- `POST /api/orders` - إنشاء طلب جديد
- `PATCH /api/orders/:id/status` - تحديث حالة الطلب (مدير)
- `DELETE /api/orders/:id` - حذف طلب (مدير)

### عام:
- `GET /health` - فحص حالة الخادم
- `POST /api/init-data` - تهيئة البيانات الأولية

## 🤖 أوامر بوت تلجرام

- `/start` - رسالة الترحيب
- `/products` - عرض المنتجات
- `/categories` - عرض الفئات
- `/category_[اسم الفئة]` - منتجات فئة معينة
- `/offers` - العروض المميزة
- `/contact` - معلومات التواصل
- `/help` - المساعدة

## 🗄️ هيكل قاعدة البيانات

### جدول المنتجات (products):
- `id` - معرف فريد
- `name` - اسم المنتج
- `description` - وصف المنتج
- `price` - السعر
- `category` - الفئة
- `images` - صور المنتج (JSON)
- `created_at` - تاريخ الإنشاء
- `updated_at` - تاريخ التحديث

### جدول الطلبات (orders):
- `id` - معرف فريد
- `customer_name` - اسم العميل
- `phone_number` - رقم الهاتف
- `address` - العنوان
- `total_amount` - المبلغ الإجمالي
- `status` - حالة الطلب
- `order_date` - تاريخ الطلب
- `telegram_chat_id` - معرف محادثة تلجرام
- `notes` - ملاحظات

### جدول عناصر الطلبات (order_items):
- `id` - معرف فريد
- `order_id` - معرف الطلب
- `product_id` - معرف المنتج
- `product_name` - اسم المنتج
- `product_image` - صورة المنتج
- `quantity` - الكمية
- `price` - السعر

## 🔧 استكشاف الأخطاء

### مشاكل شائعة:

1. **خطأ في قاعدة البيانات:**
   - تأكد من وجود مجلد `database`
   - تحقق من صلاحيات الكتابة

2. **بوت تلجرام لا يعمل:**
   - تحقق من صحة `TELEGRAM_BOT_TOKEN`
   - تأكد من صحة `ADMIN_CHAT_ID`

3. **مشاكل CORS:**
   - تحقق من `FRONTEND_URL` في `.env`

## 📝 ملاحظات

- قاعدة البيانات تُنشأ تلقائياً عند أول تشغيل
- البوت اختياري - الخادم يعمل بدونه
- جميع الأخطاء تُسجل في وحدة التحكم
- يمكن تشغيل عدة نسخ من الخادم على منافذ مختلفة

## 🆘 الدعم

إذا واجهت أي مشاكل:
1. تحقق من ملفات السجل
2. تأكد من إعدادات `.env`
3. راجع وحدة التحكم للأخطاء
