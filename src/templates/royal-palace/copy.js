/* royal-palace — şablonun öz mətnləri (bax _shared/copyText.js).
   LABELS — bölmə başlıqları (admin «Mətnlər › Başlıq» boşdursa bunlar görünür).
   TXT    — dizayna məxsus sətirlər; FIELDS — admin formunda sıra, bölmə və ad.
   ⚠ React YOXDUR: admin paneli və node testləri bu faylı birbaşa yükləyir. */

export const LABELS = {
  countdown: { title: { az: 'Mərasimə qədər', en: 'Until the ceremony', ru: 'До церемонии' } },
  venue:     { title: { az: 'Saray', en: 'The palace', ru: 'Дворец' } },
  program:   { title: { az: 'Mərasim protokolu', en: 'Order of ceremony', ru: 'Протокол церемонии' } },
  dresscode: { title: { az: 'Saray etiketi', en: 'Court etiquette', ru: 'Дворцовый этикет' } },
  seating:   { title: { az: 'Ziyafət masanız', en: 'Your banquet table', ru: 'Ваш стол на банкете' } },
  gallery:   { title: { az: 'Portret qalereyası', en: 'Portrait gallery', ru: 'Портретная галерея' } },
  rsvp:      { title: { az: 'Cavabınızı gözləyirik', en: 'Your reply, please', ru: 'Ждём вашего ответа' } },
  guestbook: { title: { az: 'Saray dəftəri', en: 'The court register', ru: 'Дворцовая книга' } },
}

export const TXT = {
  az: {
    brand: 'Digitoy',
    honour: 'sizi şərəfli qonağımız olmağa dəvət edir',
    table: 'Masa',
  },
  en: {
    brand: 'Digitoy',
    honour: 'request the honour of your presence',
    table: 'Table',
  },
  ru: {
    brand: 'Digitoy',
    honour: 'имеют честь пригласить вас',
    table: 'Стол',
  },
}

/* [açar, admin bölməsi, sahənin adı, izah?] */
export const FIELDS = [
  ['brand', 'hero', 'Yuxarı panel — brend yazısı'],
  ['honour', 'hero', 'Dəvət cümləsi (adların altında)'],
  ['table', 'seating', 'Masa nömrəsinin yazısı'],
]
