/* İstifadə şərtləri / Public oferta — AZ (hüquqi qüvvədə olan mətn). Format: bax LegalPage.jsx. */
import { LEGAL_CONTACT as C } from '../ui.js'

export default {
  title: 'İstifadə Şərtləri və Public Oferta',
  intro: [
    `Bu sənəd ${C.brand} (bundan sonra — «DigiToy», «biz») ilə xidmətdən istifadə edən şəxs arasında münasibətləri tənzimləyir və hər kəsə ünvanlanmış təklifdir (public oferta). Sifarişi göndərməklə bu şərtləri tam qəbul etmiş olursunuz.`,
  ],
  sections: [
    {
      id: 'anlayislar',
      title: '1. Anlayışlar',
      body: [
        { list: [
          'Xidmət — rəqəmsal dəvətnamə veb-səhifəsinin hazırlanması və onun funksiyalarına çıxışın təmin edilməsi.',
          'Sifarişçi — dəvətnamə hazırlatan şəxs.',
          'Qonaq — dəvətnamə linkini açan və onun funksiyalarından istifadə edən şəxs.',
          'Dəvətnamə — sifarişçi üçün hazırlanmış, ayrıca linklə açılan veb-səhifə.',
          'Paket — saytda göstərilən funksiyalar və qiymət toplusu (Sadə, VİP, Premium).',
        ] },
      ],
    },
    {
      id: 'xidmet',
      title: '2. Xidmətin təsviri',
      body: [
        'Paketdən asılı olaraq dəvətnamə açılış animasiyası, geri sayım, məkan və naviqasiya, proqram, geyim qaydası, musiqi, iştirak təsdiqi (RSVP), oturma planı, xatirə kitabı və QR kodla foto paylaşımı funksiyalarını əhatə edə bilər. Hər paketə daxil olan funksiyalar saytın «Paketlər» bölməsində göstərilir.',
      ],
    },
    {
      id: 'sifaris',
      title: '3. Sifariş qaydası',
      body: [
        { list: [
          'Sifarişçi saytdakı konstruktorda məlumatları doldurur və «WhatsApp ilə sifariş et» düyməsi ilə sifarişi göndərir.',
          'Biz məlumatları yoxlayır və dəvətnaməni hazırlayırıq. Hazırlıq adətən 24 saat, VİP və Premium paketlərdə xüsusi dizayn elementləri olduqda 48 saata qədər çəkir.',
          'Son variant sifarişçi ilə razılaşdırılır. Bu mərhələdə sifarişçi düzəlişlər istəyə bilər.',
          'Son variant təsdiqləndikdən və ödəniş edildikdən sonra dəvətnamə linki sifarişçiyə təqdim olunur.',
        ] },
        'Sifarişi göndərmək ödəniş öhdəliyi yaratmır: ödənişdən əvvəl sifarişdən istənilən vaxt imtina edə bilərsiniz.',
      ],
    },
    {
      id: 'qiymet',
      title: '4. Qiymət və ödəniş',
      body: [
        'Qiymətlər saytda Azərbaycan manatı (AZN) ilə göstərilir. Ödəniş son variant təsdiqləndikdən sonra bank kartı və ya elektron ödəniş vasitəsilə edilir. Qiymətlər dəyişə bilər, lakin bu dəyişiklik artıq razılaşdırılmış sifarişə təsir etmir.',
        'Ödəniş və geri qaytarma qaydaları ayrıca «Ödəniş və geri qaytarma» səhifəsində təsvir olunur və bu şərtlərin ayrılmaz hissəsidir.',
      ],
    },
    {
      id: 'muddet',
      title: '5. Dəvətnamənin müddəti',
      body: [
        'Dəvətnamə tədbir gününə qədər tam aktiv qalır. Tədbirdən sonra o silinmir və xatirə olaraq açıq qalır. Xidmətin dayandırılması və ya dəvətnamənin saxlanmasının texniki cəhətdən mümkün olmaması halında sifarişçiyə əvvəlcədən xəbər verilir.',
      ],
    },
    {
      id: 'mezmun',
      title: '6. Sifarişçinin öhdəlikləri',
      body: [
        { list: [
          'təqdim etdiyi məlumatların (adlar, tarix, məkan və s.) düzgünlüyünə cavabdehdir;',
          'dəvətnaməyə əlavə etdiyi digər şəxslərin adlarını, şəkillərini və qonaq siyahısını (telefonlar daxil olmaqla) onların razılığı ilə təqdim edir;',
          'yüklədiyi şəkillərdən və musiqidən istifadə hüququna malikdir;',
          'dəvətnamə linkini yalnız dəvət etdiyi şəxslərlə paylaşır.',
        ] },
      ],
    },
    {
      id: 'qonaqlar',
      title: '7. Qonaqlar üçün qaydalar',
      body: [
        'Qonaq iştirak təsdiqi, xatirə kitabı və foto paylaşımı funksiyalarından istifadə edərkən bilir ki, yazdığı mesaj və yüklədiyi şəkillər dəvətnamə linki olan şəxslərə görünür. Qonaq yalnız özünə məxsus və ya paylaşmağa icazəsi olan şəkilləri yükləməlidir.',
        'Təşkilatçı (sifarişçi) və DigiToy qaydalara uyğun olmayan mesajları və şəkilləri silə bilər.',
      ],
    },
    {
      id: 'qadagan',
      title: '8. Qadağan olunan məzmun',
      body: [
        'Xidmətdə aşağıdakılar qadağandır:',
        { list: [
          'qanunsuz, təhqiramiz, nifrət oyadan və ya ədəbsiz məzmun;',
          'başqalarının şəxsi həyatını, müəllif və ya digər hüquqlarını pozan məzmun;',
          'zərərli fayllar, spam və saytın işinə müdaxilə cəhdləri.',
        ] },
      ],
    },
    {
      id: 'deaktiv',
      title: '9. Deaktivasiya və silmə',
      body: [
        'Bu şərtlər pozulduqda, ödəniş edilmədikdə və ya sifarişçinin istəyi ilə dəvətnamə linki deaktiv edilə bilər. Dəvətnamənin və ona aid bütün məlumatların tam silinməsi sifarişçinin müraciəti ilə həyata keçirilir. Ətraflı: «Məxfilik siyasəti».',
      ],
    },
    {
      id: 'mesuliyyet',
      title: '10. Məsuliyyətin hədləri',
      body: [
        'Xidmətin fasiləsiz işləməsi üçün ağlabatan səy göstəririk, lakin texniki işlər və ya bizdən asılı olmayan səbəblərdən (internet, hostinq, WhatsApp, Google Maps kimi üçüncü tərəf xidmətləri) qısa fasilələr ola bilər. Qanunvericiliyin icazə verdiyi həddə məsuliyyətimiz həmin sifariş üçün ödənilmiş məbləğlə məhdudlaşır.',
        'Sifarişçinin və ya qonaqların təqdim etdiyi məzmuna görə məsuliyyəti onu təqdim edən şəxs daşıyır.',
      ],
    },
    {
      id: 'eqli',
      title: '11. Əqli mülkiyyət',
      body: [
        'Şablonlar, dizayn, animasiyalar və proqram təminatı DigiToy-a məxsusdur və dəvətnamədən kənarda istifadə edilə bilməz. Sifarişçinin mətnləri və şəkilləri ona məxsus qalır; sifarişçi onları dəvətnamədə göstərmək üçün bizə icazə verir. Sifarişçinin razılığı olmadan onun dəvətnaməsini reklamda istifadə etmirik.',
      ],
    },
    {
      id: 'qanun',
      title: '12. Tətbiq olunan qanun və mübahisələr',
      body: [
        'Bu şərtlərə Azərbaycan Respublikasının qanunvericiliyi tətbiq olunur. Mübahisələr ilk növbədə danışıqlar yolu ilə, razılıq əldə olunmadıqda isə qanunvericiliyə uyğun olaraq məhkəmədə həll edilir.',
        'Şərtlər yenilənə bilər; yeni versiya bu səhifədə dərc edildiyi tarixdən qüvvəyə minir və artıq razılaşdırılmış sifarişlərə şamil edilmir.',
      ],
    },
    {
      id: 'elaqe',
      title: '13. Əlaqə',
      body: [
        `${C.brand} — e-poçt: ${C.email}, WhatsApp: ${C.phone}.`,
      ],
    },
  ],
}
