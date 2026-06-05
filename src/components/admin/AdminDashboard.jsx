import { useState, useEffect } from 'react'
import { getDashboardStats } from '../../utils/api'
import { ShoppingBag, CheckCircle, XCircle, Clock, FileText, Image, TrendingUp, RefreshCw } from 'lucide-react'

function StatCard({ icon: Icon, label, value, sub, color = 'oklch(45% 0.07 75)' }) {
  return (
    <div style={{
      background: 'white', border: '1px solid oklch(88% 0.02 60)',
      borderRadius: 6, padding: '20px 24px',
      display: 'flex', alignItems: 'flex-start', gap: 14,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 6,
        background: 'oklch(96% 0.02 80)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={16} strokeWidth={1.5} style={{ color }} />
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 300, color: 'oklch(18% 0.02 60)', lineHeight: 1.1 }}>
          {value ?? '—'}
        </div>
        <div style={{ fontSize: 11, color: 'oklch(50% 0.03 60)', letterSpacing: '0.04em', marginTop: 3 }}>
          {label}
        </div>
        {sub != null && (
          <div style={{ fontSize: 10, color: 'oklch(60% 0.04 145)', marginTop: 4, letterSpacing: '0.03em' }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  )
}

function PkgBar({ label, value, max }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  const PKG_COLORS = {
    SADE: 'oklch(65% 0.08 75)', VIP: 'oklch(60% 0.1 80)', PREMIUM: 'oklch(55% 0.12 85)',
  }
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 11, color: 'oklch(40% 0.03 60)', letterSpacing: '0.04em' }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'oklch(30% 0.03 60)' }}>{value}</span>
      </div>
      <div style={{ height: 5, background: 'oklch(92% 0.01 80)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: PKG_COLORS[label] || 'oklch(60% 0.09 80)',
          borderRadius: 3, transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  )
}

function MiniChart({ daily }) {
  if (!daily?.length) return (
    <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: 11, color: 'oklch(65% 0.03 60)' }}>Məlumat yoxdur</span>
    </div>
  )
  const max = Math.max(...daily.map(d => d.cnt), 1)
  const days = ['B', 'Ç.A', 'Ç', 'C.A', 'C', 'Ş', 'B']
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 70, paddingTop: 8 }}>
      {daily.map((d, i) => {
        const h = Math.max(Math.round((d.cnt / max) * 54), 4)
        const dayLabel = new Date(d.day).toLocaleDateString('az-AZ', { weekday: 'short' })
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: '100%', height: h, background: 'oklch(68% 0.1 80)',
              borderRadius: '2px 2px 0 0', transition: 'height 0.4s ease',
              position: 'relative',
            }}
              title={`${d.day}: ${d.cnt} sifariş`}
            />
            <span style={{ fontSize: 9, color: 'oklch(60% 0.03 60)', letterSpacing: '0.02em' }}>
              {dayLabel}
            </span>
          </div>
        )
      })}
    </div>
  )
}

const PKG_LABELS = { SADE: 'Sadə (59₼)', VIP: 'VİP (89₼)', PREMIUM: 'Premium (129₼)' }

export default function AdminDashboard() {
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  const load = () => {
    setLoading(true)
    setError('')
    getDashboardStats()
      .then(d => { setStats(d); setLoading(false) })
      .catch(() => { setError('Statistika yüklənmədi.'); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const pkgMax = stats ? Math.max(...Object.values(stats.packages || {}), 1) : 1

  return (
    <div style={{ padding: '32px 36px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{
            fontFamily: '"Cormorant Garamond","Playfair Display",serif',
            fontSize: 24, fontWeight: 300, color: 'oklch(20% 0.02 60)',
            margin: 0, letterSpacing: '-0.01em',
          }}>
            Dashboard
          </h1>
          <p style={{ fontSize: 12, color: 'oklch(55% 0.03 60)', margin: '4px 0 0' }}>
            Ümumi statistika
          </p>
        </div>
        <button type="button" onClick={load}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
            background: 'white', border: '1px solid oklch(85% 0.02 60)', borderRadius: 4,
            cursor: 'pointer', fontSize: 11, color: 'oklch(45% 0.03 60)',
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}
        >
          <RefreshCw size={12} strokeWidth={1.5} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          Yenilə
        </button>
      </div>

      {error && (
        <div style={{ padding: '20px', background: 'oklch(97% 0.02 25)', borderRadius: 6, color: 'oklch(40% 0.1 25)', fontSize: 13, marginBottom: 24 }}>
          {error}
        </div>
      )}

      {/* Ana stat kartları */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <StatCard icon={ShoppingBag} label="Ümumi sifariş"   value={stats?.orders.total}     sub={`Bu gün: ${stats?.orders.today ?? 0}`}     color="oklch(45% 0.07 75)" />
        <StatCard icon={Clock}       label="Gözləyən"         value={stats?.orders.submitted} sub={`Son 7 gün: ${stats?.orders.last7days ?? 0}`} color="oklch(45% 0.08 70)" />
        <StatCard icon={CheckCircle} label="Təsdiqlənmiş"    value={stats?.orders.approved}  color="oklch(38% 0.1 145)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
        <StatCard icon={XCircle}  label="Rədd edildi"  value={stats?.orders.rejected}  color="oklch(40% 0.12 25)" />
        <StatCard icon={FileText} label="Dəvətnamələr"  value={stats?.invitations}      color="oklch(45% 0.08 210)" />
        <StatCard icon={Image}    label="Fotolar"        value={stats?.photos}           color="oklch(45% 0.08 300)" />
      </div>

      {/* Alt bölmə — Paket + mini chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Paket bölgüsü */}
        <div style={{ background: 'white', border: '1px solid oklch(88% 0.02 60)', borderRadius: 6, padding: '20px 24px' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'oklch(50% 0.03 60)', marginBottom: 16 }}>
            Paket bölgüsü
          </div>
          {stats?.packages && Object.keys(stats.packages).length > 0
            ? Object.entries(stats.packages).map(([pkg, cnt]) => (
                <PkgBar key={pkg} label={pkg} value={cnt} max={pkgMax} />
              ))
            : <p style={{ fontSize: 12, color: 'oklch(65% 0.03 60)' }}>Məlumat yoxdur</p>
          }
        </div>

        {/* Həftəlik trənd */}
        <div style={{ background: 'white', border: '1px solid oklch(88% 0.02 60)', borderRadius: 6, padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
            <TrendingUp size={13} strokeWidth={1.5} style={{ color: 'oklch(60% 0.08 80)' }} />
            <span style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'oklch(50% 0.03 60)' }}>
              Son 7 gün
            </span>
          </div>
          <MiniChart daily={stats?.daily} />
        </div>
      </div>
    </div>
  )
}
