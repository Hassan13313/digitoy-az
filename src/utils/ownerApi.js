/* ─────────────────────────────────────────────────────────────────────────────
   «Müştəri paneli» API (Phase 50)

   getOwnerPanel  — müştəri: panel başlığı (YALNIZ müştəri açarı ilə; admin
                    tokeni burada qəbul edilmir — yenilənmiş link adminə də
                    «etibarsız» görünsün).
   getOwnerLink   — admin: linki al (yoxdursa yaranır, varsa eynisi qayıdır).
   rotateOwnerLink — admin: yeni açar, köhnə link dərhal bağlanır.
   ───────────────────────────────────────────────────────────────────────── */

import { adminHeaders, toApiError } from './api'
import { ownerHeaders } from './ownerKey'

const BASE = import.meta.env.VITE_API_URL || '/api'

export async function getOwnerPanel(slug) {
  const res = await fetch(`${BASE}/owner_panel.php?slug=${encodeURIComponent(slug)}`, {
    headers: ownerHeaders(slug),
    cache: 'no-store',
  })
  if (!res.ok) throw await toApiError(res)
  return res.json()
}

export async function getOwnerLink(slug) {
  const res = await fetch(`${BASE}/owner_link.php?slug=${encodeURIComponent(slug)}`, {
    headers: adminHeaders(),
    cache: 'no-store',
  })
  if (!res.ok) throw await toApiError(res)
  return res.json()
}

export async function rotateOwnerLink(slug) {
  const res = await fetch(`${BASE}/owner_link.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders() },
    body: JSON.stringify({ slug, action: 'rotate' }),
  })
  if (!res.ok) throw await toApiError(res)
  return res.json()
}
