import { useState } from 'react'
import api from '../api'

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ username: '', password: '', email: '' })
  const [error, setError] = useState('')

  const submit = async () => {
    setError('')
    try {
      if (mode === 'register') {
        await api.post('/auth/register', form)
        setMode('login')
        return
      }
      const params = new URLSearchParams()
      params.append('username', form.username)
      params.append('password', form.password)
      const { data } = await api.post('/auth/login', params)
      localStorage.setItem('token', data.access_token)
      onLogin(data.access_token)
    } catch (e) {
      setError(e.response?.data?.detail || 'Error')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '360px' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>⚡ Codex Divine</h2>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {['login', 'register'].map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{ flex: 1, background: mode === m ? '#7c3aed' : '#1e1e2e', color: '#fff', border: '1px solid #333', borderRadius: '6px', padding: '0.5rem' }}>
              {m === 'login' ? 'Login' : 'Register'}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
          {mode === 'register' && <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />}
          <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && submit()} />
          {error && <p style={{ color: '#f87171', fontSize: '0.85rem' }}>{error}</p>}
          <button className="btn-primary" onClick={submit} style={{ marginTop: '0.5rem', padding: '0.75rem' }}>
            {mode === 'login' ? 'Login' : 'Register'}
          </button>
        </div>
      </div>
    </div>
  )
}
