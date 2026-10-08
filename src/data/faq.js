import t from './translations.js'

/* Ana səhifənin FAQ-ı — ilk 3 sual translations.js-dədir (faq_q1..3),
   qalanları burada 3 dildə. Köhnə və yeni landing eyni mənbədən oxuyur. */
export const EXTRA_FAQS = {
  az: [
    { q: 'Hazırlıq müddəti nə qədərdir?', a: 'Sifarişi WhatsApp vasitəsilə yerləşdirdikdən sonra dəvətnaməniz ümumiyyətlə 24 saat ərzində hazır olur. VİP və Premium paketlər üçün xüsusi dizayn elementləri varsa, bu müddət 48 saata çata bilər.' },
    { q: 'Eyni link neçə nəfər tərəfindən açıla bilər?', a: 'Limitsiz. Eyni link istənilən sayda qonağa göndərilə bilər. Hər qonaq öz adını dəvətnamədə ayrıca görür.' },
    { q: 'İştirak Təsdiqi sistemi necə işləyir?', a: 'Qonaqlar "Gələcəm", "Gəlmiyəcəm" və ya "Bəlkə" seçimindən birini edə bilər. Əlavə nəfər sayını da bildirə bilərlər. Siz admin paneldən bütün cavabları real vaxtda izləyə bilərsiniz.' },
    { q: 'Dəvətnamənin məlumatlarını sonra dəyişmək olarmı?', a: 'Bəli. Sifariş etdikdən sonra da admin linkiniz vasitəsilə tarix, yer, dərs kodu, musiqi seçimi və digər məlumatları istənilən vaxt yeniləyə bilərsiniz. Dəvətnamə avtomatik yenilənir.' },
    { q: 'Neçə dil dəstəklənir?', a: 'Dəvətnamə Azərbaycan, İngilis və Rus dillərini tam dəstəkləyir. Qonaqlar səhifə yükləndiyi anda öz dilini seçə bilər. Mətn, tarix formatı və bütün interfeys tam lokalizasiya olunub.' },
    { q: 'Ödəniş necə edilir?', a: 'Sifariş tamamlanıb "WhatsApp ilə sifariş et" düyməsi vasitəsilə bizə göndərildikdən sonra məlumatlar yoxlanılır. Son variant sizinlə təsdiqləndikdən sonra ödəniş edilir. Ödənişi bank kartı və ya elektron ödəniş vasitəsilə həyata keçirmək mümkündür.' },
    { q: 'Dəvətnamə neçə müddət aktiv qalır?', a: 'Dəvətnaməniz toy/nişan gününüz bitənə qədər tam aktiv qalır. Tədbirinizdən sonra saytdan silinmir — yaddaş olaraq qalır. Əlavə müddətə ehtiyac duyulsada, biz onu saxlayırıq.' },
  ],
  en: [
    { q: 'How long does preparation take?', a: 'After placing your WhatsApp order, your invitation is typically ready within 24 hours. VIP and Premium packages with custom design elements may take up to 48 hours.' },
    { q: 'How many people can open the link?', a: 'Unlimited. The same link can be sent to any number of guests. Each guest sees their own name highlighted in the invitation.' },
    { q: 'How does the RSVP system work?', a: 'Guests can select "Going", "Not Going", or "Maybe" and also indicate extra guests. You monitor all responses in real time from the admin panel.' },
    { q: 'Can I update the invitation details after ordering?', a: 'Yes. Via your admin link you can update the date, venue, dress code, music, and more at any time. Changes are reflected instantly.' },
    { q: 'How many languages are supported?', a: 'The invitation fully supports Azerbaijani, English, and Russian. Guests can switch to their preferred language. All text, date formats, and interface elements are localized.' },
    { q: 'How do I pay?', a: 'After your order is submitted via the "Order via WhatsApp" button, we review the details together. Once the final version is confirmed with you, payment is made. You can pay by bank card or electronic payment.' },
    { q: 'How long does the invitation remain active?', a: 'Your invitation stays fully active until your wedding/engagement day. It is not deleted afterward — it stays as a digital memory. If you need extended access, we keep it.' },
  ],
  ru: [
    { q: 'Сколько времени занимает подготовка?', a: 'После оформления заказа через WhatsApp ваше приглашение, как правило, готово в течение 24 часов. Пакеты VIP и Premium могут занять до 48 часов.' },
    { q: 'Сколько людей могут открыть ссылку?', a: 'Без ограничений. Одна и та же ссылка может быть отправлена любому количеству гостей. Каждый гость видит своё имя в приглашении.' },
    { q: 'Как работает подтверждение участия?', a: 'Гости могут выбрать "Приду", "Не приду" или "Возможно" и указать количество дополнительных гостей. Вы отслеживаете ответы в режиме реального времени.' },
    { q: 'Можно ли изменить данные после заказа?', a: 'Да. Через вашу ссылку администратора вы можете обновить дату, место, дресс-код, музыку в любое время. Изменения отображаются мгновенно.' },
    { q: 'Сколько языков поддерживается?', a: 'Приглашение полностью поддерживает азербайджанский, английский и русский языки. Гости могут выбрать предпочитаемый язык.' },
    { q: 'Как произвести оплату?', a: 'После отправки заказа через кнопку «Заказать через WhatsApp» данные проверяются вместе с вами. После подтверждения финального варианта осуществляется оплата. Оплатить можно банковской картой или электронным способом.' },
    { q: 'Как долго приглашение остаётся активным?', a: 'Ваше приглашение остаётся полностью активным до окончания дня торжества. После события оно не удаляется — остаётся как цифровая память.' },
  ],
}

export function getFaqItems(lang = 'az') {
  const tr = t[lang] || t.az
  const base = [
    { q: tr.faq_q1, a: tr.faq_a1 },
    { q: tr.faq_q2, a: tr.faq_a2 },
    { q: tr.faq_q3, a: tr.faq_a3 },
  ]
  return [...base, ...(EXTRA_FAQS[lang] || EXTRA_FAQS.az)]
}
