# 🚀 دليل النشر والاستضافة - متجر أناقة الستانلس

## 🎯 نظرة عامة

هذا الدليل يشرح كيفية نشر المتجر على منصات الاستضافة المجانية مع بوت تلجرام كواجهة رئيسية.

## 🤖 إعداد بوت تلجرام (خطوة أساسية)

### 1. إنشاء البوت:
1. فتح تلجرام والبحث عن `@BotFather`
2. إرسال `/newbot`
3. اختيار اسم للبوت (مثل: Maloka Store Bot)
4. اختيار username (مثل: @maloka_store_bot)
5. حفظ الـ Token المُعطى

### 2. الحصول على Chat ID:
1. البحث عن `@userinfobot` في تلجرام
2. إرسال `/start`
3. حفظ الـ Chat ID المُعطى

### 3. تخصيص البوت:
```
/setdescription - وصف البوت
/setabouttext - معلومات عن البوت
/setuserpic - صورة البوت
/setcommands - قائمة الأوامر
```

## 🌐 خيارات الاستضافة المجانية

### 1. Railway (الأفضل للمبتدئين)

#### المميزات:
- ✅ استضافة مجانية 500 ساعة/شهر
- ✅ قاعدة بيانات مدمجة
- ✅ نشر تلقائي من GitHub
- ✅ SSL مجاني

#### خطوات النشر:
1. **إنشاء حساب**: https://railway.app
2. **ربط GitHub**: رفع الكود على GitHub
3. **إنشاء مشروع جديد**: "Deploy from GitHub repo"
4. **إعداد متغيرات البيئة**:
   ```
   NODE_ENV=production
   TELEGRAM_BOT_TOKEN=your_bot_token
   ADMIN_CHAT_ID=your_chat_id
   WEBHOOK_URL=https://your-app.railway.app
   DATABASE_PATH=./database/store.db
   PORT=3001
   ```
5. **النشر**: تلقائي بعد الإعداد

### 2. Render (مستقر وموثوق)

#### المميزات:
- ✅ استضافة مجانية 750 ساعة/شهر
- ✅ SSL تلقائي
- ✅ نشر من GitHub
- ✅ قواعد بيانات مجانية

#### خطوات النشر:
1. **إنشاء حساب**: https://render.com
2. **إنشاء Web Service**: "Connect Repository"
3. **الإعدادات**:
   - Build Command: `npm install && cd server && npm install && cd .. && npm run build`
   - Start Command: `cd server && npm start`
   - Environment: Node
4. **متغيرات البيئة**: نفس Railway

### 3. Vercel (للواجهات الأمامية)

#### المميزات:
- ✅ مجاني تماماً
- ✅ سرعة عالية
- ✅ CDN عالمي

#### خطوات النشر:
1. **إنشاء حساب**: https://vercel.com
2. **ربط GitHub**: استيراد المشروع
3. **النشر**: تلقائي

### 4. Heroku (خيار تقليدي)

#### المميزات:
- ✅ 550 ساعة مجانية/شهر
- ✅ إضافات متنوعة
- ✅ سهولة الإدارة

#### خطوات النشر:
1. **إنشاء حساب**: https://heroku.com
2. **تثبيت Heroku CLI**
3. **الأوامر**:
   ```bash
   heroku create maloka-store
   heroku config:set TELEGRAM_BOT_TOKEN=your_token
   heroku config:set ADMIN_CHAT_ID=your_chat_id
   git push heroku main
   ```

## 🔧 إعداد Webhook للبوت

بعد النشر، يجب إعداد webhook للبوت:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-app-url.com/webhook/<YOUR_BOT_TOKEN>"}'
```

## 📊 إعداد قاعدة البيانات

### للاستضافة المحلية:
- SQLite (ملف محلي)
- تُنشأ تلقائياً

### للاستضافة السحابية:
- PostgreSQL (Render, Railway)
- MongoDB Atlas (مجاني)

## 🛠️ متغيرات البيئة المطلوبة

```env
# أساسية
NODE_ENV=production
PORT=3001

# بوت تلجرام
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
ADMIN_CHAT_ID=123456789
WEBHOOK_URL=https://your-app.railway.app

# قاعدة البيانات
DATABASE_PATH=./database/store.db

# أمان
JWT_SECRET=your_secret_key
ADMIN_PASSWORD=Kamel01112024743

# اختيارية
GEMINI_API_KEY=your_gemini_key
```

## 🤖 أوامر البوت المتاحة

بعد النشر، سيدعم البوت:

### للعملاء:
- `/start` - رسالة الترحيب
- `/products` - عرض المنتجات مع أزرار الطلب
- `/categories` - تصفح حسب الفئات
- `/offers` - العروض المميزة
- `/contact` - معلومات التواصل
- `/help` - المساعدة

### للمدير:
- إشعارات فورية للطلبات الجديدة
- تفاصيل كاملة لكل طلب
- معلومات العميل والمنتج

## 📱 مميزات البوت المحسن

### تجربة مستخدم محسنة:
- 🖼️ عرض صور المنتجات
- 🔘 أزرار تفاعلية للطلب
- 📝 عملية طلب خطوة بخطوة
- ✅ تأكيد فوري للطلبات
- 🔍 بحث ذكي في المنتجات

### للمدير:
- 🔔 إشعارات فورية
- 📊 تفاصيل شاملة للطلبات
- 📱 إدارة من تلجرام مباشرة

## 🔄 التحديث والصيانة

### تحديث الكود:
1. رفع التغييرات على GitHub
2. النشر تلقائي على المنصة
3. إعادة تشغيل البوت تلقائياً

### النسخ الاحتياطي:
- قاعدة البيانات تُحفظ تلقائياً
- إعدادات البوت محفوظة في متغيرات البيئة

## 🚨 استكشاف الأخطاء

### مشاكل شائعة:

1. **البوت لا يرد**:
   - تحقق من TELEGRAM_BOT_TOKEN
   - تأكد من إعداد Webhook
   - راجع logs الخادم

2. **قاعدة البيانات لا تعمل**:
   - تحقق من DATABASE_PATH
   - تأكد من صلاحيات الكتابة

3. **الطلبات لا تُرسل**:
   - تحقق من ADMIN_CHAT_ID
   - تأكد من تشغيل الخادم

## 📈 تحسين الأداء

### نصائح:
- استخدم CDN للصور
- فعّل compression
- راقب استخدام الذاكرة
- استخدم rate limiting

## 🎯 الخطوات التالية

بعد النشر الناجح:
1. اختبار جميع وظائف البوت
2. إضافة المنتجات الحقيقية
3. تخصيص الرسائل والأوامر
4. مراقبة الأداء والأخطاء
5. جمع تعليقات المستخدمين

## 📞 الدعم

للمساعدة في النشر:
- راجع logs الخادم
- تحقق من متغيرات البيئة
- اختبر البوت محلياً أولاً
