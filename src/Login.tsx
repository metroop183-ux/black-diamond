import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './lib/useAuth'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handle = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    const res = await login(form.email, form.password)
    setLoading(false)
    if (res.error) { setError(res.error); return }
    // navigate based on role — useAuth sets user, read from localStorage redirect
    // we'll navigate to dashboard; Dashboard redirects admin to /admin
    navigate('/dashboard')
  }

  const inputSt: React.CSSProperties = {
    width: '100%', background: '#111316', border: '1px solid #2E3138',
    borderRadius: 4, padding: '14px 16px', fontSize: 14, color: '#F5F0E8',
    outline: 'none', transition: 'border-color 0.2s', fontFamily: 'var(--font-body)',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0B0C0E', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <header style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1A1D22', position: 'relative', zIndex: 2 }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: '#F5F0E8' }}>Black Diamond</span>
        </Link>
        <span style={{ fontSize: 13, color: '#7A7570' }}>
          No account?{' '}
          <Link to="/signup" style={{ color: '#C9A84C', textDecoration: 'none', fontWeight: 500 }}>Sign up</Link>
        </span>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', position: 'relative', zIndex: 2 }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }} />
          </div>

          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, color: '#F5F0E8', margin: '0 0 10px', letterSpacing: '-0.02em' }}>Welcome Back</h1>
            <p style={{ fontSize: 14, color: '#7A7570', margin: 0, fontWeight: 300 }}>Sign in to your investor account</p>
          </div>

          {error && (
            <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 4, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#FCA5A5' }}>
              {error}
            </div>
          )}

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ fontSize: 11, color: '#7A7570', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Email Address</label>
              <input style={inputSt} name="email" type="email" value={form.email} onChange={handle} placeholder="james@example.com" required
                onFocus={e => (e.target.style.borderColor = '#C9A84C')}
                onBlur={e => (e.target.style.borderColor = '#2E3138')}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 11, color: '#7A7570', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Password</label>
                <a href="#" style={{ fontSize: 12, color: '#C9A84C', textDecoration: 'none' }}>Forgot password?</a>
              </div>
              <input style={inputSt} name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••" required
                onFocus={e => (e.target.style.borderColor = '#C9A84C')}
                onBlur={e => (e.target.style.borderColor = '#2E3138')}
              />
            </div>
            <button type="submit" disabled={loading} style={{
              marginTop: 8, width: '100%',
              background: loading ? '#2E3138' : 'linear-gradient(135deg,#C9A84C,#E8C96A)',
              color: loading ? '#7A7570' : '#0B0C0E', border: 'none', borderRadius: 4,
              padding: '15px', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-body)', transition: 'opacity 0.2s',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(201,168,76,0.25)',
            }}>
              {loading ? 'Signing In…' : 'Sign In'}
            </button>
          </form>

          {/* Test account hints */}
          <div style={{ marginTop: 28, padding: '16px 18px', background: '#111316', border: '1px solid #1A1D22', borderRadius: 4 }}>
            <p style={{ fontSize: 11, color: '#7A7570', margin: '0 0 8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Test Accounts</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { label: 'Admin', email: 'admin@blackdiamond.com', pw: 'admin123' },
                { label: 'Investor 1', email: 'investor1@blackdiamond.com', pw: 'client123' },
                { label: 'Investor 2', email: 'investor2@blackdiamond.com', pw: 'client123' },
              ].map(a => (
                <button key={a.email} onClick={() => setForm({ email: a.email, password: a.pw })} style={{
                  background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                  fontSize: 12, color: '#C9A84C', padding: '3px 0', fontFamily: 'var(--font-mono)',
                }}>
                  {a.label}: {a.email}
                </button>
              ))}
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#7A7570' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#C9A84C', textDecoration: 'none', fontWeight: 500 }}>Create one</Link>
          </p>
        </div>
      </main>

      <footer style={{ padding: '20px 40px', borderTop: '1px solid #1A1D22', textAlign: 'center' }}>
        <p style={{ fontSize: 11, color: '#3A3D42', margin: 0 }}>
          © {new Date().getFullYear()} Black Diamond Company · Investment involves risk
        </p>
      </footer>
    </div>
  )
}
