AHMAD DOORS website - free GitHub Pages + Supabase

اہم:
- یہ تیار شدہ website source ہے؛ یہ خود بخود آپ کے GitHub میں upload نہیں ہوئی۔
- GitHub Pages پر public website چلے گی۔ Repository کو Private کرنے پر GitHub Free میں Pages کی دستیابی/حدود account اور repository settings کے مطابق بدل سکتی ہیں؛ عام مفت public Pages کے لیے repository کو Public رکھیں۔
- Supabase کا صرف Project URL اور Publishable/anon key config.js میں لگائیں۔
- service_role / secret key کبھی config.js یا website میں نہ لگائیں۔
- Admin email: killerahmad305@gmail.com
- WhatsApp: 03234842963

Setup:
1) Supabase project کھولیں > SQL Editor > New query.
2) supabase-setup.sql کا پورا متن paste کرکے Run کریں۔
3) Supabase > Authentication > Users میں admin email کے لیے user بنائیں / invite کریں۔ مضبوط password استعمال کریں۔ صرف یہی owner email website میں admin کے طور پر قبول ہے؛ SQL RLS بھی اسی email کو enforce کرتا ہے۔
4) Supabase > Project Settings > API میں Project URL اور Publishable key لیں۔
5) config.js.example کی copy بنائیں اور اس کا نام config.js رکھیں۔ اس میں URL اور Publishable key paste کریں۔
6) GitHub repository میں یہ تمام files upload کریں (index.html, style.css, app.js, admin.html, admin.js, config.js, assets folder). supabase-setup.sql اور README بھی رکھ سکتے ہیں.
7) GitHub repository > Settings > Pages > Build and deployment > Deploy from a branch > main > /(root) > Save.
8) کچھ منٹ بعد GitHub Pages کا URL کھولیں. Admin login کے لیے URL کے آخر میں /admin.html لگائیں.

نوٹ:
- ابھی demo products یا فرضی قیمتیں شامل نہیں کی گئیں۔ Admin dashboard سے اپنی اصل تصاویر اور قیمتیں شامل کریں۔
- Admin password صرف Supabase Authentication میں بنائیں، اسے کسی کو نہ دیں۔
- GitHub account اور Supabase account دونوں پر 2-step verification آن کریں۔
- GitHub Pages static hosting ہے؛ products/login/photos Supabase کے free tier سے چلتے ہیں، جن کی usage limits ہو سکتی ہیں۔
