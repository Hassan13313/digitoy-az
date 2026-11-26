import { useEffect, useLayoutEffect, useRef } from 'react'
import { clamp, shortName, SIDE_HEX, SEAT_TAKEN_HEX } from './seatingModel'

/* ─────────────────────────────────────────────────────────────────────────────
   Oturma planında sürüşdürmə (kitabxanasız, pointer events):
   • qonaq: siçanla tutub çəkin; barmaqla — adın üstündə ~0,4 san. saxlayın
     (telefon titrəyir), sonra çəkin. Buraxılan yer `[data-drop]` («table:<ad>»
     və ya «roster»).
   • zalı düzənlə: masa / zona çəkilir, zona küncündən böyüdülür.
   Çəkmə zamanı DOM birbaşa dəyişir (React yenidən çəkilmir), buraxanda
   nəticə callback-lə state-ə yazılır. Çəkmədən sonrakı klik udulur.
   ───────────────────────────────────────────────────────────────────────── */

const half = (v) => Math.round(v * 2) / 2
const LONG_PRESS = 380

export default function useSeatDrag({ onDrop, onMove, onResize, onStart }) {
  const pd = useRef(null)
  const ghost = useRef(null)
  const suppress = useRef(false)
  const cbs = useRef({})
  useLayoutEffect(() => { cbs.current = { onDrop, onMove, onResize, onStart } })

  function activate(p, x, y) {
    p.active = true
    suppress.current = true
    document.body.classList.add('sp-dragging')
    if (p.kind === 'guest') {
      const g = document.createElement('div')
      g.className = 'sp-ghost'
      const dot = document.createElement('i')
      dot.style.background = SIDE_HEX[p.label.side] || SEAT_TAKEN_HEX
      g.append(dot, document.createTextNode(shortName(p.label.name) + (p.ids.length > 1 ? ` və daha ${p.ids.length - 1} nəfər` : '')))
      g.style.transform = `translate(${x + 14}px,${y + 10}px)`
      document.body.append(g)
      ghost.current = g
    }
    cbs.current.onStart?.(p)
  }

  useEffect(() => {
    const clearOver = (p) => { p?.over?.classList.remove('is-over'); if (p) p.over = null }
    const end = (drop) => {
      const p = pd.current
      pd.current = null
      if (!p) return
      clearTimeout(p.timer)
      if (!p.active) return
      document.body.classList.remove('sp-dragging')
      ghost.current?.remove()
      ghost.current = null
      const target = p.over?.dataset.drop
      clearOver(p)
      setTimeout(() => { suppress.current = false }, 0)
      if (!drop) return
      if (p.kind === 'move' && p.cur) cbs.current.onMove?.(p.itemKind, p.id, p.cur)
      else if (p.kind === 'resize' && p.cur) cbs.current.onResize?.(p.id, p.cur)
      else if (p.kind === 'guest' && target) cbs.current.onDrop?.(p.ids, target)
    }
    const move = (e) => {
      const p = pd.current
      if (!p) return
      if (!p.active) {
        const d = Math.hypot(e.clientX - p.x, e.clientY - p.y)
        if (p.touch && p.kind === 'guest') {           /* barmaq hələ saxlanmayıb → səhifəni sürüşdürür */
          if (d > 8) { clearTimeout(p.timer); pd.current = null }
          return
        }
        if (d < 5) return
        activate(p, e.clientX, e.clientY)
      }
      e.preventDefault()
      if (p.kind === 'move' || p.kind === 'resize') {
        const r = p.hall.getBoundingClientRect()
        if (p.kind === 'move') {
          const x = half(clamp((e.clientX - r.left) / r.width * 100 + p.dx, 3, 97))
          const y = half(clamp((e.clientY - r.top) / r.height * 100 + p.dy, 3, 97))
          p.cur = { x, y }
          p.el.style.left = `${p.w != null ? x - p.w / 2 : x}%`
          p.el.style.top = `${p.h != null ? y - p.h / 2 : y}%`
        } else {
          const w = half(clamp(p.w + (e.clientX - p.x) / r.width * 100, 4, 90))
          const h = half(clamp(p.h + (e.clientY - p.y) / r.height * 100, 3, 80))
          p.cur = { w, h, x: p.left + w / 2, y: p.top + h / 2 }
          p.el.style.width = `${w}%`
          p.el.style.height = `${h}%`
        }
        return
      }
      if (ghost.current) ghost.current.style.transform = `translate(${e.clientX + 14}px,${e.clientY + 10}px)`
      if (e.clientY > innerHeight - 80) scrollBy(0, 14)
      else if (e.clientY < 80) scrollBy(0, -14)
      const tgt = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-drop]') || null
      if (tgt !== p.over) { clearOver(p); tgt?.classList.add('is-over'); p.over = tgt }
    }
    const up = () => end(true)
    const cancel = () => end(false)
    /* barmaqla çəkərkən səhifə sürüşməsin; uzun basmada kontekst menyusu açılmasın */
    const touchMove = (e) => { if (pd.current?.active) e.preventDefault() }
    const ctxMenu = (e) => { if (pd.current) e.preventDefault() }
    const click = (e) => { if (suppress.current) { suppress.current = false; e.stopPropagation(); e.preventDefault() } }
    document.addEventListener('pointermove', move, { passive: false })
    document.addEventListener('pointerup', up)
    document.addEventListener('pointercancel', cancel)
    document.addEventListener('touchmove', touchMove, { passive: false })
    document.addEventListener('contextmenu', ctxMenu)
    document.addEventListener('click', click, true)
    return () => {
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerup', up)
      document.removeEventListener('pointercancel', cancel)
      document.removeEventListener('touchmove', touchMove)
      document.removeEventListener('contextmenu', ctxMenu)
      document.removeEventListener('click', click, true)
      clearTimeout(pd.current?.timer)
      ghost.current?.remove()
      document.body.classList.remove('sp-dragging')
    }
  }, [])

  return {
    /** Qonaq(lar)ı çəkməyə başla. `label` — ilk qonaq {name, side} */
    startGuests(e, ids, label) {
      if (e.button > 0 || !ids.length) return
      const p = { kind: 'guest', ids, label, x: e.clientX, y: e.clientY, touch: e.pointerType !== 'mouse' }
      if (p.touch) p.timer = setTimeout(() => { if (pd.current === p) { navigator.vibrate?.(15); activate(p, p.x, p.y) } }, LONG_PRESS)
      pd.current = p
    },
    /** Zalı düzənlə: masa (x,y mərkəz) və ya zona (x,y mərkəz + w,h) */
    startItem(e, itemKind, item, hall) {
      if (e.button > 0 || !hall) return
      const r = hall.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width * 100, py = (e.clientY - r.top) / r.height * 100
      pd.current = {
        kind: 'move', itemKind, id: itemKind === 'zone' ? item.id : item.name, el: e.currentTarget, hall,
        x: e.clientX, y: e.clientY, dx: item.x - px, dy: item.y - py,
        w: itemKind === 'zone' ? item.w : null, h: itemKind === 'zone' ? item.h : null,
      }
    },
    startResize(e, zone, hall) {
      if (e.button > 0 || !hall) return
      pd.current = {
        kind: 'resize', id: zone.id, el: e.currentTarget.parentElement, hall,
        x: e.clientX, y: e.clientY, w: zone.w, h: zone.h, left: zone.x - zone.w / 2, top: zone.y - zone.h / 2,
      }
    },
  }
}
