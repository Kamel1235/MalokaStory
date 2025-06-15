
import React, { useState, useEffect } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { 
  THEME_COLORS, 
  DEFAULT_SITE_LOGO_URL, 
  ADMIN_SETTINGS_SITE_LOGO_KEY, 
  ADMIN_SETTINGS_HERO_SLIDER_IMAGES_KEY 
} from '../../constants';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const AdminAppearanceSettingsPage: React.FC = () => {
  const [siteLogoUrl, setSiteLogoUrl] = useLocalStorage<string>(ADMIN_SETTINGS_SITE_LOGO_KEY, DEFAULT_SITE_LOGO_URL);
  const [heroImages, setHeroImages] = useLocalStorage<string[]>(ADMIN_SETTINGS_HERO_SLIDER_IMAGES_KEY, []);

  const [newLogoFile, setNewLogoFile] = useState<File | null>(null);
  const [newLogoPreview, setNewLogoPreview] = useState<string | null>(null);
  
  const [newHeroImageFiles, setNewHeroImageFiles] = useState<FileList | null>(null);
  const [newHeroImagePreviews, setNewHeroImagePreviews] = useState<string[]>([]);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (newLogoFile) {
      const objectUrl = URL.createObjectURL(newLogoFile);
      setNewLogoPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl); // Clean up
    }
    setNewLogoPreview(null);
  }, [newLogoFile]);

  useEffect(() => {
    if (newHeroImageFiles && newHeroImageFiles.length > 0) {
      const previewUrls = Array.from(newHeroImageFiles).map(file => URL.createObjectURL(file));
      setNewHeroImagePreviews(previewUrls);
      return () => previewUrls.forEach(url => URL.revokeObjectURL(url)); // Clean up
    }
    setNewHeroImagePreviews([]);
  }, [newHeroImageFiles]);

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewLogoFile(e.target.files[0]);
    } else {
      setNewLogoFile(null);
    }
  };

  const handleHeroFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewHeroImageFiles(e.target.files);
    } else {
      setNewHeroImageFiles(null);
    }
  };

  const handleSaveLogo = async () => {
    if (!newLogoFile) {
      setFeedback({ type: 'error', message: 'يرجى اختيار ملف شعار أولاً.' });
      return;
    }
    try {
      const base64Logo = await fileToBase64(newLogoFile);
      setSiteLogoUrl(base64Logo);
      setNewLogoFile(null); // Reset file input
      setFeedback({ type: 'success', message: 'تم حفظ الشعار بنجاح!' });
    } catch (error) {
      console.error("Error saving logo:", error);
      setFeedback({ type: 'error', message: 'حدث خطأ أثناء حفظ الشعار.' });
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSaveHeroImages = async () => {
    if (!newHeroImageFiles || newHeroImageFiles.length === 0) {
      setFeedback({ type: 'error', message: 'يرجى اختيار ملف واحد على الأقل لصور السلايدر.' });
      return;
    }
    try {
      const base64Promises = Array.from(newHeroImageFiles).map(file => fileToBase64(file));
      const base64Images = await Promise.all(base64Promises);
      setHeroImages(base64Images);
      setNewHeroImageFiles(null); // Reset file input
      setFeedback({ type: 'success', message: 'تم حفظ صور السلايدر بنجاح!' });
    } catch (error) {
      console.error("Error saving hero images:", error);
      setFeedback({ type: 'error', message: 'حدث خطأ أثناء حفظ صور السلايدر.' });
    }
    setTimeout(() => setFeedback(null), 4000);
  };
  
  const handleRevertToDefaultLogo = () => {
    setSiteLogoUrl(DEFAULT_SITE_LOGO_URL);
    setNewLogoFile(null);
    setFeedback({ type: 'success', message: 'تم استعادة الشعار الافتراضي.' });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleRevertToDefaultHeroImages = () => {
    setHeroImages([]); // Empty array will trigger fallback in HomePage
    setNewHeroImageFiles(null);
    setFeedback({ type: 'success', message: 'تم استعادة صور السلايدر الافتراضية (المستمدة من المنتجات).' });
    setTimeout(() => setFeedback(null), 3000);
  };


  return (
    <div className={`p-4 md:p-6 rounded-lg ${THEME_COLORS.cardBackground} shadow-xl space-y-10`}>
      <h1 className={`text-3xl font-bold ${THEME_COLORS.accentGold} mb-8`}>إعدادات المظهر</h1>

      {feedback && (
        <div className={`mb-6 p-3 rounded-md text-white text-center ${feedback.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {feedback.message}
        </div>
      )}

      {/* Site Logo Section */}
      <section className={`p-6 border ${THEME_COLORS.borderColor} rounded-lg`}>
        <h2 className={`text-2xl font-semibold ${THEME_COLORS.accentGoldDarker} mb-6`}>شعار الموقع</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div>
            <h3 className={`${THEME_COLORS.textSecondary} mb-2`}>الشعار الحالي:</h3>
            <img 
                src={siteLogoUrl || DEFAULT_SITE_LOGO_URL} 
                alt="Current Site Logo" 
                className="h-20 w-auto object-contain bg-purple-800/50 p-2 rounded border border-purple-700"
                onError={(e) => (e.currentTarget.src = DEFAULT_SITE_LOGO_URL)}
            />
          </div>
          <div>
            <Input
              label="اختر شعار جديد (يفضل PNG بخلفية شفافة):"
              type="file"
              accept="image/*"
              onChange={handleLogoFileChange}
              className="mb-3"
            />
            {newLogoPreview && (
              <div className="mb-4">
                <h3 className={`${THEME_COLORS.textSecondary} mb-2`}>معاينة الشعار الجديد:</h3>
                <img src={newLogoPreview} alt="New logo preview" className="h-20 w-auto object-contain bg-purple-800/50 p-2 rounded border border-purple-700" />
              </div>
            )}
            <div className="flex space-x-3 space-x-reverse">
                <Button onClick={handleSaveLogo} disabled={!newLogoFile}>حفظ الشعار الجديد</Button>
                <Button onClick={handleRevertToDefaultLogo} variant="secondary">استعادة الافتراضي</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Slider Images Section */}
      <section className={`p-6 border ${THEME_COLORS.borderColor} rounded-lg`}>
        <h2 className={`text-2xl font-semibold ${THEME_COLORS.accentGoldDarker} mb-6`}>صور السلايدر الرئيسي</h2>
        <div>
          <h3 className={`${THEME_COLORS.textSecondary} mb-2`}>الصور الحالية في السلايدر:</h3>
          {heroImages && heroImages.length > 0 ? (
            <div className="flex flex-wrap gap-3 mb-4">
              {heroImages.map((img, index) => (
                <img key={index} src={img} alt={`Current hero ${index + 1}`} className="h-24 w-auto object-cover rounded shadow-md border border-purple-700" />
              ))}
            </div>
          ) : (
            <p className={`${THEME_COLORS.textSecondary} mb-4 italic`}>يتم حاليًا استخدام صور المنتجات الافتراضية للسلايدر.</p>
          )}
        </div>
        <div>
          <Input
            label="اختر صور جديدة للسلايدر (يمكن اختيار عدة صور):"
            type="file"
            multiple
            accept="image/*"
            onChange={handleHeroFilesChange}
            className="mb-3"
          />
          {newHeroImagePreviews.length > 0 && (
            <div className="mb-4">
              <h3 className={`${THEME_COLORS.textSecondary} mb-2`}>معاينة الصور الجديدة:</h3>
              <div className="flex flex-wrap gap-3">
                {newHeroImagePreviews.map((preview, index) => (
                  <img key={index} src={preview} alt={`New hero preview ${index + 1}`} className="h-24 w-auto object-cover rounded shadow-md border border-purple-700" />
                ))}
              </div>
            </div>
          )}
          <div className="flex space-x-3 space-x-reverse">
            <Button onClick={handleSaveHeroImages} disabled={!newHeroImageFiles || newHeroImageFiles.length === 0}>حفظ صور السلايدر</Button>
            <Button onClick={handleRevertToDefaultHeroImages} variant="secondary">استعادة الافتراضي</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminAppearanceSettingsPage;