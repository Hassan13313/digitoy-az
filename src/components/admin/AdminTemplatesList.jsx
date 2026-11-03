import { useEffect, useMemo, useState } from 'react'
import { Eye, PencilLine } from 'lucide-react'
import AdminContentManager from './AdminContentManager'
import { Button, EmptyState, Notice, PageHeader, Panel, SearchInput, Skeleton, StatusBadge, Toast } from './v2/adminUi'
import { listTemplateContent } from '../../utils/api'
import { listTemplates, groupTemplatesByConcept, getTemplateName, templateContentKey, templatePreviewPath, getTemplateTheme, conceptEventType } from '../../templates/templateConfig'
import { templateImage } from '../../data/templateImages'

/* ─────────────────────────────────────────────────────────────────────────────
   «ŞABLONLAR» (2026-11) — hər şablonun öz məzmunu, dəvətnamə olmadan.

   Bölmələr vitrinlə eyni sıradadır. Bir dizayn iki bölmədədirsə (Boarding Pass:
   Toy / Nişan + Ad günü) iki sətir var: hər versiyanın mətni ayrı saxlanılır.
   Redaktor eyni «Məzmun» pəncərəsidir, önbaxış həmin bölmənin nümunəsini göstərir.

   Dəyişiklik şablonu işlədən BÜTÜN yeni dizaynlı dəvətnamələrə və vitrinə keçir.
   Bir dəvətnaməyə xüsusi düzəliş «Dəvətnamələr › Məzmun»-dadır və bunun üstündədir.
   ───────────────────────────────────────────────────────────────────────── */

export default function AdminTemplatesList() {
  const [changed, setChanged] = useState(null)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    let alive = true
    listTemplateContent()
      .then((r) => { if (alive) setChanged(new Set((r.items || []).map((i) => i.key))) })
      .catch((e) => { if (alive) { setError(e?.message || 'Siyahı yüklənmədi'); setChanged(new Set()) } })
    return () => { alive = false }
  }, [])

  const groups = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('az')
    const list = listTemplates().filter((t) => !q || t.name.toLocaleLowerCase('az').includes(q) || t.id.includes(q))
    return groupTemplatesByConcept(list, 'az')
  }, [query])

  const total = groups.reduce((n, g) => n + g.items.length, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Şablonlar"
        subtitle="Hər şablonun açılışını, mətnlərini, rənglərini, şriftlərini və bölmələrini buradan dəyişin. Dəyişiklik bu şablonu işlədən bütün yeni dəvətnamələrə və vitrinə keçir."
      />

      {error && <Notice tone="danger" title={error} />}

      <SearchInput value={query} onChange={setQuery} placeholder="Şablon axtar…" label="Şablon axtar" />

      {!changed ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : total === 0 ? (
        <EmptyState title="Bu adda şablon yoxdur" />
      ) : groups.map((g) => (
        <Panel key={g.id} title={g.label} actions={<span className="text-[13px] text-[#6B5E54]">{g.items.length}</span>} flush>
          <ul className="divide-y divide-[#EEE8DF]">
            {g.items.map((tpl) => {
              const key = templateContentKey(tpl.id, conceptEventType(tpl.id, g.id))
              const img = templateImage(tpl.id, g.id)
              return (
                <li key={key} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                  <span aria-hidden="true" className="h-14 w-9 shrink-0 overflow-hidden rounded border border-[#EEE8DF]" style={{ background: getTemplateTheme(tpl.id).background }}>
                    {img && <img src={img} alt="" loading="lazy" className="h-full w-full object-cover object-top" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-medium text-[#2B2723]">{tpl.name}</span>
                    {changed.has(key) && <StatusBadge kind="order" status="approved" label="Dəyişdirilib" size="sm" className="mt-1" />}
                  </span>
                  <a
                    href={templatePreviewPath(tpl.id, g.id)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${tpl.name} — önbaxış`}
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[#6B5E54] hover:bg-[#F5F0E8]"
                  >
                    <Eye size={18} aria-hidden="true" />
                  </a>
                  <Button size="sm" icon={PencilLine} onClick={() => setEditing({ key, id: tpl.id, concept: g.id, label: g.label })}>
                    Məzmun
                  </Button>
                </li>
              )
            })}
          </ul>
        </Panel>
      ))}

      {editing && (
        <AdminContentManager
          templateEdit={editing}
          onClose={() => setEditing(null)}
          onSaved={(res) => {
            setChanged((prev) => {
              const next = new Set(prev)
              const hasContent = Object.keys(res?.admin || {}).length > 0 || Object.keys(res?.sections || {}).length > 0
              if (hasContent) next.add(editing.key)
              else next.delete(editing.key)
              return next
            })
            setToast(`${getTemplateName(editing.id)} saxlanıldı`)
          }}
        />
      )}
      <Toast open={!!toast} message={toast} onClose={() => setToast('')} />
    </div>
  )
}
