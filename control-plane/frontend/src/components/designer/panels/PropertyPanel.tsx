import { CamelNode, getComponentColor } from '../types/flow.types';

const COLORS = {
  sidebar: '#161821',
  border: '#2a2d45',
  text: '#e8eaf0',
  textMuted: '#8890a8',
  textDim: '#555a72',
  bg: '#0f1117',
};

interface PropertyPanelProps {
  selectedNode: CamelNode | null;
  onClose: () => void;
  onUpdateNode: (nodeId: string, data: Partial<CamelNode['data']>) => void;
}

export default function PropertyPanel({ selectedNode, onClose, onUpdateNode }: PropertyPanelProps) {
  if (!selectedNode) return null;

  const { data } = selectedNode;
  const color = getComponentColor(data.type);

  const handleChange = (field: string, value: any) => {
    onUpdateNode(selectedNode.id, { [field]: value });
  };

  return (
    <div
      style={{
        width: 320,
        minWidth: 320,
        background: COLORS.sidebar,
        borderLeft: `1px solid ${COLORS.border}`,
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
        <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>Properties</span>
        <span style={{ fontSize: 10, color: COLORS.textDim, cursor: 'pointer' }} onClick={onClose}>
          ✕
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Component Info */}
        <div
          style={{
            padding: 14,
            borderRadius: 8,
            background: color + '15',
            border: `1px solid ${color}30`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: color + '25',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}
          >
            {data.icon || '🔧'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>
              {data.label || data.componentName}
            </div>
            <div
              style={{
                fontSize: 10,
                color,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: 500,
              }}
            >
              {data.type}
            </div>
          </div>
        </div>

        {/* Node ID */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: 11,
              fontWeight: 500,
              color: COLORS.textMuted,
              marginBottom: 6,
            }}
          >
            Node ID
          </label>
          <input
            type="text"
            value={selectedNode.id}
            disabled
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 6,
              border: `1px solid ${COLORS.border}`,
              background: COLORS.bg,
              color: COLORS.textDim,
              fontSize: 12,
              fontFamily: "'JetBrains Mono', monospace",
              outline: 'none',
              boxSizing: 'border-box',
              cursor: 'not-allowed',
            }}
          />
        </div>

        {/* Label */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: 11,
              fontWeight: 500,
              color: COLORS.textMuted,
              marginBottom: 6,
            }}
          >
            Label
          </label>
          <input
            type="text"
            value={data.label || ''}
            onChange={(e) => handleChange('label', e.target.value)}
            placeholder="Enter label..."
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

        {/* Component-Specific Fields */}

        {/* HTTP Component */}
        {data.componentName.toLowerCase() === 'http' && (
          <>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 11,
                  fontWeight: 500,
                  color: COLORS.textMuted,
                  marginBottom: 6,
                }}
              >
                URI
              </label>
              <input
                type="text"
                value={data.uri || ''}
                onChange={(e) => handleChange('uri', e.target.value)}
                placeholder="http://localhost:8080/api"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: `1px solid ${COLORS.border}`,
                  background: COLORS.bg,
                  color: COLORS.text,
                  fontSize: 12,
                  fontFamily: "'JetBrains Mono', monospace",
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 11,
                  fontWeight: 500,
                  color: COLORS.textMuted,
                  marginBottom: 6,
                }}
              >
                Method
              </label>
              <select
                value={data.method || 'GET'}
                onChange={(e) => handleChange('method', e.target.value)}
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
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 11,
                  fontWeight: 500,
                  color: COLORS.textMuted,
                  marginBottom: 6,
                }}
              >
                Path
              </label>
              <input
                type="text"
                value={data.path || ''}
                onChange={(e) => handleChange('path', e.target.value)}
                placeholder="/api/endpoint"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: `1px solid ${COLORS.border}`,
                  background: COLORS.bg,
                  color: COLORS.text,
                  fontSize: 12,
                  fontFamily: "'JetBrains Mono', monospace",
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </>
        )}

        {/* Transform Component */}
        {data.componentName.toLowerCase() === 'transform' && (
          <>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 11,
                  fontWeight: 500,
                  color: COLORS.textMuted,
                  marginBottom: 6,
                }}
              >
                Expression
              </label>
              <textarea
                value={data.expression || ''}
                onChange={(e) => handleChange('expression', e.target.value)}
                placeholder="${body.toUpperCase()}"
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: `1px solid ${COLORS.border}`,
                  background: COLORS.bg,
                  color: COLORS.text,
                  fontSize: 12,
                  fontFamily: "'JetBrains Mono', monospace",
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 11,
                  fontWeight: 500,
                  color: COLORS.textMuted,
                  marginBottom: 6,
                }}
              >
                Language
              </label>
              <select
                value={data.language || 'simple'}
                onChange={(e) => handleChange('language', e.target.value)}
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
              >
                <option>simple</option>
                <option>jsonpath</option>
                <option>xpath</option>
              </select>
            </div>
          </>
        )}

        {/* Log Component */}
        {data.componentName.toLowerCase() === 'log' && (
          <>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 11,
                  fontWeight: 500,
                  color: COLORS.textMuted,
                  marginBottom: 6,
                }}
              >
                Message
              </label>
              <input
                type="text"
                value={data.message || ''}
                onChange={(e) => handleChange('message', e.target.value)}
                placeholder="Processing message: ${body}"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: `1px solid ${COLORS.border}`,
                  background: COLORS.bg,
                  color: COLORS.text,
                  fontSize: 12,
                  fontFamily: "'JetBrains Mono', monospace",
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 11,
                  fontWeight: 500,
                  color: COLORS.textMuted,
                  marginBottom: 6,
                }}
              >
                Level
              </label>
              <select
                value={data.level || 'INFO'}
                onChange={(e) => handleChange('level', e.target.value)}
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
              >
                <option>INFO</option>
                <option>DEBUG</option>
                <option>WARN</option>
                <option>ERROR</option>
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
