# استخدام Node.js 18
FROM node:18-alpine

# تعيين مجلد العمل
WORKDIR /app

# نسخ ملفات package.json
COPY package*.json ./
COPY server/package*.json ./server/

# تثبيت التبعيات
RUN npm install
RUN cd server && npm install

# نسخ باقي الملفات
COPY . .

# بناء الواجهة الأمامية
RUN npm run build

# تعيين متغير البيئة
ENV NODE_ENV=production

# فتح المنفذ
EXPOSE 3001

# تشغيل الخادم
CMD ["node", "server/index.js"]
