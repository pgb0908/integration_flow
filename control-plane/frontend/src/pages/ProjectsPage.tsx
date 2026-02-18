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
  text: '#e8eaf0',
  textDim: '#555a72',
};

interface Project {
  id?: number;
  name: string;
  description?: string;
  routes?: number;
  status?: string;
  updated?: string;
}

interface ProjectsPageProps {
  onProjectClick?: (projectId: number) => void;
}

export default function ProjectsPage({ onProjectClick }: ProjectsPageProps) {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    axios.get('/api/projects')
      .then(response => {
        if (response.data.success) {
          setProjects(response.data.data);
        }
      })
      .catch(error => console.error('Failed to load projects:', error));
  }, []);

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {projects.map((p, i) => (
          <div
            key={i}
            style={{
              background: COLORS.card,
              borderRadius: 10,
              padding: 20,
              border: `1px solid ${COLORS.border}`,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onClick={() => onProjectClick?.(p.id!)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = COLORS.primaryMuted;
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = COLORS.border;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{p.name}</span>
              <span style={{ fontSize: 11, color: COLORS.accent }}>●</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: COLORS.textDim }}>
              <span>{p.description || 'No description'}</span>
            </div>
          </div>
        ))}

        <div
          style={{
            borderRadius: 10,
            padding: 20,
            border: `1px dashed ${COLORS.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: COLORS.textDim,
            fontSize: 13,
            minHeight: 90,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = COLORS.primary;
            e.currentTarget.style.color = COLORS.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = COLORS.border;
            e.currentTarget.style.color = COLORS.textDim;
          }}
        >
          + New Project
        </div>
      </div>
    </div>
  );
}
