import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from './lib/useAuth'
import { api } from './lib/api'
import FloatingChat from './FloatingChat'

type Txn = { id: string; type: string; amount: number; currency: string; status: string; createdAt: string; note: string }
type DepositMethods = Record<string, any>

const PACKAGES = [
  { name: 'Foundation', amount: '$500', weekly: '$150', rate: '30%', highlight: false },
  { name: 'Growth',     amount: '$1,000', weekly: '$300', rate: '30%', highlight: false },
  { name: 'Premier',   amount: '$5,000', weekly: '$1,500', rate: '30%', highlight: true, badge: 'Most Popular' },
  { name: 'Elite',     amount: '$100,000', weekly: '$30,000', rate: '30%', highlight: false },
]

// ── Shared style helpers ──────────────────────────────────────────────────
const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  background: '#111316', border: '1px solid #1A1D22', borderRadius: 6, ...extra,
})

function Stat({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div style={card({ padding: '24px 28px' })}>
      <p style={{ fontSize: 11, color: '#7A7570', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px' }}>{label}</p>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: accent ? '#C9A84C' : '#F5F0E8', margin: '0 0 4px' }}>{value}</p>
      {sub && <p style={{ fontSize: 12, color: '#3A9E66', margin: 0 }}>{sub}</p>}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    completed: { bg: 'rgba(45,122,79,0.15)', color: '#3A9E66' },
    pending:   { bg: 'rgba(201,168,76,0.12)', color: '#C9A84C' },
    rejected:  { bg: 'rgba(220,38,38,0.12)', color: '#F87171' },
  }
  const s = map[status] || map.pending
  return (
    <span style={{ ...s, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
      {status}
    </span>
  )
}

// ── Deposit Modal ─────────────────────────────────────────────────────────

function DepositModal({ userId, solanaAddress, onClose }: { userId: string; solanaAddress: string; onClose: () => void }) {
  const [methods, setMethods] = useState<DepositMethods | null>(null)
  const [active, setActive] = useState('bitcoin')
  const [copied, setCopied] = useState('')

  useEffect(() => {
    api.getDepositMethods().then(setMethods)
  }, [])

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key); setTimeout(() => setCopied(''), 2000)
  }

  const tabs = methods ? Object.entries(methods).filter(([, v]) => v) : []

  const iconMap: Record<string, string> = {
    bitcoin: '₿', usdt: '₮', eth: 'Ξ', solana: '◎', bank: '🏦'
  }

  const method = methods?.[active]

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#111316', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
        <div style={{ padding: '24px 28px', borderBottom: '1px solid #1A1D22', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: '#F5F0E8', margin: 0 }}>Make a Deposit</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#7A7570', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: 4 }}>×</button>
        </div>

        {!methods ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#7A7570' }}>Loading methods…</div>
        ) : (
          <>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #1A1D22', overflowX: 'auto' }}>
              {tabs.map(([key, val]) => (
                <button key={key} onClick={() => setActive(key)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '14px 18px', fontSize: 13, fontWeight: 500,
                  color: active === key ? '#C9A84C' : '#7A7570',
                  borderBottom: active === key ? '2px solid #C9A84C' : '2px solid transparent',
                  transition: 'color 0.2s', whiteSpace: 'nowrap', fontFamily: 'var(--font-body)',
                }}>
                  <span style={{ marginRight: 6 }}>{iconMap[key] || '●'}</span>
                  {val.label || key}
                </button>
              ))}
            </div>

            <div style={{ padding: '28px' }}>
              {!method?.enabled ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div style={{ fontSize: 40, marginBottom: 16 }}>🔒</div>
                  <p style={{ color: '#7A7570', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                    This deposit method is currently unavailable. Please use our other deposit methods or contact your account manager.
                  </p>
                </div>
              ) : active === 'solana' ? (
                <div>
                  {!solanaAddress ? (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                      <p style={{ color: '#7A7570', fontSize: 14 }}>Your personal Solana address is being assigned. Contact your account manager to expedite.</p>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize: 13, color: '#C8C2B5', lineHeight: 1.7, margin: '0 0 20px' }}>
                        Send <strong style={{ color: '#C9A84C' }}>SOL only</strong> to your personal deposit address below. This address is exclusively assigned to you — do not share it.
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                        <div style={{ background: '#fff', padding: 12, borderRadius: 4 }}>
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(solanaAddress)}`}
                            alt="Solana deposit address QR"
                            width={160} height={160}
                          />
                        </div>
                      </div>
                      <AddressRow label="Your Solana Address" value={solanaAddress} onCopy={() => copy(solanaAddress, 'sol')} copied={copied === 'sol'} />
                    </div>
                  )}
                </div>
              ) : active === 'bank' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <p style={{ fontSize: 13, color: '#C8C2B5', lineHeight: 1.7, margin: '0 0 8px' }}>
                    Transfer directly to our bank account. Include your registered email as the payment reference.
                  </p>
                  {[
                    { label: 'Bank Name', val: method.bankName },
                    { label: 'Account Name', val: method.accountName },
                    { label: 'Account Number', val: method.accountNumber },
                    { label: 'Routing Number', val: method.routing },
                    { label: 'SWIFT / BIC', val: method.swift },
                  ].map(row => (
                    <AddressRow key={row.label} label={row.label} value={row.val} onCopy={() => copy(row.val, row.label)} copied={copied === row.label} />
                  ))}
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: 13, color: '#C8C2B5', lineHeight: 1.7, margin: '0 0 16px' }}>
                    Send <strong style={{ color: '#C9A84C' }}>{method.label}</strong> to the address below.
                    {method.network && <span style={{ color: '#7A7570' }}> Network: {method.network}</span>}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                    <div style={{ background: '#fff', padding: 12, borderRadius: 4 }}>
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(method.address)}`}
                        alt={`${method.label} address QR`}
                        width={160} height={160}
                      />
                    </div>
                  </div>
                  <AddressRow label={`${method.label} Address`} value={method.address} onCopy={() => copy(method.address, active)} copied={copied === active} />
                </div>
              )}

              <div style={{ marginTop: 24, padding: '14px 16px', background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 4 }}>
                <p style={{ fontSize: 12, color: '#7A7570', margin: 0, lineHeight: 1.65 }}>
                  After sending funds, notify your account manager via the support chat. Deposits are typically confirmed within 1–3 business hours.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function AddressRow({ label, value, onCopy, copied }: { label: string; value: string; onCopy: () => void; copied: boolean }) {
  return (
    <div style={{ background: '#0B0C0E', border: '1px solid #2E3138', borderRadius: 4, padding: '12px 14px' }}>
      <p style={{ fontSize: 10, color: '#7A7570', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 6px' }}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <code style={{ flex: 1, fontSize: 12, color: '#C8C2B5', wordBreak: 'break-all', fontFamily: 'var(--font-mono)' }}>{value}</code>
        <button onClick={onCopy} style={{ flexShrink: 0, background: copied ? 'rgba(45,122,79,0.2)' : 'rgba(201,168,76,0.1)', border: `1px solid ${copied ? 'rgba(45,122,79,0.4)' : 'rgba(201,168,76,0.3)'}`, color: copied ? '#3A9E66' : '#C9A84C', borderRadius: 3, padding: '5px 10px', fontSize: 11, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-body)' }}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user, logout, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'overview' | 'deposit' | 'packages' | 'profile'>('overview')
  const [txns, setTxns] = useState<Txn[]>([])
  const [showDeposit, setShowDeposit] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!user) return
    if (user.role === 'admin') { navigate('/admin'); return }
    api.getTransactions(user.id).then(setTxns)
  }, [user, navigate])

  const handleLogout = async () => {
    await logout(); navigate('/')
  }

  if (!user) return (
    <div style={{ minHeight: '100vh', background: '#0B0C0E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#C9A84C', fontSize: 14 }}>Loading…</div>
    </div>
  )

  const nextPayout = (() => {
    const d = new Date(); d.setDate(d.getDate() + (7 - d.getDay()))
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
  })()

  const navItems = [
    { key: 'overview',  icon: '◈', label: 'Overview' },
    { key: 'deposit',   icon: '↑', label: 'Deposit' },
    { key: 'packages',  icon: '◆', label: 'Packages' },
    { key: 'profile',   icon: '○', label: 'Profile' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0B0C0E', display: 'flex' }}>
      {/* Sidebar overlay on mobile */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 99 }} />}

      {/* Sidebar */}
      <aside style={{
        width: 240, background: '#0B0C0E', borderRight: '1px solid #1A1D22',
        display: 'flex', flexDirection: 'column', flexShrink: 0,
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
        transform: sidebarOpen ? 'translateX(0)' : undefined,
        transition: 'transform 0.25s',
      }} className="sidebar">
        {/* Logo */}
        <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid #1A1D22' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: '#F5F0E8' }}>Black Diamond</span>
          </Link>
        </div>

        {/* User badge */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #1A1D22' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#0B0C0E', marginBottom: 10 }}>
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#F5F0E8', margin: '0 0 2px' }}>{user.firstName} {user.lastName}</p>
          <p style={{ fontSize: 11, color: '#7A7570', margin: 0 }}>{user.email}</p>
          <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(45,122,79,0.12)', border: '1px solid rgba(45,122,79,0.3)', borderRadius: 20, padding: '3px 10px' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#3A9E66' }} />
            <span style={{ fontSize: 10, color: '#3A9E66', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Active Investor</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(item => (
            <button key={item.key} onClick={() => { setTab(item.key as any); setSidebarOpen(false) }} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: tab === item.key ? 'rgba(201,168,76,0.1)' : 'transparent',
              border: 'none', borderRadius: 6, padding: '11px 14px',
              cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s', fontFamily: 'var(--font-body)',
              color: tab === item.key ? '#C9A84C' : '#7A7570',
              borderLeft: tab === item.key ? '2px solid #C9A84C' : '2px solid transparent',
            }}>
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              <span style={{ fontSize: 13, fontWeight: tab === item.key ? 500 : 400 }}>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid #1A1D22' }}>
          <button onClick={handleLogout} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            background: 'none', border: 'none', borderRadius: 6, padding: '11px 14px',
            cursor: 'pointer', color: '#7A7570', fontFamily: 'var(--font-body)', fontSize: 13,
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = '#F87171')}
            onMouseLeave={e => (e.currentTarget.style.color = '#7A7570')}
          >
            <span>⎋</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, marginLeft: 240, display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="dash-main">
        {/* Top bar */}
        <header style={{ background: '#0B0C0E', borderBottom: '1px solid #1A1D22', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 }}>
          <button onClick={() => setSidebarOpen(true)} className="menu-btn" style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <div style={{ width: 20, height: 2, background: '#C9A84C', marginBottom: 4 }} />
            <div style={{ width: 20, height: 2, background: '#C9A84C', marginBottom: 4 }} />
            <div style={{ width: 20, height: 2, background: '#C9A84C' }} />
          </button>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: '#F5F0E8', margin: 0 }}>
              {tab === 'overview' ? 'Portfolio Overview' : tab === 'deposit' ? 'Make a Deposit' : tab === 'packages' ? 'Investment Packages' : 'My Profile'}
            </h1>
          </div>
          <button onClick={() => setShowDeposit(true)} style={{
            background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', color: '#0B0C0E',
            border: 'none', borderRadius: 4, padding: '10px 20px', fontSize: 12,
            fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}>
            + Deposit
          </button>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>

          {/* Overview */}
          {tab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Stats grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }} className="stats-row">
                <Stat label="Total Balance" value={`$${user.balance.toLocaleString()}`} accent />
                <Stat label="Total Invested" value={`$${user.totalInvested.toLocaleString()}`} />
                <Stat label="Weekly Return" value={`$${user.weeklyReturn.toLocaleString()}`} sub="+30% per week" />
                <Stat label="Next Payout" value={nextPayout} />
              </div>

              {/* Return progress bar */}
              {user.balance > 0 && (
                <div style={card({ padding: '24px 28px' })}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 12, color: '#7A7570', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Retirement Threshold Progress</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#C9A84C' }}>${user.balance.toLocaleString()} / $300,000</span>
                  </div>
                  <div style={{ background: '#1A1D22', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min((user.balance / 300000) * 100, 100)}%`, background: 'linear-gradient(90deg,#C9A84C,#E8C96A)', borderRadius: 4, transition: 'width 1s ease' }} />
                  </div>
                  <p style={{ fontSize: 12, color: '#7A7570', margin: '10px 0 0' }}>
                    {user.balance >= 300000 ? '🎉 Retirement Package Activated!' : `$${(300000 - user.balance).toLocaleString()} remaining to unlock the Retirement Package`}
                  </p>
                </div>
              )}

              {/* Withdrawal */}
              <div style={card({ padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 })}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#F5F0E8', margin: '0 0 4px' }}>Withdrawal</p>
                  <p style={{ fontSize: 13, color: '#7A7570', margin: 0 }}>
                    {user.balance > 0 ? 'Ready to withdraw? Contact support to process your request.' : 'No funds available for withdrawal yet.'}
                  </p>
                </div>
                {user.balance > 0 ? (
                  <button onClick={() => setTab('overview')} style={{
                    background: 'transparent', border: '1px solid rgba(201,168,76,0.3)',
                    color: '#C9A84C', borderRadius: 4, padding: '10px 20px',
                    fontSize: 12, fontWeight: 600, letterSpacing: '0.06em',
                    textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-body)',
                    transition: 'border-color 0.2s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#C9A84C')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)')}
                    title="Use the support chat to request a withdrawal"
                  >
                    Contact Support to Withdraw
                  </button>
                ) : (
                  <span style={{ fontSize: 12, color: '#7A7570', fontStyle: 'italic' }}>Insufficient funds</span>
                )}
              </div>

              {/* Transactions */}
              <div style={card()}>
                <div style={{ padding: '20px 28px', borderBottom: '1px solid #1A1D22', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600, color: '#F5F0E8', margin: 0 }}>Transaction History</h3>
                </div>
                {txns.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#7A7570' }}>No transactions yet. Make your first deposit to get started.</div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #1A1D22' }}>
                          {['Date','Type','Amount','Currency','Status','Note'].map(h => (
                            <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, color: '#7A7570', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {txns.map((t, i) => (
                          <tr key={t.id} style={{ borderBottom: i < txns.length - 1 ? '1px solid #1A1D22' : 'none' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#141619')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          >
                            <td style={{ padding: '14px 20px', fontSize: 13, color: '#C8C2B5', fontFamily: 'var(--font-mono)' }}>
                              {new Date(t.createdAt).toLocaleDateString()}
                            </td>
                            <td style={{ padding: '14px 20px' }}>
                              <span style={{
                                fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                                background: t.type === 'deposit' ? 'rgba(201,168,76,0.1)' : t.type === 'return' ? 'rgba(45,122,79,0.12)' : 'rgba(220,38,38,0.1)',
                                color: t.type === 'deposit' ? '#C9A84C' : t.type === 'return' ? '#3A9E66' : '#F87171',
                                textTransform: 'capitalize',
                              }}>
                                {t.type}
                              </span>
                            </td>
                            <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: t.type === 'withdrawal' ? '#F87171' : '#F5F0E8', fontFamily: 'var(--font-mono)' }}>
                              {t.type === 'withdrawal' ? '-' : '+'}${t.amount.toLocaleString()}
                            </td>
                            <td style={{ padding: '14px 20px', fontSize: 12, color: '#7A7570' }}>{t.currency}</td>
                            <td style={{ padding: '14px 20px' }}><StatusBadge status={t.status} /></td>
                            <td style={{ padding: '14px 20px', fontSize: 13, color: '#7A7570', maxWidth: 200 }}>{t.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Deposit tab */}
          {tab === 'deposit' && (
            <div>
              <div style={{ maxWidth: 640, marginBottom: 24 }}>
                <p style={{ fontSize: 15, color: '#C8C2B5', lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
                  Choose a deposit method below. Your funds will be credited within 1–3 business hours after confirmation.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }} className="deposit-grid">
                {[
                  { key: 'bitcoin', icon: '₿', name: 'Bitcoin', sub: 'BTC Network' },
                  { key: 'usdt',    icon: '₮', name: 'USDT', sub: 'ERC-20 Network' },
                  { key: 'eth',     icon: 'Ξ', name: 'Ethereum', sub: 'ETH Network' },
                  { key: 'solana',  icon: '◎', name: 'Solana', sub: 'SOL Network' },
                  { key: 'bank',    icon: '🏦', name: 'Bank Transfer', sub: 'Wire / SWIFT' },
                ].map(m => (
                  <button key={m.key} onClick={() => setShowDeposit(true)} style={{
                    background: '#111316', border: '1px solid #1A1D22', borderRadius: 6,
                    padding: '24px 20px', textAlign: 'center', cursor: 'pointer',
                    transition: 'border-color 0.2s, transform 0.2s', fontFamily: 'var(--font-body)',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#1A1D22'; e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 10 }}>{m.icon}</div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#F5F0E8', margin: '0 0 4px' }}>{m.name}</p>
                    <p style={{ fontSize: 12, color: '#7A7570', margin: 0 }}>{m.sub}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Packages tab */}
          {tab === 'packages' && (
            <div>
              <p style={{ fontSize: 15, color: '#C8C2B5', lineHeight: 1.7, margin: '0 0 28px', fontWeight: 300, maxWidth: 540 }}>
                All packages deliver 30% weekly returns. Upgrade by making a new deposit at any time.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2 }} className="pkg-grid">
                {PACKAGES.map(pkg => (
                  <div key={pkg.name} style={{
                    position: 'relative',
                    background: pkg.highlight ? 'linear-gradient(160deg,#1C1810,#16140F)' : '#111316',
                    border: pkg.highlight ? '1px solid rgba(201,168,76,0.35)' : '1px solid #1A1D22',
                    borderRadius: 4, padding: '32px 24px',
                    transition: 'transform 0.2s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    {pkg.badge && (
                      <div style={{ position: 'absolute', top: -1, left: 24, right: 24, background: 'linear-gradient(90deg,#C9A84C,#E8C96A)', color: '#0B0C0E', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center', padding: '5px 0', borderRadius: '0 0 4px 4px' }}>
                        {pkg.badge}
                      </div>
                    )}
                    <div style={{ marginTop: pkg.badge ? 16 : 0 }}>
                      <p style={{ fontSize: 11, color: '#7A7570', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 10px' }}>{pkg.name}</p>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, color: pkg.highlight ? '#C9A84C' : '#F5F0E8', margin: '0 0 6px' }}>{pkg.amount}</p>
                      <p style={{ fontSize: 12, color: '#7A7570', margin: '0 0 20px' }}>minimum investment</p>
                      <div style={{ borderTop: '1px solid #2E3138', paddingTop: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontSize: 13, color: '#7A7570' }}>Weekly</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#C9A84C', fontFamily: 'var(--font-mono)' }}>{pkg.weekly}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 13, color: '#7A7570' }}>Rate</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#3A9E66', fontFamily: 'var(--font-mono)' }}>{pkg.rate}/week</span>
                        </div>
                      </div>
                      <button onClick={() => setShowDeposit(true)} style={{
                        display: 'block', width: '100%', marginTop: 20, padding: '11px 0',
                        background: pkg.highlight ? 'linear-gradient(135deg,#C9A84C,#E8C96A)' : 'transparent',
                        border: pkg.highlight ? 'none' : '1px solid rgba(201,168,76,0.3)',
                        color: pkg.highlight ? '#0B0C0E' : '#C9A84C',
                        borderRadius: 4, fontSize: 12, fontWeight: 600, letterSpacing: '0.08em',
                        textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-body)',
                      }}>
                        Invest Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile tab */}
          {tab === 'profile' && (
            <div style={{ maxWidth: 600 }}>
              <div style={card({ padding: '28px' })}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: '#F5F0E8', margin: '0 0 24px' }}>Account Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  {[
                    { label: 'First Name', val: user.firstName },
                    { label: 'Last Name', val: user.lastName },
                    { label: 'Email', val: user.email },
                    { label: 'Phone', val: user.phone },
                    { label: 'Country', val: user.country },
                    { label: 'State', val: user.state },
                    { label: 'Date of Birth', val: user.dob },
                    { label: 'Annual Revenue', val: user.annualRevenue },
                  ].map(f => (
                    <div key={f.label}>
                      <p style={{ fontSize: 11, color: '#7A7570', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 6px' }}>{f.label}</p>
                      <p style={{ fontSize: 14, color: '#F5F0E8', margin: 0 }}>{f.val || '—'}</p>
                    </div>
                  ))}
                </div>
                {user.address && (
                  <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #1A1D22' }}>
                    <p style={{ fontSize: 11, color: '#7A7570', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 6px' }}>Address</p>
                    <p style={{ fontSize: 14, color: '#F5F0E8', margin: 0 }}>{user.address}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {showDeposit && <DepositModal userId={user.id} solanaAddress={user.solanaAddress} onClose={() => setShowDeposit(false)} />}
      <FloatingChat userId={user.id} />

      <style>{`
        @media (max-width: 900px) {
          .sidebar { transform: translateX(-100%) !important; }
          .dash-main { margin-left: 0 !important; }
          .menu-btn { display: flex !important; flex-direction: column; }
          .stats-row { grid-template-columns: repeat(2,1fr) !important; }
          .pkg-grid  { grid-template-columns: repeat(2,1fr) !important; }
          .deposit-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 540px) {
          .stats-row { grid-template-columns: 1fr !important; }
          .pkg-grid  { grid-template-columns: 1fr !important; }
          .deposit-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
