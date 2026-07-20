import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from './lib/useAuth'
import { api } from './lib/api'
import FloatingChat from './FloatingChat'

type User = { id: string; email: string; firstName: string; lastName: string; role: string; balance: number; totalInvested: number; weeklyReturn: number; solanaAddress: string; country: string; phone: string; createdAt: string; annualRevenue: string; dob: string; state: string; address: string; otherNames: string; mothersMaidenName: string }
type Methods = Record<string, any>
type Settings = { supportEmail: string }
type ChatThread = { userId: string; userName: string; userEmail: string; messages: any[] }

// ── Helpers ───────────────────────────────────────────────────────────────
const cell: React.CSSProperties = { padding: '14px 18px', fontSize: 13, color: '#C8C2B5', borderBottom: '1px solid #1A1D22' }
const th: React.CSSProperties = { padding: '12px 18px', fontSize: 11, color: '#7A7570', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500, borderBottom: '1px solid #1A1D22', textAlign: 'left' }
const inputSt: React.CSSProperties = { width: '100%', background: '#0B0C0E', border: '1px solid #2E3138', borderRadius: 4, padding: '11px 14px', fontSize: 13, color: '#F5F0E8', outline: 'none', fontFamily: 'var(--font-body)', boxSizing: 'border-box', transition: 'border-color 0.2s' }
const card = (extra?: React.CSSProperties): React.CSSProperties => ({ background: '#111316', border: '1px solid #1A1D22', borderRadius: 6, ...extra })

function GoldBtn({ children, onClick, disabled, outline }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; outline?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: outline ? 'transparent' : (disabled ? '#2E3138' : 'linear-gradient(135deg,#C9A84C,#E8C96A)'),
      color: disabled ? '#7A7570' : (outline ? '#C9A84C' : '#0B0C0E'),
      border: outline ? '1px solid rgba(201,168,76,0.35)' : 'none',
      borderRadius: 4, padding: '9px 18px', fontSize: 12, fontWeight: 600,
      letterSpacing: '0.06em', textTransform: 'uppercase',
      cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)',
      transition: 'opacity 0.2s',
    }}>{children}</button>
  )
}

// ── Users Tab ─────────────────────────────────────────────────────────────
function UsersTab() {
  const [users, setUsers] = useState<User[]>([])
  const [selected, setSelected] = useState<User | null>(null)
  const [editing, setEditing] = useState<Partial<User>>({})
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [txnUser, setTxnUser] = useState<string | null>(null)
  const [txnForm, setTxnForm] = useState({ type: 'return', amount: '', currency: 'USD', note: '' })
  const [addingTxn, setAddingTxn] = useState(false)

  useEffect(() => { api.getUsers().then(u => Array.isArray(u) && setUsers(u)) }, [])

  const openUser = (u: User) => { setSelected(u); setEditing(u) }

  const save = async () => {
    if (!selected) return
    setSaving(true)
    const res = await api.updateUser(selected.id, editing)
    if (!res.error) {
      setUsers(us => us.map(u => u.id === res.id ? res : u))
      setSelected(res); setEditing(res)
    }
    setSaving(false)
  }

  const addTxn = async () => {
    if (!txnUser || !txnForm.amount) return
    setAddingTxn(true)
    await api.addTransaction({ userId: txnUser, ...txnForm, amount: parseFloat(txnForm.amount) })
    setAddingTxn(false); setTxnUser(null); setTxnForm({ type: 'return', amount: '', currency: 'USD', note: '' })
  }

  const filtered = users.filter(u => u.role !== 'admin' && (
    u.firstName.toLowerCase().includes(search.toLowerCase()) ||
    u.lastName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  ))

  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
      {/* Users list */}
      <div style={{ flex: 1, ...card() }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1A1D22', display: 'flex', gap: 12, alignItems: 'center' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search investors…" style={{ ...inputSt, flex: 1 }}
            onFocus={e => (e.target.style.borderColor = '#C9A84C')} onBlur={e => (e.target.style.borderColor = '#2E3138')} />
          <span style={{ fontSize: 12, color: '#7A7570', whiteSpace: 'nowrap' }}>{filtered.length} investors</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Investor','Country','Balance','Invested','Weekly','Actions'].map(h => <th key={h} style={th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}
                  onMouseEnter={e => (e.currentTarget.style.background = '#141619')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={cell}>
                    <p style={{ margin: '0 0 2px', color: '#F5F0E8', fontWeight: 500 }}>{u.firstName} {u.lastName}</p>
                    <p style={{ margin: 0, fontSize: 11, color: '#7A7570' }}>{u.email}</p>
                  </td>
                  <td style={cell}>{u.country || '—'}</td>
                  <td style={{ ...cell, color: '#C9A84C', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>${u.balance.toLocaleString()}</td>
                  <td style={{ ...cell, fontFamily: 'var(--font-mono)' }}>${u.totalInvested.toLocaleString()}</td>
                  <td style={{ ...cell, color: '#3A9E66', fontFamily: 'var(--font-mono)' }}>${u.weeklyReturn.toLocaleString()}</td>
                  <td style={cell}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <GoldBtn onClick={() => openUser(u)} outline>Edit</GoldBtn>
                      <GoldBtn onClick={() => setTxnUser(u.id)} outline>+ Txn</GoldBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit panel */}
      {selected && (
        <div style={{ width: 320, ...card({ padding: '20px', flexShrink: 0 }) }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: '#F5F0E8', margin: 0 }}>{selected.firstName} {selected.lastName}</h4>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#7A7570', cursor: 'pointer', fontSize: 16 }}>×</button>
          </div>
          {[
            { label: 'Balance ($)', key: 'balance', type: 'number' },
            { label: 'Total Invested ($)', key: 'totalInvested', type: 'number' },
            { label: 'Weekly Return ($)', key: 'weeklyReturn', type: 'number' },
            { label: 'Solana Address', key: 'solanaAddress', type: 'text' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: '#7A7570', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{f.label}</label>
              <input
                type={f.type}
                value={(editing as any)[f.key] ?? ''}
                onChange={e => setEditing(ed => ({ ...ed, [f.key]: f.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value }))}
                style={inputSt}
                onFocus={e => (e.target.style.borderColor = '#C9A84C')}
                onBlur={e => (e.target.style.borderColor = '#2E3138')}
              />
            </div>
          ))}

          {/* Read-only details */}
          <div style={{ borderTop: '1px solid #1A1D22', paddingTop: 14, marginBottom: 16 }}>
            {[
              { label: 'Phone', val: selected.phone },
              { label: 'DOB', val: selected.dob },
              { label: 'Address', val: selected.address },
              { label: 'Revenue', val: selected.annualRevenue },
              { label: "Mother's Maiden", val: selected.mothersMaidenName },
              { label: 'Member Since', val: new Date(selected.createdAt).toLocaleDateString() },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: 10 }}>
                <p style={{ fontSize: 10, color: '#7A7570', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 2px' }}>{f.label}</p>
                <p style={{ fontSize: 12, color: '#C8C2B5', margin: 0 }}>{f.val || '—'}</p>
              </div>
            ))}
          </div>

          <GoldBtn onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</GoldBtn>
        </div>
      )}

      {/* Add Transaction modal */}
      {txnUser && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#111316', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, padding: '28px', width: '100%', maxWidth: 380 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: '#F5F0E8', margin: 0 }}>Add Transaction</h4>
              <button onClick={() => setTxnUser(null)} style={{ background: 'none', border: 'none', color: '#7A7570', cursor: 'pointer', fontSize: 16 }}>×</button>
            </div>
            {[
              { label: 'Type', key: 'type', el: 'select', opts: ['deposit','return','withdrawal'] },
              { label: 'Amount ($)', key: 'amount', el: 'input', type: 'number' },
              { label: 'Currency', key: 'currency', el: 'input', type: 'text' },
              { label: 'Note', key: 'note', el: 'input', type: 'text' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, color: '#7A7570', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{f.label}</label>
                {f.el === 'select' ? (
                  <select value={(txnForm as any)[f.key]} onChange={e => setTxnForm(t => ({ ...t, [f.key]: e.target.value }))} style={{ ...inputSt, cursor: 'pointer' }}
                    onFocus={e => (e.target.style.borderColor = '#C9A84C')} onBlur={e => (e.target.style.borderColor = '#2E3138')}>
                    {f.opts!.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type={f.type} value={(txnForm as any)[f.key]} onChange={e => setTxnForm(t => ({ ...t, [f.key]: e.target.value }))} style={inputSt}
                    onFocus={e => (e.target.style.borderColor = '#C9A84C')} onBlur={e => (e.target.style.borderColor = '#2E3138')} />
                )}
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button onClick={() => setTxnUser(null)} style={{ flex: 1, background: 'none', border: '1px solid #2E3138', color: '#C8C2B5', borderRadius: 4, padding: '10px', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Cancel</button>
              <div style={{ flex: 1 }}><GoldBtn onClick={addTxn} disabled={addingTxn}>{addingTxn ? 'Adding…' : 'Add'}</GoldBtn></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Deposit Methods Tab ───────────────────────────────────────────────────
function DepositMethodsTab() {
  const [methods, setMethods] = useState<Methods | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { api.getDepositMethods().then(m => m && !m.error && setMethods(m)) }, [])

  const save = async () => {
    if (!methods) return
    setSaving(true)
    await api.updateDepositMethods(methods)
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  const updateField = (method: string, field: string, value: any) =>
    setMethods(m => m ? { ...m, [method]: { ...m[method], [field]: value } } : m)

  if (!methods) return <div style={{ padding: 40, color: '#7A7570' }}>Loading…</div>

  const methodConfig: Record<string, { label: string; fields: { key: string; label: string; type?: string }[] }> = {
    bitcoin: { label: 'Bitcoin (BTC)', fields: [{ key: 'address', label: 'Deposit Address' }] },
    usdt:    { label: 'USDT', fields: [{ key: 'address', label: 'Deposit Address' }, { key: 'network', label: 'Network (e.g. ERC-20)' }] },
    eth:     { label: 'Ethereum (ETH)', fields: [{ key: 'address', label: 'Deposit Address' }] },
    solana:  { label: 'Solana (SOL)', fields: [] },
    bank:    { label: 'Bank Transfer', fields: [{ key: 'bankName', label: 'Bank Name' }, { key: 'accountName', label: 'Account Name' }, { key: 'accountNumber', label: 'Account Number' }, { key: 'routing', label: 'Routing Number' }, { key: 'swift', label: 'SWIFT / BIC' }] },
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 700 }}>
      {Object.entries(methodConfig).map(([key, cfg]) => (
        <div key={key} style={card({ padding: '20px 24px' })}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: cfg.fields.length ? 16 : 0 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#F5F0E8', margin: '0 0 2px' }}>{cfg.label}</p>
              {key === 'solana' && <p style={{ fontSize: 12, color: '#7A7570', margin: 0 }}>Addresses are assigned per-user in the Users tab</p>}
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <span style={{ fontSize: 12, color: methods[key]?.enabled ? '#3A9E66' : '#7A7570' }}>
                {methods[key]?.enabled ? 'Enabled' : 'Disabled'}
              </span>
              <div
                onClick={() => updateField(key, 'enabled', !methods[key]?.enabled)}
                style={{
                  width: 40, height: 22, borderRadius: 11, cursor: 'pointer', transition: 'background 0.2s',
                  background: methods[key]?.enabled ? '#2D7A4F' : '#2E3138',
                  position: 'relative',
                }}
              >
                <div style={{
                  position: 'absolute', top: 3, width: 16, height: 16, borderRadius: '50%',
                  background: '#fff', transition: 'left 0.2s',
                  left: methods[key]?.enabled ? 21 : 3,
                }} />
              </div>
            </label>
          </div>
          {cfg.fields.map(f => (
            <div key={f.key} style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, color: '#7A7570', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{f.label}</label>
              <input
                value={methods[key]?.[f.key] || ''}
                onChange={e => updateField(key, f.key, e.target.value)}
                style={inputSt}
                onFocus={e => (e.target.style.borderColor = '#C9A84C')}
                onBlur={e => (e.target.style.borderColor = '#2E3138')}
              />
            </div>
          ))}
        </div>
      ))}
      <div>
        <GoldBtn onClick={save} disabled={saving}>{saving ? 'Saving…' : saved ? '✓ Saved' : 'Save All Methods'}</GoldBtn>
      </div>
    </div>
  )
}

// ── Messages Tab ──────────────────────────────────────────────────────────
function MessagesTab({ adminId }: { adminId: string }) {
  const [threads, setThreads] = useState<ChatThread[]>([])
  const [active, setActive] = useState<string | null>(null)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)

  const load = () => api.getAllChats().then(c => Array.isArray(c) && setThreads(c))
  useEffect(() => { load(); const iv = setInterval(load, 10000); return () => clearInterval(iv) }, [])

  const sendReply = async () => {
    if (!active || !reply.trim()) return
    setSending(true)
    await api.sendChat(active, reply.trim())
    setReply(''); setSending(false); load()
  }

  const activeThread = threads.find(t => t.userId === active)

  return (
    <div style={{ display: 'flex', gap: 16, height: 560 }}>
      {/* Thread list */}
      <div style={{ width: 220, ...card({ overflowY: 'auto', flexShrink: 0 }) }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #1A1D22' }}>
          <p style={{ fontSize: 11, color: '#7A7570', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>Conversations ({threads.length})</p>
        </div>
        {threads.length === 0 ? (
          <p style={{ padding: '20px 16px', fontSize: 13, color: '#7A7570' }}>No messages yet.</p>
        ) : threads.map(t => (
          <button key={t.userId} onClick={() => setActive(t.userId)} style={{
            width: '100%', background: active === t.userId ? 'rgba(201,168,76,0.08)' : 'none',
            border: 'none', borderLeft: active === t.userId ? '2px solid #C9A84C' : '2px solid transparent',
            padding: '12px 16px', textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}>
            <p style={{ fontSize: 13, color: '#F5F0E8', margin: '0 0 2px', fontWeight: 500 }}>{t.userName}</p>
            <p style={{ fontSize: 11, color: '#7A7570', margin: 0 }}>{t.messages.length} msg{t.messages.length !== 1 ? 's' : ''}</p>
          </button>
        ))}
      </div>

      {/* Chat view */}
      <div style={{ flex: 1, ...card({ display: 'flex', flexDirection: 'column' }) }}>
        {!active ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7A7570', fontSize: 14 }}>
            Select a conversation
          </div>
        ) : (
          <>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #1A1D22' }}>
              <p style={{ fontWeight: 600, color: '#F5F0E8', margin: '0 0 2px', fontSize: 14 }}>{activeThread?.userName}</p>
              <p style={{ fontSize: 12, color: '#7A7570', margin: 0 }}>{activeThread?.userEmail}</p>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {activeThread?.messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', justifyContent: msg.isAdmin ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '75%',
                    background: msg.isAdmin ? 'linear-gradient(135deg,#C9A84C,#E8C96A)' : '#1A1D22',
                    color: msg.isAdmin ? '#0B0C0E' : '#F5F0E8',
                    padding: '10px 14px', borderRadius: 8,
                    fontSize: 13, lineHeight: 1.5,
                  }}>
                    <p style={{ margin: 0 }}>{msg.message}</p>
                    <p style={{ fontSize: 10, color: msg.isAdmin ? 'rgba(0,0,0,0.45)' : '#7A7570', margin: '4px 0 0' }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {msg.senderName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '12px', borderTop: '1px solid #1A1D22', display: 'flex', gap: 8 }}>
              <input value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendReply())}
                placeholder="Reply as support agent…" style={{ ...inputSt, flex: 1, borderRadius: 20 }}
                onFocus={e => (e.target.style.borderColor = '#C9A84C')} onBlur={e => (e.target.style.borderColor = '#2E3138')} />
              <GoldBtn onClick={sendReply} disabled={sending || !reply.trim()}>Send</GoldBtn>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Settings Tab ──────────────────────────────────────────────────────────
function SettingsTab() {
  const [settings, setSettings] = useState<Settings>({ supportEmail: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { api.getAdminSettings().then(s => s && !s.error && setSettings(s)) }, [])

  const save = async () => {
    setSaving(true)
    await api.updateAdminSettings(settings)
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <div style={card({ padding: '24px' })}>
        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: '#F5F0E8', margin: '0 0 20px' }}>Support Settings</h4>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 11, color: '#7A7570', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Support Email</label>
          <input value={settings.supportEmail} onChange={e => setSettings(s => ({ ...s, supportEmail: e.target.value }))} type="email" style={inputSt}
            onFocus={e => (e.target.style.borderColor = '#C9A84C')} onBlur={e => (e.target.style.borderColor = '#2E3138')} />
          <p style={{ fontSize: 12, color: '#7A7570', margin: '8px 0 0' }}>Chat messages are logged and visible in the Messages tab.</p>
        </div>
        <GoldBtn onClick={save} disabled={saving}>{saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Settings'}</GoldBtn>
      </div>
    </div>
  )
}

// ── Main Admin ────────────────────────────────────────────────────────────
export default function Admin() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'users'|'methods'|'messages'|'settings'>('users')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/dashboard')
  }, [user, navigate])

  const handleLogout = async () => { await logout(); navigate('/') }

  if (!user) return null

  const navItems = [
    { key: 'users',    icon: '◈', label: 'Investors' },
    { key: 'methods',  icon: '₿', label: 'Deposit Methods' },
    { key: 'messages', icon: '💬', label: 'Messages' },
    { key: 'settings', icon: '⚙', label: 'Settings' },
  ]

  const tabTitle: Record<string, string> = {
    users: 'Investor Management',
    methods: 'Deposit Methods',
    messages: 'Support Messages',
    settings: 'Admin Settings',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0B0C0E', display: 'flex' }}>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 99 }} />}

      <aside style={{ width: 240, background: '#0B0C0E', borderRight: '1px solid #1A1D22', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100 }} className="sidebar">
        <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid #1A1D22' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: '#F5F0E8' }}>Black Diamond</span>
          </Link>
        </div>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #1A1D22' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#F5F0E8', margin: '0 0 4px' }}>{user.firstName} {user.lastName}</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 20, padding: '3px 10px' }}>
            <span style={{ fontSize: 10, color: '#C9A84C', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Administrator</span>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(item => (
            <button key={item.key} onClick={() => { setTab(item.key as any); setSidebarOpen(false) }} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: tab === item.key ? 'rgba(201,168,76,0.1)' : 'transparent',
              border: 'none', borderRadius: 6, padding: '11px 14px',
              cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-body)',
              color: tab === item.key ? '#C9A84C' : '#7A7570',
              borderLeft: tab === item.key ? '2px solid #C9A84C' : '2px solid transparent',
            }}>
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              <span style={{ fontSize: 13, fontWeight: tab === item.key ? 500 : 400 }}>{item.label}</span>
            </button>
          ))}
        </nav>
        <div style={{ padding: '16px 12px', borderTop: '1px solid #1A1D22' }}>
          <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', borderRadius: 6, padding: '11px 14px', cursor: 'pointer', color: '#7A7570', fontFamily: 'var(--font-body)', fontSize: 13 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#F87171')}
            onMouseLeave={e => (e.currentTarget.style.color = '#7A7570')}
          >
            <span>⎋</span> Sign Out
          </button>
        </div>
      </aside>

      <div style={{ flex: 1, marginLeft: 240, display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="dash-main">
        <header style={{ background: '#0B0C0E', borderBottom: '1px solid #1A1D22', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, zIndex: 50 }}>
          <button onClick={() => setSidebarOpen(true)} className="menu-btn" style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <div style={{ width: 20, height: 2, background: '#C9A84C', marginBottom: 4 }} />
            <div style={{ width: 20, height: 2, background: '#C9A84C', marginBottom: 4 }} />
            <div style={{ width: 20, height: 2, background: '#C9A84C' }} />
          </button>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: '#F5F0E8', margin: 0 }}>
            {tabTitle[tab]}
          </h1>
        </header>

        <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
          {tab === 'users'    && <UsersTab />}
          {tab === 'methods'  && <DepositMethodsTab />}
          {tab === 'messages' && <MessagesTab adminId={user.id} />}
          {tab === 'settings' && <SettingsTab />}
        </main>
      </div>

      <FloatingChat userId={user.id} />

      <style>{`
        @media (max-width: 900px) {
          .sidebar { transform: translateX(-100%) !important; }
          .dash-main { margin-left: 0 !important; }
          .menu-btn { display: flex !important; flex-direction: column; }
        }
      `}</style>
    </div>
  )
}
