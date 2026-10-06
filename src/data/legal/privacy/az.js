/* Məxfilik siyasəti — AZ (hüquqi qüvvədə olan mətn). Format: bax LegalPage.jsx.
   ⚠ Saxlama müddətləri retention.js-dən gəlir; əl ilə rəqəm yazma. */
import { LEGAL_CONTACT as C } from '../ui.js'
import { RETENTION as R } from '../retention.js'

export default {
  title: 'Məxfilik Siyasəti',
  intro: [
    `Bu sənəd ${C.brand} (bundan sonra — «DigiToy», «biz») rəqəmsal dəvətnamə xidmətindən istifadə edərkən hansı fərdi məlumatların toplandığını, nə üçün istifadə edildiyini, kimlərlə paylaşıldığını və nə qədər saxlanıldığını izah edir. Siyasət Azərbaycan Respublikasının «Fərdi məlumatlar haqqında» Qanununa əsaslanır.`,
    'Saytdan istifadə etməklə və ya sifariş verməklə bu siyasətlə tanış olduğunuzu təsdiq edirsiniz.',
  ],
  sections: [
    {
      id: 'operator',
      title: '1. Məlumatlara kim cavabdehdir',
      body: [
        `Fərdi məlumatlarınızın emalına ${C.brand} xidməti cavabdehdir. Bizimlə istənilən vaxt əlaqə saxlaya bilərsiniz:`,
        { list: [`E-poçt: ${C.email}`, `WhatsApp: ${C.phone}`] },
      ],
    },
    {
      id: 'toplanan',
      title: '2. Hansı məlumatları toplayırıq',
      body: [
        'Sifarişçidən (dəvətnamə hazırlatan şəxsdən):',
        { list: [
          'konstruktorda daxil etdiyiniz məlumatlar: bəyin, gəlinin, ad günü sahibinin və ya təşkilatçının adı, tədbirin tarixi, saatı, məkanı, proqramı, geyim qaydası;',
          '«Bizim hekayəmiz» bölməsinin mətnləri və şəkilləri, yüklədiyiniz musiqi;',
          'oturma planına yazdığınız qonaq adları və masa nömrələri;',
          'sifarişi WhatsApp ilə göndərdikdə telefon nömrəniz və yazışmamız.',
        ] },
        'Qonaqlardan (dəvətnaməni açan şəxslərdən) — yalnız özləri göndərdikdə:',
        { list: [
          'iştirak təsdiqində (RSVP) yazdığı ad və cavab, əlavə qonaq sayı, qeyd;',
          'xatirə kitabında yazdığı ad və mesaj;',
          'foto paylaşım səhifəsində yüklədiyi şəkil və videolar;',
          'emoji reaksiyalar üçün brauzerdə saxlanan təsadüfi identifikator (adla bağlı deyil).',
        ] },
        'Sifarişçinin istəyi ilə qonaq siyahısı (adlar, telefonlar, qeydlər) bizim tərəfimizdən sistemə əlavə edilə bilər. Belə siyahını təqdim edən sifarişçi bu məlumatları bizə ötürməyə haqqı olduğunu təsdiq edir.',
        'Texniki məlumatlar:',
        { list: [
          'IP ünvanı və brauzer məlumatı — sui-istifadənin qarşısını almaq (sorğu limitləri) və təhlükəsizlik üçün;',
          'qalereya statistikası üçün IP ünvanından alınan qısa, gündəlik dəyişən iz (hash) — IP-nin özü saxlanılmır;',
          'yalnız razılıq verdiyiniz halda — ziyarət statistikası (bax: bölmə 8).',
        ] },
      ],
    },
    {
      id: 'meqsed',
      title: '3. Məlumatlardan nə üçün istifadə edirik',
      body: [
        { list: [
          'dəvətnaməni hazırlamaq, göstərmək və yeniləmək;',
          'sifarişi qəbul etmək, sizinlə əlaqə saxlamaq və son variantı razılaşdırmaq;',
          'iştirak təsdiqi, oturma planı, xatirə kitabı və foto qalereya funksiyalarını işlətmək;',
          'saytın təhlükəsizliyini qorumaq və sui-istifadənin qarşısını almaq;',
          'razılığınız olduqda — saytın necə istifadə edildiyini anlayıb onu yaxşılaşdırmaq;',
          'qanunvericilikdən irəli gələn öhdəlikləri yerinə yetirmək.',
        ] },
        'Məlumatlarınızı satmırıq və reklam məqsədilə başqalarına vermirik.',
      ],
    },
    {
      id: 'esas',
      title: '4. Emalın əsasları',
      body: [
        { list: [
          'Sifarişin icrası — sifarişçinin məlumatları xidməti göstərmək üçün lazımdır.',
          'Razılıq — analitika kukiləri yalnız «Qəbul et» seçildikdən sonra işləyir; qonaq məlumatları qonağın özü tərəfindən könüllü göndərilir.',
          'Qanuni maraq — təhlükəsizlik, sorğu limitləri və texniki jurnallar.',
          'Qanuni tələb — dövlət orqanlarının qanuni sorğuları.',
        ] },
      ],
    },
    {
      id: 'gorunurluk',
      title: '5. Dəvətnamədə kimlər nəyi görür',
      body: [
        'Dəvətnamə linki olan hər kəs onun məzmununu görə bilər. Qonaqlara xidmət göstərmək üçün linki açan şəxs həmçinin bunları görür:',
        { list: [
          'qonaq siyahısındakı ad və masa nömrələrini (masanı tapmaq üçün) — telefon və qeydlər görünmür;',
          'xatirə kitabındakı mesajları və onları yazanların adlarını;',
          'foto paylaşım qalereyasındakı şəkil və videoları (Premium paket).',
        ] },
        'Dəvətnamə səhifələri axtarış sistemlərində göstərilmir (noindex), lakin linkin özü paylaşıla bilər və ünvanında adlar ola bilər. Linki yalnız dəvət etdiyiniz şəxslərlə paylaşmağı tövsiyə edirik.',
        'Dəvətnamə deaktiv edildikdə onun əsas məzmunu göstərilmir. Qonaq siyahısı, mesajlar və şəkillər daxil olmaqla bütün məlumatların tam silinməsi üçün bizə müraciət edin (bölmə 9).',
      ],
    },
    {
      id: 'paylasma',
      title: '6. Məlumatların ötürüldüyü üçüncü tərəflər',
      body: [
        { list: [
          'Hostinq provayderi — sayt və məlumat bazası onun serverlərində saxlanılır.',
          'Google Analytics (Google LLC, ABŞ) — yalnız razılığınızla: ziyarət olunan səhifələr, cihaz və brauzer məlumatı, təxmini yer.',
          'PostHog (PostHog Inc., ABŞ serverləri) — yalnız razılığınızla: səhifə baxışları və əsas addımlar (məsələn, konstruktorun başlanması, sifariş düyməsi). Formaya yazdığınız mətnlər göndərilmir.',
          'Google Fonts (Google) — şriftlər yüklənərkən IP ünvanınız Google-a görünür. Bu, saytın düzgün görünməsi üçündür və razılıqdan asılı deyil.',
          'Google Maps (Google) — konstruktorda məkan axtarışı zamanı yazdığınız sorğu.',
          'WhatsApp (Meta) — sifariş mesajı sizin WhatsApp hesabınızdan göndərilir; mesajdakı məlumatlar (paket, adlar, tarix, məkan) WhatsApp vasitəsilə bizə çatır. WhatsApp-ın öz məxfilik qaydaları tətbiq olunur.',
          'OpenStreetMap — məkan xəritəsinin şəkli üçün serverimiz yalnız koordinatları göndərir; sizin IP ünvanınız ötürülmür.',
          'Dövlət orqanları — yalnız qanunla nəzərdə tutulmuş hallarda.',
        ] },
        'Google və PostHog serverləri Azərbaycandan kənarda (ABŞ-da) yerləşir. Analitikaya razılıq verməklə bu məlumatların həmin ölkəyə ötürülməsinə də razılıq vermiş olursunuz. Razılığı istənilən vaxt geri götürə bilərsiniz.',
      ],
    },
    {
      id: 'saxlama',
      title: '7. Nə qədər saxlayırıq',
      body: [
        { list: [
          'Dəvətnamə və ona aid məlumatlar (qonaq siyahısı, cavablar, mesajlar, şəkillər) tədbirdən sonra da xatirə olaraq saxlanılır və sifarişçinin müraciəti ilə tam silinir.',
          'Sifariş qeydləri xidmətin tarixçəsi kimi saxlanılır və müraciətlə silinə bilər (qanunla saxlanması tələb olunan hallar istisna olmaqla).',
          `Göndərilməmiş (yarımçıq qalmış) konstruktor qaralamaları son dəyişiklikdən ${R.draftDays} gün sonra hekayə şəkilləri və musiqi ilə birlikdə avtomatik silinir.`,
          `İdarəetmə jurnalındakı IP ünvanları ${R.auditIpDays} gündən sonra silinir.`,
          `Qalereya statistikasındakı IP izləri (hash) ${R.galleryIpDays} gündən sonra silinir.`,
          `Sorğu limiti və önbaxış üçün müvəqqəti fayllar ${R.tempHours} saat ərzində silinir.`,
          `Texniki yükləmə jurnalları ${R.mediaLogDays} gün saxlanılır.`,
          'Analitika məlumatları Google Analytics və PostHog-un saxlama ayarlarına uyğun saxlanılır.',
        ] },
      ],
    },
    {
      id: 'kuki',
      title: '8. Kukilər və brauzer yaddaşı',
      body: [
        'Sayt brauzerinizdə kukilər və oxşar yaddaş (localStorage, sessionStorage) istifadə edir.',
        'Zəruri — razılıq tələb etmir, sayt onsuz işləmir:',
        { list: [
          'digitoy_consent — kuki seçiminiz (12 ay);',
          'digitoy_session_id, digitoy_builder_state, digitoy_story_sid — yarımçıq dəvətnamənizi itirməmək üçün;',
          'selected_package — seçdiyiniz paket;',
          'digitoyVisitorId — emoji reaksiyalarının təkrarlanmaması üçün təsadüfi identifikator;',
          'digitoyGalleryKey:*, digitoyUpload:* — cütlüyün qalereya idarəetmə açarı və yarımçıq qalan yükləmənin davam etdirilməsi;',
          'adminToken — yalnız idarəçi üçün.',
        ] },
        'Analitika — yalnız «Qəbul et» seçdikdə:',
        { list: [
          '_ga, _ga_* — Google Analytics (2 ilə qədər);',
          'ph_*_posthog — PostHog (kuki və localStorage, 1 ilə qədər).',
        ] },
        'Seçiminizi istənilən vaxt səhifənin aşağısındakı «Kuki ayarları» ilə dəyişə bilərsiniz. İmtina etdikdə analitika dayanır və onun kukiləri silinir.',
      ],
    },
    {
      id: 'huquqlar',
      title: '9. Hüquqlarınız',
      body: [
        'Siz aşağıdakı hüquqlara maliksiniz:',
        { list: [
          'barənizdə hansı məlumatların saxlandığını öyrənmək;',
          'yanlış məlumatın düzəldilməsini tələb etmək;',
          'məlumatlarınızın silinməsini tələb etmək;',
          'analitikaya verdiyiniz razılığı geri götürmək («Kuki ayarları»);',
          'emala etiraz etmək və səlahiyyətli dövlət orqanına şikayət etmək.',
        ] },
        `Müraciət üçün ${C.email} ünvanına və ya WhatsApp ilə ${C.phone} nömrəsinə yazın. Sifariş kodunu (DT-…) və ya dəvətnamə linkini qeyd etsəniz, sorğunu daha tez icra edərik. Müraciətlərə mümkün qədər tez, qanunla müəyyən edilmiş müddətdən gec olmayaraq cavab veririk.`,
        'Qonaqlar öz mesajının və ya yüklədiyi şəklin silinməsi üçün tədbirin təşkilatçısına və ya birbaşa bizə müraciət edə bilər.',
      ],
    },
    {
      id: 'usaqlar',
      title: '10. Uşaqlar',
      body: [
        'Xidmət yetkin şəxslər üçündür. Uşağın ad günü dəvətnaməsində uşağın adını və şəklini yalnız valideyn və ya qanuni nümayəndə əlavə etməlidir. Qonaqlardan xahiş edirik ki, başqalarının uşaqlarının şəkillərini paylaşarkən valideynlərin razılığını nəzərə alsınlar.',
      ],
    },
    {
      id: 'tehlukesizlik',
      title: '11. Təhlükəsizlik',
      body: [
        { list: [
          'saytla bütün əlaqə şifrələnir (HTTPS);',
          'idarəetmə paneli şifrə ilə qorunur, bütün dağıdıcı əməliyyatlar jurnala yazılır;',
          'formalarda sui-istifadəyə qarşı sorğu limitləri tətbiq olunur;',
          'yüklənən şəkillər yenidən emal olunur və onlardan yer məlumatı (GPS) daxil olmaqla bütün metadata silinir. Videolar olduğu kimi saxlanılır — lazım olmayan yer məlumatı varsa, yükləmədən əvvəl telefonunuzda söndürməyi tövsiyə edirik.',
        ] },
        'İnternetdə heç bir sistem tam təhlükəsiz deyil, lakin məlumatlarınızı qorumaq üçün ağlabatan texniki və təşkilati tədbirlər görürük.',
      ],
    },
    {
      id: 'deyisiklik',
      title: '12. Dəyişikliklər',
      body: [
        'Bu siyasət yenilənə bilər. Yeni versiya bu səhifədə «Son yenilənmə» tarixi ilə dərc olunur.',
      ],
    },
    {
      id: 'elaqe',
      title: '13. Əlaqə',
      body: [
        `Məxfiliklə bağlı sual və müraciətləriniz üçün: ${C.email}, WhatsApp ${C.phone}.`,
      ],
    },
  ],
}
