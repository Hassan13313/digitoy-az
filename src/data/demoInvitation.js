/* ── Demo data — statik, backend-ə sorğu getmir ── */

/* ── Demo tarixi — HƏMİŞƏ NÖVBƏTİ 13 MART ────────────────────────────────
   Həsənin tələbi «13 mart»dır, amma SABİT tarix yazmaq olmaz: 13 mart
   keçəndən sonra geri sayım mənfiyə düşər və demo sınar (məhz qorxulan hal).
   Ona görə tarix hesablanır — bu il 13 mart hələ gəlməyibsə bu il, gəlibsə
   növbəti il. Beləliklə demo HEÇ VAXT keçmiş tarix göstərmir və il-il
   yenilənməyə ehtiyac qalmır.

   ⚠ Əvvəlki məntiq «bu gün + 3 ay» idi (tarix hər gün sürüşürdü).
   ⚠ Ay indeksi 0-dan başlayır: 2 = mart. */
function nextMarch13() {
  const now = new Date()
  const y = now.getFullYear()
  /* Günü 13-dən BÖYÜK tutmuruq: 13 mart günü demo hələ «bu gün»ü göstərsin */
  const thisYear = new Date(y, 2, 13)
  const target = now <= thisYear ? thisYear : new Date(y + 1, 2, 13)
  /* ⚠ `toISOString()` UTC-yə çevirir və Bakı saatında (UTC+4) tarixi bir gün
     GERİ sürüşdürərdi (12 mart). Ona görə yerli komponentlərdən yığılır. */
  const mm = String(target.getMonth() + 1).padStart(2, '0')
  const dd = String(target.getDate()).padStart(2, '0')
  return `${target.getFullYear()}-${mm}-${dd}`
}

export const DEMO_DATE = nextMarch13()

/* Demo hekayə şəkilləri — `demoPhotos` kimi Unsplash-dən (CSP img-src https: icazəlidir) */
function demoStoryPhoto(id) {
  return `https://images.unsplash.com/photo-${id}?w=900&q=75&auto=format&fit=crop`
}

export const demoInvitation = {
  eventType: 'toy',
  brideName:  'Aysel',
  groomName:  'Nicat',
  date:        DEMO_DATE,
  time:        '19:00',
  venueName:  'Buta Palace, Bakı',
  venueNote:  'Crystal Hall',

  googleMapsUrl: 'https://www.google.com/maps/search/Buta+Palace+Baku/@40.3975,49.8537',
  wazeUrl:       'https://waze.com/ul?q=Buta+Palace+Baku&navigate=yes',

  dressCodePalette: 'blacktie',
  dressCodeDescription:
    'Zəhmət olmasa ağ və açıq bej rənglərdən çəkinin — bu, gəlinin rəngidir.',

  seatingPlan: [
    'Masa 1: Nicat Əliyev, Rauf Babayev, Günel İsmayılova, Elnar Hüseynov',
    'Masa 2: Elnur Quliyev, Şəhla Qasımova, Orxan Nəcəfov, Türkan Muradova',
    'Masa 3: Kamran Hümbətov, Lalə Əhmədova, Bəhruz Süleymanov, Fidan Kərimova',
    'Masa 4: Nərmin Quliyeva, Araz Hüseynov, Sevinc Babayeva, Zaur İsmayılov',
    'Masa 5: Aytən Hüseynova, Elçin Əliyev, Röya Musayeva, Tural Məmmədov',
  ].join('; '),

  galleryLink: '',

  /* Demo musiqi: lokal MP3 preset nümayişi.
     ⚠ `playMode: 'auto'` QƏSDƏNdir — nümunə dəvətnamə məhsulun avtomatik
     başlayan musiqisini göstərməlidir. Müştərinin öz dəvətnaməsində bu seçim
     builder-dən gəlir (default: 'button' — tövsiyə olunan). */
  music: {
    type: 'track',
    provider: 'preset',
    id: 'a-thousand-years',
    title: 'A Thousand Years',
    artist: 'Christina Perri',
    file: '/music/a-thousand-years.mp3',
    duration: 286,
    startTime: 0,
    coverImage: null,
    isDefault: false,
    playMode: 'auto',
  },

  demoPhotos: [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=400&fit=crop&auto=format',
  ],

  /* ── «Bizim Hekayəmiz» (Phase 44) ──
     Bölmə DEFAULT BAĞLIDIR (data/sections.js › DEFAULT_OFF), ona görə demoda
     açıq-aşkar yandırılır. Qalan bölmələr üçün açar yoxdur → hamısı açıq.
     Fəsillər Claude Design nümunəsinin ardıcıllığındadır: 1 şəkil (böyük
     çərçivə) · 4 şəkil (kollaj + əlavə kadrlar) · 1 şəkil (əsas forma) ·
     1 şəkil (mətn + şəkil). Tarixlər ISO-dur ki, EN/RU-da ay adı çevrilsin. */
  sections: { lovestory: true },
  loveStory: [
    {
      id: 'demo-ls-1', date: '2022-03-12', icon: '☕',
      title: 'İlk Tanışlıq',
      text: 'Bir dostun ad günündə, təsadüfən eyni masada oturduq.',
      caption: 'ilk baxış',
      photos: [demoStoryPhoto('1621621667797-e06afc217fb0')],
    },
    {
      id: 'demo-ls-2', date: '2022-07', icon: '🌸',
      title: 'İlk Görüş',
      text: 'Dənizkənarı bulvarda saatlarla gəzdik, vaxtın necə keçdiyini bilmədik.',
      caption: 'bulvar',
      photos: [
        demoStoryPhoto('1494774157365-9e04c6720e47'),
        demoStoryPhoto('1520854221256-17451cc331bf'),
        demoStoryPhoto('1516589178581-6cd7833ae3b2'),
        demoStoryPhoto('1537633552985-df8429e8048b'),
      ],
    },
    {
      id: 'demo-ls-3', date: '2025-02-14', icon: '💍',
      title: '“Bəli” dedi',
      text: 'Şam işığında, diz çökərək verilən sual — və ən gözəl cavab.',
      photos: [demoStoryPhoto('1605100804763-247f67b3557e')],
    },
    {
      id: 'demo-ls-4', date: '2026-09', icon: '💌',
      title: 'Nişan Günü',
      text: 'Ailələrimizin xeyir-duası ilə üzüklər taxıldı.',
      caption: 'üzüklər',
      photos: [demoStoryPhoto('1529634806980-85c3dd6d34ac')],
    },
  ],
  /* Demo EN/RU mətnləri — `resolveWeddingContent` əl ilə tərcüməni üstün tutur */
  i18n: {
    en: {
      loveStory: {
        0: { title: 'The Day We Met', text: 'At a friend’s birthday party, we happened to sit at the same table.', caption: 'first glance' },
        1: { title: 'Our First Date', text: 'We walked the seaside boulevard for hours and lost all track of time.', caption: 'the boulevard' },
        2: { title: 'She Said “Yes”', text: 'A question asked on one knee by candlelight — and the most beautiful answer.' },
        3: { title: 'Engagement Day', text: 'With our families’ blessing, the rings were exchanged.', caption: 'the rings' },
      },
    },
    ru: {
      loveStory: {
        0: { title: 'Знакомство', text: 'На дне рождения друга мы случайно оказались за одним столом.', caption: 'первый взгляд' },
        1: { title: 'Первое свидание', text: 'Мы часами гуляли по приморскому бульвару и не заметили, как пролетело время.', caption: 'бульвар' },
        2: { title: 'Она сказала «Да»', text: 'Вопрос при свечах, на одном колене — и самый прекрасный ответ.' },
        3: { title: 'День помолвки', text: 'С благословения наших семей мы обменялись кольцами.', caption: 'кольца' },
      },
    },
  },

  programSteps: [
    { time: '18:00', icon: '🥂', activity: 'Qonaqların Möhtəşəm Qarşılanması' },
    { time: '19:00', icon: '💍', activity: 'Bəy və Gəlinin Möhtəşəm Girişi' },
    { time: '20:00', icon: '🍽️', activity: 'Şah Süfrəsi — Gala Ziyafəti' },
    { time: '21:00', icon: '💃', activity: 'Şah Naxış Rəqsi' },
    { time: '22:30', icon: '🎂', activity: 'Tort Kəsilməsi' },
    { time: '23:00', icon: '🎵', activity: 'Diskoteka və Yekun Proqram' },
  ],

  organizer: '',
  eventName:  '',
}

export const demoGuestbook = [
  {
    name: 'Ayan & Elnur',
    text: 'Nicat və Aysel, sizə ömür boyu xoşbəxtlik, sevgi və hüzur arzulayırıq! Bu gecə unutulmaz bir xatirəyə çevrilsin!',
  },
  {
    name: 'Kamran bəy',
    text: 'Təbrikimizi qəbul edin! Çox gözəl cütlüksünüz — birlikdə həmişə işıqlı olun.',
  },
  {
    name: 'Günel & Rauf',
    text: 'Bu xüsusi günün bütün çiçəklənməsiylə həyatınızı doldurmasını diləyirəm. Sevgilərimizlə!',
  },
  {
    name: 'Lalə xanım',
    text: 'Əziz Nicat və Aysel, toy gününüz mübarək! Birlikdə dünya qədər xoşbəxtlik tapasınız.',
  },
]

/* ── KONSEPTƏ GÖRƏ DEMO (2026-10) ─────────────────────────────────────────
   Şablon önbaxışı (/demo/template/:id) əvvəl HƏR şablonu toy datası ilə
   açırdı — uşaq ad günü şablonunda «Nicat & Aysel» görünərdi. İndi şablonun
   `concept`-inə uyğun demo verilir; konsepti olmayan/naməlum şablon əvvəlki
   kimi toy demosunu alır. */
function demoPhoto(id, w = 900) {
  return `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`
}

export const demoKidsInvitation = {
  ...demoInvitation,
  eventType: 'birthday',
  brideName: 'Ayan',
  groomName: '',
  eventName: '',
  age: 5,
  time: '15:00',
  venueName: 'Nağıl Parkı, Bakı',
  venueNote: 'Şənlik zalı',
  googleMapsUrl: 'https://www.google.com/maps/search/Baku+Boulevard/@40.3667,49.8352',
  wazeUrl: 'https://waze.com/ul?q=Baku+Boulevard&navigate=yes',
  dressCodePalette: 'creative',
  dressCodeDescription: 'Sevdiyiniz nağıl qəhrəmanının kostyumunda gəlin — ən maraqlı kostyuma kiçik hədiyyə var!',
  seatingPlan: [
    'Masa 1: Ayan Məmmədov, Elmir Həsənov, Nərgiz Əliyeva, Tural Quliyev',
    'Masa 2: Səbinə Məmmədova, Rauf Həsənov, Lalə Əliyeva, Kamran Quliyev',
    'Masa 3: Aylin Kərimova, Murad İsmayılov, Zəhra Babayeva, Emil Nəcəfov',
  ].join('; '),
  music: { ...demoInvitation.music, id: 'canon-in-d', title: 'Canon in D', artist: 'Pachelbel', file: '/music/canon-in-d.mp3', duration: 302 },
  demoPhotos: [
    demoPhoto('1608790672275-309c02d888ff', 600),
    demoPhoto('1530103862676-de8c9debad1d', 600),
    demoPhoto('1578922864601-79dcc7cbcea9', 600),
  ],
  sections: { lovestory: true },
  loveStory: [
    { id: 'demo-kid-1', date: '2021-03-13', icon: '👶', title: 'Dünyaya gəldim', text: 'Bahar səhəri ailəmizin ən balaca üzvü oldum.', caption: 'ilk gün', photos: [demoPhoto('1604917621956-10dfa7cce2e7')] },
    {
      id: 'demo-kid-2', date: '2022-04', icon: '👣', title: 'İlk addımlar', text: 'Bir gün ayağa qalxdım və bütün evi gəzməyə başladım.', caption: 'kəşflər',
      photos: [demoPhoto('1503919545889-aef636e10ad4'), demoPhoto('1515488042361-ee00e0ddd4e4'), demoPhoto('1501686637-b7aa9c48a882'), demoPhoto('1554343594-1c9d305bd51f')],
    },
    { id: 'demo-kid-3', date: '2022-03-13', icon: '🎂', title: 'İlk ad günüm', text: 'Bir şamı üfürmək o qədər də asan deyilmiş!', photos: [demoPhoto('1516668557604-c8e814fdb184')] },
    { id: 'demo-kid-4', date: '2025-09', icon: '🐶', title: 'Ən yaxın dostum', text: 'İndi hər səhər birlikdə oyuna qaçırıq.', caption: 'dostluq', photos: [demoPhoto('1769117438397-ba08341b7d60')] },
  ],
  i18n: {
    en: {
      dressCodeDescription: 'Come dressed as your favourite storybook hero — the most creative costume wins a little prize!',
      venueName: 'Fairy Tale Park, Baku', venueNote: 'Party hall',
      loveStory: {
        0: { title: 'I was born', text: 'One spring morning I became the smallest member of our family.', caption: 'day one' },
        1: { title: 'First steps', text: 'One day I stood up and set off to explore the whole house.', caption: 'discoveries' },
        2: { title: 'My first birthday', text: 'Blowing out one candle turned out to be harder than it looks!' },
        3: { title: 'My best friend', text: 'Now we race out to play together every morning.', caption: 'friendship' },
      },
      programSteps: { 0: 'Welcome', 1: 'Games with the animators', 2: 'Magic show', 3: 'Cake & candles', 4: 'Presents', 5: 'Dancing & surprises' },
    },
    ru: {
      dressCodeDescription: 'Приходите в костюме любимого сказочного героя — за самый интересный костюм маленький подарок!',
      venueName: 'Сказочный парк, Баку', venueNote: 'Праздничный зал',
      loveStory: {
        0: { title: 'Я появился на свет', text: 'Весенним утром в нашей семье стало на одного малыша больше.', caption: 'первый день' },
        1: { title: 'Первые шаги', text: 'Однажды я встал на ножки и отправился исследовать весь дом.', caption: 'открытия' },
        2: { title: 'Мой первый день рождения', text: 'Задуть одну свечку оказалось не так-то просто!' },
        3: { title: 'Мой лучший друг', text: 'Теперь каждое утро мы вместе бежим играть.', caption: 'дружба' },
      },
      programSteps: { 0: 'Встреча гостей', 1: 'Игры с аниматорами', 2: 'Шоу фокусника', 3: 'Торт и свечи', 4: 'Подарки', 5: 'Танцы и сюрпризы' },
    },
  },
  programSteps: [
    { time: '15:00', icon: '🎈', activity: 'Qonaqların qarşılanması' },
    { time: '15:30', icon: '🎲', activity: 'Animatorlarla oyunlar' },
    { time: '16:15', icon: '🎩', activity: 'Sehrbaz şousu' },
    { time: '17:00', icon: '🎂', activity: 'Tort və şamlar' },
    { time: '17:30', icon: '🎁', activity: 'Hədiyyələr' },
    { time: '18:00', icon: '💃', activity: 'Rəqs və sürprizlər' },
  ],
}

export const demoKidsGuestbook = [
  { name: 'Nənə və baba', text: 'Əziz Ayan, ad günün mübarək! Həmişə belə şən, sağlam və maraqlı qal.' },
  { name: 'Aylin və ailəsi', text: 'Bayramına gəlmək üçün səbirsizlənirik! Ən böyük tortu sənə arzulayırıq.' },
  { name: 'Müəllimə Səbinə', text: 'Sənin kimi şagirdlə fəxr edirik. Bütün arzuların çin olsun!' },
  { name: 'Emil', text: 'Ad günün mübarək, dostum! Birlikdə çox oynayacağıq.' },
]

/* ── Digər konseptlərin demoları (2026-10) ──────────────────────────────── */
const noStory = { sections: { lovestory: false }, loveStory: [] }

/** Bu ilin 31 dekabrı (Yeni il şablonlarının demosu üçün — həmişə gələcəkdədir) */
function nextDec31() {
  return `${new Date().getFullYear()}-12-31`
}

/** i18n köməkçisi: proqram sətirlərinin EN/RU mətni */
function steps(az, en, ru, times, icons) {
  return {
    programSteps: az.map((a, i) => ({ time: times[i], icon: icons[i] || '✦', activity: a })),
    en: Object.fromEntries(en.map((v, i) => [i, v])),
    ru: Object.fromEntries(ru.map((v, i) => [i, v])),
  }
}

function demo({ base = {}, prog, venueEn, venueRu, noteEn, noteRu, dressEn, dressRu, extraI18n = {} }) {
  return {
    ...demoInvitation,
    ...noStory,
    ...base,
    programSteps: prog.programSteps,
    i18n: {
      en: { venueName: venueEn, venueNote: noteEn, dressCodeDescription: dressEn, programSteps: prog.en, ...(extraI18n.en || {}) },
      ru: { venueName: venueRu, venueNote: noteRu, dressCodeDescription: dressRu, programSteps: prog.ru, ...(extraI18n.ru || {}) },
    },
  }
}

const demoXina = demo({
  base: { eventType: 'xina', brideName: 'Aysel', groomName: '', eventName: '', time: '19:00', venueName: 'Qala Sarayı, Bakı', venueNote: 'Zərif zal',
    dressCodePalette: 'cocktail', dressCodeDescription: 'Qırmızı və qızılı çalarlar bu gecəyə çox yaraşar.' },
  prog: steps(['Qonaqların qarşılanması', 'Gəlinin gəlişi', 'Xına mərasimi', 'Şam yeməyi', 'Rəqs və musiqi'],
    ['Guest reception', 'Arrival of the bride', 'Henna ceremony', 'Dinner', 'Dance & music'],
    ['Приём гостей', 'Появление невесты', 'Церемония хны', 'Ужин', 'Танцы и музыка'],
    ['19:00', '19:30', '20:00', '21:00', '22:00'], ['🕯️', '👰', '🌿', '🍽️', '💃']),
  venueEn: 'Gala Palace, Baku', venueRu: 'Дворец «Гала», Баку', noteEn: 'Elegant hall', noteRu: 'Изысканный зал',
  dressEn: 'Shades of red and gold will suit this evening beautifully.', dressRu: 'Красные и золотые оттенки прекрасно подойдут этому вечеру.',
})

const demoSunnet = demo({
  base: { eventType: 'sunnet', brideName: 'Murad', groomName: '', eventName: '', age: 7, time: '16:00', venueName: 'Gülüstan Sarayı, Bakı', venueNote: 'Böyük zal',
    dressCodePalette: 'smartcasual', dressCodeDescription: 'Rahat və bayram ab-havasına uyğun geyim kifayətdir.',
    music: { ...demoInvitation.music, id: 'canon-in-d', title: 'Canon in D', artist: 'Pachelbel', file: '/music/canon-in-d.mp3', duration: 302 } },
  prog: steps(['Qonaqların qarşılanması', 'Kiçik bəyin girişi', 'Ziyafət', 'Əyləncə proqramı', 'Tortun kəsilməsi'],
    ['Guest reception', 'The little prince arrives', 'Feast', 'Entertainment', 'Cake cutting'],
    ['Приём гостей', 'Выход маленького принца', 'Банкет', 'Развлечения', 'Разрезание торта'],
    ['16:00', '17:00', '17:30', '18:30', '19:30'], ['🎈', '👑', '🍽️', '🎵', '🎂']),
  venueEn: 'Gulustan Palace, Baku', venueRu: 'Дворец «Гюлюстан», Баку', noteEn: 'Grand hall', noteRu: 'Большой зал',
  dressEn: 'Comfortable, festive clothing is perfect.', dressRu: 'Удобная праздничная одежда — то, что нужно.',
})

const demoBaby = demo({
  base: { eventType: 'baby', brideName: 'Aysel & Nicat', groomName: '', eventName: '', time: '15:00', venueName: 'Bağ Evi Kafe, Bakı', venueNote: 'Terras',
    dressCodePalette: 'pastel', dressCodeDescription: 'Oğlan deyirsinizsə mavi, qız deyirsinizsə çəhrayı geyinin — gəlin görək kim qalib gələcək!' },
  prog: steps(['Qonaqların gəlişi', 'Oyunlar: oğlan yoxsa qız?', 'Hədiyyələr', 'Tort və sürpriz'],
    ['Guest arrival', 'Games: boy or girl?', 'Gifts', 'Cake & surprise'],
    ['Прибытие гостей', 'Игры: мальчик или девочка?', 'Подарки', 'Торт и сюрприз'],
    ['15:00', '15:30', '16:30', '17:00'], ['🎀', '🧸', '🎁', '🎂']),
  venueEn: 'Garden House Café, Baku', venueRu: 'Кафе «Сад», Баку', noteEn: 'Terrace', noteRu: 'Терраса',
  dressEn: 'Wear blue if you think it is a boy, pink if a girl — let’s see who wins!', dressRu: 'Если думаете, что мальчик — приходите в голубом, если девочка — в розовом. Посмотрим, кто угадает!',
})

const corpSeating = [
  'Masa 1: Araz Hüseynov, Kamran Hümbətov, Lalə Əhmədova, Tural Məmmədov',
  'Masa 2: Nərmin Quliyeva, Elçin Əliyev, Röya Musayeva, Zaur İsmayılov',
  'Masa 3: Sevinc Babayeva, Orxan Nəcəfov, Türkan Muradova, Rauf Babayev',
].join('; ')

const demoCorporate = demo({
  base: { eventType: 'corporate', eventName: 'İllik Gala Gecəsi', organizer: 'Mərkəz Holdinq', brideName: '', groomName: '', time: '19:00', venueName: 'Fairmont Baku, Bakı', venueNote: 'Böyük bal zalı',
    dressCodePalette: 'blacktie', dressCodeDescription: 'Rəsmi axşam geyimi.', seatingPlan: corpSeating },
  prog: steps(['Qeydiyyat və qarşılanma', 'Açılış nitqi', 'İlin mükafatları', 'Ziyafət', 'Musiqi proqramı'],
    ['Registration & welcome', 'Opening speech', 'Awards of the year', 'Dinner', 'Music program'],
    ['Регистрация и встреча', 'Вступительная речь', 'Награды года', 'Ужин', 'Музыкальная программа'],
    ['19:00', '19:30', '20:00', '21:00', '22:00'], ['🤝', '🎤', '🏆', '🍽️', '🎵']),
  venueEn: 'Fairmont Baku, Baku', venueRu: 'Fairmont Baku, Баку', noteEn: 'Grand ballroom', noteRu: 'Большой бальный зал',
  dressEn: 'Formal evening wear.', dressRu: 'Вечерний дресс-код.',
})

const demoAnniversary = {
  ...demoInvitation,
  eventType: 'anniversary', brideName: 'Nicat & Aysel', groomName: '', eventName: '', age: 25,
  dressCodePalette: 'cocktail', dressCodeDescription: 'Gümüşü və ağ çalarlar bu axşama çox yaraşar.',
  programSteps: [
    { time: '19:00', icon: '🥂', activity: 'Qonaqların qarşılanması' },
    { time: '19:30', icon: '📷', activity: 'Xatirə anları' },
    { time: '20:00', icon: '🍽️', activity: 'Ziyafət' },
    { time: '21:00', icon: '💃', activity: 'Yenidən ilk rəqs' },
    { time: '22:00', icon: '🎂', activity: 'Tortun kəsilməsi' },
  ],
  i18n: {
    en: { ...demoInvitation.i18n.en, dressCodeDescription: 'Shades of silver and white will suit this evening.', programSteps: { 0: 'Guest reception', 1: 'Memories', 2: 'Dinner', 3: 'The first dance, again', 4: 'Cake cutting' } },
    ru: { ...demoInvitation.i18n.ru, dressCodeDescription: 'Серебристые и белые оттенки прекрасно подойдут этому вечеру.', programSteps: { 0: 'Приём гостей', 1: 'Воспоминания', 2: 'Ужин', 3: 'Снова первый танец', 4: 'Разрезание торта' } },
  },
}

const demoGraduation = demo({
  base: { eventType: 'graduation', brideName: 'Leyla', groomName: '', eventName: '', time: '18:00', venueName: 'Dənizkənarı Klub, Bakı', venueNote: 'Açıq terras',
    dressCodePalette: 'cocktail', dressCodeDescription: 'Axşam geyimi — bu gecə hamımız ulduzuq!' },
  prog: steps(['Qarşılanma', 'Diplomların təqdimatı', 'Ziyafət', 'Məzun valsı', 'Diskoteka'],
    ['Welcome', 'Diploma ceremony', 'Dinner', 'Graduation waltz', 'Disco'],
    ['Встреча', 'Вручение дипломов', 'Ужин', 'Выпускной вальс', 'Дискотека'],
    ['18:00', '18:30', '19:30', '21:00', '22:00'], ['🎓', '📜', '🍽️', '💃', '🎵']),
  venueEn: 'Seaside Club, Baku', venueRu: 'Клуб на набережной, Баку', noteEn: 'Open terrace', noteRu: 'Открытая терраса',
  dressEn: 'Evening wear — tonight we are all stars!', dressRu: 'Вечерний наряд — сегодня мы все звёзды!',
})

const demoOpening = demo({
  base: { eventType: 'corporate', eventName: 'Bella Café açılışı', organizer: 'Bella Café', brideName: '', groomName: '', time: '18:00', venueName: 'Nizami küçəsi 24, Bakı', venueNote: 'Bella Café',
    dressCodePalette: 'smartcasual', dressCodeDescription: 'Rahat və zərif geyim.', seatingPlan: corpSeating },
  prog: steps(['Qonaqların qarşılanması', 'Lentin kəsilməsi', 'Dequstasiya', 'Canlı musiqi'],
    ['Guest reception', 'Ribbon cutting', 'Tasting', 'Live music'],
    ['Приём гостей', 'Перерезание ленты', 'Дегустация', 'Живая музыка'],
    ['18:00', '18:30', '19:00', '20:00'], ['🥂', '✂️', '☕', '🎷']),
  venueEn: '24 Nizami street, Baku', venueRu: 'ул. Низами, 24, Баку', noteEn: 'Bella Café', noteRu: 'Bella Café',
  dressEn: 'Smart casual.', dressRu: 'Смарт-кэжуал.',
})

const demoNovruz = demo({
  base: { eventType: 'other', eventName: 'Novruz gecəsi', organizer: 'Əliyevlər ailəsi', brideName: '', groomName: '', time: '19:00', venueName: 'İçərişəhər, Bakı', venueNote: 'Karvansaray',
    dressCodePalette: 'earth', dressCodeDescription: 'Bahar rəngləri: yaşıl, qırmızı və qızılı.' },
  prog: steps(['Qonaqların qarşılanması', 'Tonqal üstündən tullanma', 'Bayram süfrəsi', 'Muğam və rəqs'],
    ['Guest reception', 'Jumping over the bonfire', 'Holiday feast', 'Mugham & dance'],
    ['Приём гостей', 'Прыжки через костёр', 'Праздничный стол', 'Мугам и танцы'],
    ['19:00', '19:30', '20:00', '21:00'], ['🌱', '🔥', '🍽️', '🎶']),
  venueEn: 'Icherisheher, Baku', venueRu: 'Ичеришехер, Баку', noteEn: 'Caravanserai', noteRu: 'Караван-сарай',
  dressEn: 'Spring colours: green, red and gold.', dressRu: 'Весенние цвета: зелёный, красный и золотой.',
})

const demoNewYear = demo({
  base: { eventType: 'other', eventName: 'Yeni il gecəsi', organizer: 'Dostlar', brideName: '', groomName: '', date: nextDec31(), time: '21:00', venueName: 'Panorama Restoranı, Bakı', venueNote: '12-ci mərtəbə',
    dressCodePalette: 'blacktie', dressCodeDescription: 'Parıltılı axşam geyimi — gecə yarısı hamımız işıq saçırıq!' },
  prog: steps(['Qonaqların qarşılanması', 'Bayram şam yeməyi', 'Gecə yarısı geri sayımı', 'Atəşfəşanlıq və rəqs'],
    ['Guest reception', 'Festive dinner', 'Midnight countdown', 'Fireworks & dancing'],
    ['Приём гостей', 'Праздничный ужин', 'Отсчёт до полуночи', 'Фейерверк и танцы'],
    ['21:00', '21:30', '23:50', '00:00'], ['🥂', '🍽️', '⏰', '🎆']),
  venueEn: 'Panorama Restaurant, Baku', venueRu: 'Ресторан «Панорама», Баку', noteEn: '12th floor', noteRu: '12-й этаж',
  dressEn: 'Sparkling evening wear — at midnight we all shine!', dressRu: 'Сверкающий вечерний наряд — в полночь мы все сияем!',
})

const demoBachelorette = demo({
  base: { eventType: 'bachelorette', brideName: 'Aysel', groomName: '', eventName: '', time: '19:00', venueName: 'Sky Lounge, Bakı', venueNote: 'VIP zal',
    dressCodePalette: 'pastel', dressCodeDescription: 'Çəhrayı və ağ — gəlin isə tamamilə ağda!' },
  prog: steps(['Görüş', 'Şam yeməyi', 'Oyunlar və sürprizlər', 'Rəqs gecəsi'],
    ['Meet-up', 'Dinner', 'Games & surprises', 'Dance night'],
    ['Встреча', 'Ужин', 'Игры и сюрпризы', 'Танцевальная ночь'],
    ['19:00', '19:30', '21:00', '22:00'], ['🥂', '🍽️', '🎁', '💃']),
  venueEn: 'Sky Lounge, Baku', venueRu: 'Sky Lounge, Баку', noteEn: 'VIP room', noteRu: 'VIP-зал',
  dressEn: 'Pink and white — and the bride all in white!', dressRu: 'Розовый и белый — а невеста вся в белом!',
})

const gb = (...rows) => rows.map(([name, text]) => ({ name, text }))
const GUESTBOOKS = {
  xina: gb(['Günel', 'Əziz Aysel, xınan mübarək! Həmişə belə gözəl və xoşbəxt ol.'], ['Xalan Lalə', 'Qızım, bu gecə sənin gecəndir — ömrün boyu sevinc olsun.'], ['Nərmin və Fidan', 'Səbirsizliklə gözləyirik! Ən gözəl gəlin sənsən.']),
  sunnet: gb(['Babası Kamran', 'Maşallah, balamız böyüyüb! Allah qorusun, həmişə sağlam ol.'], ['Əmisi Elnur', 'Murad, bayramın mübarək! Qəhrəman kimi böyü.'], ['Aylin və ailəsi', 'Bu gözəl günü sizinlə bölüşmək bizim üçün sevincdir.']),
  baby: gb(['Lalə xanım', 'Balaca qonağımızı səbirsizliklə gözləyirik! Sağlıqla dünyaya gəlsin.'], ['Rauf və Günel', 'Mən qız deyirəm! Gəlin görək kim tapacaq.'], ['Nənəsi', 'Ən gözəl xəbər — ailəmiz böyüyür.']),
  corporate: gb(['Kamran Hümbətov', 'Komandamızla qürur duyuram — ilin ən gözəl gecəsi olsun!'], ['Lalə Əhmədova', 'Gecəni səbirsizliklə gözləyirəm. Hamımıza təbriklər!'], ['Tural Məmmədov', 'Əla il idi — növbəti il daha uğurlu olsun.']),
  anniversary: gb(['Övladları', 'Əziz ana və ata, sevginiz bizə ən böyük nümunədir. Neçə-neçə illərə!'], ['Kamran bəy', '25 il birlikdə — təbrik edirik! Həmişə belə xoşbəxt olun.'], ['Günel və Rauf', 'Sizin hekayəniz ən gözəl sevgi hekayəsidir.']),
  graduation: gb(['Ailəsi', 'Leyla, səninlə fəxr edirik! Yeni yolun uğurlu olsun.'], ['Müəllimə Səbinə', 'Ən çalışqan tələbəm — böyük arzuların çin olsun!'], ['Sinif yoldaşları', 'Birlikdə keçən illər üçün təşəkkürlər. Gecədə görüşürük!']),
  opening: gb(['Rauf Babayev', 'Təbriklər! Bakının ən sevimli məkanı olacağınıza əminəm.'], ['Lalə Əhmədova', 'Açılışı səbirsizliklə gözləyirik — uğurlar!'], ['Elçin Əliyev', 'Çox gözəl yer olub, bol qonaqlı günləriniz olsun.']),
  holiday: gb(['Günel', 'Bayramınız mübarək! Süfrəniz həmişə bərəkətli olsun.'], ['Rauf və Nərmin', 'Bu gecəni sizinlə keçirmək çox xoşdur!'], ['Lalə xanım', 'Hamımıza sağlıq, sevinc və bol işıq arzulayıram.']),
  bachelorette: gb(['Fidan', 'Aysel, son qız gecən ən unudulmazı olsun!'], ['Nərmin', 'Gəlinimiz üçün hər şey hazırdır — rəqsə hazır olun!'], ['Günel', 'Səni çox sevirik! Ən gözəl gəlin sənsən.']),
}

/* Konsept → demo dəsti. Yeni konsept demosu = bura bir sətir. */
const DEMO_BY_CONCEPT = {
  kids: { weddingData: demoKidsInvitation, guestbook: demoKidsGuestbook },
  xina: { weddingData: demoXina, guestbook: GUESTBOOKS.xina },
  sunnet: { weddingData: demoSunnet, guestbook: GUESTBOOKS.sunnet },
  baby: { weddingData: demoBaby, guestbook: GUESTBOOKS.baby },
  corporate: { weddingData: demoCorporate, guestbook: GUESTBOOKS.corporate },
  anniversary: { weddingData: demoAnniversary, guestbook: GUESTBOOKS.anniversary },
  graduation: { weddingData: demoGraduation, guestbook: GUESTBOOKS.graduation },
  opening: { weddingData: demoOpening, guestbook: GUESTBOOKS.opening },
  holiday: { weddingData: demoNovruz, guestbook: GUESTBOOKS.holiday },
  bachelorette: { weddingData: demoBachelorette, guestbook: GUESTBOOKS.bachelorette },
}

/* Konseptin içində şablona məxsus fərqlər (məs. Qızıl toy → 50 il, Yeni il → 31 dekabr) */
const DEMO_BY_TEMPLATE = {
  'golden-jubilee':  { weddingData: { ...demoAnniversary, brideName: 'Əli & Səbinə', age: 50 }, guestbook: GUESTBOOKS.anniversary },
  'first-paper':     { weddingData: { ...demoAnniversary, age: 1 }, guestbook: GUESTBOOKS.anniversary },
  'midnight-clock':  { weddingData: demoNewYear, guestbook: GUESTBOOKS.holiday },
  'snow-globe':      { weddingData: demoNewYear, guestbook: GUESTBOOKS.holiday },
  'masquerade-ball': { weddingData: demoNewYear, guestbook: GUESTBOOKS.holiday },
}

/**
 * Şablon önbaxışının demo datası.
 * @param {string|null} concept şablonun `concept`-i (templateConfig)
 * @param {string} [templateId] — konsept daxilində şablona məxsus demo varsa
 * @returns {{ weddingData: object, guestbook: Array }}
 */
export function demoForConcept(concept, templateId) {
  return (templateId && DEMO_BY_TEMPLATE[templateId]) || DEMO_BY_CONCEPT[concept] || { weddingData: demoInvitation, guestbook: demoGuestbook }
}
