import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, Route, Rocket } from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/routes', icon: Route, label: 'Routes' },
]

function Layout() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-logo">
          <Rocket size={24} />
          <span>Camel Platform</span>
        </div>
        <nav className="header-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
