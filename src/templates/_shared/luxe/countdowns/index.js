/* Konsept seriyalarının geri sayımları (2026-11). Hər fayl { kind: (ctx) => JSX } verir.
   ctx: { ref, seen, units, R, lab, row, pop, C, num, caps, cd, alpha } — bax Countdown.jsx */
import { KIDS_CD, KIDS_CD_CSS } from './kids'
import { BABY_CD, BABY_CD_CSS } from './baby'
import { CORP_CD, CORP_CD_CSS } from './corporate'
import { ANNIV_CD, ANNIV_CD_CSS } from './anniversary'
import { GRAD_CD, GRAD_CD_CSS } from './graduation'
import { OPEN_CD, OPEN_CD_CSS } from './opening'
import { HOLI_CD, HOLI_CD_CSS } from './holiday'
import { BACH_CD, BACH_CD_CSS } from './bachelorette'

export const EXTRA_COUNTDOWNS = { ...BACH_CD, ...HOLI_CD, ...OPEN_CD, ...GRAD_CD, ...ANNIV_CD, ...CORP_CD, ...KIDS_CD, ...BABY_CD }
export const EXTRA_COUNTDOWN_CSS = BACH_CD_CSS + HOLI_CD_CSS + OPEN_CD_CSS + GRAD_CD_CSS + ANNIV_CD_CSS + CORP_CD_CSS + KIDS_CD_CSS + BABY_CD_CSS
