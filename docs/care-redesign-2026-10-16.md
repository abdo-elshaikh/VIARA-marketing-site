# تطوير تجربة VIARA

هوية هادئة بألوان عاجية وخضراء، وتخطيط متجاوب بالعربية والإنجليزية. الرئيسية تركز على الاستكشاف واختيار نوع المنشأة والتواصل. دليل الأنظمة يجمع 23 مجالاً مع بحث يدعم العربية وتصفية واختيار حتى ستة أنظمة ونقلها إلى الطلب. صفحة التخطيط تجمع مراحل التنفيذ ونطاق الباقات وحاسبة الأرشفة، مع نقل الباقة والتقدير إلى النموذج. صفحات الحلول تستخدم شريط التنقل والتذييل المشتركين.

الأرقام التشغيلية وشارات الاعتماد غير الموثقة في الرئيسية السابقة استُبدلت بمحتوى يشرح التجربة والنطاق. الدليل يميز نطاق الاستكشاف عن إتاحة الحلول التي تُراجع في العرض الفني. الصور مشاهد توضيحية مولدة ولا تمثل موظفين أو منشآت عملاء.

## الصور

أُنتجت الصور باستخدام أداة ImageGen المدمجة، ثم حُفظت داخل المشروع بترميز WebP، جودة 86، دون تغيير المشاهد أو نسبة الأبعاد. حجم الصورتين معاً نحو 197 KB.

- `public/assets/scenes/arab-care-team.webp`
- `public/assets/scenes/arab-diagnostics.webp`

## نصوص التوليد النهائية

### الفريق الطبي

Use case: photorealistic-natural. Asset type: premium editorial homepage photograph for an Arabic healthcare software website. A candid consultation in a beautiful contemporary Arab medical center, an Egyptian female physician wearing a cream hijab and white coat and an Egyptian male physician in muted sage scrubs reviewing a tablet together at a pale oak workstation. Authentic Middle Eastern appearance, relaxed attentive expressions, no looking at camera. Warm ivory architectural interior, large sunlit windows, subtle olive accents and natural materials, beautifully restrained healthcare editorial photography, realistic hands and skin. Horizontal landscape 3:2 composition, medium shot, people positioned centrally with architecture visible, soft daylight, sophisticated warm colors. No text, no logos, no watermark, no readable patient data, no sci-fi graphics. Illustrative fictional scene.

### التشخيص الطبي

Use case: photorealistic-natural. Asset type: supporting editorial image for an Arabic healthcare technology website. A Middle Eastern female radiology technologist in muted sage green scrubs and a modest beige hijab at a contemporary diagnostic imaging center, collaborating with a Middle Eastern male doctor in a white coat near a realistic MRI scanner. Candid professional interaction, no one looking at camera. Warm ivory walls, daylight, pale oak interior details, understated olive green accents, natural skin texture, realistic hands, calm premium architectural healthcare photography. Medium-wide horizontal 3:2 composition, people centrally placed, scanner recognizable, no patient in scanner. No text, no branding, no watermark, no readable medical records, no futuristic interfaces. Fictional illustrative scene.

## التحقق

أداة فحص المتصفح: `scratch/marketing-care-20261016.cjs` من جذر المشروع. تحفظ نتائج التجاوب ومسارات نقل الاختيارات والصور في `scratch/marketing-care-20261016/`. تُحاكى التفاعلات محلياً دون إرسال طلبات فعلية.

نجحت كذلك 18 حالة إضافية لمراجعة بقية صفحات الحلول باللغتين ونقل الباقة والأنظمة ومحاكاة فشل إرسال الطلب ثم نجاح إعادة المحاولة، دون إرسال طلبات فعلية. إجمالي حالات المتصفح للمرحلة السابقة 60. نتائج المسارات: `scratch/marketing-care-20261016/flows.json`.
