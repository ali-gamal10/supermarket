# متجر "سوبر ماركت" (قرية، مصر) — سياق المشروع

موقع متجر بقالة بالعربي (RTL)، صفحتان: `index.html` (الزبائن فقط) و`staff.html` (المدير والموظفين، مقفلة بالرقم السري، noindex، لها `staff.webmanifest`). الاثنان يُولَّدان من مصدر واحد (HTML/CSS/JS صافي) ولا يوجد build على Netlify. المالك: علي جمال (ali-gamal10). يتحدث بالعامية المصرية، والمطلوب الرد بالعربي المبسط وبخطوات قصيرة مع صور شاشة عند الحاجة.

## الاستضافة والنشر
- GitHub: `ali-gamal10/supermarket` (فرع `main`) ← Netlify مشروع `supermarket-eg` ينشر تلقائياً عند كل push خلال ثواني.
- الرابط العام: https://supermarket-eg.netlify.app (مطبوع في بوستر وQR: لا تغيّر الاسم).
- لا يوجد build: Netlify ينشر جذر المستودع كما هو.

## الملفات
- `index.html`: واجهة الزبون فقط (بدون أي دخول موظفين؛ `#staff` و`#cashier` يحوّلان إلى staff.html).
- `staff.html`: لوحة المدير + الكاشير + الداشبورد + الأمان، شريط جانبي عمودي، شاشة قفل برقم المدير. نفس localStorage لأنهما على نفس النطاق.
- `catalog.json`: منتجات الزبائن. **تحدّثه لوحة المدير تلقائياً عبر GitHub API (مفتاح المدير)، فلا تستبدله ولا تحذفه.** عند تعديل `index.html` يجب إعادة حقن آخر `catalog.json` داخل `<script type="application/json" id="catalog-data">` كي لا تظهر منتجات قديمة.
- `manifest.webmanifest`, `sw.js`, `icon-*.png`, `apple-touch-icon.png`: تثبيت كتطبيق (PWA). الـ service worker شبكة-أولاً.
- `firestore.rules` (غير مرفوع هنا، موجود في مشروع Claude): قواعد Firebase.

## البنية المهمة في index.html
- التخزين محلي في المتصفح (localStorage): `items_v1, orders_v1, customers_v1, payments_v1, cashiers_v1, pin_v1, staff_v1, gh_cfg, fb_cfg`. الزبون يقرأ فقط `catalog.json` (أو الكتالوج المضمّن).
- دخول الموظفين: صفحة `staff.html` مباشرة (رابط لا يُعرض للزبائن). ممنوع إظهار أي رابط للوحة داخل index.html.
- الاسم المعتمد في كل مكان: «سوبر ماركت» فقط (بدون «أولاد البلد»). واتساب: 01119670780.
- نشر تلقائي: `publishGH` / `autoPub` (بعد تعديل المنتجات بـ 30 ثانية).
- عروض مجدولة: `it.offer={d,from,to}` + `applyOffers()` تُحسب عند التحميل وكل دقيقة (يعمل عند الزبون بدون نشر).
- تتبع الطلبات: تبويب `trk` في الداشبورد؛ لصق رسالة واتساب `parseOrderMsg` أو استلام تلقائي من Firestore (`incoming`) عبر `importIncoming`.
- مزامنة Firebase اختيارية: `connectDb` / `fbDb` / `pushAll`، وتعتمد على `fbconfig.json` في الجذر (موجود، مشروع Firebase: supermarket-d4956). بدونه كل شيء محلي.
- نسخ احتياطي: `bkDo` / `bkLoad`.

## قواعد عمل
- بعد أي تعديل: تحقق من صحة JS (`new Function` على السكربت) وجرّب بـ Playwright قبل الرفع.
- لا تضع أي مفتاح أو كلمة سر في المستودع (عام). الـ firebase apiKey ليس سراً لكنه يُرفع فقط كـ `fbconfig.json` بطلب المالك.
- النشر يتم بـ push مباشر على `main` بطلب المالك فقط. الـ commit message بالعربي.
- بعد الرفع أبلغ المالك أن يفتح الموقع في نافذة خاصة، وأن يغلق التطبيق المثبّت ويفتحه مرتين.
