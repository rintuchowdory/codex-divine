import { useEffect, useState } from 'react'
import api from '../api'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState({ name: '', description: '', status: 'active' })

  const load = () => api.get('/projects').then(r => setProjects(r.data))
  useEffect(() => { load() }, [])

  const create = async () => {
    if (!form.name) return
    await api.post('/projects', form)
    setForm({ name: '', description: '', status: 'active' })
    load()
  }

  const del = async (id) => {
    await api.delete(`/projects/${id}`)
    load()
  }

  const statusColor = { active: '#22c55e', paused: '#fb923c', done: '#64748b' }

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>📁 Projects</h1>
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>New Project</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.75rem', alignItems: 'end' }}>
          <input placeholder="Project name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <button className="btn-primary" onClick={create}>+ Add</button>
        </div>
      </div>
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {projects.length === 0 && <p style={{ color: '#64748b' }}>No projects yet. Create one above.</p>}
        {projects.map(p => (
          <div key={p.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>{p.name}</h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>{p.description}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: statusColor[p.status] || '#94a3b8', fontSize: '0.8rem', background: 'rgba(0,0,0,0.3)', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                {p.status}
              </span>
              <button className="btn-danger" onClick={() => del(p.id)} style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
