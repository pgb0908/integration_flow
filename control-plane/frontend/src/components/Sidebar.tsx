const COLORS = {
  sidebar: '#161821',
  sidebarHover: '#1e2030',
  sidebarActive: '#252840',
  border: '#2a2d45',
  primary: '#6c8cff',
  text: '#e8eaf0',
  textMuted: '#8890a8',
  textDim: '#555a72',
  accent: '#50e3c2',
};

const NAV_ITEMS = [
  { id: 'projects', icon: '📁', label: 'Projects' },
  { id: 'routes', icon: '🔀', label: 'Routes' },
  { id: 'designer', icon: '✏️', label: 'Designer' },
  { id: 'deployments', icon: '🚀', label: 'Deployments' },
  { id: 'kamelets', icon: '🔌', label: 'Kamelets' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
];

interface SidebarProps {
  active: string;
  onNav: (page: string) => void;
  collapsed: boolean;
}

export default function Sidebar({ active, onNav, collapsed }: SidebarProps) {
  return (
    <div
      style={{
        width: collapsed ? 56 : 200,
        minWidth: collapsed ? 56 : 200,
        background: COLORS.sidebar,
        borderRight: `1px solid ${COLORS.border}`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s, min-width 0.2s',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: collapsed ? '18px 12px' : '18px 20px',
          borderBottom: `1px solid ${COLORS.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ fontSize: 22 }}>🐪</span>
        {!collapsed && (
          <span
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: 700,
              fontSize: 15,
              color: COLORS.text,
              letterSpacing: '-0.3px',
            }}
          >
            CamelPlatform
          </span>
        )}
      </div>

      <div style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => onNav(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: collapsed ? '10px 14px' : '10px 14px',
              borderRadius: 8,
              cursor: 'pointer',
              background: active === item.id ? COLORS.sidebarActive : 'transparent',
              color: active === item.id ? COLORS.primary : COLORS.textMuted,
              fontSize: 13,
              fontWeight: active === item.id ? 600 : 400,
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
              borderLeft: active === item.id ? `2px solid ${COLORS.primary}` : '2px solid transparent',
            }}
            onMouseEnter={(e) => {
              if (active !== item.id) e.currentTarget.style.background = COLORS.sidebarHover;
            }}
            onMouseLeave={(e) => {
              if (active !== item.id) e.currentTarget.style.background = 'transparent';
            }}
          >
            <span style={{ fontSize: 16, width: 22, textAlign: 'center' }}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </div>
        ))}
      </div>

      <div style={{ padding: '12px 8px', borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderRadius: 8, whiteSpace: 'nowrap' }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              color: '#fff',
            }}
          >
            D
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>Developer</div>
              <div style={{ fontSize: 10, color: COLORS.textDim }}>Admin</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
