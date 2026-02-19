import { useState, useEffect } from 'react';
import axios from 'axios';

const COLORS = {
  card: '#1e2035',
  cardHover: '#252845',
  border: '#2a2d45',
  primary: '#6c8cff',
  primaryMuted: '#4a5e99',
  accent: '#50e3c2',
  accentRed: '#ff6b6b',
  accentOrange: '#ffb347',
  text: '#e8eaf0',
  textMuted: '#8890a8',
  textDim: '#555a72',
  overlay: 'rgba(0,0,0,0.6)',
  input: '#12141f',
};

const STATUS_COLOR: Record<string, string> = {
  running: COLORS.accent,
  deployed: COLORS.primary,
  deploying: COLORS.accentOrange,
  stopped: COLORS.textDim,
  deploy_failed: COLORS.accentRed,
};

interface Route {
  id?: number;
  name: string;
  status?: string;
  projectId?: number;
  description?: string;
}

interface RoutesPageProps {
  projectId?: number;
  onEditRoute: (routeId: number) => void;
  createTrigger?: number;
}

export default function RoutesPage({ projectId, onEditRoute, createTrigger }: RoutesPageProps) {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const loadRoutes = () => {
    axios.get('/api/routes')
      .then(res => {
        if (res.data.success) {
          const all: Route[] = res.data.data;
          setRoutes(projectId ? all.filter(r => r.projectId === projectId) : all);
        }
      })
      .catch(err => console.error('Failed to load routes:', err));
  };

  useEffect(() => { loadRoutes(); }, [projectId]);

  useEffect(() => {
    if (createTrigger) openModal();
  }, [createTrigger]);

  const openModal = () => {
    setForm({ name: '', description: '' });
    setError('');
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError('Route name is required.'); return; }
    setSaving(true);
    setError('');
    try {
      await axios.post('/api/routes', {
        name: form.name.trim(),
        description: form.description.trim(),
        ...(projectId ? { projectId } : {}),
        status: 'stopped',
      });
      loadRoutes();
      closeModal();
    } catch (e: any) {
      setError(e.response?.data?.error || 'Failed to create route.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeploy = async (route: Route) => {
    setActionLoading(route.id!);
    try {
      await axios.post(`/api/routes/${route.id}/deploy`);
      loadRoutes();
    } catch (e: any) {
      alert(e.response?.data?.error || 'Deploy failed.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleStart = async (route: Route) => {
    setActionLoading(route.id!);
    try {
      await axios.post(`/api/routes/${route.id}/start`);
      loadRoutes();
    } catch (e: any) {
      alert(e.response?.data?.error || 'Start failed.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleStop = async (route: Route) => {
    setActionLoading(route.id!);
    try {
      await axios.post(`/api/routes/${route.id}/stop`);
      loadRoutes();
    } catch (e: any) {
      alert(e.response?.data?.error || 'Stop failed.');
    } finally {
      setActionLoading(null);
    }
  };

  const renderActions = (r: Route) => {
    const loading = actionLoading === r.id;
    const status = r.status || 'stopped';
    return (
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          onClick={() => onEditRoute(r.id!)}
          style={{ padding: '4px 10px', fontSize: 11, cursor: 'pointer' }}
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => handleDeploy(r)}
          disabled={loading}
          style={{ padding: '4px 10px', fontSize: 11, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          🚀 Deploy
        </button>
        {status === 'deployed' && (
          <button
            onClick={() => handleStart(r)}
            disabled={loading}
            style={{ padding: '4px 10px', fontSize: 11, cursor: loading ? 'not-allowed' : 'pointer', color: COLORS.accent }}
          >
            ▶ Start
          </button>
        )}
        {status === 'running' && (
          <button
            onClick={() => handleStop(r)}
            disabled={loading}
            style={{ padding: '4px 10px', fontSize: 11, cursor: loading ? 'not-allowed' : 'pointer', color: COLORS.accentRed }}
          >
            ⏹ Stop
          </button>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: 28 }}>
      <div style={{ background: COLORS.card, borderRadius: 10, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
              {['Route Name', 'Status', 'Description', 'Actions'].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: 'left', padding: '12px 16px',
                    color: COLORS.textDim, fontWeight: 500,
                    fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {routes.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '32px 16px', textAlign: 'center', color: COLORS.textDim }}>
                  No routes yet. Click "+ New Route" to create one.
                </td>
              </tr>
            )}
            {routes.map((r) => (
              <tr
                key={r.id}
                style={{ borderBottom: `1px solid ${COLORS.border}` }}
                onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.cardHover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '12px 16px', color: COLORS.text, fontWeight: 500 }}>{r.name}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    color: STATUS_COLOR[r.status || 'stopped'] || COLORS.textDim,
                    fontSize: 12,
                  }}>
                    ● {r.status || 'stopped'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: COLORS.textMuted }}>{r.description || '-'}</td>
                <td style={{ padding: '12px 16px' }}>{renderActions(r)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed', inset: 0, background: COLORS.overlay,
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div style={{
            background: COLORS.card, borderRadius: 12, padding: 28,
            border: `1px solid ${COLORS.border}`, width: 420, maxWidth: '90vw',
          }}>
            <h3 style={{ margin: '0 0 20px', color: COLORS.text, fontSize: 16 }}>New Route</h3>

            <label style={{ display: 'block', marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 6 }}>Name *</div>
              <input
                autoFocus
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="my-route"
                style={{
                  width: '100%', boxSizing: 'border-box', padding: '8px 12px',
                  background: COLORS.input, border: `1px solid ${COLORS.border}`,
                  borderRadius: 6, color: COLORS.text, fontSize: 13, outline: 'none',
                }}
              />
            </label>

            <label style={{ display: 'block', marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 6 }}>Description</div>
              <input
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Optional description"
                style={{
                  width: '100%', boxSizing: 'border-box', padding: '8px 12px',
                  background: COLORS.input, border: `1px solid ${COLORS.border}`,
                  borderRadius: 6, color: COLORS.text, fontSize: 13, outline: 'none',
                }}
              />
            </label>

            {error && <div style={{ color: COLORS.accentRed, fontSize: 12, marginBottom: 16 }}>{error}</div>}

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={closeModal}
                style={{
                  padding: '8px 18px', borderRadius: 6, border: `1px solid ${COLORS.border}`,
                  background: 'transparent', color: COLORS.textDim, cursor: 'pointer', fontSize: 13,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                style={{
                  padding: '8px 18px', borderRadius: 6, border: 'none',
                  background: saving ? COLORS.primaryMuted : COLORS.primary,
                  color: '#fff', cursor: saving ? 'not-allowed' : 'pointer', fontSize: 13,
                }}
              >
                {saving ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
