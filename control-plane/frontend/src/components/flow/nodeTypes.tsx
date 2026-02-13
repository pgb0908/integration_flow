import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Play, Square, PhoneCall, GitBranch, FileText, Shuffle } from 'lucide-react'

interface NodeData {
  label: string
  [key: string]: unknown
}

const nodeStyle = (color: string) => ({
  padding: '10px 16px',
  borderRadius: '8px',
  border: `2px solid ${color}`,
  backgroundColor: '#fff',
  minWidth: '140px',
  textAlign: 'center' as const,
  fontSize: '13px',
  fontWeight: 500,
})

export const StartNode = memo(({ data }: NodeProps) => (
  <div style={nodeStyle('#22c55e')}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
      <Play size={14} color="#22c55e" />
      <span>{(data as NodeData).label}</span>
    </div>
    <Handle type="source" position={Position.Bottom} />
  </div>
))
StartNode.displayName = 'StartNode'

export const EndNode = memo(({ data }: NodeProps) => (
  <div style={nodeStyle('#ef4444')}>
    <Handle type="target" position={Position.Top} />
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
      <Square size={14} color="#ef4444" />
      <span>{(data as NodeData).label}</span>
    </div>
  </div>
))
EndNode.displayName = 'EndNode'

export const EndpointNode = memo(({ data }: NodeProps) => (
  <div style={nodeStyle('#3b82f6')}>
    <Handle type="target" position={Position.Top} />
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
      <PhoneCall size={14} color="#3b82f6" />
      <span>{(data as NodeData).label}</span>
    </div>
    <Handle type="source" position={Position.Bottom} />
  </div>
))
EndpointNode.displayName = 'EndpointNode'

export const ConditionNode = memo(({ data }: NodeProps) => (
  <div style={{ ...nodeStyle('#f59e0b'), transform: 'rotate(0deg)' }}>
    <Handle type="target" position={Position.Top} />
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
      <GitBranch size={14} color="#f59e0b" />
      <span>{(data as NodeData).label}</span>
    </div>
    <Handle type="source" position={Position.Bottom} id="a" />
    <Handle type="source" position={Position.Right} id="b" />
  </div>
))
ConditionNode.displayName = 'ConditionNode'

export const LogNode = memo(({ data }: NodeProps) => (
  <div style={nodeStyle('#8b5cf6')}>
    <Handle type="target" position={Position.Top} />
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
      <FileText size={14} color="#8b5cf6" />
      <span>{(data as NodeData).label}</span>
    </div>
    <Handle type="source" position={Position.Bottom} />
  </div>
))
LogNode.displayName = 'LogNode'

export const TransformNode = memo(({ data }: NodeProps) => (
  <div style={nodeStyle('#06b6d4')}>
    <Handle type="target" position={Position.Top} />
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
      <Shuffle size={14} color="#06b6d4" />
      <span>{(data as NodeData).label}</span>
    </div>
    <Handle type="source" position={Position.Bottom} />
  </div>
))
TransformNode.displayName = 'TransformNode'

export const customNodeTypes = {
  start: StartNode,
  end: EndNode,
  endpoint: EndpointNode,
  condition: ConditionNode,
  log: LogNode,
  transform: TransformNode,
}

export interface ToolboxItem {
  type: string
  label: string
  icon: typeof Play
  color: string
}

export const toolboxItems: ToolboxItem[] = [
  { type: 'start', label: 'Start', icon: Play, color: '#22c55e' },
  { type: 'endpoint', label: 'Endpoint', icon: PhoneCall, color: '#3b82f6' },
  { type: 'condition', label: 'If/Else', icon: GitBranch, color: '#f59e0b' },
  { type: 'log', label: 'Log', icon: FileText, color: '#8b5cf6' },
  { type: 'transform', label: 'Transform', icon: Shuffle, color: '#06b6d4' },
  { type: 'end', label: 'End', icon: Square, color: '#ef4444' },
]
