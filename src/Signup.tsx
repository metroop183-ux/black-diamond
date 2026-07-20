import { useState, Fragment } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './lib/useAuth'

const COUNTRIES = [
  'United States','United Kingdom','Canada','Australia','Germany','France',
  'Netherlands','Switzerland','Sweden','Norway','Denmark','Finland',
  'Austria','Belgium','Ireland','New Zealand','Japan','Singapore',
  'Luxembourg','Italy','Spain','Portugal','Other',
]

const REVENUE_OPTIONS = ['<$50,000', '$50,000-$100,000', '>$100,000']

const STEPS = ['Account', 'Personal', 'Address', 'Profile']

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState<1|2|3|4>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [newUser, setNewUser] = useState<{firstName: string} | null>(null)

  const [form, setForm] = useState({
    email: '', phone: '', password: '', confirmPassword: '',
    firstName: '', lastName: '', otherNames: '', mothersMaidenName: '', dob: '',
    country: '', state: '', address: '',
    annualRevenue: '',
  })

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (step === 1 && form.password !== form.confirmPassword) {
      setError('Passwords do not match'); return
    }
    if (step < 4) setStep(s => (s + 1) as any)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    const { confirmPassword: _, ...data } = form
    const res = await signup(data)
    setLoading(false)
    if (res.error) { setError(res.error); return }
    setNewUser({ firstName: form.firstName })
    setShowModal(true)
  }

  const inputSt: React.CSSProperties = {
    width: '100%', background: '#111316', border: '1px solid #2E3138',
    borderRadius: 4, padding: '14px 16px', fontSize: 14, color: '#F5F0E8',
    outline: 'none', transition: 'border-color 0.2s', fontFamily: 'var(--font-body)',
    boxSizing: 'border-box',
  }
  const labelSt: React.CSSProperties = {
    fontSize: 11, color: '#7A7570', letterSpacing: '0.08em',
    textTransform: 'uppercase', display: 'block', marginBottom: 8,
  }
  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = '#C9A84C')
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = '#2E3138')

  return (
    <div style={{ minHeight: '100vh', background: '#0B0C0E', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 500, background: 'radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Header */}
      <header style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1A1D22', position: 'relative', zIndex: 2 }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: '#F5F0E8' }}>Black Diamond</span>
        </Link>
        <span style={{ fontSize: 13, color: '#7A7570' }}>
          Already a member?{' '}
          <Link to="/login" style={{ color: '#C9A84C', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
        </span>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '48px 24px 80px', position: 'relative', zIndex: 2 }}>
        <div style={{ width: '100%', maxWidth: 520 }}>
          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }} />
          </div>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#F5F0E8', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
              Open Your Account
            </h1>
            <p style={{ fontSize: 14, color: '#7A7570', margin: 0, fontWeight: 300 }}>
              Join 800+ investors building wealth with solar infrastructure
            </p>
          </div>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36 }}>
            {STEPS.map((label, i) => (
              <Fragment key={label}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: step > i + 1 ? '#2D7A4F' : step === i + 1 ? 'linear-gradient(135deg,#C9A84C,#E8C96A)' : '#1A1D22',
                    border: step <= i + 1 && step !== i + 1 ? '1px solid #2E3138' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700,
                    color: step === i + 1 ? '#0B0C0E' : step > i + 1 ? '#fff' : '#7A7570',
                    transition: 'all 0.3s', flexShrink: 0,
                  }}>
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: 9, color: step === i + 1 ? '#C9A84C' : '#7A7570', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 1, background: step > i + 1 ? 'rgba(201,168,76,0.4)' : '#1A1D22', margin: '0 4px', marginBottom: 18, transition: 'background 0.3s' }} />
                )}
              </Fragment>
            ))}
          </div>

          {error && (
            <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 4, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#FCA5A5' }}>
              {error}
            </div>
          )}

          {/* Step 1: Account */}
          {step === 1 && (
            <form onSubmit={nextStep} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelSt}>Email Address</label>
                <input style={inputSt} name="email" type="email" value={form.email} onChange={set} placeholder="james@example.com" required onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={labelSt}>Phone Number</label>
                <input style={inputSt} name="phone" type="tel" value={form.phone} onChange={set} placeholder="+1 555 000 0000" required onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={labelSt}>Password</label>
                <input style={inputSt} name="password" type="password" value={form.password} onChange={set} placeholder="Minimum 8 characters" required minLength={8} onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={labelSt}>Confirm Password</label>
                <input style={inputSt} name="confirmPassword" type="password" value={form.confirmPassword} onChange={set} placeholder="Repeat password" required onFocus={focus} onBlur={blur} />
              </div>
              <StepBtn label="Continue →" />
            </form>
          )}

          {/* Step 2: Personal */}
          {step === 2 && (
            <form onSubmit={nextStep} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelSt}>First Name</label>
                  <input style={inputSt} name="firstName" value={form.firstName} onChange={set} placeholder="James" required onFocus={focus} onBlur={blur} />
                </div>
                <div>
                  <label style={labelSt}>Last Name</label>
                  <input style={inputSt} name="lastName" value={form.lastName} onChange={set} placeholder="Harrington" required onFocus={focus} onBlur={blur} />
                </div>
              </div>
              <div>
                <label style={labelSt}>Other Names</label>
                <input style={inputSt} name="otherNames" value={form.otherNames} onChange={set} placeholder="Middle name, aliases (optional)" onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={labelSt}>Mother's Maiden Name</label>
                <input style={inputSt} name="mothersMaidenName" value={form.mothersMaidenName} onChange={set} placeholder="For identity verification" required onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={labelSt}>Date of Birth</label>
                <input style={inputSt} name="dob" type="date" value={form.dob} onChange={set} required onFocus={focus} onBlur={blur} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <BackBtn onClick={() => setStep(1)} />
                <StepBtn label="Continue →" />
              </div>
            </form>
          )}

          {/* Step 3: Address */}
          {step === 3 && (
            <form onSubmit={nextStep} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelSt}>Country of Residence</label>
                <select style={{ ...inputSt, cursor: 'pointer' }} name="country" value={form.country} onChange={set} required onFocus={focus} onBlur={blur}>
                  <option value="">Select your country</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelSt}>State / Province / Region</label>
                <input style={inputSt} name="state" value={form.state} onChange={set} placeholder="California" required onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={labelSt}>Full Address</label>
                <input style={inputSt} name="address" value={form.address} onChange={set} placeholder="123 Main Street, City, ZIP" required onFocus={focus} onBlur={blur} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <BackBtn onClick={() => setStep(2)} />
                <StepBtn label="Continue →" />
              </div>
            </form>
          )}

          {/* Step 4: Revenue */}
          {step === 4 && (
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelSt}>Expected Annual Revenue</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {REVENUE_OPTIONS.map(opt => (
                    <label key={opt} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '14px 16px', background: form.annualRevenue === opt ? 'rgba(201,168,76,0.08)' : '#111316',
                      border: `1px solid ${form.annualRevenue === opt ? 'rgba(201,168,76,0.4)' : '#2E3138'}`,
                      borderRadius: 4, cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                      <input
                        type="radio" name="annualRevenue" value={opt}
                        checked={form.annualRevenue === opt}
                        onChange={set}
                        style={{ accentColor: '#C9A84C', width: 16, height: 16 }}
                      />
                      <span style={{ fontSize: 14, color: form.annualRevenue === opt ? '#F5F0E8' : '#C8C2B5' }}>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <p style={{ fontSize: 12, color: '#7A7570', lineHeight: 1.6, margin: '8px 0 0' }}>
                By creating an account you confirm you are an investor from a first-world country and agree to our Terms of Service and Risk Disclosure.
              </p>

              <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                <BackBtn onClick={() => setStep(3)} />
                <button
                  type="submit" disabled={loading || !form.annualRevenue}
                  style={{
                    flex: 1, background: loading ? '#2E3138' : 'linear-gradient(135deg,#C9A84C,#E8C96A)',
                    color: loading ? '#7A7570' : '#0B0C0E', border: 'none', borderRadius: 4,
                    padding: '15px', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em',
                    textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
                    fontFamily: 'var(--font-body)', transition: 'opacity 0.2s',
                    boxShadow: loading ? 'none' : '0 4px 20px rgba(201,168,76,0.25)',
                  }}
                >
                  {loading ? 'Creating Account…' : 'Create Account'}
                </button>
              </div>
            </form>
          )}

          <p style={{ textAlign: 'center', marginTop: 28, fontSize: 13, color: '#7A7570' }}>
            Already a member?{' '}
            <Link to="/login" style={{ color: '#C9A84C', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
          </p>
        </div>
      </main>

      <footer style={{ padding: '20px 40px', borderTop: '1px solid #1A1D22', textAlign: 'center' }}>
        <p style={{ fontSize: 11, color: '#3A3D42', margin: 0 }}>
          © {new Date().getFullYear()} Black Diamond Company · Investment involves risk
        </p>
      </footer>

      {/* Welcome Modal */}
      {showModal && newUser && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }}>
          <div style={{
            background: '#111316', border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: 8, padding: '48px 40px', maxWidth: 520, width: '100%',
            boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
            animation: 'fadeUp 0.4s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <div style={{ width: 60, height: 60, background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: '#F5F0E8', textAlign: 'center', margin: '0 0 20px', letterSpacing: '-0.02em' }}>
              Welcome to Black Diamond Capital
            </h2>
            <p style={{ fontSize: 15, color: '#C8C2B5', lineHeight: 1.75, textAlign: 'center', margin: '0 0 16px', fontWeight: 300 }}>
              Welcome <strong style={{ color: '#C9A84C' }}>{newUser.firstName}</strong> to Black Diamond Capital. An account manager has been assigned to you and will contact you via email shortly.
            </p>
            <div style={{ background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 4, padding: '14px 18px', marginBottom: 28 }}>
              <p style={{ fontSize: 13, color: '#C8C2B5', lineHeight: 1.65, margin: 0 }}>
                <strong style={{ color: '#C9A84C' }}>⚠ Important:</strong> Only respond to emails from our company's server ending with{' '}
                <strong style={{ color: '#F5F0E8' }}>@blackdiamond.com</strong>
              </p>
            </div>
            <button
              onClick={() => { setShowModal(false); navigate('/dashboard') }}
              style={{
                width: '100%', background: 'linear-gradient(135deg,#C9A84C,#E8C96A)',
                color: '#0B0C0E', border: 'none', borderRadius: 4, padding: '15px',
                fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                cursor: 'pointer', fontFamily: 'var(--font-body)',
                boxShadow: '0 4px 20px rgba(201,168,76,0.25)',
              }}
            >
              I Understand — Go to Dashboard
            </button>
          </div>
          <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }`}</style>
        </div>
      )}
    </div>
  )
}

function StepBtn({ label }: { label: string }) {
  return (
    <button type="submit" style={{
      flex: 1, background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', color: '#0B0C0E',
      border: 'none', borderRadius: 4, padding: '15px', fontSize: 13, fontWeight: 700,
      letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
      fontFamily: 'var(--font-body)', boxShadow: '0 4px 20px rgba(201,168,76,0.25)',
    }}>{label}</button>
  )
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      flex: '0 0 auto', background: 'transparent', border: '1px solid #2E3138',
      color: '#C8C2B5', borderRadius: 4, padding: '15px 20px', fontSize: 13,
      cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = '#C9A84C')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#2E3138')}
    >← Back</button>
  )
}
