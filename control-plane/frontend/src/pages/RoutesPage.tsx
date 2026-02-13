import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { routeApi, type RouteDefinition } from '../api/client'
import { Plus, Pencil, Trash2, Rocket } from 'lucide-react'

function RoutesPage() {
  const [routes, setRoutes] = useState<RouteDefinition[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchRoutes = () => {
    setLoading(true)
    routeApi.getAll().then((res) => {
      setRoutes(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { fetchRoutes() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this route?')) return
    await routeApi.delete(id)
    fetchRoutes()
  }

  const handleDeploy = async (id: string) => {
    try {
      await routeApi.deploy(id)
      alert('Route deployed successfully!')
      fetchRoutes()
    } catch {
      alert('Deployment failed. Is Data-Plane running?')
    }
  }

  return (
    <div className="page-container">
      <div className="section-header">
        <h1 className="page-title">Routes</h1>
        <button className="btn btn-primary" onClick={() => navigate('/routes/new')}>
          <Plus size={16} /> New Route
        </button>
      </div>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : routes.length === 0 ? (
        <div className="empty-state">
          <p>No routes yet. Create your first integration route!</p>
          <button className="btn btn-primary" onClick={() => navigate('/routes/new')}>
            <Plus size={16} /> Create Route
          </button>
        </div>
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
            {routes.map((route) => (
              <tr key={route.id}>
                <td className="font-medium">{route.name}</td>
                <td>{route.description || '-'}</td>
                <td>
                  <span className={`badge ${route.yamlDsl ? 'badge-success' : 'badge-warning'}`}>
                    {route.yamlDsl ? 'Ready' : 'Draft'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-sm btn-icon"
                      title="Edit"
                      onClick={() => navigate(`/routes/${route.id}/edit`)}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="btn btn-sm btn-icon btn-deploy"
                      title="Deploy"
                      onClick={() => handleDeploy(route.id)}
                      disabled={!route.yamlDsl}
                    >
                      <Rocket size={14} />
                    </button>
                    <button
                      className="btn btn-sm btn-icon btn-danger"
                      title="Delete"
                      onClick={() => handleDelete(route.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default RoutesPage
