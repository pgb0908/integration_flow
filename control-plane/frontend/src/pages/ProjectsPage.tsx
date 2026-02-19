import { useState, useEffect } from 'react';
import axios from 'axios';

const COLORS = {
  card: '#1e2035',
  cardHover: '#252845',
  border: '#2a2d45',
  primary: '#6c8cff',
  primaryMuted: '#4a5e99',
  accent: '#50e3c2',
  text: '#e8eaf0',
  textDim: '#555a72',
  overlay: 'rgba(0,0,0,0.6)',
  input: '#12141f',
};

interface Project {
  id?: number;
  name: string;
  description?: string;
}

interface ProjectsPageProps {
  onProjectClick?: (projectId: number) => void;
  createTrigger?: number;
}

export default function ProjectsPage({ onProjectClick, createTrigger }: ProjectsPageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadProjects = () => {
    axios.get('/api/projects')
      .then(res => { if (res.data.success) setProjects(res.data.data); })
      .catch(err => console.error('Failed to load projects:', err));
  };

  useEffect(() => { loadProjects(); }, []);

  // Header button trigger
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
    if (!form.name.trim()) { setError('Project name is required.'); return; }
    setSaving(true);
    setError('');
    try {
      await axios.post('/api/projects', { name: form.name.trim(), description: form.description.trim() });
      loadProjects();
      closeModal();
    } catch (e: any) {
      setError(e.response?.data?.error || 'Failed to create project.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {projects.map((p) => (
          <div
            key={p.id}
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
            <div style={{ fontSize: 12, color: COLORS.textDim }}>{p.description || 'No description'}</div>
          </div>
        ))}

        {/* New Project Card */}
        <div
          onClick={openModal}
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
            <h3 style={{ margin: '0 0 20px', color: COLORS.text, fontSize: 16 }}>New Project</h3>

            <label style={{ display: 'block', marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 6 }}>Name *</div>
              <input
                autoFocus
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="my-integration-project"
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

            {error && <div style={{ color: '#ff6b6b', fontSize: 12, marginBottom: 16 }}>{error}</div>}

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
