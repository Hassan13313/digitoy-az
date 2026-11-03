/* ─────────────────────────────────────────────────────────────────────────────
   Şablonların ortaq son hissəsinin mətnləri — admin «Mətnlər › Alt hissə»
   placeholder-ları da buradan oxuyur (komponentləri yükləmədən).
   ───────────────────────────────────────────────────────────────────────── */

/* Nümunənin sonu — yalnız vitrində görünür (admin açarı `cta.<açar>`) */
export const OUTRO_CTA = {
  az: {
    badge: 'Öz dəvətnamənizi hazırlayın',
    title: 'Sizə xüsusi hazırlansın',
    desc:  'Bu nümunəni bəyəndinizsə, paketinizi seçib öz dəvətnamənizi dəqiqələr ərzində hazırlaya bilərsiniz.',
    btn:   'Paketlərə keç',
  },
  en: {
    badge: 'Create your invitation',
    title: 'Make it yours',
    desc:  'If you liked this example, choose your package and create your invitation in minutes.',
    btn:   'Choose Package',
  },
  ru: {
    badge: 'Создайте своё приглашение',
    title: 'Сделайте своё',
    desc:  'Если вам понравился этот пример, выберите пакет и создайте своё приглашение за несколько минут.',
    btn:   'Выбрать пакет',
  },
}

/* Sifariş kartı və musiqi balonu (admin açarı `ui.<açar>`) */
export const ACTIONS_UI = {
  az: {
    orderKicker: 'Digitoy.az · Premium',
    orderTitle:  'Dəvətnaməniz Hazırdır!',
    orderText:   'Dizaynı tamamladınız. İndi tək bir toxunuşla dəvətnamənizi sifariş verib canlıya ala bilərsiniz.',
    orderBtn:    'Dəvətnaməni sifariş et',
    orderNote:   'WhatsApp vasitəsilə birbaşa əlaqə',
    music:       'Musiqini Başlat',
    musicAria:   'Musiqini başlat',
  },
  en: {
    orderKicker: 'Digitoy.az · Premium',
    orderTitle:  'Your Invitation Is Ready!',
    orderText:   'The design is complete. One tap and your invitation goes live.',
    orderBtn:    'Order your invitation',
    orderNote:   'Direct contact via WhatsApp',
    music:       'Play music',
    musicAria:   'Play music',
  },
  ru: {
    orderKicker: 'Digitoy.az · Premium',
    orderTitle:  'Ваше приглашение готово!',
    orderText:   'Дизайн завершён. Одно нажатие — и приглашение станет активным.',
    orderBtn:    'Заказать приглашение',
    orderNote:   'Прямая связь через WhatsApp',
    music:       'Включить музыку',
    musicAria:   'Включить музыку',
  },
}
