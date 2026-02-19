import { Handle, Position, NodeProps } from '@xyflow/react';
import { CamelNode } from '../types/flow.types';

const COLORS = {
  card: '#1e2035',
  border: '#2a2d45',
  text: '#e8eaf0',
  nodeSink: '#ffb347',
};

export default function SinkNode({ data, selected }: NodeProps<CamelNode>) {
  return (
    <div
      style={{
        padding: '12px 10px',
        borderRadius: 10,
        background: COLORS.card,
        border: `2px solid ${selected ? COLORS.nodeSink : COLORS.border}`,
        boxShadow: selected ? `0 0 16px ${COLORS.nodeSink}30` : 'none',
        minWidth: 120,
        textAlign: 'center',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
    >
      {/* Input handle (left side) */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: 12,
          height: 12,
          background: COLORS.nodeSink,
          border: `2px solid ${COLORS.card}`,
        }}
      />

      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: COLORS.nodeSink,
          margin: '0 auto 8px',
          boxShadow: `0 0 8px ${COLORS.nodeSink}80`,
        }}
      />
      <div
        style={{
          fontSize: 18,
          marginBottom: 6,
        }}
      >
        {data.icon || '🗄️'}
      </div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: COLORS.text,
          marginBottom: 4,
        }}
      >
        {data.label || data.componentName}
      </div>
      <div
        style={{
          fontSize: 8,
          color: COLORS.nodeSink,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontWeight: 500,
        }}
      >
        SINK
      </div>
    </div>
  );
}
