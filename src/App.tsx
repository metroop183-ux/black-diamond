import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

// ─── Types ─────────────────────────────────────────────────────────────────

type NavItem = { label: string; href: string }
type Package = {
  name: string
  amount: string
  weekly: string
  monthlyEst: string
  highlight: boolean
  badge?: string
}
type Step = { num: string; title: string; body: string }
type Stat = { value: string; label: string; sub?: string }
type FAQ = { q: string; a: string }

// ─── Data ──────────────────────────────────────────────────────────────────

const NAV: NavItem[] = []

const STATS: Stat[] = [
  { value: '800+', label: 'Active Investors', sub: 'across 1st world countries' },
  { value: '30%', label: 'Avg. Weekly Return', sub: 'consistently delivered' },
  { value: '500+', label: 'USA & UK Investors', sub: 'first-world secured base' },
  { value: '$300K', label: 'Retirement Threshold', sub: 'invest once, retire forever' },
]

const PACKAGES: Package[] = [
  {
    name: 'Foundation',
    amount: '$500',
    weekly: '$150',
    monthlyEst: '~$600',
    highlight: false,
  },
  {
    name: 'Growth',
    amount: '$1,000',
    weekly: '$300',
    monthlyEst: '~$1,200',
    highlight: false,
  },
  {
    name: 'Premier',
    amount: '$5,000',
    weekly: '$1,500',
    monthlyEst: '~$6,000',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Elite',
    amount: '$100,000',
    weekly: '$30,000',
    monthlyEst: '~$120,000',
    highlight: false,
    badge: 'Retirement-Ready',
  },
]

const STEPS: Step[] = [
  {
    num: '01',
    title: 'Choose Your Package',
    body: 'Select an investment tier that aligns with your goals — from our $5,000 Foundation entry to the $100,000 Elite package.',
  },
  {
    num: '02',
    title: 'Fund Your Position',
    body: 'Transfer your funds securely. Our team confirms receipt within 24 hours and activates your investment account.',
  },
  {
    num: '03',
    title: 'Receive Weekly Returns',
    body: 'Every week, 30% of your principal is generated from our live solar infrastructure network and credited to your account.',
  },
  {
    num: '04',
    title: 'Unlock the Retirement Gate',
    body: 'Once cumulative returns cross $300,000, your Retirement Package activates — a single investment that funds your freedom indefinitely.',
  },
]

const FAQS: FAQ[] = [
  {
    q: 'How does Black Diamond generate 30% weekly returns?',
    a: 'Black Diamond operates utility-scale solar stations supplying electricity to municipalities, agricultural regions, and industrial zones across emerging markets. These long-term power purchase agreements generate predictable, high-margin revenue that is redistributed to investors on a weekly basis.',
  },
  {
    q: 'Are my funds safe as a foreign investor?',
    a: 'Our investor contracts are structured under internationally recognized legal frameworks. We specifically target investors in the USA, UK, and EU where contractual enforceability is strongest. Your capital is allocated to physical infrastructure — tangible assets that underpin every return.',
  },
  {
    q: 'Can I withdraw my principal at any time?',
    a: 'Investment packages have a minimum 90-day commitment period to ensure operational stability. After this period, principal withdrawal requests are processed within 10 business days.',
  },
  {
    q: 'What is the Retirement Package exactly?',
    a: 'Once your cumulative returns reach $300,000, we activate your Retirement Package. This is a single, perpetual investment that continues generating returns indefinitely — designed so that you never need to re-invest or monitor your account to maintain your income.',
  },
  {
    q: 'How do I get started?',
    a: 'Contact our investor relations team through the form below. A dedicated advisor will walk you through the onboarding process, package selection, and fund transfer within 48 hours.',
  },
]

// ─── Components ───────────────────────────────────────────────────────────

function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useScrollReveal()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

function GoldLine() {
  return (
    <div style={{ width: 48, height: 2, background: 'linear-gradient(90deg, #C9A84C, #E8C96A)', borderRadius: 1, marginBottom: 20 }} />
  )
}

// ─── Nav ───────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? 'rgba(11,12,14,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(201,168,76,0.12)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #C9A84C 100%)',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            flexShrink: 0,
          }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: '#F5F0E8', letterSpacing: '0.02em' }}>
            Black Diamond
          </span>
        </a>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="hidden-mobile">
          <Link
            to="/login"
            style={{
              color: '#C8C2B5',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 400,
              letterSpacing: '0.04em',
              padding: '10px 20px',
              borderRadius: 4,
              border: '1px solid rgba(201,168,76,0.18)',
              transition: 'color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#C9A84C'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.45)' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#C8C2B5'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.18)' }}
          >
            Log In
          </Link>
          <Link
            to="/signup"
            style={{
              background: 'linear-gradient(135deg, #C9A84C, #E8C96A)',
              color: '#0B0C0E',
              padding: '10px 24px',
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              transition: 'opacity 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="show-mobile"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'none' }}
        >
          <div style={{ width: 22, height: 2, background: '#C9A84C', marginBottom: 5, transition: 'transform 0.2s', transform: open ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
          <div style={{ width: 22, height: 2, background: '#C9A84C', marginBottom: 5, opacity: open ? 0 : 1 }} />
          <div style={{ width: 22, height: 2, background: '#C9A84C', transition: 'transform 0.2s', transform: open ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: '#111316', borderTop: '1px solid #2E3138', padding: '16px 32px 24px' }}>
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            style={{ display: 'block', color: '#C8C2B5', textDecoration: 'none', fontSize: 15, padding: '12px 0', borderBottom: '1px solid #1A1D22' }}
          >
            Log In
          </Link>
          <Link
            to="/signup"
            onClick={() => setOpen(false)}
            style={{ display: 'block', marginTop: 16, textAlign: 'center', background: 'linear-gradient(135deg, #C9A84C, #E8C96A)', color: '#0B0C0E', padding: '12px', borderRadius: 4, fontSize: 13, fontWeight: 600, textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase' }}
          >
            Sign Up
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; flex-direction: column; }
        }
      `}</style>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      {/* Background image */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1800&h=1000&fit=crop&auto=format)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
      }} />
      {/* Overlays */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(11,12,14,0.95) 40%, rgba(11,12,14,0.6) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 50%, rgba(201,168,76,0.06) 0%, transparent 60%)' }} />

      {/* Decorative grid lines */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: 'linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto', padding: '120px 32px 80px', width: '100%' }}>
        <div style={{ maxWidth: 680 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)',
            padding: '7px 16px', borderRadius: 2, marginBottom: 32,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9A84C', boxShadow: '0 0 8px #C9A84C' }} />
            <span style={{ color: '#C9A84C', fontSize: 12, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Global Solar Infrastructure Investment
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(42px, 6vw, 76px)',
            fontWeight: 700,
            lineHeight: 1.08,
            color: '#F5F0E8',
            margin: '0 0 28px',
            letterSpacing: '-0.02em',
          }}>
            Power the World.<br />
            <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Fund Your Future.</em>
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.7, color: '#C8C2B5', margin: '0 0 48px', maxWidth: 540, fontWeight: 300 }}>
            Black Diamond Company operates solar stations supplying electricity to farms, regions, and municipalities globally. Our 800+ investors — based in the USA, UK, and other first-world countries — earn an average of <strong style={{ color: '#F5F0E8', fontWeight: 500 }}>30% weekly returns</strong> while building toward lifelong financial freedom.
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <a
              href="#packages"
              style={{
                background: 'linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #C9A84C 100%)',
                backgroundSize: '200% 100%',
                color: '#0B0C0E',
                padding: '16px 36px',
                borderRadius: 4,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                transition: 'background-position 0.4s, transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 24px rgba(201,168,76,0.3)',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundPosition = '100% 0'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(201,168,76,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundPosition = '0 0'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(201,168,76,0.3)' }}
            >
              View Investment Packages
            </a>
            <a
              href="#how-it-works"
              style={{
                border: '1px solid rgba(245,240,232,0.2)',
                color: '#F5F0E8',
                padding: '16px 36px',
                borderRadius: 4,
                fontSize: 14,
                fontWeight: 400,
                textDecoration: 'none',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)'; e.currentTarget.style.color = '#C9A84C' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(245,240,232,0.2)'; e.currentTarget.style.color = '#F5F0E8' }}
            >
              How It Works
            </a>
          </div>

          {/* Mini trust bar */}
          <div style={{ marginTop: 64, display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            {[
              { v: '800+', l: 'Global Investors' },
              { v: '30%', l: 'Weekly Returns' },
              { v: '500+', l: 'USA & UK Members' },
            ].map(item => (
              <div key={item.l}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600, color: '#C9A84C' }}>{item.v}</div>
                <div style={{ fontSize: 12, color: '#7A7570', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 2 }}>{item.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0.4 }}>
        <div style={{ width: 1, height: 40, background: 'linear-gradient(180deg, transparent, #C9A84C)' }} />
        <span style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A84C' }}>Scroll</span>
      </div>
    </section>
  )
}

// ─── Stats Bar ─────────────────────────────────────────────────────────────

function StatsBar() {
  return (
    <section style={{ background: '#111316', borderTop: '1px solid #1A1D22', borderBottom: '1px solid #1A1D22' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 0,
        }}
          className="stats-grid"
        >
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80}>
              <div style={{
                padding: '40px 32px',
                borderRight: i < STATS.length - 1 ? '1px solid #2E3138' : 'none',
                textAlign: 'center',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,3vw,44px)', fontWeight: 700, color: '#C9A84C', lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#F5F0E8', marginTop: 8, letterSpacing: '0.02em' }}>
                  {stat.label}
                </div>
                {stat.sub && (
                  <div style={{ fontSize: 12, color: '#7A7570', marginTop: 4, letterSpacing: '0.03em' }}>
                    {stat.sub}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </section>
  )
}

// ─── About ─────────────────────────────────────────────────────────────────

function About() {
  return (
    <section id="about" style={{ background: '#0B0C0E', padding: '120px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="about-grid">
          {/* Left */}
          <Reveal>
            <div>
              <GoldLine />
              <p style={{ fontSize: 12, color: '#7A7570', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16, marginTop: 0 }}>About Us</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,3.5vw,50px)', fontWeight: 700, color: '#F5F0E8', margin: '0 0 24px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
                Infrastructure That<br />
                <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Powers Nations</em>
              </h2>
              <p style={{ color: '#C8C2B5', lineHeight: 1.8, fontSize: 16, fontWeight: 300, margin: '0 0 20px' }}>
                Black Diamond Company was founded on a simple conviction: the global energy transition represents the single greatest wealth-creation opportunity of our era. We build and operate utility-scale solar stations that deliver electricity to farms, municipalities, and industrial zones across emerging markets.
              </p>
              <p style={{ color: '#C8C2B5', lineHeight: 1.8, fontSize: 16, fontWeight: 300, margin: '0 0 32px' }}>
                Our investors don't manage projects — they fund them. You provide the capital, we operate the infrastructure, and every Friday your return is credited. It's that clean.
              </p>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {[
                  { icon: '◆', label: 'Utility-Scale Solar Stations' },
                  { icon: '◆', label: 'Long-Term Power Agreements' },
                  { icon: '◆', label: 'Internationally Structured Contracts' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#C9A84C', fontSize: 8 }}>{item.icon}</span>
                    <span style={{ fontSize: 13, color: '#C8C2B5', letterSpacing: '0.02em' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right — image + overlay card */}
          <Reveal delay={150}>
            <div style={{ position: 'relative' }}>
              <div style={{
                borderRadius: 4,
                overflow: 'hidden',
                aspectRatio: '4/3',
                background: '#1A1D22',
              }}>
                <img
                  src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&h=600&fit=crop&auto=format"
                  alt="Solar farm powering agricultural regions at sunset"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.85 }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(11,12,14,0.7) 100%)' }} />
              </div>
              {/* Floating stat card */}
              <div style={{
                position: 'absolute', bottom: -24, left: -24,
                background: '#C9A84C',
                padding: '20px 28px',
                borderRadius: 4,
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, color: '#0B0C0E', lineHeight: 1 }}>30%</div>
                <div style={{ fontSize: 12, color: 'rgba(11,12,14,0.7)', fontWeight: 500, marginTop: 4, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Avg. Weekly Return</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  )
}

// ─── How It Works ─────────────────────────────────────────────────────────

function HowItWorks() {
  return (
    <section id="how-it-works" style={{ background: '#111316', padding: '120px 32px', position: 'relative', overflow: 'hidden' }}>
      {/* decorative background number */}
      <div style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-display)', fontSize: 320, fontWeight: 800, color: 'rgba(201,168,76,0.03)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>
        4
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <GoldLine style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: 12, color: '#7A7570', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Process</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px,3.5vw,48px)', fontWeight: 700, color: '#F5F0E8', margin: 0, letterSpacing: '-0.02em' }}>
              How Your Investment <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Works</em>
            </h2>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2 }} className="steps-grid">
          {STEPS.map((step, i) => (
            <Reveal key={step.num} delay={i * 100}>
              <div
                style={{
                  background: '#0B0C0E',
                  padding: '40px 28px',
                  position: 'relative',
                  cursor: 'default',
                  transition: 'background 0.3s',
                  borderTop: '2px solid transparent',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#141619'
                  e.currentTarget.style.borderTopColor = '#C9A84C'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#0B0C0E'
                  e.currentTarget.style.borderTopColor = 'transparent'
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#C9A84C', letterSpacing: '0.12em', marginBottom: 20, opacity: 0.7 }}>
                  {step.num}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: '#F5F0E8', margin: '0 0 14px', lineHeight: 1.25, letterSpacing: '-0.01em' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 14, color: '#7A7570', lineHeight: 1.75, margin: 0, fontWeight: 300 }}>
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .steps-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 540px) {
          .steps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

// ─── Packages ─────────────────────────────────────────────────────────────

function Packages() {
  return (
    <section id="packages" style={{ background: '#0B0C0E', padding: '120px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <GoldLine style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: 12, color: '#7A7570', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Investment Tiers</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px,3.5vw,48px)', fontWeight: 700, color: '#F5F0E8', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
              Choose Your <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Scale</em>
            </h2>
            <p style={{ color: '#7A7570', fontSize: 15, maxWidth: 440, margin: '0 auto', fontWeight: 300, lineHeight: 1.7 }}>
              Every package delivers the same 30% weekly return. Choose the scale that matches your goals and capital.
            </p>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2 }} className="packages-grid">
          {PACKAGES.map((pkg, i) => (
            <Reveal key={pkg.name} delay={i * 80}>
              <div
                style={{
                  position: 'relative',
                  background: pkg.highlight ? 'linear-gradient(160deg, #1C1810 0%, #16140F 100%)' : '#111316',
                  border: pkg.highlight ? '1px solid rgba(201,168,76,0.35)' : '1px solid #1A1D22',
                  borderRadius: 4,
                  padding: '36px 28px 32px',
                  transition: 'transform 0.25s, border-color 0.25s, box-shadow 0.25s',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.borderColor = pkg.highlight ? 'rgba(201,168,76,0.6)' : 'rgba(201,168,76,0.25)'
                  e.currentTarget.style.boxShadow = '0 24px 60px rgba(0,0,0,0.4)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = pkg.highlight ? 'rgba(201,168,76,0.35)' : '#1A1D22'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {pkg.badge && (
                  <div style={{
                    position: 'absolute', top: -1, left: 28, right: 28,
                    background: pkg.highlight ? 'linear-gradient(90deg,#C9A84C,#E8C96A)' : '#2D7A4F',
                    color: '#0B0C0E',
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    textAlign: 'center', padding: '5px 0', borderRadius: '0 0 4px 4px',
                  }}>
                    {pkg.badge}
                  </div>
                )}
                <div style={{ marginTop: pkg.badge ? 16 : 0 }}>
                  <p style={{ fontSize: 11, color: '#7A7570', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 12px' }}>
                    {pkg.name}
                  </p>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 700, color: pkg.highlight ? '#C9A84C' : '#F5F0E8', lineHeight: 1, margin: '0 0 8px' }}>
                    {pkg.amount}
                  </div>
                  <p style={{ fontSize: 12, color: '#7A7570', margin: '0 0 28px' }}>initial investment</p>

                  <div style={{ borderTop: '1px solid #2E3138', paddingTop: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ fontSize: 13, color: '#7A7570' }}>Weekly return</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#C9A84C', fontFamily: 'var(--font-mono)' }}>{pkg.weekly}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ fontSize: 13, color: '#7A7570' }}>Monthly est.</span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#F5F0E8', fontFamily: 'var(--font-mono)' }}>{pkg.monthlyEst}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, color: '#7A7570' }}>Return rate</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#3A9E66', fontFamily: 'var(--font-mono)' }}>30% / week</span>
                    </div>
                  </div>

                  <a
                    href="#contact"
                    style={{
                      display: 'block',
                      marginTop: 28,
                      textAlign: 'center',
                      padding: '13px 0',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      transition: 'background 0.2s, color 0.2s',
                      background: pkg.highlight ? 'linear-gradient(135deg,#C9A84C,#E8C96A)' : 'transparent',
                      color: pkg.highlight ? '#0B0C0E' : '#C9A84C',
                      border: pkg.highlight ? 'none' : '1px solid rgba(201,168,76,0.3)',
                    }}
                    onMouseEnter={e => {
                      if (!pkg.highlight) { e.currentTarget.style.background = 'rgba(201,168,76,0.1)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)' }
                    }}
                    onMouseLeave={e => {
                      if (!pkg.highlight) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)' }
                    }}
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <style>{`
          @media (max-width: 900px) {
            .packages-grid { grid-template-columns: repeat(2,1fr) !important; }
          }
          @media (max-width: 540px) {
            .packages-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </section>
  )
}

// ─── Retirement ────────────────────────────────────────────────────────────

function Retirement() {
  return (
    <section id="retirement" style={{ background: '#111316', padding: '120px 32px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1800&h=700&fit=crop&auto=format)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.07 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 70%)' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="retire-grid">
          <Reveal>
            <div>
              <GoldLine />
              <p style={{ fontSize: 12, color: '#7A7570', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 16px' }}>The Retirement Package</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px,3.5vw,50px)', fontWeight: 700, color: '#F5F0E8', margin: '0 0 24px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
                Invest Once.<br />
                <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Retire Forever.</em>
              </h2>
              <p style={{ color: '#C8C2B5', lineHeight: 1.8, fontSize: 16, fontWeight: 300, margin: '0 0 20px' }}>
                When your cumulative returns exceed <strong style={{ color: '#C9A84C', fontWeight: 600 }}>$300,000</strong>, Black Diamond activates your Retirement Package — a single, perpetual investment structure that continues generating returns indefinitely.
              </p>
              <p style={{ color: '#C8C2B5', lineHeight: 1.8, fontSize: 16, fontWeight: 300, margin: '0 0 40px' }}>
                You don't re-invest. You don't monitor dashboards. You don't negotiate. Your capital is embedded in live infrastructure, and your returns arrive every week for as long as our solar stations operate.
              </p>
              <div style={{ display: 'flex', gap: 16 }}>
                <a href="#contact" style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', color: '#0B0C0E', padding: '14px 32px', borderRadius: 4, fontSize: 13, fontWeight: 600, textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Learn More
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {[
                { icon: '⬡', title: '$300K Threshold', body: 'Once cumulative returns hit $300K, your retirement status activates automatically.' },
                { icon: '⬡', title: 'Perpetual Income', body: 'Returns continue indefinitely — no re-investment, no expiry date, no catch.' },
                { icon: '⬡', title: 'Zero Management', body: "We run the infrastructure. You receive the income. Nothing else is required from you." },
                { icon: '⬡', title: 'Legacy Asset', body: 'Your retirement position can be structured to benefit your estate and heirs.' },
              ].map((item, i) => (
                <div key={item.title} style={{
                  background: '#0B0C0E',
                  padding: '28px 24px',
                  borderTop: '2px solid rgba(201,168,76,0.2)',
                  transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderTopColor = '#C9A84C')}
                  onMouseLeave={e => (e.currentTarget.style.borderTopColor = 'rgba(201,168,76,0.2)')}
                >
                  <div style={{ color: '#C9A84C', fontSize: 18, marginBottom: 12 }}>{item.icon}</div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: '#F5F0E8', margin: '0 0 10px' }}>{item.title}</h4>
                  <p style={{ fontSize: 13, color: '#7A7570', lineHeight: 1.65, margin: 0, fontWeight: 300 }}>{item.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .retire-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  )
}

// ─── Global Reach ──────────────────────────────────────────────────────────

function GlobalReach() {
  return (
    <section style={{ background: '#0B0C0E', padding: '120px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <GoldLine style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: 12, color: '#7A7570', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Global Operations</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px,3.5vw,48px)', fontWeight: 700, color: '#F5F0E8', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
              Solar Infrastructure<br />
              <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Across Borders</em>
            </h2>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }} className="reach-grid">
          {[
            {
              img: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&h=400&fit=crop&auto=format',
              title: 'Agricultural Zones',
              body: 'Solar-powered irrigation and processing plants dramatically increase crop yields for farming communities.',
            },
            {
              img: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=600&h=400&fit=crop&auto=format',
              title: 'Municipal Grids',
              body: "We supply clean, reliable electricity to regional municipalities under long-term government power purchase agreements.",
            },
            {
              img: 'https://images.unsplash.com/photo-1520209759809-a9bcb6cb3241?w=600&h=400&fit=crop&auto=format',
              title: 'Industrial Parks',
              body: 'Factories and industrial zones contract with Black Diamond to power their operations with renewable energy.',
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 4, background: '#1A1D22', cursor: 'default' }}
                onMouseEnter={e => { const img = e.currentTarget.querySelector('img') as HTMLImageElement; if (img) img.style.transform = 'scale(1.06)' }}
                onMouseLeave={e => { const img = e.currentTarget.querySelector('img') as HTMLImageElement; if (img) img.style.transform = 'scale(1)' }}
              >
                <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                  <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease', opacity: 0.75 }} />
                </div>
                <div style={{ padding: '24px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: '#F5F0E8', margin: '0 0 10px' }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: '#7A7570', lineHeight: 1.7, margin: 0, fontWeight: 300 }}>{item.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .reach-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

// ─── FAQ ───────────────────────────────────────────────────────────────────

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" style={{ background: '#111316', padding: '120px 32px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <GoldLine style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: 12, color: '#7A7570', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Investor Questions</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 700, color: '#F5F0E8', margin: 0, letterSpacing: '-0.02em' }}>
              Frequently Asked<br />
              <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Questions</em>
            </h2>
          </div>
        </Reveal>

        <div>
          {FAQS.map((faq, i) => (
            <Reveal key={i} delay={i * 60}>
              <div
                style={{
                  borderBottom: '1px solid #1A1D22',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '24px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 16,
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 500, color: open === i ? '#C9A84C' : '#F5F0E8', lineHeight: 1.4, transition: 'color 0.2s' }}>
                    {faq.q}
                  </span>
                  <div style={{
                    flexShrink: 0,
                    width: 28, height: 28,
                    border: '1px solid',
                    borderColor: open === i ? '#C9A84C' : '#2E3138',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: open === i ? '#C9A84C' : '#7A7570',
                    fontSize: 16,
                    lineHeight: 1,
                    transition: 'all 0.2s',
                    transform: open === i ? 'rotate(45deg)' : 'none',
                  }}>
                    +
                  </div>
                </button>
                <div style={{
                  maxHeight: open === i ? 300 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.35s ease',
                }}>
                  <p style={{ fontSize: 15, color: '#7A7570', lineHeight: 1.8, margin: '0 0 24px', fontWeight: 300, paddingRight: 44 }}>
                    {faq.a}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Contact CTA ───────────────────────────────────────────────────────────

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', amount: '', message: '' })
  const [sent, setSent] = useState(false)

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#111316',
    border: '1px solid #2E3138',
    borderRadius: 4,
    padding: '14px 16px',
    fontSize: 14,
    color: '#F5F0E8',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'var(--font-body)',
    boxSizing: 'border-box',
  }

  return (
    <section id="contact" style={{ background: '#0B0C0E', padding: '120px 32px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)' }} />
      <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <GoldLine style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: 12, color: '#7A7570', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Get Started</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 700, color: '#F5F0E8', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
              Speak with an<br />
              <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Investor Advisor</em>
            </h2>
            <p style={{ color: '#7A7570', fontSize: 15, maxWidth: 400, margin: '0 auto', fontWeight: 300, lineHeight: 1.7 }}>
              Submit your details and a dedicated advisor will contact you within 48 hours to walk you through your options.
            </p>
          </div>
        </Reveal>

        {sent ? (
          <Reveal>
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ width: 64, height: 64, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 24, color: '#C9A84C' }}>✓</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#F5F0E8', margin: '0 0 12px' }}>Thank You</h3>
              <p style={{ color: '#7A7570', fontSize: 15 }}>Your message has been received. An advisor will reach out within 48 hours.</p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={100}>
            <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="contact-grid">
              <div>
                <label style={{ fontSize: 11, color: '#7A7570', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Full Name</label>
                <input style={inputStyle} name="name" value={form.name} onChange={handle} placeholder="James Harrington" required
                  onFocus={e => (e.target.style.borderColor = '#C9A84C')}
                  onBlur={e => (e.target.style.borderColor = '#2E3138')}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#7A7570', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Email Address</label>
                <input style={inputStyle} name="email" type="email" value={form.email} onChange={handle} placeholder="james@example.com" required
                  onFocus={e => (e.target.style.borderColor = '#C9A84C')}
                  onBlur={e => (e.target.style.borderColor = '#2E3138')}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#7A7570', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Phone Number</label>
                <input style={inputStyle} name="phone" value={form.phone} onChange={handle} placeholder="+1 555 000 0000"
                  onFocus={e => (e.target.style.borderColor = '#C9A84C')}
                  onBlur={e => (e.target.style.borderColor = '#2E3138')}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#7A7570', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Investment Package</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} name="amount" value={form.amount} onChange={handle} required
                  onFocus={e => (e.target.style.borderColor = '#C9A84C')}
                  onBlur={e => (e.target.style.borderColor = '#2E3138')}
                >
                  <option value="">Select a package</option>
                  <option value="5000">Foundation — $5,000</option>
                  <option value="10000">Growth — $10,000</option>
                  <option value="50000">Premier — $50,000</option>
                  <option value="100000">Elite — $100,000</option>
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: 11, color: '#7A7570', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Message (optional)</label>
                <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 100 } as React.CSSProperties} name="message" value={form.message} onChange={handle} placeholder="Any questions or context you'd like to share..."
                  onFocus={e => (e.target.style.borderColor = '#C9A84C')}
                  onBlur={e => (e.target.style.borderColor = '#2E3138')}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <button type="submit" style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #C9A84C 100%)',
                  backgroundSize: '200% 100%',
                  color: '#0B0C0E',
                  border: 'none',
                  borderRadius: 4,
                  padding: '16px',
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s, transform 0.2s',
                  fontFamily: 'var(--font-body)',
                  boxShadow: '0 4px 24px rgba(201,168,76,0.25)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  Request a Consultation
                </button>
              </div>
            </form>
          </Reveal>
        )}
      </div>
      <style>{`
        @media (max-width: 540px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

// ─── Footer ────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ background: '#080A0B', borderTop: '1px solid #1A1D22', padding: '60px 32px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }} className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: '#F5F0E8' }}>Black Diamond Company</span>
            </div>
            <p style={{ fontSize: 13, color: '#7A7570', lineHeight: 1.75, margin: '0 0 20px', maxWidth: 280, fontWeight: 300 }}>
              Global solar infrastructure investment. Generating returns for 800+ investors across 1st world countries.
            </p>
            <div style={{ display: 'flex', gap: 4 }}>
              {['USA', 'UK', 'EU', 'Canada'].map(tag => (
                <span key={tag} style={{ fontSize: 10, color: '#C9A84C', border: '1px solid rgba(201,168,76,0.25)', padding: '3px 8px', borderRadius: 2, letterSpacing: '0.06em' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: 'Company', links: ['About Us', 'Operations', 'Infrastructure', 'Leadership'] },
            { title: 'Investors', links: ['Investment Packages', 'Retirement Plan', 'Onboarding', 'Investor Portal'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Risk Disclosure', 'Investor Agreement'] },
          ].map(col => (
            <div key={col.title}>
              <h5 style={{ fontSize: 11, color: '#C9A84C', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 20px', fontWeight: 500 }}>{col.title}</h5>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {col.links.map(link => (
                  <li key={link} style={{ marginBottom: 10 }}>
                    <a href="#" style={{ fontSize: 13, color: '#7A7570', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#C8C2B5')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#7A7570')}
                    >{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #1A1D22', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ fontSize: 12, color: '#3A3D42', margin: 0 }}>
            © {new Date().getFullYear()} Black Diamond Company. All rights reserved.
          </p>
          <p style={{ fontSize: 12, color: '#3A3D42', margin: 0 }}>
            Investment involves risk. Past performance does not guarantee future results.
          </p>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div style={{ fontFamily: 'var(--font-body)', background: '#0B0C0E', color: '#F5F0E8' }}>
      <Nav />
      <Hero />
      <StatsBar />
      <About />
      <HowItWorks />
      <Packages />
      <Retirement />
      <GlobalReach />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  )
}
