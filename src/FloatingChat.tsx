import { useState, useEffect, useRef } from 'react'
import { api } from './lib/api'

type Msg = { id: string; message: string; senderName: string; isAdmin: boolean; createdAt: string }

export default function FloatingChat({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [unread, setUnread] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!userId) return
    const load = () => api.getChat(userId).then(msgs => {
      if (Array.isArray(msgs)) {
        const prevLen = messages.length
        setMessages(msgs)
        if (!open && msgs.length > prevLen) setUnread(n => n + (msgs.length - prevLen))
      }
    })
    load()
    const iv = setInterval(load, 8000)
    return () => clearInterval(iv)
  }, [userId, open])

  useEffect(() => {
    if (open) { setUnread(0); bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }
  }, [open, messages])

  const send = async () => {
    if (!input.trim() || sending) return
    setSending(true)
    const msg = await api.sendChat(userId, input.trim())
    if (msg?.id) setMessages(m => [...m, msg])
    setInput(''); setSending(false)
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const onKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  return (
    <>
      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 88, right: 24, zIndex: 300,
          width: 340, height: 460,
          background: '#111316', border: '1px solid rgba(201,168,76,0.25)',
          borderRadius: 10, boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column',
          animation: 'chatUp 0.25s ease',
        }}>
          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #1A1D22', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#0B0C0E', fontWeight: 700 }}>◆</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#F5F0E8', margin: 0 }}>Black Diamond Support</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3A9E66' }} />
                <span style={{ fontSize: 11, color: '#3A9E66' }}>Online</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#7A7570', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 2 }}>×</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <p style={{ fontSize: 13, color: '#7A7570', lineHeight: 1.65 }}>
                  Hi! How can we help you today? Our team typically responds within a few hours.
                </p>
              </div>
            )}
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', justifyContent: msg.isAdmin ? 'flex-start' : 'flex-end' }}>
                <div style={{
                  maxWidth: '80%',
                  background: msg.isAdmin ? '#1A1D22' : 'linear-gradient(135deg,#C9A84C,#E8C96A)',
                  color: msg.isAdmin ? '#F5F0E8' : '#0B0C0E',
                  padding: '10px 14px', borderRadius: msg.isAdmin ? '4px 12px 12px 4px' : '12px 4px 4px 12px',
                  fontSize: 13, lineHeight: 1.5,
                }}>
                  {msg.isAdmin && <p style={{ fontSize: 10, color: '#7A7570', margin: '0 0 4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{msg.senderName}</p>}
                  <p style={{ margin: 0 }}>{msg.message}</p>
                  <p style={{ fontSize: 10, color: msg.isAdmin ? '#7A7570' : 'rgba(0,0,0,0.45)', margin: '4px 0 0', textAlign: 'right' }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px', borderTop: '1px solid #1A1D22', display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Type a message…"
              style={{
                flex: 1, background: '#0B0C0E', border: '1px solid #2E3138', borderRadius: 20,
                padding: '10px 16px', fontSize: 13, color: '#F5F0E8', outline: 'none',
                fontFamily: 'var(--font-body)', transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = '#C9A84C')}
              onBlur={e => (e.target.style.borderColor = '#2E3138')}
            />
            <button onClick={send} disabled={sending || !input.trim()} style={{
              width: 38, height: 38, borderRadius: '50%',
              background: input.trim() ? 'linear-gradient(135deg,#C9A84C,#E8C96A)' : '#1A1D22',
              border: 'none', cursor: input.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: input.trim() ? '#0B0C0E' : '#7A7570', fontSize: 14, flexShrink: 0,
              transition: 'background 0.2s',
            }}>
              ➤
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 300,
          width: 56, height: 56, borderRadius: '50%',
          background: open ? '#1A1D22' : 'linear-gradient(135deg,#C9A84C,#E8C96A)',
          border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(201,168,76,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, color: open ? '#7A7570' : '#0B0C0E',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        title="Support Chat"
      >
        {open ? '×' : '💬'}
        {!open && unread > 0 && (
          <span style={{
            position: 'absolute', top: 0, right: 0,
            width: 18, height: 18, borderRadius: '50%',
            background: '#F87171', color: '#fff',
            fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{unread}</span>
        )}
      </button>

      <style>{`@keyframes chatUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </>
  )
}
