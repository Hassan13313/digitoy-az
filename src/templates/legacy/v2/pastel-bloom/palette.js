/* PASTEL BLOOM — rənglər və köməkçilər (komponent faylından ayrı: fast refresh qaydası) */

export const C = {
  PAPER: '#FCF8F2', PAPER_D: '#F4EDE2', BLUSH: '#EFB8B8', BLUSH_D: '#D98E93', SAGE: '#A9C2A2', SAGE_D: '#7E9C78',
  BUTTER: '#F3DDA6', LAVENDER: '#CDBFE6', SKY: '#B9D6EA', INK: '#4E3F45', MUTED: '#85737A',
}

/* Akvarel kağızı — incə dən */
export const PAPER_BG = (C) => (`radial-gradient(circle at 20% 30%, rgba(239,184,184,.10), transparent 40%), radial-gradient(circle at 80% 70%, rgba(169,194,162,.12), transparent 42%), radial-gradient(circle, rgba(78,63,69,.035) 1px, transparent 1.4px) 0 0 / 6px 6px, ${C.PAPER}`)

/* Çiçəklər: [x%, y%, ölçü px, rəng, gecikmə, fırlanma] — açılış və hero çələngi */
export const OPEN_BLOOMS = [
  [-8, 6, 190, 'blush', 0.0, 10], [78, -4, 170, 'lavender', 0.12, -20], [84, 62, 200, 'butter', 0.22, 30],
  [-12, 70, 210, 'sage', 0.3, -10], [66, 84, 130, 'blush', 0.4, 50], [12, 40, 90, 'sky', 0.5, 0],
]
export const WREATH = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2 - Math.PI / 2
  const tones = ['blush', 'sage', 'butter', 'lavender', 'blush', 'sky', 'sage', 'blush', 'butter', 'lavender', 'sage', 'blush']
  return { x: 50 + Math.cos(a) * 39, y: 50 + Math.sin(a) * 39, s: i % 3 === 0 ? 86 : i % 3 === 1 ? 58 : 70, tone: tones[i], r: (i * 47) % 360 }
})
export const TONES = (C) => ({
  blush: ['#F7D3D2', '#EBA9AC', C.BLUSH_D],
  sage: ['#D5E3D0', C.SAGE, '#7E9C78'],
  butter: ['#FBEBC6', '#F0D293', '#DDB66A'],
  lavender: ['#E7DFF4', C.LAVENDER, '#A898CF'],
  sky: ['#DDEBF5', '#B9D6EA', '#8DB6D3'],
})

/* Ad uzunluğuna görə ölçü */
export function nameSize(text) {
  const n = Array.from(String(text || '')).length
  if (n <= 6) return 'clamp(54px, 16vw, 74px)'
  if (n <= 10) return 'clamp(44px, 12.4vw, 58px)'
  if (n <= 16) return 'clamp(34px, 9.4vw, 46px)'
  return 'clamp(26px, 7.2vw, 34px)'
}
