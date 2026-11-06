/* 2026-11 — albomun saxlanma cədvəlinin mətni (məxfilik siyasəti §7).
   gallery_meta.php › album: { keepUntil, deleteAt, closed, forever } */
import { formatAzDate } from './dateFormat'

const azDay = (ymd) => (ymd ? formatAzDate(ymd, 'az').formattedDate : '')

/** Albomun saxlanma cədvəlinin mətni (məxfilik siyasəti §7). Yoxdursa null. */
export function albumKeepText(album) {
  if (!album) return null
  if (album.closed) return 'Albomun saxlanma müddəti bitib — şəkil və videolar silinib.'
  if (album.forever) return 'Albom müddətsiz saxlanılır.'
  if (album.deleteAt) return `Albom ${azDay(album.deleteAt)} tarixində silinəcək. Şəkil və videoları ondan əvvəl endirin.`
  if (album.keepUntil) return `Albom ${azDay(album.keepUntil)} tarixinədək saxlanılır. Şəkil və videoları vaxtında endirin və ya saxlanma müddətini uzatmaq üçün bizə yazın.`
  return null
}
