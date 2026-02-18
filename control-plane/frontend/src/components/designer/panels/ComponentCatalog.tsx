import { CAMEL_COMPONENTS, ComponentType, ComponentCategory } from '../types/flow.types';

const COLORS = {
  sidebar: '#161821',
  sidebarHover: '#1e2030',
  border: '#2a2d45',
  text: '#e8eaf0',
  textMuted: '#8890a8',
  textDim: '#555a72',
  bg: '#0f1117',
};

interface ComponentCatalogProps {
  isOpen: boolean;
  onClose: () => void;
  onDragStart: (event: React.DragEvent, component: ComponentCategory) => void;
}

export default function ComponentCatalog({ isOpen, onClose, onDragStart }: ComponentCatalogProps) {
  if (!isOpen) return null;

  // Group components by type
  const groupedComponents = CAMEL_COMPONENTS.reduce((acc, comp) => {
    if (!acc[comp.type]) {
      acc[comp.type] = [];
    }
    acc[comp.type].push(comp);
    return acc;
  }, {} as Record<ComponentType, ComponentCategory[]>);

  const typeLabels: Record<ComponentType, string> = {
    source: 'Sources',
    processor: 'Processors',
    sink: 'Sinks',
    kamelet: 'Kamelets',
  };

  return (
    <div
      style={{
        width: 240,
        minWidth: 240,
        background: COLORS.sidebar,
        borderRight: `1px solid ${COLORS.border}`,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 16px',
          borderBottom: `1px solid ${COLORS.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>
          Component Catalog
        </span>
        <span
          style={{ fontSize: 10, color: COLORS.textDim, cursor: 'pointer' }}
          onClick={onClose}
        >
          ✕
        </span>
      </div>

      {/* Search Box */}
      <div style={{ padding: '12px 16px' }}>
        <input
          placeholder="Search components..."
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: 6,
            border: `1px solid ${COLORS.border}`,
            background: COLORS.bg,
            color: COLORS.text,
            fontSize: 12,
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Component List */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {Object.entries(groupedComponents).map(([type, components]) => (
          <div key={type}>
            <div
              style={{
                padding: '12px 16px 6px',
                fontSize: 10,
                fontWeight: 600,
                color: COLORS.textDim,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {typeLabels[type as ComponentType]}
            </div>
            {components.map((comp) => (
              <div
                key={comp.name}
                draggable
                onDragStart={(e) => onDragStart(e, comp)}
                style={{
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 12,
                  color: COLORS.textMuted,
                  cursor: 'grab',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.sidebarHover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ fontSize: 16 }}>{comp.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{comp.name}</div>
                  {comp.description && (
                    <div style={{ fontSize: 10, color: COLORS.textDim, marginTop: 2 }}>
                      {comp.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
