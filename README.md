# Theeb – Final-Done Pack
1) Cloudflare → Workers: أنشئ Worker جديد، الصق `worker.js`، واعمل Deploy.
   - Settings → Variables (Production):
     - `DROPBOX_APP_KEY`, `DROPBOX_APP_SECRET`, `DROPBOX_REFRESH_TOKEN` (مستحسن)
     - أو `DROPBOX_ACCESS_TOKEN` (مؤقت)
2) ارفع `index.html` على GitHub Pages.
3) أول فتح للصفحة: المعالج هيطلب رابط Worker (ينتهي بـ /upload) ويختبر /ping تلقائيًا.
   - ممكن تضيف رابط Dropbox File Request كحل بديل.
4) بعد الحفظ، هيترفع تلقائيًا ويظهر لك رابط التحميل من Dropbox. لو الرفع الأوتوماتيك غير مضبوط، سيفتح لك File Request.
