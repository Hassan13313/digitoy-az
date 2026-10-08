import { useState } from 'react'
import { adminLogin } from '../../utils/api'
import LoginView from './v2/AdminLoginGate'

/* Admin girişi — UI redesign 2026-10 (görünüş v2/AdminLoginGate).
   Məntiq dəyişməyib: açar söz → admin_login.php → token sessionStorage-a.
   Server 15 dəqiqədə 10 cəhddən sonra 429 qaytarır → «kilidli» vəziyyəti. */
export default function AdminLoginGate({ onSuccess }) {
  const [state, setState] = useState('idle') /* idle | loading | error | locked */

  const handleSubmit = async (key) => {
    const k = String(key || '').trim()
    if (!k || state === 'loading') return
    setState('loading')
    try {
      const result = await adminLogin(k)
      sessionStorage.setItem('adminToken',    result.token)
      sessionStorage.setItem('adminTokenExp', String(result.exp))
      onSuccess()
    } catch (e) {
      setState(/: 429$/.test(String(e?.message || '')) ? 'locked' : 'error')
    }
  }

  return (
    <div className="dt-page">
      <LoginView
        state={state}
        onSubmit={handleSubmit}
        errorText="Açar söz yanlışdır."
        onBackToSite={() => { window.location.href = '/' }}
      />
    </div>
  )
}
