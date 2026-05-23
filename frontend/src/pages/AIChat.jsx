import { useState, useRef, useEffect } from 'react'
import api from '../api'

export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '👋 Hey! I\'m your DevOps AI assistant. Ask me anything about Docker, CI/CD, Kubernetes, or cloud deployments.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef()

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)
    try {
      const { data } = await api.post('/ai/chat', { message: userMsg })
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Error contacting AI. Check GROQ_API_KEY.' }])
    }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4rem)' }}>
      <h1 style={{ marginBottom: '1rem' }}>🤖 AI DevOps Chat</h1>
      <div className="card" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '75%', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.9rem', lineHeight: '1.6',
              background: m.role === 'user' ? '#7c3aed' : '#1e1e2e',
              color: '#e2e8f0', border: m.role === 'assistant' ? '1px solid #2a2a3e' : 'none',
              whiteSpace: 'pre-wrap'
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex' }}>
            <div style={{ padding: '0.75rem 1rem', background: '#1e1e2e', borderRadius: '12px', color: '#64748b' }}>
              ⏳ Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <input placeholder="Ask about Docker, CI/CD, Kubernetes..." value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          style={{ flex: 1 }} />
        <button className="btn-primary" onClick={send} style={{ padding: '0.5rem 1.5rem' }}>Send</button>
      </div>
    </div>
  )
}
