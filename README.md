# Theeb.eg – عقد كامل + رفع تلقائي إلى Dropbox
هذه النسخة مبنية مباشرًة على ملفك الأصلي، مع إضافة رفع أوتوماتيكي للـPDF إلى Dropbox عبر Cloudflare Worker.

## ما الذي تم إضافته؟
- داخل `index.html`: تمت إضافة ثابتين `UPLOAD_ENDPOINT` و`DROPBOX_FOLDER` + دالة `uploadToDropbox()`.
- تم تعديل `saveAsPDF()` ليقوم بعد إنشاء الـPDF والحفظ محليًا برفع نسخة إلى Dropbox.
- أرفقنا `worker.js` (سيرفر صغير على Cloudflare) يستقبل الملف ويرفعه.

## طريقة التشغيل
1) أنشئ Cloudflare Worker جديد والصق فيه محتوى `worker.js`.
2) في **Settings → Variables** للـWorker:
   - الأفضل: ضع `DROPBOX_APP_KEY`, `DROPBOX_APP_SECRET`, `DROPBOX_REFRESH_TOKEN` (من Dropbox App + OAuth).
   - بديل مؤقت: `DROPBOX_ACCESS_TOKEN` (قصير المدة).
3) حرّر مصفوفة `allowed` داخل `worker.js` لتتضمن دومين GitHub Pages الخاص بك.
4) في `index.html` عدّل `UPLOAD_ENDPOINT` إلى رابط الـWorker لديك.
5) ارفع `index.html` على GitHub Pages.
6) افتح الصفحة → املأ البيانات → اضغط **حفظ PDF**. سينزل ملف PDF محليًا، ثم ستظهر رسالة نجاح برابط Dropbox.

> ملاحظة: لا تضع أي توكنات داخل الواجهة. احتفظ بها كمتغيرات سرّية في Worker.
