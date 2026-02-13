import type { Node, Edge } from '@xyflow/react'

interface NodeData {
  label: string
  [key: string]: unknown
}

export function flowToYaml(nodes: Node[], edges: Edge[]): string {
  if (nodes.length === 0) return ''

  const startNodes = nodes.filter((n) => n.type === 'start')
  if (startNodes.length === 0) return '# No start node found'

  const lines: string[] = []
  lines.push('- route:')
  lines.push('    from:')
  lines.push('      uri: "direct:start"')
  lines.push('      steps:')

  const visited = new Set<string>()

  function getNextNodes(nodeId: string): Node[] {
    return edges
      .filter((e) => e.source === nodeId)
      .map((e) => nodes.find((n) => n.id === e.target))
      .filter((n): n is Node => n !== undefined)
  }

  function processNode(node: Node, indent: number) {
    if (visited.has(node.id)) return
    visited.add(node.id)

    const pad = ' '.repeat(indent)
    const data = node.data as NodeData

    switch (node.type) {
      case 'endpoint':
        lines.push(`${pad}- to:`)
        lines.push(`${pad}    uri: "${data.label || 'direct:endpoint'}"`)
        break
      case 'log':
        lines.push(`${pad}- log:`)
        lines.push(`${pad}    message: "${data.label || 'Log message'}"`)
        break
      case 'transform':
        lines.push(`${pad}- set-body:`)
        lines.push(`${pad}    simple: "${data.label || '${body}'}"`)
        break
      case 'condition':
        lines.push(`${pad}- choice:`)
        lines.push(`${pad}    when:`)
        lines.push(`${pad}      - simple: "\${header.type} == 'A'"`)
        lines.push(`${pad}        steps:`)
        lines.push(`${pad}          - log:`)
        lines.push(`${pad}              message: "Condition matched"`)
        break
      case 'end':
        lines.push(`${pad}- log:`)
        lines.push(`${pad}    message: "Route completed"`)
        return
    }

    const nextNodes = getNextNodes(node.id)
    for (const next of nextNodes) {
      processNode(next, indent)
    }
  }

  for (const startNode of startNodes) {
    const nextNodes = getNextNodes(startNode.id)
    for (const next of nextNodes) {
      processNode(next, 8)
    }
  }

  return lines.join('\n')
}
