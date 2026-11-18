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

/* ── 2026-11-18 — müştəri panelindən oturma planı redaktəsi (api/owner_seating.php) ──
   PİN bir dəfə yoxlanır → 12 saatlıq redaktə tokeni (bu tabda sessionStorage). */
const SEAT_TOKEN = 'dt_seat_tok_'

export function getSeatToken(slug) {
  try {
    const raw = sessionStorage.getItem(SEAT_TOKEN + slug) || ''
    const exp = Number(raw.split('.')[0]) || 0
    return exp * 1000 > Date.now() ? raw : null
  } catch { return null }
}
export function clearSeatToken(slug) {
  try { sessionStorage.removeItem(SEAT_TOKEN + slug) } catch { /* private mode */ }
}

export async function ownerSeating(slug, action, data = {}) {
  const token = action === 'unlock' ? undefined : getSeatToken(slug)
  const res = await fetch(`${BASE}/owner_seating.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...ownerHeaders(slug) },
    body: JSON.stringify({ slug, action, token, ...data }),
  })
  if (res.status === 401) clearSeatToken(slug)
  if (!res.ok) throw await toApiError(res)
  const json = await res.json()
  if (action === 'unlock' && json.token) {
    try { sessionStorage.setItem(SEAT_TOKEN + slug, json.token) } catch { /* private mode */ }
  }
  return json
}

/* admin: yeni redaktə PİN-i (bir dəfə göstərilir) */
export async function createSeatingPin(slug) {
  const res = await fetch(`${BASE}/owner_link.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders() },
    body: JSON.stringify({ slug, action: 'pin' }),
  })
  if (!res.ok) throw await toApiError(res)
  return res.json()
}
