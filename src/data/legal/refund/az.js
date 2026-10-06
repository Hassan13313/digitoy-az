/* Ödəniş və geri qaytarma — AZ (hüquqi qüvvədə olan mətn). Format: bax LegalPage.jsx. */
import { LEGAL_CONTACT as C } from '../ui.js'

export default {
  title: 'Ödəniş və Geri Qaytarma Qaydaları',
  intro: [
    'DigiToy hər sifarişçi üçün fərdi hazırlanan rəqəmsal xidmətdir. Ona görə ödəniş yalnız nəticəni görüb təsdiqlədikdən sonra edilir. Bu səhifə ödənişin nə vaxt edildiyini və hansı hallarda pulun qaytarıldığını izah edir.',
  ],
  sections: [
    {
      id: 'odenis',
      title: '1. Ödəniş nə vaxt edilir',
      body: [
        { list: [
          'Sifariş göndərmək pulsuzdur və heç bir öhdəlik yaratmır.',
          'Dəvətnaməni hazırlayırıq və son variantı sizinlə razılaşdırırıq.',
          'Ödəniş yalnız son variantı təsdiqlədikdən sonra edilir — bank kartı və ya elektron ödəniş vasitəsilə.',
          'Ödənişdən sonra dəvətnamə linki sizə təqdim olunur.',
        ] },
        'Ödənişdən əvvəl sifarişdən istənilən vaxt imtina edə bilərsiniz — bu halda heç bir ödəniş tələb olunmur.',
      ],
    },
    {
      id: 'qiymet',
      title: '2. Qiymətlər',
      body: [
        'Paketlərin və əlavə xidmətlərin qiyməti saytın «Paketlər» bölməsində Azərbaycan manatı (AZN) ilə göstərilir. Razılaşdırılmış sifarişin qiyməti sonradan dəyişmir.',
      ],
    },
    {
      id: 'qaytarilmir',
      title: '3. Pulun qaytarılmadığı hallar',
      body: [
        'Ödəniş son variant təsdiqləndikdən sonra edildiyi üçün link təqdim olunduqdan sonra pul qaytarılmır, o cümlədən:',
        { list: [
          'fikrinizi dəyişdikdə və ya dəvətnamədən istifadə etmədikdə;',
          'tədbir ləğv edildikdə və ya təxirə salındıqda;',
          'sifarişçinin təqdim etdiyi məlumatlardakı səhvlərə görə — belə səhvləri isə düzəltməyə hazırıq;',
          'problem bizdən asılı olmayan səbəblərdən (qonağın interneti, cihazı, WhatsApp və s.) yarandıqda.',
        ] },
      ],
    },
    {
      id: 'tam',
      title: '4. Pulun tam qaytarıldığı hal',
      body: [
        'Link təqdim olunduqdan sonra bizim tərəfimizdən yaranan texniki nasazlıq olarsa (məsələn, dəvətnamə açılmır və ya paketə daxil olan əsas funksiya işləmir) və biz onu tədbir tarixini nəzərə alaraq ağlabatan müddətdə düzəldə bilməsək, ödənilmiş məbləğ tam qaytarılır.',
      ],
    },
    {
      id: 'muraciet',
      title: '5. Müraciət qaydası',
      body: [
        { list: [
          `${C.email} ünvanına və ya WhatsApp ilə ${C.phone} nömrəsinə yazın.`,
          'Sifariş kodunu (DT-…) və ya dəvətnamə linkini, problemin qısa təsvirini qeyd edin.',
          'Müraciətə baxıb nəticəni sizə bildiririk. Qaytarma ödənişin edildiyi üsulla həyata keçirilir; vəsaitin hesaba daxil olma müddəti bankın qaydalarından asılıdır.',
        ] },
      ],
    },
    {
      id: 'elaqe',
      title: '6. Əlaqə',
      body: [
        `${C.brand} — e-poçt: ${C.email}, WhatsApp: ${C.phone}.`,
      ],
    },
  ],
}
