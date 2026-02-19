import { useCallback, useState, useRef, DragEvent, useEffect } from 'react';
import axios from 'axios';
import {
  ReactFlow,
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
  textDim: '#555a72',
  accent: '#50e3c2',
};

const nodeTypes: NodeTypes = {
  source: SourceNode,
  processor: ProcessorNode,
  sink: SinkNode,
};

interface FlowDesignerProps {
  routeId?: number;
}

interface RouteInfo {
  id: number;
  name: string;
  status: string;
  yamlDsl?: string;
}

function FlowDesignerInner({ routeId }: FlowDesignerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<CamelNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CamelEdge>([]);
  const [catalogOpen, setCatalogOpen] = useState(true);
  const [selectedNode, setSelectedNode] = useState<CamelNode | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [saving, setSaving] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Load route info when routeId changes
  useEffect(() => {
    if (!routeId) {
      setRouteInfo(null);
      setNodes([]);
      setEdges([]);
      return;
    }
    axios.get(`/api/routes/${routeId}`)
      .then(res => {
        if (res.data.success) setRouteInfo(res.data.data);
      })
      .catch(err => console.error('Failed to load route:', err));
  }, [routeId]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: CamelNode) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => setSelectedNode(null), []);

  const onDragStart = (event: DragEvent, component: ComponentCategory) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(component));
  };

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const componentData = event.dataTransfer.getData('application/reactflow');
      if (!componentData || !reactFlowInstance) return;
      const component: ComponentCategory = JSON.parse(componentData);
      const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
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

  const handleUpdateNode = useCallback(
    (nodeId: string, data: Partial<CamelNode['data']>) => {
      setNodes((nds) =>
        nds.map((node) => node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node)
      );
      setSelectedNode((prev) =>
        prev?.id === nodeId ? { ...prev, data: { ...prev.data, ...data } } : prev
      );
    },
    [setNodes]
  );

  const handleSave = async () => {
    if (!routeId) return;
    setSaving(true);
    setSaveMsg('');
    try {
      // Build a simple YAML from nodes (minimal, for persistence)
      const yaml = buildYamlFromNodes(nodes, edges, routeId);
      await axios.put(`/api/routes/${routeId}`, { ...routeInfo, yamlDsl: yaml });
      setSaveMsg('Saved!');
      setTimeout(() => setSaveMsg(''), 2000);
    } catch (e) {
      setSaveMsg('Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeploy = async () => {
    if (!routeId) return;
    setDeploying(true);
    setSaveMsg('');
    try {
      await handleSave();
      await axios.post(`/api/routes/${routeId}/deploy`);
      setSaveMsg('Deployed!');
      setTimeout(() => setSaveMsg(''), 3000);
      // Refresh route info
      const res = await axios.get(`/api/routes/${routeId}`);
      if (res.data.success) setRouteInfo(res.data.data);
    } catch (e: any) {
      setSaveMsg(e.response?.data?.error || 'Deploy failed.');
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
      <ComponentCatalog
        isOpen={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        onDragStart={onDragStart}
      />

      <div ref={reactFlowWrapper} style={{ flex: 1, position: 'relative' }}>
        {/* Toolbar */}
        <div
          style={{
            position: 'absolute', top: 12, left: 12, zIndex: 10,
            display: 'flex', gap: 6, alignItems: 'center',
            background: COLORS.card, borderRadius: 8,
            padding: 6, border: `1px solid ${COLORS.border}`,
          }}
        >
          {!catalogOpen && (
            <button
              onClick={() => setCatalogOpen(true)}
              style={{
                padding: '6px 12px', borderRadius: 6, border: 'none',
                background: 'transparent', color: COLORS.text, fontSize: 11, cursor: 'pointer',
              }}
            >
              📦 Catalog
            </button>
          )}

          {routeInfo && (
            <span style={{ fontSize: 12, color: COLORS.text, padding: '0 8px', borderLeft: `1px solid ${COLORS.border}` }}>
              <span style={{ color: COLORS.textDim }}>Route: </span>
              <strong>{routeInfo.name}</strong>
              <span style={{ marginLeft: 8, fontSize: 11, color: routeInfo.status === 'running' ? COLORS.accent : COLORS.textDim }}>
                ● {routeInfo.status}
              </span>
            </span>
          )}

          {routeId && (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: '6px 12px', borderRadius: 6, border: `1px solid ${COLORS.border}`,
                  background: 'transparent', color: COLORS.text, fontSize: 11,
                  cursor: saving ? 'not-allowed' : 'pointer',
                }}
              >
                💾 {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleDeploy}
                disabled={deploying}
                style={{
                  padding: '6px 12px', borderRadius: 6, border: 'none',
                  background: deploying ? '#4a5e99' : COLORS.primary,
                  color: '#fff', fontSize: 11,
                  cursor: deploying ? 'not-allowed' : 'pointer',
                }}
              >
                🚀 {deploying ? 'Deploying...' : 'Deploy'}
              </button>
            </>
          )}

          {saveMsg && (
            <span style={{ fontSize: 12, color: saveMsg.includes('fail') ? '#ff6b6b' : COLORS.accent, padding: '0 8px' }}>
              {saveMsg}
            </span>
          )}
        </div>

        {!routeId && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            zIndex: 5, textAlign: 'center', color: COLORS.textDim, pointerEvents: 'none',
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔧</div>
            <div style={{ fontSize: 14 }}>No route selected</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Open a route from the Routes page to start designing</div>
          </div>
        )}

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
          <Controls style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8 }} />
          <MiniMap
            nodeColor={(node) => getComponentColor((node as CamelNode).data.type)}
            style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8 }}
          />
        </ReactFlow>
      </div>

      <PropertyPanel
        selectedNode={selectedNode}
        onClose={() => setSelectedNode(null)}
        onUpdateNode={handleUpdateNode}
      />
    </div>
  );
}

// Minimal YAML builder from React Flow nodes
function buildYamlFromNodes(nodes: CamelNode[], _edges: CamelEdge[], routeId: number): string {
  const source = nodes.find(n => n.data.type === 'source');
  const processors = nodes.filter(n => n.data.type === 'processor');
  const sinks = nodes.filter(n => n.data.type === 'sink');

  if (!source) {
    return `- route:\n    id: cp-route-${routeId}\n    from:\n      uri: timer:placeholder?period=5000\n      steps:\n        - log:\n            message: "Route not configured"`;
  }

  const sourceUri = source.data.uri || `${source.data.componentName}:placeholder`;
  let steps = '';

  for (const p of processors) {
    if (p.data.componentName === 'log' || p.data.label?.toLowerCase().includes('log')) {
      steps += `        - log:\n            message: "${p.data.message || 'Processing message'}"\n`;
    } else {
      steps += `        - log:\n            message: "${p.data.label || p.data.componentName}"\n`;
    }
  }

  for (const s of sinks) {
    const sinkUri = s.data.uri || `${s.data.componentName}:placeholder`;
    steps += `        - to:\n            uri: ${sinkUri}\n`;
  }

  if (!steps) {
    steps = `        - log:\n            message: "Route running"\n`;
  }

  return `- route:\n    id: cp-route-${routeId}\n    from:\n      uri: ${sourceUri}\n      steps:\n${steps}`;
}

export default function FlowDesigner({ routeId }: FlowDesignerProps) {
  return (
    <ReactFlowProvider>
      <FlowDesignerInner routeId={routeId} />
    </ReactFlowProvider>
  );
}
