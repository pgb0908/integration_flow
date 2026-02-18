import { Node, Edge } from '@xyflow/react';

// Camel Component Types
export type ComponentType = 'source' | 'processor' | 'sink' | 'kamelet';

// Component Category (for catalog)
export interface ComponentCategory {
  name: string;
  type: ComponentType;
  icon: string;
  description?: string;
}

// Camel Component Metadata
export interface CamelComponentData {
  componentName: string;  // e.g., 'http', 'kafka', 'direct'
  type: ComponentType;
  uri?: string;           // e.g., 'http://localhost:8080/api'
  parameters?: Record<string, any>;
  label?: string;
  icon?: string;

  // HTTP-specific fields
  method?: string;        // GET, POST, PUT, DELETE
  path?: string;

  // Transform-specific fields
  expression?: string;
  language?: string;      // simple, jsonpath, xpath

  // Log-specific fields
  message?: string;
  level?: string;         // INFO, DEBUG, WARN, ERROR
}

// Custom Node Data extending React Flow Node
export type CamelNode = Node<CamelComponentData>;

// Custom Edge Data
export interface CamelEdgeData {
  animated?: boolean;
  label?: string;
}

export type CamelEdge = Edge<CamelEdgeData>;

// Available Camel Components (simplified for testing)
export const CAMEL_COMPONENTS: ComponentCategory[] = [
  { name: 'HTTP', type: 'source', icon: '🌐', description: 'HTTP endpoint consumer' },
  { name: 'Transform', type: 'processor', icon: '🔄', description: 'Message transformation' },
  { name: 'Log', type: 'processor', icon: '📝', description: 'Log processor' },
];

// Helper function to get component color
export const getComponentColor = (type: ComponentType): string => {
  const colors: Record<ComponentType, string> = {
    source: '#50e3c2',
    processor: '#6c8cff',
    sink: '#ffb347',
    kamelet: '#c084fc',
  };
  return colors[type];
};
