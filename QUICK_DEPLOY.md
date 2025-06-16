# 🚀 نشر سريع - متجر أناقة الستانلس

## 📱 الخطوة 1: إنشاء بوت تلجرام

1. **فتح تلجرام** والبحث عن `@BotFather`
2. **إرسال** `/newbot`
3. **اختيار اسم** للبوت: `Maloka Store Bot`
4. **اختيار username**: `@maloka_store_bot` (أو أي اسم متاح)
5. **حفظ Token** المُعطى: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

## 👤 الخطوة 2: الحصول على Chat ID

1. **البحث عن** `@userinfobot`
2. **إرسال** `/start`
3. **حفظ Chat ID**: `123456789`

## 🌐 الخطوة 3: النشر على Railway (الأسهل)

### أ. إعداد GitHub:
1. **إنشاء repository** جديد على GitHub
2. **رفع الكود**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/username/maloka-store.git
   git push -u origin main
   ```

### ب. النشر على Railway:
1. **زيارة** https://railway.app
2. **إنشاء حساب** مجاني
3. **اختيار** "Deploy from GitHub repo"
4. **اختيار** repository الخاص بك
5. **إعداد متغيرات البيئة**:

```env
NODE_ENV=production
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
ADMIN_CHAT_ID=123456789
WEBHOOK_URL=https://your-app-name.railway.app
DATABASE_PATH=./database/store.db
PORT=3001
JWT_SECRET=maloka_store_secret_2024
ADMIN_PASSWORD=Kamel01112024743
```

6. **النشر**: تلقائي بعد الإعداد

## 🔧 الخطوة 4: إعداد البوت

بعد النشر الناجح:

```bash
# إعداد أوامر البوت
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-app.railway.app/webhook/<YOUR_BOT_TOKEN>"}'
```

أو استخدم السكريبت المدمج:
```bash
cd server
npm run setup-bot
```

## 📦 الخطوة 5: إضافة البيانات الأولية

```bash
curl -X POST https://your-app.railway.app/api/init-data
```

## ✅ الخطوة 6: اختبار البوت

1. **البحث عن البوت** في تلجرام
2. **إرسال** `/start`
3. **تجربة الأوامر**:
   - `/products` - عرض المنتجات
   - `/categories` - الفئات
   - `/help` - المساعدة

## 🎯 البدائل السريعة الأخرى

### Render:
1. **زيارة** https://render.com
2. **إنشاء Web Service**
3. **ربط GitHub**
4. **إعداد**:
   - Build: `npm install && cd server && npm install && cd .. && npm run build`
   - Start: `cd server && npm start`

### Vercel:
1. **زيارة** https://vercel.com
2. **استيراد من GitHub**
3. **النشر تلقائي**

## 🔍 استكشاف الأخطاء السريع

### البوت لا يرد:
```bash
# تحقق من الـ Token
curl https://api.telegram.org/bot<YOUR_TOKEN>/getMe

# تحقق من Webhook
curl https://api.telegram.org/bot<YOUR_TOKEN>/getWebhookInfo
```

### الخادم لا يعمل:
- تحقق من logs في لوحة التحكم
- تأكد من متغيرات البيئة
- تحقق من PORT

## 📱 أوامر البوت المتاحة

بعد النشر الناجح:

### للعملاء:
- `/start` - الترحيب
- `/products` - المنتجات مع أزرار الطلب
- `/categories` - الفئات
- `/offers` - العروض
- `/contact` - التواصل
- `/help` - المساعدة

### مميزات متقدمة:
- 🖼️ عرض صور المنتجات
- 🔘 أزرار تفاعلية للطلب
- 📝 عملية طلب خطوة بخطوة
- ✅ تأكيد فوري
- 🔔 إشعارات للمدير

## 🎉 تهانينا!

البوت الآن جاهز ويعمل! يمكن للعملاء:
- تصفح المنتجات
- طلب المنتجات مباشرة
- الحصول على معلومات التواصل

وستحصل أنت على:
- إشعارات فورية للطلبات
- تفاصيل كاملة لكل طلب
- إدارة سهلة من تلجرام

## 📞 الدعم

للمساعدة:
- راجع `DEPLOYMENT_GUIDE.md` للتفاصيل
- تحقق من logs الخادم
- اختبر البوت محلياً أولاً
