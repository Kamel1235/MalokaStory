import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

if (!BOT_TOKEN) {
    console.error('❌ TELEGRAM_BOT_TOKEN غير موجود في متغيرات البيئة');
    process.exit(1);
}

// إعداد أوامر البوت
const commands = [
    {
        command: 'start',
        description: 'بدء المحادثة والترحيب'
    },
    {
        command: 'products',
        description: 'عرض جميع المنتجات المتاحة'
    },
    {
        command: 'categories',
        description: 'تصفح المنتجات حسب الفئات'
    },
    {
        command: 'offers',
        description: 'العروض والخصومات المميزة'
    },
    {
        command: 'contact',
        description: 'معلومات التواصل مع المتجر'
    },
    {
        command: 'help',
        description: 'المساعدة وقائمة الأوامر'
    }
];

// وصف البوت
const botDescription = `🏪 مرحباً بك في متجر أناقة الستانلس!

نحن متخصصون في إكسسوارات الستانلس ستيل عالية الجودة:
✨ حلق أنيقة
💍 خواتم مميزة  
📿 قلادات رائعة

يمكنك تصفح منتجاتنا وطلب ما يعجبك مباشرة من خلال البوت!`;

const aboutText = `متجر أناقة الستانلس - إكسسوارات عصرية بجودة عالية

🌟 منتجات من الستانلس ستيل المقاوم للصدأ
🚚 توصيل سريع لجميع أنحاء مصر
💎 تصميمات فريدة وعصرية
💰 أسعار مناسبة للجميع

للطلب والاستفسار تواصل معنا!`;

async function setupBot() {
    try {
        console.log('🤖 جاري إعداد بوت تلجرام...');

        // إعداد الأوامر
        console.log('📝 إعداد أوامر البوت...');
        const commandsResponse = await axios.post(
            `https://api.telegram.org/bot${BOT_TOKEN}/setMyCommands`,
            { commands }
        );

        if (commandsResponse.data.ok) {
            console.log('✅ تم إعداد أوامر البوت بنجاح');
        } else {
            console.error('❌ فشل في إعداد أوامر البوت:', commandsResponse.data);
        }

        // إعداد وصف البوت
        console.log('📄 إعداد وصف البوت...');
        const descriptionResponse = await axios.post(
            `https://api.telegram.org/bot${BOT_TOKEN}/setMyDescription`,
            { description: botDescription }
        );

        if (descriptionResponse.data.ok) {
            console.log('✅ تم إعداد وصف البوت بنجاح');
        } else {
            console.error('❌ فشل في إعداد وصف البوت:', descriptionResponse.data);
        }

        // إعداد النص التعريفي
        console.log('ℹ️ إعداد النص التعريفي...');
        const aboutResponse = await axios.post(
            `https://api.telegram.org/bot${BOT_TOKEN}/setMyShortDescription`,
            { short_description: aboutText }
        );

        if (aboutResponse.data.ok) {
            console.log('✅ تم إعداد النص التعريفي بنجاح');
        } else {
            console.error('❌ فشل في إعداد النص التعريفي:', aboutResponse.data);
        }

        // إعداد Webhook (إذا كان متاحاً)
        if (WEBHOOK_URL) {
            console.log('🔗 إعداد Webhook...');
            const webhookResponse = await axios.post(
                `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
                { 
                    url: `${WEBHOOK_URL}/webhook/${BOT_TOKEN}`,
                    allowed_updates: ['message', 'callback_query']
                }
            );

            if (webhookResponse.data.ok) {
                console.log('✅ تم إعداد Webhook بنجاح');
                console.log(`🌐 Webhook URL: ${WEBHOOK_URL}/webhook/${BOT_TOKEN}`);
            } else {
                console.error('❌ فشل في إعداد Webhook:', webhookResponse.data);
            }
        } else {
            console.log('⚠️ WEBHOOK_URL غير محدد - سيتم استخدام polling');
        }

        // الحصول على معلومات البوت
        console.log('🔍 جاري الحصول على معلومات البوت...');
        const botInfoResponse = await axios.get(
            `https://api.telegram.org/bot${BOT_TOKEN}/getMe`
        );

        if (botInfoResponse.data.ok) {
            const botInfo = botInfoResponse.data.result;
            console.log('✅ معلومات البوت:');
            console.log(`   📛 الاسم: ${botInfo.first_name}`);
            console.log(`   🔗 Username: @${botInfo.username}`);
            console.log(`   🆔 ID: ${botInfo.id}`);
            console.log(`   🔧 يدعم الأوامر: ${botInfo.supports_inline_queries ? 'نعم' : 'لا'}`);
        }

        console.log('\n🎉 تم إعداد البوت بنجاح!');
        console.log('\n📱 يمكنك الآن البحث عن البوت في تلجرام والبدء في استخدامه');
        console.log('\n🔧 للاختبار، أرسل /start للبوت');

    } catch (error) {
        console.error('❌ خطأ في إعداد البوت:', error.message);
        
        if (error.response) {
            console.error('📄 تفاصيل الخطأ:', error.response.data);
        }
        
        process.exit(1);
    }
}

// تشغيل الإعداد
setupBot();
