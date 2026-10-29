/* GALA NIGHT — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  BLACK: '#0B0A09', ONYX: '#151311', ONYX_L: '#1E1B18', GOLD: '#D4AF61', GOLD_L: '#F1DCA4', GOLD_D: '#9C7C34',
  CHAMPAGNE: '#F3E2B3', IVORY: '#F5EFE3', MUTED: '#A99F8E', FAINT: '#6E665A',
}

export const GOLD_GRAD = (C) => (`linear-gradient(160deg, ${C.GOLD_D} 0%, ${C.GOLD_L} 42%, ${C.GOLD} 60%, #8A6A28 100%)`)

/* Art-deco pilləli künclər */
export const DECO = 'polygon(14px 0, calc(100% - 14px) 0, calc(100% - 14px) 6px, calc(100% - 6px) 6px, calc(100% - 6px) 14px, 100% 14px, 100% calc(100% - 14px), calc(100% - 6px) calc(100% - 14px), calc(100% - 6px) calc(100% - 6px), calc(100% - 14px) calc(100% - 6px), calc(100% - 14px) 100%, 14px 100%, 14px calc(100% - 6px), 6px calc(100% - 6px), 6px calc(100% - 14px), 0 calc(100% - 14px), 0 14px, 6px 14px, 6px 6px, 14px 6px)'

/* Şampan qüllə: sıra, x (viewBox 0 0 220 170), y, gecikmə */
export const TOWER = (() => {
  const out = []
  const rows = [1, 2, 3, 4]
  rows.forEach((n, r) => {
    for (let i = 0; i < n; i++) {
      out.push({ x: 110 + (i - (n - 1) / 2) * 48, y: 30 + r * 34, d: 0.35 + r * 0.22 + i * 0.04 })
    }
  })
  return out
})()

/* Ad uzunluğuna görə ölçü (Playfair italic) */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 8) return 'clamp(46px, 14vw, 66px)'
  if (n <= 14) return 'clamp(38px, 11vw, 52px)'
  if (n <= 22) return 'clamp(30px, 8.6vw, 42px)'
  return 'clamp(24px, 6.6vw, 32px)'
}
