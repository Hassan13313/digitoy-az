import { useState } from 'react'
import { adminLogin } from '../../utils/api'

export default function AdminLoginGate({ onSuccess }) {
  const [key,     setKey]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!key.trim() || loading) return
    setLoading(true)
    setError('')
    try {
      const result = await adminLogin(key.trim())
      sessionStorage.setItem('adminToken',    result.token)
      sessionStorage.setItem('adminTokenExp', String(result.exp))
      onSuccess()
    } catch {
      setError('Açar söz yanlışdır.')
      setKey('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'oklch(97% 0.008 80)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: '"Inter",system-ui,sans-serif',
    }}>
      <div style={{
        width: '100%', maxWidth: 360,
        background: 'white',
        border: '1px solid oklch(88% 0.02 60)',
        borderRadius: 6,
        overflow: 'hidden',
      }}>
        {/* Üst xətt */}
        <div style={{ height: 1, background: 'linear-gradient(to right,transparent,oklch(72% 0.12 80) 40%,oklch(72% 0.14 80) 50%,oklch(72% 0.12 80) 60%,transparent)' }} />

        <div style={{ padding: '36px 36px 32px' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <p style={{
              fontFamily: '"Cormorant Garamond","Playfair Display",serif',
              fontSize: 22, fontWeight: 300, letterSpacing: '0.1em',
              color: 'oklch(22% 0.02 60)', margin: 0,
            }}>
              Digitoy
            </p>
            <p style={{
              fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase',
              color: 'oklch(58% 0.04 75)', marginTop: 4,
            }}>
              Admin Panel
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label style={{
              display: 'block', fontSize: 10, fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'oklch(50% 0.03 60)', marginBottom: 8,
            }}>
              Açar söz
            </label>
            <input
              type="password"
              value={key}
              onChange={e => { setKey(e.target.value); setError('') }}
              placeholder="••••••••"
              autoFocus
              disabled={loading}
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '11px 14px',
                border: error ? '1px solid oklch(60% 0.15 25)' : '1px solid oklch(82% 0.02 60)',
                borderRadius: 3, outline: 'none',
                fontSize: 14, color: 'oklch(20% 0.02 60)',
                background: loading ? 'oklch(97% 0.01 80)' : 'white',
                letterSpacing: '0.2em',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => { if (!error) e.target.style.borderColor = 'oklch(72% 0.12 80)' }}
              onBlur={e => { if (!error) e.target.style.borderColor = 'oklch(82% 0.02 60)' }}
            />

            {error && (
              <p style={{
                fontSize: 11, color: 'oklch(45% 0.12 25)',
                marginTop: 6, letterSpacing: '0.04em',
              }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !key.trim()}
              style={{
                width: '100%', marginTop: 16,
                padding: '12px',
                background: loading || !key.trim()
                  ? 'oklch(88% 0.04 80)'
                  : 'oklch(72% 0.12 80)',
                border: 'none', borderRadius: 3,
                cursor: loading || !key.trim() ? 'not-allowed' : 'pointer',
                fontSize: 11, fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'white',
                transition: 'background 0.15s',
              }}
            >
              {loading ? 'Yoxlanılır...' : 'Daxil Ol'}
            </button>
          </form>
        </div>

        {/* Alt xətt */}
        <div style={{ height: 1, background: 'linear-gradient(to right,transparent,oklch(88% 0.03 75) 40%,oklch(88% 0.03 75) 60%,transparent)' }} />
      </div>
    </div>
  )
}
