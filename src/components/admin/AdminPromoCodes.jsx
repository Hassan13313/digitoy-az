import { useEffect, useState } from 'react'
import { Link2, PencilLine, Plus, Trash2 } from 'lucide-react'
import AdminPromoForm from './AdminPromoForm'
import { Button, ConfirmDialog, EmptyState, IconButton, Notice, PageHeader, Panel, Skeleton, StatusBadge, Toast } from './v2/adminUi'
import { PACKAGE_DEFS } from '../../data/packages'
import { deletePromoCode, listPromoCodes, setPromoActive } from '../../utils/api'

/* ─────────────────────────────────────────────────────────────────────────────
   «PROMOKODLAR» (2026-11-25) — kampaniya və influenser kodları.

   Hər kod: endirim (% / ₼), paketlər, tarixlər (son gün daxil, Bakı vaxtı), limit,
   «kimin kodu» (influenser/partnyor). «Sifariş» sayı = bu kodla göndərilmiş +
   təsdiqlənmiş sifarişlər. İşlənmiş kod silinmir — söndürülür (sifarişlərdə izi qalır).
   ───────────────────────────────────────────────────────────────────────── */

const SITE = 'https://digitoy.az'
const bakuToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Baku' }).format(new Date())
const fmtDate = (d) => (d ? d.split('-').reverse().join('.') : '')

/** Siyahıdakı status: söndürülüb / başlamayıb / vaxtı bitib / limit dolub / aktiv */
function promoState(p, today = bakuToday()) {
  if (!p.active) return { kind: 'invite', status: 'inactive', label: 'Söndürülüb' }
  if (p.starts_on && today < p.starts_on) return { kind: 'order', status: 'new', label: 'Başlamayıb' }
  if (p.ends_on && today > p.ends_on) return { kind: 'order', status: 'deleted', label: 'Vaxtı bitib' }
  if (p.max_uses != null && p.used >= p.max_uses) return { kind: 'order', status: 'rejected', label: 'Limit dolub' }
  return { kind: 'invite', status: 'active', label: 'Aktiv' }
}

function describe(p) {
  const discount = p.kind === 'percent' ? `−${p.amount}%` : `−${p.amount}₼`
  const pkgs = p.packages.length ? p.packages.map((id) => PACKAGE_DEFS[id]?.name || id).join(', ') : 'Bütün paketlər'
  const dates = p.starts_on || p.ends_on
    ? `${fmtDate(p.starts_on) || '…'} – ${fmtDate(p.ends_on) || '…'}`
    : 'Müddətsiz'
  return [discount, pkgs, dates]
}

export default function AdminPromoCodes() {
  const [items, setItems] = useState(null)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)       /* null | 'new' | item */
  const [deleting, setDeleting] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const [toast, setToast] = useState('')

  const load = () => listPromoCodes()
    .then((r) => setItems(r.items || []))
    .catch((e) => { setError(e?.message || 'Promokodlar yüklənmədi'); setItems([]) })
  useEffect(() => { load() }, [])

  const replace = (item) => setItems((list) => {
    const i = list.findIndex((x) => x.id === item.id)
    return i < 0 ? [item, ...list] : list.map((x) => (x.id === item.id ? item : x))
  })

  const toggle = async (p) => {
    setBusyId(p.id)
    try {
      const r = await setPromoActive(p.id, !p.active)
      replace(r.item)
      setToast(r.item.active ? `${p.code} aktiv edildi` : `${p.code} söndürüldü`)
    } catch (e) { setError(e.message) } finally { setBusyId(null) }
  }

  const copyLink = async (p) => {
    try { await navigator.clipboard.writeText(`${SITE}/?kod=${p.code}`); setToast('Link kopyalandı') }
    catch { setToast(`${SITE}/?kod=${p.code}`) }
  }

  const doDelete = async () => {
    const p = deleting
    setBusyId(p.id)
    try {
      await deletePromoCode(p.id)
      setItems((list) => list.filter((x) => x.id !== p.id))
      setToast(`${p.code} silindi`)
    } catch (e) {
      setError(e.code === 'IN_USE' ? 'Bu kodla sifariş var — silmək olmaz, söndürün.' : e.message)
    } finally { setBusyId(null); setDeleting(null) }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Promokodlar"
        subtitle="Kampaniya və influenser kodları. Müştəri kodu sifarişin son addımında yazır və ya linklə gəlir; endirimli qiymət WhatsApp mesajına və sifarişə düşür."
        actions={<Button variant="primary" icon={Plus} onClick={() => setEditing('new')}>Yeni kod</Button>}
      />

      {error && <Notice tone="danger" title={error} />}

      {!items ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState
          title="Hələ promokod yoxdur"
          text="İlk kodu yaradın, məsələn Qara Cümə üçün QARACUMA."
          action={<Button variant="primary" icon={Plus} onClick={() => setEditing('new')}>Yeni kod</Button>}
        />
      ) : (
        <Panel flush>
          <ul className="divide-y divide-[#EEE8DF]">
            {items.map((p) => {
              const st = promoState(p)
              return (
                <li key={p.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:px-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span lang="en" className="text-[16px] font-semibold tracking-[0.06em] text-[#2B2723]">{p.code}</span>
                      <StatusBadge kind={st.kind} status={st.status} label={st.label} size="sm" />
                    </div>
                    <p className="mt-1 text-[13.5px] text-[#51483F]">{describe(p).join(' · ')}</p>
                    <p className="mt-0.5 text-[13px] text-[#6B5E54]">
                      <span className="font-medium text-[#2B2723] tabular-nums">{p.used}</span> sifariş
                      {p.max_uses != null && <> / limit <span className="tabular-nums">{p.max_uses}</span></>}
                      {p.owner && <> · {p.owner}</>}
                      {p.note && <> · {p.note}</>}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                    <IconButton label="Linki kopyala (?kod=)" icon={Link2} onClick={() => copyLink(p)} />
                    <Button size="sm" icon={PencilLine} onClick={() => setEditing(p)}>Redaktə</Button>
                    <Button size="sm" loading={busyId === p.id} onClick={() => toggle(p)}>{p.active ? 'Söndür' : 'Aktiv et'}</Button>
                    {p.used === 0 && <IconButton label="Sil" icon={Trash2} destructive onClick={() => setDeleting(p)} />}
                  </div>
                </li>
              )
            })}
          </ul>
        </Panel>
      )}

      {editing && (
        <AdminPromoForm
          key={editing === 'new' ? 'new' : editing.id}
          open
          item={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={(item, created) => { replace(item); setEditing(null); setToast(created ? `${item.code} yaradıldı` : `${item.code} saxlanıldı`) }}
        />
      )}
      <ConfirmDialog
        open={!!deleting}
        title={deleting ? `${deleting.code} silinsin?` : ''}
        description="Bu kodla hələ sifariş yoxdur. Silinəndən sonra müştəri onu yaza bilməz."
        confirmLabel="Sil"
        busy={!!deleting && busyId === deleting.id}
        onConfirm={doDelete}
        onCancel={() => setDeleting(null)}
      />
      <Toast open={!!toast} message={toast} onClose={() => setToast('')} />
    </div>
  )
}
