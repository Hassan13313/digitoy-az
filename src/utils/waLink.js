/* ─────────────────────────────────────────────────────────────────────────────
   WhatsApp «click to chat» linki (Phase 45.3).

   ⚠ `wa.me/<nömrə>?text=…` İŞLƏNMİR: WhatsApp-ın wa.me → api.whatsapp.com/send/
   yönləndirməsi 4 baytlıq emojiləri (💍 📦 🎉) «�» (U+FFFD) ilə əvəz edir —
   sifariş mesajı müştəridə və adminin WhatsApp-ında sınıq görünürdü.
   `api.whatsapp.com/send` birbaşa açılanda yönləndirmə yoxdur, mətn olduğu
   kimi qalır; mobil cihazda da tətbiqi açır.
   ───────────────────────────────────────────────────────────────────────── */

/** @param {string} number    beynəlxalq formatda nömrə (+, boşluq atılır)
 *  @param {string} [encodedText] artıq encodeURIComponent olunmuş mətn */
export function waChatUrl(number, encodedText = '') {
  const phone = String(number).replace(/\D/g, '')
  return `https://api.whatsapp.com/send?phone=${phone}${encodedText ? `&text=${encodedText}` : ''}`
}
