/* ─────────────────────────────────────────────────────────────────────────────
   TƏDBİR ÜZRƏ ŞABLON SƏHİFƏLƏRİ (/sablonlar/<slug>, 2026-11)

   Hər tədbirin öz ictimai, indekslənən səhifəsi var: «xına gecəsi dəvətnaməsi»,
   «ad günü dəvətnaməsi» kimi axtarışlar üçün. Səhifənin özü vitrindir
   (TemplatesPage) — fərq yalnız başlıq, giriş mətni və seçili tədbirdir.

   ⚠ title/description/h1/intro.az public/seo.php › seoConceptPages() ilə
   HƏRFBƏHƏRF eynidir (tests/concept_pages_test.mjs).
   ⚠ React YOXDUR — node testləri birbaşa yükləyir.
   ───────────────────────────────────────────────────────────────────────── */
export const CONCEPT_PAGES = {
  toy: {
    title: 'Toy və Nişan Dəvətnaməsi — Online Şablonlar | DigiToy',
    description: 'Toy və nişan üçün online dəvətnamə şablonları: lüks, klassik, minimalist və vintage dizaynlar. İştirak Təsdiqi, oturma planı və QR foto paylaşımı ilə. 59 ₼-dan.',
    h1: { az: 'Toy və Nişan Dəvətnaməsi', en: 'Wedding & Engagement Invitations', ru: 'Приглашения на свадьбу и помолвку' },
    intro: {
      az: 'Toy və nişan üçün online dəvətnamə şablonları. Hər dizaynın öz açılışı, şrifti və rəng dili var. Canlı önbaxışa baxın, bəyəndiyinizi seçin, linki qonaqlarınıza WhatsApp ilə göndərin.',
      en: 'Online invitation templates for weddings and engagements. Every design has its own opening, typeface and colours. Open a live preview, choose your favourite and send the link to your guests on WhatsApp.',
      ru: 'Онлайн-шаблоны приглашений на свадьбу и помолвку. У каждого дизайна своё открытие, шрифт и цвета. Откройте живой просмотр, выберите понравившийся и отправьте ссылку гостям в WhatsApp.',
    },
  },
  xina: {
    title: 'Xına Gecəsi Dəvətnaməsi — Online Şablonlar | DigiToy',
    description: 'Xına gecəsi üçün online dəvətnamə şablonları: qırmızı duvaq, xonça, kəlağayı, buta motivləri. Qonaqlarınıza bir linklə göndərin, iştirakı onlayn təsdiqləsinlər.',
    h1: { az: 'Xına Gecəsi Dəvətnaməsi', en: 'Henna Night Invitations', ru: 'Приглашения на вечер хны' },
    intro: {
      az: 'Xına gecəsi üçün milli motivli online dəvətnamə şablonları: qırmızı duvaq, xonça, kəlağayı, buta və şam işığı. Gəlinin adı, tarix və məkan bir linkdə.',
      en: 'Henna night invitation templates with national motifs: the red veil, xoncha trays, kelaghayi scarves, buta patterns and candlelight. The bride’s name, date and venue in one link.',
      ru: 'Шаблоны приглашений на вечер хны с национальными мотивами: красная фата, хонча, кялагаи, бута и свет свечей. Имя невесты, дата и место — в одной ссылке.',
    },
  },
  birthday: {
    title: 'Ad Günü Dəvətnaməsi — Online Şablonlar | DigiToy',
    description: 'Ad günü üçün online dəvətnamə şablonları: minik talonu, kino premyerası, vinil, qəzet və modern afişa. Yaş, proqram, İştirak Təsdiqi və təbriklər bir linkdə.',
    h1: { az: 'Ad Günü Dəvətnaməsi', en: 'Birthday Invitations', ru: 'Приглашения на день рождения' },
    intro: {
      az: 'Böyüklər üçün ad günü dəvətnaməsi şablonları: minik talonu, kino premyerası, vinil plastinka, qəzet və modern afişa. Hər biri tək nəfərin adı və yaşı üçün hazırlanıb.',
      en: 'Birthday invitation templates for grown-ups: a boarding pass, a film premiere, a vinyl record, a newspaper and a modern poster. Each one is made for one person’s name and age.',
      ru: 'Шаблоны приглашений на день рождения для взрослых: посадочный талон, кинопремьера, виниловая пластинка, газета и современная афиша. Каждый создан для имени и возраста одного человека.',
    },
  },
  anniversary: {
    title: 'İldönümü Dəvətnaməsi — Online Şablonlar | DigiToy',
    description: 'Toy ildönümü üçün online dəvətnamə şablonları: gümüş və qızıl toy, ilk il, retro polaroid, sevgi məktubları. Xatirələriniz və proqramınız bir linkdə.',
    h1: { az: 'İldönümü Dəvətnaməsi', en: 'Anniversary Invitations', ru: 'Приглашения на годовщину' },
    intro: {
      az: 'Toy ildönümü üçün online dəvətnamə şablonları: gümüş və qızıl toy, birinci il, retro polaroid və sevgi məktubları. Birlikdə keçirdiyiniz illər səhifənin mərkəzindədir.',
      en: 'Online invitation templates for wedding anniversaries: silver and golden jubilees, the first year, retro polaroids and love letters. The years you have spent together take centre stage.',
      ru: 'Онлайн-шаблоны приглашений на годовщину свадьбы: серебряная и золотая свадьба, первая годовщина, ретро-полароиды и письма о любви. В центре — годы, прожитые вместе.',
    },
  },
  kids: {
    title: 'Uşaq Ad Günü Dəvətnaməsi — Online Şablonlar | DigiToy',
    description: 'Uşaq ad günü üçün online dəvətnamə şablonları: nağıl, kosmos, sirk, dinozavr və şarlar. Uşağın adı və yaşı ilə, valideynlər iştirakı bir toxunuşla təsdiqləyir.',
    h1: { az: 'Uşaq Ad Günü Dəvətnaməsi', en: 'Kids’ Birthday Invitations', ru: 'Приглашения на детский день рождения' },
    intro: {
      az: 'Uşaq ad günü üçün online dəvətnamə şablonları: nağıl kitabı, kosmos səfəri, sirk, dinozavr macərası və rəngli şarlar. Uşağın adı və yaşı ilə, açılışı oyun kimi.',
      en: 'Kids’ birthday invitation templates: a storybook, a space mission, the circus, a dinosaur adventure and colourful balloons. With your child’s name and age, and an opening that feels like a game.',
      ru: 'Шаблоны приглашений на детский день рождения: сказка, космический полёт, цирк, приключения с динозаврами и разноцветные шары. С именем и возрастом ребёнка и открытием-игрой.',
    },
  },
  sunnet: {
    title: 'Sünnət Toyu Dəvətnaməsi — Online Şablonlar | DigiToy',
    description: 'Sünnət toyu üçün online dəvətnamə şablonları: balaca şahzadə, komiks qəhrəmanı, maşallah, balaca pilot və futbol ulduzu. Proqram və xəritə bir linkdə.',
    h1: { az: 'Sünnət Toyu Dəvətnaməsi', en: 'Sunnat Celebration Invitations', ru: 'Приглашения на сюннет-той' },
    intro: {
      az: 'Sünnət toyu üçün online dəvətnamə şablonları: balaca şahzadə, komiks qəhrəmanı, maşallah, balaca pilot və futbol ulduzu. Oğlanın adı və yaşı ilə hazır dizaynlar.',
      en: 'Online invitation templates for sunnat celebrations: a little prince, a comic-book hero, mashallah, a little pilot and a football star. Ready designs with the boy’s name and age.',
      ru: 'Онлайн-шаблоны приглашений на сюннет-той: маленький принц, герой комиксов, машаллах, маленький пилот и футбольная звезда. Готовые дизайны с именем и возрастом мальчика.',
    },
  },
  baby: {
    title: 'Baby Shower Dəvətnaməsi — Online Şablonlar | DigiToy',
    description: 'Baby shower və cins açıqlama (gender reveal) üçün online dəvətnamə şablonları: pastel, ayıcıq, leylək məktubu və beşik. Qonaqlarınız bir linklə qoşulsun.',
    h1: { az: 'Baby Shower Dəvətnaməsi', en: 'Baby Shower Invitations', ru: 'Приглашения на бэби шауэр' },
    intro: {
      az: 'Baby shower və cins açıqlama (gender reveal) üçün online dəvətnamə şablonları: pastel çiçəklər, ayıcıq, leylək məktubu və beşik oyuncağı. Qonaqlar iştirakını bir toxunuşla bildirir.',
      en: 'Online invitation templates for baby showers and gender reveals: pastel blooms, a teddy bear, a stork’s letter and a crib mobile. Guests confirm with a single tap.',
      ru: 'Онлайн-шаблоны приглашений на бэби шауэр и гендер-пати: пастельные цветы, мишка, письмо аиста и мобиль над кроваткой. Гости подтверждают участие одним касанием.',
    },
  },
  corporate: {
    title: 'Korporativ Dəvətnamə — Online Şablonlar | DigiToy',
    description: 'Korporativ tədbirlər üçün online dəvətnamə şablonları: qala gecəsi, konfrans, mükafat mərasimi, vizit kart və neon parti. Qonaq siyahısı və İştirak Təsdiqi ilə.',
    h1: { az: 'Korporativ Dəvətnamə', en: 'Corporate Event Invitations', ru: 'Корпоративные приглашения' },
    intro: {
      az: 'Korporativ tədbirlər üçün online dəvətnamə şablonları: qala gecəsi, konfrans, mükafat mərasimi, vizit kart və neon parti. Təşkilatçının adı, proqram və qonaq təsdiqi bir səhifədə.',
      en: 'Online invitation templates for corporate events: a gala night, a keynote, an awards ceremony, a business card and a neon party. Organiser, programme and guest confirmation on one page.',
      ru: 'Онлайн-шаблоны приглашений на корпоративные мероприятия: гала-вечер, конференция, церемония награждения, визитка и неоновая вечеринка. Организатор, программа и подтверждение гостей на одной странице.',
    },
  },
  graduation: {
    title: 'Məzuniyyət Dəvətnaməsi — Son Zəng Şablonları | DigiToy',
    description: 'Məzuniyyət və son zəng gecəsi üçün online dəvətnamə şablonları: papaq atma, xatirə albomu, son zəng, lövhə və kağız təyyarə. Sinif yoldaşlarınıza bir linklə göndərin.',
    h1: { az: 'Məzuniyyət Dəvətnaməsi', en: 'Graduation Invitations', ru: 'Приглашения на выпускной' },
    intro: {
      az: 'Məzuniyyət və son zəng gecəsi üçün online dəvətnamə şablonları: papaq atma, xatirə albomu, son zəng, məktəb lövhəsi və kağız təyyarə. Sinif yoldaşlarınıza bir linklə göndərin.',
      en: 'Online invitation templates for graduation and last-bell parties: the cap toss, a yearbook, the last bell, a chalkboard and a paper plane. Send it to your classmates with one link.',
      ru: 'Онлайн-шаблоны приглашений на выпускной и последний звонок: бросок шапочек, альбом, последний звонок, школьная доска и бумажный самолётик. Отправьте одноклассникам одной ссылкой.',
    },
  },
  opening: {
    title: 'Açılış Dəvətnaməsi — Online Şablonlar | DigiToy',
    description: 'Mağaza, kafe və qalereya açılışı üçün online dəvətnamə şablonları: lentin kəsilməsi, bistro lövhəsi, qalereya, təqdimat. Ünvan, xəritə və proqram bir linkdə.',
    h1: { az: 'Açılış Dəvətnaməsi', en: 'Grand Opening Invitations', ru: 'Приглашения на открытие' },
    intro: {
      az: 'Mağaza, kafe, salon və qalereya açılışı üçün online dəvətnamə şablonları: lentin kəsilməsi, bistro lövhəsi, qalxan jalüzi, qutu açılışı və qalereya. Ünvan və xəritə bir linkdə.',
      en: 'Online invitation templates for shop, café, salon and gallery openings: a ribbon cutting, a bistro sign, a rising shutter, an unboxing and a gallery reveal. Address and map in one link.',
      ru: 'Онлайн-шаблоны приглашений на открытие магазина, кафе, салона и галереи: перерезание ленты, вывеска бистро, поднимающиеся жалюзи, распаковка и галерея. Адрес и карта — в одной ссылке.',
    },
  },
  holiday: {
    title: 'Novruz və Yeni İl Dəvətnaməsi — Online Şablonlar | DigiToy',
    description: 'Novruz, Yeni il və bayram gecələri üçün online dəvətnamə şablonları: tonqal, səməni, gecə yarısı saatı, qar kürəsi və maskarad. Ailə və dostlar üçün bir link.',
    h1: { az: 'Bayram Gecəsi Dəvətnaməsi', en: 'Holiday Party Invitations', ru: 'Приглашения на праздничный вечер' },
    intro: {
      az: 'Novruz, Yeni il və bayram gecələri üçün online dəvətnamə şablonları: tonqal, səməni, gecə yarısı saatı, qar kürəsi və maskarad balı. Ailəniz və dostlarınız üçün bir link.',
      en: 'Online invitation templates for Novruz, New Year and holiday parties: a bonfire, semeni, a midnight clock, a snow globe and a masquerade ball. One link for your family and friends.',
      ru: 'Онлайн-шаблоны приглашений на Новруз, Новый год и праздничные вечера: костёр, семени, часы в полночь, снежный шар и бал-маскарад. Одна ссылка для семьи и друзей.',
    },
  },
  bachelorette: {
    title: 'Qız Gecəsi Dəvətnaməsi — Online Şablonlar | DigiToy',
    description: 'Qız gecəsi (bachelorette) üçün online dəvətnamə şablonları: çəhrayı şampan, disko kürəsi, pijama və spa, Paris gecəsi və boho gün batımı. Rəfiqələrə bir linklə.',
    h1: { az: 'Qız Gecəsi Dəvətnaməsi', en: 'Bachelorette Invitations', ru: 'Приглашения на девичник' },
    intro: {
      az: 'Qız gecəsi üçün online dəvətnamə şablonları: çəhrayı şampan, disko kürəsi, pijama və spa, Paris gecəsi və boho gün batımı. Rəfiqələrinizə bir linklə göndərin.',
      en: 'Bachelorette invitation templates: pink champagne, a disco ball, pyjamas and spa, a night in Paris and a boho sunset. Send them to your girlfriends with one link.',
      ru: 'Шаблоны приглашений на девичник: розовое шампанское, диско-шар, пижамы и спа, ночь в Париже и закат в стиле бохо. Отправьте подругам одной ссылкой.',
    },
  },
}

/** Konsept id → səhifə mətni (yoxdursa null) */
export function conceptPageFor(concept) {
  return (concept && CONCEPT_PAGES[concept]) || null
}

/* ── 2026-11 SEO: hər tədbir səhifəsində «Necə işləyir» + suallar ──
   Tədbirin adı başlıqdan götürülür, ona görə mətn səhifəyə uyğunlaşır.
   ⚠ Albom müddətləri məxfilik siyasəti ilə eynidir (legal/retention.js). */
const ABOUT = {
  az: (ev) => ({
    title: `${ev} dəvətnaməsi necə hazırlanır`,
    steps: [
      `Şablonu seçin: canlı önbaxışda ${ev.toLowerCase()} dəvətnaməsinin açılışına, rənglərinə və şriftinə baxın.`,
      'Məlumatları doldurun: adlar, tarix, saat, məkan, proqram və geyim qaydası — konstruktor hər addımı izah edir.',
      'Linki alın: təsdiqdən sonra dəvətnamə linkini və QR kodu qonaqlarınıza WhatsApp ilə göndərin.',
    ],
    features: 'Hər dəvətnamədə geri sayım, xəritə ilə məkan, İştirak Təsdiqi (RSVP), xatirə kitabı, musiqi və paketdən asılı olaraq oturma planı və QR kodla foto paylaşımı var. Mətnlər Azərbaycan, rus və ingilis dillərində göstərilir.',
    faq: [
      [`${ev} dəvətnaməsi neçə günə hazır olur?`, 'Adətən 24 saat ərzində; VİP və Premium paketlərdə xüsusi dizayn elementləri olduqda 48 saata qədər.'],
      ['Qonaqlar iştirakı necə təsdiqləyir?', 'Dəvətnamədəki İştirak Təsdiqi forması ilə — cavablar və qonaq sayı Müştəri panelinizdə dərhal görünür.'],
      ['Qonaqların göndərdiyi şəkillər harada saxlanılır?', 'Premium paketdə qonaqlar QR kodla şəkil və video göndərir. Albomu yalnız siz və baxış linki verdiyiniz şəxslər görür; albom tədbirdən sonra 1 ay saxlanılır, əlavə ödənişlə uzadıla bilər.'],
    ],
  }),
  en: (ev) => ({
    title: `How to create ${ev.toLowerCase()} invitations`,
    steps: [
      'Choose a template: open the live preview to see its opening, colours and typeface.',
      'Fill in the details: names, date, time, venue, programme and dress code — the builder explains every step.',
      'Get your link: after approval, send the invitation link and QR code to your guests on WhatsApp.',
    ],
    features: 'Every invitation has a countdown, a venue map, RSVP, a guestbook and music; depending on the package also a seating plan and photo sharing by QR code. Texts are shown in Azerbaijani, Russian and English.',
    faq: [
      ['How long does it take?', 'Usually within 24 hours; up to 48 hours for VIP and Premium packages with custom design elements.'],
      ['How do guests confirm attendance?', 'With the RSVP form in the invitation — answers and guest numbers appear in your Customer panel right away.'],
      ['Where are the photos guests send kept?', 'In the Premium package guests send photos and videos by QR code. Only you and the people you give a view link to can see the album; it is kept for 1 month after the event and can be extended for an additional fee.'],
    ],
  }),
  ru: (ev) => ({
    title: `Как создать: ${ev.toLowerCase()}`,
    steps: [
      'Выберите шаблон: в живом просмотре видно открытие, цвета и шрифт.',
      'Заполните данные: имена, дата, время, место, программа и дресс-код — конструктор объясняет каждый шаг.',
      'Получите ссылку: после согласования отправьте ссылку и QR-код гостям в WhatsApp.',
    ],
    features: 'В каждом приглашении есть обратный отсчёт, карта места, подтверждение участия (RSVP), книга пожеланий и музыка; в зависимости от пакета — план рассадки и обмен фото по QR-коду. Тексты на азербайджанском, русском и английском.',
    faq: [
      ['Сколько времени занимает подготовка?', 'Обычно до 24 часов; до 48 часов в пакетах VIP и Premium с индивидуальными элементами дизайна.'],
      ['Как гости подтверждают участие?', 'Через форму подтверждения в приглашении — ответы и число гостей сразу видны в вашей Панели клиента.'],
      ['Где хранятся фото, которые присылают гости?', 'В пакете Premium гости отправляют фото и видео по QR-коду. Альбом видите только вы и те, кому вы дали ссылку для просмотра; он хранится 1 месяц после мероприятия, срок можно продлить за дополнительную плату.'],
    ],
  }),
}

/** Səhifənin «Necə işləyir» bloku (tədbir səhifəsi deyilsə null) */
export function conceptAbout(page, lang = 'az') {
  if (!page) return null
  const l = ABOUT[lang] ? lang : 'az'
  const h1 = page.h1[l] || page.h1.az
  const ev = l === 'az' ? h1.replace(/ Dəvətnaməsi$/, '') : l === 'en' ? h1.replace(/ Invitations$/, '') : h1
  return ABOUT[l](ev)
}
