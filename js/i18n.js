// Traductions. Le français est la langue source : ses textes sont lus
// directement dans le HTML. Seules les chaînes générées en JS figurent dans `fr`.

const LEGAL_EN = `
<h3>Website owner</h3>
<p>Souha Abou Hable, independent physiotherapist<br>59 C route de Chancy, 1213 Petit-Lancy, Switzerland<br>Phone <a href="tel:+41788809163" dir="ltr">078 880 91 63</a> · <a href="mailto:souhabre@gmail.com">souhabre@gmail.com</a></p>
<h3>About this website</h3>
<p>This is the practitioner's personal website. It is not the official website of Physioswiss, the Centre Médical de Lancy / Maison de Santé Lancy or the Fondation Clair Bois.</p>
<h3>Content</h3>
<p>The information published here is for information purposes only and does not replace a medical consultation.</p>
<h3>Data protection</h3>
<p>Messages sent through the form are forwarded by the FormSubmit service to the practitioner's email address and are used solely to reply to the request. The Google Maps map is only loaded with your consent. This website does not use tracking cookies.</p>
<h3>Hosting</h3>
<p>[Hosting provider name and address to be completed]</p>`;

const LEGAL_AR = `
<h3>المسؤولة عن الموقع</h3>
<p>Souha Abou Hable، أخصائية علاج طبيعي مستقلة<br><span dir="ltr">59 C route de Chancy, 1213 Petit-Lancy</span>، سويسرا<br>الهاتف <a href="tel:+41788809163" dir="ltr">078 880 91 63</a> · <a href="mailto:souhabre@gmail.com">souhabre@gmail.com</a></p>
<h3>طبيعة الموقع</h3>
<p>هذا الموقع هو الموقع الشخصي للأخصائية. وهو ليس الموقع الرسمي لـ Physioswiss ولا لـ Centre Médical de Lancy / Maison de Santé Lancy ولا لـ Fondation Clair Bois.</p>
<h3>المحتوى</h3>
<p>المعلومات المنشورة هي لأغراض إعلامية فقط ولا تغني عن الاستشارة الطبية.</p>
<h3>حماية البيانات</h3>
<p>تُرسَل الرسائل المرسلة عبر النموذج بواسطة خدمة FormSubmit إلى البريد الإلكتروني للأخصائية، وتُستخدم فقط للرد على الطلب. لا يتم تحميل خريطة Google Maps إلا بعد موافقتك. لا يستخدم هذا الموقع ملفات تعريف ارتباط للتتبع.</p>
<h3>الاستضافة</h3>
<p>[اسم وعنوان جهة الاستضافة – يُستكمل لاحقاً]</p>`;

export const translations = {
  fr: {
    'form.sending': 'Envoi en cours…',
    'form.success': 'Merci, votre message a bien été envoyé. Une réponse vous sera donnée dès que possible.',
    'form.error': 'L\'envoi n\'a pas pu aboutir. Vous pouvez écrire directement à <a href="{mailto}">souhabre@gmail.com</a>.',
    'form.invalid': 'Merci de compléter les champs indiqués.',
    'map.title': 'Carte : 59 C route de Chancy, 1213 Petit-Lancy'
  },

  en: {
    'meta.title': 'Souha Abou Hable – Physiotherapist in Petit-Lancy, Geneva',
    'meta.description': 'Souha Abou Hable, independent physiotherapist in Petit-Lancy (Geneva): general and maxillofacial physiotherapy. Sessions in French, Arabic and English. Phone 078 880 91 63.',
    'skip': 'Skip to content',
    'brand.role': 'Physiotherapist',
    'nav.menu': 'Menu',
    'nav.label': 'Main navigation',
    'nav.lang': 'Website language',
    'nav.about': 'Background',
    'nav.domains': 'Areas',
    'nav.maxillo': 'Maxillofacial',
    'nav.languages': 'Languages',
    'nav.contact': 'Contact',

    'hero.eyebrow': 'Independent physiotherapist · Petit-Lancy, Geneva',
    'hero.lead': 'General physiotherapy and maxillofacial physiotherapy at the Centre Médical de Lancy / Maison de Santé Lancy.',
    'hero.cta': 'Get in touch',
    'hero.scroll': 'Scroll to background',

    'about.eyebrow': 'About',
    'about.title': 'Background',
    'about.intro': 'Having graduated in physiotherapy in Beirut in 1999, Souha Abou Hable has practised general physiotherapy in Geneva since 2017 and, since 2019, has been part of the physiotherapy team at the Fondation Clair Bois – Petit-Lancy.',
    'about.photo': 'Placeholder for the practitioner\'s photo',
    'about.timeline': 'Career timeline',
    'about.card.role': 'Independent physiotherapist',
    'about.card.spec': 'General physiotherapy · Maxillofacial physiotherapy',
    'about.card.physioswiss': 'Listed member on Physioswiss',

    'tl.1999.title': 'Physiotherapy degree',
    'tl.1999.text': 'Beirut, Lebanon',
    'tl.2017.label': 'Since 2017',
    'tl.2017.title': 'General physiotherapy in Geneva',
    'tl.2017.text': 'Practising general physiotherapy in Geneva.',
    'tl.2019.label': 'Since 2019',
    'tl.2019.title': 'Fondation Clair Bois – Petit-Lancy',
    'tl.2019.text': 'Member of the physiotherapy team.',
    'tl.form.label': 'Training',
    'tl.form.title': 'Continuing education',
    'tl.form.1': 'Manual therapy of the shoulder',
    'tl.form.2': 'Kinesio taping',
    'tl.form.3': 'Respiratory physiotherapy',

    'dom.eyebrow': 'Treatment',
    'dom.title': 'Areas of treatment',
    'dom.intro': 'Physiotherapy for people with:',
    'dom.msk.title': 'Musculoskeletal disorders',
    'dom.msk.text': 'Muscles, joints, tendons and spine.',
    'dom.neuro.title': 'Neurological conditions',
    'dom.neuro.text': 'Physiotherapy for conditions affecting the nervous system.',
    'dom.rhuma.title': 'Rheumatic conditions',
    'dom.rhuma.text': 'Physiotherapy support for rheumatic conditions.',
    'dom.nm.title': 'Neuromuscular diseases',
    'dom.nm.text': 'Physiotherapy adapted to neuromuscular diseases.',
    'dom.resp.title': 'Respiratory conditions',
    'dom.resp.text': 'Respiratory physiotherapy.',

    'maxi.eyebrow': 'Specialty',
    'maxi.title': 'Maxillofacial physiotherapy',
    'maxi.p1': 'Among her specialties, Souha Abou Hable practises maxillofacial physiotherapy.',
    'maxi.p2': 'This field of physiotherapy concerns the jaw, the temporomandibular joint and the face.',
    'maxi.z1': 'Jaw',
    'maxi.z2': 'Temporomandibular joint (TMJ)',
    'maxi.z3': 'Face',
    'maxi.cta': 'Ask a question',

    'lang.eyebrow': 'Languages',
    'lang.title': 'Languages spoken',
    'lang.intro': 'Sessions can be held in French, Arabic or English.',

    'contact.eyebrow': 'Contact',
    'contact.title': 'Practical information',
    'contact.intro': 'For any question or to arrange an appointment, you can get in touch by phone, by email or using the form below.',
    'contact.addr.label': 'Address',
    'contact.country': 'Switzerland',
    'contact.addr.route': 'Directions',
    'contact.phone.label': 'Phone',
    'contact.email.label': 'Email',
    'map.text': 'The map is provided by Google Maps. Displaying it may transfer data to Google.',
    'map.btn': 'Show map',
    'map.title': 'Map: 59 C route de Chancy, 1213 Petit-Lancy',

    'form.title': 'Send a message',
    'form.name': 'Name',
    'form.email': 'Email',
    'form.message': 'Message',
    'form.privacy': 'The information you send is used solely to reply to your request.',
    'form.urgent': 'This form is not intended for emergencies. In an emergency, call 144.',
    'form.submit': 'Send',
    'form.sending': 'Sending…',
    'form.success': 'Thank you, your message has been sent. You will receive a reply as soon as possible.',
    'form.error': 'Your message could not be sent. You can write directly to <a href="{mailto}">souhabre@gmail.com</a>.',
    'form.invalid': 'Please complete the highlighted fields.',

    'footer.tagline': 'Independent physiotherapist · Petit-Lancy, Geneva',
    'footer.physioswiss': 'Physioswiss profile',
    'footer.legal': 'Legal notice',
    'footer.disclaimer': 'The practitioner\'s personal website. This is not the official website of Physioswiss, the Centre Médical de Lancy or the Fondation Clair Bois.',

    'legal.title': 'Legal notice',
    'legal.body': LEGAL_EN,
    'legal.close': 'Close'
  },

  ar: {
    'meta.title': 'Souha Abou Hable – أخصائية علاج طبيعي في Petit-Lancy، جنيف',
    'meta.description': 'Souha Abou Hable، أخصائية علاج طبيعي مستقلة في Petit-Lancy (جنيف): علاج طبيعي عام وعلاج طبيعي للفك والوجه. الجلسات بالفرنسية والعربية والإنجليزية. الهاتف 078 880 91 63.',
    'skip': 'الانتقال إلى المحتوى',
    'brand.role': 'أخصائية علاج طبيعي',
    'nav.menu': 'القائمة',
    'nav.label': 'القائمة الرئيسية',
    'nav.lang': 'لغة الموقع',
    'nav.about': 'المسيرة',
    'nav.domains': 'المجالات',
    'nav.maxillo': 'الفك والوجه',
    'nav.languages': 'اللغات',
    'nav.contact': 'التواصل',

    'hero.eyebrow': 'أخصائية علاج طبيعي مستقلة · <bdi>Petit-Lancy</bdi>، جنيف',
    'hero.lead': 'علاج طبيعي عام وعلاج طبيعي للفك والوجه في <bdi>Centre Médical de Lancy / Maison de Santé Lancy</bdi>.',
    'hero.cta': 'للتواصل',
    'hero.scroll': 'الانتقال إلى المسيرة',

    'about.eyebrow': 'نبذة',
    'about.title': 'المسيرة المهنية',
    'about.intro': 'حصلت <bdi>Souha Abou Hable</bdi> على شهادة العلاج الطبيعي في بيروت عام 1999، وتمارس العلاج الطبيعي العام في جنيف منذ عام 2017، وهي منذ عام 2019 عضو في فريق أخصائيي العلاج الطبيعي في <bdi>Fondation Clair Bois – Petit-Lancy</bdi>.',
    'about.photo': 'مكان مخصص لصورة الأخصائية',
    'about.timeline': 'التسلسل الزمني للمسيرة',
    'about.card.role': 'أخصائية علاج طبيعي مستقلة',
    'about.card.spec': 'علاج طبيعي عام · علاج طبيعي للفك والوجه',
    'about.card.physioswiss': 'عضو مُدرجة لدى <bdi>Physioswiss</bdi>',

    'tl.1999.title': 'شهادة في العلاج الطبيعي',
    'tl.1999.text': 'بيروت، لبنان',
    'tl.2017.label': 'منذ 2017',
    'tl.2017.title': 'العلاج الطبيعي العام في جنيف',
    'tl.2017.text': 'ممارسة العلاج الطبيعي العام في جنيف.',
    'tl.2019.label': 'منذ 2019',
    'tl.2019.title': '<bdi>Fondation Clair Bois – Petit-Lancy</bdi>',
    'tl.2019.text': 'عضو في فريق أخصائيي العلاج الطبيعي.',
    'tl.form.label': 'التدريب',
    'tl.form.title': 'التدريب المستمر',
    'tl.form.1': 'العلاج اليدوي للكتف',
    'tl.form.2': 'الشريط اللاصق الحركي (<bdi>Kinesio taping</bdi>)',
    'tl.form.3': 'العلاج الطبيعي التنفسي',

    'dom.eyebrow': 'الرعاية',
    'dom.title': 'مجالات الرعاية',
    'dom.intro': 'علاج طبيعي للأشخاص الذين يعانون من:',
    'dom.msk.title': 'اضطرابات عضلية هيكلية',
    'dom.msk.text': 'العضلات والمفاصل والأوتار والعمود الفقري.',
    'dom.neuro.title': 'إصابات عصبية',
    'dom.neuro.text': 'علاج طبيعي في حالات إصابة الجهاز العصبي.',
    'dom.rhuma.title': 'أمراض روماتيزمية',
    'dom.rhuma.text': 'مرافقة بالعلاج الطبيعي للأمراض الروماتيزمية.',
    'dom.nm.title': 'أمراض عصبية عضلية',
    'dom.nm.text': 'علاج طبيعي ملائم للأمراض العصبية العضلية.',
    'dom.resp.title': 'أمراض تنفسية',
    'dom.resp.text': 'العلاج الطبيعي التنفسي.',

    'maxi.eyebrow': 'تخصص',
    'maxi.title': 'العلاج الطبيعي للفك والوجه',
    'maxi.p1': 'من بين تخصصاتها، تمارس <bdi>Souha Abou Hable</bdi> العلاج الطبيعي للفك والوجه.',
    'maxi.p2': 'يهتم هذا المجال من العلاج الطبيعي بمنطقة الفك والمفصل الصدغي الفكي والوجه.',
    'maxi.z1': 'الفك',
    'maxi.z2': 'المفصل الصدغي الفكي',
    'maxi.z3': 'منطقة الوجه',
    'maxi.cta': 'اطرح سؤالاً',

    'lang.eyebrow': 'اللغات',
    'lang.title': 'اللغات المحكية',
    'lang.intro': 'يمكن أن تتم الجلسات باللغة الفرنسية أو العربية أو الإنجليزية.',

    'contact.eyebrow': 'التواصل',
    'contact.title': 'معلومات عملية',
    'contact.intro': 'لأي سؤال أو لتحديد موعد، يمكنكم التواصل عبر الهاتف أو البريد الإلكتروني أو من خلال النموذج أدناه.',
    'contact.addr.label': 'العنوان',
    'contact.country': 'سويسرا',
    'contact.addr.route': 'الاتجاهات',
    'contact.phone.label': 'الهاتف',
    'contact.email.label': 'البريد الإلكتروني',
    'map.text': 'الخريطة مقدمة من Google Maps. قد يؤدي عرضها إلى نقل بيانات إلى Google.',
    'map.btn': 'عرض الخريطة',
    'map.title': 'خريطة: 59 C route de Chancy, 1213 Petit-Lancy',

    'form.title': 'إرسال رسالة',
    'form.name': 'الاسم',
    'form.email': 'البريد الإلكتروني',
    'form.message': 'الرسالة',
    'form.privacy': 'تُستخدم المعلومات المرسلة فقط للرد على طلبكم.',
    'form.urgent': 'هذا النموذج غير مخصص للحالات الطارئة. في حالة الطوارئ، اتصلوا بالرقم 144.',
    'form.submit': 'إرسال',
    'form.sending': 'جارٍ الإرسال…',
    'form.success': 'شكراً لكم، تم إرسال رسالتكم. سيتم الرد عليكم في أقرب وقت ممكن.',
    'form.error': 'تعذّر إرسال الرسالة. يمكنكم الكتابة مباشرة إلى <a href="{mailto}">souhabre@gmail.com</a>.',
    'form.invalid': 'يرجى إكمال الحقول المشار إليها.',

    'footer.tagline': 'أخصائية علاج طبيعي مستقلة · <bdi>Petit-Lancy</bdi>، جنيف',
    'footer.physioswiss': 'الصفحة على <bdi>Physioswiss</bdi>',
    'footer.legal': 'إشعار قانوني',
    'footer.disclaimer': 'الموقع الشخصي للأخصائية. هذا ليس الموقع الرسمي لـ <bdi>Physioswiss</bdi> ولا لـ <bdi>Centre Médical de Lancy</bdi> ولا لـ <bdi>Fondation Clair Bois</bdi>.',

    'legal.title': 'إشعار قانوني',
    'legal.body': LEGAL_AR,
    'legal.close': 'إغلاق'
  }
};
