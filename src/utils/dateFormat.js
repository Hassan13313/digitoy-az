const AZ_DAYS = ['Bazar', 'Bazar ertəsi', 'Çərşənbə axşamı', 'Çərşənbə', 'Cümə axşamı', 'Cümə', 'Şənbə']
const EN_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const RU_DAYS = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']

const AZ_MONTHS = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
  'İyul', 'Avqust', 'Sentyabr', 'Oktabr', 'Noyabr', 'Dekabr',
]

const DAY_NAMES = { az: AZ_DAYS, en: EN_DAYS, ru: RU_DAYS }

/**
 * Returns { formattedDate, dayName } — numeric format.
 * az → GG.AA.YYYY  |  en → MM/DD/YYYY  |  ru → DD.MM.YYYY
 */
export function formatAzDate(dateString, lang = 'az') {
  if (!dateString) return { formattedDate: '—', dayName: '' }
  const date = new Date(dateString + 'T00:00:00')
  if (isNaN(date.getTime())) return { formattedDate: dateString, dayName: '' }

  const days = DAY_NAMES[lang] || AZ_DAYS
  const dayName = days[date.getDay()]

  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = date.getFullYear()

  const formattedDate = lang === 'en' ? `${mm}/${dd}/${yyyy}` : `${dd}.${mm}.${yyyy}`

  return { formattedDate, dayName }
}

const DATE_DICT = {
  az: {
    months: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktabr', 'Noyabr', 'Dekabr'],
    days: ['Bazar', 'Bazar ertəsi', 'Çərşənbə axşamı', 'Çərşənbə', 'Cümə axşamı', 'Cümə', 'Şənbə'],
  },
  ru: {
    months: ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'],
    days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
  },
  en: {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  },
}

/**
 * Returns full localised text date.
 * az → "01 Yanvar 2026, Bazar ertəsi"
 * ru → "01 Января 2026, Понедельник"
 * en → "Monday, January 01, 2026"
 */
export function formatFullDateByLang(dateString, lang = 'az') {
  if (!dateString) return ''
  const date = new Date(dateString + 'T00:00:00')
  if (isNaN(date.getTime())) return dateString

  const dict = DATE_DICT[lang] || DATE_DICT.az
  const dd = String(date.getDate()).padStart(2, '0')
  const monthName = dict.months[date.getMonth()]
  const yyyy = date.getFullYear()
  const dayName = dict.days[date.getDay()]

  if (lang === 'en') return `${dayName}, ${monthName} ${dd}, ${yyyy}`
  if (lang === 'ru') return `${dd} ${monthName} ${yyyy}, ${dayName}`
  return `${dd} ${monthName} ${yyyy}, ${dayName}`
}

/** @deprecated Use formatFullDateByLang instead */
export function formatAzFullDate(dateString, lang = 'az') {
  return formatFullDateByLang(dateString, lang)
}

/**
 * Ensures time is always displayed in 24-hour HH:MM format.
 * Converts "7:30 PM" → "19:30"; already-24h strings pass through unchanged.
 */
export function formatTime24(timeString) {
  if (!timeString) return '—'
  const ampm = timeString.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!ampm) return timeString
  let hours = parseInt(ampm[1], 10)
  const minutes = ampm[2]
  const period = ampm[3].toUpperCase()
  if (period === 'AM' && hours === 12) hours = 0
  if (period === 'PM' && hours !== 12) hours += 12
  return `${String(hours).padStart(2, '0')}:${minutes}`
}
