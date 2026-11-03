/* ─────────────────────────────────────────────────────────────────────────────
   Hekayə bölməsinin mətnləri — şablon üzrə (loveStoryTheme.js-dən ayrıldı, 2026-11).
   ⚠ React və şəbəkə YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir.
   ───────────────────────────────────────────────────────────────────────── */
/* ── Mətnlər (AZ/EN/RU) ── dizayndakı şablon adlandırmaları */
const COPY_BASE = {
  kicker:  { az: 'Hekayə', en: 'Story', ru: 'История' },
  title:   { az: 'Bizim Hekayəmiz', en: 'Our Story', ru: 'Наша история' },
  sub:     { az: 'Tanışlıqdan bu günə qədər yolumuz', en: 'Our journey from the day we met to today', ru: 'Наш путь от знакомства до сегодняшнего дня' },
  end:     { az: '…və hekayəmiz davam edir', en: '…and our story goes on', ru: '…и наша история продолжается' },
  next:    { az: 'Növbəti fəsil', en: 'Next chapter', ru: 'Следующая глава' },
  endSub:  { az: 'Bu günü sizinlə yazmaq istəyirik.', en: 'We want to write this day with you.', ru: 'Этот день мы хотим написать вместе с вами.' },
  kpre:    { az: '', en: '', ru: '' },
  photo:   { az: 'Foto', en: 'Photo', ru: 'Фото' },
}

const COPY = {
  'modern-black':    { title: { az: 'Bizim hekayəmiz', en: 'Our story', ru: 'Наша история' } },
  'night-sky':       { kicker: { az: 'Ulduz xəritəsi', en: 'Star map', ru: 'Звёздная карта' } },
  'boarding-pass':   {
    kicker: { az: 'Uçuş jurnalı', en: 'Flight log', ru: 'Бортовой журнал' },
    title:  { az: 'Bizim marşrut', en: 'Our route', ru: 'Наш маршрут' },
    end:    { az: 'Son dayanacaq: toy günümüz', en: 'Final stop: our wedding day', ru: 'Конечная остановка: наша свадьба' },
    kpre:   { az: 'Uçuş', en: 'Flight', ru: 'Рейс' },
  },
  'cinema-premiere': {
    kicker: { az: 'Premyera', en: 'Premiere', ru: 'Премьера' },
    title:  { az: 'Bizim Filmimiz', en: 'Our Film', ru: 'Наш фильм' },
    end:    { az: 'Davamı var…', en: 'To be continued…', ru: 'Продолжение следует…' },
    kpre:   { az: 'Səhnə', en: 'Scene', ru: 'Сцена' },
  },
  'vinyl-record':    {
    kicker: { az: 'Side A', en: 'Side A', ru: 'Side A' },
    title:  { az: 'Bizim albomumuz', en: 'Our album', ru: 'Наш альбом' },
    end:    { az: 'Side B — tezliklə', en: 'Side B — coming soon', ru: 'Side B — скоро' },
    kpre:   { az: 'Trek', en: 'Track', ru: 'Трек' },
  },
  'royal-palace':    { title: { az: 'Bizim Tariximiz', en: 'Our Chronicle', ru: 'Наша летопись' } },
  'mediterranean':   { kicker: { az: 'Sahil gündəliyi', en: 'Seaside diary', ru: 'Морской дневник' } },
  'gazette':         {
    kicker: { az: 'Xüsusi buraxılış', en: 'Special edition', ru: 'Специальный выпуск' },
    title:  { az: 'Bir sevgi hekayəsi', en: 'A love story', ru: 'История любви' },
    end:    { az: 'Davamı növbəti buraxılışda', en: 'Continued in the next issue', ru: 'Продолжение в следующем выпуске' },
    kpre:   { az: 'Səh.', en: 'P.', ru: 'Стр.' },
  },
  'luxury-jewelry':  { kicker: { az: 'Kolleksiya', en: 'Collection', ru: 'Коллекция' } },
  /* Uşaq ad günü konsepti — hekayə uşağın öz böyümə hekayəsidir */
  'fairy-tale': {
    kicker: { az: 'Nağıl', en: 'A tale', ru: 'Сказка' },
    title:  { az: 'Mənim nağılım', en: 'My fairy tale', ru: 'Моя сказка' },
    sub:    { az: 'Doğulduğum gündən bu günə qədər', en: 'From the day I was born until today', ru: 'С самого первого дня и до сегодня' },
    end:    { az: '…və nağıl davam edir', en: '…and the tale goes on', ru: '…и сказка продолжается' },
    endSub: { az: 'Bu fəsli sizinlə yazmaq istəyirik.', en: 'We want to write this chapter with you.', ru: 'Эту главу мы хотим написать вместе с вами.' },
  },
  'space-mission': {
    kicker: { az: 'Bort jurnalı', en: 'Ship’s log', ru: 'Бортовой журнал' },
    title:  { az: 'Mənim orbitim', en: 'My orbit', ru: 'Моя орбита' },
    sub:    { az: 'Doğulduğum gündən bu günə qədər', en: 'From the day I was born until today', ru: 'С самого первого дня и до сегодня' },
    end:    { az: 'Növbəti missiya: bu ad günü', en: 'Next mission: this birthday', ru: 'Следующая миссия: этот день рождения' },
    endSub: { az: 'Ekipajımızda sizi də görmək istəyirik.', en: 'We want you on our crew.', ru: 'Ждём вас в нашем экипаже.' },
    kpre:   { az: 'Missiya', en: 'Mission', ru: 'Миссия' },
  },
  'circus-show': {
    kicker: { az: 'Böyük şou', en: 'The big show', ru: 'Большое шоу' },
    title:  { az: 'Mənim şoum', en: 'My show', ru: 'Моё шоу' },
    sub:    { az: 'Doğulduğum gündən bu günə qədər', en: 'From the day I was born until today', ru: 'С самого первого дня и до сегодня' },
    end:    { az: 'Ən böyük nömrə hələ qabaqdadır', en: 'The best act is yet to come', ru: 'Лучший номер ещё впереди' },
    endSub: { az: 'Alqışlarınızı gözləyirik.', en: 'We are waiting for your applause.', ru: 'Ждём ваших аплодисментов.' },
    kpre:   { az: 'Nömrə', en: 'Act', ru: 'Номер' },
  },
  'dino-adventure': {
    kicker: { az: 'Ekspedisiya gündəliyi', en: 'Expedition journal', ru: 'Дневник экспедиции' },
    title:  { az: 'Mənim izlərim', en: 'My footprints', ru: 'Мои следы' },
    sub:    { az: 'Doğulduğum gündən bu günə qədər', en: 'From the day I was born until today', ru: 'С самого первого дня и до сегодня' },
    end:    { az: 'Yeni kəşflər qabaqdadır', en: 'New discoveries ahead', ru: 'Впереди новые открытия' },
    endSub: { az: 'Növbəti kəşfə bizimlə gəlin.', en: 'Join us for the next discovery.', ru: 'Присоединяйтесь к следующему открытию.' },
    kpre:   { az: 'Tapıntı', en: 'Find', ru: 'Находка' },
  },
  'balloon-party': {
    kicker: { az: 'Albom', en: 'Album', ru: 'Альбом' },
    title:  { az: 'Mənim albomum', en: 'My album', ru: 'Мой альбом' },
    sub:    { az: 'Doğulduğum gündən bu günə qədər', en: 'From the day I was born until today', ru: 'С самого первого дня и до сегодня' },
    end:    { az: '…və bayram davam edir', en: '…and the party goes on', ru: '…и праздник продолжается' },
    endSub: { az: 'Bu səhifəni sizinlə doldurmaq istəyirik.', en: 'We want to fill this page with you.', ru: 'Эту страницу мы хотим заполнить вместе с вами.' },
  },
  /* 2026-10 — «Sünnət toyu» konsepti */
  'little-prince': {
    kicker: { az: 'Saray salnaməsi', en: 'Royal chronicle', ru: 'Королевская летопись' },
    title:  { az: 'Mənim hekayəm', en: 'My story', ru: 'Моя история' },
    sub:    { az: 'Doğulduğum gündən bu günə qədər', en: 'From the day I was born until today', ru: 'С самого первого дня и до сегодня' },
    end:    { az: '…və hekayə davam edir', en: '…and the story goes on', ru: '…и история продолжается' },
    endSub: { az: 'Bu günü sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this day with you.', ru: 'Мы хотим отпраздновать этот день вместе с вами.' },
  },
  'hero-comic': {
    kicker: { az: 'Komiks', en: 'Comic', ru: 'Комикс' },
    title:  { az: 'Qəhrəmanın hekayəsi', en: 'The hero’s story', ru: 'История героя' },
    sub:    { az: 'Doğulduğum gündən bu günə qədər', en: 'From the day I was born until today', ru: 'С самого первого дня и до сегодня' },
    end:    { az: 'Davamı növbəti sayda…', en: 'To be continued in the next issue…', ru: 'Продолжение в следующем выпуске…' },
    endSub: { az: 'Bu səhifəni sizinlə birlikdə yazacağıq.', en: 'We will write this page together with you.', ru: 'Эту страницу мы напишем вместе с вами.' },
    kpre:   { az: 'Səh.', en: 'P.', ru: 'Стр.' },
  },
  'mashallah': {
    kicker: { az: 'Albom', en: 'Album', ru: 'Альбом' },
    title:  { az: 'Mənim hekayəm', en: 'My story', ru: 'Моя история' },
    sub:    { az: 'Doğulduğum gündən bu günə qədər', en: 'From the day I was born until today', ru: 'С самого первого дня и до сегодня' },
    end:    { az: '…və hekayə davam edir', en: '…and the story goes on', ru: '…и история продолжается' },
    endSub: { az: 'Bu günü sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this day with you.', ru: 'Мы хотим отпраздновать этот день вместе с вами.' },
  },
  'little-pilot': {
    kicker: { az: 'Pilot gündəliyi', en: 'Pilot’s diary', ru: 'Дневник пилота' },
    title:  { az: 'Mənim uçuşum', en: 'My flight', ru: 'Мой полёт' },
    sub:    { az: 'Doğulduğum gündən bu günə qədər', en: 'From the day I was born until today', ru: 'С самого первого дня и до сегодня' },
    end:    { az: 'Növbəti uçuş: bu bayram', en: 'Next flight: this celebration', ru: 'Следующий рейс: этот праздник' },
    endSub: { az: 'Bortda sizi də görmək istəyirik.', en: 'We want you on board.', ru: 'Ждём вас на борту.' },
    kpre:   { az: 'Uçuş', en: 'Flight', ru: 'Полёт' },
  },
  'football-star': {
    kicker: { az: 'Karyera', en: 'Career', ru: 'Карьера' },
    title:  { az: 'Ulduzun yolu', en: 'The star’s path', ru: 'Путь звезды' },
    sub:    { az: 'Doğulduğum gündən bu günə qədər', en: 'From the day I was born until today', ru: 'С самого первого дня и до сегодня' },
    end:    { az: 'Ən böyük qol hələ qabaqdadır', en: 'The best goal is yet to come', ru: 'Лучший гол ещё впереди' },
    endSub: { az: 'Bu matçda sizi tribunada görmək istəyirik.', en: 'We want to see you in the stands.', ru: 'Ждём вас на трибунах.' },
    kpre:   { az: 'Mövsüm', en: 'Season', ru: 'Сезон' },
  },
  /* 2026-10 — «Baby shower» konsepti */
  'pastel-bloom': {
    end:    { az: '…və tezliklə üç nəfər olacağıq', en: '…and soon we will be three', ru: '…и скоро нас будет трое' },
    endSub: { az: 'Bu sevinci sizinlə bölüşmək istəyirik.', en: 'We want to share this joy with you.', ru: 'Мы хотим разделить эту радость с вами.' },
  },
  'teddy-bear': {
    end:    { az: '…və tezliklə üç nəfər olacağıq', en: '…and soon we will be three', ru: '…и скоро нас будет трое' },
    endSub: { az: 'Bu sevinci sizinlə bölüşmək istəyirik.', en: 'We want to share this joy with you.', ru: 'Мы хотим разделить эту радость с вами.' },
  },
  'gender-reveal': {
    end:    { az: '…və tezliklə üç nəfər olacağıq', en: '…and soon we will be three', ru: '…и скоро нас будет трое' },
    endSub: { az: 'Sirri sizinlə birlikdə açmaq istəyirik.', en: 'We want to reveal the secret together with you.', ru: 'Мы хотим раскрыть секрет вместе с вами.' },
  },
  'stork-letter': {
    end:    { az: '…və leylək artıq yoldadır', en: '…and the stork is already on its way', ru: '…и аист уже в пути' },
    endSub: { az: 'Bu sevinci sizinlə bölüşmək istəyirik.', en: 'We want to share this joy with you.', ru: 'Мы хотим разделить эту радость с вами.' },
  },
  'baby-mobile': {
    end:    { az: '…və tezliklə üç nəfər olacağıq', en: '…and soon we will be three', ru: '…и скоро нас будет трое' },
    endSub: { az: 'Bu sevinci sizinlə bölüşmək istəyirik.', en: 'We want to share this joy with you.', ru: 'Мы хотим разделить эту радость с вами.' },
  },
  /* 2026-10 — «Korporativ» konsepti */
  'gala-night': {
    kicker: { az: 'Tarixçə', en: 'History', ru: 'История' },
    title:  { az: 'Bizim yolumuz', en: 'Our journey', ru: 'Наш путь' },
    sub:    { az: 'İlk gündən bu günə qədər', en: 'From day one to today', ru: 'С первого дня до сегодня' },
    end:    { az: '…və yeni zirvələr qabaqdadır', en: '…and new heights lie ahead', ru: '…и впереди новые вершины' },
    endSub: { az: 'Bu uğuru sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this success with you.', ru: 'Мы хотим отметить этот успех вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'keynote': {
    kicker: { az: 'Tarixçə', en: 'History', ru: 'История' },
    title:  { az: 'Bizim yolumuz', en: 'Our journey', ru: 'Наш путь' },
    sub:    { az: 'İlk gündən bu günə qədər', en: 'From day one to today', ru: 'С первого дня до сегодня' },
    end:    { az: '…və yeni zirvələr qabaqdadır', en: '…and new heights lie ahead', ru: '…и впереди новые вершины' },
    endSub: { az: 'Bu uğuru sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this success with you.', ru: 'Мы хотим отметить этот успех вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'award-night': {
    kicker: { az: 'Tarixçə', en: 'History', ru: 'История' },
    title:  { az: 'Bizim yolumuz', en: 'Our journey', ru: 'Наш путь' },
    sub:    { az: 'İlk gündən bu günə qədər', en: 'From day one to today', ru: 'С первого дня до сегодня' },
    end:    { az: '…və yeni zirvələr qabaqdadır', en: '…and new heights lie ahead', ru: '…и впереди новые вершины' },
    endSub: { az: 'Bu uğuru sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this success with you.', ru: 'Мы хотим отметить этот успех вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'business-card': {
    kicker: { az: 'Tarixçə', en: 'History', ru: 'История' },
    title:  { az: 'Bizim yolumuz', en: 'Our journey', ru: 'Наш путь' },
    sub:    { az: 'İlk gündən bu günə qədər', en: 'From day one to today', ru: 'С первого дня до сегодня' },
    end:    { az: '…və yeni zirvələr qabaqdadır', en: '…and new heights lie ahead', ru: '…и впереди новые вершины' },
    endSub: { az: 'Bu uğuru sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this success with you.', ru: 'Мы хотим отметить этот успех вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'neon-party': {
    kicker: { az: 'Tarixçə', en: 'History', ru: 'История' },
    title:  { az: 'Bizim yolumuz', en: 'Our journey', ru: 'Наш путь' },
    sub:    { az: 'İlk gündən bu günə qədər', en: 'From day one to today', ru: 'С первого дня до сегодня' },
    end:    { az: '…və yeni zirvələr qabaqdadır', en: '…and new heights lie ahead', ru: '…и впереди новые вершины' },
    endSub: { az: 'Bu uğuru sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this success with you.', ru: 'Мы хотим отметить этот успех вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  /* 2026-10 — «İldönümü» konsepti */
  'silver-locket': {
    kicker: { az: 'Xatirələr', en: 'Memories', ru: 'Воспоминания' },
    title:  { az: 'Bizim illərimiz', en: 'Our years', ru: 'Наши годы' },
    sub:    { az: 'İlk görüşdən bu günə qədər', en: 'From our first meeting to today', ru: 'С первой встречи до сегодняшнего дня' },
    end:    { az: '…və hekayəmiz davam edir', en: '…and our story goes on', ru: '…и наша история продолжается' },
    endSub: { az: 'Bu ildönümünü sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this anniversary with you.', ru: 'Мы хотим отметить эту годовщину вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'golden-jubilee': {
    kicker: { az: 'Xatirələr', en: 'Memories', ru: 'Воспоминания' },
    title:  { az: 'Bizim illərimiz', en: 'Our years', ru: 'Наши годы' },
    sub:    { az: 'İlk görüşdən bu günə qədər', en: 'From our first meeting to today', ru: 'С первой встречи до сегодняшнего дня' },
    end:    { az: '…və hekayəmiz davam edir', en: '…and our story goes on', ru: '…и наша история продолжается' },
    endSub: { az: 'Bu ildönümünü sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this anniversary with you.', ru: 'Мы хотим отметить эту годовщину вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'first-paper': {
    kicker: { az: 'Xatirələr', en: 'Memories', ru: 'Воспоминания' },
    title:  { az: 'Bizim illərimiz', en: 'Our years', ru: 'Наши годы' },
    sub:    { az: 'İlk görüşdən bu günə qədər', en: 'From our first meeting to today', ru: 'С первой встречи до сегодняшнего дня' },
    end:    { az: '…və hekayəmiz davam edir', en: '…and our story goes on', ru: '…и наша история продолжается' },
    endSub: { az: 'Bu ildönümünü sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this anniversary with you.', ru: 'Мы хотим отметить эту годовщину вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'retro-polaroid': {
    kicker: { az: 'Xatirələr', en: 'Memories', ru: 'Воспоминания' },
    title:  { az: 'Bizim illərimiz', en: 'Our years', ru: 'Наши годы' },
    sub:    { az: 'İlk görüşdən bu günə qədər', en: 'From our first meeting to today', ru: 'С первой встречи до сегодняшнего дня' },
    end:    { az: '…və hekayəmiz davam edir', en: '…and our story goes on', ru: '…и наша история продолжается' },
    endSub: { az: 'Bu ildönümünü sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this anniversary with you.', ru: 'Мы хотим отметить эту годовщину вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'love-letters': {
    kicker: { az: 'Xatirələr', en: 'Memories', ru: 'Воспоминания' },
    title:  { az: 'Bizim illərimiz', en: 'Our years', ru: 'Наши годы' },
    sub:    { az: 'İlk görüşdən bu günə qədər', en: 'From our first meeting to today', ru: 'С первой встречи до сегодняшнего дня' },
    end:    { az: '…və hekayəmiz davam edir', en: '…and our story goes on', ru: '…и наша история продолжается' },
    endSub: { az: 'Bu ildönümünü sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this anniversary with you.', ru: 'Мы хотим отметить эту годовщину вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  /* 2026-10 — «Məzuniyyət» konsepti */
  'caps-toss': {
    kicker: { az: 'Xatirələr', en: 'Memories', ru: 'Воспоминания' },
    title:  { az: 'Məktəb illərim', en: 'My school years', ru: 'Мои школьные годы' },
    sub:    { az: 'Birinci sinifdən bu günə qədər', en: 'From first grade to today', ru: 'С первого класса до сегодняшнего дня' },
    end:    { az: '…və qarşıda yeni yol var', en: '…and a new road lies ahead', ru: '…а впереди новый путь' },
    endSub: { az: 'Bu günü sizinlə qeyd etmək istəyirəm.', en: 'I want to celebrate this day with you.', ru: 'Я хочу отметить этот день вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'yearbook': {
    kicker: { az: 'Xatirələr', en: 'Memories', ru: 'Воспоминания' },
    title:  { az: 'Məktəb illərim', en: 'My school years', ru: 'Мои школьные годы' },
    sub:    { az: 'Birinci sinifdən bu günə qədər', en: 'From first grade to today', ru: 'С первого класса до сегодняшнего дня' },
    end:    { az: '…və qarşıda yeni yol var', en: '…and a new road lies ahead', ru: '…а впереди новый путь' },
    endSub: { az: 'Bu günü sizinlə qeyd etmək istəyirəm.', en: 'I want to celebrate this day with you.', ru: 'Я хочу отметить этот день вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'last-bell': {
    kicker: { az: 'Xatirələr', en: 'Memories', ru: 'Воспоминания' },
    title:  { az: 'Məktəb illərim', en: 'My school years', ru: 'Мои школьные годы' },
    sub:    { az: 'Birinci sinifdən bu günə qədər', en: 'From first grade to today', ru: 'С первого класса до сегодняшнего дня' },
    end:    { az: '…və qarşıda yeni yol var', en: '…and a new road lies ahead', ru: '…а впереди новый путь' },
    endSub: { az: 'Bu günü sizinlə qeyd etmək istəyirəm.', en: 'I want to celebrate this day with you.', ru: 'Я хочу отметить этот день вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'chalkboard': {
    kicker: { az: 'Xatirələr', en: 'Memories', ru: 'Воспоминания' },
    title:  { az: 'Məktəb illərim', en: 'My school years', ru: 'Мои школьные годы' },
    sub:    { az: 'Birinci sinifdən bu günə qədər', en: 'From first grade to today', ru: 'С первого класса до сегодняшнего дня' },
    end:    { az: '…və qarşıda yeni yol var', en: '…and a new road lies ahead', ru: '…а впереди новый путь' },
    endSub: { az: 'Bu günü sizinlə qeyd etmək istəyirəm.', en: 'I want to celebrate this day with you.', ru: 'Я хочу отметить этот день вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'paper-plane': {
    kicker: { az: 'Xatirələr', en: 'Memories', ru: 'Воспоминания' },
    title:  { az: 'Məktəb illərim', en: 'My school years', ru: 'Мои школьные годы' },
    sub:    { az: 'Birinci sinifdən bu günə qədər', en: 'From first grade to today', ru: 'С первого класса до сегодняшнего дня' },
    end:    { az: '…və qarşıda yeni yol var', en: '…and a new road lies ahead', ru: '…а впереди новый путь' },
    endSub: { az: 'Bu günü sizinlə qeyd etmək istəyirəm.', en: 'I want to celebrate this day with you.', ru: 'Я хочу отметить этот день вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  /* 2026-10 — «Açılış və təqdimat» konsepti */
  'ribbon-cut': {
    kicker: { az: 'Tariximiz', en: 'Our history', ru: 'Наша история' },
    title:  { az: 'Necə başladı', en: 'How it started', ru: 'Как всё начиналось' },
    sub:    { az: 'İdeyadan açılış gününə qədər', en: 'From the idea to opening day', ru: 'От идеи до дня открытия' },
    end:    { az: '…və qapılarımız sizin üçün açıqdır', en: '…and our doors are open for you', ru: '…и наши двери открыты для вас' },
    endSub: { az: 'Bu günü sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this day with you.', ru: 'Мы хотим отметить этот день вместе с вами.' },
    kpre:   { az: 'Mərhələ', en: 'Step', ru: 'Этап' },
  },
  'bistro-sign': {
    kicker: { az: 'Tariximiz', en: 'Our history', ru: 'Наша история' },
    title:  { az: 'Necə başladı', en: 'How it started', ru: 'Как всё начиналось' },
    sub:    { az: 'İdeyadan açılış gününə qədər', en: 'From the idea to opening day', ru: 'От идеи до дня открытия' },
    end:    { az: '…və qapılarımız sizin üçün açıqdır', en: '…and our doors are open for you', ru: '…и наши двери открыты для вас' },
    endSub: { az: 'Bu günü sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this day with you.', ru: 'Мы хотим отметить этот день вместе с вами.' },
    kpre:   { az: 'Mərhələ', en: 'Step', ru: 'Этап' },
  },
  'roller-shutter': {
    kicker: { az: 'Tariximiz', en: 'Our history', ru: 'Наша история' },
    title:  { az: 'Necə başladı', en: 'How it started', ru: 'Как всё начиналось' },
    sub:    { az: 'İdeyadan açılış gününə qədər', en: 'From the idea to opening day', ru: 'От идеи до дня открытия' },
    end:    { az: '…və qapılarımız sizin üçün açıqdır', en: '…and our doors are open for you', ru: '…и наши двери открыты для вас' },
    endSub: { az: 'Bu günü sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this day with you.', ru: 'Мы хотим отметить этот день вместе с вами.' },
    kpre:   { az: 'Mərhələ', en: 'Step', ru: 'Этап' },
  },
  'unboxing': {
    kicker: { az: 'Tariximiz', en: 'Our history', ru: 'Наша история' },
    title:  { az: 'Necə başladı', en: 'How it started', ru: 'Как всё начиналось' },
    sub:    { az: 'İdeyadan açılış gününə qədər', en: 'From the idea to opening day', ru: 'От идеи до дня открытия' },
    end:    { az: '…və qapılarımız sizin üçün açıqdır', en: '…and our doors are open for you', ru: '…и наши двери открыты для вас' },
    endSub: { az: 'Bu günü sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this day with you.', ru: 'Мы хотим отметить этот день вместе с вами.' },
    kpre:   { az: 'Mərhələ', en: 'Step', ru: 'Этап' },
  },
  'gallery-unveil': {
    kicker: { az: 'Tariximiz', en: 'Our history', ru: 'Наша история' },
    title:  { az: 'Necə başladı', en: 'How it started', ru: 'Как всё начиналось' },
    sub:    { az: 'İdeyadan açılış gününə qədər', en: 'From the idea to opening day', ru: 'От идеи до дня открытия' },
    end:    { az: '…və qapılarımız sizin üçün açıqdır', en: '…and our doors are open for you', ru: '…и наши двери открыты для вас' },
    endSub: { az: 'Bu günü sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this day with you.', ru: 'Мы хотим отметить этот день вместе с вами.' },
    kpre:   { az: 'Mərhələ', en: 'Step', ru: 'Этап' },
  },
  /* 2026-10 — «Bayram gecələri» konsepti */
  'novruz-bonfire': {
    kicker: { az: 'Ənənə', en: 'Tradition', ru: 'Традиция' },
    title:  { az: 'Bayram hekayəsi', en: 'Holiday story', ru: 'Праздничная история' },
    sub:    { az: 'İllər boyu bizimlə olan bayram anları', en: 'Festive moments that stayed with us over the years', ru: 'Праздничные моменты, которые с нами годами' },
    end:    { az: '…və yeni bayram başlayır', en: '…and a new celebration begins', ru: '…и начинается новый праздник' },
    endSub: { az: 'Bu bayramı sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this holiday with you.', ru: 'Мы хотим отметить этот праздник вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'novruz-semeni': {
    kicker: { az: 'Ənənə', en: 'Tradition', ru: 'Традиция' },
    title:  { az: 'Bayram hekayəsi', en: 'Holiday story', ru: 'Праздничная история' },
    sub:    { az: 'İllər boyu bizimlə olan bayram anları', en: 'Festive moments that stayed with us over the years', ru: 'Праздничные моменты, которые с нами годами' },
    end:    { az: '…və yeni bayram başlayır', en: '…and a new celebration begins', ru: '…и начинается новый праздник' },
    endSub: { az: 'Bu bayramı sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this holiday with you.', ru: 'Мы хотим отметить этот праздник вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'midnight-clock': {
    kicker: { az: 'Ənənə', en: 'Tradition', ru: 'Традиция' },
    title:  { az: 'Bayram hekayəsi', en: 'Holiday story', ru: 'Праздничная история' },
    sub:    { az: 'İllər boyu bizimlə olan bayram anları', en: 'Festive moments that stayed with us over the years', ru: 'Праздничные моменты, которые с нами годами' },
    end:    { az: '…və yeni bayram başlayır', en: '…and a new celebration begins', ru: '…и начинается новый праздник' },
    endSub: { az: 'Bu bayramı sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this holiday with you.', ru: 'Мы хотим отметить этот праздник вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'snow-globe': {
    kicker: { az: 'Ənənə', en: 'Tradition', ru: 'Традиция' },
    title:  { az: 'Bayram hekayəsi', en: 'Holiday story', ru: 'Праздничная история' },
    sub:    { az: 'İllər boyu bizimlə olan bayram anları', en: 'Festive moments that stayed with us over the years', ru: 'Праздничные моменты, которые с нами годами' },
    end:    { az: '…və yeni bayram başlayır', en: '…and a new celebration begins', ru: '…и начинается новый праздник' },
    endSub: { az: 'Bu bayramı sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this holiday with you.', ru: 'Мы хотим отметить этот праздник вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'masquerade-ball': {
    kicker: { az: 'Ənənə', en: 'Tradition', ru: 'Традиция' },
    title:  { az: 'Bayram hekayəsi', en: 'Holiday story', ru: 'Праздничная история' },
    sub:    { az: 'İllər boyu bizimlə olan bayram anları', en: 'Festive moments that stayed with us over the years', ru: 'Праздничные моменты, которые с нами годами' },
    end:    { az: '…və yeni bayram başlayır', en: '…and a new celebration begins', ru: '…и начинается новый праздник' },
    endSub: { az: 'Bu bayramı sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this holiday with you.', ru: 'Мы хотим отметить этот праздник вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  /* 2026-10 — «Qız gecəsi» konsepti */
  'pink-champagne': {
    kicker: { az: 'Bizim qızlar', en: 'Our girls', ru: 'Наши девочки' },
    title:  { az: 'Dostluğumuz', en: 'Our friendship', ru: 'Наша дружба' },
    sub:    { az: 'Məktəb illərindən bu günə qədər', en: 'From school days to today', ru: 'Со школьных лет до сегодня' },
    end:    { az: '…və ən gözəl gəlin sənsən', en: '…and you are the most beautiful bride', ru: '…и ты самая красивая невеста' },
    endSub: { az: 'Bu gecəni sənin üçün təşkil edirik.', en: 'We are throwing this night for you.', ru: 'Мы устраиваем этот вечер для тебя.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'disco-ball': {
    kicker: { az: 'Bizim qızlar', en: 'Our girls', ru: 'Наши девочки' },
    title:  { az: 'Dostluğumuz', en: 'Our friendship', ru: 'Наша дружба' },
    sub:    { az: 'Məktəb illərindən bu günə qədər', en: 'From school days to today', ru: 'Со школьных лет до сегодня' },
    end:    { az: '…və ən gözəl gəlin sənsən', en: '…and you are the most beautiful bride', ru: '…и ты самая красивая невеста' },
    endSub: { az: 'Bu gecəni sənin üçün təşkil edirik.', en: 'We are throwing this night for you.', ru: 'Мы устраиваем этот вечер для тебя.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'pajama-spa': {
    kicker: { az: 'Bizim qızlar', en: 'Our girls', ru: 'Наши девочки' },
    title:  { az: 'Dostluğumuz', en: 'Our friendship', ru: 'Наша дружба' },
    sub:    { az: 'Məktəb illərindən bu günə qədər', en: 'From school days to today', ru: 'Со школьных лет до сегодня' },
    end:    { az: '…və ən gözəl gəlin sənsən', en: '…and you are the most beautiful bride', ru: '…и ты самая красивая невеста' },
    endSub: { az: 'Bu gecəni sənin üçün təşkil edirik.', en: 'We are throwing this night for you.', ru: 'Мы устраиваем этот вечер для тебя.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'paris-night': {
    kicker: { az: 'Bizim qızlar', en: 'Our girls', ru: 'Наши девочки' },
    title:  { az: 'Dostluğumuz', en: 'Our friendship', ru: 'Наша дружба' },
    sub:    { az: 'Məktəb illərindən bu günə qədər', en: 'From school days to today', ru: 'Со школьных лет до сегодня' },
    end:    { az: '…və ən gözəl gəlin sənsən', en: '…and you are the most beautiful bride', ru: '…и ты самая красивая невеста' },
    endSub: { az: 'Bu gecəni sənin üçün təşkil edirik.', en: 'We are throwing this night for you.', ru: 'Мы устраиваем этот вечер для тебя.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'boho-sunset': {
    kicker: { az: 'Bizim qızlar', en: 'Our girls', ru: 'Наши девочки' },
    title:  { az: 'Dostluğumuz', en: 'Our friendship', ru: 'Наша дружба' },
    sub:    { az: 'Məktəb illərindən bu günə qədər', en: 'From school days to today', ru: 'Со школьных лет до сегодня' },
    end:    { az: '…və ən gözəl gəlin sənsən', en: '…and you are the most beautiful bride', ru: '…и ты самая красивая невеста' },
    endSub: { az: 'Bu gecəni sənin üçün təşkil edirik.', en: 'We are throwing this night for you.', ru: 'Мы устраиваем этот вечер для тебя.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
}

/** Aktiv dil üçün mətnlər: şablon → baza, dil → AZ. */
/* Ad günü versiyası: hekayə tək nəfərindir. Köhnə 16 dizaynın hekayə mətni
   cütlük üçündür («Bizim marşrut»), ona görə ad günündə bunlar işləyir.
   Konsept şablonlarının (uşaq, sünnət…) öz mətni onsuz da tək nəfər üçündür. */
const BIRTHDAY_BASE = {
  title:  { az: 'Mənim hekayəm', en: 'My story', ru: 'Моя история' },
  sub:    { az: 'Doğulduğum gündən bu günə qədər', en: 'From the day I was born until today', ru: 'С самого первого дня и до сегодня' },
  end:    { az: '…və hekayə davam edir', en: '…and the story goes on', ru: '…и история продолжается' },
  endSub: { az: 'Bu günü sizinlə qeyd etmək istəyirik.', en: 'I want to celebrate this day with you.', ru: 'Я хочу отпраздновать этот день с вами.' },
}
const BIRTHDAY_COPY = {
  'boarding-pass': {
    title: { az: 'Mənim marşrutum', en: 'My route', ru: 'Мой маршрут' },
    end:   { az: 'Növbəti dayanacaq: ad günüm', en: 'Next stop: my birthday', ru: 'Следующая остановка: мой день рождения' },
  },
  'cinema-premiere': { title: { az: 'Mənim filmim', en: 'My film', ru: 'Мой фильм' } },
  'vinyl-record':    {
    title: { az: 'Mənim albomum', en: 'My album', ru: 'Мой альбом' },
    end:   { az: 'Side B — yeni yaşım', en: 'Side B — my new year', ru: 'Side B — мой новый год жизни' },
  },
  'gazette':         { title: { az: 'Bir ömrün hekayəsi', en: 'The story of a life', ru: 'История одной жизни' } },
  'royal-palace':    { title: { az: 'Mənim tarixim', en: 'My chronicle', ru: 'Моя летопись' } },
}
/* Cütlük mətni olan köhnə dizaynlar — yeni konseptlərin COPY-si toxunulmur */
const COUPLE_STORY = new Set([
  'royal-gold', 'floral-garden', 'modern-black', 'white-elegance', 'night-sky', 'oriental-luxe', 'nature-touch',
  'crystal-glass', 'boarding-pass', 'cinema-premiere', 'vinyl-record', 'royal-palace', 'mediterranean', 'gazette',
  'luxury-jewelry', 'simple-luxury',
])

export function getStoryCopy(templateId, lang = 'az', eventType = null) {
  const own = eventType === 'birthday' && COUPLE_STORY.has(templateId)
    ? { ...(COPY[templateId] || {}), ...BIRTHDAY_BASE, ...(BIRTHDAY_COPY[templateId] || {}) }
    : (COPY[templateId] || {})
  const out = {}
  for (const key of Object.keys(COPY_BASE)) {
    const v = own[key] || COPY_BASE[key]
    out[key] = v[lang] ?? v.az
  }
  return out
}
