import { MusicStartBubble, OrderCta } from './TemplateActions'
import TemplateOutro from './TemplateOutro'
import LoveStorySection from './LoveStorySection'
import { getStoryTheme } from './loveStoryTheme'
import { Reveal } from './motion'
import { rsvpState } from './useInvitation'

/* ─────────────────────────────────────────────────────────────────────────────
   INVITATION KIT — funksional, amma GÖRÜNÜŞSÜZ hissələr.

   Burada yalnız davranışı hər şablonda eyni olmalı olan parçalar var:
   musiqi (audio + başlat balonu + düymə), təklif siyahısı (masa/RSVP
   axtarışı), hekayə bölməsi, son hissə (sifariş CTA + footer). Görünüş
   tam olaraq şablonun verdiyi stil/render funksiyasındadır.
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Musiqi: <audio> HƏMİŞƏ mount olunur (açılış toxunuşunda play() sinxron
 * çağırılsın deyə — iOS), düymə və balon yalnız dəvətnamə açılandan sonra.
 * `children({ playing, toggle })` düymənin içini çəkir.
 */
export function MusicFab({ inv, theme, lang, style, children }) {
  const { music } = inv
  if (!music.hasMusic) return null
  return (
    <>
      <audio {...music.audioProps} />
      {inv.opened && (
        <>
          <MusicStartBubble
            theme={theme} lang={lang} visible={inv.musicPrompt} playing={music.playing}
            onStart={() => { if (!music.playing) music.play(); inv.dismissMusicPrompt() }}
          />
          <button
            onClick={music.toggle}
            data-press
            aria-label={music.playing ? 'Musiqini dayandır' : 'Musiqini başlat'}
            style={{
              position: 'fixed',
              bottom: 'calc(max(20px, env(safe-area-inset-bottom, 20px)) + var(--dt-preview-offset, 0px))',
              right: 20, zIndex: 55, width: 48, height: 48, padding: 0, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              ...style,
            }}
          >
            {children({ playing: music.playing, toggle: music.toggle })}
          </button>
        </>
      )}
    </>
  )
}

/** Ekvalayzer zolaqları — musiqi düyməsinin standart içi */
export function EqBars({ playing, color, idle, w = 2.5, h = 13, gap = 3, radius = 1, anim = 'kit-eq' }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap }}>
      <style>{'@keyframes kit-eq { 0%,100% { transform: scaleY(.35) } 50% { transform: scaleY(1) } }'}</style>
      {[0, 0.18, 0.36].map((d) => (
        <span key={d} style={{
          width: w, height: h, borderRadius: radius, display: 'block', transformOrigin: 'bottom',
          background: playing ? color : idle,
          animation: playing ? `${anim} 1s ease-in-out ${d}s infinite` : 'none',
          transform: playing ? undefined : 'scaleY(.45)',
        }} />
      ))}
    </span>
  )
}

/**
 * Təklif siyahısı (masa / RSVP adı). Akış içindədir — aşağıdakıları örtmür.
 * `c` — { bg, border, active, text, table, radius, font, shadow }
 */
export function SuggestList({ id, items, activeIdx, setActiveIdx, onPick, c = {} }) {
  if (!items || !items.length) return null
  return (
    <ul id={id} role="listbox" style={{
      listStyle: 'none', margin: '8px 0 0', padding: 4, textAlign: 'left',
      background: c.bg, border: c.border, borderRadius: c.radius ?? 0, boxShadow: c.shadow,
      maxHeight: 280, overflowY: 'auto', fontFamily: c.font,
    }}>
      {items.map((g, i) => (
        <li
          key={g.id ?? `${g.full_name}-${i}`}
          role="option"
          aria-selected={i === activeIdx}
          onMouseEnter={() => setActiveIdx(i)}
          onMouseDown={(e) => { e.preventDefault(); onPick(g) }}
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
            padding: '12px 14px', cursor: 'pointer', borderRadius: c.radius ? Math.max(0, c.radius - 4) : 0,
            background: i === activeIdx ? c.active : 'transparent',
          }}
        >
          <span style={{ fontSize: 14.5, color: c.text }}>{g.full_name}</span>
          {g.table_id && <span style={{ fontSize: 12.5, color: c.table, whiteSpace: 'nowrap' }}>{g.table_id}</span>}
        </li>
      ))}
    </ul>
  )
}

/** Masa axtarışının təklif siyahısı (hook vəziyyəti ilə bağlı) */
export function SeatSuggest({ inv, id, c }) {
  const s = inv.seating
  return <SuggestList id={id} items={s.suggestions} activeIdx={s.activeIdx} setActiveIdx={s.setActiveIdx} onPick={s.pick} c={c} />
}

/** RSVP adının təklif siyahısı */
export function RsvpSuggest({ inv, c }) {
  const r = inv.rsvp
  return <SuggestList items={r.suggestions} activeIdx={r.activeIdx} setActiveIdx={r.setActiveIdx} onPick={r.pick} c={c} />
}

/**
 * RSVP-nin bağlı / artıq cavablanmış / təşəkkür vəziyyətləri.
 * `render({ title, sub })` şablonun öz kartında çəkir; forma vəziyyətində null.
 */
export function RsvpStatus({ inv, render }) {
  const st = rsvpState(inv.rsvp)
  if (st === 'form') return null
  if (st === 'closed') return render({ kind: st, title: inv.tr.rsvp_closed_title, sub: inv.tr.rsvp_closed_desc })
  if (st === 'already') return render({ kind: st, title: inv.rsvpL.already_done, sub: inv.rsvp.selected?.full_name })
  return render({ kind: st, title: inv.rsvp.thanksMsg, sub: inv.rsvpL.thanks_sub })
}

/** «Bizim hekayəmiz» bölməsi — şablonun öz hekayə teması ilə */
export function StoryBlock({ inv, templateId, weddingData, lang, style = {}, before = null }) {
  if (!inv.showStory) return null
  return (
    <section data-section="lovestory" style={{
      padding: 'clamp(48px,12vw,64px) 22px clamp(56px,14vw,80px)',
      background: getStoryTheme(templateId, inv.storyAdminTheme).bg, ...style,
    }}>
      {before}
      <Reveal style={{ maxWidth: 560, margin: '0 auto' }}>
        <LoveStorySection
          story={weddingData.loveStory} templateId={templateId} lang={lang}
          adminTheme={inv.storyAdminTheme} copyOverrides={inv.storyCopy}
        />
      </Reveal>
    </section>
  )
}

/** Son hissə: builder önbaxışında sifariş CTA + demo CTA + footer */
export function InvitationEnd({ inv, theme, weddingData, lang, isDemoMode, serif }) {
  return (
    <>
      <OrderCta
        theme={theme} weddingData={weddingData} lang={lang}
        pageSlug={inv.gallery.pageSlug} isDemoMode={isDemoMode}
        effectiveSlug={inv.gallery.effectiveSlug} serif={serif}
      />
      <TemplateOutro
        theme={theme} weddingData={weddingData} lang={lang}
        isDemoMode={isDemoMode} isCouple={inv.isCouple} isCorp={inv.isCorp}
        eventLabel={inv.eventLabel} serif={serif}
        footer={inv.footer}
      />
    </>
  )
}
