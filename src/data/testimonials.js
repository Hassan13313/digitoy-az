/* Müştəri rəyləri — 3 dildə (köhnə və yeni landing eyni mənbədən oxuyur).
   role formatı: «<hadisə> — <şəhər>, <il>». */
export const TESTIMONIALS = {
  az: [
    { name: 'Aytən & Rauf', role: 'Toy — Bakı, 2026', text: 'Dəvətnamənin açılışındakı zərf animasiyası qonaqlarımızı heyran etdi. Hamı soruşdu necə etdik!', avatar: 'A' },
    { name: 'Günel & Elçin', role: 'Nişan — Sumqayıt, 2026', text: 'Geri sayım, proqram, oturma düzümü — hamısı bir yerdə. Qonaqlar çox rahat tapdılar. Tövsiyyə edirəm.', avatar: 'G' },
    { name: 'Lətifə & Nicat', role: 'Toy — Gəncə, 2024', text: 'VİP paket tam dəyərdi. Foto qalereyası, musiqi, QR kod — professional görünüş yaratdı.', avatar: 'L' },
    { name: 'Sevinc & Tural', role: 'Toy — Bakı, 2026', text: 'WhatsApp-a link göndərmək çox asan oldu. Planlaşdırma prosesini çox rahatlaşdırdı.', avatar: 'S' },
    { name: 'Rəna & Əli', role: 'Nişan — Bakı, 2026', text: '3 dildə hazırlamaq imkanı əla idi, xarici qonaqlarımız üçün çox əlverişli oldu.', avatar: 'R' },
  ],
  en: [
    { name: 'Ayten & Rauf', role: 'Wedding — Baku, 2026', text: 'The envelope opening animation amazed our guests. Everyone asked how we did it!', avatar: 'A' },
    { name: 'Gunel & Elchin', role: 'Engagement — Sumgait, 2026', text: 'Countdown, program, seating chart — all in one place. Guests found it very easy to use.', avatar: 'G' },
    { name: 'Latifa & Nijat', role: 'Wedding — Ganja, 2024', text: 'VIP package was totally worth it. Photo gallery, music, QR code — created a professional look.', avatar: 'L' },
    { name: 'Sevinj & Tural', role: 'Wedding — Baku, 2026', text: 'Sending a link via WhatsApp was very easy. Made the whole planning process much smoother.', avatar: 'S' },
    { name: 'Rena & Ali', role: 'Engagement — Baku, 2026', text: 'The ability to prepare in 3 languages was great, very convenient for our foreign guests.', avatar: 'R' },
  ],
  ru: [
    { name: 'Айтен & Рауф', role: 'Свадьба — Баку, 2026', text: 'Анимация открытия конверта восхитила наших гостей. Все спрашивали, как мы это сделали!', avatar: 'A' },
    { name: 'Гюнель & Эльчин', role: 'Помолвка — Сумгайыт, 2026', text: 'Обратный отсчёт, программа, план рассадки — всё в одном месте. Очень удобно для гостей.', avatar: 'G' },
    { name: 'Латифа & Ниджат', role: 'Свадьба — Гянджа, 2024', text: 'Пакет VIP стоит своих денег. Галерея, музыка, QR-код — профессиональный вид.', avatar: 'L' },
    { name: 'Севиндж & Турал', role: 'Свадьба — Баку, 2026', text: 'Отправить ссылку через WhatsApp очень легко. Процесс планирования стал намного проще.', avatar: 'S' },
    { name: 'Рена & Али', role: 'Помолвка — Баку, 2026', text: 'Возможность подготовить на 3 языках была отличной, очень удобно для иностранных гостей.', avatar: 'R' },
  ],
}

/* Yeni Testimonials komponentinin formatı: { quote, names, event, city, year, rating } */
export function getReviews(lang = 'az') {
  const list = TESTIMONIALS[lang] || TESTIMONIALS.az
  return list.map((r) => {
    const m = /^(.*?)\s+—\s+(.*?),\s*(\d{4})$/.exec(r.role || '')
    return {
      quote: r.text,
      names: r.name,
      event: m ? m[1] : r.role,
      city: m ? m[2] : undefined,
      year: m ? Number(m[3]) : undefined,
      rating: 5,
    }
  })
}
