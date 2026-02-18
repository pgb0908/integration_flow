import { useState, useEffect } from 'react';
import axios from 'axios';

const COLORS = {
  card: '#1e2035',
  cardHover: '#252845',
  border: '#2a2d45',
  accent: '#50e3c2',
  accentRed: '#ff6b6b',
  text: '#e8eaf0',
  textMuted: '#8890a8',
  textDim: '#555a72',
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
}

export default function RoutesPage({ projectId, onEditRoute }: RoutesPageProps) {
  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    // Note: /api/projects/${projectId}/routes would be ideal but may not exist yet
    // For now, fetch all routes and filter client-side
    axios.get('/api/routes')
      .then(response => {
        if (response.data.success) {
          const allRoutes = response.data.data;
          // Filter by projectId if provided
          const filteredRoutes = projectId
            ? allRoutes.filter((r: Route) => r.projectId === projectId)
            : allRoutes;
          setRoutes(filteredRoutes);
        }
      })
      .catch(error => console.error('Failed to load routes:', error));
  }, [projectId]);

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
                    textAlign: 'left',
                    padding: '12px 16px',
                    color: COLORS.textDim,
                    fontWeight: 500,
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {routes.map((r) => (
              <tr
                key={r.id}
                style={{ borderBottom: `1px solid ${COLORS.border}`, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.cardHover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '12px 16px', color: COLORS.text, fontWeight: 500 }}>{r.name}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ color: r.status === 'running' ? COLORS.accent : COLORS.textDim }}>
                    {r.status || 'stopped'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: COLORS.textMuted }}>{r.description || '-'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => onEditRoute(r.id!)} style={{ padding: '4px 12px', fontSize: 11 }}>✏️ Edit</button>
                    <button style={{ padding: '4px 12px', fontSize: 11 }}>
                      {r.status === 'running' ? '⏹ Stop' : '▶️ Start'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
