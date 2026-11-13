/* Konsept seriyalarının açılış örtükləri (2026-11). Hər fayl { kind: (props) => JSX } verir;
   Overlay.jsx onları `o.kind` ilə çağırır. props: { o, go, t, instant } */
import { KIDS, KIDS_CSS } from './kids'
import { BABY, BABY_CSS } from './baby'
import { CORP, CORP_CSS } from './corporate'
import { ANNIV, ANNIV_CSS } from './anniversary'
import { GRAD, GRAD_CSS } from './graduation'
import { OPEN, OPEN_CSS } from './opening'
import { HOLI, HOLI_CSS } from './holiday'
import { BACH, BACH_CSS } from './bachelorette'

export const EXTRA_OVERLAYS = { ...BACH, ...HOLI, ...OPEN, ...GRAD, ...ANNIV, ...CORP, ...KIDS, ...BABY }
export const EXTRA_OVERLAY_CSS = BACH_CSS + HOLI_CSS + OPEN_CSS + GRAD_CSS + ANNIV_CSS + CORP_CSS + KIDS_CSS + BABY_CSS
