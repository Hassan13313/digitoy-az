/* ─────────────────────────────────────────────────────────────────────────────
   DƏVƏTNAMƏ BÖLMƏLƏRİ — göstər/gizlət reyestri (Phase 35).

   Cütlük builder-in «Bölmələr» addımında hansı blokların dəvətnamədə
   görünəcəyini seçir. Seçim `weddingData.sections` obyektindədir və
   `invitations.form_data` JSON-unun bir hissəsi kimi saxlanılır —
   ona görə NƏ DB miqrasiyası, NƏ də PHP dəyişikliyi lazım deyil.

   ⚠ GERİYƏ UYĞUNLUQ: açar YOXDURSA və ya `undefined`-dırsa bölmə AÇIQ sayılır.
   Yəni `sections` sahəsi olmayan BÜTÜN köhnə dəvətnamələr olduğu kimi qalır —
   yalnız açıq-aşkar `false` yazılmış bölmə gizlənir.

   ⚠ Paket kilidləri ÜSTÜNDÜR: SADE-də RSVP/oturma/qalereya onsuz da bağlıdır.
   Switch onu AÇA BİLMƏZ — `getSectionVisibility` iki şərti AND ilə birləşdirir.

   Hero (adlar + tarix) və outro/footer siyahıda yoxdur: onlar dəvətnamənin
   skeletidir, söndürülə bilməz.
   ───────────────────────────────────────────────────────────────────────── */
import { getPackageGates } from './packages'

/* Dəvətnamədəki görünmə sırası ilə eyni sıradadır — builder-dəki siyahı
   istifadəçiyə səhifənin özünü xatırlatsın deyə. */
export const SECTION_DEFS = [
  {
    id: 'countdown',
    gate: null,
    labels: { az: 'Geri Sayım',        en: 'Countdown',      ru: 'Обратный отсчёт' },
    hints:  { az: 'Tədbirə qalan vaxt saatı.', en: 'Live timer until the event.', ru: 'Таймер до мероприятия.' },
  },
  {
    id: 'venue',
    gate: null,
    labels: { az: 'Məkan və Xəritə',   en: 'Venue & Map',    ru: 'Место и карта' },
    hints:  { az: 'Ünvan, məkan qeydi və naviqasiya düymələri.', en: 'Address, venue note and navigation buttons.', ru: 'Адрес, заметка о месте и навигация.' },
  },
  {
    id: 'program',
    gate: null,
    labels: { az: 'Tədbir Proqramı',   en: 'Event Program',  ru: 'Программа' },
    hints:  { az: 'Günün saat-saat cədvəli.', en: 'Hour-by-hour schedule of the day.', ru: 'Расписание дня по часам.' },
  },
  {
    id: 'dresscode',
    gate: null,
    labels: { az: 'Geyim Tərzi',       en: 'Dress Code',     ru: 'Дресс-код' },
    hints:  { az: 'Qonaqlara geyim tövsiyəsi.', en: 'Dress recommendation for guests.', ru: 'Рекомендация по одежде для гостей.' },
  },
  {
    id: 'seating',
    gate: 'allowSeating',
    labels: { az: 'Oturma Planı',      en: 'Seating Plan',   ru: 'План рассадки' },
    hints:  { az: 'Qonaq öz masasını axtarışla tapır.', en: 'Guests search for their own table.', ru: 'Гость находит свой стол поиском.' },
  },
  {
    id: 'gallery',
    gate: 'allowGallery',
    labels: { az: 'Foto Paylaşım',     en: 'Photo Sharing',  ru: 'Обмен фото' },
    hints:  { az: 'QR ilə qonaq şəkilləri və qalereya.', en: 'QR guest photo upload and gallery.', ru: 'QR-загрузка фото гостей и галерея.' },
  },
  {
    id: 'rsvp',
    gate: 'allowRsvp',
    labels: { az: 'İştirak Təsdiqi',   en: 'RSVP',           ru: 'Подтверждение (RSVP)' },
    hints:  { az: 'Qonaq gəlib-gəlməyəcəyini bildirir.', en: 'Guests confirm their attendance.', ru: 'Гости подтверждают участие.' },
  },
  {
    id: 'guestbook',
    gate: null,
    labels: { az: 'Qonaq Dəftəri',     en: 'Guestbook',      ru: 'Книга пожеланий' },
    hints:  { az: 'Qonaqlar arzu və təbrik yazır.', en: 'Guests leave wishes and messages.', ru: 'Гости оставляют пожелания.' },
  },
  {
    id: 'music',
    gate: null,
    labels: { az: 'Fon Musiqisi',      en: 'Background Music', ru: 'Фоновая музыка' },
    hints:  { az: 'Dəvətnamə açılanda çalan melodiya.', en: 'The melody that plays when the invitation opens.', ru: 'Мелодия при открытии приглашения.' },
  },
]

export const SECTION_IDS = SECTION_DEFS.map((s) => s.id)

/** Bölmə istifadəçi tərəfindən söndürülübmü? (paket kilidini NƏZƏRƏ ALMIR) */
export function isSectionOn(weddingData, id) {
  return weddingData?.sections?.[id] !== false
}

/* ── Bölmə görünürlüyü: istifadəçi seçimi AND paket icazəsi ──
   Şablonların hamısı yalnız bu funksiyanı çağırır; `getPackageGates`
   birbaşa çağırılmır ki, iki qaydanın birləşdiyi yer TƏK olsun. */
export function getSectionVisibility(weddingData, pkgId) {
  const gates = getPackageGates(pkgId)
  const out = {}
  for (const def of SECTION_DEFS) {
    const allowedByPkg = def.gate ? !!gates[def.gate] : true
    out[def.id] = allowedByPkg && isSectionOn(weddingData, def.id)
  }
  return out
}

/** Builder siyahısı — paketdə bağlı olan bölmələr `locked: true` ilə gəlir. */
export function listBuilderSections(pkgId) {
  const gates = getPackageGates(pkgId)
  return SECTION_DEFS.map((def) => ({
    ...def,
    locked: def.gate ? !gates[def.gate] : false,
  }))
}
