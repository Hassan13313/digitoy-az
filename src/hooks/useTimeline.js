/* ─────────────────────────────────────────────────────────────────────────────
   useTimeline — tədbir proqramı məntiqi (UI-sız).

   EventTimeline.jsx-dən çıxarılıb: standart proqram şablonları + istifadəçinin
   builder-də qurduğu `programSteps` birləşdirilir və dilə uyğun etiket verilir.
   ───────────────────────────────────────────────────────────────────────── */

export const PROGRAMS = {
  toy: [
    { time: '18:00', icon: '🥂', az: 'Qonaqların Qarşılanması', en: 'Guest Reception', ru: 'Приём гостей' },
    { time: '19:00', icon: '💍', az: 'Nikah Mərasimi', en: 'Wedding Ceremony', ru: 'Свадебная церемония' },
    { time: '20:00', icon: '🎵', az: 'Ziyafətin Başlanması', en: 'Dinner Begins', ru: 'Начало банкета' },
    { time: '22:00', icon: '💃', az: 'Rəqs Proqramı', en: 'Dance Program', ru: 'Танцевальная программа' },
    { time: '23:30', icon: '🎂', az: 'Tortun Kəsilməsi', en: 'Cake Cutting', ru: 'Разрезание торта' },
  ],
  nishan: [
    { time: '18:00', icon: '🥂', az: 'Qonaqların Qarşılanması', en: 'Guest Reception', ru: 'Приём гостей' },
    { time: '19:00', icon: '💍', az: 'Nişan Mərasimi', en: 'Engagement Ceremony', ru: 'Церемония помолвки' },
    { time: '20:00', icon: '🎵', az: 'Ziyafət', en: 'Dinner', ru: 'Банкет' },
    { time: '22:00', icon: '🎂', az: 'Tort Kəsilməsi', en: 'Cake Cutting', ru: 'Разрезание торта' },
  ],
  birthday: [
    { time: '18:00', icon: '🎈', az: 'Qonaqların Qarşılanması', en: 'Guest Arrival', ru: 'Приём гостей' },
    { time: '19:00', icon: '🎁', az: 'Hədiyyə Təqdimatı', en: 'Gift Presentation', ru: 'Вручение подарков' },
    { time: '20:00', icon: '🎂', az: 'Tortun Kəsilməsi', en: 'Cake Cutting', ru: 'Разрезание торта' },
    { time: '21:00', icon: '🎵', az: 'Əyləncə Proqramı', en: 'Entertainment', ru: 'Развлечения' },
  ],
  /* 2026-10 — konsept tədbir növləri */
  xina: [
    { time: '18:00', icon: '🕯️', az: 'Qonaqların Qarşılanması', en: 'Guest Reception', ru: 'Приём гостей' },
    { time: '19:00', icon: '👰', az: 'Gəlinin Gəlişi', en: 'Arrival of the Bride', ru: 'Появление невесты' },
    { time: '19:30', icon: '🌿', az: 'Xına Mərasimi', en: 'Henna Ceremony', ru: 'Церемония хны' },
    { time: '20:30', icon: '🍽️', az: 'Şam Yeməyi', en: 'Dinner', ru: 'Ужин' },
    { time: '21:30', icon: '💃', az: 'Rəqs və Musiqi', en: 'Dance & Music', ru: 'Танцы и музыка' },
  ],
  sunnet: [
    { time: '16:00', icon: '🎈', az: 'Qonaqların Qarşılanması', en: 'Guest Reception', ru: 'Приём гостей' },
    { time: '17:00', icon: '👑', az: 'Kiçik Bəyin Girişi', en: 'The Little Prince Arrives', ru: 'Выход маленького принца' },
    { time: '18:00', icon: '🍽️', az: 'Ziyafət', en: 'Feast', ru: 'Банкет' },
    { time: '19:00', icon: '🎵', az: 'Əyləncə Proqramı', en: 'Entertainment', ru: 'Развлечения' },
    { time: '20:00', icon: '🎂', az: 'Tortun Kəsilməsi', en: 'Cake Cutting', ru: 'Разрезание торта' },
  ],
  baby: [
    { time: '15:00', icon: '🎀', az: 'Qonaqların Gəlişi', en: 'Guest Arrival', ru: 'Прибытие гостей' },
    { time: '15:30', icon: '🧸', az: 'Oyunlar', en: 'Games', ru: 'Игры' },
    { time: '16:30', icon: '🎁', az: 'Hədiyyələr', en: 'Gifts', ru: 'Подарки' },
    { time: '17:00', icon: '🎂', az: 'Tort və Sürpriz', en: 'Cake & Surprise', ru: 'Торт и сюрприз' },
  ],
  anniversary: [
    { time: '19:00', icon: '🥂', az: 'Qonaqların Qarşılanması', en: 'Guest Reception', ru: 'Приём гостей' },
    { time: '19:30', icon: '📷', az: 'Xatirə Anları', en: 'Memories', ru: 'Воспоминания' },
    { time: '20:00', icon: '🍽️', az: 'Ziyafət', en: 'Dinner', ru: 'Ужин' },
    { time: '21:00', icon: '💃', az: 'Yenidən İlk Rəqs', en: 'The First Dance, Again', ru: 'Снова первый танец' },
    { time: '22:00', icon: '🎂', az: 'Tortun Kəsilməsi', en: 'Cake Cutting', ru: 'Разрезание торта' },
  ],
  graduation: [
    { time: '18:00', icon: '🎓', az: 'Qarşılanma', en: 'Welcome', ru: 'Встреча' },
    { time: '18:30', icon: '📜', az: 'Diplomların Təqdimatı', en: 'Diploma Ceremony', ru: 'Вручение дипломов' },
    { time: '19:30', icon: '🍽️', az: 'Ziyafət', en: 'Dinner', ru: 'Ужин' },
    { time: '21:00', icon: '💃', az: 'Məzun Valsı', en: 'Graduation Waltz', ru: 'Выпускной вальс' },
    { time: '22:00', icon: '🎵', az: 'Diskoteka', en: 'Disco', ru: 'Дискотека' },
  ],
  bachelorette: [
    { time: '19:00', icon: '🥂', az: 'Görüş', en: 'Meet-up', ru: 'Встреча' },
    { time: '19:30', icon: '🍽️', az: 'Şam Yeməyi', en: 'Dinner', ru: 'Ужин' },
    { time: '21:00', icon: '🎁', az: 'Oyunlar və Sürprizlər', en: 'Games & Surprises', ru: 'Игры и сюрпризы' },
    { time: '22:00', icon: '💃', az: 'Rəqs Gecəsi', en: 'Dance Night', ru: 'Танцевальная ночь' },
  ],
  /* «Digər» əvvəl toy proqramına düşürdü («Nikah Mərasimi») — indi ümumi */
  other: [
    { time: '18:00', icon: '🥂', az: 'Qonaqların Qarşılanması', en: 'Guest Reception', ru: 'Приём гостей' },
    { time: '19:00', icon: '🎤', az: 'Açılış', en: 'Opening', ru: 'Открытие' },
    { time: '20:00', icon: '🍽️', az: 'Ziyafət', en: 'Dinner', ru: 'Ужин' },
    { time: '21:00', icon: '🎵', az: 'Əyləncə Proqramı', en: 'Entertainment', ru: 'Развлечения' },
  ],
  corporate: [
    { time: '18:00', icon: '🤝', az: 'Qeydiyyat', en: 'Registration', ru: 'Регистрация' },
    { time: '19:00', icon: '🎤', az: 'Açılış Nitqi', en: 'Opening Speech', ru: 'Открытие' },
    { time: '20:00', icon: '🍽️', az: 'Ziyafət', en: 'Dinner', ru: 'Ужин' },
    { time: '22:00', icon: '🎵', az: 'Proqram', en: 'Program', ru: 'Программа' },
  ],
}

export const TIMELINE_SECTION_LABELS = { az: 'Proqram', en: 'Program', ru: 'Программа' }

/**
 * @returns {{ events: Array<{time,icon,label,...}>, sectionLabel: string }}
 *   events — həm dilə uyğun `label`, həm də orijinal az/en/ru sahələri saxlanılır
 *   (mövcud komponentlərin `event[lang] || event.az` davranışı ilə eynidir)
 */
export function useTimeline({ lang = 'az', eventType, programSteps }) {
  const defaultEvents = PROGRAMS[eventType] || PROGRAMS.toy

  const source = (programSteps && programSteps.length > 0)
    ? programSteps
        .filter((r) => r.time || r.activity)
        .map((r) => ({ time: r.time, icon: r.icon || '✦', az: r.activity, en: r.activity, ru: r.activity }))
    : defaultEvents

  const events = source.map((e) => ({ ...e, label: e[lang] || e.az }))

  return {
    events,
    sectionLabel: TIMELINE_SECTION_LABELS[lang] || TIMELINE_SECTION_LABELS.az,
  }
}

export default useTimeline
