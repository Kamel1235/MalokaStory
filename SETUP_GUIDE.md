# 🚀 دليل إعداد وتشغيل متجر أناقة الستانلس

## 📋 نظرة عامة

تم تطوير النظام ليشمل:
- **واجهة أمامية**: React + TypeScript + Vite
- **خادم خلفي**: Node.js + Express + SQLite
- **بوت تلجرام**: للتفاعل مع العملاء
- **قاعدة بيانات**: SQLite للبساطة والسرعة

## 🛠️ المتطلبات

### 1. تثبيت Node.js
- تحميل وتثبيت Node.js 18+ من: https://nodejs.org
- التحقق من التثبيت: `node --version` و `npm --version`

### 2. إعداد بوت تلجرام (اختياري)
1. فتح تلجرام والبحث عن `@BotFather`
2. إرسال `/newbot` واتباع التعليمات
3. حفظ الـ Token المُعطى
4. البحث عن `@userinfobot` والحصول على Chat ID

## ⚙️ خطوات التثبيت

### 1. تثبيت تبعيات الواجهة الأمامية
```bash
npm install
```

### 2. تثبيت تبعيات الخادم الخلفي
```bash
cd server
npm install
```

### 3. إعداد متغيرات البيئة

#### للخادم الخلفي (server/.env):
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

# الأمان
JWT_SECRET=maloka_store_secret_key_2024
ADMIN_PASSWORD=Kamel01112024743
```

#### للواجهة الأمامية (.env):
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_NODE_ENV=development
```

## 🏃‍♂️ تشغيل النظام

### الطريقة الأولى: تشغيل كامل
```bash
npm run dev:full
```

### الطريقة الثانية: تشغيل منفصل

#### 1. تشغيل الخادم الخلفي:
```bash
cd server
npm run dev
```

#### 2. تشغيل الواجهة الأمامية (في terminal جديد):
```bash
npm run dev
```

## 🌐 الوصول للنظام

- **الواجهة الأمامية**: http://localhost:5173
- **الخادم الخلفي**: http://localhost:3001
- **لوحة التحكم**: http://localhost:5173/#/admin
  - كلمة المرور: `Kamel01112024743`

## 🤖 أوامر بوت تلجرام

بعد إعداد البوت، يمكن للعملاء استخدام:
- `/start` - رسالة الترحيب
- `/products` - عرض المنتجات
- `/categories` - عرض الفئات
- `/offers` - العروض المميزة
- `/contact` - معلومات التواصل

## 📊 إدارة البيانات

### تهيئة البيانات الأولية:
```bash
curl -X POST http://localhost:3001/api/init-data
```

### نسخ احتياطي من قاعدة البيانات:
```bash
cp server/database/store.db server/database/backup_$(date +%Y%m%d).db
```

## 🔧 استكشاف الأخطاء

### مشاكل شائعة:

1. **خطأ "npm not found"**:
   - تأكد من تثبيت Node.js بشكل صحيح
   - أعد تشغيل Terminal

2. **خطأ في الاتصال بقاعدة البيانات**:
   - تأكد من وجود مجلد `server/database`
   - تحقق من صلاحيات الكتابة

3. **بوت تلجرام لا يعمل**:
   - تحقق من صحة `TELEGRAM_BOT_TOKEN`
   - تأكد من صحة `ADMIN_CHAT_ID`
   - البوت اختياري - النظام يعمل بدونه

4. **مشاكل CORS**:
   - تأكد من تطابق `FRONTEND_URL` في server/.env
   - تحقق من تشغيل الخادم على المنفذ الصحيح

## 📱 المميزات المتاحة

### للعملاء:
- تصفح المنتجات حسب الفئات
- البحث في المنتجات
- مساعد الهدايا الذكي (AI)
- تقديم الطلبات
- التفاعل مع بوت تلجرام

### للمدير:
- إدارة المنتجات (إضافة، تعديل، حذف)
- إدارة الطلبات وتتبع الحالات
- تخصيص إعدادات الموقع
- استقبال إشعارات الطلبات عبر تلجرام

## 🔄 التحديثات المستقبلية

يمكن إضافة:
- نظام دفع إلكتروني
- إشعارات push للعملاء
- تقارير مبيعات متقدمة
- دعم متعدد اللغات
- تطبيق موبايل

## 📞 الدعم

في حالة وجود مشاكل:
1. تحقق من ملفات السجل في Terminal
2. راجع ملف `.env` للتأكد من الإعدادات
3. تأكد من تشغيل جميع الخدمات

## 🎯 ملاحظات مهمة

- النظام يعمل في وضعين: متصل (مع الخادم) ومحلي (بدون خادم)
- البيانات تُحفظ في قاعدة بيانات SQLite محلية
- بوت تلجرام اختياري ولا يؤثر على عمل النظام
- يمكن نشر النظام على خوادم مجانية مثل Vercel أو Netlify
