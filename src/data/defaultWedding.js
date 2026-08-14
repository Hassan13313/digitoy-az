export const defaultWedding = {
  eventType: 'toy',
  eventName: '',
  organizer: '',
  brideName: '',
  groomName: '',
  date: new Date().toISOString().split('T')[0],
  time: '18:00',
  venueName: '',
  googleMapsUrl: '',
  wazeUrl: '',
  dressCodePalette: 'pastel',
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
