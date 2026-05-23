import { useEffect, useState } from 'react'
import api from '../api'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState({ title: '', description: '', project_id: '', priority: 'medium' })

  const load = () => {
    api.get('/tasks').then(r => setTasks(r.data))
    api.get('/projects').then(r => setProjects(r.data))
  }
  useEffect(() => { load() }, [])

  const create = async () => {
    if (!form.title || !form.project_id) return
    await api.post('/tasks', { ...form, project_id: parseInt(form.project_id) })
    setForm({ title: '', description: '', project_id: '', priority: 'medium' })
    load()
  }

  const updateStatus = async (id, status) => {
    await api.put(`/tasks/${id}/status`, { status })
    load()
  }

  const del = async (id) => {
    await api.delete(`/tasks/${id}`)
    load()
  }

  const priorityColor = { low: '#22c55e', medium: '#fb923c', high: '#ef4444' }
  const statusOptions = ['todo', 'in_progress', 'done']

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>✅ Tasks</h1>
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>New Task</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'end' }}>
          <input placeholder="Task title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <select value={form.project_id} onChange={e => setForm({ ...form, project_id: e.target.value })}>
            <option value="">Select project</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
            {['low', 'medium', 'high'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <button className="btn-primary" onClick={create}>+ Add</button>
        </div>
      </div>
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {tasks.length === 0 && <p style={{ color: '#64748b' }}>No tasks yet.</p>}
        {tasks.map(t => (
          <div key={t.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>{t.title}</h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>{t.description}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ color: priorityColor[t.priority], fontSize: '0.8rem' }}>{t.priority}</span>
              <select value={t.status} onChange={e => updateStatus(t.id, e.target.value)}
                style={{ width: 'auto', fontSize: '0.8rem', padding: '0.2rem 0.5rem' }}>
                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button className="btn-danger" onClick={() => del(t.id)} style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
