import { Baby, Cake, Camera, DoorOpen, Gift, Heart, Music, Sparkles, Star, Wine } from 'lucide-react'
import TableArt, { LinenDefs } from './TableArt'
import { lc } from './seatingModel'
import './hallplan.css'

/* ─────────────────────────────────────────────────────────────────────────────
   Zal planı: zonalar (səhnə, bəy-gəlin, rəqs meydançası, giriş, müştərinin öz
   zonaları) və masalar. Planlayıcı (admin / müştəri paneli) və dəvətnamədəki
   «masanı tap» kiçik xəritəsi eyni komponenti işlədir.
   Mövqelər faizlədir (zal 10:7) — ölçü ekran enindən asılı deyil.
   ───────────────────────────────────────────────────────────────────────── */

export const ZONE_ICON = { stage: Star, couple: Heart, dance: Sparkles, door: DoorOpen, music: Music, photo: Camera, cake: Cake, gift: Gift, kids: Baby, bar: Wine }

export default function HallPlan({
  layout, seatsByTable, mini = false, editing = false, highlight = null, hallRef,
  onTableClick, onTablePointerDown, onZoneClick, onZonePointerDown, onResizePointerDown,
}) {
  return (
    <div ref={hallRef} className={`sp-hall${editing ? ' is-editing' : ''}${mini ? ' is-mini' : ''}`}>
      <LinenDefs />
      {(layout.zones || []).map((z) => {
        const Icon = ZONE_ICON[z.kind]
        const style = { left: `${z.x - z.w / 2}%`, top: `${z.y - z.h / 2}%`, width: `${z.w}%`, height: `${z.h}%` }
        const body = <span>{Icon && <Icon aria-hidden="true" />}{z.label}</span>
        if (!editing) return <div key={z.id} className={`sp-zone k-${z.kind} ${z.shape}`} style={style}>{body}</div>
        return (
          <div key={z.id} role="button" tabIndex={0} aria-label={`Zona: ${z.label}`} data-zone={z.id}
            className={`sp-zone k-${z.kind} ${z.shape}`} style={style}
            onPointerDown={(e) => onZonePointerDown?.(e, z)} onClick={() => onZoneClick?.(z)}
            onKeyDown={(e) => { if (e.key === 'Enter') onZoneClick?.(z) }}>
            {body}
            <i className="sp-rz" title="Dartıb böyüdün" onPointerDown={(e) => { e.stopPropagation(); onResizePointerDown?.(e, z) }} />
          </div>
        )
      })}
      {layout.tables.map((t) => {
        const style = { left: `${t.x}%`, top: `${t.y}%` }
        if (mini) {
          const me = highlight != null && lc(t.name) === lc(highlight)
          return <div key={t.name} className={`sp-mt ${t.shape}${me ? ' is-me' : ''}`} style={style}><TableArt table={t} neutral me={me} /></div>
        }
        const seats = seatsByTable?.get(t.name) || []
        return (
          <button key={t.name} type="button" className={`sp-mt ${t.shape}${seats.length > t.cap ? ' over' : ''}`} style={style}
            data-drop={`table:${t.name}`} data-table={t.name} aria-label={`${t.name}: ${seats.length} / ${t.cap} yer`}
            onPointerDown={(e) => onTablePointerDown?.(e, t)} onClick={() => onTableClick?.(t)}>
            <TableArt table={t} seats={seats} />
          </button>
        )
      })}
    </div>
  )
}
