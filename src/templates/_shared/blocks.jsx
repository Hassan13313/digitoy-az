import { QRCodeSVG } from 'qrcode.react'
import { seatInputProps } from './useInvitation'
import { SeatSuggest } from './invitationKit'
import { tableNum } from './kids'

/* ─────────────────────────────────────────────────────────────────────────────
   STANDART BLOKLAR (2026-10) — konsept şablonlarında təkrarlanan funksional
   hissələr: yol düymələri, masa axtarışı, foto QR, təbrik kitabı forması.
   Davranış hər şablonda eynidir; görünüş tam olaraq ötürülən stillərdədir
   (`btn(on)`, `field`, `suggest`…), ona görə şablonlar bir-birinə bənzəmir.
   ───────────────────────────────────────────────────────────────────────── */

/** Naviqasiya düymələri: Yol göstər · Maps · Waze · Apple */
export function VenueLinks({ inv, weddingData, tr, btn, style }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center', ...style }}>
      {inv.dirUrl && <a data-press href={inv.dirUrl} target="_blank" rel="noopener noreferrer" style={btn(true)}>{tr.inv_directions_btn}</a>}
      {inv.mapUrl && <a data-press href={inv.mapUrl} target="_blank" rel="noopener noreferrer" style={btn(!inv.dirUrl)}>{tr.inv_btn_maps}</a>}
      {weddingData.wazeUrl && <a data-press href={weddingData.wazeUrl} target="_blank" rel="noopener noreferrer" style={btn(false)}>{tr.inv_btn_waze}</a>}
      {weddingData.appleMapsUrl && <a data-press href={weddingData.appleMapsUrl} target="_blank" rel="noopener noreferrer" style={btn(false)}>{tr.inv_btn_apple}</a>}
    </div>
  )
}

/**
 * Masa axtarışı: sahə + təkliflər + «tapılmadı» + seçilmiş qonağın kartı.
 * `card(num, raw)` — şablonun öz masa vizualı (num: «Masa 4» → «4»).
 */
export function SeatFinder({ inv, tr, listId, field, suggest, font, muted, accent, nameStyle, card }) {
  const { seating, seatingL } = inv
  return (
    <>
      <input {...seatInputProps(inv, listId)} style={field} />
      <SeatSuggest inv={inv} id={listId} c={{ ...suggest, font }} />
      {seating.showNotFound && <div style={{ marginTop: 12, fontSize: 15, color: muted, textAlign: 'center' }}>{tr.inv_seat_fullname}</div>}
      {seating.selected && (
        <div key={seating.selected.full_name} style={{ marginTop: 26, textAlign: 'center' }}>
          <div style={{ fontSize: 17, color: accent, marginBottom: 14, ...nameStyle }}>{seating.selected.full_name}</div>
          {card(tableNum(seating.selected.table_id), seating.selected.table_id)}
          {seating.tablemates.length > 0 && <div style={{ marginTop: 16, fontSize: 15.5, color: muted, lineHeight: 1.6 }}>{seating.tablemates.map((g) => g.full_name).join(', ')}</div>}
          <button onClick={seating.reset} data-press style={{ marginTop: 6, background: 'none', border: 'none', color: accent, fontSize: 15.5, minHeight: 44, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4, fontFamily: font }}>
            {seatingL.again || 'Yenidən axtar'}
          </button>
        </div>
      )}
    </>
  )
}

/** Foto paylaşımı: QR + düymə + izah */
export function PhotoQr({ inv, tr, frame, fg, bg = '#FFFFFF', btn, muted, desc, size = 126 }) {
  const { gallery } = inv
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'inline-block', padding: 12, background: bg, ...frame }}>
        <QRCodeSVG value={gallery.photoShareUrl} size={size} bgColor={bg} fgColor={fg} level="M" />
      </div>
      <div style={{ marginTop: 16, fontSize: 15, color: muted }}>{tr.inv_scan_upload}</div>
      <a data-press href={gallery.photoShareUrl} style={{ ...btn(true), marginTop: 16 }}>{tr.inv_gallery_btn}</a>
      <p style={{ margin: '16px auto 0', maxWidth: 340, fontSize: 15.5, color: muted, lineHeight: 1.65 }}>{desc}</p>
    </div>
  )
}

/** Təbrik kitabının forması */
export function GuestbookForm({ inv, field, btn, errorColor }) {
  const { gbook, gbookL } = inv
  return (
    <form onSubmit={gbook.handleAdd} style={{ display: 'grid', gap: 10, marginBottom: 30 }}>
      <input type="text" value={gbook.name} onChange={(e) => gbook.setName(e.target.value)} placeholder={gbookL.namePh} style={field} />
      <textarea value={gbook.text} onChange={(e) => gbook.setText(e.target.value)} placeholder={gbookL.msgPh} rows={3} style={{ ...field, resize: 'none', lineHeight: 1.5 }} />
      <button type="submit" disabled={!gbook.canSubmit} data-press style={{ ...btn(gbook.canSubmit), width: '100%', opacity: gbook.canSubmit ? 1 : 0.5, cursor: gbook.canSubmit ? 'pointer' : 'not-allowed' }}>
        {gbook.sending ? gbookL.sending : gbookL.btn}
      </button>
      {gbook.error && <p role="alert" style={{ margin: 0, fontSize: 14, color: errorColor }}>⚠ {gbookL.error}</p>}
    </form>
  )
}
