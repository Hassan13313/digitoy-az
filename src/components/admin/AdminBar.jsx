import { useState } from 'react'
import { ShieldCheck, Edit2, Save, ExternalLink, Check, ChevronLeft } from 'lucide-react'

/* ── Spinner (CSS keyframe, inline) ── */
const SPIN_STYLE = { animation: 'adminSpin 0.8s linear infinite', display: 'inline-block' }
const SPIN_KF    = `@keyframes adminSpin { to { transform: rotate(360deg); } }`

/* ── Kiçik loader dairəsi ── */
function Spinner() {
  return (
    <span style={{
      ...SPIN_STYLE,
      width: 10, height: 10,
      border: '1.5px solid currentColor',
      borderTopColor: 'transparent',
      borderRadius: '50%',
      flexShrink: 0,
    }} />
  )
}

export default function AdminBar({ slug, onEdit, onBack, onSave, onApprove, isEditing = false }) {
  const [saveState,    setSaveState]    = useState('idle')  // idle | loading | saved | error
  const [approveState, setApproveState] = useState('idle')  // idle | loading | done

  const busy = saveState === 'loading' || approveState === 'loading'

  const handleSave = async () => {
    setSaveState('loading')
    try {
      await onSave?.()
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 3000)
    } catch {
      setSaveState('error')
      setTimeout(() => setSaveState('idle'), 3000)
    }
  }

  const handleApprove = async () => {
    setApproveState('loading')
    try {
      await onApprove?.()
      setApproveState('done')
      setTimeout(() => setApproveState('idle'), 4000)
    } catch {
      setApproveState('idle')
    }
  }

  /* ── Stil sabitləri ── */
  const BAR = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9998,
    height: 52, display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', padding: '0 16px',
    background: 'rgba(14, 11, 7, 0.95)',
    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(197,160,89,0.3)',
    boxShadow: '0 1px 0 rgba(197,160,89,0.06), 0 4px 24px rgba(0,0,0,0.5)',
    gap: 10,
  }
  const TEXT_LABEL = {
    fontSize: 9, letterSpacing: '0.26em', textTransform: 'uppercase',
    fontFamily: '"Inter",system-ui,sans-serif', fontWeight: 700,
    color: 'rgba(197,160,89,0.92)', whiteSpace: 'nowrap',
  }
  const TEXT_SLUG = {
    fontSize: 10, color: 'rgba(197,160,89,0.45)',
    fontFamily: '"Fira Code","JetBrains Mono",monospace',
    overflow: 'hidden', textOverflow: 'ellipsis',
    whiteSpace: 'nowrap', maxWidth: 180,
  }
  const BTN_BASE = {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '6px 11px',
    fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
    fontFamily: '"Inter",system-ui,sans-serif', fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
    border: '1px solid',
  }

  /* ── Saxla düyməsi rəngləri ── */
  const saveBg    = saveState === 'saved' ? 'rgba(34,197,94,0.12)'  : saveState === 'error' ? 'rgba(239,68,68,0.1)'   : 'rgba(197,160,89,0.07)'
  const saveBdr   = saveState === 'saved' ? 'rgba(34,197,94,0.4)'   : saveState === 'error' ? 'rgba(239,68,68,0.4)'  : 'rgba(197,160,89,0.25)'
  const saveColor = saveState === 'saved' ? 'rgba(134,239,172,0.95)': saveState === 'error' ? 'rgba(252,165,165,0.9)': 'rgba(197,160,89,0.7)'

  /* ── Canlıya At düyməsi rəngləri ── */
  const approveBg    = approveState === 'done' ? 'rgba(197,160,89,0.15)' : '#C5A059'
  const approveBdr   = 'rgba(197,160,89,0.65)'
  const approveColor = approveState === 'done' ? 'rgba(197,160,89,0.9)' : '#0F0C08'

  return (
    <>
      <style>{SPIN_KF}</style>
      <div style={BAR}>

        {/* ── Sol: İkon + Label + Slug ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0, flex: 1 }}>
          {isEditing && onBack && (
            <button
              onClick={onBack}
              title="Nəzərdən keçirməyə qayıt"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(197,160,89,0.55)', padding: '4px 6px 4px 0',
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
                fontFamily: '"Inter",system-ui,sans-serif', fontWeight: 600,
              }}
            >
              <ChevronLeft size={12} strokeWidth={2} />
              Geri
            </button>
          )}
          <ShieldCheck size={13} style={{ color: '#C5A059', flexShrink: 0 }} strokeWidth={2} />
          <span style={TEXT_LABEL}>Digitoy Admin</span>
          {slug && (
            <>
              <span style={{ color: 'rgba(197,160,89,0.22)', fontSize: 16, lineHeight: 1, flexShrink: 0 }}>·</span>
              <span style={TEXT_SLUG}>{slug}</span>
            </>
          )}
          {isEditing && (
            <span style={{
              padding: '2px 7px', background: 'rgba(197,160,89,0.12)',
              border: '1px solid rgba(197,160,89,0.25)',
              fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'rgba(197,160,89,0.7)', fontFamily: '"Inter",system-ui,sans-serif',
              fontWeight: 600, flexShrink: 0,
            }}>
              Redaktə
            </span>
          )}
        </div>

        {/* ── Sağ: Düymələr ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>

          {/* Redaktə Et — yalnız nəzərdən keçirmə modunda */}
          {!isEditing && onEdit && (
            <button
              onClick={onEdit}
              style={{ ...BTN_BASE, background: 'rgba(197,160,89,0.08)', borderColor: 'rgba(197,160,89,0.28)', color: 'rgba(197,160,89,0.85)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(197,160,89,0.16)'; e.currentTarget.style.borderColor = 'rgba(197,160,89,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(197,160,89,0.08)'; e.currentTarget.style.borderColor = 'rgba(197,160,89,0.28)' }}
            >
              <Edit2 size={10} strokeWidth={2} />
              Redaktə Et
            </button>
          )}

          {/* Dəyişiklikləri Saxla */}
          <button
            onClick={handleSave}
            disabled={busy}
            style={{ ...BTN_BASE, background: saveBg, borderColor: saveBdr, color: saveColor, opacity: busy ? 0.6 : 1, cursor: busy ? 'not-allowed' : 'pointer' }}
          >
            {saveState === 'loading' ? <Spinner /> :
             saveState === 'saved'   ? <Check size={10} strokeWidth={2.5} /> :
                                       <Save size={10} strokeWidth={2} />}
            {saveState === 'loading' ? 'Saxlanır...' :
             saveState === 'saved'   ? 'Saxlandı!' :
             saveState === 'error'   ? 'Xəta!' : 'Saxla'}
          </button>

          {/* Sifarişi Təsdiqlə — Canlıya At */}
          <button
            onClick={handleApprove}
            disabled={busy}
            style={{ ...BTN_BASE, background: approveBg, borderColor: approveBdr, color: approveColor, fontWeight: 700, opacity: busy ? 0.7 : 1, cursor: busy ? 'not-allowed' : 'pointer' }}
            onMouseEnter={e => { if (!busy && approveState === 'idle') e.currentTarget.style.background = '#d4b06a' }}
            onMouseLeave={e => { if (!busy && approveState === 'idle') e.currentTarget.style.background = '#C5A059' }}
          >
            {approveState === 'loading' ? <Spinner /> :
             approveState === 'done'    ? <Check size={10} strokeWidth={2.5} /> :
                                          <ExternalLink size={10} strokeWidth={2} />}
            {approveState === 'done' ? 'Link Kopyalandı!' : 'Canlıya At'}
          </button>
        </div>
      </div>
    </>
  )
}
