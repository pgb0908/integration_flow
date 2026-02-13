import { type DragEvent } from 'react'
import { toolboxItems } from './nodeTypes'

function ToolboxPanel() {
  const onDragStart = (event: DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow-type', nodeType)
    event.dataTransfer.setData('application/reactflow-label', label)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="toolbox-panel">
      <h3 className="toolbox-title">Components</h3>
      <div className="toolbox-items">
        {toolboxItems.map((item) => (
          <div
            key={item.type}
            className="toolbox-item"
            draggable
            onDragStart={(e) => onDragStart(e, item.type, item.label)}
          >
            <div className="toolbox-item-icon" style={{ color: item.color }}>
              <item.icon size={18} />
            </div>
            <span className="toolbox-item-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ToolboxPanel
