import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: '⬛ Dashboard' },
  { to: '/projects', label: '📁 Projects' },
  { to: '/tasks', label: '✅ Tasks' },
  { to: '/ai', label: '🤖 AI Chat' },
]

export default function Sidebar({ onLogout }) {
  return (
    <aside style={{
      width: '220px', background: '#12121c', borderRight: '1px solid #2a2a3e',
      display: 'flex', flexDirection: 'column', padding: '1.5rem 1rem'
    }}>
      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#a78bfa', marginBottom: '2rem', paddingLeft: '0.5rem' }}>
        ⚡ Codex Divine
      </div>
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end={l.to === '/'}
            style={({ isActive }) => ({
              padding: '0.6rem 0.75rem', borderRadius: '8px', textDecoration: 'none',
              color: isActive ? '#a78bfa' : '#94a3b8',
              background: isActive ? 'rgba(124,58,237,0.15)' : 'transparent',
              fontSize: '0.9rem'
            })}>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <button onClick={onLogout} style={{
        background: 'transparent', color: '#64748b', border: '1px solid #2a2a3e',
        borderRadius: '8px', padding: '0.5rem', fontSize: '0.85rem'
      }}>
        🚪 Logout
      </button>
    </aside>
  )
}
