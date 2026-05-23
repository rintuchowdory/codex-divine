import { useEffect, useState } from 'react'
import api from '../api'

export default function Dashboard() {
  const [health, setHealth] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    api.get('/health').then(r => setHealth(r.data))
    api.get('/auth/me').then(r => setUser(r.data))
  }, [])

  const stats = [
    { label: 'API Status', value: health?.status || '...', color: '#22c55e' },
    { label: 'User', value: user?.username || '...', color: '#a78bfa' },
    { label: 'Platform', value: 'AI DevOps', color: '#38bdf8' },
    { label: 'Version', value: 'v1.0.0', color: '#fb923c' },
  ]

  return (
    <div>
      <h1 style={{ marginBottom: '0.5rem' }}>Dashboard</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>Welcome to Codex Divine — AI DevOps Assistant Platform</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map(s => (
          <div key={s.label} className="card">
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{s.label}</p>
            <p style={{ color: s.color, fontSize: '1.4rem', fontWeight: 700 }}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>🚀 Quick Start</h3>
        <ul style={{ color: '#94a3b8', lineHeight: '2', paddingLeft: '1.25rem' }}>
          <li>Go to <strong style={{color:'#a78bfa'}}>Projects</strong> → create your first DevOps project</li>
          <li>Go to <strong style={{color:'#a78bfa'}}>Tasks</strong> → add tasks to your projects</li>
          <li>Go to <strong style={{color:'#a78bfa'}}>AI Chat</strong> → ask DevOps questions with Groq AI</li>
        </ul>
      </div>
    </div>
  )
}
