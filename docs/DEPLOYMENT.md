# 🚀 دليل النشر خطوة بخطوة | Deployment Guide

دليل مبسّط لرفع المشروع على GitHub ونشره ليستفيد منه الطلاب.

---

## 🧭 الخطوة 0 — قبل النشر (مهم!)

استبدل `BebooBombaa/python-visual-explainer` باسم مستودعك الحقيقي في الملفات التالية:

| الملف | السطر / المكان |
| :--- | :--- |
| `src/App.tsx` | ثابت `REPO_URL` في أعلى الملف |
| `README.md` | رابط `git clone` وروابط الشارات |
| `.github/ISSUE_TEMPLATE/config.yml` | روابط `contact_links` |

> 💡 نصيحة: استخدم بحث واستبدال في محررك (Ctrl+Shift+H) لكلمة `BebooBombaa` مرة واحدة.

---

## 📤 الخطوة 1 — رفع المشروع على GitHub

### أ) أنشئ مستودعاً جديداً

1. اذهب إلى [github.com/new](https://github.com/new)
2. **Repository name:** `python-visual-explainer`
3. **Description:** `🐍 أداة تعليمية تشرح كود بايثون خطوة بخطوة بشكل بصري بالعربية`
4. اختر **Public** ✅ (ضروري لتفعيل GitHub Pages مجاناً)
5. **لا تُفعّل** خيار "Add a README file" — لدينا واحد بالفعل
6. اضغط **Create repository**

### ب) ارفع الملفات

```bash
# داخل مجلد المشروع
git init
git add .
git commit -m "feat: الإصدار الأول من مُفسّر بايثون المرئي"
git branch -M main
git remote add origin https://github.com/BebooBombaa/python-visual-explainer.git
git push -u origin main
```

---

## 🌍 الخطوة 2 — تفعيل GitHub Pages

1. في صفحة المستودع، اذهب إلى **Settings** ⚙️
2. من القائمة الجانبية اختر **Pages**
3. تحت **Build and deployment → Source** اختر **GitHub Actions**
4. انتهى! ✅

سيبدأ سير العمل تلقائياً. تابع التقدّم من تبويب **Actions**.
بعد دقيقة تقريباً سيكون الموقع متاحاً على:

```
https://BebooBombaa.github.io/python-visual-explainer/
```

> ✅ **لماذا لا نحتاج ضبط `base` في Vite؟**
> لأن المشروع يستخدم `vite-plugin-singlefile`، فالمخرج ملف `index.html` واحد
> يحتوي على كل الـ JS و CSS مدمجين بداخله — لا توجد روابط أصول نسبية تنكسر تحت مسار فرعي.

---

## 🏷️ الخطوة 3 — تحسين ظهور المستودع

### أضف وصفاً وكلمات مفتاحية

في صفحة المستودع، اضغط ⚙️ بجانب **About** وأضف:

**Description:**
```
🐍 أداة تعليمية مرئية تشرح كود بايثون خطوة بخطوة بالعربية للمبتدئين
```

**Website:** `https://BebooBombaa.github.io/python-visual-explainer/`

**Topics** (مهمة جداً لاكتشاف المشروع):
```
python  education  arabic  visualization  learning-tool  react
typescript  tailwindcss  beginner-friendly  code-explainer
teaching  computer-science  rtl  vite  open-source
```

### فعّل النقاشات

**Settings → Features → ✅ Discussions**
مفيدة جداً لأسئلة الطلاب.

### أضف صورة المعاينة الاجتماعية

**Settings → General → Social preview → Upload an image**
ارفع الملف `public/banner.png` — سيظهر عند مشاركة الرابط على تويتر وواتساب.

---

## 🔖 الخطوة 4 — إنشاء إصدار (Release)

```bash
git tag -a v1.0.0 -m "الإصدار الأول"
git push origin v1.0.0
```

ثم من تبويب **Releases → Draft a new release**:
- اختر الوسم `v1.0.0`
- العنوان: `v1.0.0 — الإصدار الأول 🎉`
- الوصف: انسخه من `CHANGELOG.md`
- 📎 **مهم للمعلمين:** ارفع ملف `dist/index.html` كمرفق (Asset) ليتمكن المعلمون من تحميل نسخة أوفلاين جاهزة دون تثبيت أي شيء.

---

## 🌐 بدائل النشر

### Netlify

1. [app.netlify.com](https://app.netlify.com) → **Add new site → Import from Git**
2. اختر المستودع
3. **Build command:** `npm run build`
4. **Publish directory:** `dist`
5. **Deploy** ✅

### Vercel

1. [vercel.com/new](https://vercel.com/new) → استورد المستودع
2. Vercel سيكتشف Vite تلقائياً
3. **Deploy** ✅

### Cloudflare Pages

| الإعداد | القيمة |
| :--- | :--- |
| Framework preset | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |

---

## 🏫 النشر داخل المدرسة (بدون إنترنت)

هذه أبسط طريقة لاستخدام الأداة في معمل الحاسب:

```bash
npm install
npm run build
```

ستجد ملفاً واحداً فقط: **`dist/index.html`**

- انسخه على فلاشة USB ووزّعه على أجهزة المعمل
- افتحه بالنقر المزدوج — يعمل مباشرة في أي متصفح
- لا يحتاج إنترنت ولا خادم ولا تثبيت بايثون

> ℹ️ ملاحظة: الخطوط (Cairo و Fira Code) تُحمّل من الإنترنت. بدون إنترنت سيستخدم المتصفح خطاً بديلاً — الوظائف كلها تعمل بشكل طبيعي.

---

## ✅ قائمة تحقق نهائية

- [ ] استبدلت `BebooBombaa` في كل الملفات
- [ ] `npm run build` ينجح محلياً
- [ ] رفعت المشروع على GitHub
- [ ] فعّلت GitHub Pages مع مصدر **GitHub Actions**
- [ ] سير العمل في تبويب Actions اكتمل بنجاح ✅
- [ ] الموقع يفتح على الرابط ويعمل
- [ ] أضفت الوصف والـ Topics وصورة المعاينة
- [ ] أنشأت إصدار v1.0.0 مع مرفق `index.html`
- [ ] شاركت الرابط مع طلابك 🎓
