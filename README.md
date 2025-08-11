# Theeb.eg – إعادة كتابة الأكواد + ZIP
هذه النسخة تحتوي على عقدك الأصلي كما هو، مع إضافة رفع تلقائي إلى Dropbox عبر Cloudflare Worker.

## ملفات الحزمة
- `index.html` : ملف الواجهة (نسختك الأصلية) + تضمين html2pdf (إن لم يكن موجودًا) + كود رفع Dropbox.
- `worker.js` : كود Cloudflare Worker لرفع الملف وإنشاء رابط مشاركة.
  
## الإعداد
1) أنشئ Worker في Cloudflare والصق `worker.js`.
2) في Settings → Variables أضف إمّا:
   - الموصى به: `DROPBOX_APP_KEY`, `DROPBOX_APP_SECRET`, `DROPBOX_REFRESH_TOKEN`
   - بديل مؤقت: `DROPBOX_ACCESS_TOKEN`
3) حدّث مصفوفة `allowed` داخل `worker.js` بدومين GitHub Pages الخاص بك.
4) افتح `index.html` وعدّل:
   ```js
   const UPLOAD_ENDPOINT = 'https://YOUR_WORKER_SUBDOMAIN.workers.dev/upload';
   ```
5) ارفع `index.html` على GitHub Pages. عند الضغط على "حفظ PDF" سيتم الحفظ محليًا ثم الرفع إلى Dropbox تلقائيًا.

## ملاحظات
- لا تضع التوكنات داخل الواجهة.
- لو واجهت CORS، تأكد من إضافة دومينك الصحيح داخل `allowed`.
