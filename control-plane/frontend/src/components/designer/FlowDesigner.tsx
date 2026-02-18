import { useCallback, useState, useRef, DragEvent } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  Connection,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import SourceNode from './nodes/SourceNode';
import ProcessorNode from './nodes/ProcessorNode';
import SinkNode from './nodes/SinkNode';
import ComponentCatalog from './panels/ComponentCatalog';
import PropertyPanel from './panels/PropertyPanel';
import { CamelNode, CamelEdge, ComponentCategory, getComponentColor } from './types/flow.types';

const COLORS = {
  bg: '#0f1117',
  card: '#1e2035',
  border: '#2a2d45',
  primary: '#6c8cff',
  text: '#e8eaf0',
};

// Define custom node types
const nodeTypes: NodeTypes = {
  source: SourceNode,
  processor: ProcessorNode,
  sink: SinkNode,
};

// Initial nodes for demo
const initialNodes: CamelNode[] = [
  {
    id: 'http-1',
    type: 'source',
    position: { x: 100, y: 100 },
    data: { componentName: 'http', type: 'source', label: 'HTTP Endpoint', icon: '🌐', uri: 'http://localhost:8080/api' },
  },
  {
    id: 'transform-1',
    type: 'processor',
    position: { x: 350, y: 50 },
    data: { componentName: 'transform', type: 'processor', label: 'JSON Transform', icon: '🔄' },
  },
  {
    id: 'kafka-1',
    type: 'sink',
    position: { x: 600, y: 100 },
    data: { componentName: 'kafka', type: 'sink', label: 'Kafka Producer', icon: '📨', uri: 'kafka:orders' },
  },
];

const initialEdges: CamelEdge[] = [
  { id: 'e1-2', source: 'http-1', target: 'transform-1', animated: true },
  { id: 'e2-3', source: 'transform-1', target: 'kafka-1', animated: true },
];

interface FlowDesignerProps {
  routeId?: number;
}

function FlowDesignerInner({ routeId }: FlowDesignerProps) {
  // TODO: Use routeId to load route data from API
  // For now, we'll use the initial demo nodes
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [catalogOpen, setCatalogOpen] = useState(true);
  const [selectedNode, setSelectedNode] = useState<CamelNode | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Handle connection between nodes
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = { ...params, animated: true };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // Handle node selection
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node as CamelNode);
  }, []);

  // Handle pane click (deselect)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Handle drag start from catalog
  const onDragStart = (event: DragEvent, component: ComponentCategory) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(component));
  };

  // Handle drag over
  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop
  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const componentData = event.dataTransfer.getData('application/reactflow');
      if (!componentData || !reactFlowInstance) return;

      const component: ComponentCategory = JSON.parse(componentData);
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: CamelNode = {
        id: `${component.type}-${Date.now()}`,
        type: component.type,
        position,
        data: {
          componentName: component.name.toLowerCase().replace(/\s+/g, '-'),
          type: component.type,
          label: component.name,
          icon: component.icon,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  // Handle node update from PropertyPanel
  const handleUpdateNode = useCallback(
    (nodeId: string, data: Partial<CamelNode['data']>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...data } }
            : node
        )
      );
      // Update selected node
      setSelectedNode((prev) =>
        prev?.id === nodeId ? { ...prev, data: { ...prev.data, ...data } } : prev
      );
    },
    [setNodes]
  );

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
      {/* Component Catalog */}
      <ComponentCatalog
        isOpen={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        onDragStart={onDragStart}
      />

      {/* Flow Canvas */}
      <div ref={reactFlowWrapper} style={{ flex: 1, position: 'relative' }}>
        {/* Toolbar */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 10,
            display: 'flex',
            gap: 6,
            background: COLORS.card,
            borderRadius: 8,
            padding: 6,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          {!catalogOpen && (
            <button
              onClick={() => setCatalogOpen(true)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: 'none',
                background: 'transparent',
                color: COLORS.text,
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              📦 Catalog
            </button>
          )}
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onInit={setReactFlowInstance}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          fitView
          style={{ background: COLORS.bg }}
        >
          <Background gap={24} size={1} color={COLORS.border + '60'} />
          <Controls
            style={{
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 8,
            }}
          />
          <MiniMap
            nodeColor={(node) => {
              const camelNode = node as CamelNode;
              return getComponentColor(camelNode.data.type);
            }}
            style={{
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 8,
            }}
          />
        </ReactFlow>
      </div>

      {/* Property Panel */}
      <PropertyPanel
        selectedNode={selectedNode}
        onClose={() => setSelectedNode(null)}
        onUpdateNode={handleUpdateNode}
      />
    </div>
  );
}

export default function FlowDesigner({ routeId }: FlowDesignerProps) {
  return (
    <ReactFlowProvider>
      <FlowDesignerInner routeId={routeId} />
    </ReactFlowProvider>
  );
}
