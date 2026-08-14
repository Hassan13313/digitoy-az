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
