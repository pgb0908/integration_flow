import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { routeApi, type RouteDefinition } from '../api/client'
import { Activity, AlertCircle, PauseCircle, PlayCircle } from 'lucide-react'

function DashboardPage() {
  const [routes, setRoutes] = useState<RouteDefinition[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    routeApi.getAll().then((res) => {
      setRoutes(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const total = routes.length
  const running = routes.filter((r) => r.yamlDsl).length
  const stopped = total - running

  return (
    <div className="page-container">
      <h1 className="page-title">Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total"><Activity size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{total}</span>
            <span className="stat-label">Total Routes</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon running"><PlayCircle size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{running}</span>
            <span className="stat-label">With DSL</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stopped"><PauseCircle size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{stopped}</span>
            <span className="stat-label">No DSL</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon error"><AlertCircle size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">0</span>
            <span className="stat-label">Errors</span>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Recent Routes</h2>
          <button className="btn btn-primary" onClick={() => navigate('/routes/new')}>
            + New Route
          </button>
        </div>
        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : routes.length === 0 ? (
          <p className="text-muted">No routes created yet. Create your first route!</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.slice(0, 5).map((route) => (
                <tr key={route.id}>
                  <td>{route.name}</td>
                  <td>{route.description || '-'}</td>
                  <td>
                    <span className={`badge ${route.yamlDsl ? 'badge-success' : 'badge-warning'}`}>
                      {route.yamlDsl ? 'Ready' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm"
                      onClick={() => navigate(`/routes/${route.id}/edit`)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
