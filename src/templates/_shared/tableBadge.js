/* ─────────────────────────────────────────────────────────────────────────────
   MASA NİŞANI (2026-10-28)

   Masa adı müştərinin oturma planında yazdığı SƏRBƏST mətndir: «Masa 4»,
   «Table 12», «VIP», «Bəy tərəfi 3». Premium dizaynlar onu böyük nişanda
   (ulduz, bilet, kart) 44–68px ilə yazırdı — «Masa 4» Oriental Luxe-un
   168px-lik ulduzundan çıxırdı, üstündə «Masa» sözü olan şablonlarda isə
   «MASA / Masa 4» təkrarı yaranırdı.
   Burada: «Masa/Table/Стол + qısa kod» → böyük nişanda YALNIZ kod, söz isə
   şablonun öz (tərcümə olunan) yazısıdır; sərbəst uzun ad → şrift kiçilir.
   ⚠ React YOXDUR — node testləri birbaşa yükləyir.
   ───────────────────────────────────────────────────────────────────────── */

/* Söz yalnız ayrıca gələndə atılır: «Masa 4», «masa12» — amma «Masalar» yox */
const PREFIX = /^(?:masa|table|стол|stol)(?=[\s\d№#:.-])\s*(?:№|no\.?|#)?\s*[:.-]?\s*/i

/**
 * @returns {{ num: string, full: string, hasWord: boolean }}
 *   num     — böyük nişanda göstəriləcək hissə
 *   hasWord — «Masa» sözü atılıb (şablon öz sözünü yazmalıdır)
 */
export function tableParts(raw) {
  const full = String(raw ?? '').trim()
  const rest = full.replace(PREFIX, '').trim()
  if (rest && rest !== full && Array.from(rest).length <= 4) return { num: rest, full, hasWord: true }
  return { num: full, full, hasWord: false }
}

/** Böyük nişanın şrift ölçüsü (px): ≤3 simvol tam ölçü, uzun mətn mütənasib kiçilir */
export function tableFontPx(text, base, min = 16) {
  const n = Array.from(String(text ?? '')).length
  return n <= 3 ? base : Math.max(min, Math.round((base * 3.2) / n))
}
