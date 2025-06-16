import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const adminChatId = process.env.ADMIN_CHAT_ID;
const webhookUrl = process.env.WEBHOOK_URL;

let bot = null;

// حالات المحادثة للمستخدمين
const userStates = new Map();

// أنواع الحالات
const STATES = {
  NONE: 'none',
  ORDERING: 'ordering',
  WAITING_NAME: 'waiting_name',
  WAITING_PHONE: 'waiting_phone',
  WAITING_ADDRESS: 'waiting_address',
  WAITING_QUANTITY: 'waiting_quantity'
};

// تهيئة البوت
export function initializeBot() {
    if (!token) {
        console.log('⚠️  لم يتم تعيين TELEGRAM_BOT_TOKEN - البوت معطل');
        return null;
    }

    try {
        // استخدام webhook في الإنتاج، polling في التطوير
        if (process.env.NODE_ENV === 'production' && webhookUrl) {
            bot = new TelegramBot(token);
            bot.setWebHook(`${webhookUrl}/webhook/${token}`);
            console.log('🤖 تم تشغيل بوت تلجرام مع Webhook');
        } else {
            bot = new TelegramBot(token, { polling: true });
            console.log('🤖 تم تشغيل بوت تلجرام مع Polling');
        }

        setupBotCommands();
        return bot;
    } catch (error) {
        console.error('❌ خطأ في تشغيل بوت تلجرام:', error);
        return null;
    }
}

// معالج webhook
export function handleWebhook(req, res) {
    if (bot) {
        bot.processUpdate(req.body);
    }
    res.sendStatus(200);
}

// إعداد أوامر البوت
function setupBotCommands() {
    if (!bot) return;

    // أمر البداية
    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        const welcomeMessage = `
🌟 أهلاً وسهلاً بك في متجر أناقة الستانلس! 🌟

نحن متخصصون في إكسسوارات الستانلس ستيل عالية الجودة:
• حلق أنيقة ✨
• خواتم مميزة 💍  
• قلادات رائعة 📿

الأوامر المتاحة:
/products - عرض جميع المنتجات
/categories - عرض الفئات
/offers - العروض المميزة
/contact - معلومات التواصل
/help - المساعدة

كيف يمكنني مساعدتك اليوم؟ 😊
        `;
        
        bot.sendMessage(chatId, welcomeMessage);
    });

    // عرض المنتجات مع أزرار الطلب
    bot.onText(/\/products/, async (msg) => {
        const chatId = msg.chat.id;

        try {
            const products = await Product.getAll();

            if (products.length === 0) {
                bot.sendMessage(chatId, 'لا توجد منتجات متاحة حالياً 😔');
                return;
            }

            // إرسال كل منتج في رسالة منفصلة مع صورة وزر طلب
            for (let i = 0; i < Math.min(products.length, 8); i++) {
                const product = products[i];

                const message = `🛍️ ${product.name}\n\n💰 السعر: ${product.price} جنيه\n📝 ${product.description}\n🏷️ الفئة: ${product.category}`;

                const keyboard = {
                    reply_markup: {
                        inline_keyboard: [[
                            { text: `🛒 اطلب الآن`, callback_data: `order_${product.id}` },
                            { text: `📋 التفاصيل`, callback_data: `details_${product.id}` }
                        ]]
                    }
                };

                if (product.images && product.images.length > 0) {
                    try {
                        await bot.sendPhoto(chatId, product.images[0], {
                            caption: message,
                            ...keyboard
                        });
                    } catch (photoError) {
                        // إذا فشل إرسال الصورة، أرسل النص فقط
                        await bot.sendMessage(chatId, message, keyboard);
                    }
                } else {
                    await bot.sendMessage(chatId, message, keyboard);
                }

                // تأخير قصير لتجنب spam
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            if (products.length > 8) {
                bot.sendMessage(chatId, `📦 يوجد ${products.length - 8} منتج إضافي. استخدم البحث للعثور على منتجات محددة.`);
            }
        } catch (error) {
            console.error('خطأ في جلب المنتجات:', error);
            bot.sendMessage(chatId, 'حدث خطأ في جلب المنتجات. حاول مرة أخرى لاحقاً.');
        }
    });

    // معالجة الأزرار التفاعلية
    bot.on('callback_query', async (callbackQuery) => {
        const chatId = callbackQuery.message.chat.id;
        const data = callbackQuery.data;
        const messageId = callbackQuery.message.message_id;

        try {
            if (data.startsWith('order_')) {
                const productId = data.replace('order_', '');
                const product = await Product.getById(productId);

                if (!product) {
                    bot.answerCallbackQuery(callbackQuery.id, { text: 'المنتج غير موجود' });
                    return;
                }

                // بدء عملية الطلب
                userStates.set(chatId, {
                    state: STATES.WAITING_NAME,
                    product: product,
                    orderData: {}
                });

                const keyboard = {
                    reply_markup: {
                        keyboard: [['إلغاء الطلب']],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                };

                bot.sendMessage(chatId,
                    `🛍️ ممتاز! تريد طلب: ${product.name}\n💰 السعر: ${product.price} جنيه\n\nلإتمام الطلب، أحتاج بعض المعلومات:\n\n👤 ما اسمك الكريم؟`,
                    keyboard
                );

                bot.answerCallbackQuery(callbackQuery.id, { text: 'تم بدء عملية الطلب!' });
            }
            else if (data.startsWith('details_')) {
                const productId = data.replace('details_', '');
                const product = await Product.getById(productId);

                if (!product) {
                    bot.answerCallbackQuery(callbackQuery.id, { text: 'المنتج غير موجود' });
                    return;
                }

                const detailsMessage = `
📋 تفاصيل المنتج:

🛍️ الاسم: ${product.name}
💰 السعر: ${product.price} جنيه
🏷️ الفئة: ${product.category}
📝 الوصف: ${product.description}
🆔 رقم المنتج: ${product.id}

للطلب اضغط على "🛒 اطلب الآن"
                `;

                bot.sendMessage(chatId, detailsMessage);
                bot.answerCallbackQuery(callbackQuery.id, { text: 'تم عرض التفاصيل' });
            }
        } catch (error) {
            console.error('خطأ في معالجة الزر:', error);
            bot.answerCallbackQuery(callbackQuery.id, { text: 'حدث خطأ، حاول مرة أخرى' });
        }
    });

    // عرض الفئات
    bot.onText(/\/categories/, async (msg) => {
        const chatId = msg.chat.id;
        
        const categories = [
            { name: 'حلق', emoji: '✨', command: '/category_حلق' },
            { name: 'خاتم', emoji: '💍', command: '/category_خاتم' },
            { name: 'قلادة', emoji: '📿', command: '/category_قلادة' }
        ];

        let message = '📂 فئات المنتجات:\n\n';
        
        categories.forEach(cat => {
            message += `${cat.emoji} ${cat.name} - ${cat.command}\n`;
        });

        bot.sendMessage(chatId, message);
    });

    // عرض منتجات فئة معينة
    bot.onText(/\/category_(.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const category = match[1];
        
        try {
            const products = await Product.getByCategory(category);
            
            if (products.length === 0) {
                bot.sendMessage(chatId, `لا توجد منتجات في فئة "${category}" حالياً 😔`);
                return;
            }

            let message = `🏷️ منتجات فئة "${category}":\n\n`;
            
            products.forEach((product, index) => {
                message += `${index + 1}. ${product.name}\n`;
                message += `   💰 ${product.price} جنيه\n`;
                message += `   📝 ${product.description}\n\n`;
            });

            bot.sendMessage(chatId, message);
        } catch (error) {
            console.error('خطأ في جلب منتجات الفئة:', error);
            bot.sendMessage(chatId, 'حدث خطأ في جلب المنتجات. حاول مرة أخرى لاحقاً.');
        }
    });

    // عرض العروض
    bot.onText(/\/offers/, async (msg) => {
        const chatId = msg.chat.id;
        
        try {
            const offers = await Product.getOffers(200);
            
            if (offers.length === 0) {
                bot.sendMessage(chatId, 'لا توجد عروض متاحة حالياً 😔');
                return;
            }

            let message = '🔥 العروض المميزة:\n\n';
            
            offers.forEach((product, index) => {
                message += `${index + 1}. ${product.name}\n`;
                message += `   💰 ${product.price} جنيه فقط!\n`;
                message += `   📝 ${product.description}\n\n`;
            });

            bot.sendMessage(chatId, message);
        } catch (error) {
            console.error('خطأ في جلب العروض:', error);
            bot.sendMessage(chatId, 'حدث خطأ في جلب العروض. حاول مرة أخرى لاحقاً.');
        }
    });

    // معلومات التواصل
    bot.onText(/\/contact/, (msg) => {
        const chatId = msg.chat.id;
        const contactMessage = `
📞 معلومات التواصل:

🏪 متجر أناقة الستانلس
📱 الهاتف: +20 123 456 7890
📧 البريد: support@elegance-store.com
🕒 ساعات العمل: السبت - الخميس، 9 صباحاً - 6 مساءً

🌐 وسائل التواصل الاجتماعي:
• فيسبوك: [رابط الصفحة]
• إنستجرام: [رابط الحساب]
• تيك توك: [رابط الحساب]

نحن هنا لخدمتك! 😊
        `;
        
        bot.sendMessage(chatId, contactMessage);
    });

    // المساعدة
    bot.onText(/\/help/, (msg) => {
        const chatId = msg.chat.id;
        const helpMessage = `
🆘 المساعدة - أوامر البوت:

/start - رسالة الترحيب
/products - عرض جميع المنتجات
/categories - عرض فئات المنتجات
/category_[اسم الفئة] - منتجات فئة معينة
/offers - العروض المميزة
/contact - معلومات التواصل
/help - هذه الرسالة

💡 نصائح:
• يمكنك كتابة اسم المنتج للبحث عنه
• للطلب، تواصل معنا مباشرة أو زر موقعنا
• نحن نرد على جميع الاستفسارات بسرعة

أي سؤال آخر؟ 🤔
        `;
        
        bot.sendMessage(chatId, helpMessage);
    });

    // أمر الطلب المباشر
    bot.onText(/\/order_(\d+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const productIndex = parseInt(match[1]) - 1;

        try {
            const products = await Product.getAll();
            const product = products[productIndex];

            if (!product) {
                bot.sendMessage(chatId, 'المنتج غير موجود. استخدم /products لعرض المنتجات المتاحة.');
                return;
            }

            // بدء عملية الطلب
            userStates.set(chatId, {
                state: STATES.WAITING_NAME,
                product: product,
                orderData: {}
            });

            const keyboard = {
                reply_markup: {
                    keyboard: [['إلغاء الطلب']],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            };

            bot.sendMessage(chatId,
                `🛍️ ممتاز! تريد طلب: ${product.name}\n💰 السعر: ${product.price} جنيه\n\nلإتمام الطلب، أحتاج بعض المعلومات:\n\n👤 ما اسمك الكريم؟`,
                keyboard
            );
        } catch (error) {
            console.error('خطأ في بدء الطلب:', error);
            bot.sendMessage(chatId, 'حدث خطأ. حاول مرة أخرى لاحقاً.');
        }
    });

    // معالجة الرسائل النصية (البحث وإدخال بيانات الطلب)
    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;

        // تجاهل الأوامر
        if (text.startsWith('/')) return;

        // التحقق من حالة المستخدم
        const userState = userStates.get(chatId);

        if (userState) {
            await handleOrderProcess(chatId, text, userState);
            return;
        }

        // البحث في المنتجات
        try {
            const products = await Product.search(text);

            if (products.length === 0) {
                bot.sendMessage(chatId, `لم أجد منتجات تحتوي على "${text}" 😔\n\nجرب البحث بكلمات أخرى أو استخدم /products لعرض جميع المنتجات.`);
                return;
            }

            let message = `🔍 نتائج البحث عن "${text}":\n\n`;

            products.slice(0, 5).forEach((product, index) => {
                message += `${index + 1}. ${product.name}\n`;
                message += `   💰 ${product.price} جنيه\n`;
                message += `   📝 ${product.description}\n`;
                message += `   🛒 للطلب: /order_${index + 1}\n\n`;
            });

            if (products.length > 5) {
                message += `... وجدت ${products.length - 5} منتجات أخرى\n`;
            }

            bot.sendMessage(chatId, message);
        } catch (error) {
            console.error('خطأ في البحث:', error);
            bot.sendMessage(chatId, 'حدث خطأ في البحث. حاول مرة أخرى لاحقاً.');
        }
    });
}

// معالجة عملية الطلب خطوة بخطوة
async function handleOrderProcess(chatId, text, userState) {
    if (text === 'إلغاء الطلب') {
        userStates.delete(chatId);
        bot.sendMessage(chatId, 'تم إلغاء الطلب. يمكنك البدء من جديد في أي وقت! 😊', {
            reply_markup: { remove_keyboard: true }
        });
        return;
    }

    const { state, product, orderData } = userState;

    switch (state) {
        case STATES.WAITING_NAME:
            if (text.length < 2) {
                bot.sendMessage(chatId, 'يرجى إدخال اسم صحيح (أكثر من حرفين)');
                return;
            }
            orderData.customerName = text;
            userState.state = STATES.WAITING_PHONE;
            bot.sendMessage(chatId, '📱 ممتاز! الآن أحتاج رقم هاتفك للتواصل معك:\n(مثال: 01001234567)');
            break;

        case STATES.WAITING_PHONE:
            const phoneRegex = /^(010|011|012|015)\d{8}$/;
            if (!phoneRegex.test(text.replace(/\s+/g, ''))) {
                bot.sendMessage(chatId, 'رقم الهاتف غير صحيح. يجب أن يبدأ بـ 010, 011, 012, أو 015 ويتكون من 11 رقماً.\nمثال: 01001234567');
                return;
            }
            orderData.phoneNumber = text.replace(/\s+/g, '');
            userState.state = STATES.WAITING_ADDRESS;
            bot.sendMessage(chatId, '📍 رائع! الآن أحتاج عنوانك بالتفصيل:\n(المحافظة، المدينة، الشارع، رقم المبنى)');
            break;

        case STATES.WAITING_ADDRESS:
            if (text.length < 10) {
                bot.sendMessage(chatId, 'يرجى إدخال عنوان مفصل أكثر (على الأقل 10 أحرف)');
                return;
            }
            orderData.address = text;
            userState.state = STATES.WAITING_QUANTITY;
            bot.sendMessage(chatId, `🔢 كم قطعة تريد من "${product.name}"؟\n(اكتب رقم من 1 إلى 10)`);
            break;

        case STATES.WAITING_QUANTITY:
            const quantity = parseInt(text);
            if (isNaN(quantity) || quantity < 1 || quantity > 10) {
                bot.sendMessage(chatId, 'يرجى إدخال رقم صحيح من 1 إلى 10');
                return;
            }
            orderData.quantity = quantity;

            // إنشاء الطلب
            await createOrderFromTelegram(chatId, product, orderData);
            break;
    }

    userStates.set(chatId, userState);
}

// إنشاء طلب من تلجرام
async function createOrderFromTelegram(chatId, product, orderData) {
    try {
        const totalAmount = product.price * orderData.quantity;

        const order = await Order.create({
            customer_name: orderData.customerName,
            phone_number: orderData.phoneNumber,
            address: orderData.address,
            total_amount: totalAmount,
            telegram_chat_id: chatId.toString(),
            items: [{
                product_id: product.id,
                product_name: product.name,
                product_image: product.images[0] || '',
                quantity: orderData.quantity,
                price: product.price
            }]
        });

        // رسالة تأكيد للعميل
        const confirmationMessage = `
✅ تم استلام طلبك بنجاح!

📋 تفاصيل الطلب:
👤 الاسم: ${orderData.customerName}
📱 الهاتف: ${orderData.phoneNumber}
📍 العنوان: ${orderData.address}
🛍️ المنتج: ${product.name}
🔢 الكمية: ${orderData.quantity}
💰 المبلغ الإجمالي: ${totalAmount} جنيه

🆔 رقم الطلب: ${order.id}

سنتواصل معك قريباً لتأكيد الطلب والتوصيل. شكراً لثقتك بنا! 💖
        `;

        bot.sendMessage(chatId, confirmationMessage, {
            reply_markup: { remove_keyboard: true }
        });

        // إرسال إشعار للمدير
        await sendOrderNotification(order);

        // مسح حالة المستخدم
        userStates.delete(chatId);

    } catch (error) {
        console.error('خطأ في إنشاء الطلب:', error);
        bot.sendMessage(chatId, 'حدث خطأ في إنشاء الطلب. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة.', {
            reply_markup: { remove_keyboard: true }
        });
        userStates.delete(chatId);
    }
}

// إرسال إشعار طلب جديد للمدير
export async function sendOrderNotification(order) {
    if (!bot || !adminChatId) {
        console.log('⚠️  لا يمكن إرسال إشعار الطلب - البوت أو معرف المدير غير متاح');
        return;
    }

    try {
        const message = `
🔔 طلب جديد!

👤 العميل: ${order.customer_name}
📱 الهاتف: ${order.phone_number}
📍 العنوان: ${order.address}
💰 المبلغ الإجمالي: ${order.total_amount} جنيه

📦 المنتجات:
${order.items.map(item => `• ${item.product_name} (${item.quantity}x)`).join('\n')}

📅 تاريخ الطلب: ${new Date(order.order_date).toLocaleString('ar-EG')}
🆔 رقم الطلب: ${order.id}

${order.notes ? `📝 ملاحظات: ${order.notes}` : ''}
        `;

        await bot.sendMessage(adminChatId, message);
        console.log('✅ تم إرسال إشعار الطلب للمدير');
    } catch (error) {
        console.error('❌ خطأ في إرسال إشعار الطلب:', error);
        throw error;
    }
}

// تصدير البوت
export { bot };

// تشغيل البوت إذا تم تشغيل هذا الملف مباشرة
if (import.meta.url === `file://${process.argv[1]}`) {
    initializeBot();
}
