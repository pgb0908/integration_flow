import { useCallback, type DragEvent } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { customNodeTypes } from './nodeTypes'

interface FlowCanvasProps {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: ReturnType<typeof useNodesState>[2]
  onEdgesChange: ReturnType<typeof useEdgesState>[2]
  setNodes: ReturnType<typeof useNodesState>[1]
  setEdges: ReturnType<typeof useEdgesState>[1]
}

let idCounter = 0
const getId = () => `node_${++idCounter}`

function FlowCanvas({ nodes, edges, onNodesChange, onEdgesChange, setNodes, setEdges }: FlowCanvasProps) {
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  )

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault()
      const type = event.dataTransfer.getData('application/reactflow-type')
      const label = event.dataTransfer.getData('application/reactflow-label')
      if (!type) return

      const reactFlowBounds = (event.target as HTMLElement).closest('.react-flow')?.getBoundingClientRect()
      if (!reactFlowBounds) return

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      }

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label: label || type },
      }

      setNodes((nds) => [...nds, newNode])
    },
    [setNodes]
  )

  return (
    <div className="flow-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={customNodeTypes}
        fitView
        deleteKeyCode="Delete"
      >
        <Background gap={16} size={1} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  )
}

export default FlowCanvas
