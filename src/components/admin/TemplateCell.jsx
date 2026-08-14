import { getTemplateConfig, getTemplateName, getStatusMeta, DEFAULT_TEMPLATE_ID } from '../../templates/templateConfig'

/* ─────────────────────────────────────────────────────────────────────────────
   TEMPLATE CELL — admin siyahılarında şablon xanası.

   Adı və statusu YALNIZ `templateConfig` metadata-sından oxuyur; admin-də heç
   bir şablon adı hardcode edilmir. Köhnə sətirlərdə template_id boş gəlirsə
   default şablon göstərilir.
   ───────────────────────────────────────────────────────────────────────── */
export default function TemplateCell({ templateId }) {
  const id   = templateId || DEFAULT_TEMPLATE_ID
  const cfg  = getTemplateConfig(id)
  const name = getTemplateName(id)
  const badge = getStatusMeta(cfg?.status, 'az')

  const accent = cfg?.theme?.primary || 'oklch(55% 0.07 80)'

  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
      <span
        aria-hidden="true"
        title={cfg ? `${name} · ${badge.label}` : `Naməlum şablon: ${id}`}
        style={{
          width: 8, height: 8, borderRadius: 2, flexShrink: 0,
          background: accent,
          border: '1px solid rgba(0,0,0,0.12)',
        }}
      />
      <span style={{
        fontSize: 11, color: cfg ? 'oklch(40% 0.03 60)' : 'oklch(55% 0.12 30)',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {name || '—'}
      </span>
    </span>
  )
}
