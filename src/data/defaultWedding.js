export const defaultWedding = {
  eventType: 'toy',
  eventName: '',
  organizer: '',
  brideName: '',
  groomName: '',
  date: new Date().toISOString().split('T')[0],
  time: '18:00',
  venueName: '',
  /* Məkanın daxili detalı (zal, mərtəbə və s.) — MƏCBURİ DEYİL.
     Boş olanda dəvətnamədə heç nə göstərilmir (boş sətir yaranmır). */
  venueNote: '',
  googleMapsUrl: '',
  wazeUrl: '',
  dressCodePalette: 'pastel',
  /* Geyim tərzi kartlarının fərdi adları: { [paletteId]: 'Black Tie' }.
     Boş/olmayan açar → data/dressCode.js-dəki standart ad işlədilir
     (köhnə sifarişlər buna görə qırılmır). */
  dressCodeLabels: {},
  /* İkonların altındakı kişi/qadın mətnləri: { [paletteId]: { male, female } }.
     Boş sahə → data/dressCode.js-dəki standart mətn (köhnə sifarişlər üçün). */
  dressCodeGenders: {},
  dressCodeDescription: '',
  seatingPlan: '',
  seatingMethod: null,
  galleryLink: '',
  programSteps: [],
  /* Phase 25.3 — musiqi seçimi (bax: src/data/music.js). null = standart melodiya */
  music: null,
  package: 'SADE',

  /* Phase 4 — seçilmiş dizayn şablonu. Boş/naməlum dəyər avtomatik
     `simple-luxury`-yə düşür (bax: templates/templateConfig.resolveTemplateId) */
  templateId: '',
}
