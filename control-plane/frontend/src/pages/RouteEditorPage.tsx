import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useNodesState, useEdgesState, type Node, type Edge } from '@xyflow/react'
import FlowCanvas from '../components/flow/FlowCanvas'
import ToolboxPanel from '../components/flow/ToolboxPanel'
import { flowToYaml } from '../components/flow/flowToYaml'
import { routeApi } from '../api/client'
import { Save, Rocket, Code, ArrowLeft } from 'lucide-react'

const defaultNodes: Node[] = [
  { id: 'start-1', type: 'start', position: { x: 250, y: 50 }, data: { label: 'Start' } },
]

function RouteEditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = !id

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [showYaml, setShowYaml] = useState(false)
  const [yaml, setYaml] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (id) {
      routeApi.getById(id).then((res) => {
        setName(res.data.name || '')
        setDescription(res.data.description || '')
      })
    }
  }, [id])

  const generateYaml = useCallback(() => {
    const generated = flowToYaml(nodes, edges)
    setYaml(generated)
    return generated
  }, [nodes, edges])

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Please enter a route name')
      return
    }
    setSaving(true)
    const yamlDsl = generateYaml()
    try {
      if (isNew) {
        const res = await routeApi.create({ name, description, yamlDsl })
        navigate(`/routes/${res.data.id}/edit`, { replace: true })
      } else {
        await routeApi.update(id, { name, description, yamlDsl })
      }
      alert('Route saved!')
    } catch {
      alert('Failed to save route')
    }
    setSaving(false)
  }

  const handleDeploy = async () => {
    if (isNew || !id) {
      alert('Save the route first before deploying')
      return
    }
    try {
      await routeApi.deploy(id)
      alert('Route deployed successfully!')
    } catch {
      alert('Deployment failed. Is Data-Plane running?')
    }
  }

  const handleShowYaml = () => {
    generateYaml()
    setShowYaml(!showYaml)
  }

  return (
    <div className="editor-page">
      <div className="editor-toolbar">
        <button className="btn btn-sm" onClick={() => navigate('/routes')}>
          <ArrowLeft size={16} /> Back
        </button>
        <div className="editor-inputs">
          <input
            type="text"
            className="editor-name-input"
            placeholder="Route name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="editor-desc-input"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="editor-actions">
          <button className="btn btn-sm" onClick={handleShowYaml}>
            <Code size={16} /> YAML
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save'}
          </button>
          <button className="btn btn-deploy btn-sm" onClick={handleDeploy} disabled={isNew}>
            <Rocket size={16} /> Deploy
          </button>
        </div>
      </div>

      <div className="editor-content">
        <ToolboxPanel />
        <FlowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          setNodes={setNodes}
          setEdges={setEdges}
        />
      </div>

      {showYaml && (
        <div className="yaml-overlay" onClick={() => setShowYaml(false)}>
          <div className="yaml-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Generated YAML DSL</h3>
            <pre className="yaml-content">{yaml || '# Design your flow first'}</pre>
            <button className="btn btn-sm" onClick={() => setShowYaml(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default RouteEditorPage
