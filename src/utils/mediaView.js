/* Albom mediasının BAXIŞ ünvanı (2026-11-18): şəklin ≤1600px nüsxəsi (displayUrl),
   videonun VPS-də çevrilmiş H.264 nüsxəsi (webUrl); yoxdursa orijinal (url).
   Endirmə / ZIP həmişə orijinalı işlədir. */
export function mediaViewSrc(item) {
  if (!item) return ''
  const video = item.type?.startsWith?.('video/')
  return (video ? item.webUrl : item.displayUrl) || item.url
}
